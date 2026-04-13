import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'

const dmSans = DM_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shawarma King',
  description: "Lagos' boldest shawarma 👑",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body className={`${dmSans.className} bg-white text-black min-h-screen flex flex-col`}>
        <Navbar />
        <main className="pt-16 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}