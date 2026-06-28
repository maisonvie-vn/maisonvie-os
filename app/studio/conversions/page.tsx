'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type UnitConversionType = 'global' | 'ingredient_specific'

export interface UnitConversion {
  id: string
  ingredientMasterId?: string | null
  fromUnit: string
  toUnit: string
  factor: number
  conversionType: UnitConversionType
  isActive: boolean
  notes?: string | null
  createdAt: string
  updatedAt: string
}

interface IngredientMaster {
  id: string
  ingredientNameVi: string
  defaultUnit: string
}

const INITIAL_CONVERSIONS: UnitConversion[] = [
  {
    id: 'uc-001',
    ingredientMasterId: null,
    fromUnit: 'kg',
    toUnit: 'g',
    factor: 1000,
    conversionType: 'global',
    isActive: true,
    notes: 'Quy đổi khối lượng chuẩn từ Kilogram sang Gram',
    createdAt: '2026-06-28 12:00',
    updatedAt: '2026-06-28 12:00'
  },
  {
    id: 'uc-002',
    ingredientMasterId: null,
    fromUnit: 'l',
    toUnit: 'ml',
    factor: 1000,
    conversionType: 'global',
    isActive: true,
    notes: 'Quy đổi thể tích chuẩn từ Lít sang Mililít',
    createdAt: '2026-06-28 12:00',
    updatedAt: '2026-06-28 12:00'
  },
  {
    id: 'uc-003',
    ingredientMasterId: 'ing-master-001',
    fromUnit: 'box',
    toUnit: 'kg',
    factor: 5,
    conversionType: 'ingredient_specific',
    isActive: true,
    notes: '1 Thùng tôm hùm sống Na Uy đóng quy chuẩn 5kg',
    createdAt: '2026-06-28 12:05',
    updatedAt: '2026-06-28 12:05'
  },
  {
    id: 'uc-004',
    ingredientMasterId: 'ing-master-004',
    fromUnit: 'bag',
    toUnit: 'kg',
    factor: 2,
    conversionType: 'ingredient_specific',
    isActive: true,
    notes: '1 Túi lưới nghêu sạch cát đóng quy chuẩn 2kg',
    createdAt: '2026-06-28 12:05',
    updatedAt: '2026-06-28 12:05'
  }
]

