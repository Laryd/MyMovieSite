import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from './layouts/header'
import Footer from './layouts/footer'
import BackToTop from './components/BackToTop'
import Providers from './components/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Sprimio — Discover Movies & TV Shows',
  description: 'Discover trending movies and TV shows. Browse by genre, search your favorites.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-zinc-950 text-white min-h-screen`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
          <BackToTop />
        </Providers>
      </body>
    </html>
  )
}
