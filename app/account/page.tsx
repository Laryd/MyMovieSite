import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PLANS } from '@/lib/stripe'
import { Crown, Zap, Sparkles, CreditCard, Calendar, AlertTriangle } from 'lucide-react'
import AccountActions from './AccountActions'

const PlanIcon: Record<string, typeof Sparkles> = { FREE: Sparkles, BASIC: Zap, PREMIUM: Crown }

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/login?callbackUrl=/account')

  const userId = (session.user as { id: string }).id
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  })

  if (!user) redirect('/auth/login')

  const sub = user.subscription
  const plan: keyof typeof PLANS = (sub?.plan as keyof typeof PLANS) ?? 'FREE'
  const PIcon = PlanIcon[plan]
  const planData = PLANS[plan]

  return (
    <div className="min-h-screen pb-20 pt-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-black text-white">My Account</h1>

        {/* Profile */}
        <div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center text-2xl font-black text-violet-300 flex-shrink-0">
            {user.name?.[0]?.toUpperCase() ?? user.email[0].toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{user.name ?? 'User'}</p>
            <p className="text-zinc-400 text-sm">{user.email}</p>
            <p className="text-zinc-600 text-xs mt-0.5">Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
        </div>

        {/* Subscription */}
        <div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">Subscription</h2>
            <div className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${
              plan === 'PREMIUM' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : plan === 'BASIC' ? 'bg-violet-600/20 text-violet-300 border border-violet-600/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700/40'
            }`}>
              <PIcon className="w-3 h-3" />
              {planData.name}
            </div>
          </div>

          {sub?.cancelAtPeriodEnd && (
            <div className="flex items-start gap-2.5 bg-amber-900/20 border border-amber-700/30 rounded-xl px-4 py-3 text-sm text-amber-300">
              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              Your subscription will cancel on {sub.currentPeriodEnd ? new Date(sub.currentPeriodEnd).toLocaleDateString('en-US', { dateStyle: 'long' }) : 'period end'}.
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            {sub?.currentPeriodEnd && (
              <div className="bg-zinc-800/60 rounded-xl p-4">
                <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {sub.cancelAtPeriodEnd ? 'Cancels' : 'Renews'}
                </div>
                <p className="text-white font-semibold text-sm">
                  {new Date(sub.currentPeriodEnd).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                </p>
              </div>
            )}
            <div className="bg-zinc-800/60 rounded-xl p-4">
              <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1">
                <CreditCard className="w-3.5 h-3.5" />
                Monthly cost
              </div>
              <p className="text-white font-semibold text-sm">
                {planData.price === 0 ? 'Free' : `$${planData.price}/mo`}
              </p>
            </div>
          </div>

          <AccountActions plan={plan} hasSub={!!sub?.stripeSubscriptionId} />
        </div>

        {/* Plan features */}
        <div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-6">
          <h2 className="text-white font-bold mb-4">Your Plan Includes</h2>
          <ul className="space-y-2">
            {(planData.features as readonly string[]).map((f: string) => (
              <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500 flex-shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
