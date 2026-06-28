import { vi } from '@/lib/i18n/vi'

interface Release {
  code: string
  version: string
  title: string
  desc: string
  releaseDate: string
  status: string
}

export default function ReleasesPage() {
  const releases: Release[] = [
    {
      code: 'REL-010',
      version: 'v0.1.0',
      title: 'MVOS v0.1 - Foundation Release',
      desc: 'Phát hành bản dựng nền tảng ban đầu bao gồm Next.js 15 App Router, cấu hình i18n tiếng Việt, cài đặt chính sách RLS và xây dựng phân hệ quản trị dự án Studio.',
      releaseDate: '2026-06-28',
      status: vi.inProgress
    }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div>
          <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
            🚀 Các phiên bản phát hành
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Lịch trình và nhật ký thay đổi qua từng phiên bản phát hành phần mềm.
          </p>
        </div>
        <button className="rounded border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all">
          + Lên lịch phát hành mới
        </button>
      </div>

      {/* Releases List */}
      <div className="space-y-4">
        {releases.map((rel) => (
          <div key={rel.code} className="glass-panel rounded-xl p-6 border border-gold-border hover-gold-glow flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono rounded bg-gold-muted border border-gold-border px-2 py-0.5 text-gold font-bold">
                  {rel.version}
                </span>
                <span className="text-xs text-foreground/50 font-mono">
                  Mã: {rel.code}
                </span>
              </div>
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
                {rel.title}
              </h3>
              <p className="text-xs text-foreground/80 leading-relaxed font-sans max-w-2xl">
                {rel.desc}
              </p>
            </div>

            <div className="flex flex-col items-end gap-2 border-t border-gold-border/20 pt-4 sm:border-t-0 sm:pt-0">
              <span className={`rounded px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${
                rel.status === vi.approved
                  ? 'bg-green-500/10 border border-green-500/25 text-green-500'
                  : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
              }`}>
                {rel.status}
              </span>
              <span className="text-[10px] text-foreground/50 font-mono">{rel.releaseDate}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
