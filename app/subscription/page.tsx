import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { PLANS } from '@/lib/stripe'
import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import PlanButton from './PlanButton'

const icons = { FREE: Sparkles, BASIC: Zap, PREMIUM: Crown }
const highlights = { FREE: false, BASIC: true, PREMIUM: false }

export default async function SubscriptionPage() {
  const session = await getServerSession(authOptions)
  const userId = (session?.user as { id?: string })?.id

  const sub = userId
    ? await prisma.subscription.findUnique({ where: { userId } })
    : null

  const currentPlan = sub?.plan ?? 'FREE'

  return (
    <div className="min-h-screen pb-20 pt-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
            Choose your plan
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Unlock more features and enjoy an enhanced experience across movies and TV.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
            const Icon = icons[key]
            const highlighted = highlights[key]
            const isCurrentPlan = currentPlan === key

            return (
              <div
                key={key}
                className={`relative rounded-2xl p-6 flex flex-col gap-6 transition-all ${
                  highlighted
                    ? 'bg-violet-600/10 border-2 border-violet-600/60 shadow-2xl shadow-violet-900/20'
                    : 'bg-zinc-900/60 border border-zinc-700/40'
                }`}
              >
                {highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}

                <div>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${highlighted ? 'bg-violet-600' : 'bg-zinc-800'}`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">{plan.name}</h2>
                  <div className="mt-2 flex items-end gap-1">
                    <span className="text-4xl font-black text-white">${plan.price}</span>
                    {plan.price > 0 && <span className="text-zinc-400 mb-1">/mo</span>}
                    {plan.price === 0 && <span className="text-zinc-400 mb-1">forever</span>}
                  </div>
                </div>

                <ul className="space-y-2.5 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlighted ? 'text-violet-400' : 'text-zinc-500'}`} />
                      <span className="text-zinc-300">{f}</span>
                    </li>
                  ))}
                </ul>

                <PlanButton
                  planKey={key}
                  planName={plan.name}
                  price={plan.price}
                  isCurrentPlan={isCurrentPlan}
                  isLoggedIn={!!session}
                  highlighted={highlighted}
                  hasSub={!!sub?.stripeSubscriptionId}
                />
              </div>
            )
          })}
        </div>

        <p className="text-center text-zinc-600 text-xs mt-10">
          All paid plans include a 7-day free trial. Cancel anytime. Prices in USD.
        </p>
      </div>
    </div>
  )
}
