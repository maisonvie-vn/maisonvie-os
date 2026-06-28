'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type InventoryWacRunStatus =
  | 'draft'
  | 'completed'
  | 'completed_with_warnings'
  | 'failed'
  | 'cancelled'

export type InventoryWacCalculationStatus =
  | 'pending'
  | 'calculated'
  | 'missing_costing_unit'
  | 'missing_conversion'
  | 'missing_price'
  | 'no_receipts'
  | 'incomplete'
  | 'error'

export interface InventoryWacRun {
  id: string
  runNumber: string
  runDate: string
  status: InventoryWacRunStatus
  notes?: string | null
  createdBy?: string | null
  startedAt?: string | null
  completedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface InventoryWacItem {
  id: string
  wacRunId: string
  ingredientMasterId: string
  costingUnit?: string | null
  totalAcceptedQuantity: number
  totalNormalizedQuantity: number
  totalPurchaseCost: number
  wacUnitCost?: number | null
  calculationStatus: InventoryWacCalculationStatus
  warningMessage?: string | null
  sourceLineCount: number
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
  status: string
}

interface GoodsReceiptItem {
  id: string
  goodsReceiptId: string
  ingredientMasterId?: string | null
  acceptedQuantity: number
  unit?: string | null
  unitPrice?: number | null
  issueNote?: string | null
}

interface UnitConversion {
  id: string
  ingredientMasterId?: string | null
  fromUnit: string
  toUnit: string
  factor: number
  conversionType: string
  isActive: boolean
}

const INITIAL_WAC_RUNS: InventoryWacRun[] = [
  {
    id: 'wac-run-901',
    runNumber: 'WAC-20260630-01',
    runDate: '2026-06-30',
    status: 'completed',
    notes: 'Tính toán giá vốn bình quân định kỳ cuối tháng 6',
    createdBy: 'Quản trị viên',
    startedAt: '2026-06-30 08:00',
    completedAt: '2026-06-30 08:02',
    createdAt: '2026-06-30 08:00',
    updatedAt: '2026-06-30 08:02'
  }
]

const INITIAL_WAC_ITEMS: InventoryWacItem[] = [
  {
    id: 'wac-item-1',
    wacRunId: 'wac-run-901',
    ingredientMasterId: 'ing-master-001',
    costingUnit: 'kg',
    totalAcceptedQuantity: 15,
    totalNormalizedQuantity: 15,
    totalPurchaseCost: 3750000,
    wacUnitCost: 250000,
    calculationStatus: 'calculated',
    warningMessage: '',
    sourceLineCount: 1,
    createdAt: '2026-06-30 08:02',
    updatedAt: '2026-06-30 08:02'
  },
  {
    id: 'wac-item-2',
    wacRunId: 'wac-run-901',
    ingredientMasterId: 'ing-master-004',
    costingUnit: 'kg',
    totalAcceptedQuantity: 10,
    totalNormalizedQuantity: 10,
    totalPurchaseCost: 450000,
    wacUnitCost: 45000,
    calculationStatus: 'calculated',
    warningMessage: '',
    sourceLineCount: 1,
    createdAt: '2026-06-30 08:02',
    updatedAt: '2026-06-30 08:02'
  }
]

function WacPageContent() {
  const [runs, setRuns] = useState<InventoryWacRun[]>([])
  const [wacItems, setWacItems] = useState<InventoryWacItem[]>([])
  const [masterIngredients, setMasterIngredients] = useState<IngredientMaster[]>([])
  const [goodsReceipts, setGoodsReceipts] = useState<GoodsReceipt[]>([])
  const [goodsReceiptItems, setGoodsReceiptItems] = useState<GoodsReceiptItem[]>([])
  const [unitConversions, setUnitConversions] = useState<UnitConversion[]>([])
  const [selectedRun, setSelectedRun] = useState<InventoryWacRun | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Creation form
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedRuns = localStorage.getItem('mvos_wac_runs')
        const storedWacItems = localStorage.getItem('mvos_wac_items')
        const storedIngredients = localStorage.getItem('mvos_ingredients')
        const storedGRs = localStorage.getItem('mvos_goods_receipts')
        const storedGRItems = localStorage.getItem('mvos_goods_receipt_items')
        const storedConversions = localStorage.getItem('mvos_unit_conversions')

        let loadedRuns: InventoryWacRun[] = []
        let loadedWacItems: InventoryWacItem[] = []
        let loadedIngredients: IngredientMaster[] = []
        let loadedGRs: GoodsReceipt[] = []
        let loadedGRItems: GoodsReceiptItem[] = []
        let loadedConversions: UnitConversion[] = []

        if (storedRuns) {
          loadedRuns = JSON.parse(storedRuns)
        } else {
          localStorage.setItem('mvos_wac_runs', JSON.stringify(INITIAL_WAC_RUNS))
          loadedRuns = INITIAL_WAC_RUNS
        }
        setRuns(loadedRuns)

        if (storedWacItems) {
          loadedWacItems = JSON.parse(storedWacItems)
        } else {
          localStorage.setItem('mvos_wac_items', JSON.stringify(INITIAL_WAC_ITEMS))
          loadedWacItems = INITIAL_WAC_ITEMS
        }
        setWacItems(loadedWacItems)

        if (storedIngredients) loadedIngredients = JSON.parse(storedIngredients)
        setMasterIngredients(loadedIngredients)

        if (storedGRs) loadedGRs = JSON.parse(storedGRs)
        setGoodsReceipts(loadedGRs)

        if (storedGRItems) loadedGRItems = JSON.parse(storedGRItems)
        setGoodsReceiptItems(loadedGRItems)

        if (storedConversions) loadedConversions = JSON.parse(storedConversions)
        setUnitConversions(loadedConversions)

        if (loadedRuns.length > 0) {
          setSelectedRun(loadedRuns[0])
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu tính toán giá vốn.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault()
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const runNum = `WAC-${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}-${Date.now().toString().slice(-3)}`

    const newRun: InventoryWacRun = {
      id: `wac-run-${Date.now().toString().slice(-4)}`,
      runNumber: runNum,
      runDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      notes: notes.trim() || null,
      createdBy: 'Quản trị viên',
      createdAt: nowStr,
      updatedAt: nowStr
    }

    const updated = [...runs, newRun]
    localStorage.setItem('mvos_wac_runs', JSON.stringify(updated))
    setRuns(updated)
    setSelectedRun(newRun)
    setNotes('')

    alert('Lần tính WAC đã được tạo.')
  }

  const handleCalculateWac = (runId: string) => {
    const run = runs.find(r => r.id === runId)
    if (!run) return

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)

    // Filter valid receipts (not cancelled)
    const validGRs = goodsReceipts.filter(gr => gr.status !== 'cancelled')
    const activeConversions = unitConversions.filter(uc => uc.isActive)

    const newItems: InventoryWacItem[] = masterIngredients.map((ing, idx) => {
      const costingUnit = ing.defaultUnit || 'kg'
      if (!costingUnit) {
        return {
          id: `wac-item-${Date.now().toString().slice(-4)}-${idx}`,
          wacRunId: runId,
          ingredientMasterId: ing.id,
          costingUnit: null,
          totalAcceptedQuantity: 0,
          totalNormalizedQuantity: 0,
          totalPurchaseCost: 0,
          wacUnitCost: null,
          calculationStatus: 'missing_costing_unit',
          warningMessage: 'Thiếu đơn vị tính giá của nguyên liệu',
          sourceLineCount: 0,
          createdAt: nowStr,
          updatedAt: nowStr
        }
      }

      // Filter accepted items from valid receipts
      const grLines = goodsReceiptItems.filter(item => 
        item.ingredientMasterId === ing.id &&
        item.acceptedQuantity > 0 &&
        validGRs.some(gr => gr.id === item.goodsReceiptId)
      )

      if (grLines.length === 0) {
        return {
          id: `wac-item-${Date.now().toString().slice(-4)}-${idx}`,
          wacRunId: runId,
          ingredientMasterId: ing.id,
          costingUnit,
          totalAcceptedQuantity: 0,
          totalNormalizedQuantity: 0,
          totalPurchaseCost: 0,
          wacUnitCost: null,
          calculationStatus: 'no_receipts',
          warningMessage: 'Chưa có phiếu nhận hàng hợp lệ để tính WAC',
          sourceLineCount: 0,
          createdAt: nowStr,
          updatedAt: nowStr
        }
      }

      let totalAccepted = 0
      let totalNormalized = 0
      let totalCost = 0
      let sourceCount = 0
      let hasMissingPrice = false
      let hasMissingConversion = false

      grLines.forEach((item) => {
        sourceCount += 1
        totalAccepted += item.acceptedQuantity

        // Check price
        if (item.unitPrice === null || item.unitPrice === undefined) {
          hasMissingPrice = true
          return
        }

        const lineCost = item.acceptedQuantity * item.unitPrice
        totalCost += lineCost

        // Check conversion
        const itemUnit = (item.unit || 'kg').trim().toLowerCase()
        const targetUnit = costingUnit.trim().toLowerCase()

        if (itemUnit === targetUnit) {
          totalNormalized += item.acceptedQuantity
        } else {
          // Look up active conversion
          let conv = activeConversions.find(c =>
            c.conversionType === 'ingredient_specific' &&
            c.ingredientMasterId === ing.id &&
            c.fromUnit.toLowerCase() === itemUnit &&
            c.toUnit.toLowerCase() === targetUnit
          )

          if (!conv) {
            conv = activeConversions.find(c =>
              c.conversionType === 'global' &&
              c.fromUnit.toLowerCase() === itemUnit &&
              c.toUnit.toLowerCase() === targetUnit
            )
          }

          if (conv) {
            totalNormalized += item.acceptedQuantity * conv.factor
          } else {
            hasMissingConversion = true
          }
        }
      })

      let calcStatus: InventoryWacCalculationStatus = 'calculated'
      let warnMsg: string | null = null
      let wacCost: number | null = null

      if (hasMissingConversion) {
        calcStatus = 'missing_conversion'
        warnMsg = 'Không thể tính WAC vì thiếu quy đổi đơn vị.'
      } else if (hasMissingPrice) {
        calcStatus = 'missing_price'
        warnMsg = 'Không thể tính WAC vì thiếu giá mua.'
      } else if (totalNormalized === 0) {
        calcStatus = 'incomplete'
        warnMsg = 'Không đầy đủ dữ liệu tính toán.'
      } else {
        wacCost = Math.round((totalCost / totalNormalized) * 100) / 100
      }

      return {
        id: `wac-item-${Date.now().toString().slice(-4)}-${idx}`,
        wacRunId: runId,
        ingredientMasterId: ing.id,
        costingUnit,
        totalAcceptedQuantity: totalAccepted,
        totalNormalizedQuantity: totalNormalized,
        totalPurchaseCost: totalCost,
        wacUnitCost: wacCost,
        calculationStatus: calcStatus,
        warningMessage: warnMsg,
        sourceLineCount: sourceCount,
        createdAt: nowStr,
        updatedAt: nowStr
      }
    })

    const hasWarnings = newItems.some(
      item => item.calculationStatus !== 'calculated' && item.calculationStatus !== 'no_receipts'
    )
    const runStatus: InventoryWacRunStatus = hasWarnings ? 'completed_with_warnings' : 'completed'

    // Filter out previous items for this run
    const keptItems = wacItems.filter(item => item.wacRunId !== runId)
    const updatedItems = [...keptItems, ...newItems]

    const updatedRuns = runs.map((r) => {
      if (r.id === runId) {
        const item: InventoryWacRun = {
          ...r,
          status: runStatus,
          startedAt: nowStr,
          completedAt: nowStr,
          updatedAt: nowStr
        }
        setSelectedRun(item)
        return item
      }
      return r
    })

    localStorage.setItem('mvos_wac_runs', JSON.stringify(updatedRuns))
    localStorage.setItem('mvos_wac_items', JSON.stringify(updatedItems))

    setRuns(updatedRuns)
    setWacItems(updatedItems)

    if (runStatus === 'completed_with_warnings') {
      alert('WAC đã được tính xong nhưng có cảnh báo.')
    } else {
      alert('WAC đã được tính xong.')
    }
  }

