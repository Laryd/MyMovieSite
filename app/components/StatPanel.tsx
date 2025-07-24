import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface Props {
  budget: number
  revenue: number
}

function fmt(n: number) {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(2)}B`
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  return `$${n.toLocaleString()}`
}

export default function StatPanel({ budget, revenue }: Props) {
  if (!budget && !revenue) return null
  const profit = revenue - budget
  const roi = budget > 0 ? ((profit / budget) * 100) : null

  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
      {budget > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Budget</p>
          <p className="text-lg font-bold text-white">{fmt(budget)}</p>
        </div>
      )}
      {revenue > 0 && (
        <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Box Office</p>
          <p className="text-lg font-bold text-white">{fmt(revenue)}</p>
        </div>
      )}
      {budget > 0 && revenue > 0 && (
        <div className={`p-4 rounded-2xl border ${profit >= 0 ? 'bg-green-950/20 border-green-800/30' : 'bg-red-950/20 border-red-800/30'}`}>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Profit</p>
          <div className="flex items-center gap-1.5">
            {profit > 0
              ? <TrendingUp className="w-4 h-4 text-green-400" />
              : profit < 0
              ? <TrendingDown className="w-4 h-4 text-red-400" />
              : <Minus className="w-4 h-4 text-zinc-400" />}
            <p className={`text-lg font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {fmt(Math.abs(profit))}
            </p>
          </div>
          {roi !== null && (
            <p className={`text-xs mt-0.5 ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {roi >= 0 ? '+' : ''}{roi.toFixed(0)}% ROI
            </p>
          )}
        </div>
      )}
    </div>
  )
}
