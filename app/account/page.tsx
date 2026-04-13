'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/types'
import gsap from 'gsap'

export default function AccountPage() {
  const router = useRouter()
  const titleRef = useRef<HTMLHeadingElement>(null)

  // ✅ STATE (you were missing this)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // GSAP animation
    if (titleRef.current) {
      gsap.fromTo(
        titleRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
      )
    }

    async function fetchProfile() {
      const supabase = createClient()

      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (data) {
        setProfile(data)
        setName(data.name || '')
        setPhone(data.phone || '')
        setAddress(data.address || '')
      }

      setLoading(false)
    }

    fetchProfile()
  }, [router])

  async function handleSave() {
    setSaving(true)

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return

    await supabase
      .from('profiles')
      .update({ name, phone, address })
      .eq('id', user.id)

    setSaved(true)
    setSaving(false)

    setTimeout(() => setSaved(false), 2000)
  }

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        input:focus, textarea:focus { border-color: #F5C200; outline: none; }
      `}</style>

      <div className="bg-white text-black min-h-screen">

        {/* Header */}
        <div className="border-b-2 border-black px-8 md:px-16 py-16 bg-[#F5C200]">
          <h1
            ref={titleRef}
            className="bebas text-[80px] md:text-[120px] leading-none uppercase"
          >
            My Account
          </h1>
          <p className="text-black/70 text-base mt-2 font-medium">
            Manage your profile and preferences.
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32">
            <div className="bebas text-4xl uppercase text-gray-300 animate-pulse">
              Loading...
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3">

            {/* Form */}
            <div className="lg:col-span-2 border-r-2 border-black p-8 md:p-16 flex flex-col gap-8">
              <h2 className="bebas text-4xl uppercase border-b-2 border-black pb-4">
                Profile Details
              </h2>

              <div className="flex flex-col gap-2">
                <label className="bebas text-xl uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="bebas text-xl uppercase tracking-widest">
                  Phone Number
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08012345678"
                  className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="bebas text-xl uppercase tracking-widest">
                  Default Address
                </label>
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Your delivery address"
                  rows={3}
                  className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors resize-none"
                />
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bebas bg-black text-white text-2xl tracking-widest uppercase px-8 py-5 hover:bg-[#F5C200] hover:text-black border-2 border-black transition-colors duration-200 disabled:opacity-50"
              >
                {saved ? 'Saved ✓' : saving ? 'Saving...' : 'Save Changes →'}
              </button>
            </div>

            {/* Sidebar */}
            <div className="p-8 md:p-12 flex flex-col gap-6">
              <h2 className="bebas text-4xl uppercase border-b-2 border-black pb-4">
                Quick Links
              </h2>

              <Link
                href="/orders"
                className="bebas text-2xl uppercase border-2 border-black px-6 py-4 hover:bg-[#F5C200] transition-colors duration-200 block"
              >
                My Orders →
              </Link>

              <Link
                href="/menu"
                className="bebas text-2xl uppercase border-2 border-black px-6 py-4 hover:bg-[#F5C200] transition-colors duration-200 block"
              >
                Order Again →
              </Link>

              <button
                onClick={handleSignOut}
                className="bebas text-2xl uppercase border-2 border-red-500 text-red-500 px-6 py-4 hover:bg-red-500 hover:text-white transition-colors duration-200 text-left"
              >
                Sign Out →
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}