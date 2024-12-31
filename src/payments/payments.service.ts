import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';

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
}
