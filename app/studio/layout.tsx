'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { vi } from '@/lib/i18n/vi'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const tabs = [
    { name: 'Tổng quan', href: '/studio' },
    { name: vi.ceoDashboard, href: '/studio/ceo-dashboard' },
    { name: vi.epic, href: '/studio/epics' },
    { name: vi.feature, href: '/studio/features' },
    { name: vi.spec, href: '/studio/specifications' },
    { name: vi.task, href: '/studio/tasks' },
    { name: 'ADR', href: '/studio/adr' },
    { name: 'Releases', href: '/studio/releases' },
    { name: vi.learningMenu, href: '/studio/learning' },
    { name: vi.improvementMenu, href: '/studio/improvements' },
    { name: vi.sopMenu, href: '/studio/sops' },
    { name: vi.trainingMenu, href: '/studio/sop-training' },
    { name: vi.checklistMenu, href: '/studio/checklists' },
    { name: vi.dailyReportMenu, href: '/studio/daily-reports' },
    { name: vi.feedbackMenu, href: '/studio/feedback' },
    { name: vi.recoveryMenu, href: '/studio/recovery' },
    { name: vi.partnerMenu, href: '/studio/partners' },
    { name: vi.tourMenu, href: '/studio/tours' },
    { name: vi.eventMenu, href: '/studio/events' },
    { name: vi.menuMenu, href: '/studio/menus' },
    { name: 'Từ điển doanh nghiệp', href: '/studio/dictionary' },
    { name: 'Yêu cầu thay đổi', href: '/studio/change-requests' },
  ]

  return (
    <div className="space-y-6">
      {/* Studio Sub-Navigation */}
      <div className="border-b border-gold-border/20 pb-1">
        <div className="flex flex-wrap gap-1">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`rounded-t-lg border-t border-x px-4 py-2 text-xs font-medium tracking-wide transition-all ${
                  isActive
                    ? 'border-gold-border bg-card text-gold font-bold shadow-[0_-2px_6px_rgba(197,165,90,0.05)]'
                    : 'border-transparent text-foreground/70 hover:text-gold hover:bg-gold-muted/5'
                }`}
              >
                {tab.name}
              </Link>
            )
          })}
        </div>
      </div>

      {/* Main Studio Viewport */}
      <div className="animate-fadeIn">
        {children}
      </div>
    </div>
  )
}
