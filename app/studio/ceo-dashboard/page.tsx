'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Reservation {
  id: string
  guestName: string
  email: string
  phone: string
  vipLevel: string
  date: string
  time: string
  partySize: number
  roomName: string
  menuSelection: string
  specialRequests: string
  allergies: string
  status: string
  notes: string
}

interface DraftReply {
  draftSubject: string
  draftBody: string
  language: string
  status: string
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

interface ImprovementAction {
  id: string
  title: string
  status: string
  dueDate?: string | null
}

interface SopDocument {
  id: string
  title: string
  status: string
}

interface SopTrainingAssignment {
  id: string
  sopDocumentId: string
  status: string
  dueDate?: string | null
}

interface ChecklistRun {
  id: string
  runDate: string
  status: string
}

interface DailyReport {
  id: string
  reportDate: string
  status: string
  ceoAttentionRequired: boolean
  actionRequired: boolean
}

interface GuestRecovery {
  id: string
  status: string
  ceoAttentionRequired: boolean
}

export default function CEODashboardPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [emails, setEmails] = useState<EmailMessage[]>([])
  const [improvements, setImprovements] = useState<ImprovementAction[]>([])
  const [sops, setSops] = useState<SopDocument[]>([])
  const [trainingAssignments, setTrainingAssignments] = useState<SopTrainingAssignment[]>([])
  const [checklistRuns, setChecklistRuns] = useState<ChecklistRun[]>([])
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([])
  const [recoveryCases, setRecoveryCases] = useState<GuestRecovery[]>([])
  const [dateFilter, setDateFilter] = useState<'today' | 'next_7_days' | 'next_30_days' | 'current_month'>('today')
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Reference date for date calculations (seeded datasets are on 2026-06-28)
  const referenceDateStr = '2026-06-28'

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      try {
        const storedRes = localStorage.getItem('mvos_reservations')
        const storedEmails = localStorage.getItem('mvos_emails')
        
        if (storedRes) {
          setReservations(JSON.parse(storedRes))
        } else {
          setReservations([])
        }

        if (storedEmails) {
          setEmails(JSON.parse(storedEmails))
        } else {
          setEmails([])
        }

        const storedImps = localStorage.getItem('mvos_improvements')
        if (storedImps) {
          setImprovements(JSON.parse(storedImps))
        } else {
          setImprovements([])
        }

        const storedSops = localStorage.getItem('mvos_sops')
        if (storedSops) {
          setSops(JSON.parse(storedSops))
        } else {
          setSops([])
        }

        const storedTraining = localStorage.getItem('mvos_sop_training')
        if (storedTraining) {
          setTrainingAssignments(JSON.parse(storedTraining))
        } else {
          setTrainingAssignments([])
        }

        const storedChecklistRuns = localStorage.getItem('mvos_checklist_runs')
        if (storedChecklistRuns) {
          setChecklistRuns(JSON.parse(storedChecklistRuns))
        } else {
          setChecklistRuns([])
        }

        const storedReports = localStorage.getItem('mvos_daily_reports')
        if (storedReports) {
          setDailyReports(JSON.parse(storedReports))
        } else {
          setDailyReports([])
        }

        const storedCases = localStorage.getItem('mvos_guest_recovery_cases')
        if (storedCases) {
          setRecoveryCases(JSON.parse(storedCases))
        } else {
          setRecoveryCases([])
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu vận hành từ bộ nhớ cục bộ.')
        setLoading(false)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [])

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Draft': return 'Bản nháp'
      case 'Pending': return 'Chờ duyệt'
      case 'Confirmed': return 'Đã xác nhận'
      case 'Reminder': return 'Đã nhắc lịch'
      case 'Arrived': return 'Đã đến sảnh'
      case 'Dining': return 'Đang dùng bữa'
      case 'Completed': return 'Hoàn thành'
      case 'Cancelled': return 'Đã hủy'
      case 'No Show': return 'Không đến'
      default: return status
    }
  }

  const getDraftStatusLabel = (status: string) => {
    switch (status) {
      case 'Draft': return 'Bản nháp'
      case 'Pending Review': return 'Chờ duyệt'
      case 'Approved': return 'Đã duyệt'
      case 'Rejected': return 'Bị từ chối'
      case 'Needs Revision': return 'Cần sửa lại'
      case 'Marked As Sent': return 'Đã gửi'
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'Pending':
      case 'Arrived':
      case 'Dining':
      case 'Reminder':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'Draft':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'Cancelled':
      case 'No Show':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/70'
    }
  }

  // Filter reservations based on selected date filter
  const getFilteredReservations = () => {
    const today = new Date(referenceDateStr)
    
    return reservations.filter((res) => {
      const resDate = new Date(res.date)
      
      // Calculate diff in days
      const diffTime = resDate.getTime() - today.getTime()
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (dateFilter === 'today') {
        return res.date === referenceDateStr
      }
      if (dateFilter === 'next_7_days') {
        return diffDays >= 0 && diffDays <= 7
      }
      if (dateFilter === 'next_30_days') {
        return diffDays >= 0 && diffDays <= 30
      }
      if (dateFilter === 'current_month') {
        return res.date.startsWith(referenceDateStr.slice(0, 7))
      }
      return true
    })
  }

  const filteredReservations = getFilteredReservations()

  // Calculate metrics
  const reservationsToday = reservations.filter(r => r.date === referenceDateStr)
  const partySizeToday = reservationsToday.reduce((sum, r) => sum + r.partySize, 0)
  
  const upcomingReservations = reservations.filter(r => {
    const diff = new Date(r.date).getTime() - new Date(referenceDateStr).getTime()
    return diff > 0
  })
  
  // Large groups (partySize >= 6) upcoming (today or future)
  const upcomingLargeGroups = reservations.filter(r => {
    const diff = new Date(r.date).getTime() - new Date(referenceDateStr).getTime()
    return (diff >= 0) && r.partySize >= 6
  })

  // Email stats
  const pendingReviewEmails = emails.filter(e => e.draft?.status === 'Pending Review' || e.status === 'Pending Review')
  const unresolvedDraftEmails = emails.filter(e => e.draft && (e.draft.status === 'Draft' || e.draft.status === 'Needs Revision'))
  const cancelledReservations = reservations.filter(r => r.status === 'Cancelled')
  const unconfirmedReservations = reservations.filter(r => r.status === 'Draft' || r.status === 'Pending')

  // Email workflow counts
  const countDraft = emails.filter(e => e.draft?.status === 'Draft').length
  const countPendingReview = emails.filter(e => e.draft?.status === 'Pending Review').length
  const countApproved = emails.filter(e => e.draft?.status === 'Approved').length
  const countNeedsRevision = emails.filter(e => e.draft?.status === 'Needs Revision').length
  const countSent = emails.filter(e => e.status === 'Sent' || e.draft?.status === 'Marked As Sent').length

  // Improvement actions counts
  const openImprovementsCount = improvements.filter(a => a.status === 'open' || a.status === 'in_progress' || a.status === 'blocked').length
  const overdueImprovementsCount = improvements.filter(a => {
    if (a.status === 'completed' || a.status === 'cancelled' || !a.dueDate) return false
    return new Date(a.dueDate) < new Date(referenceDateStr)
  }).length

  // SOP counts
  const activeSopsCount = sops.filter(s => s.status === 'active').length

  // SOP Training counts
  const unconfirmedTrainingCount = trainingAssignments.filter(a => a.status === 'assigned' || a.status === 'in_progress').length
  const overdueTrainingCount = trainingAssignments.filter(a => {
    if (a.status === 'acknowledged' || a.status === 'cancelled' || !a.dueDate) return false
    return new Date(a.dueDate) < new Date(referenceDateStr)
  }).length

  // Checklist counts
  const incompleteChecklistsToday = checklistRuns.filter(r => r.runDate === referenceDateStr && r.status !== 'completed' && r.status !== 'cancelled').length
  const overdueChecklistsCount = checklistRuns.filter(r => {
    if (r.status === 'completed' || r.status === 'cancelled') return false
    return new Date(r.runDate) < new Date(referenceDateStr)
  }).length

  // Daily Report counts
  const reportsTodayCount = dailyReports.filter(r => r.reportDate === referenceDateStr).length
  const reportsCeoAttentionCount = dailyReports.filter(r => r.ceoAttentionRequired && r.status !== 'archived').length
  const reportsActionRequiredCount = dailyReports.filter(r => r.actionRequired && r.status !== 'archived').length

  // Recovery Case counts
  const openRecoveryCasesCount = recoveryCases.filter(c => c.status === 'open' || c.status === 'contacting' || c.status === 'recovery_offered').length
  const waitingGuestResponseCount = recoveryCases.filter(c => c.status === 'waiting_guest_response').length
  const recoveryCeoAttentionCount = recoveryCases.filter(c => c.ceoAttentionRequired && c.status !== 'closed' && c.status !== 'archived').length

  // Operational Risks list
  const getOperationalRisks = () => {
    const risks = []
    
    // Risk 1: Unconfirmed reservations today
    const unconfirmedToday = reservationsToday.filter(r => r.status === 'Draft' || r.status === 'Pending')
    if (unconfirmedToday.length > 0) {
      risks.push({
        type: 'warning',
        message: `Có ${unconfirmedToday.length} đặt bàn hôm nay chưa xác nhận!`,
        detail: `Khách hàng: ${unconfirmedToday.map(r => r.guestName).join(', ')}`
      })
    }

    // Risk 2: Email drafts pending review
    if (pendingReviewEmails.length > 0) {
      risks.push({
        type: 'danger',
        message: `Có ${pendingReviewEmails.length} email nháp đang chờ duyệt trả lời!`,
        detail: `Cần phản hồi kịp thời để xác nhận yêu cầu của khách.`
      })
    }

    // Risk: Overdue improvement actions
    if (overdueImprovementsCount > 0) {
      risks.push({
        type: 'danger',
        message: `Có ${overdueImprovementsCount} hành động cải tiến quá hạn xử lý!`,
        detail: `Cần đôn đốc bộ phận phụ trách giải quyết các bài học kinh nghiệm vận hành.`
      })
    }

    // Risk: Overdue SOP training assignments
    if (overdueTrainingCount > 0) {
      risks.push({
        type: 'danger',
        message: `Có ${overdueTrainingCount} phân công đào tạo SOP quá hạn xác nhận!`,
        detail: `Nhân viên cần hoàn thành xác nhận đã đọc hướng dẫn SOP để bảo đảm kỷ luật dịch vụ.`
      })
    }

    // Risk: Incomplete checklists today
    if (incompleteChecklistsToday > 0) {
      risks.push({
        type: 'warning',
        message: `Có ${incompleteChecklistsToday} checklist vận hành hôm nay chưa hoàn thành!`,
        detail: `Đội ngũ ca trực cần hoàn thành các bước kiểm tra mở ca/đóng ca.`
      })
    }

    // Risk: Overdue checklists
    if (overdueChecklistsCount > 0) {
      risks.push({
        type: 'danger',
        message: `Có ${overdueChecklistsCount} checklist vận hành quá hạn chưa hoàn thành!`,
        detail: `Kiểm tra lại kỷ luật đóng ca và bàn giao của ca trước.`
      })
    }

    // Risk: Daily reports requiring CEO attention
    if (reportsCeoAttentionCount > 0) {
      risks.push({
        type: 'danger',
        message: `Có ${reportsCeoAttentionCount} báo cáo vận hành ngày cần CEO xem xét khẩn cấp!`,
        detail: `Được đánh dấu cảnh báo bởi quản lý ca trực để giải quyết sự cố phát sinh.`
      })
    }

    // Risk: Daily reports requiring action
    if (reportsActionRequiredCount > 0) {
      risks.push({
        type: 'warning',
        message: `Có ${reportsActionRequiredCount} báo cáo vận hành có hạng mục cần xử lý khắc phục!`,
        detail: `Cần phối hợp FOH/BOH để xử lý sự cố thiết bị hoặc nhân sự.`
      })
    }

    // Risk: Recovery cases requiring CEO attention
    if (recoveryCeoAttentionCount > 0) {
      risks.push({
        type: 'danger',
        message: `Có ${recoveryCeoAttentionCount} case phục hồi khách hàng cần CEO duyệt phương án bồi thường!`,
        detail: `Yêu cầu xem xét mức độ ưu tiên và kế hoạch chăm sóc để tránh rủi ro thương hiệu.`
      })
    }

    // Risk 3: Large groups upcoming
    if (upcomingLargeGroups.length > 0) {
      risks.push({
        type: 'info',
        message: `Có ${upcomingLargeGroups.length} đoàn khách lớn sắp đến biệt thự!`,
        detail: `Yêu cầu chuẩn bị chu đáo khu vực phòng VIP.`
      })
    }

    // Risk 4 & 5: Static gaps warnings
    risks.push({
      type: 'amber',
      message: 'Chưa kết nối dữ liệu doanh thu thời gian thực (POS)',
      detail: 'Chưa có phân hệ POS thu ngân.'
    })
    risks.push({
      type: 'amber',
      message: 'Chưa kết nối dữ liệu chi phí thực phẩm (Food cost)',
      detail: 'Chưa liên kết phân hệ Menu & Recipe.'
    })

    return risks
  }

  const operationalRisks = getOperationalRisks()

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang kết nối hệ thống điều hành CEO...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Lỗi Hệ Thống</h3>
        <p className="text-xs text-foreground/70">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="rounded border border-red-500/40 px-4 py-1.5 text-xs hover:bg-red-500/10 text-foreground transition-all"
        >
          Tải lại trang
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header & Simulated States controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold-border/40 pb-4 gap-4">
        <div>
          <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
            🏛️ Tổng quan điều hành (CEO Dashboard)
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            Bảng chỉ số hoạt động thực tế của biệt thự ẩm thực Maison Vie từ Reservations & Emails.
          </p>
        </div>

        {/* Date Filter selector */}
        <div className="flex items-center gap-1.5 bg-background/50 border border-gold-border/30 rounded p-1 self-start">
          <button
            onClick={() => setDateFilter('today')}
            className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
              dateFilter === 'today' ? 'bg-gold text-background font-bold' : 'text-foreground/70 hover:text-gold'
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setDateFilter('next_7_days')}
            className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
              dateFilter === 'next_7_days' ? 'bg-gold text-background font-bold' : 'text-foreground/70 hover:text-gold'
            }`}
          >
            7 ngày tới
          </button>
          <button
            onClick={() => setDateFilter('next_30_days')}
            className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
              dateFilter === 'next_30_days' ? 'bg-gold text-background font-bold' : 'text-foreground/70 hover:text-gold'
            }`}
          >
            30 ngày tới
          </button>
          <button
            onClick={() => setDateFilter('current_month')}
            className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-all ${
              dateFilter === 'current_month' ? 'bg-gold text-background font-bold' : 'text-foreground/70 hover:text-gold'
            }`}
          >
            Tháng này
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 */}
        <div className="glass-panel p-4 rounded-xl border border-gold-border/40 bg-gold-muted/5">
          <div className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">Đặt bàn hôm nay</div>
          <div className="text-3xl font-serif-cormorant font-bold text-gold mt-1">
            {reservationsToday.length}
          </div>
          <div className="text-[9px] text-foreground/40 mt-1 font-mono">Dữ liệu đặt bàn ngày 2026-06-28</div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel p-4 rounded-xl border border-gold-border/40 bg-gold-muted/5">
          <div className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">Số khách hôm nay</div>
          <div className="text-3xl font-serif-cormorant font-bold text-gold mt-1">
            {partySizeToday} <span className="text-xs text-foreground/60">khách</span>
          </div>
          <div className="text-[9px] text-foreground/40 mt-1 font-mono">Tổng số lượng ghế dự kiến</div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel p-4 rounded-xl border border-gold-border/40 bg-gold-muted/5">
          <div className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">Đoàn khách lớn sắp tới</div>
          <div className="text-3xl font-serif-cormorant font-bold text-gold mt-1">
            {upcomingLargeGroups.length}
          </div>
          <div className="text-[9px] text-foreground/40 mt-1 font-mono">Đặt bàn có quy mô từ 6 khách trở lên</div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel p-4 rounded-xl border border-gold-border/40 bg-gold-muted/5">
          <div className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">Email chờ duyệt trả lời</div>
          <div className="text-3xl font-serif-cormorant font-bold text-gold mt-1">
            {pendingReviewEmails.length}
          </div>
          <div className="text-[9px] text-foreground/40 mt-1 font-mono">Thư nháp cần cấp quản lý phê duyệt</div>
        </div>

        {/* KPI 5 */}
        <div className="glass-panel p-4 rounded-xl border border-gold-border/40 bg-gold-muted/5">
          <div className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">Đặt bàn chưa xác nhận</div>
          <div className="text-3xl font-serif-cormorant font-bold text-gold mt-1">
            {unconfirmedReservations.length}
          </div>
          <div className="text-[9px] text-foreground/40 mt-1 font-mono">Trạng thái Bản nháp / Chờ duyệt</div>
        </div>

        {/* KPI 6 */}
        <div className="glass-panel p-4 rounded-xl border border-gold-border/40 bg-gold-muted/5">
          <div className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">Email nháp cần xử lý</div>
          <div className="text-3xl font-serif-cormorant font-bold text-gold mt-1">
            {unresolvedDraftEmails.length}
          </div>
          <div className="text-[9px] text-foreground/40 mt-1 font-mono">Bản nháp ở trạng thái Nháp/Sửa lại</div>
        </div>

        {/* KPI 7 */}
        <div className="glass-panel p-4 rounded-xl border border-gold-border/40 bg-gold-muted/5">
          <div className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">Đặt bàn đã hủy</div>
          <div className="text-3xl font-serif-cormorant font-bold text-gold mt-1">
            {cancelledReservations.length}
          </div>
          <div className="text-[9px] text-foreground/40 mt-1 font-mono">Các lịch đặt bàn bị khách hủy</div>
        </div>

        {/* KPI 8 */}
        <div className="glass-panel p-4 rounded-xl border border-gold-border/40 bg-gold-muted/5">
          <div className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider">Đặt bàn sắp tới</div>
          <div className="text-3xl font-serif-cormorant font-bold text-gold mt-1">
            {upcomingReservations.length}
          </div>
          <div className="text-[9px] text-foreground/40 mt-1 font-mono">Tổng đặt bàn từ ngày 2026-06-29</div>
        </div>
      </div>

      {/* Main Grid: Panels */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Reservation list & Emails panel */}
        <div className="lg:col-span-2 space-y-8">
          {/* Reservation Overview Panel */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
                📅 Lịch đặt bàn ({dateFilter === 'today' ? 'Hôm nay' : dateFilter === 'next_7_days' ? '7 ngày tới' : dateFilter === 'next_30_days' ? '30 ngày tới' : 'Tháng này'})
              </h3>
              <span className="text-[10px] font-mono text-gold-hover">{filteredReservations.length} lượt đặt</span>
            </div>

            {/* List */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/5 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[9px]">
                    <th className="py-2.5 px-3">Khách hàng</th>
                    <th className="py-2.5 px-3">Thời gian</th>
                    <th className="py-2.5 px-3 text-center">Số khách</th>
                    <th className="py-2.5 px-3">Phòng tiệc</th>
                    <th className="py-2.5 px-3 text-right">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((res) => (
                      <tr key={res.id} className="hover:bg-gold-muted/5 transition-colors">
                        <td className="py-3 px-3">
                          <div className="font-semibold text-foreground">{res.guestName}</div>
                          <span className="text-[8px] font-mono text-gold uppercase">{res.vipLevel}</span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px]">
                          <div>{res.date}</div>
                          <div className="text-gold font-bold">{res.time}</div>
                        </td>
                        <td className="py-3 px-3 text-center font-mono font-bold">{res.partySize}</td>
                        <td className="py-3 px-3">{res.roomName}</td>
                        <td className="py-3 px-3 text-right">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold tracking-wider ${getStatusClass(res.status)}`}>
                            {getStatusLabel(res.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-foreground/40 italic">
                        Không có lịch đặt bàn nào trong khoảng thời gian đã chọn.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Email Draft Workflow Panel */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <div className="flex items-center justify-between border-b border-gold-border/20 pb-3">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide">
                ✉️ Tiến độ duyệt email trả lời
              </h3>
            </div>

            {/* Email Draft Status Summary */}
            <div className="grid gap-2 grid-cols-5 text-center text-xs">
              <div className="p-2.5 bg-background border border-gold-border/10 rounded">
                <span className="text-foreground/50 block text-[9px] uppercase font-mono">Nháp</span>
                <span className="text-lg font-bold text-gold mt-1 block">{countDraft}</span>
              </div>
              <div className="p-2.5 bg-background border border-gold-border/10 rounded">
                <span className="text-foreground/50 block text-[9px] uppercase font-mono">Chờ duyệt</span>
                <span className="text-lg font-bold text-gold mt-1 block">{countPendingReview}</span>
              </div>
              <div className="p-2.5 bg-background border border-gold-border/10 rounded">
                <span className="text-foreground/50 block text-[9px] uppercase font-mono">Cần sửa</span>
                <span className="text-lg font-bold text-gold mt-1 block">{countNeedsRevision}</span>
              </div>
              <div className="p-2.5 bg-background border border-gold-border/10 rounded">
                <span className="text-foreground/50 block text-[9px] uppercase font-mono">Đã duyệt</span>
                <span className="text-lg font-bold text-gold mt-1 block">{countApproved}</span>
              </div>
              <div className="p-2.5 bg-background border border-gold-border/10 rounded">
                <span className="text-foreground/50 block text-[9px] uppercase font-mono">Đã gửi</span>
                <span className="text-lg font-bold text-gold mt-1 block">{countSent}</span>
              </div>
            </div>

            {/* Pending actions list */}
            <div className="space-y-3 pt-2">
              <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Thư đang xử lý cần lưu ý:</span>
              {emails.filter(e => e.draft).length > 0 ? (
                emails.filter(e => e.draft).map((em) => (
                  <div key={em.id} className="p-3 bg-background/50 border border-gold-border/10 rounded-lg flex items-center justify-between gap-4">
                    <div className="text-xs">
                      <div className="font-semibold text-foreground">{em.senderName}</div>
                      <div className="text-[10px] text-foreground/60 truncate max-w-xs">{em.draft?.draftSubject}</div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block rounded px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider ${getDraftStatusClass(em.draft?.status || 'Draft')}`}>
                        {getDraftStatusLabel(em.draft?.status || 'Draft')}
                      </span>
                      <div className="text-[8px] text-foreground/40 font-mono mt-1">Yêu cầu lúc: {em.receivedAt}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-foreground/40 italic">Không có email nháp nào đang hoạt động.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Operational Risks & Data Gaps */}
        <div className="space-y-8">
          {/* Continuous Learning, SOP, Training, Checklist, Report & Recovery Panel */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              🎓 Học tập, SOP & Chăm sóc
            </h3>
            <div className="text-xs space-y-2">
              <div className="flex justify-between border-b border-gold-border/10 pb-1.5">
                <span className="text-foreground/60">Hành động cải tiến đang mở:</span>
                <span className="font-bold text-gold">{openImprovementsCount}</span>
              </div>
              <div className="flex justify-between border-b border-gold-border/10 pb-1.5">
                <span className="text-foreground/60">SOP đang áp dụng:</span>
                <span className="font-bold text-green-400">{activeSopsCount}</span>
              </div>
              <div className="flex justify-between border-b border-gold-border/10 pb-1.5">
                <span className="text-foreground/60">Đào tạo chưa xác nhận:</span>
                <span className="font-bold text-yellow-500">{unconfirmedTrainingCount}</span>
              </div>
              <div className="flex justify-between border-b border-gold-border/10 pb-1.5">
                <span className="text-foreground/60">Checklist hôm nay chưa xong:</span>
                <span className={`font-bold ${incompleteChecklistsToday > 0 ? 'text-yellow-500' : 'text-foreground'}`}>{incompleteChecklistsToday}</span>
              </div>
              <div className="flex justify-between border-b border-gold-border/10 pb-1.5">
                <span className="text-foreground/60">Báo cáo hôm nay:</span>
                <span className="font-bold text-gold">{reportsTodayCount}</span>
              </div>
              <div className="flex justify-between border-b border-gold-border/10 pb-1.5">
                <span className="text-foreground/60">Case phục hồi đang mở:</span>
                <span className="font-bold text-blue-400">{openRecoveryCasesCount}</span>
              </div>
              <div className="flex justify-between border-b border-gold-border/10 pb-1.5">
                <span className="text-foreground/60">Case chờ khách phản hồi:</span>
                <span className="font-bold text-purple-400">{waitingGuestResponseCount}</span>
              </div>
            </div>
            <div className="grid gap-2 grid-cols-2 pt-1 text-[9px] font-semibold text-center">
              <Link
                href="/studio/learning"
                className="rounded border border-gold-border/40 hover:border-gold py-1.5 text-foreground/75 hover:text-gold transition-all"
              >
                Nhật ký Học tập
              </Link>
              <Link
                href="/studio/improvements"
                className="rounded border border-gold-border/40 hover:border-gold py-1.5 text-foreground/75 hover:text-gold transition-all"
              >
                Hành động cải tiến
              </Link>
              <Link
                href="/studio/sops"
                className="rounded border border-gold-border/40 hover:border-gold py-1.5 text-foreground/75 hover:text-gold transition-all"
              >
                Thư viện SOP
              </Link>
              <Link
                href="/studio/sop-training"
                className="rounded border border-gold-border/40 hover:border-gold py-1.5 text-foreground/75 hover:text-gold transition-all"
              >
                Xem đào tạo SOP
              </Link>
              <Link
                href="/studio/checklists"
                className="rounded border border-gold-border/40 hover:border-gold py-1.5 text-foreground/75 hover:text-gold transition-all"
              >
                Xem checklist vận hành
              </Link>
              <Link
                href="/studio/daily-reports"
                className="rounded border border-gold-border/40 hover:border-gold py-1.5 text-foreground/75 hover:text-gold transition-all"
              >
                Xem báo cáo ngày
              </Link>
              <Link
                href="/studio/recovery"
                className="col-span-2 rounded border border-gold/45 hover:border-gold py-1.5 text-gold bg-gold-muted/5 hover:bg-gold/15 transition-all font-semibold"
              >
                Xem phục hồi khách
              </Link>
            </div>
          </div>

          {/* Operational Risks Panel */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              ⚠️ Cảnh báo vận hành
            </h3>
            
            <div className="space-y-3">
              {operationalRisks.map((risk, index) => (
                <div 
                  key={index} 
                  className={`p-3.5 border rounded-lg space-y-1 ${
                    risk.type === 'danger'
                      ? 'bg-red-500/5 border-red-500/20 text-red-200'
                      : risk.type === 'warning'
                      ? 'bg-orange-500/5 border-orange-500/20 text-orange-200'
                      : risk.type === 'info'
                      ? 'bg-blue-500/5 border-blue-500/20 text-blue-200'
                      : 'bg-yellow-500/5 border-yellow-500/10 text-yellow-100/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-xs font-semibold">
                    <span>{risk.type === 'danger' ? '🚨' : risk.type === 'warning' ? '⚡' : risk.type === 'info' ? 'ℹ️' : '🔔'}</span>
                    <span>{risk.message}</span>
                  </div>
                  <p className="text-[10px] text-foreground/60 leading-relaxed pl-5 font-sans">{risk.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Data Gaps Panel */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              ❌ Dữ liệu chưa kết nối
            </h3>
            
            <div className="space-y-3 text-xs leading-relaxed">
              <div className="space-y-0.5">
                <span className="text-gold font-semibold block">Doanh thu (Revenue)</span>
                <p className="text-foreground/60 text-[11px]">Chưa có nguồn dữ liệu doanh thu chuẩn từ POS hoặc Finance Engine.</p>
              </div>

              <div className="space-y-0.5 border-t border-gold-border/10 pt-2">
                <span className="text-gold font-semibold block">Chi phí nguyên liệu (Food Cost)</span>
                <p className="text-foreground/60 text-[11px]">Chưa có dữ liệu chi phí nguyên vật liệu từ nhà bếp hoặc phân hệ Menu & Recipe.</p>
              </div>

              <div className="space-y-0.5 border-t border-gold-border/10 pt-2">
                <span className="text-gold font-semibold block">Chi phí nhân sự (Labor Cost)</span>
                <p className="text-foreground/60 text-[11px]">Chưa có dữ liệu chi phí nhân sự từ phân hệ HR & Bảng lương.</p>
              </div>

              <div className="space-y-0.5 border-t border-gold-border/10 pt-2">
                <span className="text-gold font-semibold block">Hao hụt ẩm thực (Waste)</span>
                <p className="text-foreground/60 text-[11px]">Chưa có dữ liệu hao hụt/hủy món ăn từ hệ thống Kitchen OS.</p>
              </div>

              <div className="space-y-0.5 border-t border-gold-border/10 pt-2">
                <span className="text-gold font-semibold block">Đánh giá mạng xã hội (Reviews)</span>
                <p className="text-foreground/60 text-[11px]">Chưa kết nối API thu thập đánh giá của khách hàng từ Google Reviews hoặc TripAdvisor.</p>
              </div>

              <div className="space-y-0.5 border-t border-gold-border/10 pt-2">
                <span className="text-gold font-semibold block">Báo cáo két sắt & quỹ (Cash)</span>
                <p className="text-foreground/60 text-[11px]">Chưa kết nối dữ liệu dòng tiền và két sắt từ phân hệ Thủ quỹ.</p>
              </div>

              <div className="space-y-0.5 border-t border-gold-border/10 pt-2">
                <span className="text-gold font-semibold block">Tồn kho & hầm rượu (Inventory)</span>
                <p className="text-foreground/60 text-[11px]">Chưa kết nối dữ liệu kho hàng thực phẩm và hầm rượu từ phân hệ Kho.</p>
              </div>

              <div className="space-y-0.5 border-t border-gold-border/10 pt-2">
                <span className="text-gold font-semibold block">Phân loại khách đoàn/lẻ (Guest Class)</span>
                <p className="text-foreground/60 text-[11px]">Chưa có thuộc tính phân loại đối tượng khách hàng (group/individual) trong dữ liệu đặt bàn.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
