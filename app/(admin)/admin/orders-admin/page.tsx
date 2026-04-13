'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { OrderStatus } from '@/types'
import gsap from 'gsap'

const statusOptions: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivered', 'cancelled']

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-400 text-black',
  preparing: 'bg-blue-500 text-white',
  ready: 'bg-green-500 text-white',
  delivered: 'bg-black text-white',
  cancelled: 'bg-red-500 text-white',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    gsap.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' })
    fetchOrders()
  }, [])

  async function fetchOrders() {
    const supabase = createClient()
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
    gsap.fromTo('.order-row', { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: 'power3.out' })
  }

  async function updateStatus(orderId: string, status: OrderStatus) {
    setUpdating(orderId)
    const supabase = createClient()
    await supabase.from('orders').update({ status }).eq('id', orderId)
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)))
    setUpdating(null)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        select { appearance: none; }
      `}</style>

      <div className="bg-white text-black min-h-screen">

        <div className="border-b-2 border-black px-8 md:px-16 py-16 bg-black text-white">
          <h1 ref={titleRef} className="bebas text-[80px] md:text-[120px] leading-none uppercase">All Orders</h1>
        </div>

        <div className="border-b-2 border-black flex">
          <Link href="/admin" className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black hover:bg-[#F5C200] transition-colors">Overview</Link>
          <Link href="/admin/orders-admin" className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black bg-[#F5C200] text-black">Orders</Link>
          <Link href="/admin/menu-admin" className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black hover:bg-[#F5C200] transition-colors">Menu</Link>
          <button
  onClick={async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/admin/login'
  }}
  className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black hover:bg-red-500 hover:text-white transition-colors ml-auto"
>
  Sign Out
</button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="bebas text-4xl uppercase text-gray-300 animate-pulse">Loading...</div>
          </div>
        ) : (
          <div className="divide-y-2 divide-black">
            {orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="bebas text-5xl uppercase text-gray-300">No Orders Yet</div>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="order-row px-8 md:px-16 py-8 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-6">
                    <div>
                      <p className="font-mono text-sm font-bold mb-1">{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                      </p>
                      {order.delivery_address && (
                        <p className="text-gray-500 text-sm mt-1 max-w-xs">{order.delivery_address}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="bebas text-2xl">₦{order.total.toLocaleString()}</span>
                      <span className={`bebas text-sm px-4 py-1 uppercase tracking-widest ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                      <select
                        value={order.status}
                        disabled={updating === order.id}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className="border-2 border-black px-3 py-2 text-sm font-bold uppercase bg-white cursor-pointer hover:bg-[#F5C200] transition-colors disabled:opacity-50"
                      >
                        {statusOptions.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  {order.order_items && order.order_items.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {order.order_items.map((item: any) => (
                        <div key={item.id} className="border border-black px-3 py-1">
                          <span className="bebas text-base">{item.name}</span>
                          <span className="text-gray-500 text-xs ml-2">× {item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </>
  )
}