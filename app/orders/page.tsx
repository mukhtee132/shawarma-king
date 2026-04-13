'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Order } from '@/types'
import gsap from 'gsap'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-400 text-black',
  preparing: 'bg-blue-500 text-white',
  ready: 'bg-green-500 text-white',
  delivered: 'bg-black text-white',
  cancelled: 'bg-red-500 text-white',
}

const statusSteps = ['pending', 'preparing', 'ready', 'delivered']

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    )

    async function fetchOrders() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setOrders(data || [])
      setLoading(false)
    }

    fetchOrders()
  }, [])

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(
        '.order-card',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      )
    }
  }, [loading])

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
            My Orders
          </h1>
          <p className="text-black/70 text-base mt-2 font-medium">
            Track your royal deliveries.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="bebas text-4xl uppercase text-gray-300 animate-pulse">
              Loading Orders...
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6 text-center px-8">
            <div className="text-8xl">📦</div>
            <h2 className="bebas text-5xl uppercase">No orders yet</h2>
            <p className="text-gray-500 max-w-sm">
              You haven't placed any orders yet. Head to the menu and make your first order.
            </p>
            <Link
              href="/menu"
              className="bebas bg-black text-white text-xl tracking-widest uppercase px-10 py-4 hover:bg-[#F5C200] hover:text-black border-2 border-black transition-colors duration-200"
            >
              Order Now →
            </Link>
          </div>
        ) : (
          <div className="divide-y-2 divide-black">
            {orders.map((order) => (
              <div key={order.id} className="order-card px-8 md:px-16 py-10 hover:bg-gray-50 transition-colors">

                {/* Order header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                  <div>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Order ID
                    </p>
                    <p className="font-mono text-sm font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      {new Date(order.created_at).toLocaleDateString('en-NG', {
                        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="bebas text-2xl">₦{order.total.toLocaleString()}</span>
                    <span className={`bebas text-sm px-4 py-1 uppercase tracking-widest ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Status tracker */}
                <div className="flex items-center gap-0 mb-8 overflow-x-auto">
                  {statusSteps.map((step, i) => {
                    const currentIndex = statusSteps.indexOf(order.status)
                    const isCompleted = i <= currentIndex
                    return (
                      <div key={step} className="flex items-center">
                        <div className={`flex flex-col items-center gap-1`}>
                          <div className={`w-8 h-8 border-2 border-black flex items-center justify-center text-xs font-black ${isCompleted ? 'bg-black text-[#F5C200]' : 'bg-white text-black'}`}>
                            {i + 1}
                          </div>
                          <span className="bebas text-xs uppercase tracking-wider whitespace-nowrap">
                            {step}
                          </span>
                        </div>
                        {i < statusSteps.length - 1 && (
                          <div className={`w-12 md:w-24 h-0.5 mb-5 ${i < currentIndex ? 'bg-black' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Order items */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="flex flex-wrap gap-3">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="border-2 border-black px-4 py-2">
                        <span className="bebas text-lg">{item.name}</span>
                        <span className="text-gray-500 text-sm ml-2">× {item.quantity}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}