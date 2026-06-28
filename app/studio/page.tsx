import Link from 'next/link'
import { vi } from '@/lib/i18n/vi'

export default function StudioOverviewPage() {
  const modules = [
    { title: vi.epic, desc: 'Quản lý các nhóm yêu cầu lớn (Epic) trong dự án.', href: '/studio/epics', count: 4, icon: '🎯' },
    { title: vi.feature, desc: 'Chi tiết các tính năng nghiệp vụ được phân rã.', href: '/studio/features', count: 12, icon: '✨' },
    { title: vi.spec, desc: 'Các tài liệu đặc tả kỹ thuật và nghiệp vụ chính thức.', href: '/studio/specifications', count: 8, icon: '📖' },
    { title: vi.task, desc: 'Các đầu việc kỹ thuật chi tiết của kỹ sư phát triển.', href: '/studio/tasks', count: 24, icon: '🛠️' },
    { title: vi.adr, desc: 'Nhật ký các quyết định thiết kế kiến trúc hệ thống.', href: '/studio/adr', count: 5, icon: '🏛️' },
    { title: vi.release, desc: 'Lịch trình đóng gói và phát hành các phiên bản phần mềm.', href: '/studio/releases', count: 2, icon: '🚀' },
    { title: vi.changeRequest, desc: 'Yêu cầu thay đổi phạm vi hoặc sửa đổi hệ thống.', href: '/studio/change-requests', count: 1, icon: '🔄' },
  ]

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          {vi.studio} - {vi.projectOverview}
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Bảng điều khiển quản lý dự án nội bộ và tiến độ phát triển Maison Vie Operating System.
        </p>
      </div>

      {/* Grid of Studio Modules */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod) => (
          <Link
            key={mod.href}
            href={mod.href}
            className="group glass-panel hover-gold-glow rounded-xl p-6 flex flex-col justify-between transition-all duration-300 min-h-[180px]"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{mod.icon}</span>
                <span className="text-[10px] font-mono rounded bg-gold-muted border border-gold-border px-2 py-0.5 text-gold font-bold">
                  {mod.count} mục
                </span>
              </div>
              <h3 className="text-lg font-serif-cormorant font-bold text-gold group-hover:text-gold-hover mt-4 mb-2">
                {mod.title}
              </h3>
              <p className="text-xs text-foreground/75 font-sans leading-relaxed">
                {mod.desc}
              </p>
            </div>
            <div className="text-xs font-semibold text-gold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
              Truy cập quản lý <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
