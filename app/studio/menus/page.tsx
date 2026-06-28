'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type MenuType =
  | "a_la_carte"
  | "business_lunch"
  | "degustation"
  | "travel_agency"
  | "tour_group"
  | "private_dining"
  | "event"
  | "beverage"
  | "wine"
  | "seasonal"
  | "special"
  | "other"

export type MenuStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived"

export type TargetGuestType =
  | "walk_in"
  | "a_la_carte_guest"
  | "tour_group"
  | "travel_agency"
  | "private_dining"
  | "corporate"
  | "event_guest"
  | "vip"
  | "internal"
  | "other"

export type MenuSection =
  | "amuse_bouche"
  | "starter"
  | "soup"
  | "salad"
  | "fish"
  | "meat"
  | "poultry"
  | "vegetarian"
  | "cheese"
  | "dessert"
  | "beverage"
  | "wine"
  | "other"

export type CourseType =
  | "single_item"
  | "course_1"
  | "course_2"
  | "course_3"
  | "course_4"
  | "course_5"
  | "course_6"
  | "optional_choice"
  | "supplement"
  | "other"

export type MenuItemType =
  | "food"
  | "beverage"
  | "wine"
  | "cocktail"
  | "mocktail"
  | "coffee_tea"
  | "other"

export interface MenuCatalog {
  id: string
  menuName: string
  menuCode?: string | null
  menuType: MenuType
  status: MenuStatus
  description?: string | null
  targetGuestType?: TargetGuestType | null
  effectiveFrom?: string | null
  effectiveTo?: string | null
  languageNote?: string | null
  internalNote?: string | null
  ownerName?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

export interface MenuItem {
  id: string
  menuCatalogId: string
  itemCode?: string | null
  itemNameFr?: string | null
  itemNameEn?: string | null
  itemNameVi?: string | null
  itemNameJa?: string | null
  itemDescriptionVi?: string | null
  itemDescriptionEn?: string | null
  section: MenuSection
  courseType?: CourseType | null
  itemType: MenuItemType
  status: MenuStatus
  allergyNote?: string | null
  dietaryNote?: string | null
  pregnancyNote?: string | null
  serviceNote?: string | null
  kitchenNote?: string | null
  displayOrder: number
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

const INITIAL_CATALOGS: MenuCatalog[] = [
  {
    id: 'menu-1',
    menuName: 'Set Menu Âu Cổ Điển 1',
    menuCode: 'SET-CLASSIC-01',
    menuType: 'degustation',
    status: 'active',
    description: 'Set thực đơn tiệc Âu cao cấp 3 món cho sự kiện và đoàn lữ hành Pháp.',
    targetGuestType: 'tour_group',
    effectiveFrom: '2026-01-01',
    effectiveTo: '2026-12-31',
    languageNote: 'Song ngữ Pháp - Anh',
    internalNote: 'Lưu ý chuẩn bị riêng súp nấm chay cho khách dị ứng.',
    ownerName: 'Chef de Cuisine Antoine',
    createdAt: '2026-01-01 09:00',
    updatedAt: '2026-06-28 10:00'
  }
]

const INITIAL_ITEMS: MenuItem[] = [
  {
    id: 'item-101',
    menuCatalogId: 'menu-1',
    itemCode: 'SOUP-MARSEILLE',
    itemNameFr: 'Bouillabaisse de Marseille',
    itemNameEn: 'Marseille Fish Soup',
    itemNameVi: 'Súp hải sản kiểu Marseille',
    itemNameJa: 'マルセイユ風魚介スープ',
    itemDescriptionVi: 'Súp hải sản truyền thống Pháp phục vụ kèm bánh mì nướng tỏi.',
    itemDescriptionEn: 'Traditional French fish soup served with garlic croutons.',
    section: 'soup',
    courseType: 'course_1',
    itemType: 'food',
    status: 'active',
    allergyNote: 'Hải sản vỏ cứng (tôm, cua, nghêu)',
    dietaryNote: 'Không chứa thịt heo',
    pregnancyNote: 'An toàn cho phụ nữ mang thai khi chín hoàn toàn',
    serviceNote: 'Rót súp nóng tại bàn trước mặt khách.',
    kitchenNote: 'Chuẩn bị súp nấm thay thế cho khách dị ứng tôm.',
    displayOrder: 1,
    createdAt: '2026-01-01 09:30',
    updatedAt: '2026-06-28 10:00'
  }
]

function MenusPageContent() {
  const [catalogs, setCatalogs] = useState<MenuCatalog[]>([])
  const [items, setItems] = useState<MenuItem[]>([])
  const [selectedCatalog, setSelectedCatalog] = useState<MenuCatalog | null>(null)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)

