'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useCartStore } from '@/store/cart'
import gsap from 'gsap'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore()
  const titleRef = useRef<HTMLHeadingElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    )
    gsap.fromTo(
      '.cart-item',
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
    )
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <div className="bg-white text-black min-h-screen">

        {/* Header */}
        <div className="border-b-2 border-black px-8 md:px-16 py-16 bg-[#F5C200]">
          <h1 ref={titleRef} className="bebas text-[80px] md:text-[120px] leading-none uppercase">
            Your Cart
          </h1>
          <p className="text-black/70 text-base mt-2 font-medium">
            {items.length === 0 ? 'Nothing here yet.' : `${items.length} item${items.length > 1 ? 's' : ''} in your order`}
          </p>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 gap-6 px-8 text-center">
            <div className="text-8xl">🌯</div>
            <h2 className="bebas text-5xl uppercase">Your cart is empty</h2>
            <p className="text-gray-500 max-w-sm">
              Looks like you haven't added anything yet. Head to the menu and pick your order, King.
            </p>
            <Link
              href="/menu"
              className="bebas bg-black text-white text-xl tracking-widest uppercase px-10 py-4 hover:bg-[#F5C200] hover:text-black border-2 border-black transition-colors duration-200"
            >
              Go to Menu →
            </Link>
          </div>
        ) : (
          <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-3 min-h-screen">

            {/* Items list */}
            <div className="lg:col-span-2 border-r-2 border-black">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="cart-item flex gap-0 border-b-2 border-black group hover:bg-[#F5C200] transition-colors duration-200"
                >
                  {/* Image */}
                  {item.image_url && (
                    <div className="w-32 h-32 shrink-0 border-r-2 border-black overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex flex-1 items-center justify-between px-6 py-4 gap-4 flex-wrap">
                    <div>
                      <h3 className="bebas text-2xl uppercase">{item.name}</h3>
                      <p className="text-gray-500 text-sm group-hover:text-black transition-colors">
                        ₦{item.price.toLocaleString()} each
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center border-2 border-black">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors border-r-2 border-black"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="bebas text-xl w-10 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center hover:bg-black hover:text-white transition-colors border-l-2 border-black"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Item total + delete */}
                    <div className="flex items-center gap-4">
                      <span className="bebas text-2xl">
                        ₦{(item.price * item.quantity).toLocaleString()}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear cart */}
              <div className="p-6">
                <button
                  onClick={clearCart}
                  className="text-xs font-black uppercase tracking-widest text-gray-400 hover:text-red-600 transition-colors underline underline-offset-4"
                >
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order summary */}
            <div className="p-8 md:p-12 flex flex-col gap-8">
              <h2 className="bebas text-4xl uppercase border-b-2 border-black pb-4">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-500">{item.name} × {item.quantity}</span>
                    <span className="font-bold">₦{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t-2 border-black pt-4 flex justify-between items-center">
                <span className="bebas text-2xl uppercase">Total</span>
                <span className="bebas text-3xl">₦{total().toLocaleString()}</span>
              </div>

              <Link
                href="/checkout"
                className="bebas bg-black text-white text-2xl tracking-widest uppercase px-8 py-5 text-center hover:bg-[#F5C200] hover:text-black border-2 border-black transition-colors duration-200"
              >
                Checkout →
              </Link>

              <Link
                href="/menu"
                className="bebas border-2 border-black text-black text-xl tracking-widest uppercase px-8 py-4 text-center hover:bg-black hover:text-white transition-colors duration-200"
              >
                ← Add More Items
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  )
}