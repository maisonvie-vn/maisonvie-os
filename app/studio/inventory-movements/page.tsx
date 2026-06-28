'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type InventoryMovementType =
  | 'purchase_receipt'
  | 'manual_adjustment'
  | 'waste'
  | 'spoilage'
  | 'staff_meal'
  | 'internal_use'
  | 'correction'

export type InventoryMovementDirection =
  | 'in'
  | 'out'
  | 'adjustment'

export interface InventoryMovement {
  id: string
  movementNumber: string
  ingredientMasterId: string
  movementDate: string
  movementType: InventoryMovementType
  direction: InventoryMovementDirection
  quantity: number
  unit?: string | null
  sourceType?: string | null
  sourceId?: string | null
  sourceLineId?: string | null
  referenceNumber?: string | null
  reason?: string | null
  notes?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface IngredientMaster {
  id: string
  ingredientNameVi: string
  defaultUnit: string
}

interface GoodsReceipt {
  id: string
  receiptNumber: string
  receivedDate: string
  status: string
}

interface GoodsReceiptItem {
  id: string
  goodsReceiptId: string
  ingredientMasterId?: string | null
  acceptedQuantity: number
  unit?: string | null
  issueNote?: string | null
}

const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'im-901',
    movementNumber: 'IM-20260630-01',
    ingredientMasterId: 'ing-master-001',
    movementDate: '2026-06-30',
    movementType: 'purchase_receipt',
    direction: 'in',
    quantity: 15,
    unit: 'kg',
    sourceType: 'goods_receipt',
    sourceId: 'gr-801',
    sourceLineId: 'gr-item-1',
    referenceNumber: 'GR-20260630-01',
    reason: 'Nhập từ phiếu nhận hàng',
    notes: 'Tôm hùm sống Na Uy đạt chuẩn',
    createdBy: 'Steward Thắng',
    createdAt: '2026-06-30 06:15',
    updatedAt: '2026-06-30 06:15'
  },
  {
    id: 'im-902',
    movementNumber: 'IM-20260630-02',
    ingredientMasterId: 'ing-master-004',
    movementDate: '2026-06-30',
    movementType: 'purchase_receipt',
    direction: 'in',
    quantity: 10,
    unit: 'kg',
    sourceType: 'goods_receipt',
    sourceId: 'gr-801',
    sourceLineId: 'gr-item-2',
    referenceNumber: 'GR-20260630-01',
    reason: 'Nhập từ phiếu nhận hàng',
    notes: 'Nghêu sạch cát',
    createdBy: 'Steward Thắng',
    createdAt: '2026-06-30 06:15',
    updatedAt: '2026-06-30 06:15'
  }
]

