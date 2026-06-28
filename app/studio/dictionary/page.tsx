import { vi } from '@/lib/i18n/vi'

export default function DictionaryPage() {
  const terms = [
    { code: 'TERM-GUEST', name: 'Guest', viName: 'Khách hàng', enName: 'Guest', domain: 'Guest & Reservation', def: 'Người sử dụng dịch vụ ăn uống và tham quan tại biệt thự Maison Vie.', owner: 'FOH Lead', module: 'Guest & Reservation', table: 'guests', workflow: 'SOP-01: Đón tiếp khách VIP', kpi: 'Tỷ lệ khách quay lại', status: vi.approved, version: '1.0' },
    { code: 'TERM-RESERV', name: 'Reservation', viName: 'Đặt bàn', enName: 'Reservation', domain: 'Guest & Reservation', def: 'Hồ sơ đăng ký giữ chỗ trước của khách hàng cho một ngày giờ và bàn cụ thể.', owner: 'FOH Lead', module: 'Guest & Reservation', table: 'reservations', workflow: 'SOP-01: Đón tiếp khách VIP', kpi: 'Tỷ lệ lấp đầy bàn VIP', status: vi.approved, version: '1.0' },
    { code: 'TERM-MENU', name: 'Menu', viName: 'Thực đơn', enName: 'Menu', domain: 'Menu & Recipe', def: 'Danh sách các món ăn và đồ uống được thiết kế phục vụ cho thực khách.', owner: 'Bếp trưởng', module: 'Kitchen OS', table: 'menus', workflow: 'SOP-02: Phối hợp Bếp', kpi: 'Sự hài lòng thực đơn', status: vi.approved, version: '1.0' },
    { code: 'TERM-RECIPE', name: 'Recipe', viName: 'Công thức', enName: 'Recipe', domain: 'Menu & Recipe', def: 'Định lượng chi tiết thành phần nguyên liệu và các bước chế biến món ăn.', owner: 'Bếp trưởng', module: 'Kitchen OS', table: 'recipes', workflow: 'SOP-02: Phối hợp Bếp', kpi: 'Độ hao hụt thành phẩm', status: vi.approved, version: '1.0' },
    { code: 'TERM-INGRED', name: 'Ingredient', viName: 'Nguyên liệu', enName: 'Ingredient', domain: 'Inventory & Purchasing', def: 'Thành phần thực phẩm thô phục vụ cho việc nấu nướng và pha chế.', owner: 'Bếp trưởng', module: 'Inventory OS', table: 'ingredients', workflow: 'SOP-02: Phối hợp Bếp', kpi: 'Tỷ lệ hao hụt nguyên liệu', status: vi.approved, version: '1.0' },
    { code: 'TERM-INVITEM', name: 'Inventory Item', viName: 'Hàng tồn kho', enName: 'Inventory Item', domain: 'Inventory & Purchasing', def: 'Sản phẩm hoặc nguyên liệu được bảo quản trong kho hàng cần kiểm kê.', owner: 'Thủ kho', module: 'Inventory OS', table: 'inventory_items', workflow: 'Đơn hàng mua sắm tự động', kpi: 'Chênh lệch tồn kho thực tế', status: vi.approved, version: '1.0' },
    { code: 'TERM-SUPPL', name: 'Supplier', viName: 'Nhà cung cấp', enName: 'Supplier', domain: 'Inventory & Purchasing', def: 'Đơn vị cung ứng thực phẩm hoặc dịch vụ bảo trì cho biệt thự.', owner: 'Thủ kho', module: 'Inventory OS', table: 'vendors', workflow: 'Quy trình đặt hàng NCC', kpi: 'Độ tin cậy giao hàng', status: vi.approved, version: '1.0' },
    { code: 'TERM-INVOI', 'name': 'Invoice', viName: 'Hóa đơn', enName: 'Invoice', domain: 'Accounting & VAT', def: 'Chứng từ thanh toán ghi nhận giá trị giao dịch của thực khách.', owner: 'Kế toán trưởng', module: 'Accounting OS', table: 'invoices', workflow: 'Quy trình thanh toán két', kpi: 'Doanh thu phòng ăn', status: vi.approved, version: '1.0' },
    { code: 'TERM-VATINVOI', name: 'VAT Invoice', viName: 'Hóa đơn VAT', enName: 'VAT Invoice', domain: 'Accounting & VAT', def: 'Hóa đơn tài chính chính thức có ghi nhận thuế giá trị gia tăng.', owner: 'Kế toán trưởng', module: 'Accounting OS', table: 'tax_ledgers', workflow: 'Báo cáo thuế hàng tháng', kpi: 'Tuân thủ đối soát VAT', status: vi.approved, version: '1.0' },
    { code: 'TERM-EMPLOY', name: 'Employee', viName: 'Nhân sự', enName: 'Employee', domain: 'HR & Training', def: 'Hồ sơ thông tin nhân viên đang làm việc trực tiếp tại biệt thự.', owner: 'CEO', module: 'Admin/HR Module', table: 'employees', workflow: 'Lập lịch ca làm việc', kpi: 'Tỷ lệ giữ chân nhân viên', status: vi.approved, version: '1.0' },
    { code: 'TERM-SOP', name: 'SOP', viName: 'Quy trình vận hành', enName: 'SOP', domain: 'Document & Knowledge', def: 'Tài liệu hướng dẫn từng bước chuẩn hóa nghiệp vụ phục vụ.', owner: 'Kiến trúc sư trưởng', module: 'Document Engine', table: 'sop_documents', workflow: 'Kiểm tra SOP định kỳ', kpi: 'Điểm kiểm tra nghiệp vụ', status: vi.approved, version: '1.0' },
    { code: 'TERM-TASK', name: 'Task', viName: 'Công việc', enName: 'Task', domain: 'AI & Automation', def: 'Đầu việc chi tiết được phân công cho kỹ sư hoặc nhân viên thực hiện.', owner: 'Kỹ sư Antigravity', module: 'MVOS Studio', table: 'tasks', workflow: 'Quy trình Sprint hàng tuần', kpi: 'Tỷ lệ hoàn thành nhiệm vụ', status: vi.approved, version: '1.0' },
    { code: 'TERM-EPIC', name: 'Epic', viName: 'Epic', enName: 'Epic', domain: 'CEO & Governance', def: 'Nhóm yêu cầu nghiệp vụ hoặc phân hệ tính năng lớn của hệ thống.', owner: 'Kiến trúc sư trưởng', module: 'MVOS Studio', table: 'epics', workflow: 'Báo cáo tiến độ Sprint', kpi: 'Tốc độ hoàn thiện phân hệ', status: vi.approved, version: '1.0' },
    { code: 'TERM-FEAT', name: 'Feature', viName: 'Tính năng', enName: 'Feature', domain: 'CEO & Governance', def: 'Đơn vị tính năng nghiệp vụ được phân rã cụ thể từ các Epic.', owner: 'Kiến trúc sư trưởng', module: 'MVOS Studio', table: 'features', workflow: 'Báo cáo tiến độ Sprint', kpi: 'Mật độ tính năng hoàn thành', status: vi.approved, version: '1.0' },
    { code: 'TERM-SPEC', name: 'Specification', viName: 'Đặc tả', enName: 'Specification', domain: 'Document & Knowledge', def: 'Tài liệu mô tả chi tiết yêu cầu kỹ thuật và luồng dữ liệu.', owner: 'Kiến trúc sư trưởng', module: 'MVOS Studio', table: 'specifications', workflow: 'Đánh giá kỹ thuật định kỳ', kpi: 'Độ chính xác đặc tả', status: vi.approved, version: '1.0' },
    { code: 'TERM-AGNT', name: 'AI Agent', viName: 'AI Agent', enName: 'AI Agent', domain: 'AI & Automation', def: 'Tác nhân trí tuệ nhân tạo chạy ngầm hỗ trợ tự động hóa nghiệp vụ.', owner: 'Kiến trúc sư trưởng', module: 'Agent Platform', table: 'ai_agents', workflow: 'Giám sát hoạt động Agent', kpi: 'Thời gian hoạt động liên tục', status: vi.approved, version: '1.0' }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div>
          <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
            📖 Từ điển doanh nghiệp
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Từ điển lưu trữ thuật ngữ nghiệp vụ lõi và ánh xạ kỹ thuật của Maison Vie.
          </p>
        </div>
        <button className="rounded border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all">
          + Thêm thuật ngữ mới
        </button>
      </div>

      {/* Dictionary Table */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80 min-w-[1200px]">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mã thuật ngữ</th>
                <th className="py-3 px-4">Tên tiếng Việt</th>
                <th className="py-3 px-4">Tên tiếng Anh</th>
                <th className="py-3 px-4">Nhóm nghiệp vụ</th>
                <th className="py-3 px-4 max-w-xs">Định nghĩa</th>
                <th className="py-3 px-4">Người phụ trách</th>
                <th className="py-3 px-4">Module liên quan</th>
                <th className="py-3 px-4">Bảng dữ liệu</th>
                <th className="py-3 px-4">Quy trình liên quan</th>
                <th className="py-3 px-4">KPI liên quan</th>
                <th className="py-3 px-4 text-center">Phiên bản</th>
                <th className="py-3 px-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {terms.map((term) => (
                <tr key={term.code} className="hover:bg-gold-muted/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-gold font-bold">{term.code}</td>
                  <td className="py-3 px-4 font-semibold text-foreground">{term.viName}</td>
                  <td className="py-3 px-4 italic text-foreground/90">{term.enName}</td>
                  <td className="py-3 px-4">{term.domain}</td>
                  <td className="py-3 px-4 text-[11px] text-foreground/75 leading-relaxed max-w-xs truncate hover:whitespace-normal transition-all">{term.def}</td>
                  <td className="py-3 px-4">{term.owner}</td>
                  <td className="py-3 px-4 text-foreground/70">{term.module}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-gold">{term.table}</td>
                  <td className="py-3 px-4 text-foreground/70">{term.workflow}</td>
                  <td className="py-3 px-4 text-foreground/70">{term.kpi}</td>
                  <td className="py-3 px-4 text-center font-mono text-[10px]">{term.version}</td>
                  <td className="py-3 px-4 text-right">
                    <span className="inline-block rounded px-2.5 py-0.5 text-[9px] font-bold tracking-wider bg-green-500/10 border border-green-500/25 text-green-500">
                      {term.status}
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
