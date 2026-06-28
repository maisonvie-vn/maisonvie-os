'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type RecipeCostingRunStatus =
  | 'draft'
  | 'completed'
  | 'completed_with_warnings'
  | 'failed'
  | 'cancelled'

export type RecipeCostingStatus =
  | 'pending'
  | 'calculated'
  | 'calculated_with_warnings'
  | 'no_ingredients'
  | 'incomplete'
  | 'error'

export type RecipeCostingLineStatus =
  | 'pending'
  | 'calculated'
  | 'missing_ingredient'
  | 'missing_quantity'
  | 'missing_unit'
  | 'missing_wac'
  | 'missing_conversion'
  | 'incomplete'
  | 'error'

export interface RecipeCostingRun {
  id: string
  runNumber: string
  runDate: string
  sourceWacRunId?: string | null
  status: RecipeCostingRunStatus
  notes?: string | null
  createdBy?: string | null
  startedAt?: string | null
  completedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface RecipeCostingItem {
  id: string
  recipeCostingRunId: string
  recipeId: string
  totalRecipeCost?: number | null
  costPerPortion?: number | null
  portionCount?: number | null
  costingStatus: RecipeCostingStatus
  warningMessage?: string | null
  calculatedLineCount: number
  warningLineCount: number
  totalLineCount: number
  createdAt: string
  updatedAt: string
}

export interface RecipeCostingLine {
  id: string
  recipeCostingItemId: string
  recipeIngredientId?: string | null
  recipeId: string
  ingredientId?: string | null
  ingredientName?: string | null
  recipeQuantity?: number | null
  recipeUnit?: string | null
  costingUnit?: string | null
  normalizedQuantity?: number | null
  wacUnitCost?: number | null
  lineCost?: number | null
  lineStatus: RecipeCostingLineStatus
  warningMessage?: string | null
  createdAt: string
  updatedAt: string
}

interface Recipe {
  id: string
  recipeCode?: string | null
  recipeName: string
  portionQuantity?: number | null
  yieldQuantity?: number | null
}

interface RecipeIngredientLine {
  id: string
  recipeId: string
  ingredientName: string
  quantity?: number | null
  unit?: string | null
  ingredientMasterId?: string | null
}

interface IngredientMaster {
  id: string
  ingredientNameVi: string
  defaultUnit: string
}

interface InventoryWacRun {
  id: string
  runNumber: string
  status: string
}

interface InventoryWacItem {
  id: string
  wacRunId: string
  ingredientMasterId: string
  costingUnit?: string | null
  wacUnitCost?: number | null
  calculationStatus: string
}

interface UnitConversion {
  id: string
  ingredientMasterId?: string | null
  fromUnit: string
  toUnit: string
  factor: number
  isActive: boolean
}

const INITIAL_COSTING_RUNS: RecipeCostingRun[] = [
  {
    id: 'rc-run-1',
    runNumber: 'RCC-20260630-01',
    runDate: '2026-06-30',
    sourceWacRunId: 'wac-run-901',
    status: 'completed_with_warnings',
    notes: 'Tính toán giá vốn công thức lý thuyết định kỳ cuối tháng 6',
    createdBy: 'Quản trị viên',
    startedAt: '2026-06-30 09:00',
    completedAt: '2026-06-30 09:02',
    createdAt: '2026-06-30 09:00',
    updatedAt: '2026-06-30 09:02'
  }
]

const INITIAL_COSTING_ITEMS: RecipeCostingItem[] = [
  {
    id: 'rc-item-1',
    recipeCostingRunId: 'rc-run-1',
    recipeId: 'rec-401',
    totalRecipeCost: 147500, // Derived from calculated lines (125000 + 22500)
    costPerPortion: 14750, // 147500 / 10 portions
    portionCount: 10,
    costingStatus: 'calculated_with_warnings',
    warningMessage: 'Có 5 nguyên liệu thiếu dữ liệu giá vốn bình quân (WAC) hoặc quy đổi.',
    calculatedLineCount: 2,
    warningLineCount: 5,
    totalLineCount: 7,
    createdAt: '2026-06-30 09:02',
    updatedAt: '2026-06-30 09:02'
  }
]

const INITIAL_COSTING_LINES: RecipeCostingLine[] = [
  {
    id: 'rc-line-1',
    recipeCostingItemId: 'rc-item-1',
    recipeIngredientId: 'ing-1',
    recipeId: 'rec-401',
    ingredientId: 'ing-master-001',
    ingredientName: 'Tôm hùm nước ngọt',
    recipeQuantity: 500,
    recipeUnit: 'g',
    costingUnit: 'kg',
    normalizedQuantity: 0.5,
    wacUnitCost: 250000,
    lineCost: 125000,
    lineStatus: 'calculated',
    warningMessage: null,
    createdAt: '2026-06-30 09:02',
    updatedAt: '2026-06-30 09:02'
  },
  {
    id: 'rc-line-2',
    recipeCostingItemId: 'rc-item-1',
    recipeIngredientId: 'ing-2',
    recipeId: 'rec-401',
    ingredientId: null,
    ingredientName: 'Cá hồi phi lê',
    recipeQuantity: 400,
    recipeUnit: 'g',
    costingUnit: null,
    normalizedQuantity: null,
    wacUnitCost: null,
    lineCost: null,
    lineStatus: 'missing_ingredient',
    warningMessage: 'Chưa chuẩn hóa/bản đồ với nguyên liệu hệ thống.',
    createdAt: '2026-06-30 09:02',
    updatedAt: '2026-06-30 09:02'
  },
  {
    id: 'rc-line-3',
    recipeCostingItemId: 'rc-item-1',
    recipeIngredientId: 'ing-3',
    recipeId: 'rec-401',
    ingredientId: null,
    ingredientName: 'Cá chẽm phi lê',
    recipeQuantity: 400,
    recipeUnit: 'g',
    costingUnit: null,
    normalizedQuantity: null,
    wacUnitCost: null,
    lineCost: null,
    lineStatus: 'missing_ingredient',
    warningMessage: 'Chưa chuẩn hóa/bản đồ với nguyên liệu hệ thống.',
    createdAt: '2026-06-30 09:02',
    updatedAt: '2026-06-30 09:02'
  },
  {
    id: 'rc-line-4',
    recipeCostingItemId: 'rc-item-1',
    recipeIngredientId: 'ing-4',
    recipeId: 'rec-401',
    ingredientId: 'ing-master-004',
    ingredientName: 'Nghêu tươi',
    recipeQuantity: 500,
    recipeUnit: 'g',
    costingUnit: 'kg',
    normalizedQuantity: 0.5,
    wacUnitCost: 45000,
    lineCost: 22500,
    lineStatus: 'calculated',
    warningMessage: null,
    createdAt: '2026-06-30 09:02',
    updatedAt: '2026-06-30 09:02'
  },
  {
    id: 'rc-line-5',
    recipeCostingItemId: 'rc-item-1',
    recipeIngredientId: 'ing-5',
    recipeId: 'rec-401',
    ingredientId: null,
    ingredientName: 'Cà chua chín',
    recipeQuantity: 300,
    recipeUnit: 'g',
    costingUnit: null,
    normalizedQuantity: null,
    wacUnitCost: null,
    lineCost: null,
    lineStatus: 'missing_ingredient',
    warningMessage: 'Chưa chuẩn hóa/bản đồ với nguyên liệu hệ thống.',
    createdAt: '2026-06-30 09:02',
    updatedAt: '2026-06-30 09:02'
  },
  {
    id: 'rc-line-6',
    recipeCostingItemId: 'rc-item-1',
    recipeIngredientId: 'ing-6',
    recipeId: 'rec-401',
    ingredientId: null,
    ingredientName: 'Nhụy hoa nghệ tây (Saffron)',
    recipeQuantity: 1,
    recipeUnit: 'g',
    costingUnit: null,
    normalizedQuantity: null,
    wacUnitCost: null,
    lineCost: null,
    lineStatus: 'missing_ingredient',
    warningMessage: 'Chưa chuẩn hóa/bản đồ với nguyên liệu hệ thống.',
    createdAt: '2026-06-30 09:02',
    updatedAt: '2026-06-30 09:02'
  },
  {
    id: 'rc-line-7',
    recipeCostingItemId: 'rc-item-1',
    recipeIngredientId: 'ing-7',
    recipeId: 'rec-401',
    ingredientId: null,
    ingredientName: 'Dầu ô liu nguyên chất',
    recipeQuantity: 50,
    recipeUnit: 'ml',
    costingUnit: null,
    normalizedQuantity: null,
    wacUnitCost: null,
    lineCost: null,
    lineStatus: 'missing_ingredient',
    warningMessage: 'Chưa chuẩn hóa/bản đồ với nguyên liệu hệ thống.',
    createdAt: '2026-06-30 09:02',
    updatedAt: '2026-06-30 09:02'
  }
]

function RecipesCostingPageContent() {
  const [runs, setRuns] = useState<RecipeCostingRun[]>([])
  const [costingItems, setCostingItems] = useState<RecipeCostingItem[]>([])
  const [costingLines, setCostingLines] = useState<RecipeCostingLine[]>([])

  // Master data sources
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recipeIngredientLines, setRecipeIngredientLines] = useState<RecipeIngredientLine[]>([])
  const [masterIngredients, setMasterIngredients] = useState<IngredientMaster[]>([])
  const [wacRuns, setWacRuns] = useState<InventoryWacRun[]>([])
  const [wacItems, setWacItems] = useState<InventoryWacItem[]>([])
  const [unitConversions, setUnitConversions] = useState<UnitConversion[]>([])

