import { vi } from '@/lib/i18n/vi'

export default function FeaturesPage() {
  const features = [
    {
      code: 'FEAT-010',
      epic: 'EPIC-001',
      title: 'Kiến trúc Next.js App Router & Global Styles',
      desc: 'Thiết kế cấu trúc dự án Next.js, cấu hình theme tân cổ điển thau/vàng đồng trong file globals.css.',
      status: vi.approved,
      priority: 'Cao',
      owner: 'Trưởng nhóm phát triển',
      progress: 100,
      version: 'v0.1.0'
    },
    {
      code: 'FEAT-020',
      epic: 'EPIC-002',
      title: 'Bản đồ năng lực & Sơ đồ bộ phận vận hành',
      desc: 'Mô tả cấu trúc 12 Core Domains và phân bổ vai trò nghiệp vụ quản lý cho nhân viên biệt thự.',
      status: vi.approved,
      priority: 'Cao',
      owner: 'Kiến trúc sư trưởng',
      progress: 100,
      version: 'v0.2.0'
    },
    {
      code: 'FEAT-030',
      epic: 'EPIC-003',
      title: 'MVOS Studio Project Management Views',
      desc: 'Xây dựng giao diện danh sách Epics, Features, Specs, Tasks, ADRs, Releases và RFCs.',
      status: vi.inProgress,
      priority: 'Cao',
      owner: 'Kỹ sư Antigravity',
      progress: 50,
      version: 'v0.3.0'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div>
          <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
            ✨ Danh sách {vi.feature}
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Quản lý phân rã các tính năng nghiệp vụ chi tiết của hệ điều hành.
          </p>
        </div>
        <button className="rounded border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all">
          + Tạo {vi.feature} mới
        </button>
      </div>

      {/* Features Table */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mã Tính Năng</th>
                <th className="py-3 px-4">Epic</th>
                <th className="py-3 px-4">Tiêu đề</th>
                <th className="py-3 px-4">{vi.owner}</th>
                <th className="py-3 px-4 text-center">{vi.progress}</th>
                <th className="py-3 px-4 text-center">{vi.version}</th>
                <th className="py-3 px-4 text-right">{vi.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {features.map((feat) => (
                <tr key={feat.code} className="hover:bg-gold-muted/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gold font-bold">{feat.code}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-foreground/60">{feat.epic}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{feat.title}</div>
                    <div className="text-[10px] text-foreground/50 mt-0.5">{feat.desc}</div>
                  </td>
                  <td className="py-3.5 px-4">{feat.owner}</td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 bg-background border border-gold-border/20 rounded-full h-2 overflow-hidden">
                        <div className="bg-gold h-full rounded-full" style={{ width: `${feat.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-gold">{feat.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-foreground/60">{feat.version}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold tracking-wider ${
                      feat.status === vi.approved
                        ? 'bg-green-500/10 border border-green-500/25 text-green-500'
                        : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
                    }`}>
                      {feat.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
