'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  { href: '/admin/products',     label: 'Products' },
  { href: '/admin/categories',   label: 'Categories' },
  { href: '/admin/site-content', label: 'Site Content' },
  { href: '/admin/slider',       label: 'Slider' },
  { href: '/admin/inquiries',    label: 'Inquiries' },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav className="flex-1 py-3">
      {NAV.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex items-center px-5 py-2.5 text-[13px] transition-colors border-l-2 ${
            pathname.startsWith(item.href)
              ? 'text-white bg-white/[0.08] border-brand font-medium'
              : 'text-white/60 hover:text-white hover:bg-white/5 border-transparent'
          }`}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
