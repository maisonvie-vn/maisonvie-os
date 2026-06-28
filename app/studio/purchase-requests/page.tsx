'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type PurchaseRequestDepartment =
  | "boh"
  | "foh"
  | "bar"
  | "reservation"
  | "management"
  | "finance"
  | "inventory"
  | "stewarding"
  | "housekeeping"
  | "maintenance"
  | "other"

export type PurchaseRequestPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent"

export type PurchaseRequestStatus =
  | "draft"
  | "submitted"
  | "reviewing"
  | "approved_for_ordering"
  | "rejected"
  | "cancelled"
  | "closed"
  | "archived"

export type PurchaseRequestLineStatus =
  | "open"
  | "reviewed"
  | "approved"
  | "rejected"
  | "cancelled"
  | "closed"

export type PurchaseRequestUnit =
  | "g"
  | "kg"
  | "ml"
  | "l"
  | "pcs"
  | "portion"
  | "bunch"
  | "bottle"
  | "can"
  | "pack"
  | "box"
  | "tray"
  | "bag"
  | "other"

export interface PurchaseRequest {
  id: string
  requestCode?: string | null
  requestDate: string
  requestedBy: string
  department: PurchaseRequestDepartment
  priority: PurchaseRequestPriority
  status: PurchaseRequestStatus
  neededByDate?: string | null
  preferredSupplierId?: string | null
  reason?: string | null
  internalNote?: string | null
  submittedAt?: string | null
  reviewedAt?: string | null
  closedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface PurchaseRequestLine {
  id: string
  purchaseRequestId: string
  lineOrder: number
  ingredientMasterId?: string | null
  freeTextItemName?: string | null
  requestedQuantity?: number | null
  requestedUnit?: PurchaseRequestUnit | null
  preferredSupplierId?: string | null
  purposeNote?: string | null
  urgencyNote?: string | null
  status: PurchaseRequestLineStatus
  createdAt: string
  updatedAt: string
}

interface IngredientMaster {
  id: string
  ingredientNameVi: string
  defaultUnit: string
}

interface Supplier {
  id: string
  supplierName: string
}

const INITIAL_REQUESTS: PurchaseRequest[] = [
  {
    id: 'pr-601',
    requestCode: 'PR-20260628-01',
    requestDate: '2026-06-28',
    requestedBy: 'Chef de Cuisine Antoine',
    department: 'boh',
    priority: 'high',
    status: 'reviewing',
    neededByDate: '2026-06-30',
    preferredSupplierId: 'sup-501',
    reason: 'Mua hải sản tươi sống phục vụ đoàn tiệc gala VIP tối ngày 30/06',
    internalNote: 'Đoàn tiệc VIP 30 khách đặt trước phòng riêng số 3 lầu 1',
    submittedAt: '2026-06-28 10:30',
    reviewedAt: '2026-06-28 11:30',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 11:30'
  },
  {
    id: 'pr-602',
    requestCode: 'PR-20260628-02',
    requestDate: '2026-06-28',
    requestedBy: 'Sous Chef Minh',
    department: 'boh',
    priority: 'urgent',
    status: 'submitted',
    neededByDate: '2026-06-29',
    preferredSupplierId: 'sup-502',
    reason: 'Mua khẩn cấp cà chua chín hữu cơ và lá thơm để làm xốt nền nấu súp hải sản Marseille',
    internalNote: 'Hàng cần có mặt tại kho BOH trước 6:00 sáng mai',
    submittedAt: '2026-06-28 11:00',
    createdAt: '2026-06-28 11:00',
    updatedAt: '2026-06-28 11:00'
  }
]

const INITIAL_REQUEST_LINES: PurchaseRequestLine[] = [
  {
    id: 'pr-line-1',
    purchaseRequestId: 'pr-601',
    lineOrder: 1,
    ingredientMasterId: 'ing-master-001',
    requestedQuantity: 15,
    requestedUnit: 'kg',
    preferredSupplierId: 'sup-501',
    purposeNote: 'Làm món khai vị tôm hùm đút lò phô mai Gruyere',
    status: 'open',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'pr-line-2',
    purchaseRequestId: 'pr-601',
    lineOrder: 2,
    ingredientMasterId: 'ing-master-004',
    requestedQuantity: 10,
    requestedUnit: 'kg',
    preferredSupplierId: 'sup-501',
    purposeNote: 'Nấu nước dùng súp hải sản Bouillabaisse đặc biệt',
    status: 'open',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'pr-line-3',
    purchaseRequestId: 'pr-602',
    ingredientMasterId: 'ing-master-005',
    lineOrder: 1,
    requestedQuantity: 5,
    requestedUnit: 'kg',
    preferredSupplierId: 'sup-502',
    purposeNote: 'Nấu xốt nền cà chua tươi cho đoàn tiệc súp',
    status: 'open',
    createdAt: '2026-06-28 11:00',
    updatedAt: '2026-06-28 11:00'
  },
  {
    id: 'pr-line-4',
    purchaseRequestId: 'pr-602',
    freeTextItemName: 'Lá rosemary & thyme tươi sạch',
    lineOrder: 2,
    requestedQuantity: 2,
    requestedUnit: 'bunch',
    preferredSupplierId: 'sup-502',
    purposeNote: 'Gia vị xốt và cắm trang trí đùi cừu nướng lò',
    urgencyNote: 'Hàng ngoài thị trường đang khan hiếm, kiểm tra kỹ chất lượng mùi thơm lúc giao',
    status: 'open',
    createdAt: '2026-06-28 11:00',
    updatedAt: '2026-06-28 11:00'
  }
]

function PurchaseRequestsPageContent() {
  const [requests, setRequests] = useState<PurchaseRequest[]>([])
  const [requestLines, setRequestLines] = useState<PurchaseRequestLine[]>([])
  const [masterIngredients, setMasterIngredients] = useState<IngredientMaster[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedRequest, setSelectedRequest] = useState<PurchaseRequest | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State: Purchase Request Header
  const [requestForm, setRequestForm] = useState({
    requestCode: '',
    requestDate: new Date().toISOString().split('T')[0],
    requestedBy: '',
    department: 'boh' as PurchaseRequestDepartment,
    priority: 'medium' as PurchaseRequestPriority,
    neededByDate: '',
    preferredSupplierId: '',
    reason: '',
    internalNote: ''
  })

  // Form State: Purchase Request Line
  const [lineForm, setLineForm] = useState({
    ingredientMasterId: '',
    freeTextItemName: '',
    requestedQuantity: '',
    requestedUnit: 'kg' as PurchaseRequestUnit,
    preferredSupplierId: '',
    purposeNote: '',
    urgencyNote: '',
    status: 'open' as PurchaseRequestLineStatus
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [lineErrors, setLineErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedRequests = localStorage.getItem('mvos_purchase_requests')
        const storedReqLines = localStorage.getItem('mvos_purchase_request_lines')
        const storedMaster = localStorage.getItem('mvos_ingredients')
        const storedSuppliers = localStorage.getItem('mvos_suppliers')

        let loadedRequests: PurchaseRequest[] = []
        let loadedLines: PurchaseRequestLine[] = []
        let loadedIngredients: IngredientMaster[] = []
        let loadedSuppliers: Supplier[] = []

        if (storedRequests) {
          loadedRequests = JSON.parse(storedRequests)
        } else {
          localStorage.setItem('mvos_purchase_requests', JSON.stringify(INITIAL_REQUESTS))
          loadedRequests = INITIAL_REQUESTS
        }
        setRequests(loadedRequests)

        if (storedReqLines) {
          loadedLines = JSON.parse(storedReqLines)
        } else {
          localStorage.setItem('mvos_purchase_request_lines', JSON.stringify(INITIAL_REQUEST_LINES))
          loadedLines = INITIAL_REQUEST_LINES
        }
        setRequestLines(loadedLines)

        if (storedMaster) loadedIngredients = JSON.parse(storedMaster)
        setMasterIngredients(loadedIngredients)

        if (storedSuppliers) loadedSuppliers = JSON.parse(storedSuppliers)
        setSuppliers(loadedSuppliers)

        if (loadedRequests.length > 0) {
          setSelectedRequest(loadedRequests[0])
        }

        setLoading(false)
      } catch {
        setError('Không thể tải danh sách yêu cầu mua hàng.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!requestForm.requestDate) errs.requestDate = 'Ngày yêu cầu là bắt buộc'
    if (!requestForm.requestedBy.trim()) errs.requestedBy = 'Tên người yêu cầu là bắt buộc'
    if (!requestForm.department) errs.department = 'Vui lòng chọn bộ phận yêu cầu'
    if (!requestForm.priority) errs.priority = 'Vui lòng chọn mức độ ưu tiên'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const code = requestForm.requestCode.trim() || `PR-${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}-${Date.now().toString().slice(-3)}`

    const newRequest: PurchaseRequest = {
      id: `pr-${Date.now().toString().slice(-4)}`,
      requestCode: code,
      requestDate: requestForm.requestDate,
      requestedBy: requestForm.requestedBy,
      department: requestForm.department,
      priority: requestForm.priority,
      status: 'draft',
      neededByDate: requestForm.neededByDate || null,
      preferredSupplierId: requestForm.preferredSupplierId || null,
      reason: requestForm.reason || null,
      internalNote: requestForm.internalNote || null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...requests, newRequest]
    localStorage.setItem('mvos_purchase_requests', JSON.stringify(updated))
    setRequests(updated)
    setSelectedRequest(newRequest)

    setRequestForm({
      requestCode: '',
      requestDate: new Date().toISOString().split('T')[0],
      requestedBy: '',
      department: 'boh',
      priority: 'medium',
      neededByDate: '',
      preferredSupplierId: '',
      reason: '',
      internalNote: ''
    })
  }

  const handleCreateRequestLine = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRequest) return

    const errs: Record<string, string> = {}
    if (!lineForm.ingredientMasterId && !lineForm.freeTextItemName.trim()) {
      errs.ingredientMasterId = 'Vui lòng chọn nguyên liệu chuẩn hoặc tự nhập tên hàng cần mua'
    }

    if (lineForm.requestedQuantity && isNaN(parseFloat(lineForm.requestedQuantity))) {
      errs.requestedQuantity = 'Số lượng cần mua phải là chữ số hợp lệ'
    }

    if (Object.keys(errs).length > 0) {
      setLineErrors(errs)
      return
    }

    setLineErrors({})

    const nextOrder = requestLines.filter(l => l.purchaseRequestId === selectedRequest.id).length + 1

    const newLine: PurchaseRequestLine = {
      id: `pr-line-${Date.now().toString().slice(-4)}`,
      purchaseRequestId: selectedRequest.id,
      lineOrder: nextOrder,
      ingredientMasterId: lineForm.ingredientMasterId || null,
      freeTextItemName: lineForm.freeTextItemName.trim() || null,
      requestedQuantity: lineForm.requestedQuantity ? parseFloat(lineForm.requestedQuantity) : null,
      requestedUnit: lineForm.requestedUnit || null,
      preferredSupplierId: lineForm.preferredSupplierId || null,
      purposeNote: lineForm.purposeNote || null,
      urgencyNote: lineForm.urgencyNote || null,
      status: lineForm.status,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...requestLines, newLine]
    localStorage.setItem('mvos_purchase_request_lines', JSON.stringify(updated))
    setRequestLines(updated)

    setLineForm({
      ingredientMasterId: '',
      freeTextItemName: '',
      requestedQuantity: '',
      requestedUnit: 'kg',
      preferredSupplierId: '',
      purposeNote: '',
      urgencyNote: '',
      status: 'open'
    })
  }

  const handleUpdateRequestStatus = (requestId: string, nextStatus: PurchaseRequestStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = requests.map((r) => {
      if (r.id === requestId) {
        const item = {
          ...r,
          status: nextStatus,
          updatedAt: nowStr,
          submittedAt: nextStatus === 'submitted' ? nowStr : r.submittedAt,
          reviewedAt: nextStatus === 'reviewing' ? nowStr : r.reviewedAt,
          closedAt: nextStatus === 'closed' ? nowStr : r.closedAt
        }
        if (selectedRequest?.id === requestId) setSelectedRequest(item)
        return item
      }
      return r
    })
    localStorage.setItem('mvos_purchase_requests', JSON.stringify(updated))
    setRequests(updated)
  }

  const handleUpdateLineStatus = (lineId: string, nextStatus: PurchaseRequestLineStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = requestLines.map((l) => {
      if (l.id === lineId) {
        return { ...l, status: nextStatus, updatedAt: nowStr }
      }
      return l
    })
    localStorage.setItem('mvos_purchase_request_lines', JSON.stringify(updated))
    setRequestLines(updated)
  }

  const getDepartmentLabel = (d: PurchaseRequestDepartment) => {
    switch (d) {
      case 'boh': return 'Bếp BOH'
      case 'foh': return 'Tiền sảnh FOH'
      case 'bar': return 'Quầy Bar'
      case 'reservation': return 'Đặt bàn'
      case 'management': return 'Ban quản lý'
      case 'finance': return 'Tài chính'
      case 'inventory': return 'Kho vận'
      case 'stewarding': return 'Tạp vụ/Đĩa'
      case 'housekeeping': return 'Buồng phòng'
      case 'maintenance': return 'Bảo trì kỹ thuật'
      default: return 'Khác'
    }
  }

  const getPriorityLabel = (p: PurchaseRequestPriority) => {
    switch (p) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'urgent': return 'Yêu cầu GẤP'
      default: return p
    }
  }

  const getPriorityClass = (p: PurchaseRequestPriority) => {
    switch (p) {
      case 'urgent': return 'text-red-400 font-bold border border-red-500/30 px-1 rounded bg-red-500/5'
      case 'high': return 'text-gold font-bold'
      case 'medium': return 'text-foreground/80'
      default: return 'text-foreground/50'
    }
  }

  const getStatusLabel = (s: PurchaseRequestStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'submitted': return 'Đã gửi'
      case 'reviewing': return 'Đang xem xét'
      case 'approved_for_ordering': return 'Đã duyệt để đặt hàng'
      case 'rejected': return 'Bị từ chối'
      case 'cancelled': return 'Đã hủy'
      case 'closed': return 'Đã đóng'
      case 'archived': return 'Lưu trữ'
      default: return s
    }
  }

