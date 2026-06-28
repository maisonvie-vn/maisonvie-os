'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export type SopTrainingDepartment =
  | "foh"
  | "boh"
  | "reservation"
  | "email"
  | "management"
  | "finance"
  | "inventory"
  | "stewarding"
  | "housekeeping"
  | "security"
  | "other"

export type SopTrainingStatus =
  | "assigned"
  | "in_progress"
  | "acknowledged"
  | "overdue"
  | "cancelled"

export interface SopTrainingAssignment {
  id: string
  sopDocumentId: string
  assigneeName: string
  roleName?: string | null
  department: SopTrainingDepartment
  status: SopTrainingStatus
  dueDate?: string | null
  acknowledgedAt?: string | null
  acknowledgementNote?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface SopDocument {
  id: string
  title: string
  summary?: string | null
}

const INITIAL_TRAINING: SopTrainingAssignment[] = [
  {
    id: 'trn-401',
    sopDocumentId: 'sop-301',
    assigneeName: 'Trần Văn Bình',
    roleName: 'Hostess Nhân viên phục vụ sảnh',
    department: 'foh',
    status: 'in_progress',
    dueDate: '2026-06-30',
    acknowledgedAt: null,
    acknowledgementNote: '',
    createdAt: '2026-06-28 10:30',
    updatedAt: '2026-06-28 10:30'
  },
  {
    id: 'trn-402',
    sopDocumentId: 'sop-302',
    assigneeName: 'Nguyễn Minh Hải',
    roleName: 'Phụ bếp hải sản',
    department: 'boh',
    status: 'acknowledged',
    dueDate: '2026-06-28',
    acknowledgedAt: '2026-06-28 11:00',
    acknowledgementNote: 'Tôi đã nắm rõ quy trình tiệt trùng khăn cheesecloth và cách tráng lọc súp hải sản.',
    createdAt: '2026-06-28 09:45',
    updatedAt: '2026-06-28 11:00'
  }
]

function SopTrainingPageContent() {
  const searchParams = useSearchParams()
  const querySopId = searchParams.get('sop_id')

  const [assignments, setAssignments] = useState<SopTrainingAssignment[]>([])
  const [sops, setSops] = useState<SopDocument[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<SopTrainingAssignment | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Acknowledgement form states
  const [ackInput, setAckInput] = useState('')
  const [showAckForm, setShowAckForm] = useState(false)

  // Form State
  const [form, setForm] = useState({
    sopDocumentId: '',
    assigneeName: '',
    roleName: '',
    department: 'foh' as SopTrainingDepartment,
    status: 'assigned' as SopTrainingStatus,
    dueDate: '',
    acknowledgementNote: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedTraining = localStorage.getItem('mvos_sop_training')
        const storedSops = localStorage.getItem('mvos_sops')
        
        let loadedAssignments: SopTrainingAssignment[] = []
        let loadedSops: SopDocument[] = []

        if (storedTraining) {
          loadedAssignments = JSON.parse(storedTraining)
        } else {
          localStorage.setItem('mvos_sop_training', JSON.stringify(INITIAL_TRAINING))
          loadedAssignments = INITIAL_TRAINING
        }
        setAssignments(loadedAssignments)

        if (storedSops) {
          loadedSops = JSON.parse(storedSops)
          setSops(loadedSops)
        }

        // Handle pre-population if redirected from SOP Library
        if (querySopId) {
          const matchedSop = loadedSops.find(s => s.id === querySopId)
          if (matchedSop) {
            setForm((prev) => ({
              ...prev,
              sopDocumentId: matchedSop.id
            }))
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải phân công đào tạo SOP.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [querySopId])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!form.sopDocumentId) errs.sopDocumentId = 'Vui lòng chọn SOP cần đào tạo'
    if (!form.assigneeName.trim()) errs.assigneeName = 'Tên người nhận không được để trống'
    if (!form.department) errs.department = 'Vui lòng chọn bộ phận nhận đào tạo'
    if (!form.status) errs.status = 'Vui lòng chọn trạng thái ban đầu'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newAssignment: SopTrainingAssignment = {
      id: `trn-${Date.now().toString().slice(-4)}`,
      sopDocumentId: form.sopDocumentId,
      assigneeName: form.assigneeName,
      roleName: form.roleName || 'Nhân viên',
      department: form.department,
      status: form.status,
      dueDate: form.dueDate || null,
      acknowledgementNote: form.acknowledgementNote || '',
      acknowledgedAt: form.status === 'acknowledged' ? new Date().toISOString() : null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newAssignment, ...assignments]
    localStorage.setItem('mvos_sop_training', JSON.stringify(updated))
    setAssignments(updated)

    // Reset Form
    setForm({
      sopDocumentId: '',
      assigneeName: '',
      roleName: '',
      department: 'foh',
      status: 'assigned',
      dueDate: '',
      acknowledgementNote: ''
    })
  }

  const handleUpdateStatus = (trnId: string, nextStatus: SopTrainingStatus, note: string = '') => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    
    const updated = assignments.map((trn) => {
      if (trn.id === trnId) {
        const ackTime = nextStatus === 'acknowledged' ? nowStr : trn.acknowledgedAt
        const updatedTrn = {
          ...trn,
          status: nextStatus,
          acknowledgedAt: ackTime,
          acknowledgementNote: note || trn.acknowledgementNote,
          updatedAt: nowStr
        }
        if (selectedAssignment?.id === trnId) {
          setSelectedAssignment(updatedTrn)
        }
        return updatedTrn
      }
      return trn
    })

    localStorage.setItem('mvos_sop_training', JSON.stringify(updated))
    setAssignments(updated)
    setShowAckForm(false)
    setAckInput('')
  }

  const getDepartmentLabel = (dept: SopTrainingDepartment) => {
    switch (dept) {
      case 'foh': return 'FOH'
      case 'boh': return 'Bếp BOH'
      case 'reservation': return 'Đặt bàn'
      case 'email': return 'Email'
      case 'management': return 'Quản lý'
      case 'finance': return 'Tài chính'
      case 'inventory': return 'Kho'
      case 'stewarding': return 'Tạp vụ'
      case 'housekeeping': return 'Housekeeping'
      case 'security': return 'Bảo vệ'
      default: return 'Khác'
    }
  }

  const getStatusLabel = (st: SopTrainingStatus) => {
    switch (st) {
      case 'assigned': return 'Đã giao'
      case 'in_progress': return 'Đang đọc'
      case 'acknowledged': return 'Đã xác nhận'
      case 'overdue': return 'Quá hạn'
      case 'cancelled': return 'Đã hủy'
      default: return st
    }
  }

  const getStatusClass = (st: SopTrainingStatus) => {
    switch (st) {
      case 'acknowledged':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'overdue':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      case 'in_progress':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'assigned':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getSopTitle = (sopId: string) => {
    const found = sops.find(s => s.id === sopId)
    return found ? found.title : sopId
  }

  // Calculate metrics
  const totalAssignments = assignments.length
  const assignedCount = assignments.filter(a => a.status === 'assigned').length
  const inProgressCount = assignments.filter(a => a.status === 'in_progress').length
  const acknowledgedCount = assignments.filter(a => a.status === 'acknowledged').length
  
  // Overdue count: status !== 'acknowledged' and 'cancelled' and due date is past reference date
  const referenceDateStr = '2026-06-28'
  const overdueCount = assignments.filter(a => {
    if (a.status === 'acknowledged' || a.status === 'cancelled' || !a.dueDate) return false
    return new Date(a.dueDate) < new Date(referenceDateStr)
  }).length

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải phân công đào tạo SOP…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải phân công đào tạo SOP.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🏛️ Đào tạo SOP (SOP Training & Acknowledgement)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Theo dõi việc giao, đọc và xác nhận các quy trình vận hành chuẩn của Maison Vie.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng phân công</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalAssignments}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã giao</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{assignedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang đọc</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{inProgressCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã xác nhận</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{acknowledgedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Quá hạn</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{overdueCount}</span>
        </div>
      </div>

      {/* Split layout: Assignment list + Detail/Form */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Assignment List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Quy trình (SOP)</th>
                    <th className="py-3 px-4">Người nhận</th>
                    <th className="py-3 px-4">Vai trò</th>
                    <th className="py-3 px-4">Bộ phận</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Hạn xác nhận</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {assignments.length > 0 ? (
                    assignments.map((trn) => (
                      <tr 
                        key={trn.id} 
                        onClick={() => {
                          setSelectedAssignment(trn)
                          setShowAckForm(false)
                        }}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedAssignment?.id === trn.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-foreground truncate max-w-[180px]" title={getSopTitle(trn.sopDocumentId)}>
                          {getSopTitle(trn.sopDocumentId)}
                        </td>
                        <td className="py-3.5 px-4 text-foreground/75 font-semibold">{trn.assigneeName}</td>
                        <td className="py-3.5 px-4 text-foreground/70">{trn.roleName}</td>
                        <td className="py-3.5 px-4 text-foreground/75 font-semibold">{getDepartmentLabel(trn.department)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(trn.status)}`}>
                            {getStatusLabel(trn.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gold-hover font-semibold">{trn.dueDate || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="text-gold hover:underline font-semibold">Chi tiết</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có phân công đào tạo SOP nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form to create new assignment */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo phân công đào tạo mới
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">SOP cần đào tạo *</label>
                <select
                  value={form.sopDocumentId}
                  onChange={(e) => setForm({ ...form, sopDocumentId: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="">-- Chọn SOP hướng dẫn --</option>
                  {sops.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.title} ({s.id})
                    </option>
                  ))}
                </select>
                {validationErrors.sopDocumentId && <span className="text-[10px] text-red-400 italic">{validationErrors.sopDocumentId}</span>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Người nhận đào tạo *</label>
                  <input
                    type="text"
                    placeholder="Nhập tên nhân viên nhận bàn giao..."
                    value={form.assigneeName}
                    onChange={(e) => setForm({ ...form, assigneeName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.assigneeName && <span className="text-[10px] text-red-400 italic">{validationErrors.assigneeName}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Vai trò</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Phục vụ bàn, Bếp phụ..."
                    value={form.roleName}
                    onChange={(e) => setForm({ ...form, roleName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Bộ phận *</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value as SopTrainingDepartment })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="foh">Bộ phận sảnh (FOH)</option>
                    <option value="boh">Bộ phận bếp (BOH)</option>
                    <option value="reservation">Đặt bàn (Hostess)</option>
                    <option value="email">Hộp thư (Email)</option>
                    <option value="management">Quản lý (Management)</option>
                    <option value="finance">Kế toán (Finance)</option>
                    <option value="inventory">Kho (Inventory)</option>
                    <option value="stewarding">Tạp vụ (Stewarding)</option>
                    <option value="housekeeping">Buồng phòng (Housekeeping)</option>
                    <option value="security">Bảo vệ (Security)</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as SopTrainingStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="assigned">Đã giao (Assigned)</option>
                    <option value="in_progress">Đang đọc (In Progress)</option>
                    <option value="acknowledged">Đã xác nhận (Acknowledged)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Hạn xác nhận</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-5 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Lưu phân công
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Action transitions */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết phân công
            </h3>

            {selectedAssignment ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-foreground font-serif-cormorant">{getSopTitle(selectedAssignment.sopDocumentId)}</h4>
                  <span className="text-[9px] text-foreground/40 font-mono mt-0.5 block">Mã số phân công: {selectedAssignment.id}</span>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Nhân viên</span>
                    <span className="font-semibold text-foreground/80 block">{selectedAssignment.assigneeName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái</span>
                    <span className={`inline-block rounded px-1.5 py-0.2 text-[8px] font-bold ${getStatusClass(selectedAssignment.status)}`}>
                      {getStatusLabel(selectedAssignment.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Vai trò / Bộ phận</span>
                    <span className="font-semibold text-foreground/80">{selectedAssignment.roleName} ({getDepartmentLabel(selectedAssignment.department)})</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Hạn xác nhận</span>
                    <span className="font-semibold text-gold-hover font-mono">{selectedAssignment.dueDate || 'N/A'}</span>
                  </div>
                </div>

                {selectedAssignment.status === 'acknowledged' && (
                  <div className="border-t border-gold-border/10 pt-3">
                    <span className="text-[9px] text-green-400 font-mono block">Ghi chú xác nhận của nhân viên</span>
                    <p className="text-green-200/90 bg-green-500/5 p-2.5 rounded border border-green-500/10 mt-1 font-sans leading-relaxed">
                      {selectedAssignment.acknowledgementNote || 'Nhân viên đã đọc và xác nhận tuân thủ quy trình.'}
                    </p>
                  </div>
                )}

                <div className="text-[9px] text-foreground/40 font-mono border-t border-gold-border/10 pt-3">
                  <div>Ngày giao: {selectedAssignment.createdAt}</div>
                  <div>Ngày cập nhật: {selectedAssignment.updatedAt}</div>
                  {selectedAssignment.acknowledgedAt && <div>Thời gian xác nhận: {selectedAssignment.acknowledgedAt}</div>}
                </div>

                {/* Status workflow triggers */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật tiến trình</span>
                  
                  {showAckForm ? (
                    <div className="space-y-3 bg-green-500/5 border border-green-500/10 p-3 rounded-lg">
                      <div className="flex flex-col gap-1">
                        <label className="text-[9px] text-green-300 font-mono">Ý kiến phản hồi / ghi chú xác nhận</label>
                        <input
                          type="text"
                          placeholder="Xác nhận nắm rõ quy trình hoặc phản hồi..."
                          value={ackInput}
                          onChange={(e) => setAckInput(e.target.value)}
                          className="rounded border border-green-500/30 bg-background/50 px-2 py-1.5 text-xs text-foreground focus:outline-none"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setShowAckForm(false)}
                          className="text-[9px] text-foreground/60 hover:text-foreground"
                        >
                          Hủy
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(selectedAssignment.id, 'acknowledged', ackInput)}
                          className="rounded bg-green-600 px-3 py-1 text-[9px] text-white font-semibold hover:bg-green-500"
                        >
                          Xác nhận đã đọc
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-2 grid-cols-2">
                      <button
                        onClick={() => handleUpdateStatus(selectedAssignment.id, 'in_progress')}
                        className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                      >
                        Chuyển sang đang đọc
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedAssignment.id, 'overdue')}
                        className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                      >
                        Đánh dấu quá hạn
                      </button>
                      <button
                        onClick={() => setShowAckForm(true)}
                        className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                      >
                        Xác nhận hoàn thành
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(selectedAssignment.id, 'cancelled')}
                        className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        Hủy phân công
                      </button>
                      
                      <Link
                        href={`/studio/sops`}
                        className="col-span-2 rounded border border-gold hover:border-gold-hover px-2 py-2 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block"
                      >
                        📖 Xem tài liệu quy trình SOP
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một phân công để xem chi tiết và cập nhật trạng thái học tập.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SopTrainingPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải phân công đào tạo SOP…</p>
      </div>
    }>
      <SopTrainingPageContent />
    </Suspense>
  )
}
