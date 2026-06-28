'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { vi } from '@/lib/i18n/vi'

export default function CreateReservationPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    vipLevel: 'Regular',
    date: '',
    time: '',
    partySize: 2,
    roomName: 'Khu sảnh chính (Main Hall)',
    menuSelection: 'Gọi món (A La Carte)',
    specialRequests: '',
    allergies: '',
    status: 'Pending',
    notes: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.guestName || !form.phone || !form.date || !form.time) return

    const stored = localStorage.getItem('mvos_reservations')
    const currentReservations = stored ? JSON.parse(stored) : []

    const newRes = {
      ...form,
      id: `res-${Date.now().toString().slice(-4)}`
    }

    const updated = [newRes, ...currentReservations]
    localStorage.setItem('mvos_reservations', JSON.stringify(updated))
    router.push('/reservations')
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gold-border/40 pb-4">
        <div>
          <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
            🆕 Tạo đặt bàn mới
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            Đăng ký và xếp lịch tiếp đón khách hàng tại biệt thự Maison Vie.
          </p>
        </div>
        <Link
          href="/reservations"
          className="rounded border border-gold-border/40 hover:border-gold py-1.5 px-3.5 text-xs text-foreground/75 hover:text-gold transition-colors font-semibold"
        >
          Quay lại danh sách
        </Link>
      </div>

      {/* Reservation Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-8 border border-gold-border space-y-6">
        <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-3">
          🏛️ Hồ sơ chi tiết đặt bàn
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Guest Name */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên khách hàng *</label>
            <input
              type="text"
              required
              value={form.guestName}
              onChange={(e) => setForm({ ...form, guestName: e.target.value })}
              placeholder="Nhập họ tên khách hàng (Ví dụ: Nguyễn Văn A)"
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          {/* Contact Details */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Số điện thoại *</label>
            <input
              type="text"
              required
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="Nhập số điện thoại liên hệ"
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Địa chỉ Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="email@example.com"
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          {/* Schedule */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày đặt bàn *</label>
            <input
              type="date"
              required
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Thời gian *</label>
            <input
              type="time"
              required
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          {/* Seating Specs */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Số lượng khách *</label>
            <input
              type="number"
              min="1"
              required
              value={form.partySize}
              onChange={(e) => setForm({ ...form, partySize: parseInt(e.target.value) || 2 })}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Khu vực phòng ăn</label>
            <select
              value={form.roomName}
              onChange={(e) => setForm({ ...form, roomName: e.target.value })}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            >
              <option value="Khu sảnh chính (Main Hall)">Khu sảnh chính (Main Hall)</option>
              <option value="Phòng VIP 1 (Salon Privé)">Phòng VIP 1 (Salon Privé)</option>
              <option value="Phòng VIP 2 (Salon Royal)">Phòng VIP 2 (Salon Royal)</option>
              <option value="Khu vườn (Le Jardin)">Khu vườn (Le Jardin)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Phân lớp khách hàng (VIP)</label>
            <select
              value={form.vipLevel}
              onChange={(e) => setForm({ ...form, vipLevel: e.target.value })}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            >
              <option value="Regular">Thành viên thường (Regular)</option>
              <option value="VIP Gold">VIP Vàng (Gold)</option>
              <option value="VIP Platinum">VIP Bạch Kim (Platinum)</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Lựa chọn thực đơn</label>
            <select
              value={form.menuSelection}
              onChange={(e) => setForm({ ...form, menuSelection: e.target.value })}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            >
              <option value="Gọi món (A La Carte)">Gọi món (A La Carte)</option>
              <option value="Thực đơn nếm thử cổ điển Pháp (Tasting Menu)">Thực đơn nếm thử cổ điển Pháp (Tasting Menu)</option>
              <option value="Thực đơn hải sản cao cấp (Seafood Tasting Menu)">Thực đơn hải sản cao cấp (Seafood Tasting Menu)</option>
            </select>
          </div>

          {/* Special notes & allergies */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Cảnh báo dị ứng thực phẩm</label>
            <input
              type="text"
              value={form.allergies}
              onChange={(e) => setForm({ ...form, allergies: e.target.value })}
              placeholder="Nhập thông tin dị ứng của khách để nhà bếp lưu ý (Ví dụ: Không hành, tỏi...)"
              className="rounded border border-red-500/20 focus:border-red-500 bg-background/50 px-3 py-2 text-xs text-foreground focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Yêu cầu đặc biệt</label>
            <textarea
              value={form.specialRequests}
              onChange={(e) => setForm({ ...form, specialRequests: e.target.value })}
              placeholder="Yêu cầu riêng về trang trí, loại rượu sâm panh..."
              rows={2}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Ghi chú nội bộ phục vụ</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Ghi chú cho FOH và quản trị viên."
              rows={2}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>
        </div>

        <div className="border-t border-gold-border/20 pt-4 flex gap-3 justify-end">
          <Link
            href="/reservations"
            className="rounded border border-gold-border/40 px-4 py-2 text-xs font-semibold text-foreground/80 hover:text-foreground transition-all"
          >
            {vi.cancel}
          </Link>
          <button
            type="submit"
            className="rounded bg-gold px-5 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
          >
            Đăng ký Đặt bàn
          </button>
        </div>
      </form>
    </div>
  )
}
