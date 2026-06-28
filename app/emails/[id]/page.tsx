'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface DraftReply {
  draftSubject: string
  draftBody: string
  language: string
  status: string // Draft, Pending Review, Approved, Rejected, Needs Revision, Marked As Sent, Archived
  reviewedBy: string
  reviewedAt: string
  reviewNote: string
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
  
  // Draft Editor Inputs (Editable when Draft or Needs Revision)
  const [draftSubject, setDraftSubject] = useState('')
  const [draftBody, setDraftBody] = useState('')
  const [draftLanguage, setDraftLanguage] = useState('Vietnamese')
  
  // Review Inputs
  const [inputReviewer, setInputReviewer] = useState('Quản lý sảnh FOH')
  const [inputReviewNote, setInputReviewNote] = useState('')
  const [workflowError, setWorkflowError] = useState('')

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
        } else {
          // Pre-populate response template
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
        setWorkflowError('')
      }
    }
  }

  // Handle draft editor save (only permitted in Draft or Needs Revision states)
  const handleSaveDraftContent = (e: React.FormEvent) => {
    e.preventDefault()
    const currentStatus = email.draft ? email.draft.status : 'Draft'
    
    if (currentStatus !== 'Draft' && currentStatus !== 'Needs Revision') {
      setWorkflowError('Chỉ có thể chỉnh sửa bản nháp ở trạng thái Bản nháp hoặc Cần sửa lại')
      return
    }

    const updatedDraft: DraftReply = {
      draftSubject,
      draftBody,
      language: draftLanguage,
      status: currentStatus, // keep current status
      reviewedBy: email.draft?.reviewedBy || '',
      reviewedAt: email.draft?.reviewedAt || '',
      reviewNote: email.draft?.reviewNote || ''
    }

    const updatedEmail = {
      ...email,
      status: 'Draft Created',
      draft: updatedDraft
    }

    updateLocalStorage(updatedEmail)
    alert('Đã lưu nội dung bản nháp!')
  }

  // Allowed transitions check
  const getAllowedDraftTransitions = (currentStatus: string): string[] => {
    switch (currentStatus) {
      case 'Draft':
        return ['Pending Review']
      case 'Pending Review':
        return ['Approved', 'Rejected', 'Needs Revision']
      case 'Needs Revision':
        return ['Draft', 'Pending Review']
      case 'Approved':
        return ['Marked As Sent']
      case 'Marked As Sent':
        return ['Archived']
      default:
        return [] // Rejected and Archived cannot move further
    }
  }

  const handleTransition = (nextStatus: string) => {
    const currentStatus = email.draft ? email.draft.status : 'Draft'
    const allowed = getAllowedDraftTransitions(currentStatus)
    
    if (!allowed.includes(nextStatus)) {
      setWorkflowError('Chuyển đổi trạng thái không hợp lệ!')
      return
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    
    let reviewerName = email.draft?.reviewedBy || ''
    let noteText = email.draft?.reviewNote || ''
    let reviewTime = email.draft?.reviewedAt || ''

    // If review transition, record reviewer and note
    if (currentStatus === 'Pending Review') {
      reviewerName = inputReviewer || 'Quản lý FOH'
      noteText = inputReviewNote || 'Phê duyệt bản nháp'
      reviewTime = nowStr
    }

    const updatedDraft: DraftReply = {
      draftSubject,
      draftBody,
      language: draftLanguage,
      status: nextStatus,
      reviewedBy: reviewerName,
      reviewedAt: reviewTime,
      reviewNote: noteText
    }

    // Map draft status back to parent email message status
    let nextMessageStatus = email.status
    if (nextStatus === 'Sent' || nextStatus === 'Marked As Sent') {
      nextMessageStatus = 'Sent'
    } else if (nextStatus === 'Archived') {
      nextMessageStatus = 'Archived'
    } else {
      nextMessageStatus = 'Draft Created'
    }

    const updatedEmail = {
      ...email,
      status: nextMessageStatus,
      draft: updatedDraft
    }

    updateLocalStorage(updatedEmail)
    setInputReviewNote('')
  }

  const getDraftStatusLabel = (status: string) => {
    switch (status) {
      case 'Draft': return 'Bản nháp'
      case 'Pending Review': return 'Chờ duyệt'
      case 'Approved': return 'Đã duyệt'
      case 'Rejected': return 'Bị từ chối'
      case 'Needs Revision': return 'Cần sửa lại'
      case 'Marked As Sent': return 'Đánh dấu đã gửi'
      case 'Archived': return 'Đã lưu trữ'
      default: return status
    }
  }

  const getDraftStatusClass = (status: string) => {
    switch (status) {
      case 'Approved':
      case 'Marked As Sent':
        return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'Pending Review':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'Draft':
      case 'Needs Revision':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'Rejected':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      case 'Archived':
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/70'
    }
  }

  const currentDraftStatus = email.draft ? email.draft.status : 'Draft'
  const allowedNextDraft = getAllowedDraftTransitions(currentDraftStatus)
  const isEditable = currentDraftStatus === 'Draft' || currentDraftStatus === 'Needs Revision'

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold-border/40 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-serif-cormorant font-bold text-gold tracking-wide">
            Thư từ: {email.senderName}
          </h1>
          <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${getDraftStatusClass(currentDraftStatus)}`}>
            Bản nháp: {getDraftStatusLabel(currentDraftStatus)}
          </span>
        </div>
        <Link
          href="/emails"
          className="rounded border border-gold-border/40 px-3.5 py-1.5 text-xs text-foreground/80 hover:text-gold transition-colors font-semibold"
        >
          Quay lại hộp thư
        </Link>
      </div>

      {/* Main Split Layout */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Email content received & Draft Editor */}
        <div className="space-y-6">
          {/* Email Received */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              📥 Email từ khách hàng
            </h3>
            
            <div className="space-y-2 text-xs">
              <div className="grid grid-cols-3 border-b border-gold-border/10 pb-2">
                <span className="text-foreground/40 font-mono">Người gửi</span>
                <span className="col-span-2 font-semibold text-foreground">{email.senderName}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-gold-border/10 pb-2">
                <span className="text-foreground/40 font-mono">Email khách</span>
                <span className="col-span-2 font-mono text-gold">{email.senderEmail}</span>
              </div>
              <div className="grid grid-cols-3 border-b border-gold-border/10 pb-2">
                <span className="text-foreground/40 font-mono">Ngày nhận</span>
                <span className="col-span-2 font-mono">{email.receivedAt}</span>
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

          {/* Draft Reply Form */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              ✍️ Bản nháp trả lời (Draft Reply)
            </h3>

            <form onSubmit={handleSaveDraftContent} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Tiêu đề trả lời</label>
                <input
                  type="text"
                  required
                  disabled={!isEditable}
                  value={draftSubject}
                  onChange={(e) => setDraftSubject(e.target.value)}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Nội dung email trả lời</label>
                <textarea
                  required
                  disabled={!isEditable}
                  value={draftBody}
                  onChange={(e) => setDraftBody(e.target.value)}
                  rows={6}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none font-sans leading-relaxed disabled:opacity-50"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngôn ngữ</label>
                <select
                  disabled={!isEditable}
                  value={draftLanguage}
                  onChange={(e) => setDraftLanguage(e.target.value)}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none disabled:opacity-50"
                >
                  <option value="Vietnamese">Tiếng Việt (Vietnamese)</option>
                  <option value="English">Tiếng Anh (English)</option>
                  <option value="French">Tiếng Pháp (French)</option>
                </select>
              </div>

              {isEditable ? (
                <button
                  type="submit"
                  className="rounded border border-gold bg-gold/10 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold/20 transition-all"
                >
                  Lưu bản nháp
                </button>
              ) : (
                <p className="text-[10px] text-foreground/40 italic">Nội dung bản nháp đã khóa vì đang trong chu trình kiểm duyệt.</p>
              )}
            </form>
          </div>
        </div>

        {/* Right Column: Draft Workflow Management & Review Log */}
        <div className="space-y-6">
          {/* Draft Workflow Controller */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              ⚙️ Quy trình kiểm duyệt bản nháp
            </h3>

            <div className="text-xs space-y-1">
              <div className="flex justify-between border-b border-gold-border/10 pb-2">
                <span className="text-foreground/50">Trạng thái bản nháp hiện tại:</span>
                <span className="font-bold text-gold">{getDraftStatusLabel(currentDraftStatus)}</span>
              </div>
            </div>

            {/* Allowed transition actions as buttons */}
            {allowedNextDraft.length > 0 ? (
              <div className="space-y-4 pt-2">
                {/* 1. If currently in Pending Review, show reviewer & note inputs */}
                {currentDraftStatus === 'Pending Review' && (
                  <div className="space-y-3 bg-gold-muted/5 border border-gold-border/10 p-4 rounded-lg text-xs">
                    <h4 className="font-bold text-gold text-[10px] uppercase tracking-wider">Thông tin phê duyệt (FOH Lead)</h4>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-foreground/50 font-mono">Người duyệt</label>
                      <input
                        type="text"
                        value={inputReviewer}
                        onChange={(e) => setInputReviewer(e.target.value)}
                        className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1 text-xs text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] text-foreground/50 font-mono">Ghi chú duyệt</label>
                      <input
                        type="text"
                        placeholder="Ý kiến phê duyệt hoặc yêu cầu chỉnh sửa..."
                        value={inputReviewNote}
                        onChange={(e) => setInputReviewNote(e.target.value)}
                        className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1 text-xs text-foreground focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                )}

                {/* Transition Trigger Buttons */}
                <div className="flex flex-col gap-2">
                  {allowedNextDraft.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleTransition(st)}
                      className="w-full rounded border border-gold py-2 text-center text-xs font-semibold text-gold bg-gold-muted/5 hover:bg-gold/15 transition-all"
                    >
                      {st === 'Pending Review' && 'Gửi duyệt'}
                      {st === 'Approved' && 'Duyệt bản nháp'}
                      {st === 'Needs Revision' && 'Yêu cầu sửa lại'}
                      {st === 'Rejected' && 'Từ chối (Rejected)'}
                      {st === 'Draft' && 'Chuyển về Bản nháp'}
                      {st === 'Marked As Sent' && 'Đánh dấu đã gửi'}
                      {st === 'Archived' && 'Lưu trữ'}
                    </button>
                  ))}
                </div>

                {workflowError && (
                  <p className="text-[10px] text-red-500 font-sans italic">{workflowError}</p>
                )}
              </div>
            ) : (
              <div className="rounded border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400 font-sans italic text-center">
                Quy trình bản nháp đã kết thúc hoặc lưu trữ.
              </div>
            )}
          </div>

          {/* Historical Review Audit logs */}
          {email.draft && email.draft.reviewedBy && (
            <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
                📜 Ghi chú duyệt bản nháp
              </h3>
              
              <div className="space-y-3 text-xs font-sans">
                <div className="flex justify-between border-b border-gold-border/10 pb-2">
                  <span className="text-foreground/50">Người duyệt:</span>
                  <span className="font-semibold text-foreground">{email.draft.reviewedBy}</span>
                </div>
                <div className="flex justify-between border-b border-gold-border/10 pb-2">
                  <span className="text-foreground/50">Thời gian duyệt:</span>
                  <span className="font-mono text-foreground/75">{email.draft.reviewedAt}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-foreground/50 block">Ghi chú duyệt:</span>
                  <p className="p-2.5 bg-background border border-gold-border/10 rounded font-serif-cormorant italic text-sm text-foreground/90">{email.draft.reviewNote}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
