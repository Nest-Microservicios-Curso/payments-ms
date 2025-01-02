import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET_KEY);

  async createSession(paymentSessionDto: PaymentSessionDto) {
    try {
      const { currency, items } = paymentSessionDto;

      const lineItems = items.map((item) => {
        return {
          price_data: {
            currency: currency,
            product_data: {
              name: item.name,
            },
            unit_amount: Math.round(item.unit_price * 100), //* 2000 = 2000 / 100 = 20.00 = 20USD
          },
          quantity: item.quantity,
        };
      });

      const session = await this.stripe.checkout.sessions.create({
        // TODO: Acá enviaré el ID de la Orden
        payment_intent_data: {
          metadata: {},
        },
        line_items: lineItems,
        mode: 'payment',
        success_url: 'http://localhost:3020/api/payments/payment-success',
        cancel_url: 'http://localhost:3020/api/payments/payment-cancelled',
      });
      return session;
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }

  async paymentWebhook(request: Request, response: Response) {
    try {
      //* ver documentación: https://docs.stripe.com/webhooks/quickstart
      let event = request.body;
      const signature = request.headers['stripe-signature'];

      try {
        event = this.stripe.webhooks.constructEvent(
          request['rawBody'],
          signature,
          envs.STRIPE_WEBHOOK_SECRET,
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log(
            `PaymentIntent for ${paymentIntent.amount} was successful!`,
          );
          // Then define and call a method to handle the successful payment intent.
          // handlePaymentIntentSucceeded(paymentIntent);
          break;
        case 'payment_method.attached':
          const paymentMethod = event.data.object;
          // Then define and call a method to handle the successful attachment of a PaymentMethod.
          // handlePaymentMethodAttached(paymentMethod);
          break;
        default:
          // Unexpected event type
          console.log(`Unhandled event type ${event.type}.`);
      }

      // Return a 200 response to acknowledge receipt of the event
      response.send();
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