  // Filter state for items display
  const [filterCatalogId, setFilterCatalogId] = useState<string>('all')

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Catalog Form State
  const [catalogForm, setCatalogForm] = useState({
    menuName: '',
    menuCode: '',
    menuType: 'degustation' as MenuType,
    status: 'draft' as MenuStatus,
    description: '',
    targetGuestType: 'tour_group' as TargetGuestType,
    effectiveFrom: '',
    effectiveTo: '',
    languageNote: '',
    internalNote: '',
    ownerName: ''
  })

  // Item Form State
  const [itemForm, setItemForm] = useState({
    menuCatalogId: '',
    itemCode: '',
    itemNameFr: '',
    itemNameEn: '',
    itemNameVi: '',
    itemNameJa: '',
    itemDescriptionVi: '',
    itemDescriptionEn: '',
    section: 'starter' as MenuSection,
    courseType: 'single_item' as CourseType,
    itemType: 'food' as MenuItemType,
    status: 'draft' as MenuStatus,
    allergyNote: '',
    dietaryNote: '',
    pregnancyNote: '',
    serviceNote: '',
    kitchenNote: '',
    displayOrder: '0'
  })

  const [catalogErrors, setCatalogErrors] = useState<Record<string, string>>({})
  const [itemErrors, setItemErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedCatalogs = localStorage.getItem('mvos_menu_catalogs')
        const storedItems = localStorage.getItem('mvos_menu_items')

        let loadedCatalogs: MenuCatalog[] = []
        let loadedItems: MenuItem[] = []

        if (storedCatalogs) {
          loadedCatalogs = JSON.parse(storedCatalogs)
        } else {
          localStorage.setItem('mvos_menu_catalogs', JSON.stringify(INITIAL_CATALOGS))
          loadedCatalogs = INITIAL_CATALOGS
        }
        setCatalogs(loadedCatalogs)

        if (storedItems) {
          loadedItems = JSON.parse(storedItems)
        } else {
          localStorage.setItem('mvos_menu_items', JSON.stringify(INITIAL_ITEMS))
          loadedItems = INITIAL_ITEMS
        }
        setItems(loadedItems)

        setLoading(false)
      } catch {
        setError('Không thể tải danh mục thực đơn và món ăn.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateCatalog = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!catalogForm.menuName.trim()) errs.menuName = 'Vui lòng nhập tên thực đơn'
    if (!catalogForm.menuType) errs.menuType = 'Vui lòng chọn loại thực đơn'
    if (!catalogForm.status) errs.status = 'Vui lòng chọn trạng thái'

    if (Object.keys(errs).length > 0) {
      setCatalogErrors(errs)
      return
    }

    setCatalogErrors({})

    const newCatalog: MenuCatalog = {
      id: `menu-${Date.now().toString().slice(-4)}`,
      menuName: catalogForm.menuName,
      menuCode: catalogForm.menuCode || null,
      menuType: catalogForm.menuType,
      status: catalogForm.status,
      description: catalogForm.description || null,
      targetGuestType: catalogForm.targetGuestType || null,
      effectiveFrom: catalogForm.effectiveFrom || null,
      effectiveTo: catalogForm.effectiveTo || null,
      languageNote: catalogForm.languageNote || null,
      internalNote: catalogForm.internalNote || null,
      ownerName: catalogForm.ownerName || 'Chưa phân công',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...catalogs, newCatalog]
    localStorage.setItem('mvos_menu_catalogs', JSON.stringify(updated))
    setCatalogs(updated)
    setSelectedCatalog(newCatalog)

    setCatalogForm({
      menuName: '',
      menuCode: '',
      menuType: 'degustation',
      status: 'draft',
      description: '',
      targetGuestType: 'tour_group',
      effectiveFrom: '',
      effectiveTo: '',
      languageNote: '',
      internalNote: '',
      ownerName: ''
    })
  }

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!itemForm.menuCatalogId) errs.menuCatalogId = 'Vui lòng chọn thực đơn liên kết'
    if (!itemForm.itemNameFr.trim() && !itemForm.itemNameEn.trim() && !itemForm.itemNameVi.trim() && !itemForm.itemNameJa.trim()) {
      errs.itemName = 'Vui lòng nhập ít nhất một tên món (Pháp / Anh / Việt / Nhật)'
    }
    if (!itemForm.section) errs.section = 'Vui lòng chọn nhóm món'
    if (!itemForm.itemType) errs.itemType = 'Vui lòng chọn loại món'
    if (!itemForm.status) errs.status = 'Vui lòng chọn trạng thái món'

    if (Object.keys(errs).length > 0) {
      setItemErrors(errs)
      return
    }

    setItemErrors({})

