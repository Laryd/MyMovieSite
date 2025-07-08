import Image from 'next/image'
import { IMG } from '@/app/lib/tmdb'
import type { WatchProviderResult } from '@/app/lib/tmdb'

interface Props {
  providers: WatchProviderResult | null
}

export default function WatchProviders({ providers }: Props) {
  if (!providers) return null

  const streaming = providers.flatrate?.slice(0, 6) ?? []
  const rent = providers.rent?.slice(0, 4) ?? []
  const buy = providers.buy?.slice(0, 4) ?? []

  if (!streaming.length && !rent.length && !buy.length) return null

  return (
    <div className="mt-8 p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60">
      <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Where to Watch</h3>

      {streaming.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Stream</p>
          <div className="flex flex-wrap gap-2">
            {streaming.map(p => (
              <div key={p.provider_id} className="relative group">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-zinc-700/50 group-hover:ring-violet-500/50 transition-all">
                  <Image
                    src={`${IMG}/w92${p.logo_path}`}
                    alt={p.provider_name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-zinc-800 text-xs text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {p.provider_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {rent.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Rent</p>
          <div className="flex flex-wrap gap-2">
            {rent.map(p => (
              <div key={p.provider_id} className="relative group">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-zinc-700/50 group-hover:ring-violet-500/50 transition-all">
                  <Image
                    src={`${IMG}/w92${p.logo_path}`}
                    alt={p.provider_name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-zinc-800 text-xs text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {p.provider_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {buy.length > 0 && (
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">Buy</p>
          <div className="flex flex-wrap gap-2">
            {buy.map(p => (
              <div key={p.provider_id} className="relative group">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-1 ring-zinc-700/50 group-hover:ring-violet-500/50 transition-all">
                  <Image
                    src={`${IMG}/w92${p.logo_path}`}
                    alt={p.provider_name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 bg-zinc-800 text-xs text-white rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {p.provider_name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
