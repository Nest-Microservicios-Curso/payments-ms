import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('payment-success')
  paymentSuccess() {
    return {
      ok: true,
      message: 'Payment successful',
    };
  }

  @Get('payment-cancelled')
  paymentCancelled() {
    return {
      ok: false,
      message: 'Payment cancelled',
    };
  }

  @Post('payment-session')
  paymentSession() {
    return this.paymentsService.createSession();
  }

  @Post('payment-webhook')
  paymentWebhook() {
    return {
      message: 'Payment webhook',
    };
  }
}
