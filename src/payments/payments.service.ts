import { Injectable } from '@nestjs/common';
import { envs } from 'src/config';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET_KEY);
  async createSession() {
    try {
      const session = await this.stripe.checkout.sessions.create({
        // TODO: Acá enviaré el ID de la Orden
        payment_intent_data: {
          metadata: {},
        },
        // TODO: enviar los items(products) que se comprarán
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Buy me a pizza',
              },
              unit_amount: 2000, //* 2000 = 2000 / 100 = 20.00 = 20USD
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: 'http://localhost:3020/api/payments/payment-success',
        cancel_url: 'http://localhost:3020/api/payments/payment-cancelled',
      });
      return session;
    } catch (error) {
      return {
        status: 'ERROR',
        message: error,
      };
    }
  }
}
