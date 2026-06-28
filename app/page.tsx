import Link from 'next/link'

export default function HomePage() {
  const features = [
    {
      title: 'Bảng điều khiển Vận hành',
      description: 'Số liệu thời gian thực, thống kê khách hàng, luồng công việc đang hoạt động và trạng thái hệ thống.',
      icon: '📊',
      href: '/dashboard',
    },
    {
      title: 'Tài liệu Hệ thống',
      description: 'Hướng dẫn kỹ thuật và quy chuẩn phát triển cho hệ điều hành Maison Vie OS.',
      icon: '📖',
      href: '/docs',
    },
    {
      title: 'Quy trình vận hành tiêu chuẩn',
      description: 'Quy định biệt thự tân cổ điển chính thức, quy trình nhân viên và giao thức phòng ăn.',
      icon: '🏛️',
      href: '/sop',
    },
    {
      title: 'Quản trị Hệ thống',
      description: 'Cấu hình cơ sở dữ liệu, đồng bộ Supabase, kiểm tra môi trường và cài đặt an toàn.',
      icon: '⚙️',
      href: '/admin',
    },
  ]

  const folders = [
    { name: '/app', desc: 'Trang giao diện client & bộ xử lý định tuyến (App router)' },
    { name: '/components', desc: 'Các khối giao diện dùng chung, thẻ, danh sách & thanh điều hướng' },
    { name: '/lib', desc: 'Cấu hình dịch vụ bên thứ ba & thư viện hỗ trợ (Supabase Client)' },
    { name: '/database', desc: 'Cấu trúc cơ sở dữ liệu, mã di chuyển (migration) & dữ liệu mẫu' },
    { name: '/prompts', desc: 'Biểu mẫu tác nhân AI & các phiên bản hướng dẫn hệ thống' },
    { name: '/workflows', desc: 'Quy trình tự động hóa & mã kiểm tra Edge Function' },
    { name: '/agents', desc: 'Mã thực thi & định nghĩa cho tác nhân dịch vụ tự động' },
  ]

  return (
    <div className="space-y-12 py-4">
      {/* Hero section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto py-8">
        <h1 className="text-5xl md:text-6xl font-serif-cormorant font-bold tracking-tight">
          Hệ Điều Hành Biệt Thự <br />
          <span className="gold-gradient-text">Tân Cổ Điển Pháp</span>
        </h1>
        <p className="text-foreground/80 font-serif-cormorant italic text-xl tracking-wider">
          {"\"L'art de vivre et la technologie harmonisée.\""}
        </p>
        <p className="text-foreground/60 text-sm max-w-xl mx-auto font-sans leading-relaxed">
          Maison Vie OS điều phối trải nghiệm khách hàng, định tuyến đặt bàn, quy trình tác nhân tự động 
          và quy trình vận hành tiêu chuẩn cho biệt thự và nhà hàng tân cổ điển cao cấp.
        </p>
      </section>

      {/* Grid of Main Features */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feat) => (
          <Link
            key={feat.href}
            href={feat.href}
            className="group glass-panel hover-gold-glow rounded-xl p-6 flex flex-col justify-between transition-all duration-300 min-h-[220px]"
          >
            <div>
              <span className="text-3xl mb-4 block group-hover:scale-110 transition-transform duration-200">
                {feat.icon}
              </span>
              <h3 className="text-lg font-serif-cormorant font-bold tracking-wide text-gold group-hover:text-gold-hover mb-2">
                {feat.title}
              </h3>
              <p className="text-xs text-foreground/70 font-sans leading-relaxed">
                {feat.description}
              </p>
            </div>
            <div className="text-xs font-semibold text-gold mt-4 flex items-center gap-1 group-hover:translate-x-1 transition-transform duration-200">
              Truy cập Phân hệ <span>→</span>
            </div>
          </Link>
        ))}
      </section>

      {/* Directory Layout Section */}
      <section className="glass-panel rounded-2xl p-8 border border-gold-border">
        <div className="border-b border-gold-border/40 pb-4 mb-6">
          <h2 className="text-2xl font-serif-cormorant font-bold tracking-wide text-gold">
            📁 Cấu Trúc Tệp Tin Hệ Thống
          </h2>
          <p className="text-xs text-foreground/50 mt-1">
            Sơ đồ ánh xạ thư mục tiêu chuẩn được cấu hình cho quy trình phát triển Maison Vie OS.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {folders.map((f) => (
            <div key={f.name} className="flex gap-3 items-start p-3 rounded-lg hover:bg-gold-muted/30 transition-colors duration-150">
              <span className="text-xl">📁</span>
              <div>
                <code className="text-xs font-semibold text-gold tracking-wider">{f.name}</code>
                <p className="text-[11px] text-foreground/60 mt-1">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