  const getRunStatusLabel = (s: InventoryWacRunStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'completed': return 'Hoàn thành'
      case 'completed_with_warnings': return 'Hoàn thành có cảnh báo'
      case 'failed': return 'Thất bại'
      case 'cancelled': return 'Đã hủy'
      default: return s
    }
  }

  const getRunStatusClass = (s: InventoryWacRunStatus) => {
    switch (s) {
      case 'completed': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'completed_with_warnings': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'failed': return 'bg-red-500/10 border border-red-500/25 text-red-400 font-bold'
      case 'cancelled': return 'bg-foreground/5 border border-foreground/10 text-foreground/40 line-through'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getCalculationStatusLabel = (s: InventoryWacCalculationStatus) => {
    switch (s) {
      case 'calculated': return 'Đã tính xong'
      case 'missing_costing_unit': return 'Thiếu đơn vị tính giá'
      case 'missing_conversion': return 'Thiếu quy đổi đơn vị'
      case 'missing_price': return 'Thiếu giá mua'
      case 'no_receipts': return 'Chưa có phiếu nhận hợp lệ'
      case 'incomplete': return 'Không đầy đủ dữ liệu'
      case 'pending': return 'Đang chờ'
      default: return 'Lỗi hệ thống'
    }
  }

  const getCalculationStatusClass = (s: InventoryWacCalculationStatus) => {
    switch (s) {
      case 'calculated': return 'text-green-400 font-bold'
      case 'pending': return 'text-foreground/50'
      case 'no_receipts': return 'text-foreground/40 italic'
      default: return 'text-red-400 font-semibold'
    }
  }

  const getIngredientName = (id: string) => {
    const found = masterIngredients.find(m => m.id === id)
    return found ? found.ingredientNameVi : id
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải dữ liệu tính toán giá vốn…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4 font-sans">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải dữ liệu tính toán giá vốn.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Statistics
  const latestCalculatedItems = wacItems.filter(item => 
    item.calculationStatus === 'calculated' &&
    item.wacRunId === selectedRun?.id
  )

  const maxWacCost = latestCalculatedItems.length > 0
    ? Math.max(...latestCalculatedItems.map(item => item.wacUnitCost || 0))
    : 0

  const validWacCount = latestCalculatedItems.length

  const selectedWacItems = selectedRun
    ? wacItems.filter(item => item.wacRunId === selectedRun.id)
    : []

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          ⚖️ Giá vốn bình quân (Weighted Average Cost - WAC)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Tính toán giá vốn bình quân gia quyền của nguyên liệu dựa trên các phiếu nhận hàng thực tế đã được duyệt.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="glass-panel p-4 rounded-xl border border-gold-border/20 bg-gold-muted/5 flex items-start gap-3">
        <span className="text-base text-gold mt-0.5">💡</span>
        <div className="text-xs space-y-1">
          <p className="font-bold text-gold">Giá vốn bình quân trong bước này phục vụ quản trị nội bộ.</p>
          <p className="text-foreground/70 font-medium">Hệ thống chưa tính giá vốn món ăn, chưa tính COGS kế toán và chưa thay thế hóa đơn/chứng từ kế toán.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng lần chạy tính</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{runs.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tính thành công</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">
            {runs.filter(r => r.status === 'completed' || r.status === 'completed_with_warnings').length}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Nguyên liệu có giá vốn</span>
          <span className="text-2xl font-serif-cormorant font-bold text-foreground mt-1 block">{validWacCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Giá vốn cao nhất</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-400 mt-1 block font-mono">
            {maxWacCost.toLocaleString('vi-VN')} đ
          </span>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: WAC Runs list & Create form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Số phiên tính WAC</th>
                    <th className="py-3 px-4">Ngày chạy</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4">Người chạy</th>
                    <th className="py-3 px-4 text-center">Ngày hoàn thành</th>
                    <th className="py-3 px-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {runs.length > 0 ? (
                    runs.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRun(r)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedRun?.id === r.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{r.runNumber}</td>
                        <td className="py-3.5 px-4 font-mono">{r.runDate}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getRunStatusClass(r.status)}`}>
                            {getRunStatusLabel(r.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/70">{r.createdBy || '-'}</td>
                        <td className="py-3.5 px-4 text-center font-mono text-foreground/60">{r.completedAt || '-'}</td>
                        <td className="py-3.5 px-4 text-foreground/60 max-w-[150px] truncate">{r.notes || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có lịch sử tính toán giá vốn WAC nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: WAC Run */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo phiên tính toán WAC mới (Draft)
            </h3>

            <form onSubmit={handleCreateRun} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Ghi chú mục đích chạy tính</label>
                <input
                  type="text"
                  placeholder="Tính giá vốn bình quân gia quyền tháng 6 phục vụ phân tích..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Khởi tạo phiên tính toán
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed items of selected WAC run */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2 font-serif-cormorant">
              🔎 Chi tiết kết quả tính WAC
            </h3>

            {selectedRun ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedRun.runNumber}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Trạng thái: {getRunStatusLabel(selectedRun.status)}</span>
                    <span>Ngày tạo: {selectedRun.createdAt}</span>
                  </div>
                </div>

                {selectedRun.notes && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú phiên</span>
                    <p className="text-foreground/80 font-sans leading-relaxed">{selectedRun.notes}</p>
                  </div>
                )}

                {/* Calculate Trigger Button for Draft Runs */}
                {selectedRun.status === 'draft' && (
                  <button
                    onClick={() => handleCalculateWac(selectedRun.id)}
                    className="w-full rounded bg-gold hover:bg-gold-hover text-background py-2 text-xs font-bold transition-all text-center font-serif-cormorant uppercase tracking-wider"
                  >
                    ⚡ Bắt đầu tính toán WAC
                  </button>
                )}

                {/* Wac Items list */}
                <div className="border-t border-gold-border/20 pt-4 space-y-3">
                  <span className="text-[10px] text-gold font-serif-cormorant font-bold uppercase tracking-wider block">🥗 Chi tiết kết quả nguyên liệu</span>

                  {selectedWacItems.length > 0 ? (
                    <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                      {selectedWacItems.map((item) => (
                        <div key={item.id} className="p-3 bg-background/50 rounded border border-gold-border/10 space-y-1.5 text-[10px]">
                          <div className="flex justify-between items-start border-b border-gold-border/5 pb-1">
                            <span className="font-bold text-foreground">
                              {getIngredientName(item.ingredientMasterId)}
                            </span>
                            <span className="font-mono text-[9px] text-gold font-bold">
                              {item.wacUnitCost !== null && item.wacUnitCost !== undefined ? `${item.wacUnitCost.toLocaleString('vi-VN')} đ / ${item.costingUnit || ''}` : 'N/A'}
                            </span>
                          </div>

                          <div className="grid gap-2 grid-cols-2 text-[9px] text-foreground/70">
                            <div>Nhập đạt: {item.totalAcceptedQuantity} {item.costingUnit}</div>
                            <div>Đã quy đổi: {item.totalNormalizedQuantity} {item.costingUnit}</div>
                            <div className="col-span-2">Tổng giá trị: {item.totalPurchaseCost.toLocaleString('vi-VN')} đ (từ {item.sourceLineCount} dòng nhận)</div>
                          </div>

                          <div className="flex justify-between items-center pt-1 border-t border-gold-border/5 text-[9px]">
                            <span className={getCalculationStatusClass(item.calculationStatus)}>
                              {getCalculationStatusLabel(item.calculationStatus)}
                            </span>
                          </div>

                          {item.warningMessage && (
                            <p className="text-[8px] text-red-400 font-semibold italic">⚠️ {item.warningMessage}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[9px] text-foreground/45 italic text-center py-6">Chưa chạy tính toán hoặc kết quả trống.</p>
                  )}
                </div>

                <div className="border-t border-gold-border/20 pt-4 flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Liên kết module liên quan</span>
                  <div className="flex gap-2">
                    <Link
                      href="/studio/conversions"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      ⚖️ Quy đổi đơn vị
                    </Link>
                    <Link
                      href="/studio/stock-balances"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      📋 Xem tồn kho
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một phiên tính toán WAC ở bên trái để xem kết quả.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WacPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải cấu hình tính giá vốn…</p>
      </div>
    }>
      <WacPageContent />
    </Suspense>
  )
}
