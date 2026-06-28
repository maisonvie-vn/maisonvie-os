import { vi } from '@/lib/i18n/vi'

export default function EpicsPage() {
  const epics = [
    {
      code: 'EPIC-001',
      title: 'Maison Vie OS Foundation',
      desc: 'Thiết lập khung làm việc cơ bản Next.js, tích hợp Supabase SDK, cấu hình CSS tân cổ điển và bảo mật RLS.',
      status: vi.approved,
      priority: 'Cao',
      owner: 'Trưởng bộ phận kỹ thuật',
      sprint: 'Sprint 0.1',
      progress: 100,
      version: 'v0.1.0'
    },
    {
      code: 'EPIC-002',
      title: 'Maison Vie Enterprise Architecture',
      desc: 'Xây dựng bản đồ năng lực doanh nghiệp, phân bổ cơ cấu bộ phận và cấu hình thiết kế cơ sở dữ liệu cốt lõi.',
      status: vi.approved,
      priority: 'Cao',
      owner: 'Kiến trúc sư trưởng',
      sprint: 'Sprint 1.0',
      progress: 100,
      version: 'v0.2.0'
    },
    {
      code: 'EPIC-003',
      title: 'Maison Vie Studio Project Management',
      desc: 'Xây dựng phân hệ quản trị dự án nội bộ cho phép lập kế hoạch và theo dõi các tính năng, đặc tả, công việc.',
      status: vi.inProgress,
      priority: 'Trung bình',
      owner: 'Kỹ sư Antigravity',
      sprint: 'Sprint 1.0',
      progress: 40,
      version: 'v0.3.0'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div>
          <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
            🎯 Danh sách {vi.epic}
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Quản lý các nhóm yêu cầu nghiệp vụ cấp cao và tiến độ phát hành.
          </p>
        </div>
        <button className="rounded border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all">
          + Tạo {vi.epic} mới
        </button>
      </div>

      {/* Epics Table */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mã Epic</th>
                <th className="py-3 px-4">Tiêu đề</th>
                <th className="py-3 px-4">{vi.owner}</th>
                <th className="py-3 px-4 text-center">Sprint</th>
                <th className="py-3 px-4 text-center">{vi.progress}</th>
                <th className="py-3 px-4 text-center">{vi.version}</th>
                <th className="py-3 px-4 text-right">{vi.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {epics.map((epic) => (
                <tr key={epic.code} className="hover:bg-gold-muted/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gold font-bold">{epic.code}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{epic.title}</div>
                    <div className="text-[10px] text-foreground/50 mt-0.5">{epic.desc}</div>
                  </td>
                  <td className="py-3.5 px-4">{epic.owner}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-foreground/60">{epic.sprint}</td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 bg-background border border-gold-border/20 rounded-full h-2 overflow-hidden">
                        <div className="bg-gold h-full rounded-full" style={{ width: `${epic.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-gold">{epic.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-foreground/60">{epic.version}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold tracking-wider ${
                      epic.status === vi.approved
                        ? 'bg-green-500/10 border border-green-500/25 text-green-500'
                        : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
                    }`}>
                      {epic.status}
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
