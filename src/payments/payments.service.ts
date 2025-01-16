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
      const { currency, items, orderId } = paymentSessionDto;

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
        payment_intent_data: {
          metadata: {
            orderId: orderId,
          },
        },
        line_items: lineItems,
        mode: 'payment',
        success_url: envs.STRIPE_SUCCESS_URL,
        cancel_url: envs.STRIPE_CANCEL_URL,
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
        console.log(`⚠️ Webhook signature verification failed.`, err.message);
        return response.sendStatus(400);
      }
      switch (event.type) {
        case 'charge.succeeded':
          console.log(`OK: ${event.type}. Succesfully!`);
          const chargeSucceeded = event.data.object;
          console.log({
            metadata: chargeSucceeded.metadata,
          });

          break;
        default:
          console.log(`!!Unhandled event type ${event.type}.`);
      }
      response.send();
    } catch (error) {
      return new InternalServerErrorException(error);
    }
  }
}
