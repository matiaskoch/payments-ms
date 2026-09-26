# Payments MS — Sesiones de pago y webhook Stripe

Microservicio NestJS que crea sesiones de pago con Stripe Checkout y recibe
la confirmación del cobro vía webhook.

## Cómo levantar el proyecto

1. Clonar el repositorio
2. `npm install`
3. Copiar `.env.template` a `.env` y completar las variables:
   - `STRIPE_SECRET`: tu clave secreta de test (dashboard.stripe.com/test/apikeys)
   - `STRIPE_ENDPOINT_SECRET`: se obtiene corriendo `stripe listen` (ver abajo)
4. `npm run start:dev`
5. El server levanta en `http://localhost:3003`

## Rutas principales

### Crear sesión de pago
`POST /payments/create-payment-session`

Body:
```json
{
  "orderId": "ord-1",
  "currency": "usd",
  "items": [{ "name": "Producto", "price": 20, "quantity": 1 }]
}
```
Devuelve la sesión de Stripe (incluye `url` para redirigir al Checkout).

### Webhook de Stripe
`POST /payments/webhook`

Recibe eventos de Stripe. Verifica la firma con `stripe-signature` y procesa
`charge.succeeded`, extrayendo el `orderId` desde la metadata.

## Probar en local (webhook)

```bash
stripe listen --forward-to localhost:3003/payments/webhook --all-snapshot --api-key TU_STRIPE_SECRET
```

Usar el `whsec_...` impreso por ese comando como `STRIPE_ENDPOINT_SECRET`.
Pagar con la tarjeta de prueba `4242 4242 4242 4242`.