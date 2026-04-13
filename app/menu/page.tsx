'use client'

import { useState, useEffect, useRef } from 'react'
import { useCartStore } from '@/store/cart'
import { MenuItem, Category } from '@/types'
import { createClient } from '@/lib/supabase'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const categories: { label: string; value: 'all' | Category }[] = [
  { label: 'All', value: 'all' },
  { label: 'Shawarma', value: 'shawarma' },
  { label: 'Drinks', value: 'drinks' },
  { label: 'Extras', value: 'extras' },
]

export default function MenuPage() {
  const [active, setActive] = useState<'all' | Category>('all')
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [added, setAdded] = useState<string | null>(null)
  const addItem = useCartStore((s) => s.addItem)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    )
    fetchMenu()
  }, [])

  async function fetchMenu() {
    const supabase = createClient()
    const { data } = await supabase
      .from('menu_items')
      .select('*')
      .eq('available', true)
      .order('created_at', { ascending: true })
    setMenuItems(data || [])
    setLoading(false)
  }

  const filtered = active === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === active)

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        '.menu-item-card',
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, ease: 'power3.out' }
      )
    }
  }, [active, loading])

  function handleAdd(item: MenuItem) {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image_url: item.image_url,
    })
    setAdded(item.id)
    setTimeout(() => setAdded(null), 1200)
  }

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
            The Menu
          </h1>
          <p className="text-black/70 text-base mt-2 font-medium">
            Everything grilled fresh. Pick your order, King.
          </p>
        </div>

        {/* Category Filter */}
        <div className="border-b-2 border-black flex overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActive(cat.value)}
              className={`bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black whitespace-nowrap transition-colors duration-200 ${
                active === cat.value
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-[#F5C200]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="bebas text-4xl uppercase text-gray-300 animate-pulse">
              Loading Menu...
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-center px-8">
            <div className="text-7xl">🌯</div>
            <h2 className="bebas text-4xl uppercase">No items here yet</h2>
            <p className="text-gray-500">Check back soon or try another category.</p>
          </div>
        ) : (
          /* Grid */
          <div
            ref={gridRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-l-2 border-black"
          >
            {filtered.map((item) => (
              <div
                key={item.id}
                className="menu-item-card border-r-2 border-b-2 border-black group hover:bg-[#F5C200] transition-colors duration-300"
              >
                {/* Image */}
                <div className="w-full h-52 overflow-hidden border-b-2 border-black bg-gray-100">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl">
                      🌯
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="bebas text-3xl uppercase leading-tight">{item.name}</h3>
                    <span className="bebas text-2xl whitespace-nowrap">
                      ₦{item.price.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-6 group-hover:text-black transition-colors leading-relaxed">
                    {item.description}
                  </p>
                  <button
                    onClick={() => handleAdd(item)}
                    className={`w-full py-3 border-2 border-black bebas text-lg tracking-widest transition-colors duration-200 ${
                      added === item.id
                        ? 'bg-black text-[#F5C200]'
                        : 'bg-white text-black hover:bg-black hover:text-white group-hover:bg-black group-hover:text-white'
                    }`}
                  >
                    {added === item.id ? 'Added ✓' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}