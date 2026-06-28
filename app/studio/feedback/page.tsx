'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export type GuestFeedbackSourceChannel =
  | "onsite"
  | "email"
  | "phone"
  | "zalo"
  | "google_review"
  | "tripadvisor"
  | "facebook"
  | "tour_guide"
  | "travel_agency"
  | "manager_note"
  | "other"

export type GuestFeedbackType =
  | "complaint"
  | "compliment"
  | "suggestion"
  | "incident"
  | "service_issue"
  | "kitchen_issue"
  | "reservation_issue"
  | "email_issue"
  | "review"
  | "other"

export type GuestFeedbackSeverity =
  | "low"
  | "medium"
  | "high"
  | "critical"

export type GuestFeedbackStatus =
  | "new"
  | "reviewing"
  | "action_required"
  | "resolved"
  | "archived"

export interface GuestFeedbackRecord {
  id: string
  feedbackDate: string
  visitDate?: string | null
  guestName?: string | null
  guestContact?: string | null
  sourceChannel: GuestFeedbackSourceChannel
  feedbackType: GuestFeedbackType
  rating?: number | null
  severity: GuestFeedbackSeverity
  status: GuestFeedbackStatus
  title: string
  content: string
  reservationId?: string | null
  dailyReportId?: string | null
  learningEventId?: string | null
  improvementActionId?: string | null
  ownerName?: string | null
  actionRequired: boolean
  ceoAttentionRequired: boolean
  resolutionNote?: string | null
  resolvedAt?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface DailyReport {
  id: string
  reportDate: string
  managerName: string
  overallSummary: string
}

interface LearningEvent {
  id: string
  title: string
}

interface ImprovementAction {
  id: string
  title: string
  status: string
}

const INITIAL_FEEDBACKS: GuestFeedbackRecord[] = [
  {
    id: 'fb-801',
    feedbackDate: '2026-06-28',
    visitDate: '2026-06-28',
    guestName: 'Mr. Johnathan',
    guestContact: 'johnathan@example.com',
    sourceChannel: 'onsite',
    feedbackType: 'complaint',
    rating: 3,
    severity: 'medium',
    status: 'action_required',
    title: 'Súp hải sản khai vị hơi mặn nhẹ',
    content: 'Khách phản hồi món súp hải sản khai vị hơi mặn hơn khẩu vị thông thường của người nước ngoài. Đã thu hồi món, dâng đĩa súp nhạt hơn và tặng thêm rượu vang tráng miệng.',
    reservationId: null,
    dailyReportId: 'rep-701',
    learningEventId: null,
    improvementActionId: null,
    ownerName: 'Chef Joel (Bếp trưởng)',
    actionRequired: true,
    ceoAttentionRequired: false,
    resolutionNote: '',
    resolvedAt: null,
    createdAt: '2026-06-28 20:30',
    updatedAt: '2026-06-28 20:30'
  }
]

function FeedbackPageContent() {
  const searchParams = useSearchParams()
  const queryDailyReportId = searchParams.get('daily_report_id')

  const [feedbacks, setFeedbacks] = useState<GuestFeedbackRecord[]>([])
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [learnings, setLearnings] = useState<LearningEvent[]>([])
  const [improvements, setImprovements] = useState<ImprovementAction[]>([])

  const [selectedFeedback, setSelectedFeedback] = useState<GuestFeedbackRecord | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [form, setForm] = useState({
    feedbackDate: '2026-06-28',
    visitDate: '2026-06-28',
    guestName: '',
    guestContact: '',
    sourceChannel: 'onsite' as GuestFeedbackSourceChannel,
    feedbackType: 'complaint' as GuestFeedbackType,
    rating: '',
    severity: 'medium' as GuestFeedbackSeverity,
    status: 'new' as GuestFeedbackStatus,
    title: '',
    content: '',
    reservationId: '',
    dailyReportId: '',
    learningEventId: '',
    improvementActionId: '',
    ownerName: '',
    actionRequired: false,
    ceoAttentionRequired: false,
    resolutionNote: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedFeedbacks = localStorage.getItem('mvos_guest_feedbacks')
        const storedReports = localStorage.getItem('mvos_daily_reports')
        const storedLearnings = localStorage.getItem('mvos_learnings')
        const storedImps = localStorage.getItem('mvos_improvements')

        let loadedFeedbacks: GuestFeedbackRecord[] = []
        let loadedReports: DailyReport[] = []
        let loadedLearnings: LearningEvent[] = []
        let loadedImps: ImprovementAction[] = []

        if (storedFeedbacks) {
          loadedFeedbacks = JSON.parse(storedFeedbacks)
        } else {
          localStorage.setItem('mvos_guest_feedbacks', JSON.stringify(INITIAL_FEEDBACKS))
          loadedFeedbacks = INITIAL_FEEDBACKS
        }
        setFeedbacks(loadedFeedbacks)

        if (storedReports) {
          loadedReports = JSON.parse(storedReports)
          setDailyReports(loadedReports)
        }

        if (storedLearnings) {
          loadedLearnings = JSON.parse(storedLearnings)
          setLearnings(loadedLearnings)
        }

        if (storedImps) {
          loadedImps = JSON.parse(storedImps)
          setImprovements(loadedImps)
        }

        // Handle pre-population from Daily Report
        if (queryDailyReportId) {
          const matchedRep = loadedReports.find(r => r.id === queryDailyReportId)
          if (matchedRep) {
            setForm((prev) => ({
              ...prev,
              dailyReportId: matchedRep.id,
              feedbackDate: matchedRep.reportDate,
              sourceChannel: 'manager_note',
              title: `Ghi nhận phản hồi từ báo cáo: ${matchedRep.id}`,
              content: matchedRep.overallSummary
            }))
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải danh sách phản hồi từ bộ nhớ.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [queryDailyReportId])

  const handleCreateFeedback = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!form.feedbackDate) errs.feedbackDate = 'Vui lòng chọn ngày phản hồi'
    if (!form.sourceChannel) errs.sourceChannel = 'Vui lòng chọn nguồn phản hồi'
    if (!form.feedbackType) errs.feedbackType = 'Vui lòng chọn phân loại phản hồi'
    if (!form.severity) errs.severity = 'Vui lòng chọn mức độ nghiêm trọng'
    if (!form.title.trim()) errs.title = 'Vui lòng nhập tiêu đề phản hồi'
    if (!form.content.trim()) errs.content = 'Vui lòng nhập nội dung chi tiết phản hồi'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const parsedRating = form.rating ? parseFloat(form.rating) : null

    const newFeedback: GuestFeedbackRecord = {
      id: `fb-${Date.now().toString().slice(-4)}`,
      feedbackDate: form.feedbackDate,
      visitDate: form.visitDate || null,
      guestName: form.guestName || 'Khách vãng lai / Ẩn danh',
      guestContact: form.guestContact || null,
      sourceChannel: form.sourceChannel,
      feedbackType: form.feedbackType,
      rating: parsedRating,
      severity: form.severity,
      status: form.status,
      title: form.title,
      content: form.content,
      reservationId: form.reservationId || null,
      dailyReportId: form.dailyReportId || null,
      learningEventId: form.learningEventId || null,
      improvementActionId: form.improvementActionId || null,
      ownerName: form.ownerName || 'Chưa phân công',
      actionRequired: form.actionRequired,
      ceoAttentionRequired: form.ceoAttentionRequired,
      resolutionNote: form.resolutionNote || null,
      resolvedAt: form.status === 'resolved' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newFeedback, ...feedbacks]
    localStorage.setItem('mvos_guest_feedbacks', JSON.stringify(updated))
    setFeedbacks(updated)
    setSelectedFeedback(newFeedback)

    // Reset Form
    setForm({
      feedbackDate: '2026-06-28',
      visitDate: '2026-06-28',
      guestName: '',
      guestContact: '',
      sourceChannel: 'onsite',
      feedbackType: 'complaint',
      rating: '',
      severity: 'medium',
      status: 'new',
      title: '',
      content: '',
      reservationId: '',
      dailyReportId: '',
      learningEventId: '',
      improvementActionId: '',
      ownerName: '',
      actionRequired: false,
      ceoAttentionRequired: false,
      resolutionNote: ''
    })
  }

  const handleUpdateStatus = (feedbackId: string, nextStatus: GuestFeedbackStatus, customNote?: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = feedbacks.map((fb) => {
      if (fb.id === feedbackId) {
        const isResolved = nextStatus === 'resolved'
        const updatedFb = {
          ...fb,
          status: nextStatus,
          actionRequired: nextStatus === 'action_required' ? true : fb.actionRequired,
          resolutionNote: isResolved ? customNote || fb.resolutionNote || 'Đã xử lý dứt điểm.' : fb.resolutionNote,
          resolvedAt: isResolved ? nowStr : fb.resolvedAt,
          updatedAt: nowStr
        }
        if (selectedFeedback?.id === feedbackId) setSelectedFeedback(updatedFb)
        return updatedFb
      }
      return fb
    })
    localStorage.setItem('mvos_guest_feedbacks', JSON.stringify(updated))
    setFeedbacks(updated)
  }

  const getSourceChannelLabel = (channel: GuestFeedbackSourceChannel) => {
    switch (channel) {
      case 'onsite': return 'Tại nhà hàng'
      case 'email': return 'Email'
      case 'phone': return 'Điện thoại'
      case 'zalo': return 'Zalo'
      case 'google_review': return 'Google Review'
      case 'tripadvisor': return 'TripAdvisor'
      case 'facebook': return 'Facebook'
      case 'tour_guide': return 'Hướng dẫn viên'
      case 'travel_agency': return 'Công ty du lịch'
      case 'manager_note': return 'Ghi chú quản lý'
      default: return 'Khác'
    }
  }

  const getFeedbackTypeLabel = (tp: GuestFeedbackType) => {
    switch (tp) {
      case 'complaint': return 'Phàn nàn'
      case 'compliment': return 'Lời khen'
      case 'suggestion': return 'Góp ý'
      case 'incident': return 'Sự cố'
      case 'service_issue': return 'Vấn đề phục vụ'
      case 'kitchen_issue': return 'Vấn đề bếp'
      case 'reservation_issue': return 'Vấn đề đặt bàn'
      case 'email_issue': return 'Vấn đề email'
      case 'review': return 'Review'
      default: return 'Khác'
    }
  }

  const getSeverityLabel = (sev: GuestFeedbackSeverity) => {
    switch (sev) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'critical': return 'Nghiêm trọng'
      default: return sev
    }
  }

  const getSeverityClass = (sev: GuestFeedbackSeverity) => {
    switch (sev) {
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

  const getStatusLabel = (st: GuestFeedbackStatus) => {
    switch (st) {
      case 'new': return 'Mới ghi nhận'
      case 'reviewing': return 'Đang xem xét'
      case 'action_required': return 'Cần hành động'
      case 'resolved': return 'Đã xử lý'
      case 'archived': return 'Lưu trữ'
      default: return st
    }
  }

  const getStatusClass = (st: GuestFeedbackStatus) => {
    switch (st) {
      case 'resolved':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'action_required':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      case 'reviewing':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'new':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  // Calculate Metrics
  const totalCount = feedbacks.length
  const newCount = feedbacks.filter(f => f.status === 'new').length
  const actionReqCount = feedbacks.filter(f => f.actionRequired && f.status !== 'resolved' && f.status !== 'archived').length
  const ceoAttentionCount = feedbacks.filter(f => f.ceoAttentionRequired && f.status !== 'resolved' && f.status !== 'archived').length
  const resolvedCount = feedbacks.filter(f => f.status === 'resolved').length

  const handleResolveFeedback = (feedbackId: string) => {
    const note = prompt('Nhập ghi chú xử lý dứt điểm cho phản hồi này:', 'Đã xin lỗi khách trực tiếp, bếp trưởng đã điều chỉnh công thức súp.')
    if (note !== null) {
      handleUpdateStatus(feedbackId, 'resolved', note)
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải phản hồi khách hàng…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải phản hồi khách hàng.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🛎️ Phản hồi khách hàng (Guest Experience Feedback)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Ghi nhận, theo dõi và xử lý phản hồi từ khách để cải thiện trải nghiệm vận hành của Maison Vie.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng phản hồi</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Phản hồi mới</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{newCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cần hành động</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-400 mt-1 block">{actionReqCount}</span>
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
        {/* Feedbacks Listing & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Ngày nhận</th>
                    <th className="py-3 px-4">Khách hàng</th>
                    <th className="py-3 px-4">Nguồn</th>
                    <th className="py-3 px-4">Loại</th>
                    <th className="py-3 px-4">Mức độ</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">CEO xem</th>
                    <th className="py-3 px-4 text-center">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {feedbacks.length > 0 ? (
                    feedbacks.map((fb) => (
                      <tr
                        key={fb.id}
                        onClick={() => setSelectedFeedback(fb)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedFeedback?.id === fb.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{fb.feedbackDate}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground truncate max-w-[130px]" title={fb.guestName || ''}>
                          {fb.guestName || 'Ẩn danh'}
                        </td>
                        <td className="py-3.5 px-4 text-foreground/85 font-sans">{getSourceChannelLabel(fb.sourceChannel)}</td>
                        <td className="py-3.5 px-4 text-gold-hover font-semibold">{getFeedbackTypeLabel(fb.feedbackType)}</td>
                        <td className="py-3.5 px-4">
                          <span className={getSeverityClass(fb.severity)}>{getSeverityLabel(fb.severity)}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(fb.status)}`}>
                            {getStatusLabel(fb.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-red-400">
                          {fb.ceoAttentionRequired ? 'CÓ' : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-yellow-500">
                          {fb.rating !== null ? `${fb.rating}/5` : '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có phản hồi khách hàng nào được ghi nhận.
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
              🆕 Tiếp nhận phản hồi mới
            </h3>

            <form onSubmit={handleCreateFeedback} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày phản hồi *</label>
                  <input
                    type="date"
                    value={form.feedbackDate}
                    onChange={(e) => setForm({ ...form, feedbackDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.feedbackDate && <span className="text-[10px] text-red-400 italic">{validationErrors.feedbackDate}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày khách dùng bữa</label>
                  <input
                    type="date"
                    value={form.visitDate}
                    onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Điểm đánh giá (1-5)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.5"
                    placeholder="Ví dụ: 4.5"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên khách hàng</label>
                  <input
                    type="text"
                    placeholder="Để trống nếu ẩn danh..."
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Thông tin liên hệ (Email/SĐT)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 090xxxx..."
                    value={form.guestContact}
                    onChange={(e) => setForm({ ...form, guestContact: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Kênh phản hồi *</label>
                  <select
                    value={form.sourceChannel}
                    onChange={(e) => setForm({ ...form, sourceChannel: e.target.value as GuestFeedbackSourceChannel })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="onsite">Tại nhà hàng</option>
                    <option value="email">Email</option>
                    <option value="phone">Điện thoại</option>
                    <option value="zalo">Zalo</option>
                    <option value="google_review">Google Review</option>
                    <option value="tripadvisor">TripAdvisor</option>
                    <option value="facebook">Facebook</option>
                    <option value="tour_guide">Hướng dẫn viên</option>
                    <option value="travel_agency">Công ty du lịch</option>
                    <option value="manager_note">Ghi chú quản lý</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mức độ nghiêm trọng *</label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value as GuestFeedbackSeverity })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                    <option value="critical">Nghiêm trọng (Critical)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Phân loại loại *</label>
                  <select
                    value={form.feedbackType}
                    onChange={(e) => setForm({ ...form, feedbackType: e.target.value as GuestFeedbackType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="complaint">Phàn nàn</option>
                    <option value="compliment">Lời khen</option>
                    <option value="suggestion">Góp ý</option>
                    <option value="incident">Sự cố</option>
                    <option value="service_issue">Vấn đề phục vụ</option>
                    <option value="kitchen_issue">Vấn đề bếp</option>
                    <option value="reservation_issue">Vấn đề đặt bàn</option>
                    <option value="email_issue">Vấn đề email</option>
                    <option value="review">Review</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Tiêu đề phản hồi *</label>
                <input
                  type="text"
                  placeholder="Mô tả tóm tắt sự việc..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                {validationErrors.title && <span className="text-[10px] text-red-400 italic">{validationErrors.title}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Nội dung chi tiết phản hồi *</label>
                <textarea
                  rows={4}
                  placeholder="Ghi cụ thể ý kiến khách hàng, phản ứng và bối cảnh xảy ra..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                {validationErrors.content && <span className="text-[10px] text-red-400 italic">{validationErrors.content}</span>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Báo cáo ngày liên quan</label>
                  <select
                    value={form.dailyReportId}
                    onChange={(e) => setForm({ ...form, dailyReportId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn báo cáo ngày --</option>
                    {dailyReports.map((r) => (
                      <option key={r.id} value={r.id}>
                        Báo cáo #{r.id} - {r.reportDate} ({r.managerName})
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
                    <option value="">-- Chọn hành động khắc phục --</option>
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
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Bài học liên quan</label>
                  <select
                    value={form.learningEventId}
                    onChange={(e) => setForm({ ...form, learningEventId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn bài học vận hành --</option>
                    {learnings.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.title} ({l.id})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold text-gold">Người chịu trách nhiệm xử lý</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Chef Joel (Bếp trưởng)..."
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="flex gap-6 items-center pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.actionRequired}
                    onChange={(e) => setForm({ ...form, actionRequired: e.target.checked })}
                    className="accent-gold h-4 w-4 cursor-pointer"
                  />
                  <span className="font-semibold text-foreground/90 font-sans">Đánh dấu cần hành động (Action Required)</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.ceoAttentionRequired}
                    onChange={(e) => setForm({ ...form, ceoAttentionRequired: e.target.checked })}
                    className="accent-gold h-4 w-4 cursor-pointer"
                  />
                  <span className="font-semibold text-foreground/90 font-sans">Yêu cầu CEO phê duyệt / xem xét</span>
                </div>
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Ghi nhận phản hồi
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Action panel */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết Phản hồi
            </h3>

            {selectedFeedback ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    [{getFeedbackTypeLabel(selectedFeedback.feedbackType)}] {selectedFeedback.title}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Mã: {selectedFeedback.id}</span>
                    <span>Ngày nhận: {selectedFeedback.feedbackDate}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Khách hàng</span>
                    <span className="font-bold text-foreground/80 block">{selectedFeedback.guestName || 'Ẩn danh'}</span>
                    {selectedFeedback.guestContact && <span className="text-[10px] text-foreground/60 block">{selectedFeedback.guestContact}</span>}
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Nguồn & Đánh giá</span>
                    <span className="font-semibold text-foreground/85 block">{getSourceChannelLabel(selectedFeedback.sourceChannel)}</span>
                    {selectedFeedback.rating !== null && <span className="text-yellow-500 font-bold block">{selectedFeedback.rating}/5 Điểm</span>}
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mức độ nghiêm trọng</span>
                    <span className={getSeverityClass(selectedFeedback.severity)}>{getSeverityLabel(selectedFeedback.severity)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái xử lý</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(selectedFeedback.status)}`}>
                      {getStatusLabel(selectedFeedback.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người chịu trách nhiệm</span>
                    <span className="font-semibold text-foreground/80 block">{selectedFeedback.ownerName || 'Chưa phân công'}</span>
                  </div>
                  {selectedFeedback.visitDate && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Ngày dùng bữa</span>
                      <span className="font-semibold text-foreground/80 block font-mono">{selectedFeedback.visitDate}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-gold font-mono uppercase block">Nội dung ý kiến</span>
                  <p className="text-foreground/90 italic leading-relaxed bg-gold-muted/5 p-3 rounded-lg border border-gold-border/10">
                    &ldquo;{selectedFeedback.content}&rdquo;
                  </p>
                </div>

                {selectedFeedback.resolutionNote && (
                  <div className="p-3 border border-green-500/20 bg-green-500/5 rounded-lg space-y-1">
                    <span className="text-[9px] text-green-400 font-mono block">Biện pháp khắc phục đã thực hiện</span>
                    <p className="text-foreground/85 leading-relaxed italic">&ldquo;{selectedFeedback.resolutionNote}&rdquo;</p>
                    {selectedFeedback.resolvedAt && (
                      <span className="text-[9px] text-foreground/50 block font-mono mt-1">Giải quyết ngày: {selectedFeedback.resolvedAt}</span>
                    )}
                  </div>
                )}

                <div className="grid gap-2 grid-cols-2 pt-2 border-t border-gold-border/10">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Báo cáo ngày liên quan</span>
                    <span className="text-gold font-mono font-bold block truncate" title={selectedFeedback.dailyReportId || ''}>
                      {selectedFeedback.dailyReportId || 'Không liên kết'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Cải tiến liên quan</span>
                    <span className="text-gold font-mono font-bold block truncate" title={selectedFeedback.improvementActionId || ''}>
                      {selectedFeedback.improvementActionId || 'Không liên kết'}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4 pt-1 font-mono text-[9px]">
                  {selectedFeedback.ceoAttentionRequired && (
                    <span className="rounded bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-red-400 font-bold">
                      ⚠️ CẦN CEO XEM
                    </span>
                  )}
                  {selectedFeedback.actionRequired && (
                    <span className="rounded bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 text-yellow-500 font-bold">
                      🛠️ CẦN HÀNH ĐỘNG
                    </span>
                  )}
                </div>

                {/* Operations links loop */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Khép kín chu trình vận hành</span>
                  <div className="grid gap-2 grid-cols-2 mt-2">
                    <Link
                      href={`/studio/learning?feedback_id=${selectedFeedback.id}`}
                      className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] text-foreground/75 hover:text-gold transition-all block text-center"
                    >
                      🎓 Tạo bài học vận hành
                    </Link>
                    <Link
                      href={`/studio/improvements?feedback_id=${selectedFeedback.id}`}
                      className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] text-foreground/75 hover:text-gold transition-all block text-center"
                    >
                      🛠️ Tạo hành động cải tiến
                    </Link>
                    <Link
                      href={`/studio/recovery?feedback_id=${selectedFeedback.id}`}
                      className="col-span-2 rounded border border-gold hover:border-gold-hover px-2 py-1.5 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block text-center"
                    >
                      🛡️ Tạo case phục hồi
                    </Link>
                  </div>
                </div>

                {/* State Actions */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật phản hồi</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedFeedback.id, 'reviewing')}
                      disabled={selectedFeedback.status === 'resolved' || selectedFeedback.status === 'archived'}
                      className="rounded border border-blue-500/40 hover:border-blue-500 px-2 py-1.5 text-center text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Đang xem xét
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedFeedback.id, 'action_required')}
                      disabled={selectedFeedback.status === 'resolved' || selectedFeedback.status === 'archived'}
                      className="rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-center text-[10px] text-yellow-500 hover:bg-yellow-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Cần hành động
                    </button>

                    <button
                      onClick={() => handleResolveFeedback(selectedFeedback.id)}
                      disabled={selectedFeedback.status === 'resolved' || selectedFeedback.status === 'archived'}
                      className="col-span-2 rounded border border-green-500/40 hover:border-green-500 px-2 py-2 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Đánh dấu đã xử lý
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedFeedback.id, 'archived')}
                      className="col-span-2 rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Lưu trữ phản hồi
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một phản hồi từ danh sách để xem chi tiết đầy đủ và giải quyết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GuestFeedbackPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải phản hồi khách hàng…</p>
      </div>
    }>
      <FeedbackPageContent />
    </Suspense>
  )
}
