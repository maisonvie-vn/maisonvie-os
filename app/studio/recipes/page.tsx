'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export type RecipeType =
  | "standard"
  | "prep"
  | "sauce"
  | "stock"
  | "garnish"
  | "pastry"
  | "beverage"
  | "staff_meal"
  | "other"

export type RecipeStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived"

export type RecipeDifficultyLevel =
  | "low"
  | "medium"
  | "high"
  | "chef_only"

export type RecipeIngredientCategory =
  | "protein"
  | "seafood"
  | "vegetable"
  | "fruit"
  | "dairy"
  | "dry_goods"
  | "spice"
  | "herb"
  | "sauce"
  | "stock"
  | "garnish"
  | "pastry"
  | "beverage"
  | "other"

export interface Recipe {
  id: string
  menuItemId?: string | null
  recipeCode?: string | null
  recipeName: string
  recipeType: RecipeType
  status: RecipeStatus
  version: number
  yieldQuantity?: number | null
  yieldUnit?: string | null
  portionQuantity?: number | null
  portionUnit?: string | null
  prepTimeMinutes?: number | null
  cookTimeMinutes?: number | null
  difficultyLevel?: RecipeDifficultyLevel | null
  method?: string | null
  platingNote?: string | null
  prepNote?: string | null
  serviceNote?: string | null
  kitchenNote?: string | null
  allergyNote?: string | null
  dietaryNote?: string | null
  storageNote?: string | null
  ownerName?: string | null
  effectiveFrom?: string | null
  effectiveTo?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

export interface RecipeIngredientLine {
  id: string
  recipeId: string
  lineOrder: number
  ingredientName: string
  ingredientCategory?: RecipeIngredientCategory | null
  quantity?: number | null
  unit?: string | null
  preparationNote?: string | null
  wasteNote?: string | null
  optional: boolean
  createdBy?: string | null
  createdAt: string
  updatedAt: string
  ingredientMasterId?: string | null
}

interface MenuItem {
  id: string
  itemNameVi: string
  itemCode?: string | null
}

const INITIAL_RECIPES: Recipe[] = [
  {
    id: 'rec-401',
    menuItemId: 'item-101',
    recipeCode: 'REC-SOUP-MARS',
    recipeName: 'Công thức súp hải sản Marseille',
    recipeType: 'standard',
    status: 'active',
    version: 1,
    yieldQuantity: 10,
    yieldUnit: 'portions',
    portionQuantity: 1,
    portionUnit: 'bát (300ml)',
    prepTimeMinutes: 20,
    cookTimeMinutes: 40,
    difficultyLevel: 'high',
    method: '1. Đun nóng dầu ô liu trong nồi lớn, phi thơm hành tây, tỏi và tỏi tây băm nhỏ.\n2. Thêm cà chua xắt nhỏ, nghệ tây, vỏ cam và các loại thảo mộc vào xào mềm.\n3. Rót nước dùng cá vào đun sôi nhẹ trong 15 phút.\n4. Thêm các loại cá và hải sản vỏ cứng vào đun tiếp trong 10 phút đến khi hải sản mở vỏ và chín mềm.\n5. Nêm nếm muối, tiêu hạt và lá thyme tươi vừa ăn.\n6. Múc súp ra bát sâu lòng, rắc ngò tây cắt nhỏ và dùng nóng kèm sốt rouille.',
    platingNote: 'Trình bày trong bát sứ trắng cổ điển, phục vụ kèm đĩa bánh mì nướng tỏi.',
    prepNote: 'Hải sản phải được làm sạch kỹ, nghêu tôm rửa sạch loại bỏ cát.',
    kitchenNote: 'Không để súp sôi sùng sục làm nát thịt cá hồi/cá chẽm.',
    serviceNote: 'Bát súp phải bốc hơi nóng, phục vụ thìa súp lớn.',
    allergyNote: 'Hải sản vỏ cứng (tôm, cua, nghêu).',
    dietaryNote: 'Không chứa thịt heo.',
    storageNote: 'Bảo quản nước dùng cốt trong tủ mát 2-4 độ C không quá 24h.',
    ownerName: 'Chef de Cuisine Antoine',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
    createdAt: '2026-01-01 10:00',
    updatedAt: '2026-06-28 10:00'
  }
]

const INITIAL_INGREDIENTS: RecipeIngredientLine[] = [
  { id: 'ing-1', recipeId: 'rec-401', lineOrder: 1, ingredientName: 'Tôm hùm nước ngọt', ingredientCategory: 'seafood', quantity: 500, unit: 'g', optional: false, createdAt: '2026-01-01 10:00', updatedAt: '2026-06-28 10:00' },
  { id: 'ing-2', recipeId: 'rec-401', lineOrder: 2, ingredientName: 'Cá hồi phi lê', ingredientCategory: 'seafood', quantity: 400, unit: 'g', optional: false, createdAt: '2026-01-01 10:00', updatedAt: '2026-06-28 10:00' },
  { id: 'ing-3', recipeId: 'rec-401', lineOrder: 3, ingredientName: 'Cá chẽm phi lê', ingredientCategory: 'seafood', quantity: 400, unit: 'g', optional: false, createdAt: '2026-01-01 10:00', updatedAt: '2026-06-28 10:00' },
  { id: 'ing-4', recipeId: 'rec-401', lineOrder: 4, ingredientName: 'Nghêu tươi', ingredientCategory: 'seafood', quantity: 500, unit: 'g', optional: false, createdAt: '2026-01-01 10:00', updatedAt: '2026-06-28 10:00' },
  { id: 'ing-5', recipeId: 'rec-401', lineOrder: 5, ingredientName: 'Cà chua chín', ingredientCategory: 'vegetable', quantity: 300, unit: 'g', optional: false, createdAt: '2026-01-01 10:00', updatedAt: '2026-06-28 10:00' },
  { id: 'ing-6', recipeId: 'rec-401', lineOrder: 6, ingredientName: 'Nhụy hoa nghệ tây (Saffron)', ingredientCategory: 'spice', quantity: 1, unit: 'g', optional: false, createdAt: '2026-01-01 10:00', updatedAt: '2026-06-28 10:00' },
  { id: 'ing-7', recipeId: 'rec-401', lineOrder: 7, ingredientName: 'Dầu ô liu nguyên chất', ingredientCategory: 'spice', quantity: 50, unit: 'ml', optional: false, createdAt: '2026-01-01 10:00', updatedAt: '2026-06-28 10:00' }
]

function RecipesPageContent() {
  const searchParams = useSearchParams()
  const queryMenuItemId = searchParams.get('menu_item_id')

  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [ingredients, setIngredients] = useState<RecipeIngredientLine[]>([])
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [masterIngredients, setMasterIngredients] = useState<{ id: string; ingredientNameVi: string; defaultUnit: string; category: string }[]>([])

  // Form State: Recipe
  const [recipeForm, setRecipeForm] = useState({
    menuItemId: '',
    recipeCode: '',
    recipeName: '',
    recipeType: 'standard' as RecipeType,
    status: 'draft' as RecipeStatus,
    version: '1',
    yieldQuantity: '',
    yieldUnit: 'portions',
    portionQuantity: '1',
    portionUnit: 'bát',
    prepTimeMinutes: '',
    cookTimeMinutes: '',
    difficultyLevel: 'medium' as RecipeDifficultyLevel,
    method: '',
    platingNote: '',
    prepNote: '',
    serviceNote: '',
    kitchenNote: '',
    allergyNote: '',
    dietaryNote: '',
    storageNote: '',
    ownerName: '',
    effectiveFrom: '',
    effectiveTo: ''
  })

  // Form State: Ingredient Line
  const [ingForm, setIngForm] = useState({
    lineOrder: '0',
    ingredientName: '',
    ingredientCategory: 'protein' as RecipeIngredientCategory,
    quantity: '',
    unit: 'g',
    preparationNote: '',
    wasteNote: '',
    optional: false,
    ingredientMasterId: ''
  })

  const [recipeErrors, setRecipeErrors] = useState<Record<string, string>>({})
  const [ingErrors, setIngErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedRecipes = localStorage.getItem('mvos_recipes')
        const storedIngredients = localStorage.getItem('mvos_recipe_ingredient_lines')
        const storedMenuItems = localStorage.getItem('mvos_menu_items')

        let loadedRecipes: Recipe[] = []
        let loadedIngredients: RecipeIngredientLine[] = []
        let loadedItems: MenuItem[] = []

        if (storedRecipes) {
          loadedRecipes = JSON.parse(storedRecipes)
        } else {
          localStorage.setItem('mvos_recipes', JSON.stringify(INITIAL_RECIPES))
          loadedRecipes = INITIAL_RECIPES
        }
        setRecipes(loadedRecipes)

        if (storedIngredients) {
          loadedIngredients = JSON.parse(storedIngredients)
        } else {
          localStorage.setItem('mvos_recipe_ingredient_lines', JSON.stringify(INITIAL_INGREDIENTS))
          loadedIngredients = INITIAL_INGREDIENTS
        }
        setIngredients(loadedIngredients)

        if (storedMenuItems) {
          loadedItems = JSON.parse(storedMenuItems)
          setMenuItems(loadedItems)
        }

        const storedMaster = localStorage.getItem('mvos_ingredients')
        if (storedMaster) {
          setMasterIngredients(JSON.parse(storedMaster))
        }

        // Deep linking or query param matching
        if (queryMenuItemId) {
          const matched = loadedRecipes.find(r => r.menuItemId === queryMenuItemId)
          if (matched) {
            setSelectedRecipe(matched)
          } else {
            const matchedItem = loadedItems.find(item => item.id === queryMenuItemId)
            if (matchedItem) {
              setRecipeForm((prev) => ({
                ...prev,
                menuItemId: matchedItem.id,
                recipeName: `Công thức cho: ${matchedItem.itemNameVi}`
              }))
            }
          }
        } else if (loadedRecipes.length > 0) {
          setSelectedRecipe(loadedRecipes[0])
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu công thức món ăn.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [queryMenuItemId])

  const handleCreateRecipe = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!recipeForm.recipeName.trim()) errs.recipeName = 'Vui lòng nhập tên công thức'
    if (!recipeForm.recipeType) errs.recipeType = 'Vui lòng chọn loại công thức'
    if (!recipeForm.status) errs.status = 'Vui lòng chọn trạng thái'

    if (Object.keys(errs).length > 0) {
      setRecipeErrors(errs)
      return
    }

    setRecipeErrors({})

    const newRecipe: Recipe = {
      id: `rec-${Date.now().toString().slice(-4)}`,
      menuItemId: recipeForm.menuItemId || null,
      recipeCode: recipeForm.recipeCode || null,
      recipeName: recipeForm.recipeName,
      recipeType: recipeForm.recipeType,
      status: recipeForm.status,
      version: recipeForm.version ? parseInt(recipeForm.version) : 1,
      yieldQuantity: recipeForm.yieldQuantity ? parseFloat(recipeForm.yieldQuantity) : null,
      yieldUnit: recipeForm.yieldUnit || null,
      portionQuantity: recipeForm.portionQuantity ? parseFloat(recipeForm.portionQuantity) : null,
      portionUnit: recipeForm.portionUnit || null,
      prepTimeMinutes: recipeForm.prepTimeMinutes ? parseInt(recipeForm.prepTimeMinutes) : null,
      cookTimeMinutes: recipeForm.cookTimeMinutes ? parseInt(recipeForm.cookTimeMinutes) : null,
      difficultyLevel: recipeForm.difficultyLevel || null,
      method: recipeForm.method || null,
      platingNote: recipeForm.platingNote || null,
      prepNote: recipeForm.prepNote || null,
      serviceNote: recipeForm.serviceNote || null,
      kitchenNote: recipeForm.kitchenNote || null,
      allergyNote: recipeForm.allergyNote || null,
      dietaryNote: recipeForm.dietaryNote || null,
      storageNote: recipeForm.storageNote || null,
      ownerName: recipeForm.ownerName || 'Chưa phân công',
      effectiveFrom: recipeForm.effectiveFrom || null,
      effectiveTo: recipeForm.effectiveTo || null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...recipes, newRecipe]
    localStorage.setItem('mvos_recipes', JSON.stringify(updated))
    setRecipes(updated)
    setSelectedRecipe(newRecipe)

    setRecipeForm({
      menuItemId: '',
      recipeCode: '',
      recipeName: '',
      recipeType: 'standard',
      status: 'draft',
      version: '1',
      yieldQuantity: '',
      yieldUnit: 'portions',
      portionQuantity: '1',
      portionUnit: 'bát',
      prepTimeMinutes: '',
      cookTimeMinutes: '',
      difficultyLevel: 'medium',
      method: '',
      platingNote: '',
      prepNote: '',
      serviceNote: '',
      kitchenNote: '',
      allergyNote: '',
      dietaryNote: '',
      storageNote: '',
      ownerName: '',
      effectiveFrom: '',
      effectiveTo: ''
    })
  }

