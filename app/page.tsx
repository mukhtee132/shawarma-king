'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const menuItems = [
  {
    img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&q=80',
    name: 'Chicken Shawarma',
    desc: 'Garlic sauce, fresh veggies',
    price: '₦2,500',
  },
  {
    img: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=600&q=80',
    name: 'Beef Shawarma',
    desc: 'Special sauce, toasted wrap',
    price: '₦3,000',
  },
  {
    img: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=600&q=80',
    name: 'King Combo',
    desc: 'Double wrap + drink + fries',
    price: '₦5,500',
  },
]

export default function HomePage() {
  const heroTitleRef = useRef<HTMLHeadingElement>(null)
  const heroSubRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const bannerRef = useRef<HTMLDivElement>(null)
  const marqueeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    gsap.fromTo(
      heroTitleRef.current,
      { y: 100, opacity: 0, skewY: 5 },
      { y: 0, opacity: 1, skewY: 0, duration: 1.2, ease: 'power4.out', delay: 0.1 }
    )
    gsap.fromTo(
      heroSubRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.6 }
    )
    gsap.fromTo(
      ctaRef.current,
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', delay: 0.9 }
    )

    gsap.to('.marquee-track', {
      xPercent: -50,
      duration: 20,
      ease: 'none',
      repeat: -1,
    })

    gsap.fromTo(
      '.stat-item',
      { y: 60, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 80%',
        },
      }
    )

    gsap.fromTo(
      '.menu-card',
      { y: 80, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: menuRef.current,
          start: 'top 75%',
        },
      }
    )

    gsap.fromTo(
      bannerRef.current,
      { x: -60, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: bannerRef.current,
          start: 'top 80%',
        },
      }
    )

    ScrollTrigger.create({
      onUpdate: (self) => {
        gsap.to('.skew-on-scroll', {
          skewY: (self as any).velocity * -0.002,
          duration: 0.5,
          ease: 'power1.out',
        })
      },
    })
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        .dm { font-family: 'DM Sans', sans-serif; }
      `}</style>

      <div className="dm bg-white text-black overflow-x-hidden">

        {/* ── HERO ── */}
        <section className="skew-on-scroll min-h-screen grid grid-cols-1 md:grid-cols-2 border-b-2 border-black">

          {/* Left */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-24 border-b-2 md:border-b-0 md:border-r-2 border-black">
            <span className="bebas inline-block bg-[#F5C200] text-black text-sm tracking-[4px] uppercase px-4 py-2 mb-8 w-fit border border-black">
              👑 Now Delivering in Lagos
            </span>

            <h1
              ref={heroTitleRef}
              className="bebas text-[100px] md:text-[130px] lg:text-[150px] leading-[0.85] uppercase mb-8"
            >
              TASTE<br />
              THE<br />
              <span
                className="text-[#F5C200]"
                style={{ WebkitTextStroke: '3px black' }}
              >
                THRONE
              </span>
            </h1>

            <p
              ref={heroSubRef}
              className="text-gray-500 text-base md:text-lg max-w-sm mb-10 leading-relaxed"
            >
              Lagos' boldest shawarma. Grilled fresh, wrapped tight, delivered fast. This is what royalty tastes like.
            </p>

            <div ref={ctaRef} className="flex gap-4 flex-wrap">
              <Link
                href="/menu"
                className="bebas bg-black text-white text-xl tracking-widest uppercase px-10 py-4 hover:bg-[#F5C200] hover:text-black border-2 border-black transition-colors duration-200"
              >
                Order Now →
              </Link>
              <Link
                href="/menu"
                className="bebas border-2 border-black text-black text-xl tracking-widest uppercase px-10 py-4 hover:bg-black hover:text-white transition-colors duration-200"
              >
                View Menu
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="bg-[#F5C200] flex flex-col items-center justify-center gap-6 py-20">
            <div className="w-56 h-56 md:w-72 md:h-72 rounded-full overflow-hidden border-4 border-black">
              <img
                src="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80"
                alt="Shawarma King hero"
                className="w-full h-full object-cover"
              />
            </div>
            <p className="bebas text-black text-3xl tracking-[8px] uppercase">
              The King Wrap
            </p>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div
          ref={marqueeRef}
          className="bg-[#F5C200] border-b-2 border-black py-4 overflow-hidden"
        >
          <div className="marquee-track flex whitespace-nowrap" style={{ width: '200%' }}>
            {Array(16).fill(null).map((_, i) => (
              <span key={i} className="bebas text-black text-2xl tracking-widest px-8">
                Shawarma King ★ Grilled Fresh ★ Delivered Hot ★&nbsp;
              </span>
            ))}
          </div>
        </div>

        {/* ── STATS ── */}
        <div ref={statsRef} className="grid grid-cols-3 border-b-2 border-black">
          {[
            { num: '10K+', label: 'Orders Delivered' },
            { num: '4.9★', label: 'Average Rating' },
            { num: '30min', label: 'Avg Delivery' },
          ].map((s, i) => (
            <div
              key={i}
              className="stat-item px-6 md:px-16 py-12 border-r-2 border-black last:border-r-0 text-center"
            >
              <div className="bebas text-5xl md:text-7xl text-black leading-none">
                {s.num}
              </div>
              <div className="text-gray-500 text-xs mt-2 font-bold uppercase tracking-widest">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── MENU ── */}
        <section className="py-20 px-8 md:px-16 border-b-2 border-black">
          <div className="flex items-baseline justify-between mb-12">
            <h2 className="bebas text-5xl md:text-7xl uppercase">Popular Items</h2>
            <Link
              href="/menu"
              className="text-xs font-black uppercase tracking-widest underline underline-offset-4 hover:text-[#F5C200] transition-colors"
            >
              Full Menu →
            </Link>
          </div>

          <div ref={menuRef} className="grid grid-cols-1 md:grid-cols-3 border-2 border-black">
            {menuItems.map((item, i) => (
              <div
                key={i}
                className="menu-card p-0 border-b-2 md:border-b-0 md:border-r-2 border-black last:border-0 group hover:bg-[#F5C200] transition-colors duration-300 cursor-pointer"
              >
                <div className="w-full h-52 overflow-hidden border-b-2 border-black">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <h3 className="bebas text-4xl uppercase mb-2">{item.name}</h3>
                  <p className="text-gray-500 text-sm mb-8 group-hover:text-black transition-colors">
                    {item.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="bebas text-3xl">{item.price}</span>
                    <button className="bg-black text-white w-10 h-10 text-xl font-black border-2 border-black hover:bg-white hover:text-black transition-colors duration-200 flex items-center justify-center">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── BANNER ── */}
        <section
          ref={bannerRef}
          className="bg-black text-white px-8 md:px-16 py-20 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <h2 className="bebas text-5xl md:text-7xl uppercase leading-none">
            Hungry?<br />
            <span className="text-[#F5C200]">Order In Minutes.</span>
          </h2>
          <Link
            href="/menu"
            className="bebas bg-[#F5C200] text-black text-2xl tracking-widest uppercase px-12 py-5 hover:bg-white transition-colors duration-200 whitespace-nowrap border-2 border-[#F5C200]"
          >
            Start Your Order →
          </Link>
        </section>

      </div>
    </>
  )
}