    const newItem: MenuItem = {
      id: `item-${Date.now().toString().slice(-4)}`,
      menuCatalogId: itemForm.menuCatalogId,
      itemCode: itemForm.itemCode || null,
      itemNameFr: itemForm.itemNameFr || null,
      itemNameEn: itemForm.itemNameEn || null,
      itemNameVi: itemForm.itemNameVi || null,
      itemNameJa: itemForm.itemNameJa || null,
      itemDescriptionVi: itemForm.itemDescriptionVi || null,
      itemDescriptionEn: itemForm.itemDescriptionEn || null,
      section: itemForm.section,
      courseType: itemForm.courseType || null,
      itemType: itemForm.itemType,
      status: itemForm.status,
      allergyNote: itemForm.allergyNote || null,
      dietaryNote: itemForm.dietaryNote || null,
      pregnancyNote: itemForm.pregnancyNote || null,
      serviceNote: itemForm.serviceNote || null,
      kitchenNote: itemForm.kitchenNote || null,
      displayOrder: itemForm.displayOrder ? parseInt(itemForm.displayOrder) : 0,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...items, newItem]
    localStorage.setItem('mvos_menu_items', JSON.stringify(updated))
    setItems(updated)
    setSelectedItem(newItem)

    setItemForm({
      menuCatalogId: itemForm.menuCatalogId, // Keep matching menu catalog selected
      itemCode: '',
      itemNameFr: '',
      itemNameEn: '',
      itemNameVi: '',
      itemNameJa: '',
      itemDescriptionVi: '',
      itemDescriptionEn: '',
      section: 'starter',
      courseType: 'single_item',
      itemType: 'food',
      status: 'draft',
      allergyNote: '',
      dietaryNote: '',
      pregnancyNote: '',
      serviceNote: '',
      kitchenNote: '',
      displayOrder: '0'
    })
  }

  const handleUpdateCatalogStatus = (catId: string, nextStatus: MenuStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = catalogs.map((c) => {
      if (c.id === catId) {
        const updatedC = { ...c, status: nextStatus, updatedAt: nowStr }
        if (selectedCatalog?.id === catId) setSelectedCatalog(updatedC)
        return updatedC
      }
      return c
    })
    localStorage.setItem('mvos_menu_catalogs', JSON.stringify(updated))
    setCatalogs(updated)
  }

  const handleUpdateItemStatus = (itemId: string, nextStatus: MenuStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = items.map((i) => {
      if (i.id === itemId) {
        const updatedI = { ...i, status: nextStatus, updatedAt: nowStr }
        if (selectedItem?.id === itemId) setSelectedItem(updatedI)
        return updatedI
      }
      return i
    })
    localStorage.setItem('mvos_menu_items', JSON.stringify(updated))
    setItems(updated)
  }

  const getMenuTypeLabel = (t: MenuType) => {
    switch (t) {
      case 'a_la_carte': return 'À la carte'
      case 'business_lunch': return 'Bữa trưa'
      case 'degustation': return 'Degustation'
      case 'travel_agency': return 'Công ty lữ hành'
      case 'tour_group': return 'Đoàn tour'
      case 'private_dining': return 'Phòng riêng'
      case 'event': return 'Sự kiện'
      case 'beverage': return 'Đồ uống'
      case 'wine': return 'Rượu vang'
      case 'seasonal': return 'Theo mùa'
      case 'special': return 'Đặc biệt'
      default: return 'Khác'
    }
  }

  const getMenuStatusLabel = (s: MenuStatus) => {
    switch (s) {
      case 'draft': return 'Bản nháp'
      case 'active': return 'Đang áp dụng'
      case 'paused': return 'Tạm dừng'
      case 'archived': return 'Lưu trữ'
      default: return s
    }
  }

