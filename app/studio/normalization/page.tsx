'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export type RecipeIngredientNormalizationStatus =
  | "unmapped"
  | "mapped"
  | "needs_review"
  | "ignored"

export type NormalizedUnit =
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

export type UnitConversionRuleStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived"

export interface RecipeIngredientLine {
  id: string
  recipeId: string
  lineOrder: number
  ingredientName: string
  ingredientCategory?: string | null
  quantity?: number | null
  unit?: string | null
  preparationNote?: string | null
  wasteNote?: string | null
  optional: boolean
  ingredientMasterId?: string | null
  normalizedQuantity?: number | null
  normalizedUnit?: NormalizedUnit | null
  normalizationStatus?: RecipeIngredientNormalizationStatus
  normalizationNote?: string | null
  createdAt: string
  updatedAt: string
}

export interface UnitConversionRule {
  id: string
  fromUnit: NormalizedUnit
  toUnit: NormalizedUnit
  conversionFactor: number
  ingredientMasterId?: string | null
  note?: string | null
  status: UnitConversionRuleStatus
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface Recipe {
  id: string
  recipeName: string
}

interface IngredientMaster {
  id: string
  ingredientNameVi: string
  defaultUnit: string
}

const INITIAL_CONVERSIONS: UnitConversionRule[] = [
  { id: 'rule-1', fromUnit: 'g', toUnit: 'kg', conversionFactor: 0.001, note: 'Quy đổi từ gram sang kilôgam chuẩn', status: 'active', createdAt: '2026-06-28 12:00', updatedAt: '2026-06-28 12:00' },
  { id: 'rule-2', fromUnit: 'ml', toUnit: 'l', conversionFactor: 0.001, note: 'Quy đổi từ mililít sang lít chuẩn', status: 'active', createdAt: '2026-06-28 12:00', updatedAt: '2026-06-28 12:00' },
  { id: 'rule-3', fromUnit: 'pcs', toUnit: 'g', conversionFactor: 150, note: 'Quy đổi cá fillet (pcs) trung bình sang gram', status: 'active', createdAt: '2026-06-28 12:00', updatedAt: '2026-06-28 12:00' }
]

function NormalizationPageContent() {
  const searchParams = useSearchParams()
  const filterRecipeId = searchParams.get('recipe_id')
  const filterIngredientMasterId = searchParams.get('ingredient_master_id')

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [masterIngredients, setMasterIngredients] = useState<IngredientMaster[]>([])
  const [ingredientLines, setIngredientLines] = useState<RecipeIngredientLine[]>([])
  const [conversionRules, setConversionRules] = useState<UnitConversionRule[]>([])
  
  const [selectedLine, setSelectedLine] = useState<RecipeIngredientLine | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State: Mapping
  const [mapForm, setMapForm] = useState({
    ingredientMasterId: '',
    normalizedQuantity: '',
    normalizedUnit: 'g' as NormalizedUnit,
    normalizationStatus: 'unmapped' as RecipeIngredientNormalizationStatus,
    normalizationNote: ''
  })

  // Form State: Conversion Rule
  const [ruleForm, setRuleForm] = useState({
    fromUnit: 'g' as NormalizedUnit,
    toUnit: 'kg' as NormalizedUnit,
    conversionFactor: '',
    ingredientMasterId: '',
    note: '',
    status: 'active' as UnitConversionRuleStatus
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [ruleErrors, setRuleErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedRecipes = localStorage.getItem('mvos_recipes')
        const storedIngredients = localStorage.getItem('mvos_recipe_ingredient_lines')
        const storedMaster = localStorage.getItem('mvos_ingredients')
        const storedRules = localStorage.getItem('mvos_unit_conversion_rules')

        let loadedRecipes: Recipe[] = []
        let loadedIngredients: RecipeIngredientLine[] = []
        let loadedMaster: IngredientMaster[] = []
        let loadedRules: UnitConversionRule[] = []

        if (storedRecipes) loadedRecipes = JSON.parse(storedRecipes)
        setRecipes(loadedRecipes)

        if (storedMaster) loadedMaster = JSON.parse(storedMaster)
        setMasterIngredients(loadedMaster)

        if (storedIngredients) {
          loadedIngredients = JSON.parse(storedIngredients)
        }
        setIngredientLines(loadedIngredients)

        if (storedRules) {
          loadedRules = JSON.parse(storedRules)
        } else {
          localStorage.setItem('mvos_unit_conversion_rules', JSON.stringify(INITIAL_CONVERSIONS))
          loadedRules = INITIAL_CONVERSIONS
        }
        setConversionRules(loadedRules)

        // Select first line that matches filter or falls back
        let targetLine: RecipeIngredientLine | null = null
        if (filterRecipeId) {
          targetLine = loadedIngredients.find(l => l.recipeId === filterRecipeId) || null
        } else if (filterIngredientMasterId) {
          targetLine = loadedIngredients.find(l => l.ingredientMasterId === filterIngredientMasterId) || null
        } else if (loadedIngredients.length > 0) {
          targetLine = loadedIngredients[0]
        }

        if (targetLine) {
          setSelectedLine(targetLine)
          setMapForm({
            ingredientMasterId: targetLine.ingredientMasterId || '',
            normalizedQuantity: targetLine.normalizedQuantity ? targetLine.normalizedQuantity.toString() : targetLine.quantity ? targetLine.quantity.toString() : '',
            normalizedUnit: targetLine.normalizedUnit || (targetLine.unit as NormalizedUnit) || 'g',
            normalizationStatus: targetLine.normalizationStatus || 'unmapped',
            normalizationNote: targetLine.normalizationNote || ''
          })
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu chuẩn hóa nguyên liệu.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [filterRecipeId, filterIngredientMasterId])

  const handleSelectLine = (line: RecipeIngredientLine) => {
    setSelectedLine(line)
    setMapForm({
      ingredientMasterId: line.ingredientMasterId || '',
      normalizedQuantity: line.normalizedQuantity ? line.normalizedQuantity.toString() : line.quantity ? line.quantity.toString() : '',
      normalizedUnit: line.normalizedUnit || (line.unit as NormalizedUnit) || 'g',
      normalizationStatus: line.normalizationStatus || 'unmapped',
      normalizationNote: line.normalizationNote || ''
    })
    setValidationErrors({})
  }

  const handleSaveMapping = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedLine) return

    const errs: Record<string, string> = {}
    if (mapForm.normalizationStatus === 'mapped' && !mapForm.ingredientMasterId) {
      errs.ingredientMasterId = 'Vui lòng chọn nguyên liệu chuẩn khi đánh dấu Đã map'
    }

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)

    const updatedLines = ingredientLines.map((line) => {
      if (line.id === selectedLine.id) {
        const updated = {
          ...line,
          ingredientMasterId: mapForm.ingredientMasterId || null,
          normalizedQuantity: mapForm.normalizedQuantity ? parseFloat(mapForm.normalizedQuantity) : null,
          normalizedUnit: mapForm.normalizedUnit || null,
          normalizationStatus: mapForm.normalizationStatus,
          normalizationNote: mapForm.normalizationNote || null,
          updatedAt: nowStr
        }
        setSelectedLine(updated)
        return updated
      }
      return line
    })

    localStorage.setItem('mvos_recipe_ingredient_lines', JSON.stringify(updatedLines))
    setIngredientLines(updatedLines)
  }

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!ruleForm.fromUnit) errs.fromUnit = 'Đơn vị gốc là bắt buộc'
    if (!ruleForm.toUnit) errs.toUnit = 'Đơn vị chuẩn là bắt buộc'
    if (!ruleForm.conversionFactor || isNaN(parseFloat(ruleForm.conversionFactor))) {
      errs.conversionFactor = 'Hệ số quy đổi phải là chữ số hợp lệ'
    }

