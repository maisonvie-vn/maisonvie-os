
import Link from 'next/link'

export default function ArchitecturePage() {
  const sections = [
    {
      id: 'overview',
      title: 'Tổng quan kiến trúc',
      content: 'Kiến trúc hệ thống MVOS tuân thủ mô hình Client-Server phân lớp nghiêm ngặt. Phía giao diện client chạy trên Next.js 15, sử dụng Tailwind CSS v4 cho giao diện phong cách tân cổ điển. Phía cơ sở dữ liệu và xác thực được ủy quyền hoàn toàn cho Supabase với hệ thống PostgreSQL và các chính sách bảo mật cấp dòng (RLS).'
    },
    {
      id: 'capabilities',
      title: 'Năng lực doanh nghiệp',
      content: 'Hệ thống hỗ trợ các năng lực vận hành thực tế tại biệt thự Maison Vie bao gồm: Đón tiếp và quản lý đặt bàn khu vực sảnh (FOH), điều phối thực đơn nếm thử và các món ăn đặc biệt (Culinary), giám sát các chỉ số không gian như nhiệt độ, ánh sáng và nhạc nền (Operations), và cấu hình bảo mật hệ thống (Administration).'
    },
    {
      id: 'departments',
      title: 'Bộ phận vận hành',
      content: 'Quy trình nghiệp vụ của Maison Vie phân chia nhiệm vụ cụ thể cho 4 bộ phận chính:\n• Quản trị (Administration)\n• Vận hành kỹ thuật (Operations)\n• Lễ tân phục vụ (Front of House)\n• Ẩm thực & Bếp (Culinary)'
    },
    {
      id: 'data-core',
      title: 'Dữ liệu lõi',
      content: 'Dữ liệu của MVOS bao gồm các thực thể cốt lõi phục vụ vận hành: departments (bộ phận), roles (vai trò), user_profiles (thông tin người dùng), documents & document_versions (kho tài liệu và lịch sử phiên bản), sop_documents (quy trình tiêu chuẩn), business_rules (quy tắc nghiệp vụ), ai_agents (tác nhân AI) và audit_logs (nhật ký hệ thống).'
    },
    {
      id: 'permissions',
      title: 'Phân quyền',
      content: 'Chính sách phân quyền dựa trên vai trò (RBAC) kết hợp cùng Row Level Security (RLS). Người dùng thông thường có quyền đọc các tài liệu và thông tin chung đã được duyệt, nhưng chỉ có quyền cập nhật hồ sơ cá nhân hoặc tài liệu do chính mình tạo ra. Khóa bảo mật mức cao (Service Role) được cô lập hoàn toàn ở phía máy chủ.'
    },
    {
      id: 'status',
      title: 'Trạng thái triển khai',
      content: 'Hệ thống hiện đang ở giai đoạn "Sprint 1: Xây dựng nền tảng kiến trúc doanh nghiệp". Mọi cấu trúc tệp tin, sơ đồ phân vùng và tài liệu quy chuẩn kỹ thuật đã được thiết lập hoàn chỉnh ở môi trường cục bộ.'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          Kiến trúc hệ thống MVOS
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Quy chuẩn kỹ thuật, sơ đồ năng lực và mô hình vận hành của Maison Vie Operating System.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-4">
        {/* Navigation Sidebar */}
        <aside className="md:col-span-1 space-y-2">
          <h3 className="text-xs font-semibold text-gold tracking-wider uppercase mb-4 px-2">Phân mục</h3>
          <nav className="flex flex-col gap-1">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="text-xs text-foreground/80 hover:text-gold px-2 py-1.5 rounded hover:bg-gold-muted/10 transition-colors"
              >
                {sec.title}
              </a>
            ))}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="md:col-span-3 space-y-6">
          {sections.map((sec) => (
            <section
              key={sec.id}
              id={sec.id}
              className="glass-panel rounded-xl p-6 border border-gold-border space-y-3 scroll-mt-20 hover-gold-glow"
            >
              <h2 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
                {sec.title}
              </h2>
              <div className="text-xs text-foreground/85 leading-relaxed whitespace-pre-line font-sans">
                {sec.content}
              </div>
              {sec.id === 'capabilities' && (
                <div className="pt-2">
                  <Link href="/architecture/business-capability" className="text-xs text-gold hover:underline font-semibold">
                    Xem chi tiết: Bản đồ năng lực doanh nghiệp →
                  </Link>
                </div>
              )}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