  const [selectedRun, setSelectedRun] = useState<RecipeCostingRun | null>(null)
  const [selectedItem, setSelectedItem] = useState<RecipeCostingItem | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Creation form
  const [notes, setNotes] = useState('')
  const [sourceWacRunId, setSourceWacRunId] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedRuns = localStorage.getItem('mvos_recipe_costing_runs')
        const storedItems = localStorage.getItem('mvos_recipe_costing_items')
        const storedLines = localStorage.getItem('mvos_recipe_costing_lines')

        const storedRecipes = localStorage.getItem('mvos_recipes')
        const storedRecipeLines = localStorage.getItem('mvos_recipe_ingredient_lines')
        const storedIngredients = localStorage.getItem('mvos_ingredients')
        const storedWacRuns = localStorage.getItem('mvos_wac_runs')
        const storedWacItems = localStorage.getItem('mvos_wac_items')
        const storedConversions = localStorage.getItem('mvos_unit_conversions')

        let loadedRuns: RecipeCostingRun[] = []
        let loadedItems: RecipeCostingItem[] = []
        let loadedLines: RecipeCostingLine[] = []

        let loadedRecipes: Recipe[] = []
        let loadedRecipeLines: RecipeIngredientLine[] = []
        let loadedIngredients: IngredientMaster[] = []
        let loadedWacRuns: InventoryWacRun[] = []
        let loadedWacItems: InventoryWacItem[] = []
        let loadedConversions: UnitConversion[] = []

