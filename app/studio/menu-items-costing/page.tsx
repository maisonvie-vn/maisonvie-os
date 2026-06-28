'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type MenuItemRecipeComponentType =
  | 'main'
  | 'sauce'
  | 'garnish'
  | 'side'
  | 'prep'
  | 'bread'
  | 'petit_four'
  | 'amuse_bouche'
  | 'other'

export type MenuItemCostBasis = 'per_portion' | 'full_recipe'

export type MenuItemCostingRunStatus =
  | 'draft'
  | 'completed'
  | 'completed_with_warnings'
  | 'failed'
  | 'cancelled'

export type MenuItemCostingStatus =
  | 'pending'
  | 'calculated'
  | 'calculated_with_warnings'
  | 'no_mapping'
  | 'incomplete'
  | 'error'

export type MenuItemCostingLineStatus =
  | 'pending'
  | 'calculated'
  | 'missing_mapping'
  | 'missing_recipe'
  | 'missing_recipe_cost'
  | 'missing_portion_cost'
  | 'incomplete'
  | 'error'

export interface MenuItemRecipeMapping {
  id: string
  menuItemId: string
  recipeId: string
  componentType: MenuItemRecipeComponentType
  costBasis: MenuItemCostBasis
  quantityMultiplier: number
  isActive: boolean
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface MenuItemCostingRun {
  id: string
  runNumber: string
  runDate: string
  sourceRecipeCostingRunId?: string | null
  status: MenuItemCostingRunStatus
  notes?: string | null
  createdBy?: string | null
  startedAt?: string | null
  completedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface MenuItemCostingItem {
  id: string
  menuItemCostingRunId: string
  menuItemId: string
  totalMenuItemCost?: number | null
  costingStatus: MenuItemCostingStatus
  warningMessage?: string | null
  calculatedLineCount: number
  warningLineCount: number
  totalLineCount: number
  createdAt: string
  updatedAt: string
}

export interface MenuItemCostingLine {
  id: string
  menuItemCostingItemId: string
  menuItemRecipeMappingId?: string | null
  menuItemId: string
  recipeId?: string | null
  recipeName?: string | null
  componentType?: string | null
  costBasis?: string | null
  quantityMultiplier?: number | null
  sourceRecipeCostingItemId?: string | null
  sourceRecipeCost?: number | null
  sourceCostPerPortion?: number | null
  lineCost?: number | null
  lineStatus: MenuItemCostingLineStatus
  warningMessage?: string | null
  createdAt: string
  updatedAt: string
}

interface MenuItem {
  id: string
  itemCode?: string | null
  itemNameVi?: string | null
  itemNameEn?: string | null
}

interface Recipe {
  id: string
  recipeCode?: string | null
  recipeName: string
}

interface RecipeCostingRun {
  id: string
  runNumber: string
  status: string
}

interface RecipeCostingItem {
  id: string
  recipeCostingRunId: string
  recipeId: string
  totalRecipeCost?: number | null
  costPerPortion?: number | null
  costingStatus: string
}

const INITIAL_MAPPINGS: MenuItemRecipeMapping[] = [
  {
    id: 'map-001',
    menuItemId: 'item-101',
    recipeId: 'rec-401',
    componentType: 'main',
    costBasis: 'per_portion',
    quantityMultiplier: 1,
    isActive: true,
    notes: 'Định lượng chính súp hải sản kiểu Marseille',
    createdAt: '2026-06-30 09:30',
    updatedAt: '2026-06-30 09:30'
  }
]

const INITIAL_COSTING_RUNS: MenuItemCostingRun[] = [
  {
    id: 'mic-run-1',
    runNumber: 'MIC-20260630-01',
    runDate: '2026-06-30',
    sourceRecipeCostingRunId: 'rc-run-1',
    status: 'completed',
    notes: 'Tính toán giá vốn món bán lý thuyết định kỳ cuối tháng 6',
    createdBy: 'Quản trị viên',
    startedAt: '2026-06-30 10:00',
    completedAt: '2026-06-30 10:01',
    createdAt: '2026-06-30 10:00',
    updatedAt: '2026-06-30 10:01'
  }
]

const INITIAL_COSTING_ITEMS: MenuItemCostingItem[] = [
  {
    id: 'mic-item-1',
    menuItemCostingRunId: 'mic-run-1',
    menuItemId: 'item-101',
    totalMenuItemCost: 14750, // 14750 * 1
    costingStatus: 'calculated',
    warningMessage: null,
    calculatedLineCount: 1,
    warningLineCount: 0,
    totalLineCount: 1,
    createdAt: '2026-06-30 10:01',
    updatedAt: '2026-06-30 10:01'
  }
]

const INITIAL_COSTING_LINES: MenuItemCostingLine[] = [
  {
    id: 'mic-line-1',
    menuItemCostingItemId: 'mic-item-1',
    menuItemRecipeMappingId: 'map-001',
    menuItemId: 'item-101',
    recipeId: 'rec-401',
    recipeName: 'Công thức súp hải sản Marseille',
    componentType: 'main',
    costBasis: 'per_portion',
    quantityMultiplier: 1,
    sourceRecipeCostingItemId: 'rc-item-1',
    sourceRecipeCost: 147500,
    sourceCostPerPortion: 14750,
    lineCost: 14750,
    lineStatus: 'calculated',
    warningMessage: null,
    createdAt: '2026-06-30 10:01',
    updatedAt: '2026-06-30 10:01'
  }
]

function MenuItemsCostingPageContent() {
  // Mapping list
  const [mappings, setMappings] = useState<MenuItemRecipeMapping[]>([])
  const [runs, setRuns] = useState<MenuItemCostingRun[]>([])
  const [costingItems, setCostingItems] = useState<MenuItemCostingItem[]>([])
  const [costingLines, setCostingLines] = useState<MenuItemCostingLine[]>([])

  // Master sources
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [recipeCostingRuns, setRecipeCostingRuns] = useState<RecipeCostingRun[]>([])
  const [recipeCostingItems, setRecipeCostingItems] = useState<RecipeCostingItem[]>([])

  const [selectedRun, setSelectedRun] = useState<MenuItemCostingRun | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItemCostingItem | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'runs' | 'mappings'>('runs')

  // Forms mapping
  const [mappingForm, setMappingForm] = useState({
    menuItemId: '',
    recipeId: '',
    componentType: 'main' as MenuItemRecipeComponentType,
    costBasis: 'per_portion' as MenuItemCostBasis,
    quantityMultiplier: '1',
    notes: ''
  })
  const [mappingErrors, setMappingErrors] = useState<Record<string, string>>({})

  // Forms costing run
  const [runNotes, setRunNotes] = useState('')
  const [sourceRecipeRunId, setSourceRecipeRunId] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedMappings = localStorage.getItem('mvos_menu_item_recipe_mappings')
        const storedRuns = localStorage.getItem('mvos_menu_item_costing_runs')
        const storedItems = localStorage.getItem('mvos_menu_item_costing_items')
        const storedLines = localStorage.getItem('mvos_menu_item_costing_lines')

        const storedMenuItems = localStorage.getItem('mvos_menu_items')
        const storedRecipes = localStorage.getItem('mvos_recipes')
        const storedRecipeRuns = localStorage.getItem('mvos_recipe_costing_runs')
        const storedRecipeItems = localStorage.getItem('mvos_recipe_costing_items')

        let loadedMappings: MenuItemRecipeMapping[] = []
        let loadedRuns: MenuItemCostingRun[] = []
        let loadedItems: MenuItemCostingItem[] = []
        let loadedLines: MenuItemCostingLine[] = []

        let loadedMenuItems: MenuItem[] = []
        let loadedRecipes: Recipe[] = []
        let loadedRecipeRuns: RecipeCostingRun[] = []
        let loadedRecipeItems: RecipeCostingItem[] = []

        if (storedMappings) {
          loadedMappings = JSON.parse(storedMappings)
        } else {
          localStorage.setItem('mvos_menu_item_recipe_mappings', JSON.stringify(INITIAL_MAPPINGS))
          loadedMappings = INITIAL_MAPPINGS
        }
        setMappings(loadedMappings)

        if (storedRuns) {
          loadedRuns = JSON.parse(storedRuns)
        } else {
          localStorage.setItem('mvos_menu_item_costing_runs', JSON.stringify(INITIAL_COSTING_RUNS))
          loadedRuns = INITIAL_COSTING_RUNS
        }
        setRuns(loadedRuns)

        if (storedItems) {
          loadedItems = JSON.parse(storedItems)
        } else {
          localStorage.setItem('mvos_menu_item_costing_items', JSON.stringify(INITIAL_COSTING_ITEMS))
          loadedItems = INITIAL_COSTING_ITEMS
        }
        setCostingItems(loadedItems)

        if (storedLines) {
          loadedLines = JSON.parse(storedLines)
        } else {
          localStorage.setItem('mvos_menu_item_costing_lines', JSON.stringify(INITIAL_COSTING_LINES))
          loadedLines = INITIAL_COSTING_LINES
        }
        setCostingLines(loadedLines)

        if (storedMenuItems) loadedMenuItems = JSON.parse(storedMenuItems)
        setMenuItems(loadedMenuItems)

        if (storedRecipes) loadedRecipes = JSON.parse(storedRecipes)
        setRecipes(loadedRecipes)

        if (storedRecipeRuns) loadedRecipeRuns = JSON.parse(storedRecipeRuns)
        setRecipeCostingRuns(loadedRecipeRuns)

        if (storedRecipeItems) loadedRecipeItems = JSON.parse(storedRecipeItems)
        setRecipeCostingItems(loadedRecipeItems)

        if (loadedRuns.length > 0) {
          setSelectedRun(loadedRuns[0])
          const itemsOfRun = loadedItems.filter(i => i.menuItemCostingRunId === loadedRuns[0].id)
          if (itemsOfRun.length > 0) {
            setSelectedItem(itemsOfRun[0])
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu tính giá vốn món bán.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateMapping = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (!mappingForm.menuItemId) errs.menuItemId = 'Vui lòng chọn món bán.'
    if (!mappingForm.recipeId) errs.recipeId = 'Vui lòng chọn công thức.'

    const multVal = parseFloat(mappingForm.quantityMultiplier)
    if (isNaN(multVal) || multVal <= 0) {
      errs.quantityMultiplier = 'Hệ số sử dụng phải lớn hơn 0.'
    }

    if (Object.keys(errs).length > 0) {
      setMappingErrors(errs)
      return
    }

    setMappingErrors({})

    // Prevent duplicates
    const isDuplicate = mappings.some(m => 
      m.isActive &&
      m.menuItemId === mappingForm.menuItemId &&
      m.recipeId === mappingForm.recipeId &&
      m.componentType === mappingForm.componentType
    )

    if (isDuplicate) {
      alert('Mapping này đã tồn tại.')
      return
    }

    const newMapping: MenuItemRecipeMapping = {
      id: `map-${Date.now().toString().slice(-4)}`,
      menuItemId: mappingForm.menuItemId,
      recipeId: mappingForm.recipeId,
      componentType: mappingForm.componentType,
      costBasis: mappingForm.costBasis,
      quantityMultiplier: multVal,
      isActive: true,
      notes: mappingForm.notes.trim() || null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...mappings, newMapping]
    localStorage.setItem('mvos_menu_item_recipe_mappings', JSON.stringify(updated))
    setMappings(updated)

    setMappingForm({
      menuItemId: '',
      recipeId: '',
      componentType: 'main',
      costBasis: 'per_portion',
      quantityMultiplier: '1',
      notes: ''
    })

    alert('Mapping công thức đã được lưu.')
  }

  const handleDeactivateMapping = (id: string) => {
    const updated = mappings.map(m => m.id === id ? { ...m, isActive: false, updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16) } : m)
    localStorage.setItem('mvos_menu_item_recipe_mappings', JSON.stringify(updated))
    setMappings(updated)
    alert('Mapping công thức đã ngừng áp dụng.')
  }

  const handleCreateRun = (e: React.FormEvent) => {
    e.preventDefault()
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const runNum = `MIC-${new Date().toISOString().replace(/[-T:]/g, '').slice(0, 8)}-${Date.now().toString().slice(-3)}`

    const newRun: MenuItemCostingRun = {
      id: `mic-run-${Date.now().toString().slice(-4)}`,
      runNumber: runNum,
      runDate: new Date().toISOString().split('T')[0],
      sourceRecipeCostingRunId: sourceRecipeRunId || null,
      status: 'draft',
      notes: runNotes.trim() || null,
      createdBy: 'Quản trị viên',
      createdAt: nowStr,
      updatedAt: nowStr
    }

    const updated = [...runs, newRun]
    localStorage.setItem('mvos_menu_item_costing_runs', JSON.stringify(updated))
    setRuns(updated)
    setSelectedRun(newRun)
    setRunNotes('')
    setSourceRecipeRunId('')

    alert('Lần tính giá vốn món bán đã được tạo.')
  }

  const handleCalculateCosting = (runId: string) => {
    const run = runs.find(r => r.id === runId)
    if (!run) return

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)

    // Retrieve active mappings
    const activeMappings = mappings.filter(m => m.isActive)

    // Retrieve Recipe Costing source items
    let validRecipeCostings = recipeCostingItems
    if (run.sourceRecipeCostingRunId) {
      validRecipeCostings = recipeCostingItems.filter(item => item.recipeCostingRunId === run.sourceRecipeCostingRunId)
    } else {
      // Fetch latest completed recipe costing run items
      const completedRecipeRuns = recipeCostingRuns.filter(r => r.status === 'completed' || r.status === 'completed_with_warnings')
      if (completedRecipeRuns.length > 0) {
        completedRecipeRuns.sort((a, b) => b.runNumber.localeCompare(a.runNumber))
        validRecipeCostings = recipeCostingItems.filter(item => item.recipeCostingRunId === completedRecipeRuns[0].id)
      }
    }

    const newItems: MenuItemCostingItem[] = []
    const newLines: MenuItemCostingLine[] = []

    menuItems.forEach((menuItem) => {
      const itemMappings = activeMappings.filter(m => m.menuItemId === menuItem.id)

      if (itemMappings.length === 0) {
        newItems.push({
          id: `mic-item-${Date.now().toString().slice(-4)}-${menuItem.id}`,
          menuItemCostingRunId: runId,
          menuItemId: menuItem.id,
          totalMenuItemCost: null,
          costingStatus: 'no_mapping',
          warningMessage: 'Món bán chưa có mapping cấu hình công thức.',
          calculatedLineCount: 0,
          warningLineCount: 0,
          totalLineCount: 0,
          createdAt: nowStr,
          updatedAt: nowStr
        })
        return
      }

      let totalItemCost = 0
      let calculatedLineCount = 0
      let warningLineCount = 0
      const totalLineCount = itemMappings.length
      const itemId = `mic-item-${Date.now().toString().slice(-4)}-${menuItem.id}`

      itemMappings.forEach((mapItem) => {
        let lineStatus: MenuItemCostingLineStatus = 'calculated'
        let warnMsg: string | null = null
        let lineCostVal: number | null = null

        const recipeId = mapItem.recipeId
        const recipeObj = recipes.find(r => r.id === recipeId)
        const recipeName = recipeObj ? recipeObj.recipeName : recipeId

        // Lookup recipe costing item
        const rCostItem = validRecipeCostings.find(item => item.recipeId === recipeId)

        const recipeCost = rCostItem?.totalRecipeCost || null
        const portionCost = rCostItem?.costPerPortion || null

        if (!recipeId) {
          lineStatus = 'missing_recipe'
          warnMsg = 'Thiếu liên kết công thức.'
          warningLineCount += 1
        } else if (!rCostItem || rCostItem.costingStatus === 'incomplete') {
          lineStatus = 'missing_recipe_cost'
          warnMsg = 'Thiếu giá vốn công thức nguồn.'
          warningLineCount += 1
        } else if (mapItem.costBasis === 'per_portion') {
          if (portionCost === null || portionCost === undefined) {
            lineStatus = 'missing_portion_cost'
            warnMsg = 'Thiếu giá vốn khẩu phần nguồn (Có thể chưa điền số phần).'
            warningLineCount += 1
          } else {
            lineCostVal = portionCost * mapItem.quantityMultiplier
            totalItemCost += lineCostVal
            calculatedLineCount += 1
          }
        } else if (mapItem.costBasis === 'full_recipe') {
          if (recipeCost === null || recipeCost === undefined) {
            lineStatus = 'missing_recipe_cost'
            warnMsg = 'Thiếu giá vốn công thức nguồn.'
            warningLineCount += 1
          } else {
            lineCostVal = recipeCost * mapItem.quantityMultiplier
            totalItemCost += lineCostVal
            calculatedLineCount += 1
          }
        }

        newLines.push({
          id: `mic-line-${Date.now().toString().slice(-4)}-${mapItem.id}`,
          menuItemCostingItemId: itemId,
          menuItemRecipeMappingId: mapItem.id,
          menuItemId: menuItem.id,
          recipeId,
          recipeName,
          componentType: mapItem.componentType,
          costBasis: mapItem.costBasis,
          quantityMultiplier: mapItem.quantityMultiplier,
          sourceRecipeCostingItemId: rCostItem?.id || null,
          sourceRecipeCost: recipeCost,
          sourceCostPerPortion: portionCost,
          lineCost: lineCostVal,
          lineStatus,
          warningMessage: warnMsg,
          createdAt: nowStr,
          updatedAt: nowStr
        })
      })

      let itemStatus: MenuItemCostingStatus = 'calculated'
      let itemWarn: string | null = null

      if (warningLineCount > 0) {
        if (calculatedLineCount > 0) {
          itemStatus = 'calculated_with_warnings'
          itemWarn = `Có ${warningLineCount} thành phần bị lỗi hoặc thiếu giá vốn công thức.`
        } else {
          itemStatus = 'incomplete'
          itemWarn = 'Không đầy đủ dữ liệu tính toán giá vốn.'
        }
      }

      newItems.push({
        id: itemId,
        menuItemCostingRunId: runId,
        menuItemId: menuItem.id,
        totalMenuItemCost: itemStatus === 'incomplete' ? null : totalItemCost,
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
      item => item.costingStatus !== 'calculated' && item.costingStatus !== 'no_mapping'
    )
    const runStatus: MenuItemCostingRunStatus = hasWarnings ? 'completed_with_warnings' : 'completed'

    // Filter out previous items/lines for this run
    const keptItems = costingItems.filter(item => item.menuItemCostingRunId !== runId)
    const updatedItems = [...keptItems, ...newItems]

    const itemIdsToClear = costingItems.filter(item => item.menuItemCostingRunId === runId).map(i => i.id)
    const keptLines = costingLines.filter(line => !itemIdsToClear.includes(line.menuItemCostingItemId))
    const updatedLines = [...keptLines, ...newLines]

    const updatedRuns = runs.map((r) => {
      if (r.id === runId) {
        const item: MenuItemCostingRun = {
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

    localStorage.setItem('mvos_menu_item_costing_runs', JSON.stringify(updatedRuns))
    localStorage.setItem('mvos_menu_item_costing_items', JSON.stringify(updatedItems))
    localStorage.setItem('mvos_menu_item_costing_lines', JSON.stringify(updatedLines))

    setRuns(updatedRuns)
    setCostingItems(updatedItems)
    setCostingLines(updatedLines)

    const updatedRunItems = updatedItems.filter(i => i.menuItemCostingRunId === runId)
    if (updatedRunItems.length > 0) {
      setSelectedItem(updatedRunItems[0])
    }

    if (runStatus === 'completed_with_warnings') {
      alert('Giá vốn món bán đã được tính xong nhưng có cảnh báo.')
    } else {
      alert('Giá vốn món bán đã được tính xong.')
    }
  }

  const getRunStatusLabel = (s: MenuItemCostingRunStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'completed': return 'Hoàn thành'
      case 'completed_with_warnings': return 'Hoàn thành có cảnh báo'
      case 'failed': return 'Thất bại'
      case 'cancelled': return 'Đã hủy'
      default: return s
    }
  }

  const getRunStatusClass = (s: MenuItemCostingRunStatus) => {
    switch (s) {
      case 'completed': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'completed_with_warnings': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'failed': return 'bg-red-500/10 border border-red-500/25 text-red-400 font-bold'
      case 'cancelled': return 'bg-foreground/5 border border-foreground/10 text-foreground/40 line-through'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getCostingStatusLabel = (s: MenuItemCostingStatus) => {
    switch (s) {
      case 'calculated': return 'Đã tính xong'
      case 'calculated_with_warnings': return 'Hoàn thành có cảnh báo'
      case 'no_mapping': return 'Chưa cấu hình công thức'
      case 'incomplete': return 'Không đầy đủ dữ liệu'
      case 'pending': return 'Đang chờ'
      default: return 'Lỗi hệ thống'
    }
  }

  const getCostingStatusClass = (s: MenuItemCostingStatus) => {
    switch (s) {
      case 'calculated': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'calculated_with_warnings': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'no_mapping': return 'bg-foreground/5 border border-foreground/15 text-foreground/45 italic'
      case 'incomplete': return 'bg-red-500/10 border border-red-500/25 text-red-400 font-bold'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getLineStatusLabel = (s: MenuItemCostingLineStatus) => {
    switch (s) {
      case 'calculated': return 'Đạt yêu cầu'
      case 'missing_mapping': return 'Thiếu mapping công thức'
      case 'missing_recipe': return 'Thiếu liên kết công thức'
      case 'missing_recipe_cost': return 'Thiếu giá vốn công thức nguồn'
      case 'missing_portion_cost': return 'Thiếu giá vốn mỗi khẩu phần'
      case 'incomplete': return 'Không đầy đủ dữ liệu'
      default: return 'Lỗi hệ thống'
    }
  }

  const getLineStatusClass = (s: MenuItemCostingLineStatus) => {
    switch (s) {
      case 'calculated': return 'text-green-400 font-bold'
      default: return 'text-red-400 font-semibold'
    }
  }

  const getComponentTypeLabel = (s: MenuItemRecipeComponentType) => {
    switch (s) {
      case 'main': return 'Món chính'
      case 'sauce': return 'Sốt'
      case 'garnish': return 'Trang trí'
      case 'side': return 'Món ăn kèm'
      case 'prep': return 'Bán thành phẩm'
      case 'bread': return 'Bánh mì'
      case 'petit_four': return 'Petit four'
      case 'amuse_bouche': return 'Amuse-bouche'
      default: return 'Khác'
    }
  }

  const getCostBasisLabel = (s: MenuItemCostBasis) => {
    return s === 'per_portion' ? 'Theo khẩu phần' : 'Theo toàn bộ công thức'
  }

  const getMenuItemName = (id: string) => {
    const found = menuItems.find(m => m.id === id)
    return found ? found.itemNameVi : id
  }

  const getMenuItemCode = (id: string) => {
    const found = menuItems.find(m => m.id === id)
    return found ? found.itemCode : ''
  }

  const getRecipeName = (id: string) => {
    const found = recipes.find(r => r.id === id)
    return found ? found.recipeName : id
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải dữ liệu giá vốn món bán…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4 font-sans">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải dữ liệu giá vốn món bán.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  const selectedRunItems = selectedRun
    ? costingItems.filter(item => item.menuItemCostingRunId === selectedRun.id)
    : []

  const selectedItemLines = selectedItem
    ? costingLines.filter(line => line.menuItemCostingItemId === selectedItem.id)
    : []

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🍽️ Giá vốn món bán lý thuyết (Menu Item Costing)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Cấu hình bản đồ công thức (Recipe Mappings) cho món ăn thương mại và tính toán giá vốn lý thuyết dựa trên WAC.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="glass-panel p-4 rounded-xl border border-gold-border/20 bg-gold-muted/5 flex items-start gap-3">
        <span className="text-base text-gold mt-0.5">💡</span>
        <div className="text-xs space-y-1">
          <p className="font-bold text-gold">Giá vốn món bán trong bước này là giá vốn lý thuyết phục vụ quản trị nội bộ.</p>
          <p className="text-foreground/70 font-medium font-sans">
            Hệ thống chưa tính giá bán, food cost %, lợi nhuận món, doanh thu hoặc COGS kế toán và không cho phép sửa trực tiếp giá trị.
          </p>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-gold-border/30 gap-6 text-sm">
        <button
          onClick={() => setActiveTab('runs')}
          className={`pb-2.5 font-bold transition-all ${activeTab === 'runs' ? 'text-gold border-b-2 border-gold font-bold' : 'text-foreground/50'}`}
        >
          📋 Phiên tính WAC & Giá vốn
        </button>
        <button
          onClick={() => setActiveTab('mappings')}
          className={`pb-2.5 font-bold transition-all ${activeTab === 'mappings' ? 'text-gold border-b-2 border-gold font-bold' : 'text-foreground/50'}`}
        >
          🔗 Bản đồ công thức (Recipe Mappings)
        </button>
      </div>

      {activeTab === 'runs' && (
        <div className="space-y-6">
          {/* Metrics summary */}
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 text-center">
            <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
              <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block font-sans">Tổng số phiên chạy</span>
              <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{runs.length}</span>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
              <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block font-sans font-medium">Lần tính thành công</span>
              <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">
                {runs.filter(r => r.status === 'completed' || r.status === 'completed_with_warnings').length}
              </span>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
              <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block font-sans font-medium">Món có cost lý thuyết</span>
              <span className="text-2xl font-serif-cormorant font-bold text-foreground mt-1 block">
                {costingItems.filter(item => item.costingStatus === 'calculated' && item.menuItemCostingRunId === selectedRun?.id).length}
              </span>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
              <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block font-sans font-medium">Phiên bản hoạt động</span>
              <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">V1.0</span>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Costing Runs List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-foreground/80">
                    <thead>
                      <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                        <th className="py-3 px-4">Số phiên tính</th>
                        <th className="py-3 px-4">Ngày chạy</th>
                        <th className="py-3 px-4 text-center">Trạng thái</th>
                        <th className="py-3 px-4">Nguồn CT giá vốn</th>
                        <th className="py-3 px-4 text-center">Ngày hoàn thành</th>
                        <th className="py-3 px-4">Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gold-border/10">
                      {runs.map((r) => (
                        <tr
                          key={r.id}
                          onClick={() => {
                            setSelectedRun(r)
                            const itemsOfRun = costingItems.filter(i => i.menuItemCostingRunId === r.id)
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
                            {r.sourceRecipeCostingRunId ? recipeCostingRuns.find(w => w.id === r.sourceRecipeCostingRunId)?.runNumber || r.sourceRecipeCostingRunId : 'Mới nhất'}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-foreground/60">{r.completedAt || '-'}</td>
                          <td className="py-3.5 px-4 text-foreground/60 max-w-[150px] truncate">{r.notes || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Form: Create new run */}
              <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
                <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
                  🆕 Tạo phiên chạy tính giá vốn món mới
                </h3>

                <form onSubmit={handleCreateRun} className="space-y-4 text-xs">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Nguồn giá vốn công thức *</label>
                      <select
                        value={sourceRecipeRunId}
                        onChange={(e) => setSourceRecipeRunId(e.target.value)}
                        className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                      >
                        <option value="">-- Sử dụng phiên tính mới nhất --</option>
                        {recipeCostingRuns.filter(r => r.status === 'completed' || r.status === 'completed_with_warnings').map((w) => (
                          <option key={w.id} value={w.id}>
                            {w.runNumber} ({w.status === 'completed' ? 'Thành công' : 'Có cảnh báo'})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] text-foreground/60 font-mono">Ghi chú chi tiết</label>
                      <input
                        type="text"
                        placeholder="Chạy kiểm nghiệm giá vốn các món đĩa chính..."
                        value={runNotes}
                        onChange={(e) => setRunNotes(e.target.value)}
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

              {/* Items List of selected costing run */}
              {selectedRun && (
                <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
                  <div className="bg-gold-muted/10 px-4 py-3 border-b border-gold-border/20 flex justify-between items-center">
                    <span className="text-xs font-bold text-gold">📋 Danh sách món ăn trong phiên {selectedRun.runNumber}</span>
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
                          <th className="py-2.5 px-4">Mã món</th>
                          <th className="py-2.5 px-4">Tên món bán</th>
                          <th className="py-2.5 px-4 text-right">Tổng giá vốn lý thuyết</th>
                          <th className="py-2.5 px-4 text-center">Thành phần tính</th>
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
                              <td className="py-3 px-4 font-mono text-foreground/60">{getMenuItemCode(item.menuItemId)}</td>
                              <td className="py-3 px-4 font-bold text-foreground">{getMenuItemName(item.menuItemId)}</td>
                              <td className="py-3 px-4 text-right font-mono text-gold font-bold text-sm">
                                {item.totalMenuItemCost !== null && item.totalMenuItemCost !== undefined ? `${item.totalMenuItemCost.toLocaleString('vi-VN')} đ` : 'N/A'}
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
                            <td colSpan={5} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
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

            {/* Right Column: Breakdown lines */}
            <div className="space-y-6">
              <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
                <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2 font-serif-cormorant">
                  🔎 Cơ cấu cấu phần giá vốn món
                </h3>

                {selectedItem ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-base font-bold text-gold font-serif-cormorant">
                        {getMenuItemName(selectedItem.menuItemId)}
                      </h4>
                      <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                        <span>Mã món: {getMenuItemCode(selectedItem.menuItemId)}</span>
                        <span>Tổng định lượng: {selectedItem.totalLineCount} công thức thành phần</span>
                      </div>
                    </div>

                    <div className="border-b border-gold-border/10 pb-3">
                      <span className="text-[9px] text-foreground/50 font-mono block">Tổng giá vốn món bán</span>
                      <span className="font-bold text-gold block text-base font-mono">
                        {selectedItem.totalMenuItemCost !== null && selectedItem.totalMenuItemCost !== undefined ? `${selectedItem.totalMenuItemCost.toLocaleString('vi-VN')} đ` : 'N/A'}
                      </span>
                    </div>

                    {selectedItem.warningMessage && (
                      <div className="p-2.5 rounded bg-yellow-500/10 border border-yellow-500/25 text-[9px] text-yellow-500 font-semibold italic">
                        ⚠️ {selectedItem.warningMessage}
                      </div>
                    )}

                    {/* Breakdown list */}
                    <div className="space-y-3">
                      <span className="text-[10px] text-gold font-serif-cormorant font-bold uppercase tracking-wider block">🥗 Các công thức liên kết & giá vốn dòng</span>

                      {selectedItemLines.length > 0 ? (
                        <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                          {selectedItemLines.map((line) => (
                            <div key={line.id} className="p-3 bg-background/50 rounded border border-gold-border/10 space-y-1.5 text-[10px]">
                              <div className="flex justify-between items-start border-b border-gold-border/5 pb-1">
                                <span className="font-bold text-foreground">
                                  {line.recipeName}
                                </span>
                                <span className="font-mono text-[9px] text-gold font-bold">
                                  {line.lineCost !== null && line.lineCost !== undefined ? `${line.lineCost.toLocaleString('vi-VN')} đ` : 'N/A'}
                                </span>
                              </div>

                              <div className="grid gap-2 grid-cols-2 text-[9px] text-foreground/70">
                                <div>Vai trò: {getComponentTypeLabel(line.componentType as MenuItemRecipeComponentType)}</div>
                                <div>Hệ số nhân: x{line.quantityMultiplier}</div>
                                <div className="col-span-2">Cách tính: {getCostBasisLabel(line.costBasis as MenuItemCostBasis)}</div>
                                <div className="col-span-2">Đơn giá khẩu phần: {line.sourceCostPerPortion !== null && line.sourceCostPerPortion !== undefined ? `${line.sourceCostPerPortion.toLocaleString('vi-VN')} đ` : 'N/A'}</div>
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
                        <p className="text-[9px] text-foreground/45 italic text-center py-6">Chưa có bản đồ công thức hoặc kết quả tính.</p>
                      )}
                    </div>

                    <div className="border-t border-gold-border/20 pt-4 flex flex-col gap-1.5">
                      <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Liên kết sửa đổi dữ liệu nguồn</span>
                      <div className="flex gap-2">
                        <Link
                          href="/studio/recipes-costing"
                          className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                        >
                          🍳 Cost công thức
                        </Link>
                        <Link
                          href="/studio/menus"
                          className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                        >
                          📋 Xem thực đơn
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một món bán từ bảng danh sách bên trái để xem chi tiết cơ cấu giá vốn.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'mappings' && (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column: Mappings List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground/80">
                  <thead>
                    <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Món bán</th>
                      <th className="py-3 px-4">Công thức thành phần</th>
                      <th className="py-3 px-4">Loại thành phần</th>
                      <th className="py-3 px-4">Cơ sở tính cost</th>
                      <th className="py-3 px-4 text-center">Hệ số nhân</th>
                      <th className="py-3 px-4 text-center">Trạng thái</th>
                      <th className="py-3 px-4">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-border/10">
                    {mappings.length > 0 ? (
                      mappings.map((m) => (
                        <tr key={m.id} className="hover:bg-gold-muted/5 transition-colors">
                          <td className="py-3 px-4 font-bold text-foreground">{getMenuItemName(m.menuItemId)}</td>
                          <td className="py-3 px-4 text-gold font-bold">{getRecipeName(m.recipeId)}</td>
                          <td className="py-3 px-4">{getComponentTypeLabel(m.componentType)}</td>
                          <td className="py-3 px-4 font-mono">{getCostBasisLabel(m.costBasis)}</td>
                          <td className="py-3 px-4 text-center font-mono font-bold">x{m.quantityMultiplier}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${m.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-foreground/5 text-foreground/40 line-through'}`}>
                              {m.isActive ? 'Đang áp dụng' : 'Ngừng áp dụng'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            {m.isActive ? (
                              <button
                                type="button"
                                onClick={() => handleDeactivateMapping(m.id)}
                                className="text-red-400 hover:text-red-300 font-semibold"
                              >
                                Tạm dừng
                              </button>
                            ) : (
                              <span className="text-foreground/30">-</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                          Chưa cấu hình bản đồ công thức nào cho các món bán.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column: Mapping Form */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Khởi tạo mapping công thức mới
            </h3>

            <form onSubmit={handleCreateMapping} className="space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold font-sans">Chọn món bán thương mại *</label>
                <select
                  value={mappingForm.menuItemId}
                  onChange={(e) => setMappingForm({ ...mappingForm, menuItemId: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="">-- Chọn món bán --</option>
                  {menuItems.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.itemNameVi} ({m.itemCode})
                    </option>
                  ))}
                </select>
                {mappingErrors.menuItemId && <span className="text-[10px] text-red-400 italic">{mappingErrors.menuItemId}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold font-sans">Chọn công thức thành phần *</label>
                <select
                  value={mappingForm.recipeId}
                  onChange={(e) => setMappingForm({ ...mappingForm, recipeId: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="">-- Chọn công thức --</option>
                  {recipes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.recipeName}
                    </option>
                  ))}
                </select>
                {mappingErrors.recipeId && <span className="text-[10px] text-red-400 italic">{mappingErrors.recipeId}</span>}
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold font-sans">Loại thành phần *</label>
                  <select
                    value={mappingForm.componentType}
                    onChange={(e) => setMappingForm({ ...mappingForm, componentType: e.target.value as MenuItemRecipeComponentType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-2 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="main">Món chính</option>
                    <option value="sauce">Sốt</option>
                    <option value="garnish">Trang trí</option>
                    <option value="side">Món ăn kèm</option>
                    <option value="prep">Bán thành phẩm</option>
                    <option value="bread">Bánh mì</option>
                    <option value="petit_four">Petit four</option>
                    <option value="amuse_bouche">Amuse-bouche</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold font-sans">Cơ sở tính cost *</label>
                  <select
                    value={mappingForm.costBasis}
                    onChange={(e) => setMappingForm({ ...mappingForm, costBasis: e.target.value as MenuItemCostBasis })}
                    className="rounded border border-gold-border/30 bg-background/50 px-2 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="per_portion">Theo khẩu phần (Per portion)</option>
                    <option value="full_recipe">Toàn bộ công thức (Full recipe)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold font-sans">Hệ số sử dụng (Multiplier) *</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Ví dụ: 1, 0.5, 2..."
                    value={mappingForm.quantityMultiplier}
                    onChange={(e) => setMappingForm({ ...mappingForm, quantityMultiplier: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono font-bold"
                  />
                  {mappingErrors.quantityMultiplier && <span className="text-[10px] text-red-400 italic">{mappingErrors.quantityMultiplier}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono font-sans">Ghi chú mapping</label>
                <input
                  type="text"
                  placeholder="Ghi chú vai trò trong set thực đơn..."
                  value={mappingForm.notes}
                  onChange={(e) => setMappingForm({ ...mappingForm, notes: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded bg-gold hover:bg-gold-hover text-background py-2 text-xs font-bold transition-all text-center uppercase tracking-wider"
              >
                Lưu mapping công thức
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MenuItemsCostingPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải cấu hình tính giá vốn…</p>
      </div>
    }>
      <MenuItemsCostingPageContent />
    </Suspense>
  )
}
