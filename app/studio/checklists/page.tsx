'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export type OperationalDepartment =
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

export type OperationalShiftType =
  | "opening"
  | "pre_service"
  | "lunch"
  | "dinner"
  | "closing"
  | "full_day"
  | "event"
  | "other"

export type ChecklistTemplateStatus =
  | "draft"
  | "active"
  | "archived"

export type ChecklistRunStatus =
  | "open"
  | "in_progress"
  | "completed"
  | "overdue"
  | "cancelled"

export interface ChecklistTemplateItem {
  id: string
  label: string
  required: boolean
  order: number
}

export interface ChecklistRunItem {
  itemId: string
  checked: boolean
  note?: string | null
  checkedAt?: string | null
}

export interface OperationalChecklistTemplate {
  id: string
  title: string
  description?: string | null
  department: OperationalDepartment
  shiftType: OperationalShiftType
  status: ChecklistTemplateStatus
  ownerName?: string | null
  relatedSopDocumentId?: string | null
  items: ChecklistTemplateItem[]
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

export interface OperationalChecklistRun {
  id: string
  templateId: string
  runDate: string
  department: OperationalDepartment
  shiftType: OperationalShiftType
  status: ChecklistRunStatus
  responsibleName?: string | null
  completedItems: ChecklistRunItem[]
  note?: string | null
  completedAt?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface SopDocument {
  id: string
  title: string
  summary?: string | null
  status: string
}

const INITIAL_TEMPLATES: OperationalChecklistTemplate[] = [
  {
    id: 'tpl-501',
    title: 'Checklist Mở ca của FOH',
    description: 'Bao gồm các tiêu chuẩn thiết lập không gian, nhiệt độ và nhạc nền sảnh đón khách ca sáng.',
    department: 'foh',
    shiftType: 'opening',
    status: 'active',
    ownerName: 'Nguyễn Thị Hoa (FOH Lead)',
    relatedSopDocumentId: 'sop-301',
    items: [
      { id: 'item-1', label: 'Kiểm tra nhiệt độ máy điều hòa tại sảnh chính (đạt 22-24°C)', required: true, order: 1 },
      { id: 'item-2', label: 'Khởi động hệ thống phát nhạc Baroque âm lượng 15%', required: true, order: 2 },
      { id: 'item-3', label: 'Kiểm tra nến thơm và thắp tại 6 góc sảnh', required: false, order: 3 },
      { id: 'item-4', label: 'Đối chiếu sổ đặt bàn ca sáng và chuẩn bị thẻ tên khách VIP', required: true, order: 4 }
    ],
    createdAt: '2026-06-28 07:00',
    updatedAt: '2026-06-28 07:00'
  },
  {
    id: 'tpl-502',
    title: 'Checklist đóng ca Bếp sơ chế súp',
    description: 'Các bước kiểm soát vệ sinh thớt sơ chế súp hải sản và tiệt trùng khăn cheesecloth cuối ca.',
    department: 'boh',
    shiftType: 'closing',
    status: 'active',
    ownerName: 'Chef Joel (Bếp trưởng)',
    relatedSopDocumentId: 'sop-302',
    items: [
      { id: 'item-5', label: 'Vệ sinh toàn bộ thớt, dao và bàn đá sơ chế súp', required: true, order: 1 },
      { id: 'item-6', label: 'Đóng gói cheesecloth bẩn vào giỏ giặt tiệt trùng', required: true, order: 2 },
      { id: 'item-7', label: 'Kiểm tra nhiệt độ tủ đông súp hải sản (đạt -18°C)', required: true, order: 3 },
      { id: 'item-8', label: 'Khóa van gas trung tâm bếp nấu súp', required: true, order: 4 }
    ],
    createdAt: '2026-06-28 09:30',
    updatedAt: '2026-06-28 09:30'
  }
]

const INITIAL_RUNS: OperationalChecklistRun[] = [
  {
    id: 'run-601',
    templateId: 'tpl-501',
    runDate: '2026-06-28',
    department: 'foh',
    shiftType: 'opening',
    status: 'in_progress',
    responsibleName: 'Trần Văn Bình',
    completedItems: [
      { itemId: 'item-1', checked: true, note: 'Đã thiết lập 23 độ', checkedAt: '2026-06-28 07:15' },
      { itemId: 'item-2', checked: true, note: 'Loa hoạt động tốt', checkedAt: '2026-06-28 07:17' },
      { itemId: 'item-3', checked: false, note: '', checkedAt: null },
      { itemId: 'item-4', checked: false, note: '', checkedAt: null }
    ],
    note: 'Ca sáng chuẩn bị đón tiếp đoàn VIP 8 người.',
    createdAt: '2026-06-28 07:05',
    updatedAt: '2026-06-28 07:17'
  }
]

function ChecklistsPageContent() {
  const searchParams = useSearchParams()
  const querySopId = searchParams.get('sop_id')

  const [templates, setTemplates] = useState<OperationalChecklistTemplate[]>([])
  const [runs, setRuns] = useState<OperationalChecklistRun[]>([])
  const [sops, setSops] = useState<SopDocument[]>([])
  
  const [activeTab, setActiveTab] = useState<'runs' | 'templates'>('runs')
  const [selectedRun, setSelectedRun] = useState<OperationalChecklistRun | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<OperationalChecklistTemplate | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Template Form State
  const [tplForm, setTplForm] = useState({
    title: '',
    description: '',
    department: 'foh' as OperationalDepartment,
    shiftType: 'opening' as OperationalShiftType,
    status: 'draft' as ChecklistTemplateStatus,
    ownerName: '',
    relatedSopDocumentId: ''
  })
  const [tplItems, setTplItems] = useState<{ label: string; required: boolean }[]>([
    { label: '', required: true }
  ])

  // Run Form State
  const [runForm, setRunForm] = useState({
    templateId: '',
    runDate: '2026-06-28',
    department: 'foh' as OperationalDepartment,
    shiftType: 'opening' as OperationalShiftType,
    responsibleName: '',
    note: ''
  })

  // Execution notes temp state
  const [executionNotes, setExecutionNotes] = useState<Record<string, string>>({})

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedTemplates = localStorage.getItem('mvos_checklist_templates')
        const storedRuns = localStorage.getItem('mvos_checklist_runs')
        const storedSops = localStorage.getItem('mvos_sops')

        let loadedTemplates: OperationalChecklistTemplate[] = []
        let loadedRuns: OperationalChecklistRun[] = []
        let loadedSops: SopDocument[] = []

        if (storedTemplates) {
          loadedTemplates = JSON.parse(storedTemplates)
        } else {
          localStorage.setItem('mvos_checklist_templates', JSON.stringify(INITIAL_TEMPLATES))
          loadedTemplates = INITIAL_TEMPLATES
        }
        setTemplates(loadedTemplates)

        if (storedRuns) {
          loadedRuns = JSON.parse(storedRuns)
        } else {
          localStorage.setItem('mvos_checklist_runs', JSON.stringify(INITIAL_RUNS))
          loadedRuns = INITIAL_RUNS
        }
        setRuns(loadedRuns)

        if (storedSops) {
          loadedSops = JSON.parse(storedSops)
          setSops(loadedSops)
        }

        // Handle pre-population from SOP
        if (querySopId) {
          const matchedSop = loadedSops.find(s => s.id === querySopId)
          if (matchedSop) {
            setActiveTab('templates')
            setTplForm((prev) => ({
              ...prev,
              relatedSopDocumentId: matchedSop.id,
              title: `Checklist quy trình: ${matchedSop.title}`,
              description: matchedSop.summary || ''
            }))
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu checklist.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [querySopId])

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!tplForm.title.trim()) errs.title = 'Tên mẫu checklist không được để trống'
    if (!tplForm.department) errs.department = 'Vui lòng chọn bộ phận áp dụng'
    if (!tplForm.shiftType) errs.shiftType = 'Vui lòng chọn ca áp dụng'

    const filteredItems = tplItems.filter(item => item.label.trim())
    if (filteredItems.length === 0) {
      errs.items = 'Mẫu phải có ít nhất một mục kiểm tra có nhãn hợp lệ'
    }

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const finalItems: ChecklistTemplateItem[] = filteredItems.map((item, idx) => ({
      id: `item-${Date.now().toString().slice(-3)}-${idx}`,
      label: item.label,
      required: item.required,
      order: idx + 1
    }))

    const newTemplate: OperationalChecklistTemplate = {
      id: `tpl-${Date.now().toString().slice(-4)}`,
      title: tplForm.title,
      description: tplForm.description || '',
      department: tplForm.department,
      shiftType: tplForm.shiftType,
      status: tplForm.status,
      ownerName: tplForm.ownerName || 'Chưa phân công',
      relatedSopDocumentId: tplForm.relatedSopDocumentId || null,
      items: finalItems,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newTemplate, ...templates]
    localStorage.setItem('mvos_checklist_templates', JSON.stringify(updated))
    setTemplates(updated)

    // Reset Template form
    setTplForm({
      title: '',
      description: '',
      department: 'foh',
      shiftType: 'opening',
      status: 'draft',
      ownerName: '',
      relatedSopDocumentId: ''
    })
    setTplItems([{ label: '', required: true }])
  }

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!runForm.templateId) errs.templateId = 'Vui lòng chọn mẫu để bắt đầu checklist'
    if (!runForm.runDate) errs.runDate = 'Vui lòng chọn ngày chạy'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const matchedTpl = templates.find(t => t.id === runForm.templateId)
    if (!matchedTpl) return

