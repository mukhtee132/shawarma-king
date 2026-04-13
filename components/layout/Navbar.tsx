'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Navbar() {
  const pathname = usePathname()
  const itemCount = useCartStore((s) => s.itemCount)
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
  }, [])

  useEffect(() => {
    if (menuOpen && menuRef.current) {
      gsap.fromTo(
        menuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      )
    }
  }, [menuOpen])

  const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/orders', label: 'Orders' },
    { href: '/account', label: 'Account' },
  ]

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-black"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
    <Link
  href="/"
  className="font-black text-2xl uppercase tracking-tight text-black"
  style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '2px' }}
>
  Shawarma<span className="text-[#F5C200] [text-shadow:_-1px_-1px_0_#000,_1px_-1px_0_#000,_-1px_1px_0_#000,_1px_1px_0_#000]">King</span>
</Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-black uppercase tracking-widest transition-colors duration-200 ${
                  pathname === link.href
                    ? 'text-black border-b-2 border-[#F5C200]'
                    : 'text-gray-400 hover:text-black'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative flex items-center gap-2 bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest hover:bg-[#F5C200] hover:text-black transition-colors duration-200"
            >
              <ShoppingBag className="w-4 h-4" />
              Cart
              {itemCount() > 0 && (
                <span className="bg-[#F5C200] text-black text-xs font-black rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount()}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-black hover:text-gray-600 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-white border-t-2 border-black px-6 py-6 flex flex-col gap-6"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-xs font-black uppercase tracking-widest transition-colors ${
                pathname === link.href ? 'text-black' : 'text-gray-400 hover:text-black'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}