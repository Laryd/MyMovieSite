// eslint-disable-next-line @typescript-eslint/no-require-imports
const StripeLib = require('stripe')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe: any = new StripeLib(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-12-18.acacia',
})

export type PlanKey = 'FREE' | 'BASIC' | 'PREMIUM'
