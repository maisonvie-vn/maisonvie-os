'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type GoodsReceiptStatus =
  | 'draft'
  | 'received'
  | 'partially_received'
  | 'issue_reported'
  | 'cancelled'

export interface GoodsReceipt {
  id: string
  purchaseOrderId: string
  receiptNumber: string
  supplierId?: string | null
  receivedDate: string
  receivedBy?: string | null
  status: GoodsReceiptStatus
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface GoodsReceiptItem {
  id: string
  goodsReceiptId: string
  purchaseOrderLineId?: string | null
  ingredientMasterId?: string | null
  orderedQuantity?: number | null
  receivedQuantity: number
  acceptedQuantity: number
  rejectedQuantity: number
  damagedQuantity: number
  unit?: string | null
  unitPrice?: number | null
  issueNote?: string | null
  createdAt: string
  updatedAt: string
}

interface PurchaseOrder {
  id: string
  purchaseOrderCode?: string | null
  supplierId: string
  orderDate: string
  status: string
}

interface PurchaseOrderLine {
  id: string
  purchaseOrderId: string
  ingredientMasterId?: string | null
  itemName?: string | null
  orderedQuantity?: number | null
  orderedUnit?: string | null
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

const INITIAL_RECEIPTS: GoodsReceipt[] = [
  {
    id: 'gr-801',
    purchaseOrderId: 'po-701',
    receiptNumber: 'GR-20260630-01',
    supplierId: 'sup-501',
    receivedDate: '2026-06-30',
    receivedBy: 'Steward Thắng',
    status: 'received',
    notes: 'Hải sản sống đạt chuẩn, đã kiểm tra xe bảo ôn nhiệt độ 3.5 độ C',
    createdAt: '2026-06-30 06:00',
    updatedAt: '2026-06-30 06:15'
  }
]

const INITIAL_RECEIPT_ITEMS: GoodsReceiptItem[] = [
  {
    id: 'gr-item-1',
    goodsReceiptId: 'gr-801',
    purchaseOrderLineId: 'po-line-1',
    ingredientMasterId: 'ing-master-001',
    orderedQuantity: 15,
    receivedQuantity: 15,
    acceptedQuantity: 15,
    rejectedQuantity: 0,
    damagedQuantity: 0,
    unit: 'kg',
    unitPrice: null,
    issueNote: '',
    createdAt: '2026-06-30 06:00',
    updatedAt: '2026-06-30 06:00'
  },
  {
    id: 'gr-item-2',
    goodsReceiptId: 'gr-801',
    purchaseOrderLineId: 'po-line-2',
    ingredientMasterId: 'ing-master-004',
    orderedQuantity: 10,
    receivedQuantity: 10,
    acceptedQuantity: 10,
    rejectedQuantity: 0,
    damagedQuantity: 0,
    unit: 'kg',
    unitPrice: null,
    issueNote: '',
    createdAt: '2026-06-30 06:00',
    updatedAt: '2026-06-30 06:00'
  }
]

function GoodsReceiptsPageContent() {
  const [receipts, setReceipts] = useState<GoodsReceipt[]>([])
  const [receiptItems, setReceiptItems] = useState<GoodsReceiptItem[]>([])
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([])
  const [purchaseOrderLines, setPurchaseOrderLines] = useState<PurchaseOrderLine[]>([])
  const [masterIngredients, setMasterIngredients] = useState<IngredientMaster[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [selectedReceipt, setSelectedReceipt] = useState<GoodsReceipt | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Creation form from Purchase Order
  const [selectedPOId, setSelectedPOId] = useState('')
  const [receivedByInput, setReceivedByInput] = useState('')
  const [receiptNotes, setReceiptNotes] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)

  // Items editing temporary values (for the selected receipt)
  const [editingItemQuantities, setEditingItemQuantities] = useState<Record<string, {
    receivedQuantity: string
    acceptedQuantity: string
    rejectedQuantity: string
    damagedQuantity: string
    issueNote: string
  }>>({})
  const [editError, setEditError] = useState<string | null>(null)
  interface InventoryMovementSummary {
    id: string
    sourceId?: string | null
  }
  const [inventoryMovements, setInventoryMovements] = useState<InventoryMovementSummary[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedReceipts = localStorage.getItem('mvos_goods_receipts')
        const storedReceiptItems = localStorage.getItem('mvos_goods_receipt_items')
        const storedOrders = localStorage.getItem('mvos_purchase_orders')
        const storedOrderLines = localStorage.getItem('mvos_purchase_order_lines')
        const storedMaster = localStorage.getItem('mvos_ingredients')
        const storedSuppliers = localStorage.getItem('mvos_suppliers')

        let loadedReceipts: GoodsReceipt[] = []
        let loadedItems: GoodsReceiptItem[] = []
        let loadedOrders: PurchaseOrder[] = []
        let loadedLines: PurchaseOrderLine[] = []
        let loadedIngredients: IngredientMaster[] = []
        let loadedSuppliers: Supplier[] = []

        if (storedReceipts) {
          loadedReceipts = JSON.parse(storedReceipts)
        } else {
          localStorage.setItem('mvos_goods_receipts', JSON.stringify(INITIAL_RECEIPTS))
          loadedReceipts = INITIAL_RECEIPTS
        }
        setReceipts(loadedReceipts)

        if (storedReceiptItems) {
          loadedItems = JSON.parse(storedReceiptItems)
        } else {
          localStorage.setItem('mvos_goods_receipt_items', JSON.stringify(INITIAL_RECEIPT_ITEMS))
          loadedItems = INITIAL_RECEIPT_ITEMS
        }
        setReceiptItems(loadedItems)

        if (storedOrders) loadedOrders = JSON.parse(storedOrders)
        setPurchaseOrders(loadedOrders)

        if (storedOrderLines) loadedLines = JSON.parse(storedOrderLines)
        setPurchaseOrderLines(loadedLines)

        if (storedMaster) loadedIngredients = JSON.parse(storedMaster)
        setMasterIngredients(loadedIngredients)

        if (storedSuppliers) loadedSuppliers = JSON.parse(storedSuppliers)
        setSuppliers(loadedSuppliers)

        const storedMovements = localStorage.getItem('mvos_inventory_movements')
        if (storedMovements) {
          setInventoryMovements(JSON.parse(storedMovements))
        }

        if (loadedReceipts.length > 0) {
          const defaultRec = loadedReceipts[0]
          setSelectedReceipt(defaultRec)
          initializeEditingItems(defaultRec.id, loadedItems)
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu nhận hàng.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const initializeEditingItems = (receiptId: string, allItems: GoodsReceiptItem[]) => {
    const filterItems = allItems.filter(item => item.goodsReceiptId === receiptId)
    const editingMap: Record<string, {
      receivedQuantity: string
      acceptedQuantity: string
      rejectedQuantity: string
      damagedQuantity: string
      issueNote: string
    }> = {}
    
    filterItems.forEach(item => {
      editingMap[item.id] = {
        receivedQuantity: item.receivedQuantity.toString(),
        acceptedQuantity: item.acceptedQuantity.toString(),
        rejectedQuantity: item.rejectedQuantity.toString(),
        damagedQuantity: item.damagedQuantity.toString(),
        issueNote: item.issueNote || ''
      }
    })
    setEditingItemQuantities(editingMap)
  }

  const handleSelectReceipt = (rec: GoodsReceipt) => {
    setSelectedReceipt(rec)
    initializeEditingItems(rec.id, receiptItems)
    setEditError(null)
  }

  const handleCreateReceiptFromPO = (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError(null)

    if (!selectedPOId) {
      setValidationError('Vui lòng chọn Đơn đặt hàng muốn nhận hàng.')
      return
    }

    const order = purchaseOrders.find(po => po.id === selectedPOId)
    if (!order) {
      setValidationError('Đơn đặt hàng không tồn tại.')
      return
    }

    if (order.status === 'cancelled') {
      setValidationError('Không thể tạo phiếu nhận từ đơn mua hàng đã hủy.')
      return
    }

    const lines = purchaseOrderLines.filter(line => line.purchaseOrderId === order.id)
    if (lines.length === 0) {
      setValidationError('Đơn đặt hàng được chọn không có dòng mặt hàng nào để nhận.')
      return
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const newReceiptId = `gr-${Date.now().toString().slice(-4)}`
    const receiptNum = `GR-${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}-${Date.now().toString().slice(-3)}`

    const newReceipt: GoodsReceipt = {
      id: newReceiptId,
      purchaseOrderId: order.id,
      receiptNumber: receiptNum,
      supplierId: order.supplierId || null,
      receivedDate: new Date().toISOString().split('T')[0],
      receivedBy: receivedByInput.trim() || 'Người nhận hàng',
      status: 'draft',
      notes: receiptNotes.trim() || null,
      createdAt: nowStr,
      updatedAt: nowStr
    }

    const newItems: GoodsReceiptItem[] = lines.map((line, idx) => ({
      id: `gr-item-${Date.now().toString().slice(-4)}-${idx}`,
      goodsReceiptId: newReceiptId,
      purchaseOrderLineId: line.id,
      ingredientMasterId: line.ingredientMasterId || null,
      orderedQuantity: line.orderedQuantity || null,
      receivedQuantity: 0,
      acceptedQuantity: 0,
      rejectedQuantity: 0,
      damagedQuantity: 0,
      unit: line.orderedUnit || null,
      unitPrice: null,
      issueNote: null,
      createdAt: nowStr,
      updatedAt: nowStr
    }))

    const updatedReceipts = [...receipts, newReceipt]
    const updatedItems = [...receiptItems, ...newItems]

    localStorage.setItem('mvos_goods_receipts', JSON.stringify(updatedReceipts))
    localStorage.setItem('mvos_goods_receipt_items', JSON.stringify(updatedItems))

    setReceipts(updatedReceipts)
    setReceiptItems(updatedItems)
    setSelectedReceipt(newReceipt)
    initializeEditingItems(newReceiptId, updatedItems)

    setSelectedPOId('')
    setReceivedByInput('')
    setReceiptNotes('')
  }

  const handleUpdateItemQuantityField = (itemId: string, field: 'receivedQuantity' | 'acceptedQuantity' | 'rejectedQuantity' | 'damagedQuantity' | 'issueNote', value: string) => {
    setEditingItemQuantities(prev => ({
      ...prev,
      [itemId]: {
        ...prev[itemId],
        [field]: value
      }
    }))
  }

  const handleSaveReceiptQuantities = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReceipt) return
    setEditError(null)

    // 1. Validation
    let hasValidationError = false
    const updatedItemsMap = { ...editingItemQuantities }

    for (const itemId in updatedItemsMap) {
      const vals = updatedItemsMap[itemId]
      const recQty = parseFloat(vals.receivedQuantity) || 0
      const accQty = parseFloat(vals.acceptedQuantity) || 0
      const rejQty = parseFloat(vals.rejectedQuantity) || 0
      const dmgQty = parseFloat(vals.damagedQuantity) || 0

      if (recQty < 0 || accQty < 0 || rejQty < 0 || dmgQty < 0) {
        setEditError('Số lượng không được nhỏ hơn 0.')
        hasValidationError = true
        break
      }

      if (accQty + rejQty + dmgQty > recQty) {
        setEditError('Tổng số lượng đạt, từ chối và hỏng không được vượt quá số lượng nhận.')
        hasValidationError = true
        break
      }
    }

    if (hasValidationError) return

    // 2. Save
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    let anyAccepted = false
    let allAccepted = true

    const updatedItems = receiptItems.map((item) => {
      if (item.goodsReceiptId === selectedReceipt.id && updatedItemsMap[item.id]) {
        const vals = updatedItemsMap[item.id]
        const recQty = parseFloat(vals.receivedQuantity) || 0
        const accQty = parseFloat(vals.acceptedQuantity) || 0
        const rejQty = parseFloat(vals.rejectedQuantity) || 0
        const dmgQty = parseFloat(vals.damagedQuantity) || 0
        const ordQty = item.orderedQuantity || 0

        if (accQty > 0) anyAccepted = true
        if (accQty < ordQty) allAccepted = false

        return {
          ...item,
          receivedQuantity: recQty,
          acceptedQuantity: accQty,
          rejectedQuantity: rejQty,
          damagedQuantity: dmgQty,
          issueNote: vals.issueNote.trim() || null,
          updatedAt: nowStr
        }
      }
      return item
    })

    // Determine status of receipt
    let finalStatus: GoodsReceiptStatus = 'received'
    const currentEditingItems = Object.values(updatedItemsMap)
    const anyIssues = currentEditingItems.some(v => (parseFloat(v.rejectedQuantity) || 0) > 0 || (parseFloat(v.damagedQuantity) || 0) > 0 || v.issueNote.trim() !== '')

    if (anyIssues) {
      finalStatus = 'issue_reported'
    } else if (allAccepted && anyAccepted) {
      finalStatus = 'received'
    } else if (anyAccepted) {
      finalStatus = 'partially_received'
    } else {
      finalStatus = 'draft'
    }

    const updatedReceipts = receipts.map((rec) => {
      if (rec.id === selectedReceipt.id) {
        const item = {
          ...rec,
          status: finalStatus,
          updatedAt: nowStr
        }
        setSelectedReceipt(item)
        return item
      }
      return rec
    })

    // Also optionally update purchase order status at workflow level
    const updatedOrders = purchaseOrders.map((po) => {
      if (po.id === selectedReceipt.purchaseOrderId) {
        let poStatus = po.status
        if (allAccepted && anyAccepted) {
          poStatus = 'received'
        } else if (anyAccepted) {
          poStatus = 'partially_received'
        }
        return {
          ...po,
          status: poStatus,
          updatedAt: nowStr
        }
      }
      return po
    })

    localStorage.setItem('mvos_goods_receipts', JSON.stringify(updatedReceipts))
    localStorage.setItem('mvos_goods_receipt_items', JSON.stringify(updatedItems))
    localStorage.setItem('mvos_purchase_orders', JSON.stringify(updatedOrders))

    setReceipts(updatedReceipts)
    setReceiptItems(updatedItems)
    setPurchaseOrders(updatedOrders)

    alert('Phiếu nhận hàng đã được lưu.')
  }

  const handleCancelReceipt = (receiptId: string) => {
    if (!confirm('Bạn có chắc chắn muốn hủy phiếu nhận hàng này không?')) return

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updatedReceipts = receipts.map((rec) => {
      if (rec.id === receiptId) {
        const item: GoodsReceipt = {
          ...rec,
          status: 'cancelled',
          updatedAt: nowStr
        }
        if (selectedReceipt?.id === receiptId) setSelectedReceipt(item)
        return item
      }
      return rec
    })

    localStorage.setItem('mvos_goods_receipts', JSON.stringify(updatedReceipts))
    setReceipts(updatedReceipts)
  }

  const handleImportToInventory = (rec: GoodsReceipt) => {
    if (rec.status === 'draft') {
      alert('Không thể nhập kho từ phiếu nhận hàng nháp.')
      return
    }
    if (rec.status === 'cancelled') {
      alert('Không thể tạo phiếu nhận từ đơn mua hàng đã hủy.')
      return
    }

    const alreadyGenerated = inventoryMovements.some(m => m.sourceId === rec.id)
    if (alreadyGenerated) {
      alert('Phiếu nhận hàng này đã được ghi nhận vào kho.')
      return
    }

    const items = receiptItems.filter(item => item.goodsReceiptId === rec.id)
    const validItems = items.filter(item => item.acceptedQuantity > 0)

    if (validItems.length === 0) {
      alert('Không có dòng mặt hàng nào đạt tiêu chuẩn để nhập kho (số lượng đạt > 0).')
      return
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const newMovements = validItems.map((item, idx) => ({
      id: `im-${Date.now().toString().slice(-4)}-${idx}`,
      movementNumber: `IM-${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}-${Date.now().toString().slice(-3)}-${idx}`,
      ingredientMasterId: item.ingredientMasterId,
      movementDate: new Date().toISOString().split('T')[0],
      movementType: 'purchase_receipt',
      direction: 'in',
      quantity: item.acceptedQuantity,
      unit: item.unit || 'kg',
      sourceType: 'goods_receipt',
      sourceId: rec.id,
      sourceLineId: item.id,
      referenceNumber: rec.receiptNumber,
      reason: 'Nhập từ phiếu nhận hàng',
      notes: item.issueNote || rec.notes || null,
      createdBy: rec.receivedBy || 'Steward Thắng',
      createdAt: nowStr,
      updatedAt: nowStr
    }))

    const updatedMovements = [...inventoryMovements, ...newMovements]
    localStorage.setItem('mvos_inventory_movements', JSON.stringify(updatedMovements))
    setInventoryMovements(updatedMovements)

    alert('Biến động kho đã được ghi nhận.')
  }

  const getStatusLabel = (s: GoodsReceiptStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'received': return 'Đã nhận đủ'
      case 'partially_received': return 'Nhận một phần'
      case 'issue_reported': return 'Có vấn đề'
      case 'cancelled': return 'Đã hủy'
      default: return s
    }
  }

  const getStatusClass = (s: GoodsReceiptStatus) => {
    switch (s) {
      case 'received': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'partially_received': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'issue_reported': return 'bg-red-500/10 border border-red-500/25 text-red-400 font-bold animate-pulse'
      case 'cancelled': return 'bg-foreground/5 border border-foreground/10 text-foreground/40 line-through'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getSupplierName = (id: string | null | undefined) => {
    if (!id) return 'Chưa rõ'
    const found = suppliers.find(s => s.id === id)
    return found ? found.supplierName : id
  }

  const getIngredientName = (id: string | null | undefined) => {
    if (!id) return null
    const found = masterIngredients.find(m => m.id === id)
    return found ? found.ingredientNameVi : id
  }

  const getPurchaseOrderCode = (id: string) => {
    const found = purchaseOrders.find(po => po.id === id)
    return found ? found.purchaseOrderCode || found.id : id
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải phiếu nhận hàng…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải dữ liệu nhận hàng.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Statistics
  const totalCount = receipts.length
  const draftCount = receipts.filter(r => r.status === 'draft').length
  const receivedCount = receipts.filter(r => r.status === 'received').length
  const partialCount = receipts.filter(r => r.status === 'partially_received').length
  const issueCount = receipts.filter(r => r.status === 'issue_reported').length

  const selectedReceiptItems = selectedReceipt
    ? receiptItems.filter(item => item.goodsReceiptId === selectedReceipt.id)
    : []

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🧾 Phiếu nhận hàng (Goods Receipt)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Quản lý việc nhận hàng thực tế từ các nhà cung cấp theo Đơn đặt hàng trước khi kiểm kho, hóa đơn và thanh toán được đối chiếu.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng phiếu nhận</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Bản nháp</span>
          <span className="text-2xl font-serif-cormorant font-bold text-foreground/50 mt-1 block">{draftCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã nhận đủ</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{receivedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Nhận một phần</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{partialCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Có vấn đề</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-400 mt-1 block">{issueCount}</span>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Receipts List & Creation form */}
        <div className="lg:col-span-2 space-y-6">
          {/* List Table */}
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Số phiếu nhận</th>
                    <th className="py-3 px-4">Ngày nhận</th>
                    <th className="py-3 px-4">Đơn đặt hàng</th>
                    <th className="py-3 px-4">Nhà cung cấp</th>
                    <th className="py-3 px-4">Người nhận</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {receipts.length > 0 ? (
                    receipts.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => handleSelectReceipt(r)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedReceipt?.id === r.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{r.receiptNumber}</td>
                        <td className="py-3.5 px-4 font-mono">{r.receivedDate}</td>
                        <td className="py-3.5 px-4 font-mono text-foreground/85 font-semibold">
                          {getPurchaseOrderCode(r.purchaseOrderId)}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-foreground">{getSupplierName(r.supplierId)}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">{r.receivedBy || '-'}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(r.status)}`}>
                            {getStatusLabel(r.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/60 max-w-[120px] truncate">{r.notes || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có phiếu nhận hàng nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Goods Receipt from PO */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo phiếu nhận từ đơn đặt hàng (PO)
            </h3>

            <form onSubmit={handleCreateReceiptFromPO} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Chọn đơn đặt hàng (PO) *</label>
                  <select
                    value={selectedPOId}
                    onChange={(e) => setSelectedPOId(e.target.value)}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  >
                    <option value="">-- Chọn đơn hàng để nhận --</option>
                    {purchaseOrders.filter(po => po.status !== 'cancelled').map((po) => (
                      <option key={po.id} value={po.id}>
                        {po.purchaseOrderCode || po.id} ({getSupplierName(po.supplierId)}) - {po.orderDate}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Người thực tế nhận hàng</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Steward Thắng, Bếp trưởng..."
                    value={receivedByInput}
                    onChange={(e) => setReceivedByInput(e.target.value)}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Ghi chú kiểm soát chất lượng & tình trạng xe nhận hàng</label>
                <textarea
                  placeholder="Ghi nhận nhiệt độ xe đông lạnh, độ tươi của cá, tôm hùm sống bơi khỏe..."
                  rows={2}
                  value={receiptNotes}
                  onChange={(e) => setReceiptNotes(e.target.value)}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              {validationError && (
                <p className="text-[10px] text-red-400 italic">⚠️ {validationError}</p>
              )}

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Khởi tạo phiếu nhận hàng
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & item edit */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết phiếu nhận hàng
            </h3>

            {selectedReceipt ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedReceipt.receiptNumber}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Đơn hàng: {getPurchaseOrderCode(selectedReceipt.purchaseOrderId)}</span>
                    <span>Ngày nhận: {selectedReceipt.receivedDate}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Nhà cung cấp</span>
                    <span className="font-bold text-gold-hover block text-xs">{getSupplierName(selectedReceipt.supplierId)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người nhận hàng</span>
                    <span className="font-bold text-foreground/80 block text-xs">{selectedReceipt.receivedBy || 'Chưa rõ'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái phiếu</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(selectedReceipt.status)}`}>
                      {getStatusLabel(selectedReceipt.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ngày tạo phiếu</span>
                    <span className="font-mono text-foreground/60 block">{selectedReceipt.createdAt}</span>
                  </div>
                </div>

                {selectedReceipt.notes && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú nhận hàng</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedReceipt.notes}</p>
                  </div>
                )}

                {/* Goods receipt items list & editing */}
                <form onSubmit={handleSaveReceiptQuantities} className="space-y-4">
                  <div className="border-t border-gold-border/20 pt-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gold font-serif-cormorant font-bold uppercase tracking-wider block">🥗 Chi tiết dòng nhận thực tế</span>
                      <span className="text-[8px] text-foreground/40 font-mono">(Lưu ý: số lượng đạt + từ chối + hỏng &le; nhận)</span>
                    </div>

                    {selectedReceiptItems.length > 0 ? (
                      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                        {selectedReceiptItems.map((item, idx) => {
                          const editVals = editingItemQuantities[item.id] || {
                            receivedQuantity: '0',
                            acceptedQuantity: '0',
                            rejectedQuantity: '0',
                            damagedQuantity: '0',
                            issueNote: ''
                          }
                          const lineDetails = purchaseOrderLines.find(l => l.id === item.purchaseOrderLineId)

                          return (
                            <div key={item.id} className="p-3 bg-background/50 rounded border border-gold-border/10 space-y-2 text-[10px]">
                              <div className="flex justify-between items-start border-b border-gold-border/5 pb-1">
                                <span className="font-bold text-foreground">
                                  {idx + 1}. {item.ingredientMasterId ? getIngredientName(item.ingredientMasterId) : (lineDetails?.itemName || 'Mặt hàng')}
                                </span>
                                <span className="font-mono text-[9px] text-gold-hover">
                                  Đơn mua: {item.orderedQuantity !== null ? item.orderedQuantity : '-'} {item.unit || ''}
                                </span>
                              </div>

                              <div className="grid gap-2 grid-cols-2">
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[8px] text-foreground/50">Số lượng nhận thực tế</label>
                                  <input
                                    type="number"
                                    step="any"
                                    disabled={selectedReceipt.status === 'cancelled'}
                                    value={editVals.receivedQuantity}
                                    onChange={(e) => handleUpdateItemQuantityField(item.id, 'receivedQuantity', e.target.value)}
                                    className="rounded border border-gold-border/20 bg-background px-2 py-0.5 text-[10px] focus:outline-none font-mono"
                                  />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[8px] text-foreground/50">Số lượng đạt (Accepted)</label>
                                  <input
                                    type="number"
                                    step="any"
                                    disabled={selectedReceipt.status === 'cancelled'}
                                    value={editVals.acceptedQuantity}
                                    onChange={(e) => handleUpdateItemQuantityField(item.id, 'acceptedQuantity', e.target.value)}
                                    className="rounded border border-gold-border/20 bg-background px-2 py-0.5 text-[10px] focus:outline-none font-mono"
                                  />
                                </div>
                              </div>

                              <div className="grid gap-2 grid-cols-2">
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[8px] text-foreground/50">Số lượng từ chối (Rejected)</label>
                                  <input
                                    type="number"
                                    step="any"
                                    disabled={selectedReceipt.status === 'cancelled'}
                                    value={editVals.rejectedQuantity}
                                    onChange={(e) => handleUpdateItemQuantityField(item.id, 'rejectedQuantity', e.target.value)}
                                    className="rounded border border-gold-border/20 bg-background px-2 py-0.5 text-[10px] focus:outline-none font-mono"
                                  />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <label className="text-[8px] text-foreground/50">Số lượng hỏng (Damaged)</label>
                                  <input
                                    type="number"
                                    step="any"
                                    disabled={selectedReceipt.status === 'cancelled'}
                                    value={editVals.damagedQuantity}
                                    onChange={(e) => handleUpdateItemQuantityField(item.id, 'damagedQuantity', e.target.value)}
                                    className="rounded border border-gold-border/20 bg-background px-2 py-0.5 text-[10px] focus:outline-none font-mono"
                                  />
                                </div>
                              </div>

                              <div className="flex flex-col gap-0.5">
                                <label className="text-[8px] text-foreground/50">Ghi chú vấn đề (nếu từ chối/hỏng)</label>
                                <input
                                  type="text"
                                  placeholder="Ví dụ: Nghêu nứt vỡ nhiều, tôm hùm lờ đờ..."
                                  disabled={selectedReceipt.status === 'cancelled'}
                                  value={editVals.issueNote}
                                  onChange={(e) => handleUpdateItemQuantityField(item.id, 'issueNote', e.target.value)}
                                  className="rounded border border-gold-border/20 bg-background px-2 py-0.5 text-[10px] focus:outline-none"
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-[9px] text-foreground/45 italic text-center py-4">Không có dòng mặt hàng nào.</p>
                    )}
                  </div>

                  {editError && (
                    <p className="text-[10px] text-red-400 italic">⚠️ {editError}</p>
                  )}

                  {selectedReceipt.status !== 'cancelled' && (
                    <div className="pt-2 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 rounded bg-gold hover:bg-gold-hover text-background py-2 text-xs font-bold transition-all text-center"
                      >
                        💾 Lưu phiếu nhận hàng
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancelReceipt(selectedReceipt.id)}
                        className="rounded border border-red-500/40 hover:border-red-500 px-3 py-2 text-[11px] text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                      >
                        Hủy phiếu
                      </button>
                    </div>
                  )}
                </form>

                {/* Import to Inventory Button */}
                {selectedReceipt.status !== 'draft' && selectedReceipt.status !== 'cancelled' && (
                  <div className="pt-2">
                    {inventoryMovements.some(m => m.sourceId === selectedReceipt.id) ? (
                      <div className="rounded border border-green-500/30 bg-green-500/5 p-2 text-center text-[10px] text-green-400 font-bold">
                        ✓ Đã ghi nhận biến động kho thành công
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleImportToInventory(selectedReceipt)}
                        className="w-full rounded bg-green-500 hover:bg-green-600 text-white py-2 text-xs font-bold transition-all text-center shadow"
                      >
                        📥 Nhập kho (Ghi nhận biến động)
                      </button>
                    )}
                  </div>
                )}

                <div className="border-t border-gold-border/20 pt-4 flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Liên kết module liên quan</span>
                  <div className="flex gap-2">
                    <Link
                      href="/studio/purchase-orders"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      📦 Xem đơn đặt hàng
                    </Link>
                    <Link
                      href="/studio/suppliers"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      🤝 Xem nhà cung cấp
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một phiếu nhận hàng từ danh sách bên trái để xem chi tiết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GoodsReceiptsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải phiếu nhận hàng…</p>
      </div>
    }>
      <GoodsReceiptsPageContent />
    </Suspense>
  )
}