        if (storedRuns) {
          loadedRuns = JSON.parse(storedRuns)
        } else {
          localStorage.setItem('mvos_recipe_costing_runs', JSON.stringify(INITIAL_COSTING_RUNS))
          loadedRuns = INITIAL_COSTING_RUNS
        }
        setRuns(loadedRuns)

        if (storedItems) {
          loadedItems = JSON.parse(storedItems)
        } else {
          localStorage.setItem('mvos_recipe_costing_items', JSON.stringify(INITIAL_COSTING_ITEMS))
          loadedItems = INITIAL_COSTING_ITEMS
        }
        setCostingItems(loadedItems)

        if (storedLines) {
          loadedLines = JSON.parse(storedLines)
        } else {
          localStorage.setItem('mvos_recipe_costing_lines', JSON.stringify(INITIAL_COSTING_LINES))
          loadedLines = INITIAL_COSTING_LINES
        }
        setCostingLines(loadedLines)

        if (storedRecipes) loadedRecipes = JSON.parse(storedRecipes)
        setRecipes(loadedRecipes)

        if (storedRecipeLines) loadedRecipeLines = JSON.parse(storedRecipeLines)
        setRecipeIngredientLines(loadedRecipeLines)

        if (storedIngredients) loadedIngredients = JSON.parse(storedIngredients)
        setMasterIngredients(loadedIngredients)

        if (storedWacRuns) loadedWacRuns = JSON.parse(storedWacRuns)
        setWacRuns(loadedWacRuns)

        if (storedWacItems) loadedWacItems = JSON.parse(storedWacItems)
        setWacItems(loadedWacItems)

        if (storedConversions) loadedConversions = JSON.parse(storedConversions)
        setUnitConversions(loadedConversions)

