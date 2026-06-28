'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface EmailMessage {
  id: string
  senderName: string
  senderEmail: string
  subject: string
  body: string
  receivedAt: string
  status: string
  relatedGuestId: string
  relatedReservationId: string
}

const INITIAL_EMAILS: EmailMessage[] = [
  {
    id: 'em-001',
    senderName: 'Lord Henderson',
    senderEmail: 'henderson@royal.uk',
    subject: 'Request for private dining room - June 28th',
    body: 'Dear Maison Vie Team, we are planning a private gathering for 4 guests tomorrow evening. Please confirm if Salon Privé is available at 19:30. Best, Henderson.',
    receivedAt: '2026-06-27 09:30',
    status: 'New',
    relatedGuestId: 'guest-101',
    relatedReservationId: 'res-101'
  },
  {
    id: 'em-002',
    senderName: 'Dr. Minh Nguyen',
    senderEmail: 'minh.nguyen@hospital.vn',
    subject: 'Cảnh báo dị ứng & hoa hồng kỷ niệm đặt bàn',
    body: 'Chào lễ tân Maison Vie, tôi có đặt bàn tối nay lúc 20:00. Vui lòng chuẩn bị sẵn bó hồng trắng trên bàn. Vợ tôi bị dị ứng nặng với hải sản có vỏ, nhờ nhà bếp lưu ý tránh nhiễm chéo.',
    receivedAt: '2026-06-28 08:00',
    status: 'Draft Created',
    relatedGuestId: 'guest-102',
    relatedReservationId: 'res-102'
  }
]

export default function EmailsPage() {
  const [emails, setEmails] = useState<EmailMessage[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả')

  useEffect(() => {
    const stored = localStorage.getItem('mvos_emails')
    if (stored) {
      setEmails(JSON.parse(stored))
    } else {
      localStorage.setItem('mvos_emails', JSON.stringify(INITIAL_EMAILS))
      setEmails(INITIAL_EMAILS)
    }
  }, [])

  const statuses = [
    { key: 'Tất cả', label: 'Tất cả' },
    { key: 'New', label: 'Mới nhận' },
    { key: 'Reading', label: 'Đang đọc' },
    { key: 'Draft Created', label: 'Đã lập bản nháp' },
    { key: 'Pending Review', label: 'Chờ duyệt bản nháp' },
    { key: 'Approved', label: 'Đã duyệt trả lời' },
    { key: 'Sent', label: 'Đã gửi' },
    { key: 'Archived', label: 'Lưu trữ' }
  ]

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'New': return 'Mới nhận'
      case 'Reading': return 'Đang đọc'
      case 'Draft Created': return 'Đã tạo bản nháp'
      case 'Pending Review': return 'Chờ duyệt'
      case 'Approved': return 'Đã duyệt'
      case 'Sent': return 'Đã gửi'
      case 'Archived': return 'Lưu trữ'
      default: return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500 font-bold animate-pulse'
      case 'Reading':
      case 'Draft Created':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'Pending Review':
        return 'bg-orange-500/10 border border-orange-500/25 text-orange-500'
      case 'Approved':
      case 'Sent':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'Archived':
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/70'
    }
  }

  const filtered = emails.filter((em) => {
    const matchesSearch =
      em.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      em.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'Tất cả' || em.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold-border/40 pb-4 gap-4">
        <div>
          <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
            ✉️ Hộp thư khách hàng (Email)
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            Ghi nhận thông tin liên lạc, phản hồi đặt bàn và quản lý bản nháp trả lời khách hàng.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/emails/templates"
            className="rounded-md border border-gold-border/40 hover:border-gold px-4 py-2 text-xs font-semibold text-foreground/70 hover:text-gold transition-all"
          >
            📋 Mẫu email
          </Link>
          <Link
            href="/emails/create"
            className="rounded-md border border-gold bg-gold/10 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold/20 transition-all tracking-wide"
          >
            + Tạo email thủ công
          </Link>
        </div>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="glass-panel rounded-xl p-4 border border-gold-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80 flex flex-col gap-1.5">
          <input
            type="text"
            placeholder="Tìm theo người gửi hoặc tiêu đề thư..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <span className="text-[10px] text-foreground/50 font-mono uppercase">Trạng thái:</span>
          <div className="flex gap-1 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`rounded px-2 py-1 text-[10px] font-medium transition-all ${
                  statusFilter === s.key
                    ? 'bg-gold/20 text-gold border border-gold/40'
                    : 'text-foreground/70 hover:text-foreground hover:bg-gold-muted/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Email Messages List Table */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Người gửi</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Tiêu đề thư</th>
                <th className="py-3 px-4">Ngày nhận</th>
                <th className="py-3 px-4">Liên kết đặt bàn</th>
                <th className="py-3 px-4 text-right">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {filtered.length > 0 ? (
                filtered.map((em) => (
                  <tr key={em.id} className="hover:bg-gold-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-foreground font-serif-cormorant text-sm">{em.senderName}</td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-foreground/60">{em.senderEmail}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-foreground">{em.subject}</div>
                      <div className="text-[10px] text-foreground/50 truncate max-w-sm mt-0.5">{em.body}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-foreground/60">{em.receivedAt}</td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-gold">
                      {em.relatedReservationId ? (
                        <Link href={`/reservations/${em.relatedReservationId}`} className="hover:underline">
                          🔗 {em.relatedReservationId}
                        </Link>
                      ) : (
                        <span className="text-foreground/30">Không có</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className={`inline-block rounded px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${getStatusClass(em.status)}`}>
                        {getStatusLabel(em.status)}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/emails/${em.id}`}
                        className="text-xs text-gold hover:underline font-semibold"
                      >
                        Đọc thư →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                    Không tìm thấy bản ghi email phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
