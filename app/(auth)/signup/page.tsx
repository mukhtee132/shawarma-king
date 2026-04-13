'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase'
import gsap from 'gsap'

const signupSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

type SignupForm = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  })

  useEffect(() => {
    gsap.fromTo(
      titleRef.current,
      { y: 60, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }
    )
    gsap.fromTo(
      '.auth-field',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out', delay: 0.3 }
    )
  }, [])

  async function onSubmit(data: SignupForm) {
    setLoading(true)
    setError(null)
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { name: data.name },
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }
    router.push('/')
    router.refresh()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
        input:focus { border-color: #F5C200; outline: none; }
      `}</style>

      <div className="bg-white min-h-screen grid grid-cols-1 md:grid-cols-2">

        {/* Left — yellow panel */}
        <div className="hidden md:flex bg-[#F5C200] border-r-2 border-black flex-col items-center justify-center gap-6 p-16">
          <div className="w-48 h-48 rounded-full bg-black flex items-center justify-center text-8xl">
            🌯
          </div>
          <h2 className="bebas text-6xl uppercase text-black text-center leading-none">
            Join The<br />Kingdom.
          </h2>
          <p className="text-black/70 text-center max-w-xs">
            Create an account to track orders, save your address, and order faster.
          </p>
        </div>

        {/* Right — form */}
        <div className="flex flex-col justify-center px-8 md:px-16 py-20">
          <h1 ref={titleRef} className="bebas text-6xl md:text-7xl uppercase mb-2">
            Sign Up
          </h1>
          <p className="text-gray-500 mb-10 text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-black text-black underline underline-offset-4 hover:text-[#F5C200] transition-colors">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

            {error && (
              <div className="bg-red-50 border-2 border-red-600 px-4 py-3 text-red-600 text-sm font-bold">
                {error}
              </div>
            )}

            <div className="auth-field flex flex-col gap-2">
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

            <div className="auth-field flex flex-col gap-2">
              <label className="bebas text-xl uppercase tracking-widest">Email</label>
              <input
                {...register('email')}
                type="email"
                placeholder="you@example.com"
                className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors"
              />
              {errors.email && (
                <span className="text-red-600 text-sm font-bold">{errors.email.message}</span>
              )}
            </div>

            <div className="auth-field flex flex-col gap-2">
              <label className="bebas text-xl uppercase tracking-widest">Password</label>
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors"
              />
              {errors.password && (
                <span className="text-red-600 text-sm font-bold">{errors.password.message}</span>
              )}
            </div>

            <div className="auth-field flex flex-col gap-2">
              <label className="bebas text-xl uppercase tracking-widest">Confirm Password</label>
              <input
                {...register('confirm')}
                type="password"
                placeholder="••••••••"
                className="border-2 border-black px-4 py-3 text-base font-medium w-full transition-colors"
              />
              {errors.confirm && (
                <span className="text-red-600 text-sm font-bold">{errors.confirm.message}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bebas bg-black text-white text-2xl tracking-widest uppercase px-8 py-5 hover:bg-[#F5C200] hover:text-black border-2 border-black transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}