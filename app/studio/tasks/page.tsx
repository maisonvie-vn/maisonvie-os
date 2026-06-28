import { vi } from '@/lib/i18n/vi'

export default function TasksPage() {
  const tasks = [
    {
      code: 'TASK-001',
      feature: 'FEAT-010',
      spec: 'SPEC_001',
      title: 'Tích hợp Supabase Client và Server SDK',
      desc: 'Cấu hình file client.ts và server.ts phục vụ kết nối cơ sở dữ liệu Supabase cục bộ.',
      status: vi.completed,
      priority: 'Cao',
      owner: 'Kỹ sư Antigravity',
      acceptanceCriteria: '• Biên dịch thành công\n• Không lộ secrets\n• Kết nối an toàn qua SDK'
    },
    {
      code: 'TASK-002',
      feature: 'FEAT-020',
      spec: 'SPEC_002',
      title: 'Xây dựng Báo cáo Năng lực Doanh nghiệp Việt hóa',
      desc: 'Thiết kế giao diện /architecture/business-capability hiển thị 12 domains cốt lõi.',
      status: vi.completed,
      priority: 'Cao',
      owner: 'Kỹ sư Antigravity',
      acceptanceCriteria: '• Sử dụng tiếng Việt hoàn toàn\n• Chạy đúng đường dẫn định tuyến\n• CSS đồng bộ'
    },
    {
      code: 'TASK-003',
      feature: 'FEAT-030',
      spec: 'SPEC_003',
      title: 'Thiết lập bảng cơ sở dữ liệu quản trị dự án Studio',
      desc: 'Tạo tệp di chuyển SQL 002_mvos_studio_foundation.sql với các bảng epics, features, tasks...',
      status: vi.inProgress,
      priority: 'Cao',
      owner: 'Kỹ sư Antigravity',
      acceptanceCriteria: '• Di chuyển SQL sạch\n• Bật chế độ RLS\n• Có chính sách phân quyền cho mỗi bảng'
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
