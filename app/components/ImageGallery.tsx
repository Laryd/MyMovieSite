'use client'
import { useState } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react'
import { IMG } from '@/app/lib/tmdb'
import type { MediaImage } from '@/app/lib/tmdb'

interface Props {
  images: MediaImage[]
  title: string
}

export default function ImageGallery({ images, title }: Props) {
  const [lightbox, setLightbox] = useState<number | null>(null)
  const top = images.slice(0, 12)
  if (!top.length) return null

  const open = (i: number) => setLightbox(i)
  const close = () => setLightbox(null)
  const prev = () => setLightbox(i => i !== null ? (i - 1 + top.length) % top.length : 0)
  const next = () => setLightbox(i => i !== null ? (i + 1) % top.length : 0)

  return (
    <>
      <div className="mt-14">
        <div className="flex items-center gap-2 mb-5">
          <LayoutGrid className="w-5 h-5 text-violet-400" />
          <h2 className="text-xl font-bold text-white">Photos</h2>
          <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
            {images.length}
          </span>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {top.map((img, i) => (
            <button
              key={img.file_path}
              onClick={() => open(i)}
              className="relative aspect-video rounded-lg overflow-hidden bg-zinc-800/80 group"
            >
              <Image
                src={`${IMG}/w300${img.file_path}`}
                alt={`${title} — photo ${i + 1}`}
                fill
                sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
          onClick={close}
        >
          <button onClick={close} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); prev() }} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors z-10">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div
            className="relative w-full max-w-5xl mx-4 aspect-video"
            onClick={e => e.stopPropagation()}
          >
            <Image
              src={`${IMG}/original${top[lightbox].file_path}`}
              alt={`${title} — photo ${lightbox + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>
          <button onClick={(e) => { e.stopPropagation(); next() }} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-800/80 flex items-center justify-center text-white hover:bg-zinc-700 transition-colors z-10">
            <ChevronRight className="w-5 h-5" />
          </button>
          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-zinc-500">
            {lightbox + 1} / {top.length}
          </p>
        </div>
      )}
    </>
  )
}
