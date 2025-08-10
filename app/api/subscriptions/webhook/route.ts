import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/db'

type StripeObj = Record<string, unknown>

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as StripeObj
        const metadata = session.metadata as Record<string, string> | null
        const { userId, plan } = metadata ?? {}
        if (!userId || !plan) break

        const stripeSubId = session.subscription as string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubId) as any

        await prisma.subscription.upsert({
          where: { userId },
          create: {
            userId,
            plan: plan as 'FREE' | 'BASIC' | 'PREMIUM',
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: stripeSubId,
            stripePriceId: stripeSub.items.data[0].price.id,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          },
          update: {
            plan: plan as 'FREE' | 'BASIC' | 'PREMIUM',
            status: 'ACTIVE',
            stripeCustomerId: session.customer as string,
            stripeSubscriptionId: stripeSubId,
            stripePriceId: stripeSub.items.data[0].price.id,
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          },
        })
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as StripeObj
        const subId = invoice.subscription as string
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const stripeSub = await stripe.subscriptions.retrieve(subId) as any

        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: subId },
          data: {
            status: 'ACTIVE',
            currentPeriodEnd: new Date(stripeSub.current_period_end * 1000),
          },
        })
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as StripeObj
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: invoice.subscription as string },
          data: { status: 'PAST_DUE' },
        })
        break
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as StripeObj
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id as string },
          data: { status: 'CANCELLED', plan: 'FREE' },
        })
        break
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as StripeObj
        const status = sub.status as string
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: sub.id as string },
          data: {
            status: status === 'active' ? 'ACTIVE' : status === 'past_due' ? 'PAST_DUE' : 'CANCELLED',
            cancelAtPeriodEnd: sub.cancel_at_period_end as boolean,
            currentPeriodEnd: new Date((sub.current_period_end as number) * 1000),
          },
        })
        break
      }
    }
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}
