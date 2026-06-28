'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export type ImprovementActionPriority =
  | "low"
  | "medium"
  | "high"
  | "critical"

export type ImprovementActionStatus =
  | "open"
  | "in_progress"
  | "blocked"
  | "completed"
  | "cancelled"

export interface ImprovementAction {
  id: string
  learningEventId?: string | null
  title: string
  description: string
  ownerName?: string | null
  priority: ImprovementActionPriority
  status: ImprovementActionStatus
  dueDate?: string | null
  completedAt?: string | null
  resolutionNote?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface LearningEvent {
  id: string
  title: string
  description: string
  ownerName?: string | null
}

const INITIAL_IMPROVEMENTS: ImprovementAction[] = [
  {
    id: 'act-201',
    learningEventId: 'lrn-101',
    title: 'Ký bàn giao vỏ chai trống giữa FOH và Kho',
    description: 'Triển khai biên bản bàn giao vỏ chai rượu vang trống hàng ca để đối chiếu số lượng thực tế khui tại Salon Royal.',
    ownerName: 'Nguyễn Thị Hoa (FOH Lead)',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2026-06-30',
    completedAt: null,
    resolutionNote: '',
    createdAt: '2026-06-25 17:00',
    updatedAt: '2026-06-25 17:00'
  },
  {
    id: 'act-202',
    learningEventId: 'lrn-102',
    title: 'Thay thế rây lọc súp hải sản sang khăn lọc cheesecloth',
    description: 'Cung cấp khăn lọc mịn chuyên dụng cho tổ bếp sơ chế và giám sát quy trình lọc súp hải sản 100%.',
    ownerName: 'Chef Joel (Bếp trưởng)',
    priority: 'critical',
    status: 'completed',
    dueDate: '2026-06-28',
    completedAt: '2026-06-28 09:00',
    resolutionNote: 'Đã mua và phân phát 5 tấm khăn lọc cheesecloth cho bếp sơ chế súp. Quy trình lọc mịn đã hoạt động ổn định.',
    createdAt: '2026-06-28 07:00',
    updatedAt: '2026-06-28 09:00'
  }
]

function ImprovementsPageContent() {
  const searchParams = useSearchParams()
  const queryLearningId = searchParams.get('learning_event_id')

  const [actions, setActions] = useState<ImprovementAction[]>([])
  const [learnings, setLearnings] = useState<LearningEvent[]>([])
  const [selectedAction, setSelectedAction] = useState<ImprovementAction | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Resolution note state for completion modal
  const [resolutionInput, setResolutionInput] = useState('')
  const [showCompletionForm, setShowCompletionForm] = useState(false)

  // Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    ownerName: '',
    priority: 'medium' as ImprovementActionPriority,
    status: 'open' as ImprovementActionStatus,
    dueDate: '',
    learningEventId: '',
    resolutionNote: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedActions = localStorage.getItem('mvos_improvements')
        const storedLearnings = localStorage.getItem('mvos_learnings')
        
        let loadedActions: ImprovementAction[] = []
        let loadedLearnings: LearningEvent[] = []

        if (storedActions) {
          loadedActions = JSON.parse(storedActions)
        } else {
          localStorage.setItem('mvos_improvements', JSON.stringify(INITIAL_IMPROVEMENTS))
          loadedActions = INITIAL_IMPROVEMENTS
        }
        setActions(loadedActions)

        if (storedLearnings) {
          loadedLearnings = JSON.parse(storedLearnings)
          setLearnings(loadedLearnings)
        }

        // Handle pre-population if redirected from a learning event
        if (queryLearningId) {
          const matchedLrn = loadedLearnings.find(l => l.id === queryLearningId)
          if (matchedLrn) {
            setForm((prev) => ({
              ...prev,
              learningEventId: matchedLrn.id,
              title: `Cải tiến: ${matchedLrn.title}`,
              description: `Hành động khắc phục phòng ngừa rủi ro phát sinh từ sự cố: ${matchedLrn.description}`,
              ownerName: matchedLrn.ownerName || ''
            }))
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải hành động cải tiến.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [queryLearningId])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Tiêu đề không được để trống'
    if (!form.description.trim()) errs.description = 'Mô tả việc cần làm không được để trống'
    if (!form.priority) errs.priority = 'Vui lòng chọn mức ưu tiên'
    if (!form.status) errs.status = 'Vui lòng chọn trạng thái ban đầu'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newAction: ImprovementAction = {
      id: `act-${Date.now().toString().slice(-4)}`,
      title: form.title,
      description: form.description,
      ownerName: form.ownerName || 'Chưa phân công',
      priority: form.priority,
      status: form.status,
      dueDate: form.dueDate || null,
      learningEventId: form.learningEventId || null,
      resolutionNote: form.resolutionNote || '',
      completedAt: form.status === 'completed' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newAction, ...actions]
    localStorage.setItem('mvos_improvements', JSON.stringify(updated))
    setActions(updated)

    // Reset Form
    setForm({
      title: '',
      description: '',
      ownerName: '',
      priority: 'medium',
      status: 'open',
      dueDate: '',
      learningEventId: '',
      resolutionNote: ''
    })
  }

  const handleUpdateStatus = (actionId: string, nextStatus: ImprovementActionStatus, note: string = '') => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    
    const updated = actions.map((act) => {
      if (act.id === actionId) {
        const completedTime = nextStatus === 'completed' ? nowStr : act.completedAt
        const updatedAct = {
          ...act,
          status: nextStatus,
          completedAt: completedTime,
          resolutionNote: note || act.resolutionNote,
          updatedAt: nowStr
        }
        if (selectedAction?.id === actionId) {
          setSelectedAction(updatedAct)
        }
        return updatedAct
      }
      return act
    })

    localStorage.setItem('mvos_improvements', JSON.stringify(updated))
    setActions(updated)
    setShowCompletionForm(false)
    setResolutionInput('')
  }