  const getMenuStatusClass = (s: MenuStatus) => {
    switch (s) {
      case 'active': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'paused': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500 font-semibold'
      case 'archived': return 'bg-red-500/10 border border-red-500/25 text-red-500'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getTargetGuestLabel = (t: TargetGuestType) => {
    switch (t) {
      case 'walk_in': return 'Khách walk-in'
      case 'a_la_carte_guest': return 'Khách à la carte'
      case 'tour_group': return 'Khách đoàn'
      case 'travel_agency': return 'Công ty lữ hành'
      case 'private_dining': return 'Phòng riêng'
      case 'corporate': return 'Corporate'
      case 'event_guest': return 'Khách sự kiện'
      case 'vip': return 'VIP'
      case 'internal': return 'Nội bộ'
      default: return 'Khác'
    }
  }

  const getSectionLabel = (sec: MenuSection) => {
    switch (sec) {
      case 'amuse_bouche': return 'Amuse-bouche'
      case 'starter': return 'Khai vị'
      case 'soup': return 'Súp'
      case 'salad': return 'Salad'
      case 'fish': return 'Cá'
      case 'meat': return 'Thịt'
      case 'poultry': return 'Gia cầm'
      case 'vegetarian': return 'Rau củ'
      case 'cheese': return 'Phô mai'
      case 'dessert': return 'Tráng miệng'
      case 'beverage': return 'Đồ uống'
      case 'wine': return 'Rượu vang'
      default: return 'Khác'
    }
  }

  const getCourseLabel = (c: CourseType) => {
    switch (c) {
      case 'single_item': return 'Món lẻ'
      case 'course_1': return 'Course 1'
      case 'course_2': return 'Course 2'
      case 'course_3': return 'Course 3'
      case 'course_4': return 'Course 4'
      case 'course_5': return 'Course 5'
      case 'course_6': return 'Course 6'
      case 'optional_choice': return 'Lựa chọn'
      case 'supplement': return 'Món phụ thu'
      default: return 'Khác'
    }
  }

  const getItemTypeLabel = (t: MenuItemType) => {
    switch (t) {
      case 'food': return 'Món ăn'
      case 'beverage': return 'Đồ uống'
      case 'wine': return 'Rượu vang'
      case 'cocktail': return 'Cocktail'
      case 'mocktail': return 'Mocktail'
      case 'coffee_tea': return 'Cà phê/trà'
      default: return 'Khác'
    }
  }

  const getMenuCatalogName = (catId: string) => {
    const found = catalogs.find(c => c.id === catId)
    return found ? found.menuName : catId
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải danh mục thực đơn…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải danh mục thực đơn.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Real Counts
  const totalMenus = catalogs.length
  const activeMenus = catalogs.filter(c => c.status === 'active').length
  const totalDishes = items.length
  const activeDishes = items.filter(i => i.status === 'active').length
  const draftMenus = catalogs.filter(c => c.status === 'draft').length

  // Filtered items list
  const filteredItems = items.filter(item => {
    if (filterCatalogId === 'all') return true
    return item.menuCatalogId === filterCatalogId
  })

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          📜 Danh mục thực đơn (Menu Catalog)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Quản lý thực đơn và món ăn của Maison Vie làm nền tảng cho vận hành, tour, sự kiện, recipe và food cost sau này.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng thực đơn</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalMenus}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang áp dụng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{activeMenus}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng số món</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalDishes}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Món đang chạy</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-400 mt-1 block">{activeDishes}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Bản nháp</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{draftMenus}</span>
        </div>
      </div>

      {/* Workspace Tabs: Catalogs & Items */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Menu Catalog List & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border p-6 space-y-4">
            <h2 className="text-xl font-serif-cormorant font-bold text-gold border-b border-gold-border/20 pb-2">
              📖 Danh sách thực đơn chính
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Tên thực đơn</th>
                    <th className="py-3 px-4">Mã</th>
                    <th className="py-3 px-4">Loại</th>
                    <th className="py-3 px-4">Đối tượng</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4">Hiệu lực</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {catalogs.length > 0 ? (
                    catalogs.map((c) => (
                      <tr
                        key={c.id}
                        onClick={() => {
                          setSelectedCatalog(c)
                          setSelectedItem(null)
                        }}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedCatalog?.id === c.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-bold text-foreground">{c.menuName}</td>
                        <td className="py-3.5 px-4 font-mono text-gold-hover font-bold">{c.menuCode || '-'}</td>
                        <td className="py-3.5 px-4">{getMenuTypeLabel(c.menuType)}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">
                          {c.targetGuestType ? getTargetGuestLabel(c.targetGuestType) : '-'}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getMenuStatusClass(c.status)}`}>
                            {getMenuStatusLabel(c.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[9px] text-foreground/50">
                          {c.effectiveFrom || '*'} &rarr; {c.effectiveTo || '*'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có thực đơn nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Menu Catalog */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Khởi tạo thực đơn mới
            </h3>

            <form onSubmit={handleCreateCatalog} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên thực đơn *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Set Menu Âu Cổ Điển 1..."
                    value={catalogForm.menuName}
                    onChange={(e) => setCatalogForm({ ...catalogForm, menuName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {catalogErrors.menuName && <span className="text-[10px] text-red-400 italic">{catalogErrors.menuName}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã thực đơn</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: SET-CLASSIC-01..."
                    value={catalogForm.menuCode}
                    onChange={(e) => setCatalogForm({ ...catalogForm, menuCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Loại thực đơn *</label>
                  <select
                    value={catalogForm.menuType}
                    onChange={(e) => setCatalogForm({ ...catalogForm, menuType: e.target.value as MenuType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="a_la_carte">À la carte</option>
                    <option value="business_lunch">Bữa trưa văn phòng</option>
                    <option value="degustation">Degustation</option>
                    <option value="travel_agency">Công ty lữ hành</option>
                    <option value="tour_group">Đoàn tour</option>
                    <option value="private_dining">Phòng riêng</option>
                    <option value="event">Sự kiện</option>
                    <option value="beverage">Đồ uống</option>
                    <option value="wine">Rượu vang</option>
                    <option value="seasonal">Theo mùa</option>
                    <option value="special">Đặc biệt</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Đối tượng khách hàng</label>
                  <select
                    value={catalogForm.targetGuestType}
                    onChange={(e) => setCatalogForm({ ...catalogForm, targetGuestType: e.target.value as TargetGuestType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="walk_in">Khách walk-in</option>
                    <option value="a_la_carte_guest">Khách à la carte</option>
                    <option value="tour_group">Khách đoàn tour</option>
                    <option value="travel_agency">Công ty lữ hành</option>
                    <option value="private_dining">Phòng riêng</option>
                    <option value="corporate">Corporate</option>
                    <option value="event_guest">Khách sự kiện</option>
                    <option value="vip">VIP</option>
                    <option value="internal">Nội bộ</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái *</label>
                  <select
                    value={catalogForm.status}
                    onChange={(e) => setCatalogForm({ ...catalogForm, status: e.target.value as MenuStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="active">Đang áp dụng (Active)</option>
                    <option value="paused">Tạm dừng (Paused)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mô tả thực đơn</label>
                  <textarea
                    rows={2}
                    placeholder="Mô tả cơ cấu món ăn trong thực đơn..."
                    value={catalogForm.description}
                    onChange={(e) => setCatalogForm({ ...catalogForm, description: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ghi chú ngôn ngữ</label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: Song ngữ Anh-Pháp, Song ngữ Anh-Nhật..."
                    value={catalogForm.languageNote}
                    onChange={(e) => setCatalogForm({ ...catalogForm, languageNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Hiệu lực từ ngày</label>
                  <input
                    type="date"
                    value={catalogForm.effectiveFrom}
                    onChange={(e) => setCatalogForm({ ...catalogForm, effectiveFrom: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Hiệu lực đến ngày</label>
                  <input
                    type="date"
                    value={catalogForm.effectiveTo}
                    onChange={(e) => setCatalogForm({ ...catalogForm, effectiveTo: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono font-bold text-gold">Người phụ trách chính</label>
                  <input
                    type="text"
                    placeholder="Tên Chef phụ trách..."
                    value={catalogForm.ownerName}
                    onChange={(e) => setCatalogForm({ ...catalogForm, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Ghi chú nội bộ</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú thêm về vận hành nhà bếp hoặc setup..."
                  value={catalogForm.internalNote}
                  onChange={(e) => setCatalogForm({ ...catalogForm, internalNote: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Tạo thực đơn
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Menu Items Panel */}
        <div className="space-y-6">
          {/* Detailed Info Card */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết thực đơn chính
            </h3>

            {selectedCatalog ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedCatalog.menuName}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Mã: {selectedCatalog.menuCode || selectedCatalog.id}</span>
                    <span>Loại: {getMenuTypeLabel(selectedCatalog.menuType)}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Đối tượng khách</span>
                    <span className="font-bold text-foreground/80 block">
                      {selectedCatalog.targetGuestType ? getTargetGuestLabel(selectedCatalog.targetGuestType) : '-'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người phụ trách</span>
                    <span className="font-bold text-gold block">{selectedCatalog.ownerName || 'Chưa phân công'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getMenuStatusClass(selectedCatalog.status)}`}>
                      {getMenuStatusLabel(selectedCatalog.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Tổng số món liên kết</span>
                    <span className="font-bold text-foreground/80 block font-mono">
                      {items.filter(i => i.menuCatalogId === selectedCatalog.id).length} món
                    </span>
                  </div>
                </div>

                {selectedCatalog.description && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mô tả thực đơn</span>
                    <p className="text-foreground/85 leading-relaxed">{selectedCatalog.description}</p>
                  </div>
                )}

                {selectedCatalog.languageNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú ngôn ngữ</span>
                    <p className="text-foreground/85 leading-relaxed">{selectedCatalog.languageNote}</p>
                  </div>
                )}

                {selectedCatalog.internalNote && (
                  <div className="p-3 border border-gold-border/20 bg-gold-muted/5 rounded-lg space-y-1">
                    <span className="text-[9px] text-gold font-mono block font-bold">Ghi chú nội bộ</span>
                    <p className="text-foreground/85 leading-relaxed">{selectedCatalog.internalNote}</p>
                  </div>
                )}

                {/* State Actions for Menu Catalog */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái thực đơn</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateCatalogStatus(selectedCatalog.id, 'active')}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Áp dụng thực đơn
                    </button>

                    <button
                      onClick={() => handleUpdateCatalogStatus(selectedCatalog.id, 'paused')}
                      className="rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-center text-[10px] text-yellow-500 hover:bg-yellow-500/10 transition-all font-semibold"
                    >
                      Tạm dừng thực đơn
                    </button>

                    <button
                      onClick={() => handleUpdateCatalogStatus(selectedCatalog.id, 'archived')}
                      className="col-span-2 rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Lưu trữ thực đơn
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-6">Chọn một thực đơn từ danh sách để xem chi tiết đầy đủ và quản lý trạng thái áp dụng.</p>
            )}
          </div>
        </div>
      </div>

