import { vi } from '@/lib/i18n/vi'

export default function DashboardPage() {
  const stats = [
    { label: 'Tổng số lượt đặt bàn', value: '142', change: '+12% so với tuần trước', icon: '📅' },
    { label: 'Số bàn VIP đang hoạt động', value: '7 / 10', change: '80% công suất', icon: '👑' },
    { label: 'Luồng vận hành đang chạy', value: '3', change: 'Hệ thống ổn định', icon: '⚡' },
    { label: 'Nhiệm vụ tác nhân AI', value: '1,208', change: '+240 hôm nay', icon: '🤖' },
  ]

  const reservations = [
    { id: '101', guest: 'Lord Henderson', table: 'Phòng VIP 1', guests: 4, time: '19:30', status: vi.approved },
    { id: '102', guest: 'Dr. Minh Nguyen', table: 'Bàn 12 (Khu chính)', guests: 2, time: '20:00', status: vi.approved },
    { id: '103', guest: 'Countess de Valois', table: 'Phòng VIP 2', guests: 6, time: '20:30', status: vi.pendingReview },
    { id: '104', guest: 'Đầu bếp Joel (Bàn Bếp)', table: 'L\'Art Culinaire', guests: 2, time: '21:00', status: vi.approved },
  ]

  const logs = [
    { id: 1, time: '17:54:12', agent: 'Định tuyến đặt bàn', msg: 'Khách hàng "Countess de Valois" đã được phân tích đặt bàn thành công.' },
    { id: 2, time: '17:50:05', agent: 'Kiểm tra quy trình (SOP)', msg: 'Đã kiểm tra bố trí phòng ăn. Tất cả hạng mục đều thẳng hàng.' },
    { id: 3, time: '17:48:32', agent: 'Đồng bộ Supabase', msg: 'Không phát hiện thay đổi cục bộ. Đã khởi tạo lắng nghe kết nối.' },
    { id: 4, time: '17:45:00', agent: 'Công cụ luồng việc', msg: 'Đã kích hoạt chạy kiểm tra Edge Function định kỳ thành công.' },
  ]

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          {vi.dashboard}
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Thông số hệ thống và tổng quan vận hành thời gian thực của Maison Vie.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="glass-panel rounded-xl p-5 border border-gold-border hover-gold-glow">
            <div className="flex items-center justify-between">
              <span className="text-xs text-foreground/60 font-sans tracking-wide uppercase">{stat.label}</span>
              <span className="text-lg">{stat.icon}</span>
            </div>
            <div className="text-3xl font-serif-cormorant font-bold text-gold mt-2">
              {stat.value}
            </div>
            <div className="text-[10px] text-green-500 mt-1 flex items-center gap-1">
              <span>●</span> {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Table - Left 2 columns */}
        <div className="glass-panel rounded-xl p-6 border border-gold-border lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
              📋 Danh Sách Đặt Bàn Tối Nay
            </h3>
            <span className="text-[10px] rounded bg-gold-muted border border-gold-border px-2 py-0.5 text-gold font-mono">
              PHIÊN HOẠT ĐỘNG
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground/80">
              <thead>
                <tr className="border-b border-gold-border/10 text-gold uppercase tracking-wider text-[10px]">
                  <th className="py-2">Khách hàng</th>
                  <th className="py-2">Bàn / Khu vực</th>
                  <th className="py-2 text-center">Số khách</th>
                  <th className="py-2">Thời gian</th>
                  <th className="py-2 text-right">{vi.status}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold-border/10">
                {reservations.map((res) => (
                  <tr key={res.id} className="hover:bg-gold-muted/10 transition-colors">
                    <td className="py-3 font-medium font-serif-cormorant text-sm">{res.guest}</td>
                    <td className="py-3 font-mono text-[11px] text-foreground/75">{res.table}</td>
                    <td className="py-3 text-center">{res.guests}</td>
                    <td className="py-3 font-mono text-[11px]">{res.time}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium ${
                        res.status === vi.approved
                          ? 'bg-green-500/10 border border-green-500/20 text-green-500'
                          : 'bg-yellow-500/10 border border-yellow-500/20 text-yellow-500'
                      }`}>
                        {res.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Logs - Right column */}
        <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
          <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
              🤖 Hoạt Động Tác Nhân
            </h3>
            <span className="text-[10px] text-foreground/40 font-mono animate-pulse">TRỰC TIẾP</span>
          </div>

          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="border-l border-gold/40 pl-3 py-0.5 space-y-1 hover:bg-gold-muted/5 rounded-r transition-colors">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-semibold text-gold tracking-wide">{log.agent}</span>
                  <span className="text-foreground/40 font-mono">{log.time}</span>
                </div>
                <p className="text-[11px] text-foreground/75 font-mono leading-normal">
                  {log.msg}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