  const getPriorityLabel = (prio: ImprovementActionPriority) => {
    switch (prio) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'critical': return 'Nghiêm trọng'
      default: return prio
    }
  }

  const getStatusLabel = (st: ImprovementActionStatus) => {
    switch (st) {
      case 'open': return 'Mới tạo'
      case 'in_progress': return 'Đang xử lý'
      case 'blocked': return 'Đang bị chặn'
      case 'completed': return 'Đã hoàn thành'
      case 'cancelled': return 'Đã hủy'
      default: return st
    }
  }

  const getPriorityClass = (prio: ImprovementActionPriority) => {
    switch (prio) {
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

  const getStatusClass = (st: ImprovementActionStatus) => {
    switch (st) {
      case 'completed':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'blocked':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      case 'in_progress':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'open':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getLearningTitle = (lrnId: string | null | undefined) => {
    if (!lrnId) return 'Không liên kết'
    const found = learnings.find(l => l.id === lrnId)
    return found ? found.title : lrnId
  }

  // Calculate metrics
  const totalActions = actions.length
  const inProgressCount = actions.filter(a => a.status === 'in_progress').length
  const blockedCount = actions.filter(a => a.status === 'blocked').length
  const completedCount = actions.filter(a => a.status === 'completed').length
  
  // Overdue actions: due date is past reference date and status is not completed/cancelled
  const referenceDateStr = '2026-06-28'
  const overdueCount = actions.filter(a => {
    if (a.status === 'completed' || a.status === 'cancelled' || !a.dueDate) return false
    return new Date(a.dueDate) < new Date(referenceDateStr)
  }).length

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải hành động cải tiến…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải hành động cải tiến.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🏛️ Hành động cải tiến (Improvement Actions)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Theo dõi các việc cần làm để xử lý bài học, rủi ro và điểm yếu vận hành của Maison Vie.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng hành động</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalActions}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang xử lý</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{inProgressCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang bị chặn</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{blockedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Quá hạn</span>
          <span className="text-2xl font-serif-cormorant font-bold text-orange-400 mt-1 block">{overdueCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã hoàn thành</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{completedCount}</span>
        </div>
      </div>

      {/* Split layout: Action list + Detail/Form */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Action List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Tiêu đề</th>
                    <th className="py-3 px-4">Người phụ trách</th>
                    <th className="py-3 px-4">Mức ưu tiên</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Hạn xử lý</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {actions.length > 0 ? (
                    actions.map((act) => (
                      <tr 
                        key={act.id} 
                        onClick={() => {
                          setSelectedAction(act)
                          setShowCompletionForm(false)
                        }}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedAction?.id === act.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-foreground">{act.title}</td>
                        <td className="py-3.5 px-4 text-foreground/75">{act.ownerName}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getPriorityClass(act.priority)}`}>
                            {getPriorityLabel(act.priority)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(act.status)}`}>
                            {getStatusLabel(act.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gold-hover font-semibold">{act.dueDate || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="text-gold hover:underline font-semibold">Chi tiết</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có hành động cải tiến nào được tạo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form to create new action */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo hành động cải tiến mới
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Tiêu đề *</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề hành động khắc phục..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                {validationErrors.title && <span className="text-[10px] text-red-400 italic">{validationErrors.title}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Mô tả việc cần làm *</label>
                <textarea
                  placeholder="Mô tả cụ thể các đầu việc cần triển khai..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none font-sans"
                />
                {validationErrors.description && <span className="text-[10px] text-red-400 italic">{validationErrors.description}</span>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Người phụ trách</label>
                  <input
                    type="text"
                    placeholder="Tên người chịu trách nhiệm thi hành..."
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Hạn xử lý</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mức ưu tiên *</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as ImprovementActionPriority })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="low">Thấp (Low)</option>
                    <option value="medium">Trung bình (Medium)</option>
                    <option value="high">Cao (High)</option>
                    <option value="critical">Nghiêm trọng (Critical)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as ImprovementActionStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="open">Mới tạo (Open)</option>
                    <option value="in_progress">Đang xử lý (In Progress)</option>
                    <option value="blocked">Đang bị chặn (Blocked)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Bài học liên quan</label>
                <select
                  value={form.learningEventId}
                  onChange={(e) => setForm({ ...form, learningEventId: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="">-- Không có liên kết --</option>
                  {learnings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} ({l.id})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-5 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Lưu hành động
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Status updating */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết hành động
            </h3>

            {selectedAction ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-foreground font-serif-cormorant">{selectedAction.title}</h4>
                  <span className="text-[9px] text-foreground/40 font-mono mt-0.5 block">Mã số: {selectedAction.id}</span>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Nguồn bài học</span>
                    <span className="font-semibold text-foreground/80 block truncate" title={getLearningTitle(selectedAction.learningEventId)}>
                      {getLearningTitle(selectedAction.learningEventId)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mức ưu tiên</span>
                    <span className={`inline-block rounded px-1.5 py-0.2 text-[8px] font-bold ${getPriorityClass(selectedAction.priority)}`}>
                      {getPriorityLabel(selectedAction.priority)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người phụ trách</span>
                    <span className="font-semibold text-foreground/80">{selectedAction.ownerName || 'Chưa phân công'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái</span>
                    <span className={`inline-block rounded px-1.5 py-0.2 text-[8px] font-bold ${getStatusClass(selectedAction.status)}`}>
                      {getStatusLabel(selectedAction.status)}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gold-border/10 pt-3">
                  <span className="text-[9px] text-foreground/50 font-mono block">Mô tả việc cần làm</span>
                  <p className="text-foreground/80 bg-background/40 p-2.5 rounded border border-gold-border/10 mt-1 font-sans leading-relaxed">{selectedAction.description}</p>
                </div>

                {selectedAction.status === 'completed' && (
                  <div className="border-t border-gold-border/10 pt-3">
                    <span className="text-[9px] text-green-400 font-mono block">Kết quả giải quyết</span>
                    <p className="text-green-200/90 bg-green-500/5 p-2.5 rounded border border-green-500/10 mt-1 font-sans leading-relaxed">{selectedAction.resolutionNote || 'Hoàn thành.'}</p>
                  </div>
                )}

                <div className="text-[9px] text-foreground/40 font-mono border-t border-gold-border/10 pt-3">
                  <div>Ngày tạo: {selectedAction.createdAt}</div>
                  <div>Ngày cập nhật: {selectedAction.updatedAt}</div>
                  {selectedAction.completedAt && <div>Ngày hoàn thành: {selectedAction.completedAt}</div>}
                </div>

                {/* Status workflow triggers */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái</span>
                  
                  {showCompletionForm ? (
                    <div className="space-y-3 bg-green-500/5 border border-green-500/10 p-3 rounded-lg">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-green-300 font-mono">Ghi chú kết quả hoàn thành *</label>
                        <input
                          type="text"
                          placeholder="Mô tả kết quả đã cải tiến..."
                          value={resolutionInput}
                          onChange={(e) => setResolutionInput(e.target.value)}
                          className="rounded border border-green-500/30 bg-background/50 px-2 py-1 text-xs text-foreground focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowCompletionForm(false)}
                          className="text-[9px] text-foreground/60 hover:text-foreground"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => {
                            if (!resolutionInput.trim()) return
                            handleUpdateStatus(selectedAction.id, 'completed', resolutionInput)
                          }}
                          className="rounded bg-green-600 px-3 py-1 text-[9px] text-white font-semibold hover:bg-green-500"
                        >
                          Hoàn thành
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-2 grid-cols-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedAction.id, 'in_progress')}
                        className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                      >
                        Chuyển sang đang xử lý
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedAction.id, 'blocked')}
                        className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                      >
                        Đánh dấu đang bị chặn
                      </button>
                      <button
                        onClick={() => setShowCompletionForm(true)}
                        className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                      >
                        Đánh dấu đã hoàn thành
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedAction.id, 'cancelled')}
                        className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        Hủy hành động
                      </button>
                      <Link
                        href={`/studio/sops?improvement_action_id=${selectedAction.id}`}
                        className="col-span-2 rounded border border-gold hover:border-gold-hover px-2 py-2 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block"
                      >
                        📄 Tạo SOP từ hành động này
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một hành động từ danh sách để xem chi tiết và cập nhật tiến độ.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ImprovementsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải hành động cải tiến…</p>
      </div>
    }>
      <ImprovementsPageContent />
    </Suspense>
  )
}
