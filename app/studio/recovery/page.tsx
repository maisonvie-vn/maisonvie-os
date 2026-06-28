'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export type GuestRecoveryType =
  | "apology"
  | "manager_call"
  | "email_follow_up"
  | "agency_follow_up"
  | "complimentary_item"
  | "discount_offer"
  | "rebooking_offer"
  | "service_correction"
  | "internal_resolution"
  | "other"

export type GuestRecoveryPriority =
  | "low"
  | "medium"
  | "high"
  | "critical"

export type GuestRecoveryStatus =
  | "open"
  | "contacting"
  | "waiting_guest_response"
  | "recovery_offered"
  | "resolved"
  | "closed"
  | "archived"

export interface GuestRecoveryCase {
  id: string
  feedbackId?: string | null
  reservationId?: string | null
  emailDraftId?: string | null
  improvementActionId?: string | null
  caseDate: string
  guestName?: string | null
  guestContact?: string | null
  recoveryType: GuestRecoveryType
  priority: GuestRecoveryPriority
  status: GuestRecoveryStatus
  ownerName?: string | null
  dueDate?: string | null
  issueSummary: string
  recoveryPlan?: string | null
  followUpNote?: string | null
  recoveryResult?: string | null
  ceoAttentionRequired: boolean
  resolvedAt?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface GuestFeedbackRecord {
  id: string
  guestName?: string | null
  guestContact?: string | null
  content: string
  title: string
}

interface Reservation {
  id: string
  guestName: string
  bookingDate: string
}

interface EmailDraft {
  id: string
  draftSubject: string
}

interface ImprovementAction {
  id: string
  title: string
  status: string
}

const INITIAL_CASES: GuestRecoveryCase[] = [
  {
    id: 'case-901',
    feedbackId: 'fb-801',
    reservationId: null,
    emailDraftId: null,
    improvementActionId: null,
    caseDate: '2026-06-28',
    guestName: 'Mr. Johnathan',
    guestContact: 'johnathan@example.com',
    recoveryType: 'complimentary_item',
    priority: 'high',
    status: 'resolved',
    ownerName: 'Nguyễn Thị Hoa (FOH Lead)',
    dueDate: '2026-06-29',
    issueSummary: 'Súp hải sản ca tối hơi mặn nhẹ làm khách không hài lòng.',
    recoveryPlan: 'Thay đĩa súp mới nhạt hơn, tặng thêm ly vang trắng và miễn phí món khai vị trong hóa đơn.',
    followUpNote: 'Đã gọi điện hỏi thăm và xin lỗi trực tiếp khách hàng vào sáng hôm sau.',
    recoveryResult: 'Khách vui vẻ chấp nhận lời xin lỗi, đánh giá cao thái độ trách nhiệm của đội ngũ quản lý.',
    ceoAttentionRequired: false,
    resolvedAt: '2026-06-28 21:00',
    createdAt: '2026-06-28 20:45',
    updatedAt: '2026-06-28 21:00'
  }
]

function RecoveryPageContent() {
  const searchParams = useSearchParams()
  const queryFeedbackId = searchParams.get('feedback_id')

  const [cases, setCases] = useState<GuestRecoveryCase[]>([])
  const [feedbacks, setFeedbacks] = useState<GuestFeedbackRecord[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [emailDrafts, setEmailDrafts] = useState<EmailDraft[]>([])
  const [improvements, setImprovements] = useState<ImprovementAction[]>([])

  const [selectedCase, setSelectedCase] = useState<GuestRecoveryCase | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [form, setForm] = useState({
    caseDate: '2026-06-28',
    feedbackId: '',
    reservationId: '',
    emailDraftId: '',
    improvementActionId: '',
    guestName: '',
    guestContact: '',
    recoveryType: 'apology' as GuestRecoveryType,
    priority: 'medium' as GuestRecoveryPriority,
    status: 'open' as GuestRecoveryStatus,
    ownerName: '',
    dueDate: '2026-06-29',
    issueSummary: '',
    recoveryPlan: '',
    followUpNote: '',
    recoveryResult: '',
    ceoAttentionRequired: false
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedCases = localStorage.getItem('mvos_guest_recovery_cases')
        const storedFeedbacks = localStorage.getItem('mvos_guest_feedbacks')
        const storedRes = localStorage.getItem('mvos_reservations')
        const storedEmails = localStorage.getItem('mvos_emails')
        const storedImps = localStorage.getItem('mvos_improvements')

        let loadedCases: GuestRecoveryCase[] = []
        let loadedFeedbacks: GuestFeedbackRecord[] = []
        let loadedRes: Reservation[] = []
        let loadedDrafts: EmailDraft[] = []
        let loadedImps: ImprovementAction[] = []

        if (storedCases) {
          loadedCases = JSON.parse(storedCases)
        } else {
          localStorage.setItem('mvos_guest_recovery_cases', JSON.stringify(INITIAL_CASES))
          loadedCases = INITIAL_CASES
        }
        setCases(loadedCases)

        if (storedFeedbacks) {
          loadedFeedbacks = JSON.parse(storedFeedbacks)
          setFeedbacks(loadedFeedbacks)
        }

        if (storedRes) {
          loadedRes = JSON.parse(storedRes)
          setReservations(loadedRes)
        }

        if (storedEmails) {
          const loadedEmails = JSON.parse(storedEmails)
          loadedDrafts = loadedEmails.filter((e: { draft?: { draftSubject: string } | null }) => e.draft).map((e: { id: string; draft?: { draftSubject: string } | null }) => ({
            id: e.id,
            draftSubject: e.draft?.draftSubject || e.id
          }))
          setEmailDrafts(loadedDrafts)
        }

        if (storedImps) {
          loadedImps = JSON.parse(storedImps)
          setImprovements(loadedImps)
        }

        // Handle pre-population from feedback
        if (queryFeedbackId) {
          const matchedFb = loadedFeedbacks.find(f => f.id === queryFeedbackId)
          if (matchedFb) {
            setForm((prev) => ({
              ...prev,
              feedbackId: matchedFb.id,
              guestName: matchedFb.guestName || '',
              guestContact: matchedFb.guestContact || '',
              issueSummary: `Ghi nhận từ phản hồi: "${matchedFb.title}". Chi tiết: ${matchedFb.content}`
            }))
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải danh sách case chăm sóc khách.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [queryFeedbackId])

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!form.caseDate) errs.caseDate = 'Vui lòng chọn ngày lập case'
    if (!form.recoveryType) errs.recoveryType = 'Vui lòng chọn loại phục hồi'
    if (!form.priority) errs.priority = 'Vui lòng chọn mức độ ưu tiên'
    if (!form.status) errs.status = 'Vui lòng chọn trạng thái ban đầu'
    if (!form.issueSummary.trim()) errs.issueSummary = 'Vui lòng nhập tóm tắt sự cố cần xử lý'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newCase: GuestRecoveryCase = {
      id: `case-${Date.now().toString().slice(-4)}`,
      feedbackId: form.feedbackId || null,
      reservationId: form.reservationId || null,
      emailDraftId: form.emailDraftId || null,
      improvementActionId: form.improvementActionId || null,
      caseDate: form.caseDate,
      guestName: form.guestName || 'Khách ẩn danh',
      guestContact: form.guestContact || null,
      recoveryType: form.recoveryType,
      priority: form.priority,
      status: form.status,
      ownerName: form.ownerName || 'Chưa phân công',
      dueDate: form.dueDate || null,
      issueSummary: form.issueSummary,
      recoveryPlan: form.recoveryPlan || null,
      followUpNote: form.followUpNote || null,
      recoveryResult: form.recoveryResult || null,
      ceoAttentionRequired: form.ceoAttentionRequired,
      resolvedAt: form.status === 'resolved' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newCase, ...cases]
    localStorage.setItem('mvos_guest_recovery_cases', JSON.stringify(updated))
    setCases(updated)
    setSelectedCase(newCase)

    // Reset Form
    setForm({
      caseDate: '2026-06-28',
      feedbackId: '',
      reservationId: '',
      emailDraftId: '',
      improvementActionId: '',
      guestName: '',
      guestContact: '',
      recoveryType: 'apology',
      priority: 'medium',
      status: 'open',
      ownerName: '',
      dueDate: '2026-06-29',
      issueSummary: '',
      recoveryPlan: '',
      followUpNote: '',
      recoveryResult: '',
      ceoAttentionRequired: false
    })
  }

  const handleUpdateStatus = (caseId: string, nextStatus: GuestRecoveryStatus, customResult?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = cases.map((c) => {
      if (c.id === caseId) {
        const isResolved = nextStatus === 'resolved' || nextStatus === 'closed'
        const updatedCase = {
          ...c,
          status: nextStatus,
          recoveryResult: isResolved ? customResult || c.recoveryResult || 'Đã xử lý phục hồi xong.' : c.recoveryResult,
          resolvedAt: isResolved ? nowStr : c.resolvedAt,
          updatedAt: nowStr
        }
        if (selectedCase?.id === caseId) setSelectedCase(updatedCase)
        return updatedCase
      }
      return c
    })
    localStorage.setItem('mvos_guest_recovery_cases', JSON.stringify(updated))
    setCases(updated)
  }

  const getRecoveryTypeLabel = (tp: GuestRecoveryType) => {
    switch (tp) {
      case 'apology': return 'Xin lỗi khách'
      case 'manager_call': return 'Quản lý gọi khách'
      case 'email_follow_up': return 'Follow-up qua email'
      case 'agency_follow_up': return 'Follow-up với công ty du lịch'
      case 'complimentary_item': return 'Món tặng'
      case 'discount_offer': return 'Đề xuất giảm giá'
      case 'rebooking_offer': return 'Mời đặt lại'
      case 'service_correction': return 'Sửa lỗi dịch vụ'
      case 'internal_resolution': return 'Xử lý nội bộ'
      default: return 'Khác'
    }
  }

  const getPriorityLabel = (pr: GuestRecoveryPriority) => {
    switch (pr) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'critical': return 'Nghiêm trọng'
      default: return pr
    }
  }

  const getPriorityClass = (pr: GuestRecoveryPriority) => {
    switch (pr) {
      case 'critical':
        return 'text-red-500 font-bold border border-red-500/35 bg-red-500/5 px-1.5 py-0.2 rounded text-[9px]'
      case 'high':
        return 'text-orange-400 font-semibold border border-orange-500/25 bg-orange-500/5 px-1.5 py-0.2 rounded text-[9px]'
      case 'medium':
        return 'text-yellow-500 border border-yellow-500/25 bg-yellow-500/5 px-1.5 py-0.2 rounded text-[9px]'
      default:
        return 'text-foreground/50 border border-foreground/15 px-1.5 py-0.2 rounded text-[9px]'
    }
  }

  const getStatusLabel = (st: GuestRecoveryStatus) => {
    switch (st) {
      case 'open': return 'Mới mở'
      case 'contacting': return 'Đang liên hệ'
      case 'waiting_guest_response': return 'Chờ phản hồi khách'
      case 'recovery_offered': return 'Đã đề xuất phục hồi'
      case 'resolved': return 'Đã xử lý'
      case 'closed': return 'Đã đóng'
      case 'archived': return 'Lưu trữ'
      default: return st
    }
  }

  const getStatusClass = (st: GuestRecoveryStatus) => {
    switch (st) {
      case 'resolved':
      case 'closed':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'recovery_offered':
      case 'contacting':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'waiting_guest_response':
        return 'bg-purple-500/10 border border-purple-500/25 text-purple-400'
      case 'open':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getFeedbackTitle = (fbId: string | null | undefined) => {
    if (!fbId) return 'Không liên kết'
    const found = feedbacks.find(f => f.id === fbId)
    return found ? found.title : fbId
  }

  const getReservationTitle = (resId: string | null | undefined) => {
    if (!resId) return 'Không liên kết'
    const found = reservations.find(r => r.id === resId)
    return found ? `Khách: ${found.guestName} (${found.bookingDate})` : resId
  }

  const getEmailDraftTitle = (draftId: string | null | undefined) => {
    if (!draftId) return 'Không liên kết'
    const found = emailDrafts.find(d => d.id === draftId)
    return found ? found.draftSubject : draftId
  }

  const getImprovementTitle = (impId: string | null | undefined) => {
    if (!impId) return 'Không liên kết'
    const found = improvements.find(i => i.id === impId)
    return found ? found.title : impId
  }

  // Calculate Metrics
  const openCount = cases.filter(c => c.status === 'open' || c.status === 'contacting' || c.status === 'recovery_offered').length
  const waitingGuestCount = cases.filter(c => c.status === 'waiting_guest_response').length
  const ceoAttentionCount = cases.filter(c => c.ceoAttentionRequired && c.status !== 'closed' && c.status !== 'archived').length
  const resolvedCount = cases.filter(c => c.status === 'resolved' || c.status === 'closed').length

  const handleResolveCase = (caseId: string) => {
    const res = prompt('Nhập kết quả xử lý phục hồi khách hàng:', 'Khách đã vui vẻ nhận voucher giảm giá 15% cho lần sau.')
    if (res !== null) {
      handleUpdateStatus(caseId, 'resolved', res)
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải case phục hồi trải nghiệm khách…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải case phục hồi trải nghiệm khách.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🛡️ Phục hồi trải nghiệm khách (Guest Recovery & Follow-up)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Theo dõi các trường hợp cần xin lỗi, follow-up hoặc phục hồi trải nghiệm sau phản hồi của khách.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng case</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{cases.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang xử lý</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{openCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Chờ phản hồi khách</span>
          <span className="text-2xl font-serif-cormorant font-bold text-purple-400 mt-1 block">{waitingGuestCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cần CEO xem</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{ceoAttentionCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã xử lý</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{resolvedCount}</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Cases Listing & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Ngày case</th>
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4">Loại phục hồi</th>
                    <th className="py-3 px-4">Mức ưu tiên</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Người phụ trách</th>
                    <th className="py-3 px-4">Hạn xử lý</th>
                    <th className="py-3 px-4">CEO xem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {cases.length > 0 ? (
                    cases.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedCase(c)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedCase?.id === c.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{c.caseDate}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground truncate max-w-[120px]" title={c.guestName || ''}>
                          {c.guestName || 'Ẩn danh'}
                        </td>
                        <td className="py-3.5 px-4 text-foreground/85">{getRecoveryTypeLabel(c.recoveryType)}</td>
                        <td className="py-3.5 px-4">
                          <span className={getPriorityClass(c.priority)}>{getPriorityLabel(c.priority)}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(c.status)}`}>
                            {getStatusLabel(c.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-sans font-semibold text-foreground/75">{c.ownerName || '-'}</td>
                        <td className="py-3.5 px-4 font-mono text-foreground/60">{c.dueDate || '-'}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-red-400">
                          {c.ceoAttentionRequired ? 'CÓ' : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có case phục hồi trải nghiệm khách nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tiếp nhận case phục hồi khách
            </h3>

            <form onSubmit={handleCreateCase} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày lập case *</label>
                  <input
                    type="date"
                    value={form.caseDate}
                    onChange={(e) => setForm({ ...form, caseDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.caseDate && <span className="text-[10px] text-red-400 italic">{validationErrors.caseDate}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Hạn xử lý phục hồi</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên khách hàng</label>
                  <input
                    type="text"
                    placeholder="Họ tên khách hoặc đại diện đoàn..."
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Thông tin liên hệ</label>
                  <input
                    type="text"
                    placeholder="Số điện thoại, Zalo, Email..."
                    value={form.guestContact}
                    onChange={(e) => setForm({ ...form, guestContact: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Loại phục hồi *</label>
                  <select
                    value={form.recoveryType}
                    onChange={(e) => setForm({ ...form, recoveryType: e.target.value as GuestRecoveryType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="apology">Xin lỗi khách</option>
                    <option value="manager_call">Quản lý gọi khách</option>
                    <option value="email_follow_up">Follow-up qua email</option>
                    <option value="agency_follow_up">Follow-up với công ty du lịch</option>
                    <option value="complimentary_item">Món tặng (Complimentary)</option>
                    <option value="discount_offer">Đề xuất giảm giá</option>
                    <option value="rebooking_offer">Mời đặt lại</option>
                    <option value="service_correction">Sửa lỗi dịch vụ</option>
                    <option value="internal_resolution">Xử lý nội bộ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mức ưu tiên *</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as GuestRecoveryPriority })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                    <option value="critical">Nghiêm trọng (Critical)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold text-gold">Người phụ trách xử lý</label>
                  <input
                    type="text"
                    placeholder="Tên quản lý trực tiếp chăm sóc..."
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Tóm tắt vấn đề phát sinh *</label>
                <textarea
                  rows={2}
                  placeholder="Mô tả cụ thể sự cố dịch vụ hoặc khiếu nại khách gặp phải..."
                  value={form.issueSummary}
                  onChange={(e) => setForm({ ...form, issueSummary: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                {validationErrors.issueSummary && <span className="text-[10px] text-red-400 italic">{validationErrors.issueSummary}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Phương án phục hồi đề xuất</label>
                <textarea
                  rows={2}
                  placeholder="Kế hoạch bồi thường, xin lỗi hoặc quà tặng bồi hoàn..."
                  value={form.recoveryPlan}
                  onChange={(e) => setForm({ ...form, recoveryPlan: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Phản hồi khách hàng liên quan</label>
                  <select
                    value={form.feedbackId}
                    onChange={(e) => {
                      const matched = feedbacks.find(f => f.id === e.target.value)
                      setForm({
                        ...form,
                        feedbackId: e.target.value,
                        guestName: matched ? matched.guestName || '' : '',
                        guestContact: matched ? matched.guestContact || '' : '',
                        issueSummary: matched ? `Ghi nhận từ phản hồi: "${matched.title}". Chi tiết: ${matched.content}` : ''
                      })
                    }}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn phản hồi liên kết --</option>
                    {feedbacks.map((fb) => (
                      <option key={fb.id} value={fb.id}>
                        {fb.title} ({fb.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Hành động cải tiến liên quan</label>
                  <select
                    value={form.improvementActionId}
                    onChange={(e) => setForm({ ...form, improvementActionId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn hành động cải tiến --</option>
                    {improvements.map((imp) => (
                      <option key={imp.id} value={imp.id}>
                        {imp.title} ({imp.status})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Đặt bàn liên quan</label>
                  <select
                    value={form.reservationId}
                    onChange={(e) => setForm({ ...form, reservationId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn lượt đặt bàn --</option>
                    {reservations.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.guestName} ({r.bookingDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Thư nháp liên quan</label>
                  <select
                    value={form.emailDraftId}
                    onChange={(e) => setForm({ ...form, emailDraftId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn email nháp follow-up --</option>
                    {emailDrafts.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.draftSubject} ({d.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-6 items-center pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.ceoAttentionRequired}
                    onChange={(e) => setForm({ ...form, ceoAttentionRequired: e.target.checked })}
                    className="accent-gold h-4 w-4 cursor-pointer"
                  />
                  <span className="font-semibold text-foreground/90 font-sans">Yêu cầu CEO phê duyệt phương án bồi thường lớn</span>
                </div>
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Mở case phục hồi
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Action panel */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết xử lý
            </h3>

            {selectedCase ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    [{getRecoveryTypeLabel(selectedCase.recoveryType)}] Case #{selectedCase.id}
                  </h4>
                  <span className="text-[9px] text-foreground/45 font-mono mt-0.5 block">Lập ngày: {selectedCase.caseDate}</span>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Khách hàng</span>
                    <span className="font-bold text-foreground/80 block">{selectedCase.guestName || 'Ẩn danh'}</span>
                    {selectedCase.guestContact && <span className="text-[10px] text-foreground/60 block">{selectedCase.guestContact}</span>}
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người phụ trách</span>
                    <span className="font-bold text-gold block">{selectedCase.ownerName || 'Chưa phân công'}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mức ưu tiên</span>
                    <span className={getPriorityClass(selectedCase.priority)}>{getPriorityLabel(selectedCase.priority)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(selectedCase.status)}`}>
                      {getStatusLabel(selectedCase.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-foreground/50 font-mono block">Tóm tắt sự việc phát sinh</span>
                  <p className="text-foreground/90 bg-background/40 p-2.5 rounded border border-gold-border/10 leading-relaxed">
                    {selectedCase.issueSummary}
                  </p>
                </div>

                {selectedCase.recoveryPlan && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-gold font-mono uppercase block">Phương án phục hồi</span>
                    <p className="text-foreground/90 bg-gold-muted/5 p-2.5 rounded border border-gold-border/15 leading-relaxed">
                      {selectedCase.recoveryPlan}
                    </p>
                  </div>
                )}

                {selectedCase.followUpNote && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú cuộc gọi / Gặp gỡ</span>
                    <p className="text-foreground/80 leading-relaxed italic">{selectedCase.followUpNote}</p>
                  </div>
                )}

                {selectedCase.recoveryResult && (
                  <div className="p-3 border border-green-500/20 bg-green-500/5 rounded-lg space-y-1">
                    <span className="text-[9px] text-green-400 font-mono block">Kết quả khắc phục trải nghiệm</span>
                    <p className="text-foreground/85 leading-relaxed italic">&ldquo;{selectedCase.recoveryResult}&rdquo;</p>
                    {selectedCase.resolvedAt && (
                      <span className="text-[9px] text-foreground/50 block font-mono mt-1">Hoàn tất ngày: {selectedCase.resolvedAt}</span>
                    )}
                  </div>
                )}

                <div className="border-t border-gold-border/10 pt-3 space-y-2">
                  <span className="text-[9px] text-foreground/50 font-mono uppercase block">Bản đồ liên kết</span>
                  <div className="text-[10px] space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Phản hồi khách:</span>
                      <span className="text-gold font-bold truncate max-w-[120px]" title={selectedCase.feedbackId || ''}>
                        {getFeedbackTitle(selectedCase.feedbackId)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Lượt đặt bàn:</span>
                      <span className="text-gold font-bold truncate max-w-[120px]" title={selectedCase.reservationId || ''}>
                        {getReservationTitle(selectedCase.reservationId)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Thư nháp follow-up:</span>
                      <span className="text-gold font-bold truncate max-w-[120px]" title={selectedCase.emailDraftId || ''}>
                        {getEmailDraftTitle(selectedCase.emailDraftId)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Hành động cải tiến:</span>
                      <span className="text-gold font-bold truncate max-w-[120px]" title={selectedCase.improvementActionId || ''}>
                        {getImprovementTitle(selectedCase.improvementActionId)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-1 font-mono text-[9px]">
                  {selectedCase.ceoAttentionRequired && (
                    <span className="rounded bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-red-400 font-bold">
                      ⚠️ CEO PHÊ DUYỆT ĐỀ XUẤT LỚN
                    </span>
                  )}
                </div>

                {/* State Actions */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật tiến trình case</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedCase.id, 'contacting')}
                      disabled={selectedCase.status === 'resolved' || selectedCase.status === 'closed'}
                      className="rounded border border-blue-500/40 hover:border-blue-500 px-2 py-1.5 text-center text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Đang liên hệ
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedCase.id, 'waiting_guest_response')}
                      disabled={selectedCase.status === 'resolved' || selectedCase.status === 'closed'}
                      className="rounded border border-purple-500/40 hover:border-purple-500 px-2 py-1.5 text-center text-[10px] text-purple-400 hover:bg-purple-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Chờ khách phản hồi
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedCase.id, 'recovery_offered')}
                      disabled={selectedCase.status === 'resolved' || selectedCase.status === 'closed'}
                      className="col-span-2 rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-center text-[10px] text-yellow-500 hover:bg-yellow-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Đã đề xuất phương án phục hồi
                    </button>

                    <button
                      onClick={() => handleResolveCase(selectedCase.id)}
                      disabled={selectedCase.status === 'resolved' || selectedCase.status === 'closed'}
                      className="col-span-2 rounded border border-green-500/40 hover:border-green-500 px-2 py-2 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Đánh dấu đã xử lý xong
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedCase.id, 'closed')}
                      className="rounded border border-foreground/30 hover:border-foreground px-2 py-1.5 text-center text-[10px] text-foreground/60 hover:bg-foreground/5 transition-all"
                    >
                      Đóng case
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedCase.id, 'archived')}
                      className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Lưu trữ case
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một case phục hồi từ danh sách để xem chi tiết đầy đủ và bồi hoàn.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RecoveryPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải case phục hồi trải nghiệm khách…</p>
      </div>
    }>
      <RecoveryPageContent />
    </Suspense>
  )
}
