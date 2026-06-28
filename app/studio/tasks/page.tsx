import { vi } from '@/lib/i18n/vi'

export default function TasksPage() {
  const tasks = [
    {
      code: 'TASK-0001',
      feature: 'FEATURE-0004',
      spec: 'SPEC-0005',
      title: 'Build MVOS Studio Foundation',
      desc: 'Xây dựng giao diện danh sách và thanh điều hướng phụ cho Studio.',
      status: vi.completed,
      priority: 'Cao',
      owner: 'Kỹ sư Antigravity',
      acceptanceCriteria: '• Tất cả các trang trong Studio mở được bình thường và hiển thị đúng tiếng Việt.'
    },
    {
      code: 'TASK-0002',
      feature: 'FEATURE-0004',
      spec: 'SPEC-0005',
      title: 'Seed MVOS Studio Initial Data',
      desc: 'Lập file dữ liệu mẫu 003_mvos_studio_seed_data.sql chứa epics, features, tasks mẫu.',
      status: vi.inProgress,
      priority: 'Cao',
      owner: 'Kỹ sư Antigravity',
      acceptanceCriteria: '• Có file seed_data.sql và hiển thị tổng số liệu thống kê ở trang tổng quan Studio.'
    },
    {
      code: 'TASK-0003',
      feature: 'FEATURE-0008',
      spec: 'SPEC-0002',
      title: 'Build Enterprise Dictionary Foundation',
      desc: 'Xây dựng giao diện tra cứu từ điển thuật ngữ doanh nghiệp nội bộ.',
      status: 'Lên kế hoạch (Planned)',
      priority: 'Trung bình',
      owner: 'Kỹ sư Antigravity',
      acceptanceCriteria: '• Trang từ điển doanh nghiệp hoạt động hiển thị đầy đủ giải nghĩa từ vựng.'
    },
    {
      code: 'TASK-0004',
      feature: 'FEATURE-0001',
      spec: 'SPEC-0003',
      title: 'Build Reservation & Email OS Foundation',
      desc: 'Xây dựng phân hệ đặt bàn, kết nối mẫu email thông báo và RLS liên quan.',
      status: 'Lên kế hoạch (Planned)',
      priority: 'Cao',
      owner: 'Kỹ sư Antigravity',
      acceptanceCriteria: '• Chức năng đặt bàn hoạt động ngoại tuyến và hiển thị danh sách VIP.'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
        <div>
          <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
            🛠️ Danh sách {vi.task}
          </h2>
          <p className="text-xs text-foreground/50 mt-0.5">
            Các đầu việc phát triển kỹ thuật chi tiết phân bổ cho kỹ sư phần mềm.
          </p>
        </div>
        <button className="rounded border border-gold bg-gold/10 px-3.5 py-1.5 text-xs font-semibold text-gold hover:bg-gold/20 transition-all">
          + Tạo {vi.task} mới
        </button>
      </div>

      {/* Tasks Table */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Mã Đầu Việc</th>
                <th className="py-3 px-4">Tính Năng / Đặc Tả</th>
                <th className="py-3 px-4">Đầu việc</th>
                <th className="py-3 px-4">{vi.owner}</th>
                <th className="py-3 px-4">{vi.priority}</th>
                <th className="py-3 px-4">Tiêu chí nghiệm thu (Acceptance Criteria)</th>
                <th className="py-3 px-4 text-right">{vi.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {tasks.map((task) => (
                <tr key={task.code} className="hover:bg-gold-muted/5 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gold font-bold">{task.code}</td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-foreground/60">
                    <div>Feat: {task.feature}</div>
                    <div className="mt-0.5">Spec: {task.spec}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-foreground">{task.title}</div>
                    <div className="text-[10px] text-foreground/50 mt-0.5">{task.desc}</div>
                  </td>
                  <td className="py-3.5 px-4">{task.owner}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${
                      task.priority === 'Cao' ? 'bg-red-500/10 border border-red-500/20 text-red-500' : 'bg-blue-500/10 border border-blue-500/20 text-blue-500'
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[10px] text-foreground/70 whitespace-pre-line font-sans">{task.acceptanceCriteria}</td>
                  <td className="py-3.5 px-4 text-right">
                    <span className={`inline-block rounded px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${
                      task.status === vi.completed
                        ? 'bg-green-500/10 border border-green-500/25 text-green-500'
                        : task.status === vi.inProgress
                        ? 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
                        : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
                    }`}>
                      {task.status}
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