    if (Object.keys(errs).length > 0) {
      setRuleErrors(errs)
      return
    }

    setRuleErrors({})

    const newRule: UnitConversionRule = {
      id: `rule-${Date.now().toString().slice(-4)}`,
      fromUnit: ruleForm.fromUnit,
      toUnit: ruleForm.toUnit,
      conversionFactor: parseFloat(ruleForm.conversionFactor),
      ingredientMasterId: ruleForm.ingredientMasterId || null,
      note: ruleForm.note || null,
      status: ruleForm.status,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...conversionRules, newRule]
    localStorage.setItem('mvos_unit_conversion_rules', JSON.stringify(updated))
    setConversionRules(updated)

    setRuleForm({
      fromUnit: 'g',
      toUnit: 'kg',
      conversionFactor: '',
      ingredientMasterId: '',
      note: '',
      status: 'active'
    })
  }

  const handleQuickStatusUpdate = (lineId: string, nextStatus: RecipeIngredientNormalizationStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updatedLines = ingredientLines.map((line) => {
      if (line.id === lineId) {
        const updated = {
          ...line,
          normalizationStatus: nextStatus,
          updatedAt: nowStr
        }
        if (selectedLine?.id === lineId) {
          setSelectedLine(updated)
          setMapForm(prev => ({ ...prev, normalizationStatus: nextStatus }))
        }
        return updated
      }
      return line
    })

    localStorage.setItem('mvos_recipe_ingredient_lines', JSON.stringify(updatedLines))
    setIngredientLines(updatedLines)
  }

  const getRecipeName = (recipeId: string) => {
    const found = recipes.find(r => r.id === recipeId)
    return found ? found.recipeName : recipeId
  }

  const getMasterIngredientName = (masterId: string | null | undefined) => {
    if (!masterId) return 'Chưa kết nối nguyên liệu chuẩn'
    const found = masterIngredients.find(m => m.id === masterId)
    return found ? found.ingredientNameVi : masterId
  }

  const getStatusLabel = (s: RecipeIngredientNormalizationStatus) => {
    switch (s) {
      case 'unmapped': return 'Chưa map'
      case 'mapped': return 'Đã map'
      case 'needs_review': return 'Cần kiểm tra'
      case 'ignored': return 'Bỏ qua'
      default: return s
    }
  }

  const getStatusClass = (s: RecipeIngredientNormalizationStatus) => {
    switch (s) {
      case 'mapped': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'needs_review': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 font-bold'
      case 'ignored': return 'bg-red-500/10 border border-red-500/25 text-red-500'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getRuleStatusLabel = (s: UnitConversionRuleStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'active': return 'Áp dụng'
      case 'paused': return 'Tạm dừng'
      case 'archived': return 'Lưu trữ'
      default: return s
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải dữ liệu chuẩn hóa nguyên liệu…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải dữ liệu chuẩn hóa nguyên liệu.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Filter logic
  const filteredLines = ingredientLines.filter((l) => {
    if (filterRecipeId && l.recipeId !== filterRecipeId) return false
    if (filterIngredientMasterId && l.ingredientMasterId !== filterIngredientMasterId) return false
    return true
  })

  // Summary counts (real data only)
  const totalCount = ingredientLines.length
  const mappedCount = ingredientLines.filter(l => l.normalizationStatus === 'mapped').length
  const unmappedCount = ingredientLines.filter(l => !l.normalizationStatus || l.normalizationStatus === 'unmapped').length
  const needsReviewCount = ingredientLines.filter(l => l.normalizationStatus === 'needs_review').length
  const ignoredCount = ingredientLines.filter(l => l.normalizationStatus === 'ignored').length

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          ⚖️ Chuẩn hóa nguyên liệu công thức (Normalization)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Map nguyên liệu trong công thức với danh mục nguyên liệu chuẩn để chuẩn bị cho inventory và food cost sau này.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng dòng nguyên liệu</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã map chuẩn</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{mappedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Chưa liên kết</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{unmappedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cần kiểm tra</span>
          <span className="text-2xl font-serif-cormorant font-bold text-orange-400 mt-1 block">{needsReviewCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Bỏ qua</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{ignoredCount}</span>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: List of recipe ingredient lines */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Công thức</th>
                    <th className="py-3 px-4">Nguyên liệu gốc</th>
                    <th className="py-3 px-4">Nguyên liệu chuẩn</th>
                    <th className="py-3 px-4">Định lượng gốc</th>
                    <th className="py-3 px-4">Định lượng chuẩn</th>
                    <th className="py-3 px-4 text-center">Trạng thái map</th>
                    <th className="py-3 px-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {filteredLines.length > 0 ? (
                    filteredLines.map((line) => (
                      <tr
                        key={line.id}
                        onClick={() => handleSelectLine(line)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedLine?.id === line.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-foreground/80">{getRecipeName(line.recipeId)}</td>
                        <td className="py-3.5 px-4 font-bold text-foreground">{line.ingredientName}</td>
                        <td className="py-3.5 px-4 font-semibold text-gold-hover">{getMasterIngredientName(line.ingredientMasterId)}</td>
                        <td className="py-3.5 px-4 font-mono">
                          {line.quantity !== null ? line.quantity : '-'} {line.unit || ''}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-gold">
                          {line.normalizedQuantity !== null ? line.normalizedQuantity : '-'} {line.normalizedUnit || ''}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(line.normalizationStatus || 'unmapped')}`}>
                            {getStatusLabel(line.normalizationStatus || 'unmapped')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 max-w-[150px] truncate text-foreground/60 italic" title={line.normalizationNote || ''}>
                          {line.normalizationNote || '-'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có dòng nguyên liệu công thức nào cần chuẩn hóa.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Unit Conversion Reference */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              ⚖️ Bảng tham chiếu quy đổi đơn vị (Unit Conversion Rules)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/70">
                <thead>
                  <tr className="border-b border-gold-border/20 text-gold uppercase tracking-wider text-[9px] font-mono">
                    <th className="py-2">Đơn vị từ</th>
                    <th className="py-2">Đơn vị sang</th>
                    <th className="py-2">Hệ số quy đổi</th>
                    <th className="py-2">Nguyên liệu áp dụng</th>
                    <th className="py-2">Lưu ý ghi chú</th>
                    <th className="py-2 text-center">Trạng thái</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {conversionRules.length > 0 ? (
                    conversionRules.map((rule) => (
                      <tr key={rule.id} className="hover:bg-gold-muted/5">
                        <td className="py-2.5 font-bold font-mono text-foreground">{rule.fromUnit}</td>
                        <td className="py-2.5 font-bold font-mono text-gold">{rule.toUnit}</td>
                        <td className="py-2.5 font-mono text-gold-hover font-bold">{rule.conversionFactor}</td>
                        <td className="py-2.5 font-semibold">{getMasterIngredientName(rule.ingredientMasterId)}</td>
                        <td className="py-2.5 italic text-foreground/60">{rule.note || '-'}</td>
                        <td className="py-2.5 text-center">
                          <span className="inline-block rounded px-1.5 py-0.5 text-[8px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">
                            {getRuleStatusLabel(rule.status)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-foreground/40 italic">
                        Chưa có quy đổi đơn vị nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Add Rule Form */}
            <form onSubmit={handleCreateRule} className="bg-gold-muted/5 border border-gold-border/10 p-4 rounded space-y-3">
              <span className="text-[10px] text-gold font-bold block uppercase tracking-wider">➕ Thêm hệ số quy đổi mới</span>
              
              <div className="grid gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-foreground/50">Đơn vị gốc *</label>
                  <select
                    value={ruleForm.fromUnit}
                    onChange={(e) => setRuleForm({ ...ruleForm, fromUnit: e.target.value as NormalizedUnit })}
                    className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">lít</option>
                    <option value="pcs">cái / pcs</option>
                    <option value="portion">phần ăn</option>
                    <option value="bunch">bó</option>
                    <option value="bottle">chai</option>
                    <option value="can">lon</option>
                    <option value="pack">gói</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-foreground/50">Đơn vị sang *</label>
                  <select
                    value={ruleForm.toUnit}
                    onChange={(e) => setRuleForm({ ...ruleForm, toUnit: e.target.value as NormalizedUnit })}
                    className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">lít</option>
                    <option value="pcs">cái / pcs</option>
                    <option value="portion">phần ăn</option>
                    <option value="bunch">bó</option>
                    <option value="bottle">chai</option>
                    <option value="can">lon</option>
                    <option value="pack">gói</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-foreground/50">Hệ số quy đổi *</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Ví dụ: 0.001"
                    value={ruleForm.conversionFactor}
                    onChange={(e) => setRuleForm({ ...ruleForm, conversionFactor: e.target.value })}
                    className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-xs focus:outline-none font-mono"
                  />
                  {ruleErrors.conversionFactor && <span className="text-[8px] text-red-400 italic">{ruleErrors.conversionFactor}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[9px] text-foreground/50">Nguyên liệu áp dụng</label>
                  <select
                    value={ruleForm.ingredientMasterId}
                    onChange={(e) => setRuleForm({ ...ruleForm, ingredientMasterId: e.target.value })}
                    className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value="">-- Áp dụng toàn cục --</option>
                    {masterIngredients.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.ingredientNameVi}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[9px] text-foreground/50">Ghi chú quy đổi</label>
                <input
                  type="text"
                  placeholder="Đong đếm hoặc chuyển đổi bao bì..."
                  value={ruleForm.note}
                  onChange={(e) => setRuleForm({ ...ruleForm, note: e.target.value })}
                  className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-xs focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold/90 hover:bg-gold px-4 py-1.5 text-xs text-background font-bold transition-all"
              >
                Lưu hệ số quy đổi
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Normalization mapping Form & Actions */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              ⚖️ Map chuẩn hóa dòng nguyên liệu
            </h3>

            {selectedLine ? (
              <form onSubmit={handleSaveMapping} className="space-y-4 text-xs">
                <div>
                  <span className="text-[9px] text-foreground/50 font-mono block">Công thức nấu</span>
                  <span className="font-bold text-foreground block text-sm">{getRecipeName(selectedLine.recipeId)}</span>
                </div>

                <div>
                  <span className="text-[9px] text-foreground/50 font-mono block">Nguyên liệu gốc ghi trong công thức</span>
                  <div className="bg-background/40 p-2.5 rounded border border-gold-border/10">
                    <div className="font-bold text-gold text-sm">{selectedLine.ingredientName}</div>
                    <div className="mt-1 font-mono text-foreground/60 text-[10px]">
                      Định lượng gốc: {selectedLine.quantity !== null ? selectedLine.quantity : '-'} {selectedLine.unit || ''}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Nguyên liệu chuẩn tương ứng *</label>
                  <select
                    value={mapForm.ingredientMasterId}
                    onChange={(e) => setMapForm({ ...mapForm, ingredientMasterId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn nguyên liệu chuẩn --</option>
                    {masterIngredients.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.ingredientNameVi} ({item.defaultUnit})
                      </option>
                    ))}
                  </select>
                  {validationErrors.ingredientMasterId && <span className="text-[10px] text-red-400 italic">{validationErrors.ingredientMasterId}</span>}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Định lượng chuẩn hóa</label>
                    <input
                      type="number"
                      step="any"
                      placeholder="Ví dụ: 0.5"
                      value={mapForm.normalizedQuantity}
                      onChange={(e) => setMapForm({ ...mapForm, normalizedQuantity: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Đơn vị chuẩn hóa</label>
                    <select
                      value={mapForm.normalizedUnit}
                      onChange={(e) => setMapForm({ ...mapForm, normalizedUnit: e.target.value as NormalizedUnit })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">lít</option>
                      <option value="pcs">cái / pcs</option>
                      <option value="portion">phần ăn</option>
                      <option value="bunch">bó</option>
                      <option value="bottle">chai</option>
                      <option value="can">lon</option>
                      <option value="pack">gói</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái Map chuẩn hóa *</label>
                  <select
                    value={mapForm.normalizationStatus}
                    onChange={(e) => setMapForm({ ...mapForm, normalizationStatus: e.target.value as RecipeIngredientNormalizationStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  >
                    <option value="unmapped">Chưa map (Unmapped)</option>
                    <option value="mapped">Đã map chuẩn (Mapped)</option>
                    <option value="needs_review">Cần bếp trưởng kiểm tra (Needs Review)</option>
                    <option value="ignored">Bỏ qua dòng này (Ignored)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú chuẩn hóa</label>
                  <textarea
                    rows={3}
                    placeholder="Lý do chênh lệch định lượng, quy đổi bao bì..."
                    value={mapForm.normalizationNote}
                    onChange={(e) => setMapForm({ ...mapForm, normalizationNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 rounded bg-gold px-4 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
                  >
                    Lưu kết quả map
                  </button>
                </div>

                {/* Quick Status actions */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Thao tác nhanh trạng thái</span>
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate(selectedLine.id, 'mapped')}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-[10px] text-green-400 hover:bg-green-500/10 font-semibold"
                    >
                      Đã map chuẩn
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate(selectedLine.id, 'needs_review')}
                      className="rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-[10px] text-yellow-500 hover:bg-yellow-500/10 font-semibold"
                    >
                      Cần kiểm tra
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate(selectedLine.id, 'ignored')}
                      className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-[10px] text-red-400 hover:bg-red-500/10"
                    >
                      Bỏ qua dòng này
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickStatusUpdate(selectedLine.id, 'unmapped')}
                      className="rounded border border-foreground/30 hover:border-foreground/60 px-2 py-1.5 text-[10px] text-foreground/60 hover:bg-foreground/5"
                    >
                      Đưa về chưa map
                    </button>
                  </div>
                </div>

                <div className="border-t border-gold-border/20 pt-4 flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Liên kết module</span>
                  <div className="flex gap-2">
                    <Link
                      href={`/studio/recipes?recipe_id=${selectedLine.recipeId}`}
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      🍳 Xem công thức nấu
                    </Link>
                    {mapForm.ingredientMasterId && (
                      <Link
                        href={`/studio/ingredients?ingredient_id=${mapForm.ingredientMasterId}`}
                        className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                      >
                        🥕 Xem nguyên liệu chuẩn
                      </Link>
                    )}
                  </div>
                </div>
              </form>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một dòng nguyên liệu cần map từ danh sách bên trái.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NormalizationPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải dữ liệu chuẩn hóa nguyên liệu…</p>
      </div>
    }>
      <NormalizationPageContent />
    </Suspense>
  )
}
