import Link from 'next/link'

export default function Footer() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;900&display=swap');
        .bebas { font-family: 'Bebas Neue', sans-serif; }
      `}</style>

      <footer className="bg-black text-white border-t-2 border-black">

        {/* Main footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/10">

          {/* Brand */}
          <div className="px-8 md:px-16 py-12 border-b md:border-b-0 md:border-r border-white/10">
            <h2 className="bebas text-4xl uppercase mb-3">
              Shawarma<span className="text-[#F5C200]">King</span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Lagos' boldest shawarma. Grilled fresh, wrapped tight, delivered fast.
            </p>
          </div>

          {/* Quick links */}
          <div className="px-8 md:px-16 py-12 border-b md:border-b-0 md:border-r border-white/10">
            <h3 className="bebas text-xl uppercase tracking-widest text-[#F5C200] mb-6">Quick Links</h3>
            <div className="flex flex-col gap-3">
              {[
                { href: '/', label: 'Home' },
                { href: '/menu', label: 'Menu' },
                { href: '/cart', label: 'Cart' },
                { href: '/orders', label: 'My Orders' },
                { href: '/account', label: 'Account' },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/60 text-sm hover:text-[#F5C200] transition-colors duration-200 w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="px-8 md:px-16 py-12">
            <h3 className="bebas text-xl uppercase tracking-widest text-[#F5C200] mb-6">Contact</h3>
            <div className="flex flex-col gap-3 text-white/60 text-sm">
              <p> Lagos, Nigeria</p>
              <p> 08012345678</p>
              <p> hello@shawarmaking.com</p>
              <p> Mon - Sun: 10am - 10pm</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="px-8 md:px-16 py-4 flex items-center justify-between flex-wrap gap-4">
          <p className="text-white/30 text-xs">
            © 2026 Shawarma King. All rights reserved.
          </p>
          <Link
            href="/admin/login"
            className="text-white/20 text-xs hover:text-white/50 transition-colors duration-200"
          >
            Admin
          </Link>
        </div>
      </footer>
    </>
  )
}