  const handleCreateIngredientLine = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRecipe) return

    const errs: Record<string, string> = {}
    if (!ingForm.ingredientName.trim()) errs.ingredientName = 'Vui lòng nhập tên nguyên liệu'
    if (!ingForm.ingredientCategory) errs.ingredientCategory = 'Vui lòng chọn nhóm nguyên liệu'

    if (Object.keys(errs).length > 0) {
      setIngErrors(errs)
      return
    }

    setIngErrors({})

    const newLine: RecipeIngredientLine = {
      id: `ing-${Date.now().toString().slice(-4)}`,
      recipeId: selectedRecipe.id,
      lineOrder: ingForm.lineOrder ? parseInt(ingForm.lineOrder) : 0,
      ingredientName: ingForm.ingredientName,
      ingredientCategory: ingForm.ingredientCategory,
      quantity: ingForm.quantity ? parseFloat(ingForm.quantity) : null,
      unit: ingForm.unit || null,
      preparationNote: ingForm.preparationNote || null,
      wasteNote: ingForm.wasteNote || null,
      optional: ingForm.optional,
      ingredientMasterId: ingForm.ingredientMasterId || null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...ingredients, newLine]
    localStorage.setItem('mvos_recipe_ingredient_lines', JSON.stringify(updated))
    setIngredients(updated)

    setIngForm({
      lineOrder: (parseInt(ingForm.lineOrder) + 1).toString(),
      ingredientName: '',
      ingredientCategory: 'protein',
      quantity: '',
      unit: 'g',
      preparationNote: '',
      wasteNote: '',
      optional: false,
      ingredientMasterId: ''
    })
  }

  const handleUpdateStatus = (recipeId: string, nextStatus: RecipeStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = recipes.map((r) => {
      if (r.id === recipeId) {
        const updatedR = { ...r, status: nextStatus, updatedAt: nowStr }
        if (selectedRecipe?.id === recipeId) setSelectedRecipe(updatedR)
        return updatedR
      }
      return r
    })
    localStorage.setItem('mvos_recipes', JSON.stringify(updated))
    setRecipes(updated)
  }

  const getRecipeTypeLabel = (t: RecipeType) => {
    switch (t) {
      case 'standard': return 'Công thức chuẩn'
      case 'prep': return 'Sơ chế'
      case 'sauce': return 'Sốt (Sauce)'
      case 'stock': return 'Nước dùng (Stock)'
      case 'garnish': return 'Garnish'
      case 'pastry': return 'Bánh/ngọt'
      case 'beverage': return 'Đồ uống'
      case 'staff_meal': return 'Cơm nhân viên'
      default: return 'Khác'
    }
  }

  const getRecipeStatusLabel = (s: RecipeStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'active': return 'Đang áp dụng'
      case 'paused': return 'Tạm dừng'
      case 'archived': return 'Lưu trữ'
      default: return s
    }
  }

  const getRecipeStatusClass = (s: RecipeStatus) => {
    switch (s) {
      case 'active': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'paused': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'archived': return 'bg-red-500/10 border border-red-500/25 text-red-500'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getDifficultyLabel = (lvl: RecipeDifficultyLevel) => {
    switch (lvl) {
      case 'low': return 'Dễ'
      case 'medium': return 'Trung bình'
      case 'high': return 'Khó'
      case 'chef_only': return 'Chỉ bếp trưởng'
      default: return 'Chưa gán'
    }
  }

  const getIngredientCategoryLabel = (cat: RecipeIngredientCategory) => {
    switch (cat) {
      case 'protein': return 'Đạm/thịt'
      case 'seafood': return 'Hải sản'
      case 'vegetable': return 'Rau củ'
      case 'fruit': return 'Trái cây'
      case 'dairy': return 'Sữa/bơ/phô mai'
      case 'dry_goods': return 'Hàng khô'
      case 'spice': return 'Gia vị'
      case 'herb': return 'Thảo mộc'
      case 'sauce': return 'Sốt'
      case 'stock': return 'Nước dùng'
      case 'garnish': return 'Trang trí/Garnish'
      case 'pastry': return 'Bánh ngọt'
      case 'beverage': return 'Đồ uống'
      default: return 'Khác'
    }
  }

  const getMenuItemName = (itemId: string | null | undefined) => {
    if (!itemId) return 'Chưa gán món'
    const found = menuItems.find(i => i.id === itemId)
    return found ? found.itemNameVi : itemId
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải công thức món…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải công thức món.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Real data metrics
  const totalRecipes = recipes.length
  const activeRecipesCount = recipes.filter(r => r.status === 'active').length
  const draftRecipesCount = recipes.filter(r => r.status === 'draft').length
  const pausedRecipesCount = recipes.filter(r => r.status === 'paused').length
  const totalIngredientsCount = ingredients.length

  const selectedRecipeIngredients = selectedRecipe
    ? ingredients.filter(ing => ing.recipeId === selectedRecipe.id).sort((a, b) => a.lineOrder - b.lineOrder)
    : []

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🍳 Công thức món ăn (Recipes)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Quản lý công thức chuẩn, định lượng cơ bản, cách làm và ghi chú bếp để đảm bảo chất lượng món ăn Maison Vie.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng công thức</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalRecipes}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang áp dụng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{activeRecipesCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Bản nháp</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{draftRecipesCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cần kiểm tra</span>
          <span className="text-2xl font-serif-cormorant font-bold text-orange-400 mt-1 block">{pausedRecipesCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng dòng nguyên liệu</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalIngredientsCount}</span>
        </div>
      </div>

      {/* Workspace Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Recipes Listing & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Mã</th>
                    <th className="py-3 px-4">Tên công thức</th>
                    <th className="py-3 px-4">Món ăn liên quan</th>
                    <th className="py-3 px-4">Loại công thức</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4 text-center">Phiên bản</th>
                    <th className="py-3 px-4">Yield / Portion</th>
                    <th className="py-3 px-4">Bếp trưởng phụ trách</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {recipes.length > 0 ? (
                    recipes.map((r) => (
                      <tr
                        key={r.id}
                        onClick={() => setSelectedRecipe(r)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedRecipe?.id === r.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{r.recipeCode || '-'}</td>
                        <td className="py-3.5 px-4 font-bold text-foreground">{r.recipeName}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">{getMenuItemName(r.menuItemId)}</td>
                        <td className="py-3.5 px-4 text-gold-hover font-semibold">{getRecipeTypeLabel(r.recipeType)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getRecipeStatusClass(r.status)}`}>
                            {getRecipeStatusLabel(r.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold">v{r.version}</td>
                        <td className="py-3.5 px-4 text-foreground/75 font-mono text-[9px]">
                          {r.yieldQuantity ? `${r.yieldQuantity} ${r.yieldUnit}` : '-'}
                          {r.portionQuantity ? ` / ${r.portionQuantity} ${r.portionUnit}` : ''}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">{r.ownerName || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có công thức nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Recipe */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo công thức tiêu chuẩn mới
            </h3>

            <form onSubmit={handleCreateRecipe} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên công thức chuẩn *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Công thức súp hải sản Marseille..."
                    value={recipeForm.recipeName}
                    onChange={(e) => setRecipeForm({ ...recipeForm, recipeName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {recipeErrors.recipeName && <span className="text-[10px] text-red-400 italic">{recipeErrors.recipeName}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Món ăn liên kết</label>
                  <select
                    value={recipeForm.menuItemId}
                    onChange={(e) => setRecipeForm({ ...recipeForm, menuItemId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn món ăn thực đơn --</option>
                    {menuItems.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.itemNameVi} ({item.itemCode || item.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã công thức</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: REC-SOUP-MARS..."
                    value={recipeForm.recipeCode}
                    onChange={(e) => setRecipeForm({ ...recipeForm, recipeCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Loại công thức *</label>
                  <select
                    value={recipeForm.recipeType}
                    onChange={(e) => setRecipeForm({ ...recipeForm, recipeType: e.target.value as RecipeType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="standard">Công thức chuẩn (Standard)</option>
                    <option value="prep">Sơ chế nguyên liệu (Prep)</option>
                    <option value="sauce">Chế biến nước sốt (Sauce)</option>
                    <option value="stock">Chế biến nước dùng (Stock)</option>
                    <option value="garnish">Trang trí (Garnish)</option>
                    <option value="pastry">Bánh / Ngọt (Pastry)</option>
                    <option value="beverage">Đồ uống (Beverage)</option>
                    <option value="staff_meal">Cơm nhân viên</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Phiên bản công thức</label>
                  <input
                    type="number"
                    min="1"
                    value={recipeForm.version}
                    onChange={(e) => setRecipeForm({ ...recipeForm, version: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Định lượng Yield</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ví dụ: 10"
                    value={recipeForm.yieldQuantity}
                    onChange={(e) => setRecipeForm({ ...recipeForm, yieldQuantity: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Đơn vị Yield</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: portions, lít..."
                    value={recipeForm.yieldUnit}
                    onChange={(e) => setRecipeForm({ ...recipeForm, yieldUnit: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Định lượng Portion</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ví dụ: 1"
                    value={recipeForm.portionQuantity}
                    onChange={(e) => setRecipeForm({ ...recipeForm, portionQuantity: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Đơn vị Portion</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: bát, đĩa, ly..."
                    value={recipeForm.portionUnit}
                    onChange={(e) => setRecipeForm({ ...recipeForm, portionUnit: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Thời gian sơ chế (phút)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="20"
                    value={recipeForm.prepTimeMinutes}
                    onChange={(e) => setRecipeForm({ ...recipeForm, prepTimeMinutes: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Thời gian nấu (phút)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="40"
                    value={recipeForm.cookTimeMinutes}
                    onChange={(e) => setRecipeForm({ ...recipeForm, cookTimeMinutes: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Độ khó thực hiện</label>
                  <select
                    value={recipeForm.difficultyLevel}
                    onChange={(e) => setRecipeForm({ ...recipeForm, difficultyLevel: e.target.value as RecipeDifficultyLevel })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="low">Dễ (Low)</option>
                    <option value="medium">Trung bình (Medium)</option>
                    <option value="high">Khó (High)</option>
                    <option value="chef_only">Chỉ Bếp trưởng chế biến</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Quy trình thực hiện (Cách làm) *</label>
                <textarea
                  rows={4}
                  placeholder="Ghi chi tiết các bước chế biến, nêm nếm gia vị và hoàn thiện món ăn..."
                  value={recipeForm.method}
                  onChange={(e) => setRecipeForm({ ...recipeForm, method: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú trình bày món ăn (Plating)</label>
                  <textarea
                    rows={2}
                    placeholder="Cách múc nước súp, xếp đĩa, đặt cành ngò tây trang trí..."
                    value={recipeForm.platingNote}
                    onChange={(e) => setRecipeForm({ ...recipeForm, platingNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú sơ chế nguyên liệu</label>
                  <textarea
                    rows={2}
                    placeholder="Loại bỏ ruột nghêu, rửa cá hồi qua nước muối..."
                    value={recipeForm.prepNote}
                    onChange={(e) => setRecipeForm({ ...recipeForm, prepNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Chỉ thị cho nhà Bếp (BOH)</label>
                  <textarea
                    rows={2}
                    placeholder="Không đun sôi cá hồi quá lửa làm khô nát thịt cá..."
                    value={recipeForm.kitchenNote}
                    onChange={(e) => setRecipeForm({ ...recipeForm, kitchenNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Lưu ý phục vụ (FOH)</label>
                  <textarea
                    rows={2}
                    placeholder="Bát súp phải cực kỳ nóng khi bê lên bàn..."
                    value={recipeForm.serviceNote}
                    onChange={(e) => setRecipeForm({ ...recipeForm, serviceNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono font-bold text-red-400">Ghi chú Dị ứng</label>
                  <input
                    type="text"
                    placeholder="Tôm, nghêu, các loại hạt..."
                    value={recipeForm.allergyNote}
                    onChange={(e) => setRecipeForm({ ...recipeForm, allergyNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú Ăn kiêng</label>
                  <input
                    type="text"
                    placeholder="Không dùng mỡ heo, có phần ăn chay..."
                    value={recipeForm.dietaryNote}
                    onChange={(e) => setRecipeForm({ ...recipeForm, dietaryNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú Bảo quản / Tồn trữ</label>
                  <input
                    type="text"
                    placeholder="Nước dùng trữ lạnh không quá 24h..."
                    value={recipeForm.storageNote}
                    onChange={(e) => setRecipeForm({ ...recipeForm, storageNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Người phụ trách chuẩn vị *</label>
                  <input
                    type="text"
                    placeholder="Bếp phó hoặc bếp trưởng quản lý..."
                    value={recipeForm.ownerName}
                    onChange={(e) => setRecipeForm({ ...recipeForm, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Hiệu lực từ ngày</label>
                  <input
                    type="date"
                    value={recipeForm.effectiveFrom}
                    onChange={(e) => setRecipeForm({ ...recipeForm, effectiveFrom: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Hiệu lực đến ngày</label>
                  <input
                    type="date"
                    value={recipeForm.effectiveTo}
                    onChange={(e) => setRecipeForm({ ...recipeForm, effectiveTo: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái công thức *</label>
                  <select
                    value={recipeForm.status}
                    onChange={(e) => setRecipeForm({ ...recipeForm, status: e.target.value as RecipeStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="active">Đang áp dụng (Active)</option>
                    <option value="paused">Tạm dừng để hiệu chỉnh (Paused)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Tạo công thức món
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Recipe Ingredients */}
        <div className="space-y-6">
          {/* Detailed Info Panel */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết công thức nấu ăn
            </h3>

            {selectedRecipe ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedRecipe.recipeName}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Mã: {selectedRecipe.recipeCode || selectedRecipe.id}</span>
                    <span>Loại: {getRecipeTypeLabel(selectedRecipe.recipeType)}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Món ăn liên quan</span>
                    <span className="font-bold text-foreground/80 block">{getMenuItemName(selectedRecipe.menuItemId)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người chịu trách nhiệm</span>
                    <span className="font-bold text-gold block">{selectedRecipe.ownerName || 'Chưa phân công'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái áp dụng</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getRecipeStatusClass(selectedRecipe.status)}`}>
                      {getRecipeStatusLabel(selectedRecipe.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Độ khó / Quy chuẩn</span>
                    <span className="font-bold text-foreground/80 block">{getDifficultyLabel(selectedRecipe.difficultyLevel || 'medium')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Yield lượng thành phẩm</span>
                    <span className="font-bold text-foreground/80 block font-mono">
                      {selectedRecipe.yieldQuantity ? `${selectedRecipe.yieldQuantity} ${selectedRecipe.yieldUnit}` : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block font-mono">Portion cỡ phần ăn</span>
                    <span className="font-bold text-foreground/80 block font-mono">
                      {selectedRecipe.portionQuantity ? `${selectedRecipe.portionQuantity} ${selectedRecipe.portionUnit}` : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block font-mono">Thời gian sơ chế</span>
                    <span className="font-semibold text-foreground/80 block font-mono">{selectedRecipe.prepTimeMinutes || 0} phút</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block font-mono">Thời gian nấu</span>
                    <span className="font-semibold text-foreground/80 block font-mono">{selectedRecipe.cookTimeMinutes || 0} phút</span>
                  </div>
                </div>

                {selectedRecipe.platingNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Yêu cầu trình bày (Plating)</span>
                    <p className="text-foreground/85 leading-relaxed">{selectedRecipe.platingNote}</p>
                  </div>
                )}

                {selectedRecipe.prepNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Yêu cầu sơ chế nguyên liệu</span>
                    <p className="text-foreground/85 leading-relaxed">{selectedRecipe.prepNote}</p>
                  </div>
                )}

                {selectedRecipe.method && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Quy trình các bước cách làm</span>
                    <p className="text-foreground/85 leading-relaxed whitespace-pre-line bg-background/50 p-2.5 rounded border border-gold-border/10">{selectedRecipe.method}</p>
                  </div>
                )}

                <div className="bg-background/40 p-2.5 rounded border border-gold-border/10 leading-relaxed space-y-1">
                  {selectedRecipe.allergyNote && <div><span className="font-semibold text-red-400 font-bold">Dị ứng cần lưu ý:</span> {selectedRecipe.allergyNote}</div>}
                  {selectedRecipe.dietaryNote && <div><span className="font-semibold text-foreground/85">Ghi chú ăn kiêng:</span> {selectedRecipe.dietaryNote}</div>}
                  {selectedRecipe.storageNote && <div><span className="font-semibold text-foreground/85">Cách bảo quản:</span> {selectedRecipe.storageNote}</div>}
                </div>

                {/* Ingredients Lines Listing */}
                <div className="border-t border-gold-border/20 pt-4 space-y-3">
                  <span className="text-[10px] text-gold font-serif-cormorant font-bold uppercase tracking-wider block">🥗 Dòng định lượng nguyên liệu</span>
                  
                  {selectedRecipeIngredients.length > 0 ? (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {selectedRecipeIngredients.map((line) => (
                        <div key={line.id} className="flex justify-between items-start py-1 border-b border-gold-border/5">
                          <div>
                            <span className="font-semibold text-foreground/80 block">
                              {line.lineOrder}. {line.ingredientName} {line.optional && <span className="text-[8px] text-foreground/45 italic">(tùy chọn)</span>}
                            </span>
                            <span className="text-[8px] text-gold-hover font-mono block">{getIngredientCategoryLabel(line.ingredientCategory || 'other')}</span>
                          </div>
                          <span className="font-mono font-bold text-foreground/90 whitespace-nowrap">
                            {line.quantity !== null ? line.quantity : '-'} {line.unit || ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-foreground/40 italic">Chưa có dòng nguyên liệu nào cho công thức này.</p>
                  )}

                  <Link
                    href={`/studio/normalization?recipe_id=${selectedRecipe.id}`}
                    className="w-full rounded border border-gold hover:border-gold-hover px-2 py-2 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block text-center"
                  >
                    ⚖️ Chuẩn hóa nguyên liệu
                  </Link>

                  {/* Add Ingredient Line Form */}
                  <form onSubmit={handleCreateIngredientLine} className="bg-gold-muted/5 border border-gold-border/10 p-3 rounded space-y-2 mt-2">
                    <span className="text-[9px] text-gold font-bold block">➕ Thêm định lượng nguyên liệu</span>
                    
                    {masterIngredients.length > 0 && (
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Nguyên liệu chuẩn liên quan</label>
                        <select
                          value={ingForm.ingredientMasterId}
                          onChange={(e) => {
                            const selectedId = e.target.value
                            if (!selectedId) {
                              setIngForm(prev => ({ ...prev, ingredientMasterId: '' }))
                              return
                            }
                            const matched = masterIngredients.find(m => m.id === selectedId)
                            if (matched) {
                              setIngForm(prev => ({
                                ...prev,
                                ingredientMasterId: matched.id,
                                ingredientName: matched.ingredientNameVi || prev.ingredientName,
                                unit: matched.defaultUnit || prev.unit,
                                ingredientCategory: (matched.category as RecipeIngredientCategory) || prev.ingredientCategory
                              }))
                            }
                          }}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                        >
                          <option value="">-- Chọn nguyên liệu chuẩn --</option>
                          {masterIngredients.map((m) => (
                            <option key={m.id} value={m.id}>
                              {m.ingredientNameVi} ({m.defaultUnit})
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="grid gap-2 grid-cols-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Thứ tự dòng</label>
                        <input
                          type="number"
                          value={ingForm.lineOrder}
                          onChange={(e) => setIngForm({ ...ingForm, lineOrder: e.target.value })}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Nhóm nhóm</label>
                        <select
                          value={ingForm.ingredientCategory}
                          onChange={(e) => setIngForm({ ...ingForm, ingredientCategory: e.target.value as RecipeIngredientCategory })}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                        >
                          <option value="protein">Đạm/thịt</option>
                          <option value="seafood">Hải sản</option>
                          <option value="vegetable">Rau củ</option>
                          <option value="spice">Gia vị</option>
                          <option value="herb">Thảo mộc</option>
                          <option value="dairy">Sữa/bơ</option>
                          <option value="dry_goods">Hàng khô</option>
                          <option value="other">Khác</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Tên nguyên liệu *</label>
                      <input
                        type="text"
                        placeholder="Hành tây chín, cá hồi..."
                        value={ingForm.ingredientName}
                        onChange={(e) => setIngForm({ ...ingForm, ingredientName: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      />
                      {ingErrors.ingredientName && <span className="text-[8px] text-red-400 italic">{ingErrors.ingredientName}</span>}
                    </div>

                    <div className="grid gap-2 grid-cols-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Định lượng số</label>
                        <input
                          type="number"
                          step="any"
                          placeholder="500"
                          value={ingForm.quantity}
                          onChange={(e) => setIngForm({ ...ingForm, quantity: e.target.value })}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none font-mono"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Đơn vị đo</label>
                        <input
                          type="text"
                          placeholder="g, ml, cành..."
                          value={ingForm.unit}
                          onChange={(e) => setIngForm({ ...ingForm, unit: e.target.value })}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <input
                        type="checkbox"
                        id="opt_check"
                        checked={ingForm.optional}
                        onChange={(e) => setIngForm({ ...ingForm, optional: e.target.checked })}
                        className="rounded border-gold-border/20"
                      />
                      <label htmlFor="opt_check" className="text-[9px] text-foreground/60 select-none">Nguyên liệu tùy chọn (không bắt buộc)</label>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded bg-gold/90 hover:bg-gold text-background py-1 text-[10px] font-bold transition-all"
                    >
                      Thêm nguyên liệu
                    </button>
                  </form>
                </div>

                {/* State Actions for Recipe */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái công thức</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedRecipe.id, 'active')}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Áp dụng công thức
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedRecipe.id, 'paused')}
                      className="rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-center text-[10px] text-yellow-500 hover:bg-yellow-500/10 transition-all font-semibold"
                    >
                      Tạm dừng công thức
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedRecipe.id, 'archived')}
                      className="col-span-2 rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Lưu trữ công thức
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một công thức từ danh sách để xem cách làm, định lượng chi tiết và chỉ dẫn BOH.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải công thức món…</p>
      </div>
    }>
      <RecipesPageContent />
    </Suspense>
  )
}