        if (loadedRuns.length > 0) {
          setSelectedRun(loadedRuns[0])
          const itemsOfRun = loadedItems.filter(i => i.recipeCostingRunId === loadedRuns[0].id)
          if (itemsOfRun.length > 0) {
            setSelectedItem(itemsOfRun[0])
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu tính giá vốn công thức.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault()
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const runNum = `RCC-${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}-${Date.now().toString().slice(-3)}`

    const newRun: RecipeCostingRun = {
      id: `rc-run-${Date.now().toString().slice(-4)}`,
      runNumber: runNum,
      runDate: new Date().toISOString().split('T')[0],
      sourceWacRunId: sourceWacRunId || null,
      status: 'draft',
      notes: notes.trim() || null,
      createdBy: 'Quản trị viên',
      createdAt: nowStr,
      updatedAt: nowStr
    }

    const updated = [...runs, newRun]
    localStorage.setItem('mvos_recipe_costing_runs', JSON.stringify(updated))
    setRuns(updated)
    setSelectedRun(newRun)
    setNotes('')
    setSourceWacRunId('')

    alert('Lần tính giá vốn công thức đã được tạo.')
  }

  const handleCalculateCosting = (runId: string) => {
    const run = runs.find(r => r.id === runId)
    if (!run) return

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)

    // Retrieve WAC data based on run config
    let validWacs = wacItems
    if (run.sourceWacRunId) {
      validWacs = wacItems.filter(w => w.wacRunId === run.sourceWacRunId)
    } else {
      // Find latest completed WAC run and use its items
      const completedWacRuns = wacRuns.filter(wr => wr.status === 'completed' || wr.status === 'completed_with_warnings')
      if (completedWacRuns.length > 0) {
        // Sort by date desc
        completedWacRuns.sort((a, b) => b.runNumber.localeCompare(a.runNumber))
        validWacs = wacItems.filter(w => w.wacRunId === completedWacRuns[0].id)
      }
    }

    const activeConversions = unitConversions.filter(uc => uc.isActive)
    const newItems: RecipeCostingItem[] = []
    const newLines: RecipeCostingLine[] = []

    recipes.forEach((rec) => {
      const recLines = recipeIngredientLines.filter(line => line.recipeId === rec.id)

      if (recLines.length === 0) {
        newItems.push({
          id: `rc-item-${Date.now().toString().slice(-4)}-${rec.id}`,
          recipeCostingRunId: runId,
          recipeId: rec.id,
          totalRecipeCost: null,
          costPerPortion: null,
          portionCount: rec.portionQuantity || rec.yieldQuantity || null,
          costingStatus: 'no_ingredients',
          warningMessage: 'Công thức chưa có nguyên liệu nào.',
          calculatedLineCount: 0,
          warningLineCount: 0,
          totalLineCount: 0,
          createdAt: nowStr,
          updatedAt: nowStr
        })
        return
      }

      let totalRecipeCost = 0
      let calculatedLineCount = 0
      let warningLineCount = 0
      const totalLineCount = recLines.length
      const itemId = `rc-item-${Date.now().toString().slice(-4)}-${rec.id}`

      recLines.forEach((line) => {
        let lineStatus: RecipeCostingLineStatus = 'calculated'
        let warnMsg: string | null = null
        let normalizedQty: number | null = null
        let lineCostVal: number | null = null
        let wacUnitCostVal: number | null = null
        let costingUnitVal: string | null = null

        const qty = line.quantity
        const unit = line.unit
        const ingId = line.ingredientMasterId

        if (!ingId) {
          lineStatus = 'missing_ingredient'
          warnMsg = 'Thiếu liên kết nguyên liệu hệ thống.'
          warningLineCount += 1
        } else if (qty === null || qty === undefined || qty <= 0) {
          lineStatus = 'missing_quantity'
          warnMsg = 'Số lượng nguyên liệu không hợp lệ.'
          warningLineCount += 1
        } else if (!unit) {
          lineStatus = 'missing_unit'
          warnMsg = 'Thiếu đơn vị đo lường trong công thức.'
          warningLineCount += 1
        } else {
          // Lookup WAC
          const ingWac = validWacs.find(w => w.ingredientMasterId === ingId)
          const ingMaster = masterIngredients.find(m => m.id === ingId)
          costingUnitVal = ingWac?.costingUnit || ingMaster?.defaultUnit || 'kg'
          wacUnitCostVal = ingWac?.wacUnitCost || null

          if (wacUnitCostVal === null || wacUnitCostVal === undefined) {
            lineStatus = 'missing_wac'
            warnMsg = 'Thiếu giá vốn bình quân (WAC) của nguyên liệu.'
            warningLineCount += 1
          } else {
            // Check conversion
            const rUnit = unit.trim().toLowerCase()
            const cUnit = costingUnitVal.trim().toLowerCase()

            if (rUnit === cUnit) {
              normalizedQty = qty
              lineCostVal = normalizedQty * wacUnitCostVal
              calculatedLineCount += 1
              totalRecipeCost += lineCostVal
            } else {
              // Lookup conversions
              let conv = activeConversions.find(c =>
                c.ingredientMasterId === ingId &&
                c.fromUnit.toLowerCase() === rUnit &&
                c.toUnit.toLowerCase() === cUnit
              )
              if (!conv) {
                conv = activeConversions.find(c =>
                  !c.ingredientMasterId &&
                  c.fromUnit.toLowerCase() === rUnit &&
                  c.toUnit.toLowerCase() === cUnit
                )
              }

              if (conv) {
                normalizedQty = qty * conv.factor
                lineCostVal = normalizedQty * wacUnitCostVal
                calculatedLineCount += 1
                totalRecipeCost += lineCostVal
              } else {
                lineStatus = 'missing_conversion'
                warnMsg = 'Thiếu quy đổi đơn vị từ đơn vị công thức sang đơn vị tính giá.'
                warningLineCount += 1
              }
            }
          }
        }

        newLines.push({
          id: `rc-line-${Date.now().toString().slice(-4)}-${line.id}`,
          recipeCostingItemId: itemId,
          recipeIngredientId: line.id,
          recipeId: rec.id,
          ingredientId: ingId || null,
          ingredientName: line.ingredientName,
          recipeQuantity: qty || null,
          recipeUnit: unit || null,
          costingUnit: costingUnitVal,
          normalizedQuantity: normalizedQty,
          wacUnitCost: wacUnitCostVal,
          lineCost: lineCostVal,
          lineStatus,
          warningMessage: warnMsg,
          createdAt: nowStr,
          updatedAt: nowStr
        })
      })

      let itemStatus: RecipeCostingStatus = 'calculated'
      let itemWarn: string | null = null

      if (warningLineCount > 0) {
        if (calculatedLineCount > 0) {
          itemStatus = 'calculated_with_warnings'
          itemWarn = `Có ${warningLineCount} nguyên liệu thiếu dữ liệu giá vốn bình quân (WAC) hoặc quy đổi.`
        } else {
          itemStatus = 'incomplete'
          itemWarn = 'Không đầy đủ dữ liệu tính toán giá vốn.'
        }
      }

      // Calculate cost per portion
      const portionCount = rec.portionQuantity || rec.yieldQuantity || null
      let costPerPortion: number | null = null
      if (portionCount && portionCount > 0 && itemStatus !== 'incomplete') {
        costPerPortion = Math.round((totalRecipeCost / portionCount) * 100) / 100
      }

      newItems.push({
        id: itemId,
        recipeCostingRunId: runId,
        recipeId: rec.id,
        totalRecipeCost: itemStatus === 'incomplete' ? null : totalRecipeCost,
        costPerPortion,
        portionCount,
        costingStatus: itemStatus,
        warningMessage: itemWarn,
        calculatedLineCount,
        warningLineCount,
        totalLineCount,
        createdAt: nowStr,
        updatedAt: nowStr
      })
    })

    const hasWarnings = newItems.some(
      item => item.costingStatus !== 'calculated' && item.costingStatus !== 'no_ingredients'
    )
    const runStatus: RecipeCostingRunStatus = hasWarnings ? 'completed_with_warnings' : 'completed'

    // Filter out previous items/lines for this run
    const keptItems = costingItems.filter(item => item.recipeCostingRunId !== runId)
    const updatedItems = [...keptItems, ...newItems]

    const itemIdsToClear = costingItems.filter(item => item.recipeCostingRunId === runId).map(i => i.id)
    const keptLines = costingLines.filter(line => !itemIdsToClear.includes(line.recipeCostingItemId))
    const updatedLines = [...keptLines, ...newLines]

    const updatedRuns = runs.map((r) => {
      if (r.id === runId) {
        const item: RecipeCostingRun = {
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

    localStorage.setItem('mvos_recipe_costing_runs', JSON.stringify(updatedRuns))
    localStorage.setItem('mvos_recipe_costing_items', JSON.stringify(updatedItems))
    localStorage.setItem('mvos_recipe_costing_lines', JSON.stringify(updatedLines))

    setRuns(updatedRuns)
    setCostingItems(updatedItems)
    setCostingLines(updatedLines)

    const updatedRunItems = updatedItems.filter(i => i.recipeCostingRunId === runId)
    if (updatedRunItems.length > 0) {
      setSelectedItem(updatedRunItems[0])
    }

    if (runStatus === 'completed_with_warnings') {
      alert('Giá vốn công thức đã được tính xong nhưng có cảnh báo.')
    } else {
      alert('Giá vốn công thức đã được tính xong.')
    }
  }

  const getRunStatusLabel = (s: RecipeCostingRunStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'completed': return 'Hoàn thành'
      case 'completed_with_warnings': return 'Hoàn thành có cảnh báo'
      case 'failed': return 'Thất bại'
      case 'cancelled': return 'Đã hủy'
      default: return s
    }
  }

  const getRunStatusClass = (s: RecipeCostingRunStatus) => {
    switch (s) {
      case 'completed': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'completed_with_warnings': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'failed': return 'bg-red-500/10 border border-red-500/25 text-red-400 font-bold'
      case 'cancelled': return 'bg-foreground/5 border border-foreground/10 text-foreground/40 line-through'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getCostingStatusLabel = (s: RecipeCostingStatus) => {
    switch (s) {
      case 'calculated': return 'Đã tính xong'
      case 'calculated_with_warnings': return 'Hoàn thành có cảnh báo'
      case 'no_ingredients': return 'Không có nguyên liệu'
      case 'incomplete': return 'Không đầy đủ dữ liệu'
      case 'pending': return 'Đang chờ'
      default: return 'Lỗi hệ thống'
    }
  }

  const getCostingStatusClass = (s: RecipeCostingStatus) => {
    switch (s) {
      case 'calculated': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'calculated_with_warnings': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'no_ingredients': return 'bg-foreground/5 border border-foreground/15 text-foreground/50'
      case 'incomplete': return 'bg-red-500/10 border border-red-500/25 text-red-400 font-bold'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getLineStatusLabel = (s: RecipeCostingLineStatus) => {
    switch (s) {
      case 'calculated': return 'Đạt yêu cầu'
      case 'missing_ingredient': return 'Thiếu nguyên liệu hệ thống'
      case 'missing_quantity': return 'Thiếu số lượng'
      case 'missing_unit': return 'Thiếu đơn vị'
      case 'missing_wac': return 'Thiếu giá vốn (WAC)'
      case 'missing_conversion': return 'Thiếu quy đổi đơn vị'
      case 'incomplete': return 'Chưa đầy đủ dữ liệu'
      default: return 'Lỗi hệ thống'
    }
  }

  const getLineStatusClass = (s: RecipeCostingLineStatus) => {
    switch (s) {
      case 'calculated': return 'text-green-400 font-bold'
      default: return 'text-red-400 font-semibold'
    }
  }

  const getRecipeName = (id: string) => {
    const found = recipes.find(r => r.id === id)
    return found ? found.recipeName : id
  }

  const getRecipeCode = (id: string) => {
    const found = recipes.find(r => r.id === id)
    return found ? found.recipeCode : ''
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải dữ liệu tính giá vốn công thức…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4 font-sans">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải dữ liệu tính giá vốn công thức.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // WAC runs listing for form dropdown
  const completedWacRuns = wacRuns.filter(wr => wr.status === 'completed' || wr.status === 'completed_with_warnings')

  const selectedRunItems = selectedRun
    ? costingItems.filter(item => item.recipeCostingRunId === selectedRun.id)
    : []

  const selectedItemLines = selectedItem
    ? costingLines.filter(line => line.recipeCostingItemId === selectedItem.id)
    : []

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🍳 Giá vốn công thức lý thuyết (Recipe Costing)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Tính toán giá vốn công thức lý thuyết dựa trên định lượng, hệ số quy đổi đơn vị và giá vốn bình quân (WAC).
        </p>
      </div>

      {/* Warning Banner */}
      <div className="glass-panel p-4 rounded-xl border border-gold-border/20 bg-gold-muted/5 flex items-start gap-3">
        <span className="text-base text-gold mt-0.5">💡</span>
        <div className="text-xs space-y-1">
          <p className="font-bold text-gold">Giá vốn công thức trong bước này là giá vốn lý thuyết phục vụ quản trị nội bộ.</p>
          <p className="text-foreground/70 font-medium">
            Hệ thống chưa tính giá bán, lợi nhuận món, food cost theo kỳ hoặc COGS kế toán và không cho phép sửa trực tiếp giá trị.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng số phiên tính giá</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{runs.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Phiên đã hoàn thành</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">
            {runs.filter(r => r.status === 'completed' || r.status === 'completed_with_warnings').length}
          </span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Công thức theo dõi</span>
          <span className="text-2xl font-serif-cormorant font-bold text-foreground mt-1 block">{recipes.length}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Phiên bản hoạt động</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">V1.0</span>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Costing Runs list & Create form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Số phiên tính</th>
                    <th className="py-3 px-4">Ngày chạy</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4">Nguồn WAC</th>
                    <th className="py-3 px-4 text-center">Ngày hoàn thành</th>
                    <th className="py-3 px-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {runs.length > 0 ? (
                    runs.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => {
                          setSelectedRun(r)
                          const itemsOfRun = costingItems.filter(i => i.recipeCostingRunId === r.id)
                          if (itemsOfRun.length > 0) {
                            setSelectedItem(itemsOfRun[0])
                          } else {
                            setSelectedItem(null)
                          }
                        }}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedRun?.id === r.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{r.runNumber}</td>
                        <td className="py-3.5 px-4 font-mono">{r.runDate}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getRunStatusClass(r.status)}`}>
                            {getRunStatusLabel(r.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-foreground/75">
                          {r.sourceWacRunId ? wacRuns.find(w => w.id === r.sourceWacRunId)?.runNumber || r.sourceWacRunId : 'Mới nhất'}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-foreground/60">{r.completedAt || '-'}</td>
                        <td className="py-3.5 px-4 text-foreground/60 max-w-[150px] truncate">{r.notes || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có lịch sử tính toán giá vốn công thức nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Costing Run */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo phiên tính toán giá vốn công thức mới (Draft)
            </h3>

            <form onSubmit={handleCreateRun} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Nguồn dữ liệu WAC *</label>
                  <select
                    value={sourceWacRunId}
                    onChange={(e) => setSourceWacRunId(e.target.value)}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Sử dụng phiên tính WAC mới nhất --</option>
                    {completedWacRuns.map((w) => (
                      <option key={w.id} value={w.id}>
                        {w.runNumber} ({w.status === 'completed' ? 'Thành công' : 'Có cảnh báo'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú mục đích chạy tính</label>
                  <input
                    type="text"
                    placeholder="Chạy kiểm tra biên giá vốn lý thuyết tháng 6..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Khởi tạo phiên tính toán
              </button>
            </form>
          </div>

          {/* Recipes Costing Items List for Selected Run */}
          {selectedRun && (
            <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
              <div className="bg-gold-muted/10 px-4 py-3 border-b border-gold-border/20 flex justify-between items-center">
                <span className="text-xs font-bold text-gold">📋 Danh sách công thức trong phiên {selectedRun.runNumber}</span>
                {selectedRun.status === 'draft' && (
                  <button
                    onClick={() => handleCalculateCosting(selectedRun.id)}
                    className="rounded bg-gold hover:bg-gold-hover text-background px-4 py-1 text-[10px] font-bold uppercase transition-all"
                  >
                    ⚡ Tính toán giá vốn
                  </button>
                )}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground/80">
                  <thead>
                    <tr className="bg-gold-muted/5 border-b border-gold-border/10 text-gold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-4">Mã CT</th>
                      <th className="py-2.5 px-4">Tên công thức</th>
                      <th className="py-2.5 px-4 text-right">Tổng giá vốn (lý thuyết)</th>
                      <th className="py-2.5 px-4 text-center">Số phần</th>
                      <th className="py-2.5 px-4 text-right">Giá vốn / phần</th>
                      <th className="py-2.5 px-4 text-center">Đạt/Tổng nguyên liệu</th>
                      <th className="py-2.5 px-4 text-center">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-border/10">
                    {selectedRunItems.length > 0 ? (
                      selectedRunItems.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedItem(item)}
                          className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedItem?.id === item.id ? 'bg-gold-muted/10' : ''}`}
                        >
                          <td className="py-3 px-4 font-mono text-foreground/60">{getRecipeCode(item.recipeId)}</td>
                          <td className="py-3 px-4 font-bold text-foreground">{getRecipeName(item.recipeId)}</td>
                          <td className="py-3 px-4 text-right font-mono text-gold font-bold text-sm">
                            {item.totalRecipeCost !== null && item.totalRecipeCost !== undefined ? `${item.totalRecipeCost.toLocaleString('vi-VN')} đ` : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-center font-mono">{item.portionCount || '-'}</td>
                          <td className="py-3 px-4 text-right font-mono text-foreground/85 font-semibold">
                            {item.costPerPortion !== null && item.costPerPortion !== undefined ? `${item.costPerPortion.toLocaleString('vi-VN')} đ` : 'N/A'}
                          </td>
                          <td className="py-3 px-4 text-center font-mono">
                            {item.calculatedLineCount} / {item.totalLineCount}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block rounded px-1.5 py-0.5 text-[8px] font-bold ${getCostingStatusClass(item.costingStatus)}`}>
                              {getCostingStatusLabel(item.costingStatus)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                          Chưa chạy tính toán hoặc kết quả trống.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Detailed ingredient lines breakdown of selected recipe item */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2 font-serif-cormorant">
              🔎 Chi tiết cấu phần giá vốn
            </h3>

            {selectedItem ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {getRecipeName(selectedItem.recipeId)}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Mã CT: {getRecipeCode(selectedItem.recipeId)}</span>
                    <span>Số phần: {selectedItem.portionCount || 'Chưa định nghĩa'}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Tổng giá vốn</span>
                    <span className="font-bold text-gold block text-sm">
                      {selectedItem.totalRecipeCost !== null && selectedItem.totalRecipeCost !== undefined ? `${selectedItem.totalRecipeCost.toLocaleString('vi-VN')} đ` : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Giá vốn / phần</span>
                    <span className="font-bold text-foreground block text-sm">
                      {selectedItem.costPerPortion !== null && selectedItem.costPerPortion !== undefined ? `${selectedItem.costPerPortion.toLocaleString('vi-VN')} đ` : 'N/A'}
                    </span>
                    {!selectedItem.portionCount && (
                      <span className="text-[7px] text-yellow-500 italic block">Thiếu thông tin số phần ăn</span>
                    )}
                  </div>
                </div>

                {selectedItem.warningMessage && (
                  <div className="p-2.5 rounded bg-yellow-500/10 border border-yellow-500/25 text-[9px] text-yellow-500 font-semibold italic">
                    ⚠️ {selectedItem.warningMessage}
                  </div>
                )}

                {/* Calculation Lines list */}
                <div className="space-y-3">
                  <span className="text-[10px] text-gold font-serif-cormorant font-bold uppercase tracking-wider block">🥕 Thành phần định lượng & giá vốn dòng</span>

                  {selectedItemLines.length > 0 ? (
                    <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                      {selectedItemLines.map((line) => (
                        <div key={line.id} className="p-3 bg-background/50 rounded border border-gold-border/10 space-y-1.5 text-[10px]">
                          <div className="flex justify-between items-start border-b border-gold-border/5 pb-1">
                            <span className="font-bold text-foreground">
                              {line.ingredientName}
                            </span>
                            <span className="font-mono text-[9px] text-gold font-bold">
                              {line.lineCost !== null && line.lineCost !== undefined ? `${line.lineCost.toLocaleString('vi-VN')} đ` : 'N/A'}
                            </span>
                          </div>

                          <div className="grid gap-2 grid-cols-2 text-[9px] text-foreground/70">
                            <div>Định lượng: {line.recipeQuantity} {line.recipeUnit}</div>
                            <div>Đã quy đổi: {line.normalizedQuantity !== null ? `${line.normalizedQuantity} ${line.costingUnit || ''}` : 'N/A'}</div>
                            <div className="col-span-2">Đơn giá WAC: {line.wacUnitCost !== null && line.wacUnitCost !== undefined ? `${line.wacUnitCost.toLocaleString('vi-VN')} đ / ${line.costingUnit || ''}` : 'N/A'}</div>
                          </div>

                          <div className="flex justify-between items-center pt-1 border-t border-gold-border/5 text-[9px]">
                            <span className={getLineStatusClass(line.lineStatus)}>
                              {getLineStatusLabel(line.lineStatus)}
                            </span>
                          </div>

                          {line.warningMessage && (
                            <p className="text-[8px] text-red-400 font-semibold italic">⚠️ {line.warningMessage}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[9px] text-foreground/45 italic text-center py-6">Chưa chạy tính toán hoặc kết quả trống.</p>
                  )}
                </div>

                <div className="border-t border-gold-border/20 pt-4 flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Liên kết sửa đổi dữ liệu nguồn</span>
                  <div className="flex gap-2">
                    <Link
                      href="/studio/normalization"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      🔗 Chuẩn hóa CT
                    </Link>
                    <Link
                      href="/studio/wac"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      ⚖️ Giá WAC
                    </Link>
                    <Link
                      href="/studio/conversions"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      ⚖️ Quy đổi đơn vị
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một công thức từ bảng danh sách bên trái để xem cơ cấu giá vốn.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RecipesCostingPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải cấu hình tính giá vốn…</p>
      </div>
    }>
      <RecipesCostingPageContent />
    </Suspense>
  )
}
