import { vi } from '@/lib/i18n/vi'

export default function EpicsPage() {
  const epics = [
    { code: 'EPIC-000', title: 'MVOS Studio', desc: 'Hệ thống quản trị dự án nội bộ và tiến độ phát triển MVOS.', status: vi.approved, priority: 'Cao', owner: 'Kiến trúc sư trưởng', sprint: 'Sprint 1', progress: 10, version: 'v0.3.0' },
    { code: 'EPIC-001', title: 'Enterprise Architecture', desc: 'Đặc tả và cấu trúc kiến trúc doanh nghiệp Maison Vie.', status: vi.approved, priority: 'Cao', owner: 'Kiến trúc sư trưởng', sprint: 'Sprint 1', progress: 100, version: 'v0.2.0' },
    { code: 'EPIC-002', title: 'Reservation & Email OS', desc: 'Quy trình định tuyến đặt bàn và thông báo tự động cho khách hàng.', status: vi.draft, priority: 'Cao', owner: 'Bộ phận vận hành', sprint: 'Sprint 2', progress: 0, version: 'v0.4.0' },
    { code: 'EPIC-003', title: 'Document Engine', desc: 'Hệ thống quản lý tài liệu quy trình SOP và chính sách nội bộ.', status: vi.draft, priority: 'Trung bình', owner: 'Bộ phận vận hành', sprint: 'Sprint 3', progress: 0, version: 'v0.5.0' },
    { code: 'EPIC-004', title: 'Knowledge Engine', desc: 'Công cụ quản lý tri thức và hướng dẫn nhân viên phục vụ.', status: vi.draft, priority: 'Trung bình', owner: 'Bộ phận vận hành', sprint: 'Sprint 3', progress: 0, version: 'v0.6.0' },
    { code: 'EPIC-005', title: 'FOH OS', desc: 'Giao diện quản lý đặt bàn và quy trình tiếp đón sảnh.', status: vi.draft, priority: 'Cao', owner: 'Bộ phận lễ tân', sprint: 'Sprint 4', progress: 0, version: 'v0.7.0' },
    { code: 'EPIC-006', title: 'Kitchen OS', desc: 'Hệ điều hành phối hợp bếp ăn và thực đơn nếm thử.', status: vi.draft, priority: 'Cao', owner: 'Bếp trưởng', sprint: 'Sprint 4', progress: 0, version: 'v0.8.0' },
    { code: 'EPIC-007', title: 'Inventory OS', desc: 'Hệ thống kiểm soát nguyên vật liệu và quản lý nhà cung cấp.', status: vi.draft, priority: 'Trung bình', owner: 'Bộ phận kho', sprint: 'Sprint 5', progress: 0, version: 'v0.9.0' },
    { code: 'EPIC-008', title: 'Accounting OS', desc: 'Đối soát tài chính két, lập hóa đơn VAT và báo cáo doanh thu.', status: vi.draft, priority: 'Cao', owner: 'Kế toán trưởng', sprint: 'Sprint 5', progress: 0, version: 'v1.0.0' },
    { code: 'EPIC-009', title: 'CEO Dashboard', desc: 'Trung tâm tổng hợp số liệu và ra quyết định chiến lược cho ban giám đốc.', status: vi.draft, priority: 'Cao', owner: 'CEO', sprint: 'Sprint 6', progress: 0, version: 'v1.1.0' }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div>
          <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
            🎯 Danh sách {vi.epic}
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Quản lý các nhóm yêu cầu nghiệp vụ cấp cao và tiến độ phát hành.
          </p>
        </div>
        <button className="rounded border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all">
          + Tạo {vi.epic} mới
        </button>
      </div>

      {/* Epics Table */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mã Epic</th>
                <th className="py-3 px-4">Tiêu đề</th>
                <th className="py-3 px-4">{vi.owner}</th>
                <th className="py-3 px-4 text-center">Sprint</th>
                <th className="py-3 px-4 text-center">{vi.progress}</th>
                <th className="py-3 px-4 text-center">{vi.version}</th>
                <th className="py-3 px-4 text-right">{vi.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {epics.map((epic) => (
                <tr key={epic.code} className="hover:bg-gold-muted/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gold font-bold">{epic.code}</td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{epic.title}</div>
                    <div className="text-[10px] text-foreground/50 mt-0.5">{epic.desc}</div>
                  </td>
                  <td className="py-3.5 px-4">{epic.owner}</td>
                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-foreground/60">{epic.sprint}</td>
                  <td className="py-3.5 px-4 text-center font-mono">
                    <div className="flex items-center justify-center gap-1.5">
                      <div className="w-12 bg-background border border-gold-border/20 rounded-full h-2 overflow-hidden">
                        <div className="bg-gold h-full rounded-full" style={{ width: `${epic.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-gold">{epic.progress}%</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-foreground/60">{epic.version}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold tracking-wider ${
                      epic.status === vi.approved
                        ? 'bg-green-500/10 border border-green-500/25 text-green-500'
                        : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
                    }`}>
                      {epic.status}
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
