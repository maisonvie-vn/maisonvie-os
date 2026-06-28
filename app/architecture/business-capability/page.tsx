export default function BusinessCapabilityPage() {
  const domains = [
    { name: 'Guest & Reservation (Khách hàng & Đặt bàn)', desc: 'Quản lý hồ sơ khách hàng, phân loại VIP, ghi nhận sở thích ăn uống và quy trình đặt bàn.' },
    { name: 'FOH Service (Dịch vụ sảnh đón tiếp)', desc: 'Điều phối xếp bàn, phục vụ trực tiếp, quản lý các thông số ánh sáng, nhạc nền và nhiệt độ phòng tiệc.' },
    { name: 'Kitchen & Production (Điều phối Bếp)', desc: 'Tổ chức sơ chế, nấu nướng, trang trí món ăn và điều phối thứ tự lên đĩa phòng tránh dị ứng.' },
    { name: 'Menu & Recipe (Thực đơn & Công thức)', desc: 'Xây dựng thực đơn nếm thử, định lượng nguyên liệu cấu thành món ăn và quản lý giá vốn.' },
    { name: 'Inventory & Purchasing (Kho & Mua hàng)', desc: 'Theo dõi lượng tồn kho thực phẩm, tự động cảnh báo sắp hết và lập phiếu đề xuất mua hàng.' },
    { name: 'Accounting & VAT (Kế toán & Thuế)', desc: 'Xử lý hóa đơn thanh toán, thu thập thông tin thuế VAT, đối soát tiền két và báo cáo doanh thu.' },
    { name: 'HR & Training (Nhân sự & Đào tạo)', desc: 'Xếp lịch ca làm việc cho nhân viên, kiểm tra năng lực SOP dịch vụ tân cổ điển và lưu trữ hồ sơ.' },
    { name: 'Marketing & CRM (Quan hệ khách hàng)', desc: 'Duy trì kết nối với khách VIP, gửi ưu đãi sinh nhật và phân tích đánh giá phản hồi.' },
    { name: 'Quality & Compliance (Chất lượng & Tuân thủ)', desc: 'Thực hiện kiểm tra vệ sinh an toàn thực phẩm, bảo trì cơ sở hạ tầng biệt thự và phòng cháy.' },
    { name: 'Document & Knowledge (Tài liệu & Tri thức)', desc: 'Lưu trữ quy trình SOP chính thức, kiểm soát phiên bản tài liệu và phân quyền đọc tài liệu.' },
    { name: 'AI & Automation (Tác nhân tự động)', desc: 'Giám sát hoạt động của các tác nhân AI chạy ngầm và đối soát quy tắc nghiệp vụ hệ thống.' },
    { name: 'CEO & Governance (Quản trị chiến lược)', desc: 'Theo dõi tiến độ hoàn thành sprint, phê duyệt ngân sách và đối chiếu mục tiêu dài hạn.' }
  ]

  const kpis = [
    { target: 'Tỷ lệ lấp đầy bàn VIP', metric: '> 95%' },
    { target: 'Tuân thủ nhiệt độ phòng tiệc (22°C)', metric: 'Duy trì 100% thời gian' },
    { target: 'Sự cố nhiễm chéo dị ứng thực phẩm', metric: '0 trường hợp' },
    { target: 'Chênh lệch kiểm kê kho thực tế', metric: '< 0.5%' },
    { target: 'Độ chính xác đối soát doanh thu & VAT', metric: '100%' },
    { target: 'Tỷ lệ hoàn thành nhiệm vụ Sprint', metric: '> 90%' }
  ]

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          Bản đồ năng lực doanh nghiệp
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Định nghĩa 12 nhóm năng lực nghiệp vụ cốt lõi của nhà hàng biệt thự Maison Vie.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left 2 Columns: Overview & Capabilities */}
        <div className="md:col-span-2 space-y-8">
          {/* Overview */}
          <section className="glass-panel rounded-xl p-6 border border-gold-border space-y-3">
            <h2 className="text-xl font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              1. Tổng quan Bản đồ năng lực (Level 0 - Level 3)
            </h2>
            <p className="text-xs text-foreground/85 leading-relaxed font-sans">
              Bản đồ năng lực phân rã toàn bộ hoạt động của Maison Vie thành các khối chức năng tĩnh độc lập. 
              Mỗi khối (Domain) được cấu trúc từ cấp cao nhất (Level 0 - Toàn bộ Nhà hàng) qua các miền nghiệp vụ (Level 1) 
              đến các năng lực nghiệp vụ chi tiết (Level 2) và quy trình thực thi SOP thực tế (Level 3). 
              Sơ đồ này là nền tảng cốt lõi để xây dựng cấu trúc cơ sở dữ liệu và phân vùng điều phối cho các tác nhân AI sau này.
            </p>
          </section>

          {/* Core Domains */}
          <section className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h2 className="text-xl font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              2. 12 Nhóm năng lực chính (Core Domains)
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {domains.map((domain, index) => (
                <div key={index} className="p-3.5 rounded-lg border border-gold-border/10 bg-gold-muted/5 space-y-1 hover:bg-gold-muted/10 transition-colors">
                  <h4 className="text-xs font-semibold text-gold tracking-wide">{domain.name}</h4>
                  <p className="text-[11px] text-foreground/75 leading-relaxed font-sans">{domain.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Data, KPIs & Risks */}
        <div className="space-y-6">
          {/* Data Objects */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              💾 Cấu trúc dữ liệu liên quan
            </h3>
            <p className="text-xs text-foreground/80 leading-relaxed font-sans">
              Toàn bộ năng lực được vận hành dựa trên các thực thể dữ liệu tiếng Anh đồng bộ:
            </p>
            <div className="grid grid-cols-2 gap-2 font-mono text-[10px] text-foreground/70">
              <div>• reservations</div>
              <div>• customer_profiles</div>
              <div>• recipes</div>
              <div>• inventory_items</div>
              <div>• transactions</div>
              <div>• audit_logs</div>
              <div>• ai_agents</div>
              <div>• business_rules</div>
            </div>
          </div>

          {/* KPIs */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              📊 Chỉ số hiệu suất cần đo (KPIs)
            </h3>
            <div className="space-y-2.5">
              {kpis.map((kpi, idx) => (
                <div key={idx} className="flex justify-between border-b border-gold-border/10 pb-1.5 text-xs">
                  <span className="text-foreground/75">{kpi.target}</span>
                  <span className="font-mono text-gold font-bold">{kpi.metric}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risks */}
          <div className="glass-panel rounded-xl p-6 border border-yellow-500/10 bg-yellow-500/5 space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-yellow-500 tracking-wide border-b border-yellow-500/20 pb-2">
              ⚠️ Rủi ro nếu không chuẩn hóa
            </h3>
            <ul className="list-disc list-inside text-[11px] text-foreground/80 space-y-1.5 font-sans">
              <li>Xếp bàn trùng lịch cho khách VIP dẫn đến trải nghiệm dịch vụ giảm sút.</li>
              <li>Thông tin dị ứng thực phẩm của khách bị bỏ sót gây nguy hiểm trực tiếp.</li>
              <li>Thất thoát nguyên liệu kho do chênh lệch kiểm kê thực tế cao.</li>
              <li>Báo cáo thuế thiếu chính xác gây rủi ro phạt tài chính.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
