'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { MenuItem, Category } from '@/types'
import gsap from 'gsap'

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', price: '', category: 'shawarma' as Category, image_url: '',
  })
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    gsap.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' })
    fetchItems()
  }, [])

  async function fetchItems() {
    const supabase = createClient()
    const { data } = await supabase.from('menu_items').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  async function handleAdd() {
    if (!form.name || !form.price) return
    setAdding(true)
    const supabase = createClient()
    await supabase.from('menu_items').insert({
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      category: form.category,
      image_url: form.image_url || null,
      available: true,
    })
    setForm({ name: '', description: '', price: '', category: 'shawarma', image_url: '' })
    setAdding(false)
    fetchItems()
  }

  async function toggleAvailable(item: MenuItem) {
    const supabase = createClient()
    await supabase.from('menu_items').update({ available: !item.available }).eq('id', item.id)
    setItems((prev) => prev.map((i) => i.id === item.id ? { ...i, available: !i.available } : i))
  }

  async function deleteItem(id: string) {
    const supabase = createClient()
    await supabase.from('menu_items').delete().eq('id', id)
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        input:focus, textarea:focus, select:focus { border-color: #F5C200; outline: none; }
      `}</style>

      <div className="bg-white text-black min-h-screen">

        <div className="border-b-2 border-black px-8 md:px-16 py-16 bg-black text-white">
          <h1 ref={titleRef} className="bebas text-[80px] md:text-[120px] leading-none uppercase">Menu Manager</h1>
        </div>

        <div className="border-b-2 border-black flex">
          <Link href="/admin" className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black hover:bg-[#F5C200] transition-colors">Overview</Link>
          <Link href="/admin/orders-admin" className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black hover:bg-[#F5C200] transition-colors">Orders</Link>
          <Link href="/admin/menu-admin" className="bebas text-xl tracking-widest px-10 py-5 border-r-2 border-black bg-[#F5C200] text-black">Menu</Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">

          <div className="p-8 md:p-12 border-b-2 lg:border-b-0 lg:border-r-2 border-black flex flex-col gap-6">
            <h2 className="bebas text-4xl uppercase border-b-2 border-black pb-4">Add Item</h2>

            <div className="flex flex-col gap-2">
              <label className="bebas text-lg uppercase tracking-widest">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Chicken Shawarma" className="border-2 border-black px-4 py-3 text-sm font-medium w-full" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="bebas text-lg uppercase tracking-widest">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" rows={2} className="border-2 border-black px-4 py-3 text-sm font-medium w-full resize-none" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="bebas text-lg uppercase tracking-widest">Price (₦)</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="e.g. 2500" type="number" className="border-2 border-black px-4 py-3 text-sm font-medium w-full" />
            </div>

            <div className="flex flex-col gap-2">
              <label className="bebas text-lg uppercase tracking-widest">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className="border-2 border-black px-4 py-3 text-sm font-medium w-full bg-white">
                <option value="shawarma">Shawarma</option>
                <option value="drinks">Drinks</option>
                <option value="extras">Extras</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="bebas text-lg uppercase tracking-widest">Image URL</label>
              <input value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="https://..." className="border-2 border-black px-4 py-3 text-sm font-medium w-full" />
            </div>

            <button onClick={handleAdd} disabled={adding} className="bebas bg-black text-white text-xl tracking-widest uppercase px-8 py-4 hover:bg-[#F5C200] hover:text-black border-2 border-black transition-colors duration-200 disabled:opacity-50">
              {adding ? 'Adding...' : 'Add Item →'}
            </button>
          </div>

          <div className="lg:col-span-2">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="bebas text-4xl uppercase text-gray-300 animate-pulse">Loading...</div>
              </div>
            ) : (
              <div className="divide-y-2 divide-black">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-6 hover:bg-gray-50 transition-colors">
                    {item.image_url && (
                      <div className="w-20 h-20 shrink-0 border-2 border-black overflow-hidden">
                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="bebas text-2xl uppercase">{item.name}</h3>
                          <p className="text-gray-500 text-xs mb-1">{item.category}</p>
                          <p className="bebas text-xl">₦{item.price.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleAvailable(item)} className={`bebas text-sm px-4 py-2 border-2 border-black transition-colors ${item.available ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-[#F5C200]'}`}>
                            {item.available ? 'Available' : 'Unavailable'}
                          </button>
                          <button onClick={() => deleteItem(item.id)} className="bebas text-sm px-4 py-2 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}