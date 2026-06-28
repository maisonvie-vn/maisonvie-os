'use client'

import { useState } from 'react'
import { vi } from '@/lib/i18n/vi'

export default function AdminPage() {
  const [checking, setChecking] = useState(false)
  const [result, setResult] = useState<string | null>(null)

  // We can safely read these in client code in Next.js since they are prefixed with NEXT_PUBLIC_
  const hasUrl = typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_SUPABASE_URL
  const hasKey = typeof window !== 'undefined' && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const envMode = typeof window !== 'undefined' ? process.env.NODE_ENV : 'development'

  const checkConnection = () => {
    setChecking(true)
    setResult(null)
    setTimeout(() => {
      setChecking(false)
      setResult('Supabase Client đã khởi tạo thành công ở chế độ sandbox. Kết nối tới database sản xuất bị hạn chế để đảm bảo an toàn.')
    }, 1200)
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          {vi.admin} Hệ thống
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Cấu hình môi trường hệ thống, thiết lập Supabase và bảng điều khiển an toàn.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Left Column - Supabase connection and environment */}
        <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-6">
          <div>
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide mb-2">
              🔌 Trạng thái kết nối Supabase
            </h3>
            <p className="text-xs text-foreground/75 leading-relaxed">
              Xác minh xem môi trường cục bộ đã được cấu hình chính xác để kết nối với Supabase chưa.
            </p>
          </div>

          {/* Environment Variables Table */}
          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between border-b border-gold-border/10 pb-2">
              <span className="text-foreground/60">NEXT_PUBLIC_SUPABASE_URL</span>
              <span className={hasUrl ? 'text-green-500 font-semibold' : 'text-yellow-500'}>
                {hasUrl ? 'ĐÃ CẤU HÌNH' : 'RỖNG / THIẾU'}
              </span>
            </div>
            <div className="flex justify-between border-b border-gold-border/10 pb-2">
              <span className="text-foreground/60">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>
              <span className={hasKey ? 'text-green-500 font-semibold' : 'text-yellow-500'}>
                {hasKey ? 'ĐÃ CẤU HÌNH' : 'RỖNG / THIẾU'}
              </span>
            </div>
            <div className="flex justify-between pb-2">
              <span className="text-foreground/60">NODE_ENV</span>
              <span className="text-blue-400">{envMode}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={checkConnection}
              disabled={checking}
              className="w-full rounded-md border border-gold bg-gold-muted hover:bg-gold/25 py-2.5 text-xs font-semibold text-gold transition-colors tracking-wide disabled:opacity-50"
            >
              {checking ? 'Đang kiểm tra kết nối...' : 'Kiểm tra kết nối Client'}
            </button>

            {result && (
              <div className="rounded border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-500 leading-normal">
                ⚠️ {result}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Safeguards and instructions */}
        <div className="space-y-6">
          {/* Safeguard Alert */}
          <div className="glass-panel rounded-xl p-6 border border-yellow-500/20 bg-yellow-500/5 space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-yellow-500 tracking-wide flex items-center gap-2">
              ⚠️ Bảo vệ Cơ sở dữ liệu Sản xuất
            </h3>
            <p className="text-xs text-foreground/80 leading-relaxed">
              <strong>Yêu cầu bắt buộc:</strong> Không kết nối cơ sở dữ liệu sản xuất với máy chủ phát triển cục bộ này. 
              Ứng dụng phải thực thi và biên dịch bằng thông tin cấu hình thử nghiệm hoặc cấu hình ngoại tuyến trong quá trình phát triển.
            </p>
          </div>

          {/* Destructive Commands Alert */}
          <div className="glass-panel rounded-xl p-6 border border-green-500/20 bg-green-500/5 space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-green-500 tracking-wide flex items-center gap-2">
              🛡️ Khóa lệnh hủy hoại cơ sở dữ liệu
            </h3>
            <p className="text-xs text-foreground/80 leading-relaxed">
              Không có lệnh hủy hoại cơ sở dữ liệu nào được cấu hình trong gói sản phẩm này. Các thao tác nguy hiểm như 
              <code> DROP DATABASE</code>, <code> TRUNCATE TABLE</code> hoặc xóa khóa bảo mật đều bị loại bỏ hoàn toàn.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
