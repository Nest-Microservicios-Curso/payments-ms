import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

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
  paymentSession(@Body() paymentSessionDto: PaymentSessionDto) {
    return this.paymentsService.createSession(paymentSessionDto);
  }

  @Post('payment-webhook')
  paymentWebhook(@Req() request: Request, @Res() response: Response) {
    return this.paymentsService.paymentWebhook(request, response);
  }
}
