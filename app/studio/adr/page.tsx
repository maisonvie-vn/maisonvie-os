import { vi } from '@/lib/i18n/vi'

export default function ADRPage() {
  const adrs = [
    {
      code: 'ADR-0001',
      title: 'Sử dụng GitHub làm Nguồn Sự Thật Duy Nhất (Source of Truth)',
      context: 'Mã nguồn, sơ đồ di chuyển SQL và tài liệu quy chuẩn kỹ thuật cần được lưu vết tập trung và quản lý phiên bản rõ ràng.',
      decision: 'Sử dụng GitHub làm kho chứa chính thức cho mã nguồn và tài liệu kiến trúc dự án MVOS.',
      consequences: 'Lịch sử thay đổi được bảo toàn đầy đủ và có khả năng khôi phục (rollback) nhanh chóng khi cần.',
      status: vi.approved,
      owner: 'Kiến trúc sư trưởng',
      date: '2026-06-28'
    },
    {
      code: 'ADR-0002',
      title: 'Sử dụng nền tảng Vercel để triển khai Front-end',
      context: 'Hệ thống cần môi trường phân phối tốc độ cao, hỗ trợ serverless và tối ưu hóa thời gian tải trang.',
      decision: 'Sử dụng nền tảng Vercel làm nơi triển khai các bản dựng tĩnh và máy chủ biên Next.js.',
      consequences: 'Tốc độ phản hồi cực nhanh cho nhân viên tiếp đón tại sảnh sảnh biệt thự.',
      status: vi.approved,
      owner: 'Kiến trúc sư trưởng',
      date: '2026-06-28'
    },
    {
      code: 'ADR-0003',
      title: 'Sử dụng Supabase cho Database và Xác thực',
      context: 'Hệ thống cần lưu trữ dữ liệu quan hệ an toàn, hỗ trợ cập nhật thời gian thực và quản lý tài khoản.',
      decision: 'Ủy quyền lưu trữ dữ liệu cho Supabase PostgreSQL và quản lý đăng nhập thông qua Supabase Auth.',
      consequences: 'Giảm thiểu tài nguyên tự dựng backend máy chủ và tận dụng tối đa bảo mật RLS.',
      status: vi.approved,
      owner: 'Hội đồng kỹ thuật',
      date: '2026-06-28'
    },
    {
      code: 'ADR-0004',
      title: 'Giao diện Phân hệ (Frontend UI) sử dụng Tiếng Việt',
      context: 'Quy chuẩn vận hành biệt thự yêu cầu giao diện người dùng phải thuận tiện cho nhân sự phục vụ tại Việt Nam.',
      decision: 'Chuyển đổi toàn bộ ngôn ngữ hiển thị trên UI sang tiếng Việt 100%, đồng thời giữ nguyên các định dạng đặt tên kỹ thuật ở database/API bằng tiếng Anh.',
      consequences: 'Cải thiện trải nghiệm nhân sự, đồng nhất quy chuẩn kỹ thuật hệ thống.',
      status: vi.approved,
      owner: 'Kiến trúc sư trưởng',
      date: '2026-06-28'
    },
    {
      code: 'ADR-0005',
      title: 'Tác nhân AI (AI Agents) phải tuân thủ nghiêm ngặt Đặc tả',
      context: 'Các tác nhân AI tự động cần hoạt động đúng ranh giới nghiệp vụ mà không tự ý sửa đổi kiến trúc.',
      decision: 'Tác nhân AI chỉ thực thi nhiệm vụ trong các file đặc tả chính thức, không thiết kế kiến trúc mới.',
      consequences: 'Tránh các quyết định sai lệch ảnh hưởng đến hoạt động thực tế.',
      status: vi.approved,
      owner: 'Hội đồng quản trị',
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
