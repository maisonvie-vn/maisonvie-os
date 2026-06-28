import { vi } from '@/lib/i18n/vi'

export default function SpecificationsPage() {
  const specs = [
    {
      code: 'SPEC-0001',
      feature: 'FEATURE-0001',
      title: 'MVOS Project Governance',
      status: vi.approved,
      version: 'v1.0',
      owner: 'Kiến trúc sư trưởng',
      reviewer: 'Hội đồng quản trị',
      approvedAt: '2026-06-28',
      filePath: '/docs/00_project/AI_DEVELOPMENT_RULES.md'
    },
    {
      code: 'SPEC-0002',
      feature: 'FEATURE-0008',
      title: 'MVOS Language Policy',
      status: vi.approved,
      version: 'v1.0',
      owner: 'Kiến trúc sư trưởng',
      reviewer: 'Hội đồng quản trị',
      approvedAt: '2026-06-28',
      filePath: '/docs/00_project/LANGUAGE_POLICY.md'
    },
    {
      code: 'SPEC-0003',
      feature: 'FEATURE-0005',
      title: 'MVOS Enterprise Architecture',
      status: vi.approved,
      version: 'v1.0',
      owner: 'Kiến trúc sư trưởng',
      reviewer: 'Kiến trúc sư trưởng',
      approvedAt: '2026-06-28',
      filePath: '/specifications/SPEC_001_ENTERPRISE_ARCHITECTURE.md'
    },
    {
      code: 'SPEC-0004',
      feature: 'FEATURE-0005',
      title: 'Business Capability Map',
      status: vi.approved,
      version: 'v1.0',
      owner: 'Kiến trúc sư trưởng',
      reviewer: 'Kiến trúc sư trưởng',
      approvedAt: '2026-06-28',
      filePath: '/specifications/SPEC_002_BUSINESS_CAPABILITY_MAP.md'
    },
    {
      code: 'SPEC-0005',
      feature: 'FEATURE-0004',
      title: 'MVOS Studio Specification',
      status: vi.approved,
      version: 'v1.0',
      owner: 'Kỹ sư Antigravity',
      reviewer: 'Kiến trúc sư trưởng',
      approvedAt: '2026-06-28',
      filePath: '/specifications/SPEC_005_PERMISSION_ARCHITECTURE.md'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div>
          <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
            📖 Danh sách {vi.spec}
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Quản lý các tài liệu đặc tả nghiệp vụ, kiến trúc và kỹ thuật chính thức.
          </p>
        </div>
        <button className="rounded border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all">
          + Tạo {vi.spec} mới
        </button>
      </div>

      {/* Specifications Table */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mã Đặc Tả</th>
                <th className="py-3 px-4">Tính Năng</th>
                <th className="py-3 px-4">Tiêu đề</th>
                <th className="py-3 px-4">{vi.owner}</th>
                <th className="py-3 px-4">Người duyệt</th>
                <th className="py-3 px-4">Đường dẫn tệp</th>
                <th className="py-3 px-4 text-right">{vi.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {specs.map((spec) => (
                <tr key={spec.code} className="hover:bg-gold-muted/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gold font-bold">{spec.code}</td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-foreground/60">{spec.feature}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{spec.title}</div>
                    <div className="text-[10px] text-foreground/50 mt-0.5">Phiên bản: {spec.version} | Phê duyệt: {spec.approvedAt}</div>
                  </td>
                  <td className="py-3.5 px-4">{spec.owner}</td>
                  <td className="py-3.5 px-4">{spec.reviewer}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-foreground/50">{spec.filePath}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-block rounded px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${
                      spec.status === vi.approved
                        ? 'bg-green-500/10 border border-green-500/25 text-green-500'
                        : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
                    }`}>
                      {spec.status}
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
