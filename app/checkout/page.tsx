'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase'
import gsap from 'gsap'

const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  address: z.string().min(5, 'Enter your delivery address'),
  notes: z.string().optional(),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, clearCart } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  })

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    )
    gsap.fromTo(
      '.checkout-field',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.4 }
    )
  }, [])

  async function onSubmit(data: CheckoutForm) {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    // Create the order
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'pending',
        total: total(),
        delivery_address: data.address,
        notes: data.notes || null,
      })
      .select()
      .single()

    if (error || !order) {
      setLoading(false)
      return
    }

    // Insert order items
    const orderItems = items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    }))

    await supabase.from('order_items').insert(orderItems)

    clearCart()
    setDone(true)
    setLoading(false)
  }

  if (done) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
          .bebas { font-family: 'Bebas Neue', sans-serif; }
        `}</style>
        <div className="bg-[#F5C200] min-h-screen flex flex-col items-center justify-center text-center px-8 gap-6">
          <div className="text-9xl">👑</div>
          <h1 className="bebas text-7xl md:text-9xl uppercase text-black leading-none">
            Order Placed!
          </h1>
          <p className="text-black/70 text-lg max-w-md">
            Your shawarma is being prepared. Sit tight, King — royalty takes time.
          </p>
          <button
            onClick={() => router.push('/orders')}
            className="bebas bg-black text-white text-2xl tracking-widest uppercase px-12 py-5 hover:bg-white transition-colors duration-200 border-2 border-black"
          >
            Track Your Order →
          </button>
        </div>
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
          .bebas { font-family: 'Bebas Neue', sans-serif; }
        `}</style>
        <div className="bg-white min-h-screen flex flex-col items-center justify-center text-center px-8 gap-6">
          <div className="text-8xl">🌯</div>
          <h1 className="bebas text-6xl uppercase">Nothing to checkout</h1>
          <p className="text-gray-500">Your cart is empty. Add some items first.</p>
          <button
            onClick={() => router.push('/menu')}
            className="bebas bg-black text-white text-xl tracking-widest uppercase px-10 py-4 hover:bg-[#F5C200] hover:text-black border-2 border-black transition-colors duration-200"
          >
            Go to Menu →
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        input, textarea { outline: none; }
        input:focus, textarea:focus { border-color: #F5C200; }
      `}</style>

      <div className="bg-white text-black min-h-screen">

        {/* Header */}
        <div className="border-b-2 border-black px-8 md:px-16 py-16 bg-[#F5C200]">
          <h1 ref={titleRef} className="bebas text-[80px] md:text-[120px] leading-none uppercase">
            Checkout
          </h1>
          <p className="text-black/70 text-base mt-2 font-medium">
            Almost there. Fill in your details and place your order.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3">

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-2 border-r-2 border-black p-8 md:p-16 flex flex-col gap-8"
          >
            <h2 className="bebas text-4xl uppercase border-b-2 border-black pb-4">
              Delivery Details
            </h2>

            <div className="checkout-field flex flex-col gap-2">
              <label className="bebas text-xl uppercase tracking-widest">Full Name</label>
              <input
                {...register('name')}
                placeholder="e.g. Mukhtar Abdullahi"
                className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors"
              />
              {errors.name && (
                <span className="text-red-600 text-sm font-bold">{errors.name.message}</span>
              )}
            </div>

            <div className="checkout-field flex flex-col gap-2">
              <label className="bebas text-xl uppercase tracking-widest">Phone Number</label>
              <input
                {...register('phone')}
                placeholder="e.g. 08012345678"
                className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors"
              />
              {errors.phone && (
                <span className="text-red-600 text-sm font-bold">{errors.phone.message}</span>
              )}
            </div>

            <div className="checkout-field flex flex-col gap-2">
              <label className="bebas text-xl uppercase tracking-widest">Delivery Address</label>
              <textarea
                {...register('address')}
                placeholder="e.g. 14 Bode Thomas Street, Surulere, Lagos"
                rows={3}
                className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors resize-none"
              />
              {errors.address && (
                <span className="text-red-600 text-sm font-bold">{errors.address.message}</span>
              )}
            </div>

            <div className="checkout-field flex flex-col gap-2">
              <label className="bebas text-xl uppercase tracking-widest">
                Order Notes <span className="text-gray-400 text-sm normal-case font-normal">(optional)</span>
              </label>
              <textarea
                {...register('notes')}
                placeholder="e.g. Extra garlic sauce please"
                rows={2}
                className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors resize-none"
              />
            </div>

            <div className="checkout-field bg-[#F5C200] border-2 border-black p-4">
              <p className="text-sm font-bold uppercase tracking-widest">
                💳 Payment on Delivery — No card needed. Pay cash when your order arrives.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bebas bg-black text-white text-2xl tracking-widest uppercase px-8 py-5 hover:bg-[#F5C200] hover:text-black border-2 border-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing Order...' : 'Place Order →'}
            </button>
          </form>

          {/* Order summary */}
          <div className="p-8 md:p-12 flex flex-col gap-6">
            <h2 className="bebas text-4xl uppercase border-b-2 border-black pb-4">
              Your Order
            </h2>

            <div className="flex flex-col gap-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 border-b border-black/10 pb-4">
                  {item.image_url && (
                    <div className="w-16 h-16 shrink-0 border-2 border-black overflow-hidden">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="bebas text-xl uppercase leading-tight">{item.name}</p>
                    <p className="text-gray-500 text-sm">× {item.quantity}</p>
                  </div>
                  <span className="bebas text-xl">
                    ₦{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-black pt-4 flex justify-between items-center">
              <span className="bebas text-2xl uppercase">Total</span>
              <span className="bebas text-3xl">₦{total().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}