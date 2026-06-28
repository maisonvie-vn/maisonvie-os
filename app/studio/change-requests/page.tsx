import { vi } from '@/lib/i18n/vi'

export default function ChangeRequestsPage() {
  const rfcs = [
    {
      code: 'RFC-001',
      title: 'Tăng cường hiển thị màu thau/vàng đồng và chữ trắng tinh trên UI',
      desc: 'Thay đổi hệ mã màu nền từ #FBF8F4 sang màu tối hơn (#102B2A và #042726) để gia tăng chiều sâu cổ điển, chuyển đổi chữ màu sáng nhẹ thành chữ màu trắng để nâng cao độ tương phản.',
      reason: 'Yêu cầu thẩm mỹ từ chủ biệt thự và kiến trúc sư trưởng để đảm bảo tính mỹ thuật cao cấp.',
      impact: 'Cần cập nhật các biến màu trong file app/globals.css và điều chỉnh một số component hiển thị.',
      status: vi.approved,
      requestedBy: 'Chủ biệt thự Maison Vie',
      approvedBy: 'Kiến trúc sư trưởng'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div>
          <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
            🔄 Yêu cầu thay đổi (RFC)
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Quản lý và phê duyệt các đề xuất thay đổi thiết kế hoặc phạm vi hệ thống.
          </p>
        </div>
        <button className="rounded border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all">
          + Đề xuất RFC mới
        </button>
      </div>

      {/* RFC Cards List */}
      <div className="space-y-6">
        {rfcs.map((rfc) => (
          <div key={rfc.code} className="glass-panel rounded-xl p-6 border border-gold-border hover-gold-glow space-y-4">
            <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono rounded bg-gold-muted border border-gold-border px-2.5 py-0.5 text-gold font-bold">
                  {rfc.code}
                </span>
                <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
                  {rfc.title}
                </h3>
              </div>
              <span className="rounded px-2.5 py-0.5 text-[9px] font-bold tracking-wider bg-green-500/10 border border-green-500/25 text-green-500">
                {rfc.status}
              </span>
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-xs font-sans">
              <div className="space-y-1 md:col-span-2">
                <div>
                  <strong className="text-gold block mb-0.5">Đề xuất thay đổi (Description):</strong>
                  <p className="text-foreground/85 leading-relaxed">{rfc.desc}</p>
                </div>
                <div className="pt-2">
                  <strong className="text-gold block mb-0.5">Lý do thay đổi (Reason):</strong>
                  <p className="text-foreground/85 leading-relaxed">{rfc.reason}</p>
                </div>
                <div className="pt-2">
                  <strong className="text-gold block mb-0.5">Đánh giá tác động (Impact):</strong>
                  <p className="text-foreground/85 leading-relaxed">{rfc.impact}</p>
                </div>
              </div>

              <div className="border-t border-gold-border/20 pt-4 md:border-t-0 md:pt-0 md:border-l md:pl-4 space-y-3 font-mono text-[10px] text-foreground/60">
                <div>
                  <span className="block text-foreground/40 text-[9px] uppercase tracking-wider">Người đề xuất</span>
                  <span className="text-foreground font-semibold font-sans text-xs">{rfc.requestedBy}</span>
                </div>
                <div>
                  <span className="block text-foreground/40 text-[9px] uppercase tracking-wider">Người phê duyệt</span>
                  <span className="text-foreground font-semibold font-sans text-xs">{rfc.approvedBy}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