function InventoryMovementsPageContent() {
  const [movements, setMovements] = useState<InventoryMovement[]>([])
  const [masterIngredients, setMasterIngredients] = useState<IngredientMaster[]>([])
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([])
  const [goodsReceiptItems, setGoodsReceiptItems] = useState<GoodsReceiptItem[]>([])
  const [selectedMovement, setSelectedMovement] = useState<InventoryMovement | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filtering
  const [filterIngredient, setFilterIngredient] = useState('')
  const [filterType, setFilterType] = useState('')

  // Creation Form: Manual Inventory Movement
  const [form, setForm] = useState({
    ingredientMasterId: '',
    movementDate: new Date().toISOString().split('T')[0],
    movementType: 'manual_adjustment' as InventoryMovementType,
    direction: 'adjustment' as InventoryMovementDirection,
    quantity: '',
    unit: 'kg',
    referenceNumber: '',
    reason: 'Điều chỉnh kiểm kê định kỳ',
    notes: ''
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Creation: Generate from Goods Receipt
  const [selectedGRId, setSelectedGRId] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedMovements = localStorage.getItem('mvos_inventory_movements')
        const storedMaster = localStorage.getItem('mvos_ingredients')
        const storedGRs = localStorage.getItem('mvos_goods_receipts')
        const storedGRItems = localStorage.getItem('mvos_goods_receipt_items')

        let loadedMovements: InventoryMovement[] = []
        let loadedIngredients: IngredientMaster[] = []
        let loadedGRs: GoodsReceipt[] = []
        let loadedGRItems: GoodsReceiptItem[] = []

        if (storedMovements) {
          loadedMovements = JSON.parse(storedMovements)
        } else {
          localStorage.setItem('mvos_inventory_movements', JSON.stringify(INITIAL_MOVEMENTS))
          loadedMovements = INITIAL_MOVEMENTS
        }
        setMovements(loadedMovements)

        if (storedMaster) loadedIngredients = JSON.parse(storedMaster)
        setMasterIngredients(loadedIngredients)

        if (storedGRs) loadedGRs = JSON.parse(storedGRs)
        setGoodsReceipts(loadedGRs)

        if (storedGRItems) loadedGRItems = JSON.parse(storedGRItems)
        setGoodsReceiptItems(loadedGRItems)

        if (loadedMovements.length > 0) {
          setSelectedMovement(loadedMovements[0])
        }

        setLoading(false)
      } catch {
        setError('Không thể tải lịch sử biến động kho.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateMovement = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!form.ingredientMasterId) errs.ingredientMasterId = 'Vui lòng chọn nguyên liệu'
    if (!form.movementDate) errs.movementDate = 'Ngày ghi nhận là bắt buộc'
    if (!form.movementType) errs.movementType = 'Vui lòng chọn loại biến động'
    if (!form.direction) errs.direction = 'Vui lòng chọn chiều biến động'
    
    const qtyVal = parseFloat(form.quantity)
    if (isNaN(qtyVal) || qtyVal <= 0) {
      errs.quantity = 'Số lượng phải lớn hơn 0.'
    }

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const ing = masterIngredients.find(m => m.id === form.ingredientMasterId)
    const code = form.referenceNumber.trim() || `IM-${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}-${Date.now().toString().slice(-3)}`

    const newMovement: InventoryMovement = {
      id: `im-${Date.now().toString().slice(-4)}`,
      movementNumber: code,
      ingredientMasterId: form.ingredientMasterId,
      movementDate: form.movementDate,
      movementType: form.movementType,
      direction: form.direction,
      quantity: qtyVal,
      unit: form.unit || ing?.defaultUnit || 'kg',
      referenceNumber: code,
      reason: form.reason || 'Ghi nhận thủ công',
      notes: form.notes.trim() || null,
      createdBy: 'Quản trị viên',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...movements, newMovement]
    localStorage.setItem('mvos_inventory_movements', JSON.stringify(updated))
    setMovements(updated)
    setSelectedMovement(newMovement)

    setForm({
      ingredientMasterId: '',
      movementDate: new Date().toISOString().split('T')[0],
      movementType: 'manual_adjustment',
      direction: 'adjustment',
      quantity: '',
      unit: 'kg',
      referenceNumber: '',
      reason: 'Điều chỉnh kiểm kê định kỳ',
      notes: ''
    })

    alert('Biến động kho đã được ghi nhận.')
  }

  const handleGenerateFromGR = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGRId) {
      alert('Vui lòng chọn Phiếu nhận hàng.')
      return
    }

    const rec = goodsReceipts.find(gr => gr.id === selectedGRId)
    if (!rec) {
      alert('Phiếu nhận hàng không tồn tại.')
      return
    }

    if (rec.status === 'draft') {
      alert('Không thể nhập kho từ phiếu nhận hàng nháp.')
      return
    }
    if (rec.status === 'cancelled') {
      alert('Không thể tạo phiếu nhận từ đơn mua hàng đã hủy.')
      return
    }

    const alreadyGenerated = movements.some(m => m.sourceId === rec.id)
    if (alreadyGenerated) {
      alert('Phiếu nhận hàng này đã được ghi nhận vào kho.')
      return
    }

    const items = goodsReceiptItems.filter(item => item.goodsReceiptId === rec.id)
    const validItems = items.filter(item => item.acceptedQuantity > 0)

    if (validItems.length === 0) {
      alert('Không có dòng mặt hàng nào đạt tiêu chuẩn để nhập kho (số lượng đạt > 0).')
      return
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const newMovements = validItems.map((item, idx) => ({
      id: `im-${Date.now().toString().slice(-4)}-${idx}`,
      movementNumber: `IM-${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}-${Date.now().toString().slice(-3)}-${idx}`,
      ingredientMasterId: item.ingredientMasterId!,
      movementDate: new Date().toISOString().split('T')[0],
      movementType: 'purchase_receipt' as InventoryMovementType,
      direction: 'in' as InventoryMovementDirection,
      quantity: item.acceptedQuantity,
      unit: item.unit || 'kg',
      sourceType: 'goods_receipt',
      sourceId: rec.id,
      sourceLineId: item.id,
      referenceNumber: rec.receiptNumber,
      reason: 'Nhập từ phiếu nhận hàng',
      notes: item.issueNote || null,
      createdBy: 'Steward Thắng',
      createdAt: nowStr,
      updatedAt: nowStr
    }))

    const updatedMovements = [...movements, ...newMovements]
    localStorage.setItem('mvos_inventory_movements', JSON.stringify(updatedMovements))
    setMovements(updatedMovements)
    setSelectedGRId('')

    alert('Biến động kho đã được ghi nhận.')
  }

  const getMovementTypeLabel = (t: InventoryMovementType) => {
    switch (t) {
      case 'purchase_receipt': return 'Nhập từ mua hàng'
      case 'manual_adjustment': return 'Điều chỉnh thủ công'
      case 'waste': return 'Hao hụt'
      case 'spoilage': return 'Hàng hỏng'
      case 'staff_meal': return 'Bữa ăn nhân viên'
      case 'internal_use': return 'Sử dụng nội bộ'
      case 'correction': return 'Sửa sai số liệu'
      default: return t
    }
  }

  const getMovementTypeClass = (t: InventoryMovementType) => {
    switch (t) {
      case 'purchase_receipt': return 'bg-green-500/10 border border-green-500/25 text-green-400 font-bold'
      case 'waste':
      case 'spoilage': return 'bg-red-500/10 border border-red-500/25 text-red-400 font-bold'
      case 'manual_adjustment':
      case 'correction': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      default: return 'bg-blue-500/10 border border-blue-500/25 text-blue-400'
    }
  }

  const getDirectionLabel = (d: InventoryMovementDirection) => {
    switch (d) {
      case 'in': return 'Nhập'
      case 'out': return 'Xuất'
      case 'adjustment': return 'Điều chỉnh'
      default: return d
    }
  }

  const getDirectionClass = (d: InventoryMovementDirection) => {
    switch (d) {
      case 'in': return 'text-green-400 font-bold'
      case 'out': return 'text-red-400 font-bold'
      default: return 'text-yellow-500'
    }
  }

  const getIngredientName = (id: string) => {
    const found = masterIngredients.find(m => m.id === id)
    return found ? found.ingredientNameVi : id
  }

  // Derive a simple current balance per ingredient as a read-only sum
  const getIngredientBalance = (id: string) => {
    const ingMoves = movements.filter(m => m.ingredientMasterId === id)
    let balance = 0
    ingMoves.forEach(m => {
      if (m.direction === 'in') {
        balance += m.quantity
      } else if (m.direction === 'out') {
        balance -= m.quantity
      } else if (m.direction === 'adjustment') {
        // Assume adjustment is positive unless specified
        balance += m.quantity
      }
    })
    return balance
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải lịch sử kho…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải lịch sử biến động kho.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  const filteredMovements = movements.filter((m) => {
    if (filterIngredient && m.ingredientMasterId !== filterIngredient) return false
    if (filterType && m.movementType !== filterType) return false
    return true
  })

  // Statistics
  const totalCount = movements.length
  const purchaseReceiptCount = movements.filter(m => m.movementType === 'purchase_receipt').length
  const wasteSpoilageCount = movements.filter(m => m.movementType === 'waste' || m.movementType === 'spoilage').length
  const manualCount = movements.filter(m => m.movementType === 'manual_adjustment').length
  const trackedIngredientsCount = new Set(movements.map(m => m.ingredientMasterId)).size

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          📦 Biến động kho (Inventory Movement)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Ghi nhận lịch sử xuất, nhập, điều chỉnh kho của nguyên liệu mà không thực hiện tính giá vốn hay định giá kho.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng biến động</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Nhập mua hàng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{purchaseReceiptCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Hao hụt / Hỏng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{wasteSpoilageCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Điều chỉnh</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{manualCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Mặt hàng theo dõi</span>
          <span className="text-2xl font-serif-cormorant font-bold text-foreground mt-1 block">{trackedIngredientsCount}</span>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 flex flex-wrap gap-4 text-xs">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-foreground/50 uppercase font-mono">Lọc theo nguyên liệu</label>
          <select
            value={filterIngredient}
            onChange={(e) => setFilterIngredient(e.target.value)}
            className="rounded border border-gold-border/30 bg-background/50 px-3 py-1 text-xs text-foreground focus:border-gold focus:outline-none"
          >
            <option value="">-- Tất cả nguyên liệu --</option>
            {masterIngredients.map((m) => (
              <option key={m.id} value={m.id}>
                {m.ingredientNameVi}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-foreground/50 uppercase font-mono">Lọc theo loại biến động</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded border border-gold-border/30 bg-background/50 px-3 py-1 text-xs text-foreground focus:border-gold focus:outline-none"
          >
            <option value="">-- Tất cả loại biến động --</option>
            <option value="purchase_receipt">Nhập từ mua hàng</option>
            <option value="manual_adjustment">Điều chỉnh thủ công</option>
            <option value="waste">Hao hụt (Waste)</option>
            <option value="spoilage">Hàng hỏng (Spoilage)</option>
            <option value="staff_meal">Bữa ăn nhân viên</option>
            <option value="internal_use">Sử dụng nội bộ</option>
            <option value="correction">Sửa sai số liệu</option>
          </select>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Lịch sử kho */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Mã biến động</th>
                    <th className="py-3 px-4">Ngày nhận</th>
                    <th className="py-3 px-4">Nguyên liệu</th>
                    <th className="py-3 px-4">Loại biến động</th>
                    <th className="py-3 px-4">Chiều</th>
                    <th className="py-3 px-4 text-right">Số lượng</th>
                    <th className="py-3 px-4">Đơn vị</th>
                    <th className="py-3 px-4">Tham chiếu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {filteredMovements.length > 0 ? (
                    filteredMovements.map((m) => (
                      <tr
                        key={m.id}
                        onClick={() => setSelectedMovement(m)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedMovement?.id === m.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{m.movementNumber}</td>
                        <td className="py-3.5 px-4 font-mono">{m.movementDate}</td>
                        <td className="py-3.5 px-4 font-bold text-foreground">{getIngredientName(m.ingredientMasterId)}</td>
                        <td className="py-3.5 px-4 text-[10px]">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getMovementTypeClass(m.movementType)}`}>
                            {getMovementTypeLabel(m.movementType)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={getDirectionClass(m.direction)}>{getDirectionLabel(m.direction)}</span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">{m.quantity}</td>
                        <td className="py-3.5 px-4 text-foreground/60">{m.unit || 'kg'}</td>
                        <td className="py-3.5 px-4 font-mono text-foreground/60 max-w-[120px] truncate">{m.referenceNumber || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có dòng biến động kho nào phù hợp bộ lọc.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Manual Inventory Movement */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Khởi tạo biến động kho thủ công
            </h3>

            <form onSubmit={handleCreateMovement} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Nguyên liệu *</label>
                  <select
                    value={form.ingredientMasterId}
                    onChange={(e) => setForm({ ...form, ingredientMasterId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn nguyên liệu --</option>
                    {masterIngredients.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.ingredientNameVi} ({m.defaultUnit}) - Tồn ước tính: {getIngredientBalance(m.id)} {m.defaultUnit}
                      </option>
                    ))}
                  </select>
                  {validationErrors.ingredientMasterId && <span className="text-[10px] text-red-400 italic">{validationErrors.ingredientMasterId}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Mã phiếu/Số tham chiếu</label>
                  <input
                    type="text"
                    placeholder="Tự sinh nếu để trống..."
                    value={form.referenceNumber}
                    onChange={(e) => setForm({ ...form, referenceNumber: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Loại biến động *</label>
                  <select
                    value={form.movementType}
                    onChange={(e) => setForm({ ...form, movementType: e.target.value as InventoryMovementType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="manual_adjustment">Điều chỉnh thủ công</option>
                    <option value="waste">Hao hụt (Waste)</option>
                    <option value="spoilage">Hàng hỏng (Spoilage)</option>
                    <option value="staff_meal">Bữa ăn nhân viên</option>
                    <option value="internal_use">Sử dụng nội bộ</option>
                    <option value="correction">Sửa sai số liệu</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Chiều biến động *</label>
                  <select
                    value={form.direction}
                    onChange={(e) => setForm({ ...form, direction: e.target.value as InventoryMovementDirection })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="in">Nhập (Tăng kho)</option>
                    <option value="out">Xuất (Giảm kho)</option>
                    <option value="adjustment">Điều chỉnh (Adjustment)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Ngày ghi nhận *</label>
                  <input
                    type="date"
                    value={form.movementDate}
                    onChange={(e) => setForm({ ...form, movementDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.movementDate && <span className="text-[10px] text-red-400 italic">{validationErrors.movementDate}</span>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Số lượng biến động *</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Ví dụ: 5.5..."
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                  {validationErrors.quantity && <span className="text-[10px] text-red-400 italic">{validationErrors.quantity}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Đơn vị tính</label>
                  <select
                    value={form.unit}
                    onChange={(e) => setForm({ ...form, unit: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="l">lít</option>
                    <option value="ml">ml</option>
                    <option value="pcs">cái / pcs</option>
                    <option value="portion">phần ăn</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Lý do điều chỉnh chi tiết</label>
                <input
                  type="text"
                  placeholder="Kiểm kho tháng phát hiện thừa hao hụt..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Ghi chú nội bộ</label>
                <textarea
                  placeholder="Thông tin thêm..."
                  rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Khởi tạo biến động
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Chi tiết & nhập từ Phiếu nhận Goods Receipt */}
        <div className="space-y-6">
          {/* Nhập kho từ Phiếu nhận */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2 font-serif-cormorant">
              📥 Nhập kho từ Phiếu nhận hàng (GR)
            </h3>

            <form onSubmit={handleGenerateFromGR} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/50 font-mono">Chọn Phiếu nhận hàng (Chỉ lấy lượng Accepted)</label>
                <select
                  value={selectedGRId}
                  onChange={(e) => setSelectedGRId(e.target.value)}
                  className="rounded border border-gold-border/30 bg-background/50 px-2 py-1.5 text-[10px] text-foreground focus:outline-none font-mono"
                >
                  <option value="">-- Chọn phiếu nhận hàng --</option>
                  {goodsReceipts.filter(gr => gr.status !== 'cancelled' && gr.status !== 'draft').map((gr) => (
                    <option key={gr.id} value={gr.id}>
                      {gr.receiptNumber} ({gr.receivedDate}) {movements.some(m => m.sourceId === gr.id) ? '[ĐÃ NHẬP KHO]' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full rounded bg-green-500 hover:bg-green-600 text-white py-2 text-xs font-bold transition-all text-center"
              >
                Tự động tạo biến động nhập kho
              </button>
            </form>
          </div>

          {/* Detailed movement view */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2 font-serif-cormorant">
              🔎 Chi tiết biến động kho
            </h3>

            {selectedMovement ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedMovement.movementNumber}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Loại: {getMovementTypeLabel(selectedMovement.movementType)}</span>
                    <span>Chiều: {getDirectionLabel(selectedMovement.direction)}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div className="col-span-2">
                    <span className="text-[9px] text-foreground/50 font-mono block">Nguyên liệu chuẩn</span>
                    <span className="font-bold text-foreground block text-xs">{getIngredientName(selectedMovement.ingredientMasterId)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Số lượng</span>
                    <span className="font-bold text-gold block text-xs font-mono">
                      {selectedMovement.quantity} {selectedMovement.unit || 'kg'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ngày ghi nhận</span>
                    <span className="font-mono text-foreground/80 block">{selectedMovement.movementDate}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Nguồn phát sinh</span>
                    <span className="font-mono text-foreground/60 block">{selectedMovement.sourceType || 'Kiểm kê thủ công'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Số tham chiếu</span>
                    <span className="font-mono text-foreground/60 block">{selectedMovement.referenceNumber || '-'}</span>
                  </div>
                </div>

                {selectedMovement.reason && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Lý do biến động</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedMovement.reason}</p>
                  </div>
                )}

                {selectedMovement.notes && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú nội bộ</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedMovement.notes}</p>
                  </div>
                )}

                <div className="grid gap-1 grid-cols-2 text-[8px] text-foreground/45 font-mono border-t border-gold-border/10 pt-2.5">
                  <div>Người ghi: {selectedMovement.createdBy || 'Quản trị viên'}</div>
                  <div>Ghi nhận lúc: {selectedMovement.createdAt}</div>
                </div>

                <div className="border-t border-gold-border/20 pt-4 flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Liên kết module liên quan</span>
                  <div className="flex gap-2">
                    <Link
                      href="/studio/goods-receipts"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      🧾 Xem phiếu nhận
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
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một dòng biến động từ danh sách để xem chi tiết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InventoryMovementsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải lịch sử kho…</p>
      </div>
    }>
      <InventoryMovementsPageContent />
    </Suspense>
  )
}