      {/* Section 2: Menu Items List & Creation Form */}
      <div className="border-t border-gold-border/40 pt-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-serif-cormorant font-bold text-gold tracking-wide">
              🍽️ Chi tiết món ăn / thức uống
            </h2>
            <p className="text-xs text-foreground/50">
              Quản lý chi tiết từng món ăn hoặc rượu vang thuộc các thực đơn đã cấu hình.
            </p>
          </div>

          {/* Catalog Filter Selection */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-foreground/60">Lọc theo thực đơn:</span>
            <select
              value={filterCatalogId}
              onChange={(e) => setFilterCatalogId(e.target.value)}
              className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
            >
              <option value="all">Tất cả thực đơn</option>
              {catalogs.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.menuName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Menu Items Table */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-foreground/80">
                  <thead>
                    <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Mã</th>
                      <th className="py-3 px-4">Tên tiếng Việt</th>
                      <th className="py-3 px-4">Tên tiếng Pháp / Anh</th>
                      <th className="py-3 px-4">Thực đơn</th>
                      <th className="py-3 px-4">Nhóm món</th>
                      <th className="py-3 px-4">Course</th>
                      <th className="py-3 px-4 text-center">Trạng thái</th>
                      <th className="py-3 px-4 text-center">Sắp xếp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gold-border/10">
                    {filteredItems.length > 0 ? (
                      filteredItems.map((item) => (
                        <tr
                          key={item.id}
                          onClick={() => {
                            setSelectedItem(item)
                            setSelectedCatalog(null)
                          }}
                          className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedItem?.id === item.id ? 'bg-gold-muted/10' : ''}`}
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-gold">{item.itemCode || '-'}</td>
                          <td className="py-3.5 px-4 font-bold text-foreground">{item.itemNameVi || '-'}</td>
                          <td className="py-3.5 px-4 text-foreground/75 truncate max-w-[130px]">
                            {item.itemNameFr && <span className="block italic text-[10px]">{item.itemNameFr}</span>}
                            {item.itemNameEn && <span className="block text-[9px] text-foreground/50">{item.itemNameEn}</span>}
                          </td>
                          <td className="py-3.5 px-4 text-foreground/80 font-semibold">{getMenuCatalogName(item.menuCatalogId)}</td>
                          <td className="py-3.5 px-4 text-gold-hover font-semibold">{getSectionLabel(item.section)}</td>
                          <td className="py-3.5 px-4 font-semibold text-foreground/75">
                            {item.courseType ? getCourseLabel(item.courseType) : '-'}
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getMenuStatusClass(item.status)}`}>
                              {getMenuStatusLabel(item.status)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold">{item.displayOrder}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                          Chưa có món ăn nào được ghi nhận.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Creation Form: Menu Item */}
            <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
                🆕 Thêm món mới vào thực đơn
              </h3>

              <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Thực đơn chính *</label>
                    <select
                      value={itemForm.menuCatalogId}
                      onChange={(e) => setItemForm({ ...itemForm, menuCatalogId: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="">-- Chọn thực đơn liên kết --</option>
                      {catalogs.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.menuName}
                        </option>
                      ))}
                    </select>
                    {itemErrors.menuCatalogId && <span className="text-[10px] text-red-400 italic">{itemErrors.menuCatalogId}</span>}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã món</label>
                    <input
                      type="text"
                      placeholder="Mã món (ví dụ: SOUP-MARSEILLE)..."
                      value={itemForm.itemCode}
                      onChange={(e) => setItemForm({ ...itemForm, itemCode: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên món tiếng Việt *</label>
                    <input
                      type="text"
                      placeholder="Tên tiếng Việt..."
                      value={itemForm.itemNameVi}
                      onChange={(e) => setItemForm({ ...itemForm, itemNameVi: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên món tiếng Pháp</label>
                    <input
                      type="text"
                      placeholder="Tên tiếng Pháp..."
                      value={itemForm.itemNameFr}
                      onChange={(e) => setItemForm({ ...itemForm, itemNameFr: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên món tiếng Anh</label>
                    <input
                      type="text"
                      placeholder="Tên tiếng Anh..."
                      value={itemForm.itemNameEn}
                      onChange={(e) => setItemForm({ ...itemForm, itemNameEn: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên món tiếng Nhật (đoàn Tour)</label>
                    <input
                      type="text"
                      placeholder="Tên tiếng Nhật..."
                      value={itemForm.itemNameJa}
                      onChange={(e) => setItemForm({ ...itemForm, itemNameJa: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
                {itemErrors.itemName && <span className="text-[10px] text-red-400 italic block">{itemErrors.itemName}</span>}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Mô tả tiếng Việt</label>
                    <textarea
                      rows={2}
                      placeholder="Mô tả món ăn chi tiết..."
                      value={itemForm.itemDescriptionVi}
                      onChange={(e) => setItemForm({ ...itemForm, itemDescriptionVi: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Mô tả tiếng Anh</label>
                    <textarea
                      rows={2}
                      placeholder="English description..."
                      value={itemForm.itemDescriptionEn}
                      onChange={(e) => setItemForm({ ...itemForm, itemDescriptionEn: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Nhóm món *</label>
                    <select
                      value={itemForm.section}
                      onChange={(e) => setItemForm({ ...itemForm, section: e.target.value as MenuSection })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="amuse_bouche">Amuse-bouche</option>
                      <option value="starter">Khai vị</option>
                      <option value="soup">Súp</option>
                      <option value="salad">Salad</option>
                      <option value="fish">Cá (Fish)</option>
                      <option value="meat">Thịt (Meat)</option>
                      <option value="poultry">Gia cầm</option>
                      <option value="vegetarian">Món rau củ chay</option>
                      <option value="cheese">Phô mai</option>
                      <option value="dessert">Tráng miệng</option>
                      <option value="beverage">Đồ uống</option>
                      <option value="wine">Rượu vang</option>
                      <option value="other">Nhóm khác</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Phân loại Course</label>
                    <select
                      value={itemForm.courseType}
                      onChange={(e) => setItemForm({ ...itemForm, courseType: e.target.value as CourseType })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="single_item">Món lẻ</option>
                      <option value="course_1">Course 1</option>
                      <option value="course_2">Course 2</option>
                      <option value="course_3">Course 3</option>
                      <option value="course_4">Course 4</option>
                      <option value="course_5">Course 5</option>
                      <option value="course_6">Course 6</option>
                      <option value="optional_choice">Lựa chọn thay thế</option>
                      <option value="supplement">Món phụ thu</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Loại món *</label>
                    <select
                      value={itemForm.itemType}
                      onChange={(e) => setItemForm({ ...itemForm, itemType: e.target.value as MenuItemType })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="food">Món ăn</option>
                      <option value="beverage">Đồ uống</option>
                      <option value="wine">Rượu vang</option>
                      <option value="cocktail">Cocktail</option>
                      <option value="mocktail">Mocktail</option>
                      <option value="coffee_tea">Cà phê / Trà</option>
                      <option value="other">Loại khác</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái món *</label>
                    <select
                      value={itemForm.status}
                      onChange={(e) => setItemForm({ ...itemForm, status: e.target.value as MenuStatus })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    >
                      <option value="draft">Bản nháp</option>
                      <option value="active">Đang áp dụng</option>
                      <option value="paused">Tạm dừng</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono font-bold text-red-400">Ghi chú dị ứng</label>
                    <input
                      type="text"
                      placeholder="Hải sản vỏ cứng, các loại hạt..."
                      value={itemForm.allergyNote}
                      onChange={(e) => setItemForm({ ...itemForm, allergyNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Ghi chú ăn kiêng</label>
                    <input
                      type="text"
                      placeholder="Ăn chay trường, không ăn thịt heo..."
                      value={itemForm.dietaryNote}
                      onChange={(e) => setItemForm({ ...itemForm, dietaryNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Lưu ý phụ nữ mang thai</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: Phải chế biến chín kỹ..."
                      value={itemForm.pregnancyNote}
                      onChange={(e) => setItemForm({ ...itemForm, pregnancyNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono font-bold text-gold">Chỉ thị cho nhà Bếp (BOH)</label>
                    <input
                      type="text"
                      placeholder="Nhiệt độ chế biến, bảo quản..."
                      value={itemForm.kitchenNote}
                      onChange={(e) => setItemForm({ ...itemForm, kitchenNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono font-bold text-gold">Chỉ thị cho Phục vụ (FOH)</label>
                    <input
                      type="text"
                      placeholder="Setup ly vang, rót súp tại bàn..."
                      value={itemForm.serviceNote}
                      onChange={(e) => setItemForm({ ...itemForm, serviceNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Thứ tự hiển thị thực đơn</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={itemForm.displayOrder}
                      onChange={(e) => setItemForm({ ...itemForm, displayOrder: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
                >
                  Thêm món ăn
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Detailed View of Selected Menu Item */}
          <div className="space-y-6">
            <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
                🔎 Chi tiết món ăn
              </h3>

              {selectedItem ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-base font-bold text-gold font-serif-cormorant">
                      {selectedItem.itemNameVi || 'Chưa cập nhật tên tiếng Việt'}
                    </h4>
                    {selectedItem.itemNameFr && (
                      <span className="block text-foreground/75 italic mt-0.5 font-sans">
                        Tiếng Pháp: {selectedItem.itemNameFr}
                      </span>
                    )}
                    {selectedItem.itemNameEn && (
                      <span className="block text-foreground/65 text-[10px] font-sans">
                        Tiếng Anh: {selectedItem.itemNameEn}
                      </span>
                    )}
                    {selectedItem.itemNameJa && (
                      <span className="block text-foreground/55 text-[9px] font-sans">
                        Tiếng Nhật: {selectedItem.itemNameJa}
                      </span>
                    )}
                    <span className="text-[9px] text-foreground/45 font-mono block mt-1">Mã món: {selectedItem.itemCode || selectedItem.id}</span>
                  </div>

                  <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Thực đơn liên kết</span>
                      <span className="font-bold text-foreground/80 block">{getMenuCatalogName(selectedItem.menuCatalogId)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Nhóm món</span>
                      <span className="font-bold text-gold block">{getSectionLabel(selectedItem.section)}</span>
                    </div>
                  </div>

                  <div className="grid gap-2 grid-cols-2">
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Course phục vụ</span>
                      <span className="font-bold text-foreground/80 block">{selectedItem.courseType ? getCourseLabel(selectedItem.courseType) : '-'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Phân loại món</span>
                      <span className="font-bold text-foreground/80 block">{getItemTypeLabel(selectedItem.itemType)}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái món</span>
                      <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getMenuStatusClass(selectedItem.status)}`}>
                        {getMenuStatusLabel(selectedItem.status)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Thứ tự sắp xếp</span>
                      <span className="font-bold text-foreground/80 block font-mono">{selectedItem.displayOrder}</span>
                    </div>
                  </div>

                  {selectedItem.itemDescriptionVi && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Mô tả tiếng Việt</span>
                      <p className="text-foreground/80 leading-relaxed font-sans">{selectedItem.itemDescriptionVi}</p>
                    </div>
                  )}

                  {selectedItem.itemDescriptionEn && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Mô tả tiếng Anh</span>
                      <p className="text-foreground/70 leading-relaxed font-sans">{selectedItem.itemDescriptionEn}</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <span className="text-[9px] text-foreground/50 font-mono block">Thông tin kiêng kị / Dị ứng</span>
                    <div className="bg-background/40 p-2.5 rounded border border-gold-border/10 leading-relaxed space-y-1">
                      {selectedItem.allergyNote && <div><span className="font-semibold text-red-400 font-bold">Dị ứng:</span> {selectedItem.allergyNote}</div>}
                      {selectedItem.dietaryNote && <div><span className="font-semibold text-foreground/80">Ăn kiêng:</span> {selectedItem.dietaryNote}</div>}
                      {selectedItem.pregnancyNote && <div><span className="font-semibold text-foreground/80">Thai kỳ:</span> {selectedItem.pregnancyNote}</div>}
                    </div>
                  </div>

                  <div className="border-t border-gold-border/10 pt-3 space-y-2">
                    <span className="text-[9px] text-gold font-mono uppercase block">Chỉ dẫn vận hành FOH & BOH:</span>
                    
                    {selectedItem.kitchenNote && (
                      <div>
                        <span className="text-[9px] text-foreground/50 font-mono block">Nhà bếp chuẩn bị (BOH):</span>
                        <p className="text-foreground/85 italic">&ldquo;{selectedItem.kitchenNote}&rdquo;</p>
                      </div>
                    )}
                    {selectedItem.serviceNote && (
                      <div>
                        <span className="text-[9px] text-foreground/50 font-mono block">Phục vụ khách (FOH):</span>
                        <p className="text-foreground/85 italic">&ldquo;{selectedItem.serviceNote}&rdquo;</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gold-border/20 pt-4 space-y-2">
                    <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Bản chuẩn chế biến (BOH)</span>
                    <Link
                      href={`/studio/recipes?menu_item_id=${selectedItem.id}`}
                      className="w-full rounded border border-gold hover:border-gold-hover px-2 py-2 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block text-center"
                    >
                      🍳 Xem công thức món
                    </Link>
                  </div>

                  <div className="text-[9px] text-foreground/40 font-mono border-t border-gold-border/10 pt-3 flex justify-between">
                    <span>Ngày tạo: {selectedItem.createdAt}</span>
                    <span>Cập nhật: {selectedItem.updatedAt}</span>
                  </div>

                  {/* State Actions for Menu Item */}
                  <div className="border-t border-gold-border/20 pt-4 space-y-2">
                    <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái món</span>
                    
                    <div className="grid gap-2 grid-cols-2">
                      <button
                        onClick={() => handleUpdateItemStatus(selectedItem.id, 'active')}
                        className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                      >
                        Áp dụng món
                      </button>

                      <button
                        onClick={() => handleUpdateItemStatus(selectedItem.id, 'paused')}
                        className="rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-center text-[10px] text-yellow-500 hover:bg-yellow-500/10 transition-all font-semibold"
                      >
                        Tạm dừng món
                      </button>

                      <button
                        onClick={() => handleUpdateItemStatus(selectedItem.id, 'archived')}
                        className="col-span-2 rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                      >
                        Lưu trữ món
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-foreground/40 italic text-center py-6">Chọn một món ăn từ danh sách để xem chi tiết đầy đủ, chỉ thị nhà bếp và chỉ đạo phục vụ.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MenusPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải danh mục thực đơn…</p>
      </div>
    }>
      <MenusPageContent />
    </Suspense>
  )
}
