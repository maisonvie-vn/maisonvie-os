'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type IngredientCategory =
  | "protein"
  | "beef"
  | "poultry"
  | "pork"
  | "lamb"
  | "seafood"
  | "fish"
  | "shellfish"
  | "vegetable"
  | "fruit"
  | "dairy"
  | "cheese"
  | "butter"
  | "egg"
  | "dry_goods"
  | "flour"
  | "rice_grain"
  | "pasta"
  | "spice"
  | "herb"
  | "oil_fat"
  | "sauce"
  | "stock"
  | "garnish"
  | "pastry"
  | "chocolate"
  | "beverage"
  | "wine"
  | "non_food"
  | "other"

export type IngredientDefaultUnit =
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

export type IngredientStorageType =
  | "dry"
  | "chilled"
  | "frozen"
  | "ambient"
  | "wine_cellar"
  | "chemical_safe"
  | "other"

export type IngredientStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived"

export interface IngredientMasterItem {
  id: string
  ingredientCode?: string | null
  ingredientNameVi: string
  ingredientNameEn?: string | null
  ingredientNameFr?: string | null
  category: IngredientCategory
  subcategory?: string | null
  defaultUnit: IngredientDefaultUnit
  purchaseUnitNote?: string | null
  recipeUnitNote?: string | null
  storageType?: IngredientStorageType | null
  shelfLifeNote?: string | null
  allergyNote?: string | null
  dietaryNote?: string | null
  qualitySpecification?: string | null
  preparationNote?: string | null
  kitchenNote?: string | null
  status: IngredientStatus
  ownerName?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

const INITIAL_INGREDIENTS: IngredientMasterItem[] = [
  {
    id: 'ing-master-001',
    ingredientCode: 'ING-TOM-HUM',
    ingredientNameVi: 'Tôm hùm nước ngọt',
    ingredientNameEn: 'Crayfish',
    ingredientNameFr: 'Écrevisse',
    category: 'seafood',
    subcategory: 'Hải sản tươi sống',
    defaultUnit: 'kg',
    purchaseUnitNote: 'Mua theo túi 5kg đông lạnh nguyên con',
    recipeUnitNote: 'Rã đông và bóc vỏ lấy thịt, tính định lượng gram',
    storageType: 'frozen',
    shelfLifeNote: 'Đông lạnh -18 độ C bảo quản trong 3 tháng',
    allergyNote: 'Giáp xác / hải sản vỏ cứng',
    dietaryNote: 'Không thích hợp cho người ăn chay',
    qualitySpecification: 'Kích thước đồng đều, không bị dập nát, thịt săn chắc',
    preparationNote: 'Ngâm nước lạnh rã đông từ từ, rút chỉ đen lưng sạch sẽ',
    kitchenNote: 'Luộc nhanh trong nước muối sả 3 phút trước khi thả vào súp',
    status: 'active',
    ownerName: 'Chef de Cuisine Antoine',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'ing-master-002',
    ingredientCode: 'ING-CA-HOI',
    ingredientNameVi: 'Cá hồi phi lê',
    ingredientNameEn: 'Salmon Fillet',
    ingredientNameFr: 'Filet de Saumon',
    category: 'fish',
    subcategory: 'Cá biển',
    defaultUnit: 'kg',
    purchaseUnitNote: 'Nhập nguyên con fillet sẵn từ nhà cung cấp Na Uy',
    recipeUnitNote: 'Cắt lát tiêu chuẩn 150g cho món chính hoặc 40g cho món súp',
    storageType: 'chilled',
    shelfLifeNote: 'Bảo quản tủ mát 0-2 độ C trong vòng 48 giờ',
    allergyNote: 'Cá biển',
    dietaryNote: 'Thực phẩm chứa dầu béo omega-3 dồi dào',
    qualitySpecification: 'Màu cam hồng sáng tươi, vân mỡ trắng đều đặn, không có mùi lạ',
    preparationNote: 'Dùng nhíp rút sạch xương dăm, lọc bỏ da nếu làm món súp',
    kitchenNote: 'Áp chảo chín tới 70% để giữ độ ẩm mọng của cá hồi Na Uy',
    status: 'active',
    ownerName: 'Bếp trưởng Antoine',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'ing-master-003',
    ingredientCode: 'ING-CA-CHEM',
    ingredientNameVi: 'Cá chẽm phi lê',
    ingredientNameEn: 'Barramundi Fillet',
    ingredientNameFr: 'Filet de Barramundi',
    category: 'fish',
    subcategory: 'Cá biển',
    defaultUnit: 'kg',
    purchaseUnitNote: 'Thùng xốp đá 10kg giao mỗi sáng',
    recipeUnitNote: 'Cắt lát định lượng gram theo công thức súp Marseille',
    storageType: 'chilled',
    shelfLifeNote: 'Tủ mát 2-4 độ C sử dụng trong ngày',
    allergyNote: 'Cá biển',
    status: 'active',
    ownerName: 'Sous Chef Minh',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'ing-master-004',
    ingredientCode: 'ING-NGHEU',
    ingredientNameVi: 'Nghêu tươi',
    ingredientNameEn: 'Clams',
    ingredientNameFr: 'Palourdes',
    category: 'shellfish',
    subcategory: 'Nghêu sò ốc hến',
    defaultUnit: 'kg',
    purchaseUnitNote: 'Túi lưới thông hơi 2kg giao sống',
    recipeUnitNote: 'Luộc lấy nước dùng cốt nghêu và thịt nghêu nguyên con sạch cát',
    storageType: 'chilled',
    shelfLifeNote: 'Giữ sống trong bể sục oxy hoặc tủ mát ẩm tối đa 24 giờ',
    allergyNote: 'Động vật thân mềm hai mảnh vỏ',
    status: 'active',
    ownerName: 'Sous Chef Minh',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'ing-master-005',
    ingredientCode: 'ING-CA-CHUA',
    ingredientNameVi: 'Cà chua chín',
    ingredientNameEn: 'Ripe Tomatoes',
    ingredientNameFr: 'Tomates Mûres',
    category: 'vegetable',
    subcategory: 'Rau ăn quả',
    defaultUnit: 'kg',
    purchaseUnitNote: 'Khay nhựa 10kg từ Đà Lạt',
    recipeUnitNote: 'Cắt hạt lựu băm nhuyễn xào làm nước cốt sốt súp',
    storageType: 'chilled',
    shelfLifeNote: 'Nhiệt độ phòng mát 18 độ C tối đa 5 ngày',
    status: 'active',
    ownerName: 'Bếp viên Nam',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'ing-master-006',
    ingredientCode: 'ING-SAFFRON',
    ingredientNameVi: 'Nhụy hoa nghệ tây (Saffron)',
    ingredientNameEn: 'Saffron Threads',
    ingredientNameFr: 'Safran',
    category: 'spice',
    subcategory: 'Gia vị cao cấp',
    defaultUnit: 'g',
    purchaseUnitNote: 'Hũ thủy tinh nhỏ 5g nhập khẩu Iran',
    recipeUnitNote: 'Đong đếm bằng cân điện tử tiểu ly chính xác dạng gram',
    storageType: 'ambient',
    shelfLifeNote: 'Hộp kín tối, khô thoáng, tránh ánh sáng chiếu trực tiếp',
    qualitySpecification: 'Sợi nhụy đỏ thẫm đều, không pha lẫn tạp chất râu hoa vàng',
    status: 'active',
    ownerName: 'Chef de Cuisine Antoine',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  }
]

function IngredientsPageContent() {
  const [ingredients, setIngredients] = useState<IngredientMasterItem[]>([])
  const [selectedIngredient, setSelectedIngredient] = useState<IngredientMasterItem | null>(null)
  const [suppliers, setSuppliers] = useState<{ id: string; supplierName: string }[]>([])
  const [capabilities, setCapabilities] = useState<{ id: string; supplierId: string; ingredientMasterId?: string | null; capabilityNote?: string | null }[]>([])
  const [purchaseRequestLines, setPurchaseRequestLines] = useState<{ id: string; purchaseRequestId: string; ingredientMasterId?: string | null; requestedQuantity?: number | null; requestedUnit?: string | null; status: string }[]>([])
  const [purchaseRequests, setPurchaseRequests] = useState<{ id: string; requestCode?: string | null; requestDate: string; requestedBy: string }[]>([])

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [form, setForm] = useState({
    ingredientCode: '',
    ingredientNameVi: '',
    ingredientNameEn: '',
    ingredientNameFr: '',
    category: 'protein' as IngredientCategory,
    subcategory: '',
    defaultUnit: 'g' as IngredientDefaultUnit,
    purchaseUnitNote: '',
    recipeUnitNote: '',
    storageType: 'ambient' as IngredientStorageType,
    shelfLifeNote: '',
    allergyNote: '',
    dietaryNote: '',
    qualitySpecification: '',
    preparationNote: '',
    kitchenNote: '',
    status: 'draft' as IngredientStatus,
    ownerName: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const stored = localStorage.getItem('mvos_ingredients')
        if (stored) {
          const parsed = JSON.parse(stored)
          setIngredients(parsed)
          if (parsed.length > 0) setSelectedIngredient(parsed[0])
        } else {
          localStorage.setItem('mvos_ingredients', JSON.stringify(INITIAL_INGREDIENTS))
          setIngredients(INITIAL_INGREDIENTS)
          if (INITIAL_INGREDIENTS.length > 0) setSelectedIngredient(INITIAL_INGREDIENTS[0])
        }

        const storedSups = localStorage.getItem('mvos_suppliers')
        if (storedSups) {
          setSuppliers(JSON.parse(storedSups))
        }

        const storedCaps = localStorage.getItem('mvos_supplier_capabilities')
        if (storedCaps) {
          setCapabilities(JSON.parse(storedCaps))
        }

        const storedReqs = localStorage.getItem('mvos_purchase_requests')
        if (storedReqs) {
          setPurchaseRequests(JSON.parse(storedReqs))
        }

        const storedReqLines = localStorage.getItem('mvos_purchase_request_lines')
        if (storedReqLines) {
          setPurchaseRequestLines(JSON.parse(storedReqLines))
        }

        setLoading(false)
      } catch {
        setError('Không thể tải danh mục nguyên liệu.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateIngredient = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!form.ingredientNameVi.trim()) {
      errs.ingredientNameVi = 'Vui lòng nhập ít nhất tên nguyên liệu tiếng Việt'
    }
    if (!form.category) {
      errs.category = 'Vui lòng chọn nhóm nguyên liệu chính'
    }
    if (!form.defaultUnit) {
      errs.defaultUnit = 'Vui lòng chọn đơn vị chuẩn'
    }
    if (!form.status) {
      errs.status = 'Vui lòng chọn trạng thái sử dụng'
    }

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newItem: IngredientMasterItem = {
      id: `ing-master-${Date.now().toString().slice(-4)}`,
      ingredientCode: form.ingredientCode || null,
      ingredientNameVi: form.ingredientNameVi,
      ingredientNameEn: form.ingredientNameEn || null,
      ingredientNameFr: form.ingredientNameFr || null,
      category: form.category,
      subcategory: form.subcategory || null,
      defaultUnit: form.defaultUnit,
      purchaseUnitNote: form.purchaseUnitNote || null,
      recipeUnitNote: form.recipeUnitNote || null,
      storageType: form.storageType || null,
      shelfLifeNote: form.shelfLifeNote || null,
      allergyNote: form.allergyNote || null,
      dietaryNote: form.dietaryNote || null,
      qualitySpecification: form.qualitySpecification || null,
      preparationNote: form.preparationNote || null,
      kitchenNote: form.kitchenNote || null,
      status: form.status,
      ownerName: form.ownerName || 'Chưa phân công',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...ingredients, newItem]
    localStorage.setItem('mvos_ingredients', JSON.stringify(updated))
    setIngredients(updated)
    setSelectedIngredient(newItem)

    // Reset Form
    setForm({
      ingredientCode: '',
      ingredientNameVi: '',
      ingredientNameEn: '',
      ingredientNameFr: '',
      category: 'protein',
      subcategory: '',
      defaultUnit: 'g',
      purchaseUnitNote: '',
      recipeUnitNote: '',
      storageType: 'ambient',
      shelfLifeNote: '',
      allergyNote: '',
      dietaryNote: '',
      qualitySpecification: '',
      preparationNote: '',
      kitchenNote: '',
      status: 'draft',
      ownerName: ''
    })
  }

  const handleUpdateStatus = (itemId: string, nextStatus: IngredientStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = ingredients.map((i) => {
      if (i.id === itemId) {
        const updatedItem = { ...i, status: nextStatus, updatedAt: nowStr }
        if (selectedIngredient?.id === itemId) setSelectedIngredient(updatedItem)
        return updatedItem
      }
      return i
    })
    localStorage.setItem('mvos_ingredients', JSON.stringify(updated))
    setIngredients(updated)
  }

  const getCategoryLabel = (cat: IngredientCategory) => {
    switch (cat) {
      case 'protein': return 'Đạm/thịt'
      case 'beef': return 'Thịt bò'
      case 'poultry': return 'Gia cầm'
      case 'pork': return 'Thịt heo'
      case 'lamb': return 'Thịt cừu'
      case 'seafood': return 'Hải sản'
      case 'fish': return 'Thịt cá'
      case 'shellfish': return 'Giáp xác/nghêu sò'
      case 'vegetable': return 'Rau củ'
      case 'fruit': return 'Trái cây'
      case 'dairy': return 'Sữa tươi'
      case 'cheese': return 'Phô mai'
      case 'butter': return 'Bơ'
      case 'egg': return 'Trứng'
      case 'dry_goods': return 'Hàng khô'
      case 'flour': return 'Bột'
      case 'rice_grain': return 'Gạo/ngũ cốc'
      case 'pasta': return 'Mì/pasta'
      case 'spice': return 'Gia vị'
      case 'herb': return 'Thảo mộc'
      case 'oil_fat': return 'Dầu/mỡ'
      case 'sauce': return 'Nước sốt'
      case 'stock': return 'Nước dùng'
      case 'garnish': return 'Garnish'
      case 'pastry': return 'Bánh ngọt'
      case 'chocolate': return 'Chocolate'
      case 'beverage': return 'Đồ uống'
      case 'wine': return 'Rượu vang'
      case 'non_food': return 'Phi thực phẩm'
      default: return 'Khác'
    }
  }

  const getStorageLabel = (st: IngredientStorageType) => {
    switch (st) {
      case 'dry': return 'Khô ráo'
      case 'chilled': return 'Tủ mát (2-4°C)'
      case 'frozen': return 'Tủ đông (-18°C)'
      case 'ambient': return 'Nhiệt độ phòng'
      case 'wine_cellar': return 'Hầm rượu'
      case 'chemical_safe': return 'Khu hóa chất'
      default: return 'Khác'
    }
  }

  const getStatusLabel = (s: IngredientStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'active': return 'Đang sử dụng'
      case 'paused': return 'Tạm dừng'
      case 'archived': return 'Lưu trữ'
      default: return s
    }
  }

  const getStatusClass = (s: IngredientStatus) => {
    switch (s) {
      case 'active': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'paused': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'archived': return 'bg-red-500/10 border border-red-500/25 text-red-500'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải danh mục nguyên liệu…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải danh mục nguyên liệu.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Real data metrics
  const totalCount = ingredients.length
  const activeCount = ingredients.filter(i => i.status === 'active').length
  const draftCount = ingredients.filter(i => i.status === 'draft').length
  const pausedCount = ingredients.filter(i => i.status === 'paused').length
  const allergyCount = ingredients.filter(i => i.allergyNote && i.allergyNote.trim() !== '').length

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🥕 Danh mục nguyên liệu (Ingredient Master)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Chuẩn hóa nguyên liệu, đơn vị, bảo quản, dị ứng và ghi chú bếp để làm nền tảng cho recipe, inventory và food cost sau này.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng nguyên liệu</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang sử dụng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{activeCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Bản nháp</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{draftCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tạm dừng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-orange-400 mt-1 block">{pausedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Ghi chú dị ứng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-400 mt-1 block">{allergyCount}</span>
        </div>
      </div>

      {/* Workspace Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Ingredients List & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Mã</th>
                    <th className="py-3 px-4">Tên tiếng Việt</th>
                    <th className="py-3 px-4">Tên tiếng Anh</th>
                    <th className="py-3 px-4">Nhóm chính</th>
                    <th className="py-3 px-4 text-center">Đơn vị chuẩn</th>
                    <th className="py-3 px-4">Kiểu bảo quản</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4">Người quản lý</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {ingredients.length > 0 ? (
                    ingredients.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedIngredient(item)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedIngredient?.id === item.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{item.ingredientCode || '-'}</td>
                        <td className="py-3.5 px-4 font-bold text-foreground">{item.ingredientNameVi}</td>
                        <td className="py-3.5 px-4 text-foreground/75 italic">{item.ingredientNameEn || '-'}</td>
                        <td className="py-3.5 px-4 text-gold-hover font-semibold">{getCategoryLabel(item.category)}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold text-gold">{item.defaultUnit}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">{getStorageLabel(item.storageType || 'ambient')}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(item.status)}`}>
                            {getStatusLabel(item.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">{item.ownerName || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có nguyên liệu nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Ingredient */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo nguyên liệu chuẩn mới
            </h3>

            <form onSubmit={handleCreateIngredient} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên tiếng Việt *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Tôm hùm nước ngọt..."
                    value={form.ingredientNameVi}
                    onChange={(e) => setForm({ ...form, ingredientNameVi: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.ingredientNameVi && <span className="text-[10px] text-red-400 italic">{validationErrors.ingredientNameVi}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên tiếng Anh</label>
                  <input
                    type="text"
                    placeholder="Crayfish..."
                    value={form.ingredientNameEn}
                    onChange={(e) => setForm({ ...form, ingredientNameEn: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên tiếng Pháp</label>
                  <input
                    type="text"
                    placeholder="Écrevisse..."
                    value={form.ingredientNameFr}
                    onChange={(e) => setForm({ ...form, ingredientNameFr: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã nguyên liệu</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: ING-TOM-HUM..."
                    value={form.ingredientCode}
                    onChange={(e) => setForm({ ...form, ingredientCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Nhóm nguyên liệu chính *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as IngredientCategory })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="protein">Đạm/thịt (Protein)</option>
                    <option value="beef">Thịt bò (Beef)</option>
                    <option value="poultry">Gia cầm (Poultry)</option>
                    <option value="pork">Thịt heo (Pork)</option>
                    <option value="lamb">Thịt cừu (Lamb)</option>
                    <option value="seafood">Hải sản (Seafood)</option>
                    <option value="fish">Thịt cá (Fish)</option>
                    <option value="shellfish">Giáp xác / nghêu sò</option>
                    <option value="vegetable">Rau củ (Vegetable)</option>
                    <option value="fruit">Trái cây (Fruit)</option>
                    <option value="dairy">Sữa (Dairy)</option>
                    <option value="cheese">Phô mai (Cheese)</option>
                    <option value="butter">Bơ (Butter)</option>
                    <option value="egg">Trứng (Egg)</option>
                    <option value="dry_goods">Hàng khô (Dry goods)</option>
                    <option value="flour">Bột (Flour)</option>
                    <option value="rice_grain">Gạo/Ngũ cốc</option>
                    <option value="pasta">Mì/Pasta</option>
                    <option value="spice">Gia vị (Spice)</option>
                    <option value="herb">Thảo mộc (Herb)</option>
                    <option value="oil_fat">Dầu/Mỡ (Oil/Fat)</option>
                    <option value="sauce">Nước sốt (Sauce)</option>
                    <option value="stock">Nước dùng (Stock)</option>
                    <option value="garnish">Trang trí (Garnish)</option>
                    <option value="pastry">Bánh ngọt (Pastry)</option>
                    <option value="chocolate">Chocolate</option>
                    <option value="beverage">Đồ uống (Beverage)</option>
                    <option value="wine">Rượu vang (Wine)</option>
                    <option value="non_food">Phi thực phẩm</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Nhóm phụ (Phân nhóm)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Hải sản tươi sống..."
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Đơn vị lưu trữ chuẩn *</label>
                  <select
                    value={form.defaultUnit}
                    onChange={(e) => setForm({ ...form, defaultUnit: e.target.value as IngredientDefaultUnit })}
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
                    <option value="box">hộp</option>
                    <option value="tray">khay</option>
                    <option value="bag">túi</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Đơn vị mua hàng (Lưu ý)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Thùng 10kg, hũ 5g..."
                    value={form.purchaseUnitNote}
                    onChange={(e) => setForm({ ...form, purchaseUnitNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Đơn vị công thức (Lưu ý)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Rã đông bóc vỏ, đong gram..."
                    value={form.recipeUnitNote}
                    onChange={(e) => setForm({ ...form, recipeUnitNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Kiểu bảo quản bảo quản</label>
                  <select
                    value={form.storageType}
                    onChange={(e) => setForm({ ...form, storageType: e.target.value as IngredientStorageType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="dry">Khô ráo</option>
                    <option value="chilled">Tủ mát (2-4°C)</option>
                    <option value="frozen">Tủ đông (-18°C)</option>
                    <option value="ambient">Nhiệt độ phòng mát</option>
                    <option value="wine_cellar">Hầm rượu vang</option>
                    <option value="chemical_safe">Khu vực hóa chất an toàn</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Hạn bảo quản / Shelf-life</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Tủ mát bảo quản tối đa 48h..."
                    value={form.shelfLifeNote}
                    onChange={(e) => setForm({ ...form, shelfLifeNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono font-bold text-red-400">Cảnh báo Dị ứng</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Giáp xác, cá biển, hạt..."
                    value={form.allergyNote}
                    onChange={(e) => setForm({ ...form, allergyNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú ăn kiêng</label>
                  <input
                    type="text"
                    placeholder="Ăn chay, không chứa tinh bột..."
                    value={form.dietaryNote}
                    onChange={(e) => setForm({ ...form, dietaryNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Tiêu chuẩn chất lượng (Specs)</label>
                  <input
                    type="text"
                    placeholder="Fillet đều, không mỡ thừa, tươi sống..."
                    value={form.qualitySpecification}
                    onChange={(e) => setForm({ ...form, qualitySpecification: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Nhân sự chịu trách nhiệm *</label>
                  <input
                    type="text"
                    placeholder="Tên Chef phụ trách kiểm soát chất lượng..."
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Hướng dẫn sơ chế tại bếp (Prep-note)</label>
                  <textarea
                    rows={2}
                    placeholder="Rửa qua nước muối nhạt, thái nhỏ 3x3 cm..."
                    value={form.preparationNote}
                    onChange={(e) => setForm({ ...form, preparationNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú bếp / Lưu ý chế biến (BOH)</label>
                  <textarea
                    rows={2}
                    placeholder="Không áp chảo cháy cạnh quá lửa..."
                    value={form.kitchenNote}
                    onChange={(e) => setForm({ ...form, kitchenNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái sử dụng *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as IngredientStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  >
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="active">Đang sử dụng (Active)</option>
                    <option value="paused">Tạm ngưng nhập (Paused)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Thêm nguyên liệu
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed Specification View */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Thông tin chi tiết nguyên liệu
            </h3>

            {selectedIngredient ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedIngredient.ingredientNameVi}
                  </h4>
                  {selectedIngredient.ingredientNameFr && (
                    <span className="block text-foreground/75 italic mt-0.5 font-sans">
                      Tiếng Pháp: {selectedIngredient.ingredientNameFr}
                    </span>
                  )}
                  {selectedIngredient.ingredientNameEn && (
                    <span className="block text-foreground/65 text-[10px] font-sans">
                      Tiếng Anh: {selectedIngredient.ingredientNameEn}
                    </span>
                  )}
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mã nguyên liệu</span>
                    <span className="font-bold text-foreground/80 block font-mono">{selectedIngredient.ingredientCode || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Nhóm nguyên liệu</span>
                    <span className="font-bold text-gold block">{getCategoryLabel(selectedIngredient.category)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Phân nhóm phụ</span>
                    <span className="font-bold text-foreground/80 block">{selectedIngredient.subcategory || 'Chưa phân nhóm'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Đơn vị định lượng chuẩn</span>
                    <span className="font-bold text-gold block font-mono">{selectedIngredient.defaultUnit}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Kiểu bảo quản</span>
                    <span className="font-bold text-foreground/80 block">{getStorageLabel(selectedIngredient.storageType || 'ambient')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người quản lý chất lượng</span>
                    <span className="font-bold text-foreground/80 block">{selectedIngredient.ownerName || '-'}</span>
                  </div>
                </div>

                {selectedIngredient.purchaseUnitNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Lưu ý đơn vị mua hàng</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedIngredient.purchaseUnitNote}</p>
                  </div>
                )}

                {selectedIngredient.recipeUnitNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Lưu ý đơn vị công thức nấu</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedIngredient.recipeUnitNote}</p>
                  </div>
                )}

                {selectedIngredient.shelfLifeNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Hạn bảo quản & Hết hạn (Shelf life)</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedIngredient.shelfLifeNote}</p>
                  </div>
                )}

                {selectedIngredient.qualitySpecification && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Tiêu chuẩn quy cách chất lượng (Specs)</span>
                    <p className="text-foreground/80 leading-relaxed font-sans bg-background/30 p-2.5 rounded border border-gold-border/10">{selectedIngredient.qualitySpecification}</p>
                  </div>
                )}

                {selectedIngredient.preparationNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Quy trình hướng dẫn sơ chế</span>
                    <p className="text-foreground/80 leading-relaxed font-sans whitespace-pre-line">{selectedIngredient.preparationNote}</p>
                  </div>
                )}

                {selectedIngredient.kitchenNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Lưu ý sử dụng & Chỉ thị chế biến (BOH)</span>
                    <p className="text-foreground/80 italic font-sans">{selectedIngredient.kitchenNote}</p>
                  </div>
                )}

                <div className="bg-background/40 p-2.5 rounded border border-gold-border/10 leading-relaxed space-y-1">
                  {selectedIngredient.allergyNote && <div><span className="font-semibold text-red-400 font-bold">Dị ứng cần lưu ý:</span> {selectedIngredient.allergyNote}</div>}
                  {selectedIngredient.dietaryNote && <div><span className="font-semibold text-foreground/80">Chế độ ăn kiêng:</span> {selectedIngredient.dietaryNote}</div>}
                </div>

                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Nhà cung cấp có thể cung ứng</span>
                  {capabilities.filter(c => c.ingredientMasterId === selectedIngredient.id).length > 0 ? (
                    <div className="space-y-1 bg-background/30 p-2.5 rounded border border-gold-border/10">
                      {capabilities.filter(c => c.ingredientMasterId === selectedIngredient.id).map((cap) => {
                        const s = suppliers.find(sup => sup.id === cap.supplierId)
                        return (
                          <div key={cap.id} className="flex justify-between items-center text-[10px] py-0.5 border-b border-gold-border/5 last:border-0">
                            <span className="font-bold text-gold">{s ? s.supplierName : 'Nhà cung ứng'}</span>
                            {cap.capabilityNote && <span className="text-foreground/50 text-[9px] italic">({cap.capabilityNote})</span>}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[9px] text-foreground/45 italic">Chưa có nhà cung cấp nào liên kết với nguyên liệu này.</p>
                  )}
                </div>

                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Dòng yêu cầu mua liên quan</span>
                  {purchaseRequestLines.filter(l => l.ingredientMasterId === selectedIngredient.id).length > 0 ? (
                    <div className="space-y-1 bg-background/30 p-2.5 rounded border border-gold-border/10">
                      {purchaseRequestLines.filter(l => l.ingredientMasterId === selectedIngredient.id).map((line) => {
                        const pr = purchaseRequests.find(r => r.id === line.purchaseRequestId)
                        return (
                          <div key={line.id} className="flex justify-between items-center text-[10px] py-0.5 border-b border-gold-border/5 last:border-0">
                            <div>
                              <span className="font-bold text-gold">{pr ? pr.requestCode || pr.id : 'PR Line'}</span>
                              <span className="text-[8px] text-foreground/50 block font-mono">Số lượng: {line.requestedQuantity} {line.requestedUnit}</span>
                            </div>
                            <span className="text-[8px] font-semibold text-foreground/60">{line.status}</span>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="text-[9px] text-foreground/45 italic">Chưa có yêu cầu mua nào liên quan đến nguyên liệu này.</p>
                  )}
                </div>

                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Dòng công thức liên quan</span>
                  <Link
                    href={`/studio/normalization?ingredient_master_id=${selectedIngredient.id}`}
                    className="w-full rounded border border-gold hover:border-gold-hover px-2 py-2 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block text-center"
                  >
                    ⚖️ Xem dòng công thức liên kết
                  </Link>
                </div>

                <div className="text-[9px] text-foreground/40 font-mono border-t border-gold-border/10 pt-3 flex justify-between">
                  <span>Ngày tạo: {selectedIngredient.createdAt}</span>
                  <span>Cập nhật: {selectedIngredient.updatedAt}</span>
                </div>

                {/* State Actions for Ingredient */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái nguyên liệu</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedIngredient.id, 'active')}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Áp dụng sử dụng
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedIngredient.id, 'paused')}
                      className="rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-center text-[10px] text-yellow-500 hover:bg-yellow-500/10 transition-all font-semibold"
                    >
                      Tạm ngưng nhập
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedIngredient.id, 'archived')}
                      className="col-span-2 rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Lưu trữ nguyên liệu
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một nguyên liệu từ danh sách để xem thông tin chi tiết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function IngredientsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải danh mục nguyên liệu…</p>
      </div>
    }>
      <IngredientsPageContent />
    </Suspense>
  )
}
