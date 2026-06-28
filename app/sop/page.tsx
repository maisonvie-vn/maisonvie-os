import { vi } from '@/lib/i18n/vi'

export default function SOPPage() {
  const sops = [
    {
      code: 'SOP-01',
      title: 'Đón Tiếp Khách VIP',
      role: 'Lễ tân / Front of House',
      steps: [
        'Chào đón khách hàng trong vòng 15 giây với lời chào trang trọng: "Chào mừng quý khách đến với Maison Vie, [Danh xưng/Tên]".',
        'Xác nhận ghi chú ăn uống và trạng thái đặt bàn VIP trên hệ thống Maison Vie OS.',
        'Dẫn khách tới phòng riêng được chỉ định (ví dụ: Salon Privé hoặc Le Jardin).',
        'Phục vụ các lựa chọn đồ uống khai vị (các dòng sâm panh Pháp cổ điển).'
      ]
    },
    {
      code: 'SOP-02',
      title: 'Điều phối Bếp & Đầu bếp',
      role: 'Quản lý nhà hàng / Chuyên gia rượu',
      steps: [
        'Liên hệ trực tiếp với Bếp trưởng Joel về các thay đổi trong thực đơn nếm thử theo yêu cầu khách.',
        'Ghi chú danh sách dị ứng của khách vào thẻ đặt bàn trên bảng điều khiển ngay lập tức.',
        'Đảm bảo bàn ăn đặc biệt (L\'Art Culinaire) được dọn dẹp và chuẩn bị xong 30 phút trước giờ hẹn.',
        'Thông báo cho nhân viên phục vụ ngay khi Đầu bếp báo hiệu bắt đầu trang trí món ăn lên đĩa.'
      ]
    },
    {
      code: 'SOP-03',
      title: 'Điều khiển không gian & Tiêu chuẩn cổ điển',
      role: 'Trưởng bộ phận vận hành',
      steps: [
        'Bật hệ thống chiếu sáng mặt tiền sang tông màu vàng ấm (phù hợp với không gian thau/vàng đồng) khi hoàng hôn.',
        'Nhạc nền chỉ sử dụng nhạc piano cổ điển hoặc các bản nhạc không lời truyền thống của Pháp.',
        'Nhiệt độ phòng riêng phải được duy trì ổn định ở mức 22°C (71.6°F) trong suốt thời gian hoạt động.',
        'Máy khuếch tán hương thơm phải được đổ đầy tinh dầu hoa nhài trắng dịu nhẹ.'
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          {vi.sop}
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Hướng dẫn hệ thống, chính sách đón tiếp và quy trình của nhân viên nhà hàng.
        </p>
      </div>

      {/* Grid of SOP files */}
      <div className="grid gap-6 md:grid-cols-3">
        {sops.map((sop) => (
          <div key={sop.code} className="glass-panel rounded-xl p-6 border border-gold-border flex flex-col justify-between hover-gold-glow">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono rounded bg-gold-muted border border-gold-border px-2.5 py-0.5 text-gold font-semibold">
                  {sop.code}
                </span>
                <span className="text-[10px] text-foreground/50 italic font-mono">
                  Vai trò: {sop.role}
                </span>
              </div>
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
                {sop.title}
              </h3>
              <ol className="list-decimal list-inside text-xs text-foreground/80 space-y-2 font-sans pl-1">
                {sop.steps.map((step, idx) => (
                  <li key={idx} className="leading-relaxed pl-1 text-[11px]">
                    <span className="text-foreground/90">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="border-t border-gold-border/20 pt-4 mt-6 text-[10px] text-foreground/40 font-mono flex items-center justify-between">
              <span>Trạng thái: Hoạt động</span>
              <span>Cập nhật: 2026-06-28</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
