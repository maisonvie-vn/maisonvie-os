import Link from 'next/link'

interface EmailTemplate {
  code: string
  title: string
  subject: string
  body: string
  category: string
  language: string
}

export default function EmailTemplatesPage() {
  const templates: EmailTemplate[] = [
    {
      code: 'TMP-WELCOME',
      title: 'Chào đón & Xác nhận tư vấn đặt phòng tiệc',
      subject: 'Chào mừng quý khách đến với biệt thự cổ điển Maison Vie',
      body: 'Kính gửi quý khách [Tên Khách Hàng],\n\nMaison Vie xin chân thành cảm ơn sự quan tâm của quý khách dành cho không gian phòng tiệc tân cổ điển Pháp của biệt thự...\n\nTrân trọng,\nMaison Vie Team',
      category: 'Welcome / Đón tiếp',
      language: 'Tiếng Việt'
    },
    {
      code: 'TMP-CONFIRM',
      title: 'Xác nhận Đặt Bàn VIP thành công',
      subject: 'Xác nhận đặt bàn VIP tại Maison Vie - [Ngày]',
      body: 'Kính gửi quý khách [Tên Khách Hàng],\n\nMaison Vie xin xác nhận yêu cầu đặt bàn của quý khách đã được duyệt thành công:\n- Phòng tiệc: [Tên Phòng]\n- Thời gian: [Giờ] ngày [Ngày]\n- Số khách: [Số lượng]\n- Ghi chú thực đơn: [Thực đơn]\n\nMaison Vie rất hân hạnh được phục vụ quý khách tối nay.\n\nTrân trọng,\nMaison Vie Team',
      category: 'Confirmation / Xác nhận',
      language: 'Tiếng Việt'
    },
    {
      code: 'TMP-ALLERGY',
      title: 'Khảo sát và xác nhận dị ứng nghiêm trọng',
      subject: 'Lưu ý y tế và điều phối thực đơn nếm thử - Bếp trưởng Joel',
      body: 'Kính gửi quý khách [Tên Khách Hàng],\n\nĐể đảm bảo an toàn tuyệt đối cho bữa tiệc tối nay, Bếp trưởng Joel và đội ngũ ẩm thực Maison Vie đã ghi nhận lưu ý dị ứng: [Thông tin dị ứng]. Chúng tôi đã thực hiện cách ly bếp sơ chế và điều phối món thay thế...\n\nTrân trọng,\nMaison Vie Team',
      category: 'Allergy / Dị ứng thực phẩm',
      language: 'Tiếng Việt'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gold-border/40 pb-4">
        <div>
          <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
            📋 Mẫu email tiêu chuẩn (Templates)
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            Danh sách các mẫu thư liên hệ, xác nhận lịch hẹn và theo dõi dị ứng ẩm thực.
          </p>
        </div>
        <Link
          href="/emails"
          className="rounded border border-gold-border/40 hover:border-gold py-1.5 px-3.5 text-xs text-foreground/75 hover:text-gold transition-colors font-semibold"
        >
          Quay lại hộp thư
        </Link>
      </div>

      {/* Templates Catalog Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {templates.map((tpl) => (
          <div key={tpl.code} className="glass-panel rounded-xl p-6 border border-gold-border flex flex-col justify-between hover-gold-glow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono rounded bg-gold-muted border border-gold-border px-2.5 py-0.5 text-gold font-semibold">
                  {tpl.code}
                </span>
                <span className="text-[10px] text-foreground/50 font-mono">
                  {tpl.category}
                </span>
              </div>
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
                {tpl.title}
              </h3>
              
              <div className="space-y-2 text-xs font-sans">
                <div>
                  <strong className="text-gold block mb-0.5">Tiêu đề mẫu:</strong>
                  <p className="text-foreground/90 font-medium leading-relaxed">{tpl.subject}</p>
                </div>
                <div className="border-t border-gold-border/10 pt-2 mt-2">
                  <strong className="text-gold block mb-0.5">Nội dung khung:</strong>
                  <p className="text-foreground/70 leading-relaxed whitespace-pre-line text-[11px] bg-background/30 p-2.5 rounded border border-gold-border/10 font-mono">{tpl.body}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-gold-border/20 pt-4 mt-6 text-[10px] text-foreground/40 font-mono flex items-center justify-between">
              <span>Ngôn ngữ: {tpl.language}</span>
              <span className="text-green-500 font-bold">Hoạt động</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
