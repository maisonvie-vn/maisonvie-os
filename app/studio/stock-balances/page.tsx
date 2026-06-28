'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export interface InventoryStockBalance {
  ingredientMasterId: string
  ingredientNameVi: string
  unit: string
  totalInQuantity: number
  totalOutQuantity: number
  totalAdjustmentQuantity: number
  currentQuantity: number
  lastMovementDate: string
  movementCount: number
  hasMultipleUnits: boolean
}

interface IngredientMaster {
  id: string
  ingredientNameVi: string
  defaultUnit: string
}

interface InventoryMovement {
  id: string
  ingredientMasterId: string
  movementDate: string
  movementType: string
  direction: 'in' | 'out' | 'adjustment'
  quantity: number
  unit: string
}

function StockBalancesPageContent() {
  const [balances, setBalances] = useState<InventoryStockBalance[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [onlyLowStock, setOnlyLowStock] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedMovements = localStorage.getItem('mvos_inventory_movements')
        const storedMaster = localStorage.getItem('mvos_ingredients')

        let loadedMovements: InventoryMovement[] = []
        let loadedIngredients: IngredientMaster[] = []

        if (storedMovements) {
          loadedMovements = JSON.parse(storedMovements)
        }
        if (storedMaster) {
          loadedIngredients = JSON.parse(storedMaster)
        }

        // Calculate balances grouped by ingredientMasterId + unit
        const groups: Record<string, {
          ingredientMasterId: string
          unit: string
          totalIn: number
          totalOut: number
          totalAdjust: number
          current: number
          lastDate: string
          count: number
        }> = {}

        // Track how many unique units each ingredient has
        const ingredientUnits: Record<string, Set<string>> = {}

        loadedMovements.forEach((m) => {
          const key = `${m.ingredientMasterId}_${m.unit || 'kg'}`
          
          if (!ingredientUnits[m.ingredientMasterId]) {
            ingredientUnits[m.ingredientMasterId] = new Set()
          }
          ingredientUnits[m.ingredientMasterId].add(m.unit || 'kg')

          if (!groups[key]) {
            groups[key] = {
              ingredientMasterId: m.ingredientMasterId,
              unit: m.unit || 'kg',
              totalIn: 0,
              totalOut: 0,
              totalAdjust: 0,
              current: 0,
              lastDate: m.movementDate,
              count: 0
            }
          }

          const g = groups[key]
          g.count += 1
          
          if (new Date(m.movementDate) > new Date(g.lastDate)) {
            g.lastDate = m.movementDate
          }

          if (m.direction === 'in') {
            g.totalIn += m.quantity
            g.current += m.quantity
          } else if (m.direction === 'out') {
            g.totalOut += m.quantity
            g.current -= m.quantity
          } else if (m.direction === 'adjustment') {
            g.totalAdjust += m.quantity
            g.current += m.quantity
          }
        })

        // Map to final array
        const finalBalances: InventoryStockBalance[] = Object.values(groups).map((g) => {
          const ing = loadedIngredients.find(i => i.id === g.ingredientMasterId)
          const name = ing ? ing.ingredientNameVi : g.ingredientMasterId
          const unitsSet = ingredientUnits[g.ingredientMasterId]
          const multiple = unitsSet ? unitsSet.size > 1 : false

          return {
            ingredientMasterId: g.ingredientMasterId,
            ingredientNameVi: name,
            unit: g.unit,
            totalInQuantity: g.totalIn,
            totalOutQuantity: g.totalOut,
            totalAdjustmentQuantity: g.totalAdjust,
            currentQuantity: g.current,
            lastMovementDate: g.lastDate,
            movementCount: g.count,
            hasMultipleUnits: multiple
          }
        })

        setBalances(finalBalances)
        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu tồn kho. Vui lòng thử lại.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tính toán tồn kho hiện tại…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4 font-sans">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Lỗi đồng bộ dữ liệu</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Filter
  const filtered = balances.filter((b) => {
    const matchesSearch = b.ingredientNameVi.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLowStock = onlyLowStock ? b.currentQuantity <= 0 : true
    return matchesSearch && matchesLowStock
  })

  // Summary Metrics
  const totalTrackedIngredients = new Set(balances.map(b => b.ingredientMasterId)).size
  const emptyStockCount = balances.filter(b => b.currentQuantity === 0).length
  const negativeStockCount = balances.filter(b => b.currentQuantity < 0).length
  const multipleUnitsCount = balances.filter(b => b.hasMultipleUnits).length / 2 // Approximate

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          📋 Tồn kho hiện tại (Stock Balance)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Xem số dư tồn kho của nguyên liệu được tổng hợp trực tiếp từ lịch sử biến động kho.
        </p>
      </div>

      {/* Guide Banner */}
      <div className="glass-panel p-4 rounded-xl border border-gold-border/20 bg-gold-muted/5 flex items-start gap-3">
        <span className="text-base text-gold mt-0.5">💡</span>
        <div className="text-xs space-y-1">
          <p className="font-bold text-gold">Tồn kho hiện tại được tính từ lịch sử biến động kho.</p>
          <p className="text-foreground/70">Không thể sửa trực tiếp số tồn. Để điều chỉnh tồn kho vật lý hoặc hao hụt, vui lòng tạo phiếu biến động kho thủ công.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Nguyên liệu theo dõi</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalTrackedIngredients}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã hết hàng (0)</span>
          <span className="text-2xl font-serif-cormorant font-bold text-foreground mt-1 block">{emptyStockCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tồn kho âm (&lt;0)</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{negativeStockCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Nhiều đơn vị</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{Math.ceil(multipleUnitsCount)}</span>
        </div>
      </div>

      {/* Filter and Action panel */}
      <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 flex flex-wrap justify-between items-center gap-4 text-xs">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] text-foreground/50 uppercase font-mono">Tìm kiếm nguyên liệu</label>
            <input
              type="text"
              placeholder="Nhập tên nguyên liệu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded border border-gold-border/30 bg-background px-3 py-1 text-xs text-foreground focus:border-gold focus:outline-none w-[200px]"
            />
          </div>

          <label className="flex items-center gap-2 mt-4 cursor-pointer">
            <input
              type="checkbox"
              checked={onlyLowStock}
              onChange={(e) => setOnlyLowStock(e.target.checked)}
              className="rounded border-gold-border text-gold focus:ring-gold bg-background"
            />
            <span className="text-foreground/80">Chỉ hiển thị hết tồn / tồn âm</span>
          </label>
        </div>

        <div className="flex gap-2">
          <Link
            href="/studio/inventory-movements"
            className="rounded border border-gold/45 hover:border-gold py-1.5 px-3 text-gold bg-gold-muted/5 hover:bg-gold/15 transition-all text-xs font-semibold"
          >
            ➕ Tạo điều chỉnh kho
          </Link>
          <Link
            href="/studio/inventory-movements"
            className="rounded border border-gold-border/40 hover:border-gold py-1.5 px-3 text-foreground/75 hover:text-gold transition-all text-xs"
          >
            📋 Xem lịch sử biến động
          </Link>
        </div>
      </div>

      {/* Stock Balance List */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Nguyên liệu</th>
                <th className="py-3 px-4">Đơn vị</th>
                <th className="py-3 px-4 text-right">Tổng nhập</th>
                <th className="py-3 px-4 text-right">Tổng xuất</th>
                <th className="py-3 px-4 text-right">Tổng điều chỉnh</th>
                <th className="py-3 px-4 text-right">Số tồn hiện tại</th>
                <th className="py-3 px-4">Biến động gần nhất</th>
                <th className="py-3 px-4 text-center">Số lần biến động</th>
                <th className="py-3 px-4 text-center">Cảnh báo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {filtered.length > 0 ? (
                filtered.map((b, idx) => (
                  <tr key={`${b.ingredientMasterId}_${b.unit}_${idx}`} className="hover:bg-gold-muted/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-foreground">{b.ingredientNameVi}</td>
                    <td className="py-3.5 px-4 font-mono font-semibold text-foreground/75">{b.unit}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-green-400 font-semibold">{b.totalInQuantity}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-red-400">{b.totalOutQuantity}</td>
                    <td className="py-3.5 px-4 text-right font-mono text-yellow-500">{b.totalAdjustmentQuantity}</td>
                    <td className={`py-3.5 px-4 text-right font-mono font-bold text-sm ${b.currentQuantity < 0 ? 'text-red-400' : b.currentQuantity === 0 ? 'text-foreground/40' : 'text-gold'}`}>
                      {b.currentQuantity}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-foreground/60">{b.lastMovementDate}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-foreground/60">{b.movementCount}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex flex-col gap-1 items-center">
                        {b.currentQuantity < 0 && (
                          <span className="rounded bg-red-500/10 border border-red-500/25 px-1.5 py-0.5 text-[8px] text-red-400 font-bold">
                            ⚠️ Tồn kho âm
                          </span>
                        )}
                        {b.currentQuantity === 0 && (
                          <span className="rounded bg-foreground/5 border border-foreground/15 px-1.5 py-0.5 text-[8px] text-foreground/50">
                            Hết tồn
                          </span>
                        )}
                        {b.hasMultipleUnits && (
                          <span className="rounded bg-yellow-500/10 border border-yellow-500/25 px-1.5 py-0.5 text-[8px] text-yellow-500 block" title="Nguyên liệu này đang có nhiều đơn vị, chưa quy đổi tự động">
                            Nhiều đơn vị
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-foreground/40 font-serif-cormorant italic text-base">
                    Chưa có biến động kho hoặc dữ liệu tồn kho trống.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default function StockBalancesPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải dữ liệu tồn kho…</p>
      </div>
    }>
      <StockBalancesPageContent />
    </Suspense>
  )
}
