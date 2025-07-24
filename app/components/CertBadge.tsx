import { cn } from '@/lib/utils'

const COLORS: Record<string, string> = {
  G:     'border-green-600/50 text-green-400 bg-green-900/20',
  PG:    'border-yellow-600/50 text-yellow-400 bg-yellow-900/20',
  'PG-13': 'border-orange-600/50 text-orange-400 bg-orange-900/20',
  R:     'border-red-600/50 text-red-400 bg-red-900/20',
  'NC-17': 'border-red-700/50 text-red-500 bg-red-900/30',
  TV14:  'border-orange-600/50 text-orange-400 bg-orange-900/20',
  TVMA:  'border-red-600/50 text-red-400 bg-red-900/20',
  TVY:   'border-green-600/50 text-green-400 bg-green-900/20',
}

export default function CertBadge({ cert }: { cert: string }) {
  if (!cert) return null
  return (
    <span className={cn(
      'inline-flex items-center text-xs font-bold px-2.5 py-1 rounded-lg border tracking-wider',
      COLORS[cert] ?? 'border-zinc-600/50 text-zinc-400 bg-zinc-800/40'
    )}>
      {cert}
    </span>
  )
}