    const initialCompletedItems: ChecklistRunItem[] = matchedTpl.items.map(item => ({
      itemId: item.id,
      checked: false,
      note: '',
      checkedAt: null
    }))

    const newRun: OperationalChecklistRun = {
      id: `run-${Date.now().toString().slice(-4)}`,
      templateId: runForm.templateId,
      runDate: runForm.runDate,
      department: runForm.department,
      shiftType: runForm.shiftType,
      status: 'open',
      responsibleName: runForm.responsibleName || 'Chưa phân công',
      completedItems: initialCompletedItems,
      note: runForm.note || '',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newRun, ...runs]
    localStorage.setItem('mvos_checklist_runs', JSON.stringify(updated))
    setRuns(updated)
    setSelectedRun(newRun)

    // Reset run form
    setRunForm({
      templateId: '',
      runDate: '2026-06-28',
      department: 'foh',
      shiftType: 'opening',
      responsibleName: '',
      note: ''
    })
  }

  const handleUpdateTemplateStatus = (tplId: string, nextStatus: ChecklistTemplateStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = templates.map((tpl) => {
      if (tpl.id === tplId) {
        const updatedTpl = { ...tpl, status: nextStatus, updatedAt: nowStr }
        if (selectedTemplate?.id === tplId) setSelectedTemplate(updatedTpl)
        return updatedTpl
      }
      return tpl
    })
    localStorage.setItem('mvos_checklist_templates', JSON.stringify(updated))
    setTemplates(updated)
  }

  const handleToggleRunItem = (runId: string, itemId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = runs.map((run) => {
      if (run.id === runId) {
        const updatedItems = run.completedItems.map((item) => {
          if (item.itemId === itemId) {
            const isChecked = !item.checked
            return {
              ...item,
              checked: isChecked,
              checkedAt: isChecked ? nowStr : null
            }
          }
          return item
        })
        const updatedRun = {
          ...run,
          completedItems: updatedItems,
          status: 'in_progress' as ChecklistRunStatus,
          updatedAt: nowStr
        }
        if (selectedRun?.id === runId) setSelectedRun(updatedRun)
        return updatedRun
      }
      return run
    })
    localStorage.setItem('mvos_checklist_runs', JSON.stringify(updated))
    setRuns(updated)
  }

  const handleSaveRunItemNote = (runId: string, itemId: string, noteText: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = runs.map((run) => {
      if (run.id === runId) {
        const updatedItems = run.completedItems.map((item) => {
          if (item.itemId === itemId) {
            return { ...item, note: noteText }
          }
          return item
        })
        const updatedRun = {
          ...run,
          completedItems: updatedItems,
          updatedAt: nowStr
        }
        if (selectedRun?.id === runId) setSelectedRun(updatedRun)
        return updatedRun
      }
      return run
    })
    localStorage.setItem('mvos_checklist_runs', JSON.stringify(updated))
    setRuns(updated)
  }

  const handleCompleteRun = (runId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = runs.map((run) => {
      if (run.id === runId) {
        const updatedRun = {
          ...run,
          status: 'completed' as ChecklistRunStatus,
          completedAt: nowStr,
          updatedAt: nowStr
        }
        if (selectedRun?.id === runId) setSelectedRun(updatedRun)
        return updatedRun
      }
      return run
    })
    localStorage.setItem('mvos_checklist_runs', JSON.stringify(updated))
    setRuns(updated)
  }

  const handleSetRunStatus = (runId: string, nextStatus: ChecklistRunStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = runs.map((run) => {
      if (run.id === runId) {
        const updatedRun = {
          ...run,
          status: nextStatus,
          updatedAt: nowStr
        }
        if (selectedRun?.id === runId) setSelectedRun(updatedRun)
        return updatedRun
      }
      return run
    })
    localStorage.setItem('mvos_checklist_runs', JSON.stringify(updated))
    setRuns(updated)
  }

  const getDepartmentLabel = (dept: OperationalDepartment) => {
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

  const getShiftLabel = (shift: OperationalShiftType) => {
    switch (shift) {
      case 'opening': return 'Mở ca'
      case 'pre_service': return 'Trước phục vụ'
      case 'lunch': return 'Ca trưa'
      case 'dinner': return 'Ca tối'
      case 'closing': return 'Đóng ca'
      case 'full_day': return 'Cả ngày'
      case 'event': return 'Sự kiện'
      default: return 'Khác'
    }
  }

  const getTemplateStatusLabel = (st: ChecklistTemplateStatus) => {
    switch (st) {
      case 'draft': return 'Bản nháp'
      case 'active': return 'Đang áp dụng'
      case 'archived': return 'Lưu trữ'
      default: return st
    }
  }

  const getRunStatusLabel = (st: ChecklistRunStatus) => {
    switch (st) {
      case 'open': return 'Mới tạo'
      case 'in_progress': return 'Đang thực hiện'
      case 'completed': return 'Đã hoàn thành'
      case 'overdue': return 'Quá hạn'
      case 'cancelled': return 'Đã hủy'
      default: return st
    }
  }

  const getStatusClass = (st: string) => {
    switch (st) {
      case 'active':
      case 'completed':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'overdue':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      case 'in_progress':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'draft':
      case 'open':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getSopTitle = (sopId: string | null | undefined) => {
    if (!sopId) return 'Không liên kết'
    const found = sops.find(s => s.id === sopId)
    return found ? found.title : sopId
  }

  const getTemplateTitle = (tplId: string) => {
    const found = templates.find(t => t.id === tplId)
    return found ? found.title : tplId
  }

  const getTemplateItemsList = (tplId: string) => {
    const found = templates.find(t => t.id === tplId)
    return found ? found.items : []
  }

  // Calculate metrics
  const referenceDateStr = '2026-06-28'
  
  const todayRuns = runs.filter(r => r.runDate === referenceDateStr)
  const todayRunsCount = todayRuns.length
  
  const inProgressCount = runs.filter(r => r.status === 'in_progress').length
  const completedCount = runs.filter(r => r.status === 'completed').length
  
  const overdueCount = runs.filter(r => {
    if (r.status === 'completed' || r.status === 'cancelled') return false
    return new Date(r.runDate) < new Date(referenceDateStr)
  }).length

  const activeTemplatesCount = templates.filter(t => t.status === 'active').length

  const handleAddFormItem = () => {
    setTplItems([...tplItems, { label: '', required: true }])
  }

  const handleRemoveFormItem = (idx: number) => {
    setTplItems(tplItems.filter((_, i) => i !== idx))
  }

  const handleTplItemChange = (idx: number, field: 'label' | 'required', val: string | boolean) => {
    const updated = tplItems.map((item, i) => {
      if (i === idx) {
        return { ...item, [field]: val }
      }
      return item
    })
    setTplItems(updated)
  }

  // Verify if a checklist run can be marked completed (all required items checked)
  const canCompleteRun = (run: OperationalChecklistRun) => {
    const tplItemsList = getTemplateItemsList(run.templateId)
    const requiredItemIds = tplItemsList.filter(item => item.required).map(item => item.id)
    
    return requiredItemIds.every(reqId => {
      const runItem = run.completedItems.find(i => i.itemId === reqId)
      return runItem ? runItem.checked : false
    })
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải checklist vận hành…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải checklist vận hành.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🏛️ Checklist vận hành (Daily Checklists)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Theo dõi các checklist mở ca, trong ca và đóng ca để siết kỷ luật vận hành hằng ngày.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Checklist hôm nay</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{todayRunsCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang thực hiện</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{inProgressCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã hoàn thành</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{completedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Quá hạn</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{overdueCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Mẫu đang áp dụng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold-hover mt-1 block">{activeTemplatesCount}</span>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex gap-4 border-b border-gold-border/20 pb-2 text-xs">
        <button
          onClick={() => {
            setActiveTab('runs')
            setSelectedTemplate(null)
          }}
          className={`font-serif-cormorant font-bold text-sm tracking-wide pb-1.5 border-b-2 px-2 transition-all ${
            activeTab === 'runs'
              ? 'border-gold text-gold font-bold'
              : 'border-transparent text-foreground/50 hover:text-foreground'
          }`}
        >
          📋 Đợt chạy thực tế (Checklist Runs)
        </button>
        <button
          onClick={() => {
            setActiveTab('templates')
            setSelectedRun(null)
          }}
          className={`font-serif-cormorant font-bold text-sm tracking-wide pb-1.5 border-b-2 px-2 transition-all ${
            activeTab === 'templates'
              ? 'border-gold text-gold font-bold'
              : 'border-transparent text-foreground/50 hover:text-foreground'
          }`}
        >
          📂 Mẫu Checklist (Templates)
        </button>
      </div>

      {/* Main Workspace Layout */}
      {activeTab === 'runs' ? (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Runs Table List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground/80">
                  <thead>
                    <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Ngày</th>
                      <th className="py-3 px-4">Checklist</th>
                      <th className="py-3 px-4">Bộ phận</th>
                      <th className="py-3 px-4">Ca</th>
                      <th className="py-3 px-4">Người phụ trách</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4 text-right">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-border/10">
                    {runs.length > 0 ? (
                      runs.map((run) => {
                        const checkedItems = run.completedItems.filter(i => i.checked).length
                        const totalRunItems = run.completedItems.length
                        return (
                          <tr 
                            key={run.id}
                            onClick={() => setSelectedRun(run)}
                            className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedRun?.id === run.id ? 'bg-gold-muted/10' : ''}`}
                          >
                            <td className="py-3.5 px-4 font-mono text-gold-hover font-bold">{run.runDate}</td>
                            <td className="py-3.5 px-4 font-semibold text-foreground truncate max-w-[150px]">
                              {getTemplateTitle(run.templateId)}
                            </td>
                            <td className="py-3.5 px-4 text-foreground/75">{getDepartmentLabel(run.department)}</td>
                            <td className="py-3.5 px-4 font-semibold text-gold-hover">{getShiftLabel(run.shiftType)}</td>
                            <td className="py-3.5 px-4 text-foreground/70">{run.responsibleName || 'N/A'}</td>
                            <td className="py-3.5 px-4">
                              <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(run.status)}`}>
                                {getRunStatusLabel(run.status)}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right font-semibold font-mono text-foreground/60">
                              {checkedItems}/{totalRunItems} ({Math.round(totalRunItems ? (checkedItems / totalRunItems) * 100 : 0)}%)
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                          Chưa có checklist vận hành nào cho giai đoạn này.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Run generation Form */}
            <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
                🆕 Khởi tạo đợt chạy checklist mới
              </h3>

              <form onSubmit={handleCreateRun} className="space-y-4 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mẫu checklist áp dụng *</label>
                  <select
                    value={runForm.templateId}
                    onChange={(e) => {
                      const matched = templates.find(t => t.id === e.target.value)
                      setRunForm({
                        ...runForm,
                        templateId: e.target.value,
                        department: matched ? matched.department : 'foh',
                        shiftType: matched ? matched.shiftType : 'opening',
                        responsibleName: matched ? matched.ownerName || '' : ''
                      })
                    }}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn mẫu checklist --</option>
                    {templates.filter(t => t.status === 'active').map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title} ({getDepartmentLabel(t.department)} - {getShiftLabel(t.shiftType)})
                      </option>
                    ))}
                  </select>
                  {validationErrors.templateId && <span className="text-[10px] text-red-400 italic">{validationErrors.templateId}</span>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày thực hiện *</label>
                    <input
                      type="date"
                      value={runForm.runDate}
                      onChange={(e) => setRunForm({ ...runForm, runDate: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                    {validationErrors.runDate && <span className="text-[10px] text-red-400 italic">{validationErrors.runDate}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Người phụ trách thực tế</label>
                    <input
                      type="text"
                      placeholder="Tên nhân sự trực tiếp kiểm tra..."
                      value={runForm.responsibleName}
                      onChange={(e) => setRunForm({ ...runForm, responsibleName: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ghi chú đợt chạy</label>
                  <input
                    type="text"
                    placeholder="Mục tiêu hoặc lưu ý đặc biệt..."
                    value={runForm.note}
                    onChange={(e) => setRunForm({ ...runForm, note: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="rounded bg-gold px-5 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
                >
                  Khởi động đợt chạy
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Execution Checkboxes */}
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
                🔎 Thực thi Checklist
              </h3>

              {selectedRun ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="text-sm font-bold text-foreground font-serif-cormorant">
                      {getTemplateTitle(selectedRun.templateId)}
                    </h4>
                    <div className="flex gap-4 text-[9px] text-foreground/40 font-mono mt-0.5">
                      <span>Mã: {selectedRun.id}</span>
                      <span>Ngày: {selectedRun.runDate}</span>
                    </div>
                  </div>

                  <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Bộ phận / Ca</span>
                      <span className="font-semibold text-foreground/80 block">
                        {getDepartmentLabel(selectedRun.department)} ({getShiftLabel(selectedRun.shiftType)})
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Người kiểm tra</span>
                      <span className="font-semibold text-foreground/80 block">{selectedRun.responsibleName || 'N/A'}</span>
                    </div>
                  </div>

                  {/* Checklist items list */}
                  <div className="space-y-3 pt-2">
                    <span className="text-[10px] text-gold font-mono uppercase tracking-wider block">Các đầu mục kiểm soát</span>
                    
                    {getTemplateItemsList(selectedRun.templateId).map((item) => {
                      const runItem = selectedRun.completedItems.find(i => i.itemId === item.id)
                      const isChecked = runItem ? runItem.checked : false
                      const currentNote = runItem ? runItem.note || '' : ''
                      
                      return (
                        <div key={item.id} className="p-3 border border-gold-border/10 rounded-lg space-y-2 bg-background/30">
                          <div className="flex items-start gap-2.5">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              disabled={selectedRun.status === 'completed' || selectedRun.status === 'cancelled'}
                              onChange={() => handleToggleRunItem(selectedRun.id, item.id)}
                              className="mt-0.5 accent-gold cursor-pointer"
                            />
                            <div className="flex-1">
                              <p className={`text-xs font-sans leading-relaxed ${isChecked ? 'line-through text-foreground/45' : 'text-foreground/85 font-semibold'}`}>
                                {item.label}
                                {item.required && <span className="text-red-400 font-bold ml-1" title="Bắt buộc">*</span>}
                              </p>
                            </div>
                          </div>

                          {/* Item Note */}
                          <div className="flex gap-2 pl-6">
                            <input
                              type="text"
                              placeholder="Thêm ghi chú riêng cho mục này..."
                              disabled={selectedRun.status === 'completed' || selectedRun.status === 'cancelled'}
                              value={executionNotes[item.id] !== undefined ? executionNotes[item.id] : currentNote}
                              onChange={(e) => setExecutionNotes({ ...executionNotes, [item.id]: e.target.value })}
                              className="flex-1 border-b border-gold-border/15 bg-transparent px-1 py-0.5 text-[10px] text-foreground/70 focus:border-gold focus:outline-none"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const noteVal = executionNotes[item.id] !== undefined ? executionNotes[item.id] : currentNote
                                handleSaveRunItemNote(selectedRun.id, item.id, noteVal)
                              }}
                              disabled={selectedRun.status === 'completed' || selectedRun.status === 'cancelled'}
                              className="text-[9px] text-gold hover:underline font-mono"
                            >
                              Lưu
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {selectedRun.note && (
                    <div className="border-t border-gold-border/10 pt-3">
                      <span className="text-[9px] text-foreground/50 font-mono block">Lưu ý chung của ca</span>
                      <p className="text-foreground/80 italic leading-relaxed">{selectedRun.note}</p>
                    </div>
                  )}

                  {selectedRun.completedAt && (
                    <div className="text-[9px] text-green-400 font-mono border-t border-gold-border/10 pt-2">
                      Hoàn thành lúc: {selectedRun.completedAt}
                    </div>
                  )}

                  {/* Run Status Actions */}
                  <div className="border-t border-gold-border/20 pt-4 space-y-2">
                    <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật đợt chạy</span>
                    
                    <div className="grid gap-2 grid-cols-2">
                      <button
                        onClick={() => handleSetRunStatus(selectedRun.id, 'in_progress')}
                        disabled={selectedRun.status === 'completed' || selectedRun.status === 'cancelled'}
                        className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all disabled:opacity-40"
                      >
                        Lưu tiến độ (Đang chạy)
                      </button>

                      <button
                        onClick={() => handleCompleteRun(selectedRun.id)}
                        disabled={!canCompleteRun(selectedRun) || selectedRun.status === 'completed' || selectedRun.status === 'cancelled'}
                        className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold disabled:opacity-40"
                      >
                        Đánh dấu đã hoàn thành
                      </button>

                      <button
                        onClick={() => handleSetRunStatus(selectedRun.id, 'overdue')}
                        disabled={selectedRun.status === 'completed' || selectedRun.status === 'cancelled'}
                        className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-40"
                      >
                        Đánh dấu quá hạn
                      </button>

                      <button
                        onClick={() => handleSetRunStatus(selectedRun.id, 'cancelled')}
                        disabled={selectedRun.status === 'completed' || selectedRun.status === 'cancelled'}
                        className="rounded border border-foreground/30 hover:border-foreground px-2 py-1.5 text-center text-[10px] text-foreground/60 hover:bg-foreground/5 transition-all disabled:opacity-40"
                      >
                        Hủy checklist
                      </button>
                      <Link
                        href={`/studio/daily-reports?checklist_id=${selectedRun.id}`}
                        className="col-span-2 rounded border border-gold hover:border-gold-hover px-2 py-1.5 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block text-center"
                      >
                        📝 Tạo báo cáo từ checklist
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một đợt chạy từ danh sách để đánh dấu kiểm tra thực tế.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Template Mode Layout */
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Templates list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground/80">
                  <thead>
                    <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Tên mẫu</th>
                      <th className="py-3 px-4">Bộ phận</th>
                      <th className="py-3 px-4">Ca áp dụng</th>
                      <th className="py-3 px-4">Trạng thái</th>
                      <th className="py-3 px-4">Người phụ trách</th>
                      <th className="py-3 px-4">SOP liên quan</th>
                      <th className="py-3 px-4 text-right">Số mục kiểm</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-border/10">
                    {templates.length > 0 ? (
                      templates.map((tpl) => (
                        <tr 
                          key={tpl.id}
                          onClick={() => setSelectedTemplate(tpl)}
                          className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedTemplate?.id === tpl.id ? 'bg-gold-muted/10' : ''}`}
                        >
                          <td className="py-3.5 px-4 font-semibold text-foreground">{tpl.title}</td>
                          <td className="py-3.5 px-4 text-foreground/75">{getDepartmentLabel(tpl.department)}</td>
                          <td className="py-3.5 px-4 font-semibold text-gold-hover">{getShiftLabel(tpl.shiftType)}</td>
                          <td className="py-3.5 px-4">
                            <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(tpl.status)}`}>
                              {getTemplateStatusLabel(tpl.status)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-foreground/70">{tpl.ownerName}</td>
                          <td className="py-3.5 px-4 text-foreground/60 max-w-[130px] truncate" title={getSopTitle(tpl.relatedSopDocumentId)}>
                            {getSopTitle(tpl.relatedSopDocumentId)}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold">{tpl.items.length}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                          Chưa có mẫu checklist nào được tạo.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Template Creation Form */}
            <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
                🆕 Thiết lập mẫu checklist mới
              </h3>

              <form onSubmit={handleCreateTemplate} className="space-y-4 text-xs">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên mẫu checklist *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Checklist mở ca FOH..."
                    value={tplForm.title}
                    onChange={(e) => setTplForm({ ...tplForm, title: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.title && <span className="text-[10px] text-red-400 italic">{validationErrors.title}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mô tả mẫu</label>
                  <input
                    type="text"
                    placeholder="Mục đích hoặc các lưu ý của mẫu kiểm này..."
                    value={tplForm.description}
                    onChange={(e) => setTplForm({ ...tplForm, description: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Bộ phận *</label>
                    <select
                      value={tplForm.department}
                      onChange={(e) => setTplForm({ ...tplForm, department: e.target.value as OperationalDepartment })}
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
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Ca áp dụng *</label>
                    <select
                      value={tplForm.shiftType}
                      onChange={(e) => setTplForm({ ...tplForm, shiftType: e.target.value as OperationalShiftType })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="opening">Mở ca</option>
                      <option value="pre_service">Trước phục vụ</option>
                      <option value="lunch">Ca trưa</option>
                      <option value="dinner">Ca tối</option>
                      <option value="closing">Đóng ca</option>
                      <option value="full_day">Cả ngày</option>
                      <option value="event">Sự kiện</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái *</label>
                    <select
                      value={tplForm.status}
                      onChange={(e) => setTplForm({ ...tplForm, status: e.target.value as ChecklistTemplateStatus })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="draft">Bản nháp (Draft)</option>
                      <option value="active">Đang áp dụng (Active)</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Người phụ trách thiết lập</label>
                    <input
                      type="text"
                      placeholder="Người thiết kế quy trình..."
                      value={tplForm.ownerName}
                      onChange={(e) => setTplForm({ ...tplForm, ownerName: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">SOP liên quan</label>
                    <select
                      value={tplForm.relatedSopDocumentId}
                      onChange={(e) => setTplForm({ ...tplForm, relatedSopDocumentId: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="">-- Chọn SOP hướng dẫn --</option>
                      {sops.filter(s => s.status === 'active').map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.title} ({s.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Form checklist items creation */}
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center border-b border-gold-border/20 pb-1.5">
                    <span className="text-[10px] text-gold font-mono uppercase tracking-wider">Các hạng mục kiểm tra *</span>
                    <button
                      type="button"
                      onClick={handleAddFormItem}
                      className="text-[10px] text-gold hover:underline font-bold"
                    >
                      + Thêm hạng mục
                    </button>
                  </div>
                  
                  {validationErrors.items && <span className="text-[10px] text-red-400 italic block">{validationErrors.items}</span>}

                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {tplItems.map((item, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <span className="text-[10px] text-foreground/40 font-mono">#{idx+1}</span>
                        <input
                          type="text"
                          placeholder="Mô tả nội dung công việc cần kiểm soát..."
                          value={item.label}
                          onChange={(e) => handleTplItemChange(idx, 'label', e.target.value)}
                          className="flex-1 rounded border border-gold-border/25 bg-background/50 px-2 py-1 text-xs text-foreground focus:border-gold focus:outline-none"
                        />
                        <div className="flex items-center gap-1.5">
                          <input
                            type="checkbox"
                            checked={item.required}
                            onChange={(e) => handleTplItemChange(idx, 'required', e.target.checked)}
                            className="accent-gold cursor-pointer"
                          />
                          <span className="text-[9px] text-foreground/50 font-mono">Bắt buộc</span>
                        </div>
                        {tplItems.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFormItem(idx)}
                            className="text-red-400 hover:text-red-300 font-bold px-1"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="rounded bg-gold px-5 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
                >
                  Lưu mẫu checklist
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Template details view */}
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
                🔎 Chi tiết Mẫu
              </h3>

              {selectedTemplate ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <h4 className="text-sm font-bold text-foreground font-serif-cormorant">{selectedTemplate.title}</h4>
                    <span className="text-[9px] text-foreground/40 font-mono mt-0.5 block">Mã số mẫu: {selectedTemplate.id}</span>
                  </div>

                  <div className="grid gap-2 grid-cols-2">
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Bộ phận / Ca</span>
                      <span className="font-semibold text-foreground/80 block">
                        {getDepartmentLabel(selectedTemplate.department)} ({getShiftLabel(selectedTemplate.shiftType)})
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái mẫu</span>
                      <span className={`inline-block rounded px-1.5 py-0.2 text-[8px] font-bold ${getStatusClass(selectedTemplate.status)}`}>
                        {getTemplateStatusLabel(selectedTemplate.status)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Người quản trị</span>
                      <span className="font-semibold text-foreground/80 block">{selectedTemplate.ownerName || 'Chưa rõ'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">SOP liên quan</span>
                      <span className="font-semibold text-foreground/80 block truncate" title={getSopTitle(selectedTemplate.relatedSopDocumentId)}>
                        {getSopTitle(selectedTemplate.relatedSopDocumentId)}
                      </span>
                    </div>
                  </div>

                  {selectedTemplate.description && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Mô tả phạm vi</span>
                      <p className="text-foreground/80 leading-relaxed font-sans">{selectedTemplate.description}</p>
                    </div>
                  )}

                  {/* List items configured */}
                  <div className="border-t border-gold-border/10 pt-3 space-y-2">
                    <span className="text-[9px] text-gold font-mono uppercase tracking-wider block">Các đầu mục đã thiết lập ({selectedTemplate.items.length})</span>
                    <div className="space-y-1.5">
                      {selectedTemplate.items.map((item, index) => (
                        <div key={item.id} className="flex items-start gap-1.5 py-1 text-foreground/75 font-sans leading-relaxed">
                          <span className="text-[10px] text-gold/60 font-mono">#{index+1}</span>
                          <span>
                            {item.label}
                            {item.required && <span className="text-red-400 font-bold ml-1" title="Bắt buộc">*</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status updates */}
                  <div className="border-t border-gold-border/20 pt-4 space-y-2">
                    <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái mẫu</span>
                    <div className="grid gap-2 grid-cols-2">
                      <button
                        onClick={() => handleUpdateTemplateStatus(selectedTemplate.id, 'draft')}
                        className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                      >
                        Chuyển sang bản nháp
                      </button>
                      <button
                        onClick={() => handleUpdateTemplateStatus(selectedTemplate.id, 'active')}
                        className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                      >
                        Đánh dấu đang áp dụng
                      </button>
                      <button
                        onClick={() => handleUpdateTemplateStatus(selectedTemplate.id, 'archived')}
                        className="col-span-2 rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        Lưu trữ mẫu
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một mẫu checklist để xem chi tiết và cập nhật trạng thái áp dụng.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ChecklistsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải checklist vận hành…</p>
      </div>
    }>
      <ChecklistsPageContent />
    </Suspense>
  )
}
