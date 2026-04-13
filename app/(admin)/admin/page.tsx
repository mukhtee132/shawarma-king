'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import gsap from 'gsap'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    totalUsers: 0,
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    )

    async function fetchStats() {
      const supabase = createClient()
      const [ordersRes, profilesRes] = await Promise.all([
        supabase.from('orders').select('*'),
        supabase.from('profiles').select('id'),
      ])
      const orders = ordersRes.data || []
      const totalRevenue = orders.reduce((sum: number, o: any) => sum + o.total, 0)
      const pendingOrders = orders.filter((o: any) => o.status === 'pending').length
      setStats({ totalOrders: orders.length, pendingOrders, totalRevenue, totalUsers: profilesRes.data?.length || 0 })
      setRecentOrders(orders.slice(0, 5))
      setLoading(false)
    }

    fetchStats()
  }, [])

  useEffect(() => {
    if (!loading) {
      gsap.fromTo('.stat-card', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' })
    }
  }, [loading])

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-400 text-black',
    preparing: 'bg-blue-500 text-white',
    ready: 'bg-green-500 text-white',
    delivered: 'bg-black text-white',
    cancelled: 'bg-red-500 text-white',
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <div className="bg-white text-black min-h-screen">

        <div className="border-b-2 border-black px-8 md:px-16 py-16 bg-black text-white">
          <h1 ref={titleRef} className="bebas text-[80px] md:text-[120px] leading-none uppercase">
            Admin Panel
          </h1>
          <p className="text-white/50 text-base mt-2 font-medium">Manage orders, menu, and users.</p>
        </div>

        <div className="border-b-2 border-black flex">
          <Link href="/admin" className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black bg-[#F5C200] text-black">Overview</Link>
          <Link href="/admin/orders-admin" className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black hover:bg-[#F5C200] transition-colors">Orders</Link>
          <Link href="/admin/menu-admin" className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black hover:bg-[#F5C200] transition-colors">Menu</Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="bebas text-4xl uppercase text-gray-300 animate-pulse">Loading...</div>
          </div>
        ) : (
          <div className="p-8 md:p-16 flex flex-col gap-16">

            <div className="grid grid-cols-2 lg:grid-cols-4 border-2 border-black">
              {[
                { label: 'Total Orders', value: stats.totalOrders },
                { label: 'Pending', value: stats.pendingOrders },
                { label: 'Revenue', value: `₦${stats.totalRevenue.toLocaleString()}` },
                { label: 'Users', value: stats.totalUsers },
              ].map((s, i) => (
                <div key={i} className="stat-card p-8 border-r-2 border-black last:border-r-0 border-b-2 lg:border-b-0 text-center">
                  <div className="bebas text-5xl md:text-6xl text-black leading-none mb-2">{s.value}</div>
                  <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-baseline justify-between mb-8">
                <h2 className="bebas text-4xl uppercase">Recent Orders</h2>
                <Link href="/admin/orders-admin" className="text-xs font-black uppercase tracking-widest underline underline-offset-4 hover:text-[#F5C200] transition-colors">
                  View All →
                </Link>
              </div>

              <div className="border-2 border-black divide-y-2 divide-black">
                {recentOrders.length === 0 ? (
                  <div className="p-8 text-center text-gray-400 bebas text-2xl uppercase">No orders yet</div>
                ) : (
                  recentOrders.map((order) => (
                    <div key={order.id} className="flex flex-wrap items-center justify-between px-6 py-4 gap-4 hover:bg-gray-50 transition-colors">
                      <div>
                        <p className="font-mono text-sm font-bold">{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                      <span className="bebas text-xl">₦{order.total.toLocaleString()}</span>
                      <span className={`bebas text-sm px-4 py-1 uppercase tracking-widest ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
