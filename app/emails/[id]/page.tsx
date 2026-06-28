'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface DraftReply {
  draftSubject: string
  draftBody: string
  language: string
  status: string
  reviewedBy: string
}

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
  draft?: DraftReply
}

export default function EmailDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [email, setEmail] = useState<EmailMessage | null>(null)
  
  // Draft Form State
  const [draftSubject, setDraftSubject] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [draftLanguage, setDraftLanguage] = useState('Vietnamese')
  const [draftStatus, setDraftStatus] = useState('Draft')
  const [draftReviewer, setDraftReviewer] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('mvos_emails')
    if (stored) {
      const list: EmailMessage[] = JSON.parse(stored)
      const found = list.find((item) => item.id === id)
      if (found) {
        setEmail(found)
        if (found.status === 'New') {
          // Auto update status to Reading when opened
          found.status = 'Reading'
          const index = list.findIndex((item) => item.id === id)
          list[index] = found
          localStorage.setItem('mvos_emails', JSON.stringify(list))
        }

        if (found.draft) {
          setDraftSubject(found.draft.draftSubject)
          setDraftBody(found.draft.draftBody)
          setDraftLanguage(found.draft.language)
          setDraftStatus(found.draft.status)
          setDraftReviewer(found.draft.reviewedBy)
        } else {
          // Pre-populate with typical response template
          setDraftSubject(`Re: ${found.subject}`)
          setDraftBody(`Kính gửi ${found.senderName},\n\nMaison Vie xin chân thành cảm ơn thư liên hệ của quý khách...\n\nTrân trọng,\nMaison Vie Team`)
        }
      }
    }
  }, [id])

  if (!email) {
    return (
      <div className="py-8 text-center text-foreground/50 font-serif-cormorant italic text-base">
        Đang tải thông tin email hoặc email không tồn tại...
      </div>
    )
  }

  const updateLocalStorage = (updatedEmail: EmailMessage) => {
    const stored = localStorage.getItem('mvos_emails')
    if (stored) {
      const list: EmailMessage[] = JSON.parse(stored)
      const index = list.findIndex((item) => item.id === id)
      if (index !== -1) {
        list[index] = updatedEmail
        localStorage.setItem('mvos_emails', JSON.stringify(list))
        setEmail(updatedEmail)
      }
    }
  }

  const handleSaveDraft = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedDraft: DraftReply = {
      draftSubject,
      draftBody,
      language: draftLanguage,
      status: draftStatus,
      reviewedBy: draftStatus === 'Approved' ? 'Kiến trúc sư trưởng' : draftReviewer
    }

    const updatedEmail = {
      ...email,
      status: draftStatus === 'Sent' ? 'Sent' : 'Draft Created',
      draft: updatedDraft
    }

    updateLocalStorage(updatedEmail)
    alert('Đã lưu bản nháp thành công!')
  }

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
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500 font-bold'
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

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold-border/40 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-serif-cormorant font-bold text-gold tracking-wide">
            Chi tiết Email
          </h1>
          <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${getStatusClass(email.status)}`}>
            {getStatusLabel(email.status)}
          </span>
        </div>
        <Link
          href="/emails"
          className="rounded border border-gold-border/40 px-3.5 py-1.5 text-xs text-foreground/80 hover:text-gold transition-colors font-semibold"
        >
          Quay lại hộp thư
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Email content received */}
        <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
          <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
            📥 Email của khách hàng
          </h3>
          
          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-3 border-b border-gold-border/10 pb-2">
              <span className="text-foreground/40 font-mono">Người gửi</span>
              <span className="col-span-2 font-semibold text-foreground">{email.senderName}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-gold-border/10 pb-2">
              <span className="text-foreground/40 font-mono">Email người gửi</span>
              <span className="col-span-2 font-mono text-gold">{email.senderEmail}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-gold-border/10 pb-2">
              <span className="text-foreground/40 font-mono">Ngày nhận</span>
              <span className="col-span-2 font-mono">{email.receivedAt}</span>
            </div>
            <div className="grid grid-cols-3 border-b border-gold-border/10 pb-2">
              <span className="text-foreground/40 font-mono">Liên kết đặt bàn</span>
              <span className="col-span-2 font-mono">
                {email.relatedReservationId ? (
                  <Link href={`/reservations/${email.relatedReservationId}`} className="text-gold hover:underline font-bold">
                    🔗 {email.relatedReservationId}
                  </Link>
                ) : (
                  <span className="text-foreground/30">Chưa liên kết</span>
                )}
              </span>
            </div>
            <div className="grid grid-cols-3 pb-2">
              <span className="text-foreground/40 font-mono">Tiêu đề thư</span>
              <span className="col-span-2 font-bold text-foreground">{email.subject}</span>
            </div>
          </div>

          <div className="p-4 bg-background border border-gold-border/15 rounded-lg text-xs leading-relaxed text-foreground/90 whitespace-pre-line font-sans">
            {email.body}
          </div>
        </div>

        {/* Right Column: Reply Draft Form & Draft Status */}
        <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
          <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
            ✍️ Bản nháp trả lời (Draft Reply)
          </h3>

          <form onSubmit={handleSaveDraft} className="space-y-4 text-xs">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-foreground/60 font-mono uppercase">Tiêu đề bản nháp</label>
              <input
                type="text"
                required
                value={draftSubject}
                onChange={(e) => setDraftSubject(e.target.value)}
                className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-foreground/60 font-mono uppercase">Nội dung trả lời</label>
              <textarea
                required
                value={draftBody}
                onChange={(e) => setDraftBody(e.target.value)}
                rows={8}
                className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none font-sans leading-relaxed"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngôn ngữ</label>
                <select
                  value={draftLanguage}
                  onChange={(e) => setDraftLanguage(e.target.value)}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="Vietnamese">Tiếng Việt (Vietnamese)</option>
                  <option value="English">Tiếng Anh (English)</option>
                  <option value="French">Tiếng Pháp (French)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái bản nháp</label>
                <select
                  value={draftStatus}
                  onChange={(e) => setDraftStatus(e.target.value)}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="Draft">Bản nháp (Draft)</option>
                  <option value="Pending Review">Chờ duyệt (Pending Review)</option>
                  <option value="Approved">Đã duyệt (Approved)</option>
                  <option value="Sent">Đã gửi đi (Sent)</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gold-border/20 pt-4 flex gap-2 justify-end">
              <button
                type="submit"
                className="rounded bg-gold px-5 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Lưu bản nháp
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
