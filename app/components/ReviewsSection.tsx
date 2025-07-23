'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Star, ChevronDown, ChevronUp, MessageSquare } from 'lucide-react'
import type { Review } from '@/app/lib/tmdb'
import { IMG } from '@/app/lib/tmdb'

interface Props {
  reviews: Review[]
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = review.content.length > 300
  const content = expanded || !isLong ? review.content : review.content.slice(0, 300) + '…'
  const avatarPath = review.author_details.avatar_path
  const avatarUrl = avatarPath
    ? avatarPath.startsWith('/https')
      ? avatarPath.slice(1)
      : `${IMG}/w45${avatarPath}`
    : null
  const date = new Date(review.created_at).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  const rating = review.author_details.rating

  return (
    <div className="p-5 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700/50 transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-zinc-800 flex-shrink-0 ring-2 ring-zinc-700/50">
          {avatarUrl ? (
            <Image src={avatarUrl} alt={review.author} fill sizes="36px" className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-sm font-bold text-zinc-400">
              {review.author.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span className="text-sm font-semibold text-white truncate">{review.author}</span>
            <span className="text-xs text-zinc-500 flex-shrink-0">{date}</span>
          </div>
          {rating !== null && (
            <div className="flex items-center gap-1 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < Math.round(rating / 2) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`}
                />
              ))}
              <span className="text-xs text-zinc-500 ml-1">{rating}/10</span>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{content}</p>
      {isLong && (
        <button
          onClick={() => setExpanded(v => !v)}
          className="mt-2 flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors"
        >
          {expanded ? <><ChevronUp className="w-3 h-3" />Show less</> : <><ChevronDown className="w-3 h-3" />Read more</>}
        </button>
      )}
    </div>
  )
}

export default function ReviewsSection({ reviews }: Props) {
  const [showAll, setShowAll] = useState(false)
  if (!reviews.length) return null
  const visible = showAll ? reviews : reviews.slice(0, 3)

  return (
    <div className="mt-14">
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="w-5 h-5 text-violet-400" />
        <h2 className="text-xl font-bold text-white">Reviews</h2>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
          {reviews.length}
        </span>
      </div>
      <div className="space-y-4">
        {visible.map(r => <ReviewCard key={r.id} review={r} />)}
      </div>
      {reviews.length > 3 && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="mt-4 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full bg-zinc-800/60 hover:bg-zinc-800"
        >
          {showAll
            ? <><ChevronUp className="w-4 h-4" />Show less</>
            : <><ChevronDown className="w-4 h-4" />Show all {reviews.length} reviews</>}
        </button>
      )}
    </div>
  )
}
