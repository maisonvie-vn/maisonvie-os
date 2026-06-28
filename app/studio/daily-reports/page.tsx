'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export type DailyReportDepartment =
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
  | "all"
  | "other"

export type DailyReportShiftType =
  | "lunch"
  | "dinner"
  | "full_day"
  | "event"
  | "other"

export type DailyReportStatus =
  | "draft"
  | "submitted"
  | "reviewed"
  | "archived"

export interface DailyOperationReport {
  id: string
  reportDate: string
  shiftType: DailyReportShiftType
  department: DailyReportDepartment
  managerName: string
  status: DailyReportStatus
  overallSummary: string
  guestNotes?: string | null
  serviceIssues?: string | null
  kitchenIssues?: string | null
  reservationIssues?: string | null
  emailIssues?: string | null
  maintenanceIssues?: string | null
  staffNotes?: string | null
  checklistRunId?: string | null
  improvementActionId?: string | null
  actionRequired: boolean
  ceoAttentionRequired: boolean
  submittedAt?: string | null
  reviewedAt?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface ChecklistRun {
  id: string
  runDate: string
  department: string
  shiftType: string
  status: string
}

interface ImprovementAction {
  id: string
  title: string
  status: string
}

const INITIAL_REPORTS: DailyOperationReport[] = [
  {
    id: 'rep-701',
    reportDate: '2026-06-28',
    shiftType: 'dinner',
    department: 'foh',
    managerName: 'Nguyễn Thị Hoa',
    status: 'submitted',
    overallSummary: 'Ca tối phục vụ suôn sẻ, đón 12 lượt khách vãng lai và 8 bàn đặt trước. Có đoàn VIP 12 người gọi thực đơn tiệc đặc biệt.',
    guestNotes: 'Bàn số 5 hài lòng về thái độ phục vụ của nhân viên Bình. Bàn số 2 phản hồi súp hải sản hơi mặn nhẹ.',
    serviceIssues: 'Lúc 19h30, có sự chậm trễ nhỏ trong việc lên món tráng miệng cho bàn VIP do bếp quá tải.',
    kitchenIssues: 'Bếp trưởng chế biến súp hơi mặn đối với bàn số 2, đã kịp thời thu hồi và thay món súp mới.',
    reservationIssues: 'Không có vấn đề gì.',
    emailIssues: 'Không có.',
    maintenanceIssues: 'Máy lạnh góc phải sảnh chính có tiếng ồn nhỏ.',
    staffNotes: 'Nhân viên Bình phục vụ xuất sắc.',
    checklistRunId: 'run-601',
    improvementActionId: null,
    actionRequired: false,
    ceoAttentionRequired: false,
    submittedAt: '2026-06-28 22:30',
    createdAt: '2026-06-28 22:15',
    updatedAt: '2026-06-28 22:30'
  }
]

function DailyReportsPageContent() {
  const searchParams = useSearchParams()
  const queryChecklistId = searchParams.get('checklist_id')

  const [reports, setReports] = useState<DailyOperationReport[]>([])
  const [checklistRuns, setChecklistRuns] = useState<ChecklistRun[]>([])
  const [improvements, setImprovements] = useState<ImprovementAction[]>([])

  const [selectedReport, setSelectedReport] = useState<DailyOperationReport | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [form, setForm] = useState({
    reportDate: '2026-06-28',
    shiftType: 'dinner' as DailyReportShiftType,
    department: 'foh' as DailyReportDepartment,
    managerName: '',
    overallSummary: '',
    guestNotes: '',
    serviceIssues: '',
    kitchenIssues: '',
    reservationIssues: '',
    emailIssues: '',
    maintenanceIssues: '',
    staffNotes: '',
    checklistRunId: '',
    improvementActionId: '',
    actionRequired: false,
    ceoAttentionRequired: false
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedReports = localStorage.getItem('mvos_daily_reports')
        const storedRuns = localStorage.getItem('mvos_checklist_runs')
        const storedImps = localStorage.getItem('mvos_improvements')

        let loadedReports: DailyOperationReport[] = []
        let loadedRuns: ChecklistRun[] = []
        let loadedImps: ImprovementAction[] = []

        if (storedReports) {
          loadedReports = JSON.parse(storedReports)
        } else {
          localStorage.setItem('mvos_daily_reports', JSON.stringify(INITIAL_REPORTS))
          loadedReports = INITIAL_REPORTS
        }
        setReports(loadedReports)

        if (storedRuns) {
          loadedRuns = JSON.parse(storedRuns)
          setChecklistRuns(loadedRuns)
        }

        if (storedImps) {
          loadedImps = JSON.parse(storedImps)
          setImprovements(loadedImps)
        }

        // Handle pre-population from checklist run
        if (queryChecklistId) {
          const matchedRun = loadedRuns.find(r => r.id === queryChecklistId)
          if (matchedRun) {
            setForm((prev) => ({
              ...prev,
              checklistRunId: matchedRun.id,
              reportDate: matchedRun.runDate,
              department: matchedRun.department as DailyReportDepartment,
              shiftType: (matchedRun.shiftType === 'opening' || matchedRun.shiftType === 'pre_service' || matchedRun.shiftType === 'lunch') ? 'lunch' : 'dinner' as DailyReportShiftType,
              overallSummary: `Báo cáo vận hành lập từ đợt chạy Checklist: ${matchedRun.id} ngày ${matchedRun.runDate}.`
            }))
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải danh sách báo cáo vận hành.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [queryChecklistId])

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!form.reportDate) errs.reportDate = 'Vui lòng nhập ngày báo cáo'
    if (!form.managerName.trim()) errs.managerName = 'Vui lòng nhập tên quản lý phụ trách'
    if (!form.overallSummary.trim()) errs.overallSummary = 'Vui lòng nhập tóm tắt vận hành chung'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newReport: DailyOperationReport = {
      id: `rep-${Date.now().toString().slice(-4)}`,
      reportDate: form.reportDate,
      shiftType: form.shiftType,
      department: form.department,
      managerName: form.managerName,
      status: 'draft',
      overallSummary: form.overallSummary,
      guestNotes: form.guestNotes || null,
      serviceIssues: form.serviceIssues || null,
      kitchenIssues: form.kitchenIssues || null,
      reservationIssues: form.reservationIssues || null,
      emailIssues: form.emailIssues || null,
      maintenanceIssues: form.maintenanceIssues || null,
      staffNotes: form.staffNotes || null,
      checklistRunId: form.checklistRunId || null,
      improvementActionId: form.improvementActionId || null,
      actionRequired: form.actionRequired,
      ceoAttentionRequired: form.ceoAttentionRequired,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newReport, ...reports]
    localStorage.setItem('mvos_daily_reports', JSON.stringify(updated))
    setReports(updated)
    setSelectedReport(newReport)

    // Reset Form
    setForm({
      reportDate: '2026-06-28',
      shiftType: 'dinner',
      department: 'foh',
      managerName: '',
      overallSummary: '',
      guestNotes: '',
      serviceIssues: '',
      kitchenIssues: '',
      reservationIssues: '',
      emailIssues: '',
      maintenanceIssues: '',
      staffNotes: '',
      checklistRunId: '',
      improvementActionId: '',
      actionRequired: false,
      ceoAttentionRequired: false
    })
  }

  const handleUpdateStatus = (reportId: string, nextStatus: DailyReportStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = reports.map((rep) => {
      if (rep.id === reportId) {
        const updatedRep = {
          ...rep,
          status: nextStatus,
          submittedAt: nextStatus === 'submitted' ? nowStr : rep.submittedAt,
          reviewedAt: nextStatus === 'reviewed' ? nowStr : rep.reviewedAt,
          updatedAt: nowStr
        }
        if (selectedReport?.id === reportId) setSelectedReport(updatedRep)
        return updatedRep
      }
      return rep
    })
    localStorage.setItem('mvos_daily_reports', JSON.stringify(updated))
    setReports(updated)
  }

  const getDepartmentLabel = (dept: DailyReportDepartment) => {
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
      case 'all': return 'Toàn nhà hàng'
      default: return 'Khác'
    }
  }

  const getShiftLabel = (shift: DailyReportShiftType) => {
    switch (shift) {
      case 'lunch': return 'Ca trưa'
      case 'dinner': return 'Ca tối'
      case 'full_day': return 'Cả ngày'
      case 'event': return 'Sự kiện'
      default: return 'Khác'
    }
  }

  const getStatusLabel = (st: DailyReportStatus) => {
    switch (st) {
      case 'draft': return 'Bản nháp'
      case 'submitted': return 'Đã gửi'
      case 'reviewed': return 'Đã xem'
      case 'archived': return 'Lưu trữ'
      default: return st
    }
  }

  const getStatusClass = (st: DailyReportStatus) => {
    switch (st) {
      case 'reviewed':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'submitted':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'draft':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  // Calculate Metrics
  const referenceDateStr = '2026-06-28'
  const todayReports = reports.filter(r => r.reportDate === referenceDateStr)
  
  const submittedCount = reports.filter(r => r.status === 'submitted' || r.status === 'reviewed').length
  const draftCount = reports.filter(r => r.status === 'draft').length
  const ceoAttentionCount = reports.filter(r => r.ceoAttentionRequired && r.status !== 'archived').length
  const actionRequiredCount = reports.filter(r => r.actionRequired && r.status !== 'archived').length

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải báo cáo vận hành…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải báo cáo vận hành.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          📝 Báo cáo vận hành ngày (Daily Reports)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Ghi nhận tình hình vận hành, vấn đề phát sinh và việc cần theo dõi sau mỗi ngày hoặc mỗi ca.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Báo cáo hôm nay</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{todayReports.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã gửi</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{submittedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Bản nháp</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{draftCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cần CEO xem</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-400 mt-1 block">{ceoAttentionCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Có việc cần xử lý</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold-hover mt-1 block">{actionRequiredCount}</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Reports Listing & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Ngày báo cáo</th>
                    <th className="py-3 px-4">Ca</th>
                    <th className="py-3 px-4">Bộ phận</th>
                    <th className="py-3 px-4">Quản lý phụ trách</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Cần CEO xem</th>
                    <th className="py-3 px-4">Cần xử lý</th>
                    <th className="py-3 px-4 text-right">Ngày gửi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {reports.length > 0 ? (
                    reports.map((rep) => (
                      <tr
                        key={rep.id}
                        onClick={() => setSelectedReport(rep)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedReport?.id === rep.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{rep.reportDate}</td>
                        <td className="py-3.5 px-4 font-semibold text-gold-hover">{getShiftLabel(rep.shiftType)}</td>
                        <td className="py-3.5 px-4 text-foreground/85 font-sans">{getDepartmentLabel(rep.department)}</td>
                        <td className="py-3.5 px-4 text-foreground/75 font-sans font-semibold">{rep.managerName}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(rep.status)}`}>
                            {getStatusLabel(rep.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {rep.ceoAttentionRequired ? <span className="text-red-400 font-bold">CÓ</span> : <span className="text-foreground/35">-</span>}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono">
                          {rep.actionRequired ? <span className="text-yellow-500 font-bold">CÓ</span> : <span className="text-foreground/35">-</span>}
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono text-foreground/50">{rep.submittedAt || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có báo cáo vận hành nào.
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
              🆕 Lập báo cáo vận hành mới
            </h3>

            <form onSubmit={handleCreateReport} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày báo cáo *</label>
                  <input
                    type="date"
                    value={form.reportDate}
                    onChange={(e) => setForm({ ...form, reportDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.reportDate && <span className="text-[10px] text-red-400 italic">{validationErrors.reportDate}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên Quản lý phụ trách *</label>
                  <input
                    type="text"
                    placeholder="Họ và tên người báo cáo..."
                    value={form.managerName}
                    onChange={(e) => setForm({ ...form, managerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.managerName && <span className="text-[10px] text-red-400 italic">{validationErrors.managerName}</span>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Bộ phận</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value as DailyReportDepartment })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="foh">Bộ phận sảnh (FOH)</option>
                    <option value="boh">Bộ phận bếp (BOH)</option>
                    <option value="reservation">Đặt bàn (Reservation)</option>
                    <option value="email">Hộp thư (Email)</option>
                    <option value="management">Quản lý (Management)</option>
                    <option value="finance">Kế toán (Finance)</option>
                    <option value="inventory">Kho (Inventory)</option>
                    <option value="stewarding">Tạp vụ (Stewarding)</option>
                    <option value="housekeeping">Buồng phòng (Housekeeping)</option>
                    <option value="security">Bảo vệ (Security)</option>
                    <option value="all">Toàn nhà hàng (All)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ca làm việc</label>
                  <select
                    value={form.shiftType}
                    onChange={(e) => setForm({ ...form, shiftType: e.target.value as DailyReportShiftType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="lunch">Ca trưa (Lunch)</option>
                    <option value="dinner">Ca tối (Dinner)</option>
                    <option value="full_day">Cả ngày (Full Day)</option>
                    <option value="event">Sự kiện (Event)</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Tóm tắt vận hành chung *</label>
                <textarea
                  rows={3}
                  placeholder="Ghi nhận tổng quan tình hình đón khách, tinh thần phục vụ, phối hợp bếp..."
                  value={form.overallSummary}
                  onChange={(e) => setForm({ ...form, overallSummary: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                {validationErrors.overallSummary && <span className="text-[10px] text-red-400 italic">{validationErrors.overallSummary}</span>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ghi chú từ khách hàng (Complaints/Compliments)</label>
                  <textarea
                    rows={2}
                    placeholder="Ý kiến khen chê, món ăn, dịch vụ..."
                    value={form.guestNotes}
                    onChange={(e) => setForm({ ...form, guestNotes: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Sự cố Phục vụ (FOH)</label>
                  <textarea
                    rows={2}
                    placeholder="Món lên chậm, phục vụ sai tiêu chuẩn..."
                    value={form.serviceIssues}
                    onChange={(e) => setForm({ ...form, serviceIssues: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Sự cố Nhà bếp (BOH)</label>
                  <textarea
                    rows={2}
                    placeholder="Hết nguyên liệu, chế biến sai quy chuẩn..."
                    value={form.kitchenIssues}
                    onChange={(e) => setForm({ ...form, kitchenIssues: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Vấn đề Đặt bàn & Email</label>
                  <textarea
                    rows={2}
                    placeholder="Nhầm bàn, sót email yêu cầu..."
                    value={form.reservationIssues}
                    onChange={(e) => setForm({ ...form, reservationIssues: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Kỹ thuật & Cơ sở vật chất</label>
                  <textarea
                    rows={2}
                    placeholder="Máy lạnh ồn, bể vỡ công cụ dụng cụ..."
                    value={form.maintenanceIssues}
                    onChange={(e) => setForm({ ...form, maintenanceIssues: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ghi chú Nhân sự & Kỷ luật</label>
                  <textarea
                    rows={2}
                    placeholder="Đột xuất vắng mặt, vi phạm đồng phục..."
                    value={form.staffNotes}
                    onChange={(e) => setForm({ ...form, staffNotes: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Checklist liên quan</label>
                  <select
                    value={form.checklistRunId}
                    onChange={(e) => setForm({ ...form, checklistRunId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn đợt chạy checklist --</option>
                    {checklistRuns.map((r) => (
                      <option key={r.id} value={r.id}>
                        Run #{r.id} - {r.runDate} ({r.department})
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

              <div className="flex gap-6 items-center pt-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.actionRequired}
                    onChange={(e) => setForm({ ...form, actionRequired: e.target.checked })}
                    className="accent-gold h-4 w-4 cursor-pointer"
                  />
                  <span className="font-semibold text-foreground/90 font-sans">Yêu cầu hành động sửa chữa</span>
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
                Lưu báo cáo nháp
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Update Actions */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết Báo cáo
            </h3>

            {selectedReport ? (
              <div className="space-y-4 text-xs font-sans">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    Báo cáo {getShiftLabel(selectedReport.shiftType)} - {getDepartmentLabel(selectedReport.department)}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Mã: {selectedReport.id}</span>
                    <span>Ngày báo cáo: {selectedReport.reportDate}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người lập báo cáo</span>
                    <span className="font-bold text-foreground/80 block">{selectedReport.managerName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(selectedReport.status)}`}>
                      {getStatusLabel(selectedReport.status)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] text-gold font-mono uppercase block">Tóm tắt chung</span>
                  <p className="text-foreground/90 italic leading-relaxed bg-gold-muted/5 p-3 rounded-lg border border-gold-border/10">
                    &ldquo;{selectedReport.overallSummary}&rdquo;
                  </p>
                </div>

                {selectedReport.guestNotes && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-foreground/50 font-mono block">Ý kiến khách hàng</span>
                    <p className="text-foreground/80 leading-relaxed pl-2 border-l-2 border-gold/40">{selectedReport.guestNotes}</p>
                  </div>
                )}

                {selectedReport.serviceIssues && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-foreground/50 font-mono block">Vấn đề Phục vụ (FOH)</span>
                    <p className="text-foreground/80 leading-relaxed pl-2 border-l-2 border-gold/40">{selectedReport.serviceIssues}</p>
                  </div>
                )}

                {selectedReport.kitchenIssues && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-foreground/50 font-mono block">Vấn đề Bếp (BOH)</span>
                    <p className="text-foreground/80 leading-relaxed pl-2 border-l-2 border-gold/40">{selectedReport.kitchenIssues}</p>
                  </div>
                )}

                {selectedReport.reservationIssues && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-foreground/50 font-mono block">Vấn đề Đặt bàn / Hộp thư</span>
                    <p className="text-foreground/80 leading-relaxed pl-2 border-l-2 border-gold/40">{selectedReport.reservationIssues}</p>
                  </div>
                )}

                {selectedReport.maintenanceIssues && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-foreground/50 font-mono block">Kỹ thuật / Bảo trì</span>
                    <p className="text-foreground/80 leading-relaxed pl-2 border-l-2 border-gold/40">{selectedReport.maintenanceIssues}</p>
                  </div>
                )}

                {selectedReport.staffNotes && (
                  <div className="space-y-1">
                    <span className="text-[9px] text-foreground/50 font-mono block">Nhân sự & Kỷ luật</span>
                    <p className="text-foreground/80 leading-relaxed pl-2 border-l-2 border-gold/40">{selectedReport.staffNotes}</p>
                  </div>
                )}

                <div className="grid gap-2 grid-cols-2 pt-2 border-t border-gold-border/10">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Checklist liên quan</span>
                    <span className="text-gold font-mono font-bold">{selectedReport.checklistRunId || 'Không liên kết'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Cải tiến liên quan</span>
                    <span className="text-gold font-mono font-bold">{selectedReport.improvementActionId || 'Không liên kết'}</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-1 font-mono text-[9px]">
                  {selectedReport.ceoAttentionRequired && (
                    <span className="rounded bg-red-500/10 border border-red-500/30 px-2 py-0.5 text-red-400 font-bold">
                      ⚠️ CẦN CEO XEM
                    </span>
                  )}
                  {selectedReport.actionRequired && (
                    <span className="rounded bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 text-yellow-500 font-bold">
                      🛠️ CẦN XỬ LÝ
                    </span>
                  )}
                </div>

                {selectedReport.submittedAt && (
                  <div className="text-[9px] text-foreground/45 font-mono pt-1">
                    Thời gian gửi: {selectedReport.submittedAt}
                  </div>
                )}

                {selectedReport.reviewedAt && (
                  <div className="text-[9px] text-foreground/45 font-mono">
                    Thời gian duyệt: {selectedReport.reviewedAt}
                  </div>
                )}

                {/* State Actions */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật báo cáo</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedReport.id, 'submitted')}
                      disabled={selectedReport.status === 'submitted' || selectedReport.status === 'reviewed'}
                      className="rounded border border-blue-500/40 hover:border-blue-500 px-2 py-1.5 text-center text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Gửi báo cáo
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedReport.id, 'reviewed')}
                      disabled={selectedReport.status !== 'submitted'}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Đánh dấu đã xem
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedReport.id, 'draft')}
                      disabled={selectedReport.status === 'submitted' || selectedReport.status === 'reviewed'}
                      className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all disabled:opacity-40"
                    >
                      Quay lại bản nháp
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedReport.id, 'archived')}
                      className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Lưu trữ báo cáo
                    </button>
                    <Link
                      href={`/studio/feedback?daily_report_id=${selectedReport.id}`}
                      className="col-span-2 rounded border border-gold hover:border-gold-hover px-2 py-2 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block text-center"
                    >
                      🛎️ Tạo phản hồi khách
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một báo cáo từ danh sách để xem chi tiết đầy đủ và duyệt.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DailyReportsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải báo cáo vận hành…</p>
      </div>
    }>
      <DailyReportsPageContent />
    </Suspense>
  )
}
