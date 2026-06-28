'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export type LearningSourceType =
  | "reservation"
  | "email"
  | "dashboard"
  | "guest_feedback"
  | "service"
  | "kitchen"
  | "finance"
  | "inventory"
  | "manual"

export type LearningCategory =
  | "guest_experience"
  | "service_quality"
  | "kitchen_quality"
  | "reservation_process"
  | "email_process"
  | "communication"
  | "cost_control"
  | "staffing"
  | "compliance"
  | "system"
  | "other"

export type LearningSeverity = "low" | "medium" | "high" | "critical"

export type LearningStatus =
  | "open"
  | "reviewing"
  | "action_required"
  | "resolved"
  | "archived"

export interface LearningEvent {
  id: string
  title: string
  description: string
  sourceType: LearningSourceType
  sourceId?: string | null
  category: LearningCategory
  severity: LearningSeverity
  status: LearningStatus
  ownerName?: string | null
  lesson?: string | null
  proposedAction?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

const INITIAL_LEARNINGS: LearningEvent[] = [
  {
    id: 'lrn-101',
    title: 'Hao hụt rượu vang Bordeaux cao cấp tại hầm',
    description: 'Phát hiện sai lệch 2 chai Château Margaux giữa sổ sách kho giấy và kiểm thực tế hầm rượu biệt thự. Nguyên nhân do thiếu đối chiếu ghi nhận số chai khui phục vụ tiệc cưới phòng Salon Royal.',
    sourceType: 'inventory',
    sourceId: null,
    category: 'cost_control',
    severity: 'high',
    status: 'action_required',
    ownerName: 'Lê Văn Binh (Quản lý kho)',
    lesson: 'Báo cáo khui rượu và bàn giao vỏ chai trống sau mỗi ca tiệc chưa được FOH ký xác nhận bàn giao cho Kho.',
    proposedAction: 'Triển khai quy trình bàn giao vỏ chai trống có chữ ký đối chiếu giữa sảnh FOH và quản lý kho sau mỗi sự kiện.',
    createdAt: '2026-06-25 15:00',
    updatedAt: '2026-06-25 16:30'
  },
  {
    id: 'lrn-102',
    title: 'Khách hàng phản ánh món súp hải sản bị lẫn vỏ tôm',
    description: 'Khách bàn VIP 2 phản ánh có mảnh vỏ tôm nhỏ lẫn trong món súp hải sản kiểu Pháp. May mắn khách không bị dị ứng hay tổn thương miệng, nhưng gây ảnh hưởng nghiêm trọng đến trải nghiệm ăn uống.',
    sourceType: 'guest_feedback',
    sourceId: null,
    category: 'kitchen_quality',
    severity: 'critical',
    status: 'resolved',
    ownerName: 'Chef Joel (Bếp trưởng)',
    lesson: 'Công đoạn lọc nước cốt súp hải sản bằng rây thô chưa lọc được toàn bộ các mảnh vỏ nhỏ phát sinh trong ca sơ chế bận rộn.',
    proposedAction: 'Yêu cầu phụ bếp sử dụng khăn lọc chuyên dụng (cheesecloth) để lọc lại nước dùng súp hải sản 100% trước khi chế biến.',
    createdAt: '2026-06-27 20:30',
    updatedAt: '2026-06-28 09:00'
  }
]

export default function LearningEventsPage() {
  const [events, setEvents] = useState<LearningEvent[]>([])
  const [selectedEvent, setSelectedEvent] = useState<LearningEvent | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    sourceType: 'manual' as LearningSourceType,
    category: 'guest_experience' as LearningCategory,
    severity: 'medium' as LearningSeverity,
    ownerName: '',
    lesson: '',
    proposedAction: ''
  })
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('mvos_learnings')
        if (stored) {
          setEvents(JSON.parse(stored))
        } else {
          localStorage.setItem('mvos_learnings', JSON.stringify(INITIAL_LEARNINGS))
          setEvents(INITIAL_LEARNINGS)
        }
        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu học tập vận hành.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Tiêu đề không được để trống'
    if (!form.description.trim()) errs.description = 'Mô tả vấn đề không được để trống'
    if (!form.category) errs.category = 'Vui lòng chọn nhóm vấn đề'
    if (!form.severity) errs.severity = 'Vui lòng chọn mức độ nghiêm trọng'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newEvent: LearningEvent = {
      id: `lrn-${Date.now().toString().slice(-4)}`,
      title: form.title,
      description: form.description,
      sourceType: form.sourceType,
      category: form.category,
      severity: form.severity,
      status: 'open',
      ownerName: form.ownerName || 'Chưa phân công',
      lesson: form.lesson,
      proposedAction: form.proposedAction,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newEvent, ...events]
    localStorage.setItem('mvos_learnings', JSON.stringify(updated))
    setEvents(updated)
    
    // Reset Form
    setForm({
      title: '',
      description: '',
      sourceType: 'manual',
      category: 'guest_experience',
      severity: 'medium',
      ownerName: '',
      lesson: '',
      proposedAction: ''
    })
  }

  const handleUpdateStatus = (eventId: string, nextStatus: LearningStatus) => {
    const updated = events.map((ev) => {
      if (ev.id === eventId) {
        const updatedEv = {
          ...ev,
          status: nextStatus,
          updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
        }
        if (selectedEvent?.id === eventId) {
          setSelectedEvent(updatedEv)
        }
        return updatedEv
      }
      return ev
    })

    localStorage.setItem('mvos_learnings', JSON.stringify(updated))
    setEvents(updated)
  }

  const getSourceTypeLabel = (src: LearningSourceType) => {
    switch (src) {
      case 'reservation': return 'Đặt bàn'
      case 'email': return 'Email'
      case 'dashboard': return 'Dashboard'
      case 'guest_feedback': return 'Phản hồi khách'
      case 'service': return 'Phục vụ'
      case 'kitchen': return 'Bếp'
      case 'finance': return 'Tài chính'
      case 'inventory': return 'Kho'
      case 'manual': return 'Nhập thủ công'
      default: return src
    }
  }

  const getCategoryLabel = (cat: LearningCategory) => {
    switch (cat) {
      case 'guest_experience': return 'Trải nghiệm khách'
      case 'service_quality': return 'Chất lượng phục vụ'
      case 'kitchen_quality': return 'Chất lượng bếp'
      case 'reservation_process': return 'Quy trình đặt bàn'
      case 'email_process': return 'Quy trình email'
      case 'communication': return 'Giao tiếp'
      case 'cost_control': return 'Kiểm soát chi phí'
      case 'staffing': return 'Nhân sự'
      case 'compliance': return 'Tuân thủ'
      case 'system': return 'Hệ thống'
      case 'other': return 'Khác'
      default: return cat
    }
  }

  const getSeverityLabel = (sev: LearningSeverity) => {
    switch (sev) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'critical': return 'Nghiêm trọng'
      default: return sev
    }
  }

  const getStatusLabel = (st: LearningStatus) => {
    switch (st) {
      case 'open': return 'Mới ghi nhận'
      case 'reviewing': return 'Đang xem xét'
      case 'action_required': return 'Cần hành động'
      case 'resolved': return 'Đã xử lý'
      case 'archived': return 'Lưu trữ'
      default: return st
    }
  }

  const getSeverityClass = (sev: LearningSeverity) => {
    switch (sev) {
      case 'critical':
        return 'bg-red-500/10 border border-red-500/25 text-red-400 font-bold'
      case 'high':
        return 'bg-orange-500/10 border border-orange-500/25 text-orange-400 font-semibold'
      case 'medium':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-400'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getStatusClass = (st: LearningStatus) => {
    switch (st) {
      case 'resolved':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'action_required':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      case 'reviewing':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'open':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  // Count summaries
  const totalLessons = events.length
  const actionRequiredCount = events.filter(e => e.status === 'action_required').length
  const reviewingCount = events.filter(e => e.status === 'reviewing').length
  const resolvedCount = events.filter(e => e.status === 'resolved').length
  const highSeverityCount = events.filter(e => e.severity === 'high' || e.severity === 'critical').length

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải dữ liệu học tập vận hành…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải dữ liệu học tập vận hành.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🏛️ Nhật ký học tập vận hành
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Ghi nhận bài học, rủi ro và hành động cải tiến từ vận hành thực tế của biệt thự Maison Vie.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng bài học</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalLessons}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cần hành động</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-400 mt-1 block">{actionRequiredCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang xem xét</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{reviewingCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã xử lý</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{resolvedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Nghiêm trọng / Cao</span>
          <span className="text-2xl font-serif-cormorant font-bold text-orange-400 mt-1 block">{highSeverityCount}</span>
        </div>
      </div>

      {/* Split layout: Event list + Form/Details */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Learning Event list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Tiêu đề bài học</th>
                    <th className="py-3 px-4">Nguồn phát sinh</th>
                    <th className="py-3 px-4">Nhóm vấn đề</th>
                    <th className="py-3 px-4">Mức độ</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {events.length > 0 ? (
                    events.map((ev) => (
                      <tr 
                        key={ev.id} 
                        onClick={() => setSelectedEvent(ev)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedEvent?.id === ev.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-foreground">{ev.title}</td>
                        <td className="py-3.5 px-4 text-foreground/60">{getSourceTypeLabel(ev.sourceType)}</td>
                        <td className="py-3.5 px-4 text-foreground/60">{getCategoryLabel(ev.category)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getSeverityClass(ev.severity)}`}>
                            {getSeverityLabel(ev.severity)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(ev.status)}`}>
                            {getStatusLabel(ev.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="text-gold hover:underline font-semibold">Xem chi tiết</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có bài học vận hành nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form to create new learning event */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              📝 Ghi nhận bài học mới
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Tiêu đề *</label>
                <input
                  type="text"
                  placeholder="Tiêu đề bài học / sự cố phát sinh..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                {validationErrors.title && <span className="text-[10px] text-red-400 italic">{validationErrors.title}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Mô tả vấn đề *</label>
                <textarea
                  placeholder="Mô tả chi tiết sự việc phát sinh tại nhà hàng..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none font-sans"
                />
                {validationErrors.description && <span className="text-[10px] text-red-400 italic">{validationErrors.description}</span>}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Nguồn phát sinh</label>
                  <select
                    value={form.sourceType}
                    onChange={(e) => setForm({ ...form, sourceType: e.target.value as LearningSourceType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="reservation">Đặt bàn (Reservation)</option>
                    <option value="email">Email</option>
                    <option value="dashboard">Dashboard</option>
                    <option value="guest_feedback">Phản hồi khách (Feedback)</option>
                    <option value="service">Phục vụ (Service)</option>
                    <option value="kitchen">Bếp (Kitchen)</option>
                    <option value="finance">Tài chính (Finance)</option>
                    <option value="inventory">Kho (Inventory)</option>
                    <option value="manual">Nhập thủ công (Manual)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Nhóm vấn đề *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as LearningCategory })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="guest_experience">Trải nghiệm khách</option>
                    <option value="service_quality">Chất lượng phục vụ</option>
                    <option value="kitchen_quality">Chất lượng bếp</option>
                    <option value="reservation_process">Quy trình đặt bàn</option>
                    <option value="email_process">Quy trình email</option>
                    <option value="communication">Giao tiếp</option>
                    <option value="cost_control">Kiểm soát chi phí</option>
                    <option value="staffing">Nhân sự</option>
                    <option value="compliance">Tuân thủ</option>
                    <option value="system">Hệ thống</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mức độ *</label>
                  <select
                    value={form.severity}
                    onChange={(e) => setForm({ ...form, severity: e.target.value as LearningSeverity })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="low">Thấp (Low)</option>
                    <option value="medium">Trung bình (Medium)</option>
                    <option value="high">Cao (High)</option>
                    <option value="critical">Nghiêm trọng (Critical)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Người phụ trách xử lý</label>
                <input
                  type="text"
                  placeholder="Tên nhân viên / quản lý được giao trách nhiệm..."
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Bài học rút ra</label>
                <textarea
                  placeholder="Ghi nhận sai sót hoặc kiến thức đúc kết từ vụ việc..."
                  value={form.lesson}
                  onChange={(e) => setForm({ ...form, lesson: e.target.value })}
                  rows={2}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none font-sans"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Hành động đề xuất</label>
                <textarea
                  placeholder="Các bước cần thực hiện để tránh lặp lại sai lầm..."
                  value={form.proposedAction}
                  onChange={(e) => setForm({ ...form, proposedAction: e.target.value })}
                  rows={2}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-5 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Lưu bài học
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Action transitions */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết bài học
            </h3>

            {selectedEvent ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-foreground font-serif-cormorant">{selectedEvent.title}</h4>
                  <span className="text-[9px] text-foreground/40 font-mono mt-0.5 block">Mã số: {selectedEvent.id}</span>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Nguồn phát sinh</span>
                    <span className="font-semibold text-foreground/80">{getSourceTypeLabel(selectedEvent.sourceType)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mức độ</span>
                    <span className={`inline-block rounded px-1.5 py-0.2 text-[8px] font-bold ${getSeverityClass(selectedEvent.severity)}`}>
                      {getSeverityLabel(selectedEvent.severity)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người phụ trách</span>
                    <span className="font-semibold text-foreground/80">{selectedEvent.ownerName || 'Chưa phân công'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái</span>
                    <span className={`inline-block rounded px-1.5 py-0.2 text-[8px] font-bold ${getStatusClass(selectedEvent.status)}`}>
                      {getStatusLabel(selectedEvent.status)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gold-border/10 pt-3">
                  <span className="text-[9px] text-foreground/50 font-mono block">Mô tả vấn đề</span>
                  <p className="text-foreground/80 bg-background/40 p-2.5 rounded border border-gold-border/10 mt-1 font-sans leading-relaxed">{selectedEvent.description}</p>
                </div>

                <div className="border-t border-gold-border/10 pt-3">
                  <span className="text-[9px] text-foreground/50 font-mono block">Bài học rút ra</span>
                  <p className="text-foreground/85 italic bg-gold-muted/5 p-2.5 rounded border border-gold-border/10 mt-1 font-serif-cormorant leading-relaxed">{selectedEvent.lesson || 'Chưa ghi nhận bài học rút ra.'}</p>
                </div>

                <div className="border-t border-gold-border/10 pt-3">
                  <span className="text-[9px] text-foreground/50 font-mono block">Hành động đề xuất</span>
                  <p className="text-foreground/85 font-semibold bg-green-500/5 p-2.5 rounded border border-green-500/10 mt-1 font-sans leading-relaxed">{selectedEvent.proposedAction || 'Chưa đề xuất hành động khắc phục.'}</p>
                </div>

                <div className="text-[9px] text-foreground/40 font-mono border-t border-gold-border/10 pt-3">
                  <div>Ngày ghi nhận: {selectedEvent.createdAt}</div>
                  <div>Ngày cập nhật: {selectedEvent.updatedAt}</div>
                </div>

                {/* Status workflow triggers */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái</span>
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedEvent.id, 'reviewing')}
                      className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                    >
                      Chuyển sang đang xem xét
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedEvent.id, 'action_required')}
                      className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                    >
                      Đánh dấu cần hành động
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedEvent.id, 'resolved')}
                      className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                    >
                      Đánh dấu đã xử lý
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedEvent.id, 'archived')}
                      className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                    >
                      Lưu trữ
                    </button>
                    <Link
                      href={`/studio/improvements?learning_event_id=${selectedEvent.id}`}
                      className="col-span-2 rounded border border-gold hover:border-gold-hover px-2 py-2 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block"
                    >
                      ➕ Tạo hành động cải tiến
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một bài học từ danh sách để xem chi tiết và cập nhật tiến trình.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
