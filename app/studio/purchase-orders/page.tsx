'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type PurchaseOrderDepartment =
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

export type PurchaseOrderPriority =
  | "low"
  | "medium"
  | "high"
  | "urgent"

export type PurchaseOrderStatus =
  | "draft"
  | "sent"
  | "supplier_confirmed"
  | "partially_received"
  | "received"
  | "cancelled"
  | "closed"
  | "archived"

export type PurchaseOrderLineStatus =
  | "open"
  | "ordered"
  | "supplier_confirmed"
  | "partially_received"
  | "received"
  | "cancelled"
  | "closed"

export type PurchaseOrderUnit =
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

export interface PurchaseOrder {
  id: string
  purchaseOrderCode?: string | null
  purchaseRequestId?: string | null
  supplierId: string
  orderDate: string
  expectedDeliveryDate?: string | null
  orderedBy: string
  department: PurchaseOrderDepartment
  priority: PurchaseOrderPriority
  status: PurchaseOrderStatus
  deliveryAddressNote?: string | null
  deliveryTimeNote?: string | null
  qualityNote?: string | null
  internalNote?: string | null
  sentAt?: string | null
  confirmedAt?: string | null
  closedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface PurchaseOrderLine {
  id: string
  purchaseOrderId: string
  purchaseRequestLineId?: string | null
  ingredientMasterId?: string | null
  lineOrder: number
  itemName?: string | null
  orderedQuantity?: number | null
  orderedUnit?: PurchaseOrderUnit | null
  supplierItemNote?: string | null
  qualityRequirementNote?: string | null
  deliveryNote?: string | null
  status: PurchaseOrderLineStatus
  createdAt: string
  updatedAt: string
}

interface PurchaseRequest {
  id: string
  requestCode?: string | null
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

const INITIAL_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-701',
    purchaseOrderCode: 'PO-20260628-01',
    purchaseRequestId: 'pr-601',
    supplierId: 'sup-501',
    orderDate: '2026-06-28',
    expectedDeliveryDate: '2026-06-30',
    orderedBy: 'Chef de Cuisine Antoine',
    department: 'boh',
    priority: 'high',
    status: 'supplier_confirmed',
    deliveryAddressNote: 'Cổng sau nhà hàng Maison Vie, 28 Tăng Bạt Hổ, Hai Bà Trưng, Hà Nội',
    deliveryTimeNote: 'Giao đúng 5:30 sáng, chuẩn bị xe đông lạnh hạ hàng thẳng vào bếp BOH',
    qualityNote: 'Hải sản sống đạt chuẩn sục oxy sả tươi nguyên vẹn không đứt râu',
    internalNote: 'Mua phục vụ đoàn gala tiệc VIP tối ngày 30/06',
    sentAt: '2026-06-28 10:45',
    confirmedAt: '2026-06-28 11:15',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 11:15'
  }
]

const INITIAL_ORDER_LINES: PurchaseOrderLine[] = [
  {
    id: 'po-line-1',
    purchaseOrderId: 'po-701',
    purchaseRequestLineId: 'pr-line-1',
    ingredientMasterId: 'ing-master-001',
    lineOrder: 1,
    itemName: 'Tôm hùm nước ngọt sống bọc đá Na Uy',
    orderedQuantity: 15,
    orderedUnit: 'kg',
    supplierItemNote: 'Giao tôm hùm sống Na Uy loại 1.2kg - 1.5kg/con',
    qualityRequirementNote: 'Tôm sống nguyên vẹn không dập, thịt săn chắc',
    deliveryNote: 'Giao hàng bọc đá bảo quan lạnh khô',
    status: 'supplier_confirmed',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'po-line-2',
    purchaseOrderId: 'po-701',
    purchaseRequestLineId: 'pr-line-2',
    ingredientMasterId: 'ing-master-004',
    lineOrder: 2,
    itemName: 'Nghêu tươi biển sả sạch cát sống',
    orderedQuantity: 10,
    orderedUnit: 'kg',
    supplierItemNote: 'Nghêu vỏ sạch láng cát sống sục oxy vỏ không nứt vỡ',
    qualityRequirementNote: 'Nghêu sống sục oxy sạch cát 100%',
    deliveryNote: 'Giao túi lưới thông hơi',
    status: 'supplier_confirmed',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  }
]

