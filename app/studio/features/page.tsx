import { vi } from '@/lib/i18n/vi'

export default function FeaturesPage() {
  const features = [
    { code: 'FEATURE-0001', epic: 'EPIC-000', title: 'Epic Management', desc: 'Giao diện quản lý danh sách yêu cầu cấp cao.', status: vi.approved, priority: 'Cao', owner: 'Kỹ sư Antigravity', progress: 100, version: 'v0.3.0' },
    { code: 'FEATURE-0002', epic: 'EPIC-000', title: 'Feature Management', desc: 'Giao diện phân rã các tính năng nghiệp vụ.', status: vi.approved, priority: 'Cao', owner: 'Kỹ sư Antigravity', progress: 100, version: 'v0.3.0' },
    { code: 'FEATURE-0003', epic: 'EPIC-000', title: 'Specification Library', desc: 'Thư viện đặc tả kỹ thuật dự án.', status: vi.approved, priority: 'Trung bình', owner: 'Kỹ sư Antigravity', progress: 100, version: 'v0.3.0' },
    { code: 'FEATURE-0004', epic: 'EPIC-000', title: 'Task Management', desc: 'Giao diện quản lý đầu việc kỹ thuật chi tiết.', status: vi.approved, priority: 'Cao', owner: 'Kỹ sư Antigravity', progress: 100, version: 'v0.3.0' },
    { code: 'FEATURE-0005', epic: 'EPIC-000', title: 'Architecture Decision Records', desc: 'Lưu trữ các quyết định thiết kế kiến trúc (ADR).', status: vi.approved, priority: 'Trung bình', owner: 'Kỹ sư Antigravity', progress: 100, version: 'v0.3.0' },
    { code: 'FEATURE-0006', epic: 'EPIC-000', title: 'Release Notes', desc: 'Lịch sử phát hành các phiên bản phần mềm.', status: vi.approved, priority: 'Trung bình', owner: 'Kỹ sư Antigravity', progress: 100, version: 'v0.3.0' },
    { code: 'FEATURE-0007', epic: 'EPIC-000', title: 'Change Requests', desc: 'Nhật ký yêu cầu thay đổi (RFC).', status: vi.approved, priority: 'Cao', owner: 'Kỹ sư Antigravity', progress: 100, version: 'v0.3.0' },
    { code: 'FEATURE-0008', epic: 'EPIC-000', title: 'Enterprise Dictionary', desc: 'Từ điển các khái niệm nghiệp vụ lõi.', status: vi.draft, priority: 'Cao', owner: 'Kỹ sư Antigravity', progress: 0, version: 'v0.4.0' }
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
