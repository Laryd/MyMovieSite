// eslint-disable-next-line @typescript-eslint/no-require-imports
const StripeLib = require('stripe')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const stripe: any = new StripeLib(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2024-12-18.acacia',
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Browse movies & TV shows',
      'Search & discover',
      'View trailers',
      'Basic watchlist (10 items)',
    ],
    limit: 10,
  },
  BASIC: {
    name: 'Basic',
    price: 4.99,
    priceId: process.env.STRIPE_PRICE_BASIC ?? '',
    features: [
      'Everything in Free',
      'Unlimited watchlist',
      'HD streaming links',
      'Ad-free experience',
      'Early access to new features',
    ],
    limit: Infinity,
  },
} as const

export type PlanKey = keyof typeof PLANS
