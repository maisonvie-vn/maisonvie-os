import { vi } from '@/lib/i18n/vi'

export default function ADRPage() {
  const adrs = [
    {
      code: 'ADR-001',
      title: 'Thiết kế Giao diện Phân hệ (Frontend UI) sử dụng Tiếng Việt',
      context: 'Quy chuẩn vận hành biệt thự yêu cầu giao diện người dùng phải thuận tiện cho nhân sự phục vụ tại Việt Nam.',
      decision: 'Chuyển đổi toàn bộ ngôn ngữ hiển thị trên UI sang tiếng Việt 100%, đồng thời giữ nguyên các định dạng đặt tên kỹ thuật ở database/API bằng tiếng Anh.',
      consequences: 'Cải thiện trải nghiệm nhân sự, đồng nhất quy chuẩn kỹ thuật hệ thống.',
      status: vi.approved,
      owner: 'Kiến trúc sư trưởng',
      date: '2026-06-28'
    },
    {
      code: 'ADR-002',
      title: 'Cô lập kết nối Database trực tiếp qua Supabase RLS',
      context: 'Hệ thống cần đảm bảo an toàn tuyệt đối cho thông tin VIP và các log nội bộ.',
      decision: 'Kích hoạt chính sách Row Level Security (RLS) cho tất cả các bảng dữ liệu của MVOS và MVOS Studio.',
      consequences: 'Ngăn chặn rò rỉ dữ liệu qua các token rác của client.',
      status: vi.approved,
      owner: 'Hội đồng kỹ thuật',
      date: '2026-06-28'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div>
          <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
            🏛️ Quyết định kiến trúc (ADR)
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Nhật ký lưu trữ các quyết định thiết kế kỹ thuật và kiến trúc hệ thống cốt lõi.
          </p>
        </div>
        <button className="rounded border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all">
          + Ghi nhận ADR mới
        </button>
      </div>

      {/* ADR Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {adrs.map((adr) => (
          <div key={adr.code} className="glass-panel rounded-xl p-6 border border-gold-border flex flex-col justify-between hover-gold-glow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono rounded bg-gold-muted border border-gold-border px-2.5 py-0.5 text-gold font-semibold">
                  {adr.code}
                </span>
                <span className="text-[10px] text-foreground/50 font-mono">
                  Ngày quyết định: {adr.date}
                </span>
              </div>
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
                {adr.title}
              </h3>
              
              <div className="space-y-2 text-xs font-sans">
                <div>
                  <strong className="text-gold block mb-0.5">Bối cảnh (Context):</strong>
                  <p className="text-foreground/80 leading-relaxed">{adr.context}</p>
                </div>
                <div>
                  <strong className="text-gold block mb-0.5">Quyết định (Decision):</strong>
                  <p className="text-foreground/80 leading-relaxed">{adr.decision}</p>
                </div>
                <div>
                  <strong className="text-gold block mb-0.5">Hệ quả (Consequences):</strong>
                  <p className="text-foreground/80 leading-relaxed">{adr.consequences}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gold-border/20 pt-4 mt-6 text-[10px] text-foreground/40 font-mono flex items-center justify-between">
              <span>Người sở hữu: {adr.owner}</span>
              <span className="text-green-500 font-bold">{adr.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
