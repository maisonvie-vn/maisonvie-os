'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { vi } from '@/lib/i18n/vi'

export function Navbar() {
  const pathname = usePathname()

  const links = [
    { name: vi.dashboard, href: '/dashboard' },
    { name: vi.reservationsMenu, href: '/reservations' },
    { name: vi.emailsMenu, href: '/emails' },
    { name: vi.documents, href: '/documents' },
    { name: vi.sop, href: '/sop' },
    { name: vi.architecture, href: '/architecture' },
    { name: vi.studio, href: '/studio' },
    { name: vi.admin, href: '/admin' },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo/Branding */}
        <div className="flex items-center gap-2">
          <span className="text-2xl font-serif-cormorant font-bold tracking-wider gold-gradient-text">
            🏛️ MAISON VIE OS
          </span>
          <span className="hidden rounded-full border border-gold-border bg-gold-muted px-2 py-0.5 text-xs font-medium text-gold sm:inline-block">
            v0.1.0
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-1 text-sm font-medium tracking-wide transition-colors duration-200 hover:text-gold-hover ${
                  isActive ? 'text-gold' : 'text-foreground/80'
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 h-[2px] w-full bg-gold shadow-[0_0_8px_#C5A55A]" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Status / Actions */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/5 px-3 py-1 text-xs text-yellow-500">
            <span className="h-1.5 w-1.5 rounded-full bg-yellow-500 animate-pulse" />
            <span>Bản cục bộ (Không có DB)</span>
          </div>
          
          {/* Mobile Menu Button placeholder */}
          <div className="md:hidden">
            {/* Mobile Nav links inline for simple mobile experience */}
            <div className="flex items-center gap-3">
              {links.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-xs font-medium ${
                      isActive ? 'text-gold underline decoration-gold decoration-2 underline-offset-4' : 'text-foreground/75'
                    }`}
                  >
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