function PurchaseOrdersPageContent() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([])
  const [orderLines, setOrderLines] = useState<PurchaseOrderLine[]>([])
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>([])
  const [masterIngredients, setMasterIngredients] = useState<IngredientMaster[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State: Purchase Order Header
  const [orderForm, setOrderForm] = useState({
    purchaseOrderCode: '',
    purchaseRequestId: '',
    supplierId: '',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    orderedBy: '',
    department: 'boh' as PurchaseOrderDepartment,
    priority: 'medium' as PurchaseOrderPriority,
    deliveryAddressNote: 'Cửa sau nhà hàng Maison Vie, 28 Tăng Bạt Hổ, Hà Nội',
    deliveryTimeNote: 'Giao trước 6:00 sáng',
    qualityNote: '',
    internalNote: ''
  })

  // Form State: Purchase Order Line
  const [lineForm, setLineForm] = useState({
    purchaseRequestLineId: '',
    ingredientMasterId: '',
    itemName: '',
    orderedQuantity: '',
    orderedUnit: 'kg' as PurchaseOrderUnit,
    supplierItemNote: '',
    qualityRequirementNote: '',
    deliveryNote: '',
    status: 'open' as PurchaseOrderLineStatus
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [lineErrors, setLineErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedOrders = localStorage.getItem('mvos_purchase_orders')
        const storedOrderLines = localStorage.getItem('mvos_purchase_order_lines')
        const storedRequests = localStorage.getItem('mvos_purchase_requests')
        const storedMaster = localStorage.getItem('mvos_ingredients')
        const storedSuppliers = localStorage.getItem('mvos_suppliers')

        let loadedOrders: PurchaseOrder[] = []
        let loadedLines: PurchaseOrderLine[] = []
        let loadedRequests: PurchaseRequest[] = []
        let loadedIngredients: IngredientMaster[] = []
        let loadedSuppliers: Supplier[] = []

        if (storedOrders) {
          loadedOrders = JSON.parse(storedOrders)
        } else {
          localStorage.setItem('mvos_purchase_orders', JSON.stringify(INITIAL_ORDERS))
          loadedOrders = INITIAL_ORDERS
        }
        setOrders(loadedOrders)

        if (storedOrderLines) {
          loadedLines = JSON.parse(storedOrderLines)
        } else {
          localStorage.setItem('mvos_purchase_order_lines', JSON.stringify(INITIAL_ORDER_LINES))
          loadedLines = INITIAL_ORDER_LINES
        }
        setOrderLines(loadedLines)

        if (storedRequests) loadedRequests = JSON.parse(storedRequests)
        setPurchaseRequests(loadedRequests)

        if (storedMaster) loadedIngredients = JSON.parse(storedMaster)
        setMasterIngredients(loadedIngredients)

        if (storedSuppliers) loadedSuppliers = JSON.parse(storedSuppliers)
        setSuppliers(loadedSuppliers)

        if (loadedOrders.length > 0) {
          setSelectedOrder(loadedOrders[0])
        }

        setLoading(false)
      } catch {
        setError('Không thể tải danh sách đơn đặt hàng.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!orderForm.supplierId) errs.supplierId = 'Vui lòng chọn nhà cung cấp nhận đơn'
    if (!orderForm.orderDate) errs.orderDate = 'Ngày đặt hàng là bắt buộc'
    if (!orderForm.orderedBy.trim()) errs.orderedBy = 'Tên người đặt hàng là bắt buộc'
    if (!orderForm.department) errs.department = 'Vui lòng chọn bộ phận đặt hàng'
    if (!orderForm.priority) errs.priority = 'Vui lòng chọn mức độ ưu tiên'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const code = orderForm.purchaseOrderCode.trim() || `PO-${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}-${Date.now().toString().slice(-3)}`

    const newOrder: PurchaseOrder = {
      id: `po-${Date.now().toString().slice(-4)}`,
      purchaseOrderCode: code,
      purchaseRequestId: orderForm.purchaseRequestId || null,
      supplierId: orderForm.supplierId,
      orderDate: orderForm.orderDate,
      expectedDeliveryDate: orderForm.expectedDeliveryDate || null,
      orderedBy: orderForm.orderedBy,
      department: orderForm.department,
      priority: orderForm.priority,
      status: 'draft',
      deliveryAddressNote: orderForm.deliveryAddressNote || null,
      deliveryTimeNote: orderForm.deliveryTimeNote || null,
      qualityNote: orderForm.qualityNote || null,
      internalNote: orderForm.internalNote || null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...orders, newOrder]
    localStorage.setItem('mvos_purchase_orders', JSON.stringify(updated))
    setOrders(updated)
    setSelectedOrder(newOrder)

    setOrderForm({
      purchaseOrderCode: '',
      purchaseRequestId: '',
      supplierId: '',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: '',
      orderedBy: '',
      department: 'boh',
      priority: 'medium',
      deliveryAddressNote: 'Cửa sau nhà hàng Maison Vie, 28 Tăng Bạt Hổ, Hà Nội',
      deliveryTimeNote: 'Giao trước 6:00 sáng',
      qualityNote: '',
      internalNote: ''
    })
  }

  const handleCreateOrderLine = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedOrder) return

    const errs: Record<string, string> = {}
    if (!lineForm.ingredientMasterId && !lineForm.itemName.trim()) {
      errs.ingredientMasterId = 'Vui lòng chọn nguyên liệu chuẩn hoặc tự nhập tên mặt hàng đặt mua'
    }

    if (lineForm.orderedQuantity && isNaN(parseFloat(lineForm.orderedQuantity))) {
      errs.orderedQuantity = 'Số lượng đặt hàng phải là chữ số hợp lệ'
    }

    if (Object.keys(errs).length > 0) {
      setLineErrors(errs)
      return
    }

    setLineErrors({})

    const nextOrder = orderLines.filter(l => l.purchaseOrderId === selectedOrder.id).length + 1

    const newLine: PurchaseOrderLine = {
      id: `po-line-${Date.now().toString().slice(-4)}`,
      purchaseOrderId: selectedOrder.id,
      purchaseRequestLineId: lineForm.purchaseRequestLineId || null,
      ingredientMasterId: lineForm.ingredientMasterId || null,
      lineOrder: nextOrder,
      itemName: lineForm.itemName.trim() || null,
      orderedQuantity: lineForm.orderedQuantity ? parseFloat(lineForm.orderedQuantity) : null,
      orderedUnit: lineForm.orderedUnit || null,
      supplierItemNote: lineForm.supplierItemNote || null,
      qualityRequirementNote: lineForm.qualityRequirementNote || null,
      deliveryNote: lineForm.deliveryNote || null,
      status: lineForm.status,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...orderLines, newLine]
    localStorage.setItem('mvos_purchase_order_lines', JSON.stringify(updated))
    setOrderLines(updated)

    setLineForm({
      purchaseRequestLineId: '',
      ingredientMasterId: '',
      itemName: '',
      orderedQuantity: '',
      orderedUnit: 'kg',
      supplierItemNote: '',
      qualityRequirementNote: '',
      deliveryNote: '',
      status: 'open'
    })
  }

  const handleUpdateOrderStatus = (orderId: string, nextStatus: PurchaseOrderStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = orders.map((o) => {
      if (o.id === orderId) {
        const item = {
          ...o,
          status: nextStatus,
          updatedAt: nowStr,
          sentAt: nextStatus === 'sent' ? nowStr : o.sentAt,
          confirmedAt: nextStatus === 'supplier_confirmed' ? nowStr : o.confirmedAt,
          closedAt: nextStatus === 'closed' ? nowStr : o.closedAt
        }
        if (selectedOrder?.id === orderId) setSelectedOrder(item)
        return item
      }
      return o
    })
    localStorage.setItem('mvos_purchase_orders', JSON.stringify(updated))
    setOrders(updated)
  }

  const handleUpdateLineStatus = (lineId: string, nextStatus: PurchaseOrderLineStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = orderLines.map((l) => {
      if (l.id === lineId) {
        return { ...l, status: nextStatus, updatedAt: nowStr }
      }
      return l
    })
    localStorage.setItem('mvos_purchase_order_lines', JSON.stringify(updated))
    setOrderLines(updated)
  }

  const getDepartmentLabel = (d: PurchaseOrderDepartment) => {
    switch (d) {
      case 'boh': return 'Bếp BOH'
      case 'foh': return 'Tiền sảnh FOH'
      case 'bar': return 'Quầy Bar'
      case 'reservation': return 'Đặt bàn'
      case 'management': return 'Ban quản lý'
      case 'finance': return 'Tài chính'
      case 'inventory': return 'Kho vận'
      case 'stewarding': return 'Tạp vụ/Đĩa'
      default: return 'Khác'
    }
  }

  const getPriorityLabel = (p: PurchaseOrderPriority) => {
    switch (p) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'urgent': return 'Đơn đặt GẤP'
      default: return p
    }
  }

  const getPriorityClass = (p: PurchaseOrderPriority) => {
    switch (p) {
      case 'urgent': return 'text-red-400 font-bold border border-red-500/30 px-1.5 py-0.5 rounded bg-red-500/5'
      case 'high': return 'text-gold font-bold'
      case 'medium': return 'text-foreground/80'
      default: return 'text-foreground/50'
    }
  }

  const getStatusLabel = (s: PurchaseOrderStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'sent': return 'Đã gửi NCC'
      case 'supplier_confirmed': return 'NCC đã xác nhận'
      case 'partially_received': return 'Nhận một phần'
      case 'received': return 'Đã nhận đủ'
      case 'cancelled': return 'Đã hủy'
      case 'closed': return 'Đã đóng'
      case 'archived': return 'Lưu trữ'
      default: return s
    }
  }

  const getStatusClass = (s: PurchaseOrderStatus) => {
    switch (s) {
      case 'received': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'sent': return 'bg-blue-500/10 border border-blue-500/25 text-blue-400 font-bold'
      case 'supplier_confirmed': return 'bg-purple-500/10 border border-purple-500/25 text-purple-400 font-bold'
      case 'partially_received': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'cancelled': return 'bg-foreground/5 border border-foreground/10 text-foreground/40 line-through'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getLineStatusLabel = (s: PurchaseOrderLineStatus) => {
    switch (s) {
      case 'open': return 'Mới tạo'
      case 'ordered': return 'Đã đặt'
      case 'supplier_confirmed': return 'NCC đã xác nhận'
      case 'partially_received': return 'Nhận một phần'
      case 'received': return 'Đã nhận'
      case 'cancelled': return 'Đã hủy'
      case 'closed': return 'Đã đóng'
      default: return s
    }
  }

  const getSupplierName = (id: string | null | undefined) => {
    if (!id) return 'Chưa gán'
    const found = suppliers.find(s => s.id === id)
    return found ? found.supplierName : id
  }

  const getIngredientName = (id: string | null | undefined) => {
    if (!id) return null
    const found = masterIngredients.find(m => m.id === id)
    return found ? found.ingredientNameVi : id
  }

  const getRequestCode = (id: string | null | undefined) => {
    if (!id) return 'Mua sắm trực tiếp'
    const found = purchaseRequests.find(r => r.id === id)
    return found ? found.requestCode || id : id
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải đơn đặt hàng…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải danh sách đơn đặt hàng.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Real data metrics
  const totalCount = orders.length
  const draftCount = orders.filter(o => o.status === 'draft').length
  const sentCount = orders.filter(o => o.status === 'sent').length
  const confirmedCount = orders.filter(o => o.status === 'supplier_confirmed').length
  const urgentCount = orders.filter(o => o.priority === 'urgent').length

  const selectedOrderLines = selectedOrder
    ? orderLines.filter(line => line.purchaseOrderId === selectedOrder.id)
    : []

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          📦 Đơn đặt hàng (Purchase Order)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Quản lý đơn đặt hàng gửi nhà cung cấp trước khi nhận hàng, kiểm kho, hóa đơn và giá vốn được triển khai.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng đơn đặt</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Bản nháp</span>
          <span className="text-2xl font-serif-cormorant font-bold text-foreground/50 mt-1 block">{draftCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã gửi NCC</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{sentCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Chờ xác nhận</span>
          <span className="text-2xl font-serif-cormorant font-bold text-purple-400 mt-1 block">{confirmedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đơn GẤP</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{urgentCount}</span>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Purchase Orders List & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Mã đơn hàng</th>
                    <th className="py-3 px-4">Ngày đặt</th>
                    <th className="py-3 px-4">Nhà cung cấp</th>
                    <th className="py-3 px-4">Người đặt</th>
                    <th className="py-3 px-4">Bộ phận</th>
                    <th className="py-3 px-4">Mức ưu tiên</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4">Dự kiến giao</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {orders.length > 0 ? (
                    orders.map((o) => (
                      <tr
                        key={o.id}
                        onClick={() => setSelectedOrder(o)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedOrder?.id === o.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{o.purchaseOrderCode || o.id}</td>
                        <td className="py-3.5 px-4 font-mono">{o.orderDate}</td>
                        <td className="py-3.5 px-4 font-bold text-foreground">{getSupplierName(o.supplierId)}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">{o.orderedBy}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/70">{getDepartmentLabel(o.department)}</td>
                        <td className="py-3.5 px-4 text-[10px]">
                          <span className={getPriorityClass(o.priority)}>{getPriorityLabel(o.priority)}</span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(o.status)}`}>
                            {getStatusLabel(o.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-foreground/60">{o.expectedDeliveryDate || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có đơn đặt hàng nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Purchase Order Header */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo đơn đặt hàng mới (Header)
            </h3>

            <form onSubmit={handleCreateOrder} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Nhà cung cấp nhận đơn *</label>
                  <select
                    value={orderForm.supplierId}
                    onChange={(e) => setOrderForm({ ...orderForm, supplierId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn nhà cung cấp --</option>
                    {suppliers.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.supplierName}
                      </option>
                    ))}
                  </select>
                  {validationErrors.supplierId && <span className="text-[10px] text-red-400 italic">{validationErrors.supplierId}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã đơn đặt hàng (Tự sinh nếu trống)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: PO-20260628-01..."
                    value={orderForm.purchaseOrderCode}
                    onChange={(e) => setOrderForm({ ...orderForm, purchaseOrderCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Yêu cầu mua liên quan (PR)</label>
                  <select
                    value={orderForm.purchaseRequestId}
                    onChange={(e) => setOrderForm({ ...orderForm, purchaseRequestId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Mua sắm tự do trực tiếp --</option>
                    {purchaseRequests.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.requestCode || r.id}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Người đặt hàng *</label>
                  <input
                    type="text"
                    placeholder="Chef de Cuisine Antoine..."
                    value={orderForm.orderedBy}
                    onChange={(e) => setOrderForm({ ...orderForm, orderedBy: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.orderedBy && <span className="text-[10px] text-red-400 italic">{validationErrors.orderedBy}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Bộ phận đặt hàng *</label>
                  <select
                    value={orderForm.department}
                    onChange={(e) => setOrderForm({ ...orderForm, department: e.target.value as PurchaseOrderDepartment })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="boh">Bếp BOH (Back of House)</option>
                    <option value="foh">Tiền sảnh FOH (Front of House)</option>
                    <option value="bar">Quầy Bar</option>
                    <option value="reservation">Đặt bàn (Reservation)</option>
                    <option value="management">Ban quản lý (Management)</option>
                    <option value="finance">Tài chính (Finance)</option>
                    <option value="inventory">Kho vận (Inventory)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mức độ ưu tiên *</label>
                  <select
                    value={orderForm.priority}
                    onChange={(e) => setOrderForm({ ...orderForm, priority: e.target.value as PurchaseOrderPriority })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="low">Thấp (Low)</option>
                    <option value="medium">Trung bình (Medium)</option>
                    <option value="high">Cao (High)</option>
                    <option value="urgent">GẤP (Urgent)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày đặt hàng *</label>
                  <input
                    type="date"
                    value={orderForm.orderDate}
                    onChange={(e) => setOrderForm({ ...orderForm, orderDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.orderDate && <span className="text-[10px] text-red-400 italic">{validationErrors.orderDate}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày dự kiến nhận hàng</label>
                  <input
                    type="date"
                    value={orderForm.expectedDeliveryDate}
                    onChange={(e) => setOrderForm({ ...orderForm, expectedDeliveryDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Địa chỉ giao nhận hàng (Delivery Address)</label>
                  <input
                    type="text"
                    value={orderForm.deliveryAddressNote}
                    onChange={(e) => setOrderForm({ ...orderForm, deliveryAddressNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Khung giờ giao hàng yêu cầu</label>
                  <input
                    type="text"
                    value={orderForm.deliveryTimeNote}
                    onChange={(e) => setOrderForm({ ...orderForm, deliveryTimeNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Quy chuẩn chất lượng QA yêu cầu lúc nhận</label>
                <input
                  type="text"
                  placeholder="Yêu cầu kiểm nhiệt độ xe lạnh khi giao, nguyên râu không dập..."
                  value={orderForm.qualityNote}
                  onChange={(e) => setOrderForm({ ...orderForm, qualityNote: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Ghi chú nội bộ</label>
                <input
                  type="text"
                  placeholder="Ghi chú nội bộ cho thủ kho hoặc kế toán đối chiếu..."
                  value={orderForm.internalNote}
                  onChange={(e) => setOrderForm({ ...orderForm, internalNote: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Khởi tạo đơn đặt hàng
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & lines */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết đơn đặt hàng
            </h3>

            {selectedOrder ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedOrder.purchaseOrderCode || selectedOrder.id}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Bộ phận đặt: {getDepartmentLabel(selectedOrder.department)}</span>
                    <span>Người đặt: {selectedOrder.orderedBy}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Nhà cung cấp</span>
                    <span className="font-bold text-gold-hover block text-xs">{getSupplierName(selectedOrder.supplierId)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mức ưu tiên</span>
                    <span className={`font-bold block ${getPriorityClass(selectedOrder.priority)}`}>
                      {getPriorityLabel(selectedOrder.priority)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ngày đặt hàng</span>
                    <span className="font-bold text-foreground/80 block font-mono">{selectedOrder.orderDate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Dự kiến giao</span>
                    <span className="font-bold text-gold block font-mono">{selectedOrder.expectedDeliveryDate || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Yêu cầu mua (PR)</span>
                    <span className="font-bold text-foreground/80 block font-mono">{getRequestCode(selectedOrder.purchaseRequestId)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái đơn</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(selectedOrder.status)}`}>
                      {getStatusLabel(selectedOrder.status)}
                    </span>
                  </div>
                </div>

                {selectedOrder.deliveryAddressNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Địa điểm giao nhận hàng</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedOrder.deliveryAddressNote}</p>
                  </div>
                )}

                {selectedOrder.deliveryTimeNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Khung giờ giao hàng</span>
                    <p className="text-foreground/80 leading-relaxed font-sans italic">&ldquo;{selectedOrder.deliveryTimeNote}&rdquo;</p>
                  </div>
                )}

                {selectedOrder.qualityNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Tiêu chuẩn kiểm soát QA</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedOrder.qualityNote}</p>
                  </div>
                )}

                {selectedOrder.internalNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú nội bộ</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedOrder.internalNote}</p>
                  </div>
                )}

                <div className="grid gap-1 grid-cols-3 text-[8px] text-foreground/45 font-mono border-t border-gold-border/10 pt-2.5">
                  <div>Gửi đi: {selectedOrder.sentAt || '-'}</div>
                  <div>Xác nhận: {selectedOrder.confirmedAt || '-'}</div>
                  <div>Đã đóng: {selectedOrder.closedAt || '-'}</div>
                </div>

                {/* Lines Section */}
                <div className="border-t border-gold-border/20 pt-4 space-y-3">
                  <span className="text-[10px] text-gold font-serif-cormorant font-bold uppercase tracking-wider block">🥗 Danh mục mặt hàng đặt hàng</span>
                  
                  {selectedOrderLines.length > 0 ? (
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {selectedOrderLines.map((line) => (
                        <div key={line.id} className="p-2.5 bg-background/40 rounded border border-gold-border/10 space-y-1 text-[10px]">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-foreground">
                                {line.lineOrder}. {line.ingredientMasterId ? getIngredientName(line.ingredientMasterId) : line.itemName}
                              </span>
                              <span className="text-[8px] text-foreground/45 block font-mono mt-0.5">Trạng thái: {getLineStatusLabel(line.status)}</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-gold">
                              {line.orderedQuantity !== null ? line.orderedQuantity : '-'} {line.orderedUnit || ''}
                            </span>
                          </div>

                          {line.supplierItemNote && (
                            <div className="text-[8px] text-foreground/70"><span className="font-semibold text-foreground/40">Ghi chú NCC:</span> {line.supplierItemNote}</div>
                          )}

                          {line.qualityRequirementNote && (
                            <div className="text-[8px] text-foreground/70"><span className="font-semibold text-foreground/40">Yêu cầu QA:</span> {line.qualityRequirementNote}</div>
                          )}

                          {line.deliveryNote && (
                            <div className="text-[8px] text-foreground/75 italic"><span className="font-semibold text-foreground/40">Giao hàng:</span> &ldquo;{line.deliveryNote}&rdquo;</div>
                          )}

                          {/* Line status actions */}
                          <div className="flex gap-1 justify-end pt-1.5 border-t border-gold-border/5">
                            <button
                              type="button"
                              onClick={() => handleUpdateLineStatus(line.id, 'supplier_confirmed')}
                              className="rounded bg-purple-500/10 hover:bg-purple-500/25 border border-purple-500/20 px-1 py-0.5 text-[8px] text-purple-400 font-bold"
                            >
                              Xác nhận
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLineStatus(line.id, 'received')}
                              className="rounded bg-green-500/10 hover:bg-green-500/25 border border-green-500/20 px-1 py-0.5 text-[8px] text-green-400 font-bold"
                            >
                              Đã nhận
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateLineStatus(line.id, 'cancelled')}
                              className="rounded bg-red-500/10 hover:bg-red-500/25 border border-red-500/20 px-1 py-0.5 text-[8px] text-red-400"
                            >
                              Hủy
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[9px] text-foreground/45 italic text-center py-4">Chưa có dòng mặt hàng nào được đặt.</p>
                  )}

                  {/* Add Line Form */}
                  <form onSubmit={handleCreateOrderLine} className="bg-gold-muted/5 border border-gold-border/10 p-3 rounded space-y-2 mt-2">
                    <span className="text-[9px] text-gold font-bold block">➕ Thêm dòng mặt hàng đặt</span>
                    
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
                        value={lineForm.itemName}
                        onChange={(e) => setLineForm({ ...lineForm, itemName: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-2 grid-cols-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Số lượng đặt hàng *</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="Ví dụ: 10..."
                          value={lineForm.orderedQuantity}
                          onChange={(e) => setLineForm({ ...lineForm, orderedQuantity: e.target.value })}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none font-mono"
                        />
                        {lineErrors.orderedQuantity && <span className="text-[8px] text-red-400 italic">{lineErrors.orderedQuantity}</span>}
                      </div>

                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Đơn vị tính</label>
                        <select
                          value={lineForm.orderedUnit}
                          onChange={(e) => setLineForm({ ...lineForm, orderedUnit: e.target.value as PurchaseOrderUnit })}
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
                      <label className="text-[8px] text-foreground/50">Yêu cầu chất lượng & QA chi tiết</label>
                      <input
                        type="text"
                        placeholder="Nhiệt độ xe lạnh không quá 4 độ C..."
                        value={lineForm.qualityRequirementNote}
                        onChange={(e) => setLineForm({ ...lineForm, qualityRequirementNote: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Ghi chú giao nhận</label>
                      <input
                        type="text"
                        placeholder="Đóng gói lạnh, hạ hàng cửa sau..."
                        value={lineForm.deliveryNote}
                        onChange={(e) => setLineForm({ ...lineForm, deliveryNote: e.target.value })}
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

                {/* State Actions for Purchase Order Header */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái đơn hàng</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'sent')}
                      className="rounded border border-blue-500/40 hover:border-blue-500 px-2 py-1.5 text-center text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all font-semibold"
                    >
                      Gửi đi nhà cung cấp (Sent)
                    </button>

                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'supplier_confirmed')}
                      className="rounded border border-purple-500/40 hover:border-purple-500 px-2 py-1.5 text-center text-[10px] text-purple-400 hover:bg-purple-500/10 transition-all font-semibold"
                    >
                      Xác nhận đơn hàng (Confirmed)
                    </button>

                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'received')}
                      className="col-span-2 rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Đã nhận đủ hàng (Received)
                    </button>

                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'cancelled')}
                      className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                    >
                      Hủy đơn hàng (Cancel)
                    </button>

                    <button
                      onClick={() => handleUpdateOrderStatus(selectedOrder.id, 'closed')}
                      className="rounded border border-foreground/30 hover:border-foreground/60 px-2 py-1.5 text-center text-[10px] text-foreground/60 hover:bg-foreground/5 transition-all font-semibold"
                    >
                      Đóng đơn hàng (Close)
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
                      href="/studio/purchase-requests"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      📋 Xem yêu cầu mua
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một đơn đặt hàng từ danh sách bên trái để xem chi tiết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PurchaseOrdersPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải đơn đặt hàng…</p>
      </div>
    }>
      <PurchaseOrdersPageContent />
    </Suspense>
  )
}
