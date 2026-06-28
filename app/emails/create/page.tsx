'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { vi } from '@/lib/i18n/vi'

interface Reservation {
  id: string
  guestName: string
}

export default function CreateEmailPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    senderName: '',
    senderEmail: '',
    subject: '',
    body: '',
    relatedReservationId: '',
    status: 'New'
  })

  const [reservations, setReservations] = useState<Reservation[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('mvos_reservations')
    if (stored) {
      setReservations(JSON.parse(stored))
    }
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.senderName || !form.senderEmail || !form.subject || !form.body) return

    const stored = localStorage.getItem('mvos_emails')
    const currentEmails = stored ? JSON.parse(stored) : []

    const selectedRes = reservations.find((r) => r.id === form.relatedReservationId)

    const newEmail = {
      id: `em-${Date.now().toString().slice(-4)}`,
      senderName: form.senderName,
      senderEmail: form.senderEmail,
      subject: form.subject,
      body: form.body,
      receivedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: form.status,
      relatedReservationId: form.relatedReservationId,
      relatedGuestId: selectedRes ? `guest-${form.relatedReservationId.slice(-3)}` : ''
    }

    const updated = [newEmail, ...currentEmails]
    localStorage.setItem('mvos_emails', JSON.stringify(updated))
    router.push('/emails')
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Page Header */}
      <div className="flex items-center justify-between border-b border-gold-border/40 pb-4">
        <div>
          <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
            🆕 Tạo email thủ công
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            Ghi nhận thủ công bản ghi email liên hệ từ khách hàng vào hệ thống.
          </p>
        </div>
        <Link
          href="/emails"
          className="rounded border border-gold-border/40 hover:border-gold py-1.5 px-3.5 text-xs text-foreground/75 hover:text-gold transition-colors font-semibold"
        >
          Quay lại hộp thư
        </Link>
      </div>

      {/* Email Form */}
      <form onSubmit={handleSubmit} className="glass-panel rounded-xl p-8 border border-gold-border space-y-6">
        <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-3">
          🏛️ Thông tin bản ghi Email
        </h3>

        <div className="grid gap-6 sm:grid-cols-2">
          {/* Sender Details */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Người gửi *</label>
            <input
              type="text"
              required
              value={form.senderName}
              onChange={(e) => setForm({ ...form, senderName: e.target.value })}
              placeholder="Họ tên người gửi (Ví dụ: Lord Henderson)"
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Email người gửi *</label>
            <input
              type="email"
              required
              value={form.senderEmail}
              onChange={(e) => setForm({ ...form, senderEmail: e.target.value })}
              placeholder="sender@example.com"
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          {/* Subject */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Tiêu đề thư *</label>
            <input
              type="text"
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="Tiêu đề thư liên hệ..."
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            />
          </div>

          {/* Body */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Nội dung thư *</label>
            <textarea
              required
              value={form.body}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
              placeholder="Nội dung chi tiết thư của khách hàng gửi đến..."
              rows={5}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none font-sans"
            />
          </div>

          {/* Link to reservation */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Liên kết hồ sơ đặt bàn</label>
            <select
              value={form.relatedReservationId}
              onChange={(e) => setForm({ ...form, relatedReservationId: e.target.value })}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            >
              <option value="">-- Không có liên kết --</option>
              {reservations.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.guestName} ({r.id})
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái ghi nhận</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
            >
              <option value="New">Mới nhận (New)</option>
              <option value="Reading">Đang đọc (Reading)</option>
              <option value="Archived">Lưu trữ (Archived)</option>
            </select>
          </div>
        </div>

        <div className="border-t border-gold-border/20 pt-4 flex gap-3 justify-end">
          <Link
            href="/emails"
            className="rounded border border-gold-border/40 px-4 py-2 text-xs font-semibold text-foreground/80 hover:text-foreground transition-all"
          >
            {vi.cancel}
          </Link>
          <button
            type="submit"
            className="rounded bg-gold px-5 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
          >
            Lưu bản ghi Email
          </button>
        </div>
      </form>
    </div>
  )
}