  const getStatusClass = (s: PurchaseRequestStatus) => {
    switch (s) {
      case 'approved_for_ordering': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'submitted': return 'bg-blue-500/10 border border-blue-500/25 text-blue-400 font-bold'
      case 'reviewing': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 font-bold'
      case 'rejected': return 'bg-red-500/10 border border-red-500/25 text-red-400'
      case 'cancelled': return 'bg-foreground/5 border border-foreground/10 text-foreground/40 line-through'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getLineStatusLabel = (s: PurchaseRequestLineStatus) => {
    switch (s) {
      case 'open': return 'Mới tạo'
      case 'reviewed': return 'Đã xem'
      case 'approved': return 'Đã duyệt'
      case 'rejected': return 'Từ chối'
      case 'cancelled': return 'Đã hủy'
      case 'closed': return 'Đã đóng'
      default: return s
    }
  }

  const getSupplierName = (id: string | null | undefined) => {
    if (!id) return 'Chưa đề xuất'
    const found = suppliers.find(s => s.id === id)
    return found ? found.supplierName : id
  }

  const getIngredientName = (id: string | null | undefined) => {
    if (!id) return null
    const found = masterIngredients.find(m => m.id === id)
    return found ? found.ingredientNameVi : id
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải yêu cầu mua hàng…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải danh sách yêu cầu mua hàng.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Real data metrics
  const totalCount = requests.length
  const submittedCount = requests.filter(r => r.status === 'submitted').length
  const reviewingCount = requests.filter(r => r.status === 'reviewing').length
  const approvedCount = requests.filter(r => r.status === 'approved_for_ordering').length
  const urgentCount = requests.filter(r => r.priority === 'urgent').length

  const selectedRequestLines = selectedRequest
    ? requestLines.filter(line => line.purchaseRequestId === selectedRequest.id)
    : []

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          📋 Yêu cầu mua hàng (Purchase Request)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Ghi nhận nhu cầu mua nguyên liệu và vật tư nội bộ trước khi chuyển sang đặt hàng, nhận hàng và kiểm soát chi phí.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng yêu cầu</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã gửi</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{submittedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang xem xét</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{reviewingCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã duyệt mua</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{approvedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Yêu cầu GẤP</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{urgentCount}</span>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Purchase Requests List & Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Mã yêu cầu</th>
                    <th className="py-3 px-4">Ngày yêu cầu</th>
                    <th className="py-3 px-4">Người yêu cầu</th>
                    <th className="py-3 px-4">Bộ phận</th>
                    <th className="py-3 px-4">Mức ưu tiên</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4">Cần trước ngày</th>
                    <th className="py-3 px-4">Nhà cung cấp đề xuất</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {requests.length > 0 ? (
                    requests.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRequest(r)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedRequest?.id === r.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{r.requestCode || r.id}</td>
                        <td className="py-3.5 px-4 font-mono">{r.requestDate}</td>
                        <td className="py-3.5 px-4 font-bold text-foreground">{r.requestedBy}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">{getDepartmentLabel(r.department)}</td>
                        <td className="py-3.5 px-4 text-[10px]">
                          <span className={getPriorityClass(r.priority)}>{getPriorityLabel(r.priority)}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(r.status)}`}>
                            {getStatusLabel(r.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-foreground/60">{r.neededByDate || '-'}</td>
                        <td className="py-3.5 px-4 text-gold-hover font-semibold max-w-[120px] truncate" title={getSupplierName(r.preferredSupplierId)}>
                          {getSupplierName(r.preferredSupplierId)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có yêu cầu mua hàng nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Purchase Request Header */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo yêu cầu mua hàng mới (Header)
            </h3>

            <form onSubmit={handleCreateRequest} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên người yêu cầu *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Chef de Cuisine Antoine..."
                    value={requestForm.requestedBy}
                    onChange={(e) => setRequestForm({ ...requestForm, requestedBy: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.requestedBy && <span className="text-[10px] text-red-400 italic">{validationErrors.requestedBy}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã yêu cầu (Tự sinh nếu trống)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: PR-20260628-01..."
                    value={requestForm.requestCode}
                    onChange={(e) => setRequestForm({ ...requestForm, requestCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Bộ phận yêu cầu *</label>
                  <select
                    value={requestForm.department}
                    onChange={(e) => setRequestForm({ ...requestForm, department: e.target.value as PurchaseRequestDepartment })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="boh">Bếp BOH (Back of House)</option>
                    <option value="foh">Tiền sảnh FOH (Front of House)</option>
                    <option value="bar">Quầy Bar</option>
                    <option value="reservation">Đặt bàn (Reservation)</option>
                    <option value="management">Ban quản lý (Management)</option>
                    <option value="stewarding">Tạp vụ / Stewarding</option>
                    <option value="maintenance">Bảo trì kỹ thuật</option>
                    <option value="other">Các bộ phận khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mức độ ưu tiên *</label>
                  <select
                    value={requestForm.priority}
                    onChange={(e) => setRequestForm({ ...requestForm, priority: e.target.value as PurchaseRequestPriority })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="low">Thấp (Low)</option>
                    <option value="medium">Trung bình (Medium)</option>
                    <option value="high">Cao (High)</option>
                    <option value="urgent">GẤP (Urgent)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày yêu cầu *</label>
                  <input
                    type="date"
                    value={requestForm.requestDate}
                    onChange={(e) => setRequestForm({ ...requestForm, requestDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.requestDate && <span className="text-[10px] text-red-400 italic">{validationErrors.requestDate}</span>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Nhà cung cấp đề xuất ưu tiên</label>
                  <select
                    value={requestForm.preferredSupplierId}
                    onChange={(e) => setRequestForm({ ...requestForm, preferredSupplierId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chưa chỉ định nhà cung cấp --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.supplierName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Hạn chót cần hàng trước ngày</label>
                  <input
                    type="date"
                    value={requestForm.neededByDate}
                    onChange={(e) => setRequestForm({ ...requestForm, neededByDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Lý do yêu cầu mua hàng</label>
                <textarea
                  rows={2}
                  placeholder="Ghi rõ lý do cần mua, sự kiện áp dụng hoặc chuẩn bị cho nhóm thực đơn nào..."
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Ghi chú nội bộ</label>
                <input
                  type="text"
                  placeholder="Các chỉ dẫn đặc biệt cho bộ phận mua hàng..."
                  value={requestForm.internalNote}
                  onChange={(e) => setRequestForm({ ...requestForm, internalNote: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Khởi tạo yêu cầu
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & lines */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết yêu cầu mua hàng
            </h3>

            {selectedRequest ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedRequest.requestCode || selectedRequest.id}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Người yêu cầu: {selectedRequest.requestedBy}</span>
                    <span>Bộ phận: {getDepartmentLabel(selectedRequest.department)}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ngày yêu cầu</span>
                    <span className="font-bold text-foreground/80 block font-mono">{selectedRequest.requestDate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Cần trước ngày</span>
                    <span className="font-bold text-gold block font-mono">{selectedRequest.neededByDate || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái duyệt</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(selectedRequest.status)}`}>
                      {getStatusLabel(selectedRequest.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Độ khẩn cấp</span>
                    <span className={`font-bold block ${getPriorityClass(selectedRequest.priority)}`}>
                      {getPriorityLabel(selectedRequest.priority)}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-[9px] text-foreground/50 font-mono block">Nhà cung cấp đề xuất</span>
                    <span className="font-bold text-gold-hover block">{getSupplierName(selectedRequest.preferredSupplierId)}</span>
                  </div>
                </div>

                {selectedRequest.reason && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Lý do mua hàng</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedRequest.reason}</p>
                  </div>
                )}

                {selectedRequest.internalNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú nội bộ</span>
                    <p className="text-foreground/80 leading-relaxed font-sans italic">&ldquo;{selectedRequest.internalNote}&rdquo;</p>
                  </div>
                )}

                {/* Status timelines */}
                <div className="grid gap-1 grid-cols-3 text-[8px] text-foreground/40 font-mono border-t border-gold-border/10 pt-2">
                  <div>Đã gửi: {selectedRequest.submittedAt || '-'}</div>
                  <div>Đã xem: {selectedRequest.reviewedAt || '-'}</div>
                  <div>Đã đóng: {selectedRequest.closedAt || '-'}</div>
                </div>

                {/* Lines Section */}
                <div className="border-t border-gold-border/20 pt-4 space-y-3">
                  <span className="text-[10px] text-gold font-serif-cormorant font-bold uppercase tracking-wider block">🥗 Chi tiết danh mục mặt hàng yêu cầu</span>
                  
                  {selectedRequestLines.length > 0 ? (
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {selectedRequestLines.map((line) => (
                        <div key={line.id} className="p-2.5 bg-background/40 rounded border border-gold-border/10 space-y-1.5 text-[10px]">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-foreground">
                                {line.lineOrder}. {line.ingredientMasterId ? getIngredientName(line.ingredientMasterId) : line.freeTextItemName}
                              </span>
                              {line.ingredientMasterId && line.freeTextItemName && (
                                <span className="text-[8px] text-foreground/50 block italic">({line.freeTextItemName})</span>
                              )}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-gold">
                              {line.requestedQuantity !== null ? line.requestedQuantity : '-'} {line.requestedUnit || ''}
                            </span>
                          </div>

                          {line.purposeNote && (
                            <div className="text-[9px] text-foreground/75">
                              <span className="text-foreground/40">Mục đích:</span> {line.purposeNote}
                            </div>
                          )}

                          {line.urgencyNote && (
                            <div className="text-[8px] text-red-400 font-semibold italic">
                              ⚠️ Ghi chú khẩn: {line.urgencyNote}
                            </div>
                          )}

                          <div className="flex justify-between items-center pt-1 border-t border-gold-border/5">
                            <div className="flex flex-col gap-0.5 text-left">
                              <span className="text-[8px] text-gold-hover font-semibold">Nhà cung ứng: {getSupplierName(line.preferredSupplierId)}</span>
                              <span className="text-[8px] text-foreground/45 italic">Trạng thái: {getLineStatusLabel(line.status)}</span>
                            </div>
                            
                            {/* Action group for lines */}
                            <div className="flex gap-1">
                              <button
                                type="button"
                                onClick={() => handleUpdateLineStatus(line.id, 'approved')}
                                className="rounded bg-green-500/10 hover:bg-green-500/25 border border-green-500/20 px-1 py-0.5 text-[8px] text-green-400 font-bold"
                              >
                                Duyệt
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateLineStatus(line.id, 'rejected')}
                                className="rounded bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 px-1 py-0.5 text-[8px] text-red-400"
                              >
                                Từ chối
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateLineStatus(line.id, 'closed')}
                                className="rounded bg-foreground/5 hover:bg-foreground/10 border border-foreground/10 px-1 py-0.5 text-[8px] text-foreground/60"
                              >
                                Đóng
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[9px] text-foreground/45 italic text-center py-4">Chưa có dòng mặt hàng nào trong yêu cầu này.</p>
                  )}

                  {/* Add Request Line Form */}
                  <form onSubmit={handleCreateRequestLine} className="bg-gold-muted/5 border border-gold-border/10 p-3 rounded space-y-2 mt-2">
                    <span className="text-[9px] text-gold font-bold block">➕ Thêm dòng mặt hàng yêu cầu</span>
                    
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Chọn nguyên liệu chuẩn</label>
                      <select
                        value={lineForm.ingredientMasterId}
                        onChange={(e) => setLineForm({ ...lineForm, ingredientMasterId: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      >
                        <option value="">-- Tự nhập tên bên dưới / Chọn nguyên liệu chuẩn --</option>
                        {masterIngredients.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.ingredientNameVi} ({m.defaultUnit})
                          </option>
                        ))}
                      </select>
                      {lineErrors.ingredientMasterId && <span className="text-[8px] text-red-400 italic">{lineErrors.ingredientMasterId}</span>}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Tên mặt hàng tự nhập (nếu chưa có trong danh mục)</label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Lá rosemary khô nhập Pháp..."
                        value={lineForm.freeTextItemName}
                        onChange={(e) => setLineForm({ ...lineForm, freeTextItemName: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-2 grid-cols-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Số lượng cần mua *</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="Ví dụ: 10..."
                          value={lineForm.requestedQuantity}
                          onChange={(e) => setLineForm({ ...lineForm, requestedQuantity: e.target.value })}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none font-mono"
                        />
                        {lineErrors.requestedQuantity && <span className="text-[8px] text-red-400 italic">{lineErrors.requestedQuantity}</span>}
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Đơn vị tính</label>
                        <select
                          value={lineForm.requestedUnit}
                          onChange={(e) => setLineForm({ ...lineForm, requestedUnit: e.target.value as PurchaseRequestUnit })}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="l">lít</option>
                          <option value="ml">ml</option>
                          <option value="pcs">cái / pcs</option>
                          <option value="portion">phần ăn</option>
                          <option value="bunch">bó</option>
                          <option value="bottle">chai</option>
                          <option value="can">lon</option>
                          <option value="box">hộp</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Đề xuất nhà cung cấp</label>
                      <select
                        value={lineForm.preferredSupplierId}
                        onChange={(e) => setLineForm({ ...lineForm, preferredSupplierId: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      >
                        <option value="">-- Tự động / Chọn nhà cung cấp --</option>
                        {suppliers.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.supplierName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Mục đích sử dụng chi tiết</label>
                      <input
                        type="text"
                        placeholder="Ghi chú sử dụng món tiệc hoặc bếp..."
                        value={lineForm.purposeNote}
                        onChange={(e) => setLineForm({ ...lineForm, purposeNote: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Ghi chú khẩn cấp (nếu có)</label>
                      <input
                        type="text"
                        placeholder="Nhanh giao trong ca sáng..."
                        value={lineForm.urgencyNote}
                        onChange={(e) => setLineForm({ ...lineForm, urgencyNote: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded bg-gold/90 hover:bg-gold text-background py-1 text-[10px] font-bold transition-all"
                    >
                      Thêm dòng mặt hàng
                    </button>
                  </form>
                </div>

                {/* State Actions for Purchase Request Header */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái yêu cầu</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'submitted')}
                      className="rounded border border-blue-500/40 hover:border-blue-500 px-2 py-1.5 text-center text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all font-semibold"
                    >
                      Gửi yêu cầu duyệt
                    </button>

                    <button
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'reviewing')}
                      className="rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-center text-[10px] text-yellow-500 hover:bg-yellow-500/10 transition-all font-semibold"
                    >
                      Đưa vào xem xét
                    </button>

                    <button
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'approved_for_ordering')}
                      className="col-span-2 rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Duyệt mua (Approved for Ordering)
                    </button>

                    <button
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'rejected')}
                      className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                    >
                      Từ chối yêu cầu
                    </button>

                    <button
                      onClick={() => handleUpdateRequestStatus(selectedRequest.id, 'cancelled')}
                      className="rounded border border-foreground/30 hover:border-foreground/60 px-2 py-1.5 text-center text-[10px] text-foreground/60 hover:bg-foreground/5 transition-all font-semibold"
                    >
                      Hủy yêu cầu
                    </button>
                  </div>
                </div>

                <div className="border-t border-gold-border/20 pt-4 flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Liên kết module liên quan</span>
                  <div className="flex gap-2">
                    <Link
                      href="/studio/suppliers"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      🤝 Xem nhà cung cấp
                    </Link>
                    <Link
                      href="/studio/ingredients"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      🥕 Xem nguyên liệu
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một yêu cầu mua hàng từ danh sách bên trái để xem chi tiết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PurchaseRequestsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải yêu cầu mua hàng…</p>
      </div>
    }>
      <PurchaseRequestsPageContent />
    </Suspense>
  )
}
