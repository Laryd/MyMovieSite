import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { stripe, PLANS, type PlanKey } from '@/lib/stripe'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { plan } = await req.json() as { plan: PlanKey }
  const planData = PLANS[plan]
  if (!planData || !planData.priceId) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const userId = (session.user as { id: string }).id
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const sub = await prisma.subscription.findUnique({ where: { userId } })

  let customerId = sub?.stripeCustomerId
  if (!customerId) {
    const customer = await stripe.customers.create({ email: user.email!, name: user.name ?? undefined })
    customerId = customer.id
  }

  const checkoutSession = await stripe.checkout.sessions.create({
    customer: customerId,
    line_items: [{ price: planData.priceId, quantity: 1 }],
    mode: 'subscription',
    success_url: `${process.env.NEXTAUTH_URL}/account?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/subscription?cancelled=1`,
    metadata: { userId, plan },
  })

  return NextResponse.json({ url: checkoutSession.url })
}
