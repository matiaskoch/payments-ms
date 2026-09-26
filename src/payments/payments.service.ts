import { Injectable, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET;
    if (!secretKey) {
      throw new Error('Missing STRIPE_SECRET environment variable');
    }
    this.stripe = new Stripe(secretKey);
  }

  async createPaymentSession(
    dto: CreatePaymentSessionDto,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const { orderId, currency, items } = dto;
    const paymentSession = await this.stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: items.map((item) => ({
    price_data: {
      currency,
      unit_amount: Math.round(item.price * 100),
      product_data: { name: item.name },
    },
    quantity: item.quantity,
  })),
  mode: 'payment',
  success_url: process.env.STRIPE_SUCCESS_URL,
  cancel_url: process.env.STRIPE_CANCEL_URL,
  payment_intent_data: {
    metadata: { orderId },
  },
});

    return paymentSession;
  }
  handleWebhook(signature: string, rawBody: Buffer) {
    const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    if (!endpointSecret) {
      throw new BadRequestException(
        'Missing STRIPE_ENDPOINT_SECRET environment variable',
      );
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        endpointSecret,
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unknown webhook error';
      
      throw new BadRequestException(`Webhook Error: ${message}`);
    }

    switch (event.type) {
      case 'charge.succeeded': {
        const charge = event.data.object as Stripe.Charge;
        console.log('Pago confirmado, orderId:', charge.metadata.orderId);
        break;
      }
      default:
        console.log('Evento no manejado:', event.type);
    }

    return { received: true };
  }
}