function ConversionsPageContent() {
  const [conversions, setConversions] = useState<UnitConversion[]>([])
  const [masterIngredients, setMasterIngredients] = useState<IngredientMaster[]>([])
  const [selectedConversion, setSelectedConversion] = useState<UnitConversion | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter States
  const [filterIngredient, setFilterIngredient] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterActive, setFilterActive] = useState('all')

  // Form State: Unit Conversion Header
  const [form, setForm] = useState({
    ingredientMasterId: '',
    fromUnit: '',
    toUnit: '',
    factor: '',
    conversionType: 'global' as UnitConversionType,
    notes: ''
  })
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Form State: Conversion Preview Calculator
  const [previewCalc, setPreviewCalc] = useState({
    ingredientMasterId: '',
    fromUnit: '',
    toUnit: '',
    quantity: ''
  })
  const [previewResult, setPreviewResult] = useState<number | null>(null)
  const [previewError, setPreviewError] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedConversions = localStorage.getItem('mvos_unit_conversions')
        const storedMaster = localStorage.getItem('mvos_ingredients')

        let loadedConversions: UnitConversion[] = []
        let loadedIngredients: IngredientMaster[] = []

        if (storedConversions) {
          loadedConversions = JSON.parse(storedConversions)
        } else {
          localStorage.setItem('mvos_unit_conversions', JSON.stringify(INITIAL_CONVERSIONS))
          loadedConversions = INITIAL_CONVERSIONS
        }
        setConversions(loadedConversions)

        if (storedMaster) loadedIngredients = JSON.parse(storedMaster)
        setMasterIngredients(loadedIngredients)

        if (loadedConversions.length > 0) {
          setSelectedConversion(loadedConversions[0])
        }

        setLoading(false)
      } catch {
        setError('Không thể tải cấu hình quy đổi đơn vị.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  // Auto-switch preview form units if preview target changes
  const handlePreviewCalculate = (e: React.FormEvent) => {
    e.preventDefault()
    setPreviewError(null)
    setPreviewResult(null)

    if (!previewCalc.fromUnit || !previewCalc.toUnit) {
      setPreviewError('Vui lòng chọn hoặc nhập đơn vị gốc và đơn vị quy đổi.')
      return
    }

    const qtyVal = parseFloat(previewCalc.quantity)
    if (isNaN(qtyVal) || qtyVal < 0) {
      setPreviewError('Số lượng ban đầu không được nhỏ hơn 0.')
      return
    }

    // Lookup logic
    // 1. Prefer active ingredient-specific conversion
    let found = conversions.find(c => 
      c.isActive &&
      c.conversionType === 'ingredient_specific' &&
      c.ingredientMasterId === previewCalc.ingredientMasterId &&
      c.fromUnit.toLowerCase() === previewCalc.fromUnit.toLowerCase() &&
      c.toUnit.toLowerCase() === previewCalc.toUnit.toLowerCase()
    )

    // 2. Fallback to active global conversion
    if (!found) {
      found = conversions.find(c =>
        c.isActive &&
        c.conversionType === 'global' &&
        c.fromUnit.toLowerCase() === previewCalc.fromUnit.toLowerCase() &&
        c.toUnit.toLowerCase() === previewCalc.toUnit.toLowerCase()
      )
    }

    // 3. Fallback: try reverse conversion (using 1 / factor)
    let isReversed = false
    if (!found) {
      found = conversions.find(c =>
        c.isActive &&
        c.conversionType === 'ingredient_specific' &&
        c.ingredientMasterId === previewCalc.ingredientMasterId &&
        c.fromUnit.toLowerCase() === previewCalc.toUnit.toLowerCase() &&
        c.toUnit.toLowerCase() === previewCalc.fromUnit.toLowerCase()
      )
      if (found) isReversed = true
    }

    if (!found && !isReversed) {
      found = conversions.find(c =>
        c.isActive &&
        c.conversionType === 'global' &&
        c.fromUnit.toLowerCase() === previewCalc.toUnit.toLowerCase() &&
        c.toUnit.toLowerCase() === previewCalc.fromUnit.toLowerCase()
      )
      if (found) isReversed = true
    }

    if (!found) {
      setPreviewError('Không thể quy đổi vì chưa có cấu hình phù hợp.')
      return
    }

    const factor = isReversed ? (1 / found.factor) : found.factor
    setPreviewResult(qtyVal * factor)
  }

  const handleCreateConversion = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}

    if (form.conversionType === 'ingredient_specific' && !form.ingredientMasterId) {
      errs.ingredientMasterId = 'Quy đổi theo nguyên liệu phải chọn nguyên liệu.'
    }
    if (form.conversionType === 'global' && form.ingredientMasterId) {
      errs.ingredientMasterId = 'Quy đổi chung không được gắn với nguyên liệu cụ thể.'
    }
    if (!form.fromUnit.trim()) errs.fromUnit = 'Vui lòng nhập đơn vị gốc.'
    if (!form.toUnit.trim()) errs.toUnit = 'Vui lòng nhập đơn vị quy đổi.'
    
    if (form.fromUnit.trim().toLowerCase() === form.toUnit.trim().toLowerCase()) {
      errs.toUnit = 'Đơn vị gốc và đơn vị quy đổi không được giống nhau.'
    }

    const factorVal = parseFloat(form.factor)
    if (isNaN(factorVal) || factorVal <= 0) {
      errs.factor = 'Hệ số quy đổi phải lớn hơn 0.'
    }

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const fromU = form.fromUnit.trim().toLowerCase()
    const toU = form.toUnit.trim().toLowerCase()

    // Prevent duplicates
    const isDuplicate = conversions.some((c) => {
      if (!c.isActive) return false
      if (c.conversionType !== form.conversionType) return false
      if (form.conversionType === 'global') {
        return c.fromUnit.toLowerCase() === fromU && c.toUnit.toLowerCase() === toU
      } else {
        return c.ingredientMasterId === form.ingredientMasterId && c.fromUnit.toLowerCase() === fromU && c.toUnit.toLowerCase() === toU
      }
    })

    if (isDuplicate) {
      alert('Quy đổi này đã tồn tại.')
      return
    }

    const newConversion: UnitConversion = {
      id: `uc-${Date.now().toString().slice(-4)}`,
      ingredientMasterId: form.conversionType === 'ingredient_specific' ? form.ingredientMasterId : null,
      fromUnit: form.fromUnit.trim(),
      toUnit: form.toUnit.trim(),
      factor: factorVal,
      conversionType: form.conversionType,
      isActive: true,
      notes: form.notes.trim() || null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...conversions, newConversion]
    localStorage.setItem('mvos_unit_conversions', JSON.stringify(updated))
    setConversions(updated)
    setSelectedConversion(newConversion)

    setForm({
      ingredientMasterId: '',
      fromUnit: '',
      toUnit: '',
      factor: '',
      conversionType: 'global',
      notes: ''
    })

    alert('Quy đổi đơn vị đã được lưu.')
  }

  const handleDeactivateConversion = (id: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = conversions.map((c) => {
      if (c.id === id) {
        const item = { ...c, isActive: false, updatedAt: nowStr }
        if (selectedConversion?.id === id) setSelectedConversion(item)
        return item
      }
      return c
    })
    localStorage.setItem('mvos_unit_conversions', JSON.stringify(updated))
    setConversions(updated)
    alert('Quy đổi đơn vị đã ngừng áp dụng.')
  }

  const handleActivateConversion = (id: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = conversions.map((c) => {
      if (c.id === id) {
        const item = { ...c, isActive: true, updatedAt: nowStr }
        if (selectedConversion?.id === id) setSelectedConversion(item)
        return item
      }
      return c
    })
    localStorage.setItem('mvos_unit_conversions', JSON.stringify(updated))
    setConversions(updated)
    alert('Quy đổi đơn vị đã được lưu.')
  }

  const getIngredientName = (id: string | null | undefined) => {
    if (!id) return 'Quy đổi chung (Toàn cục)'
    const found = masterIngredients.find(m => m.id === id)
    return found ? found.ingredientNameVi : id
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải cấu hình quy đổi…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải cấu hình quy đổi đơn vị.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  const filteredConversions = conversions.filter((c) => {
    if (filterIngredient && c.ingredientMasterId !== filterIngredient) return false
    if (filterType && c.conversionType !== filterType) return false
    if (filterActive !== 'all') {
      const activeBool = filterActive === 'active'
      if (c.isActive !== activeBool) return false
    }
    return true
  })

  // Summary counts
  const totalCount = conversions.length
  const globalCount = conversions.filter(c => c.conversionType === 'global').length
  const specificCount = conversions.filter(c => c.conversionType === 'ingredient_specific').length
  const activeCount = conversions.filter(c => c.isActive).length

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          ⚖️ Quy đổi đơn vị (Unit Conversion)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Cấu hình hệ số chuyển đổi đơn vị đo lường toàn cục và theo từng nguyên liệu đặc thù.
        </p>
      </div>

      {/* Warning Banner */}
      <div className="glass-panel p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/5 flex items-start gap-3">
        <span className="text-base text-yellow-500 mt-0.5">⚠️</span>
        <div className="text-xs space-y-1">
          <p className="font-bold text-yellow-500">Quy đổi đơn vị hiện chỉ là nền tảng cấu hình.</p>
          <p className="text-foreground/75">
            Hệ thống chưa tự động quy đổi tồn kho, giá vốn hoặc định lượng món trong bước này.
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng cấu hình quy đổi</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Quy đổi chung</span>
          <span className="text-2xl font-serif-cormorant font-bold text-foreground mt-1 block">{globalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Theo nguyên liệu</span>
          <span className="text-2xl font-serif-cormorant font-bold text-foreground mt-1 block">{specificCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang áp dụng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{activeCount}</span>
        </div>
      </div>

      {/* Filter panel */}
      <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 flex flex-wrap gap-4 text-xs">
        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-foreground/50 uppercase font-mono">Lọc theo nguyên liệu</label>
          <select
            value={filterIngredient}
            onChange={(e) => setFilterIngredient(e.target.value)}
            className="rounded border border-gold-border/30 bg-background px-3 py-1 text-xs text-foreground focus:border-gold focus:outline-none"
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
          <label className="text-[9px] text-foreground/50 uppercase font-mono">Lọc theo loại quy đổi</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded border border-gold-border/30 bg-background px-3 py-1 text-xs text-foreground focus:border-gold focus:outline-none"
          >
            <option value="">-- Tất cả loại quy đổi --</option>
            <option value="global">Quy đổi chung (Toàn cục)</option>
            <option value="ingredient_specific">Quy đổi theo nguyên liệu</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-[9px] text-foreground/50 uppercase font-mono">Trạng thái áp dụng</label>
          <select
            value={filterActive}
            onChange={(e) => setFilterActive(e.target.value)}
            className="rounded border border-gold-border/30 bg-background px-3 py-1 text-xs text-foreground focus:border-gold focus:outline-none"
          >
            <option value="all">Tất cả</option>
            <option value="active">Đang áp dụng</option>
            <option value="inactive">Ngừng áp dụng</option>
          </select>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Conversions List & Add Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Conversions Table */}
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Đối tượng</th>
                    <th className="py-3 px-4">Đơn vị gốc</th>
                    <th className="py-3 px-4">Đơn vị quy đổi</th>
                    <th className="py-3 px-4 text-right">Hệ số quy đổi</th>
                    <th className="py-3 px-4">Loại quy đổi</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4">Ghi chú</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {filteredConversions.length > 0 ? (
                    filteredConversions.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => setSelectedConversion(c)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedConversion?.id === c.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-bold text-foreground">{getIngredientName(c.ingredientMasterId)}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-foreground/80">{c.fromUnit}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-gold">{c.toUnit}</td>
                        <td className="py-3.5 px-4 text-right font-mono font-bold text-foreground">{c.factor}</td>
                        <td className="py-3.5 px-4 text-[10px]">
                          <span className="font-semibold text-foreground/75">
                            {c.conversionType === 'global' ? 'Quy đổi chung' : 'Theo nguyên liệu'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${c.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-foreground/5 text-foreground/40 line-through'}`}>
                            {c.isActive ? 'Đang áp dụng' : 'Ngừng áp dụng'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/60 max-w-[150px] truncate">{c.notes || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có quy đổi đơn vị nào được cấu hình.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Add Unit Conversion */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Khởi tạo cấu hình quy đổi mới
            </h3>

            <form onSubmit={handleCreateConversion} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Loại quy đổi *</label>
                  <select
                    value={form.conversionType}
                    onChange={(e) => setForm({ ...form, conversionType: e.target.value as UnitConversionType, ingredientMasterId: '' })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="global">Quy đổi chung (Global - Ví dụ: kg sang g)</option>
                    <option value="ingredient_specific">Quy đổi theo nguyên liệu (Ingredient Specific - Ví dụ: box sang kg)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Nguyên liệu chọn lọc</label>
                  <select
                    disabled={form.conversionType === 'global'}
                    value={form.ingredientMasterId}
                    onChange={(e) => setForm({ ...form, ingredientMasterId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none disabled:opacity-40"
                  >
                    <option value="">-- Chỉ dành cho quy đổi theo nguyên liệu --</option>
                    {masterIngredients.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.ingredientNameVi} ({m.defaultUnit})
                      </option>
                    ))}
                  </select>
                  {validationErrors.ingredientMasterId && <span className="text-[10px] text-red-400 italic">{validationErrors.ingredientMasterId}</span>}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Đơn vị gốc *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: kg, box, l, bottle..."
                    value={form.fromUnit}
                    onChange={(e) => setForm({ ...form, fromUnit: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                  {validationErrors.fromUnit && <span className="text-[10px] text-red-400 italic">{validationErrors.fromUnit}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Đơn vị quy đổi *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: g, ml, kg, portion..."
                    value={form.toUnit}
                    onChange={(e) => setForm({ ...form, toUnit: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                  {validationErrors.toUnit && <span className="text-[10px] text-red-400 italic">{validationErrors.toUnit}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold">Hệ số quy đổi *</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="Ví dụ: 1000, 5, 2.5..."
                    value={form.factor}
                    onChange={(e) => setForm({ ...form, factor: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono font-bold"
                  />
                  {validationErrors.factor && <span className="text-[10px] text-red-400 italic">{validationErrors.factor}</span>}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Ghi chú chi tiết</label>
                <input
                  type="text"
                  placeholder="Ghi nhận quy cách đóng gói hoặc công thức quy đổi..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Lưu quy đổi
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed panel & Preview Calculator */}
        <div className="space-y-6">
          {/* Conversion Preview Calculator */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🧪 Xem thử quy đổi (Preview Calculator)
            </h3>

            <form onSubmit={handlePreviewCalculate} className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/50 font-mono">Nguyên liệu xem thử (Nếu có)</label>
                <select
                  value={previewCalc.ingredientMasterId}
                  onChange={(e) => setPreviewCalc({ ...previewCalc, ingredientMasterId: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-2 py-1 text-[10px] text-foreground focus:outline-none"
                >
                  <option value="">-- Xem thử quy đổi chung --</option>
                  {masterIngredients.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.ingredientNameVi}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2 grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/50 font-mono">Đơn vị gốc</label>
                  <input
                    type="text"
                    placeholder="kg, box..."
                    value={previewCalc.fromUnit}
                    onChange={(e) => setPreviewCalc({ ...previewCalc, fromUnit: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-2 py-1 text-[10px] focus:outline-none font-mono"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/50 font-mono">Đơn vị quy đổi</label>
                  <input
                    type="text"
                    placeholder="g, kg..."
                    value={previewCalc.toUnit}
                    onChange={(e) => setPreviewCalc({ ...previewCalc, toUnit: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-2 py-1 text-[10px] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/50 font-mono">Số lượng ban đầu *</label>
                <input
                  type="number"
                  step="any"
                  placeholder="Ví dụ: 10..."
                  value={previewCalc.quantity}
                  onChange={(e) => setPreviewCalc({ ...previewCalc, quantity: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-2 py-1 text-[10px] focus:outline-none font-mono font-bold"
                />
              </div>

              {previewError && <p className="text-[10px] text-red-400 italic">⚠️ {previewError}</p>}

              <button
                type="submit"
                className="w-full rounded bg-gold hover:bg-gold-hover text-background py-1.5 text-xs font-bold transition-all text-center"
              >
                Tính toán kết quả
              </button>

              {previewResult !== null && (
                <div className="p-3 bg-gold-muted/10 border border-gold-border/20 rounded text-center space-y-1 mt-2">
                  <span className="text-[9px] text-foreground/50 uppercase block font-mono">Số lượng sau quy đổi</span>
                  <span className="text-xl font-bold font-mono text-gold">
                    {previewCalc.quantity} {previewCalc.fromUnit} = {previewResult} {previewCalc.toUnit}
                  </span>
                </div>
              )}
            </form>
          </div>

          {/* Detailed view */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2 font-serif-cormorant">
              🔎 Chi tiết cấu hình quy đổi
            </h3>

            {selectedConversion ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-foreground">
                    {selectedConversion.fromUnit} &rarr; {selectedConversion.toUnit}
                  </h4>
                  <span className="text-[9px] text-foreground/45 font-mono">Hệ số quy đổi: {selectedConversion.factor}</span>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div className="col-span-2">
                    <span className="text-[9px] text-foreground/50 font-mono block">Áp dụng cho</span>
                    <span className="font-bold text-gold-hover block text-xs">{getIngredientName(selectedConversion.ingredientMasterId)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Loại quy đổi</span>
                    <span className="font-bold text-foreground block text-xs">
                      {selectedConversion.conversionType === 'global' ? 'Toàn cục (Global)' : 'Theo nguyên liệu'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${selectedConversion.isActive ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-foreground/5 text-foreground/40 line-through'}`}>
                      {selectedConversion.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
                    </span>
                  </div>
                </div>

                {selectedConversion.notes && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú quy đổi</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedConversion.notes}</p>
                  </div>
                )}

                <div className="grid gap-1 grid-cols-2 text-[8px] text-foreground/45 font-mono border-t border-gold-border/10 pt-2.5">
                  <div>Tạo ngày: {selectedConversion.createdAt}</div>
                  <div>Cập nhật ngày: {selectedConversion.updatedAt}</div>
                </div>

                <div className="pt-2 flex gap-2">
                  {selectedConversion.isActive ? (
                    <button
                      type="button"
                      onClick={() => handleDeactivateConversion(selectedConversion.id)}
                      className="w-full rounded border border-red-500/40 hover:border-red-500 py-1.5 text-center text-xs text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                    >
                      Ngừng sử dụng quy đổi
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleActivateConversion(selectedConversion.id)}
                      className="w-full rounded bg-gold hover:bg-gold-hover py-1.5 text-center text-xs text-background transition-all font-semibold"
                    >
                      Kích hoạt sử dụng lại
                    </button>
                  )}
                </div>

                <div className="border-t border-gold-border/20 pt-4 flex flex-col gap-1.5">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Liên kết module liên quan</span>
                  <div className="flex gap-2">
                    <Link
                      href="/studio/ingredients"
                      className="flex-1 rounded border border-gold-border/40 hover:border-gold px-2 py-2 text-center text-[10px] text-foreground hover:text-gold transition-all"
                    >
                      🥕 Xem nguyên liệu
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
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một cấu hình quy đổi từ bảng danh sách để xem chi tiết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ConversionsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải cấu hình quy đổi…</p>
      </div>
    }>
      <ConversionsPageContent />
    </Suspense>
  )
}
