'use client'

import { useState, useEffect, Suspense } from 'react'

export type SupplierType =
  | "food_supplier"
  | "beverage_supplier"
  | "wine_supplier"
  | "seafood_supplier"
  | "meat_supplier"
  | "vegetable_supplier"
  | "dairy_supplier"
  | "dry_goods_supplier"
  | "bakery_supplier"
  | "equipment_supplier"
  | "cleaning_supplier"
  | "service_provider"
  | "other"

export type SupplierStatus =
  | "prospect"
  | "active"
  | "paused"
  | "inactive"
  | "blocked"
  | "archived"

export type SupplierPriority =
  | "low"
  | "medium"
  | "high"
  | "strategic"

export type SupplierCapabilityStatus =
  | "draft"
  | "active"
  | "paused"
  | "archived"

export interface Supplier {
  id: string
  supplierCode?: string | null
  supplierName: string
  supplierType: SupplierType
  status: SupplierStatus
  priority: SupplierPriority
  contactName?: string | null
  contactRole?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  address?: string | null
  website?: string | null
  taxCode?: string | null
  invoiceNote?: string | null
  deliveryNote?: string | null
  paymentTermNote?: string | null
  qualityNote?: string | null
  storageHandlingNote?: string | null
  categoryNote?: string | null
  internalNote?: string | null
  ownerName?: string | null
  lastContactDate?: string | null
  nextReviewDate?: string | null
  createdAt: string
  updatedAt: string
}

export interface SupplierIngredientCapability {
  id: string
  supplierId: string
  ingredientMasterId?: string | null
  ingredientCategory?: string | null
  capabilityNote?: string | null
  qualityNote?: string | null
  leadTimeNote?: string | null
  minimumOrderNote?: string | null
  status: SupplierCapabilityStatus
  createdAt: string
  updatedAt: string
}

interface IngredientMaster {
  id: string
  ingredientNameVi: string
  defaultUnit: string
}

const INITIAL_SUPPLIERS: Supplier[] = [
  {
    id: 'sup-501',
    supplierCode: 'SUP-HAIPHONG-FOOD',
    supplierName: 'Công ty Cổ phần Thực phẩm Sạch Hải Phòng',
    supplierType: 'seafood_supplier',
    status: 'active',
    priority: 'strategic',
    contactName: 'Mr. Phạm Văn Hải',
    contactRole: 'Giám đốc Kinh doanh',
    contactPhone: '0912-345-678',
    contactEmail: 'haipv@haiphongfood.vn',
    address: 'Số 12 Cảng Chùa Vẽ, Đông Hải, Hải An, Hải Phòng',
    taxCode: '0201768453',
    invoiceNote: 'Hóa đơn VAT điện tử gửi trực tiếp qua email kế toán sau mỗi chuyến giao',
    deliveryNote: 'Giao hàng bằng xe đông lạnh lúc 5:30 sáng hằng ngày',
    paymentTermNote: 'Thanh toán gối đầu chu kỳ 30 ngày kể từ khi nhận đủ hóa đơn tài chính',
    qualityNote: 'Hải sản sống đạt chuẩn sục oxy sả tươi, tôm hùm Na Uy nguyên con bọc đá khô',
    storageHandlingNote: 'Trữ lạnh 0-2 độ C hoặc bể sục sả tươi ngay sau khi tiếp nhận FOH',
    categoryNote: 'Cung ứng độc quyền nhóm hải sản vỏ cứng và cá hồi nhập Na Uy',
    internalNote: 'Hỗ trợ đổi trả trong vòng 2 giờ nếu hàng giao không đạt chuẩn quy cách',
    ownerName: 'Chef de Cuisine Antoine',
    lastContactDate: '2026-06-25',
    nextReviewDate: '2026-12-31',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'sup-502',
    supplierCode: 'SUP-DALAT-GAP',
    supplierName: 'Nông trại Rau sạch hữu cơ Đà Lạt GAP',
    supplierType: 'vegetable_supplier',
    status: 'active',
    priority: 'high',
    contactName: 'Mrs. Nguyễn Thị Lan',
    contactRole: 'Quản lý Vùng',
    contactPhone: '0903-888-999',
    contactEmail: 'lannugyen@dalatgap.com',
    address: '250 Phan Đình Phùng, Phường 2, Đà Lạt, Lâm Đồng',
    taxCode: '5801234567',
    invoiceNote: 'Hóa đơn xuất gộp cuối tháng',
    deliveryNote: 'Giao hàng thứ Ba và thứ Sáu hằng tuần bằng container lạnh lúc 6:00 sáng',
    paymentTermNote: 'Chuyển khoản trong vòng 15 ngày sau khi đối chiếu công nợ cuối tháng',
    qualityNote: 'Rau củ đạt chứng nhận VietGAP/GlobalGAP, không hóa chất bảo quản',
    storageHandlingNote: 'Để nơi râm mát hoặc tủ bảo quản rau củ chuyên dụng BOH',
    categoryNote: 'Rau xanh, cà chua, thảo mộc tươi Đà Lạt',
    internalNote: 'Đơn hàng cần chốt trước 48 giờ để kịp phân tuyến đóng gói tại Lâm Đồng',
    ownerName: 'Bếp trưởng Antoine',
    lastContactDate: '2026-06-24',
    nextReviewDate: '2026-09-30',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  }
]

const INITIAL_CAPABILITIES: SupplierIngredientCapability[] = [
  {
    id: 'cap-1',
    supplierId: 'sup-501',
    ingredientMasterId: 'ing-master-001',
    ingredientCategory: 'seafood',
    capabilityNote: 'Tôm hùm Na Uy sống bọc đá nguyên con tươi',
    qualityNote: 'Nguyên vẹn không đứt râu, thịt săn chắc đạt cân nặng 1.2kg - 1.5kg/con',
    leadTimeNote: 'Đặt trước 24 giờ',
    minimumOrderNote: 'MOQ: 10 kg',
    status: 'active',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'cap-2',
    supplierId: 'sup-501',
    ingredientMasterId: 'ing-master-004',
    ingredientCategory: 'seafood',
    capabilityNote: 'Nghêu biển tự nhiên sả sống sạch cát',
    qualityNote: 'Vỏ nghêu sạch không bùn cát, ngậm nước sống sục oxy',
    leadTimeNote: 'Đặt trước 12 giờ',
    minimumOrderNote: 'MOQ: 5 kg',
    status: 'active',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'cap-3',
    supplierId: 'sup-502',
    ingredientMasterId: 'ing-master-005',
    ingredientCategory: 'vegetable',
    capabilityNote: 'Cà chua organic Đà Lạt chín mọng tự nhiên',
    qualityNote: 'Đều màu đỏ cam không vết thâm dập quả',
    leadTimeNote: 'Đặt trước 48 giờ',
    minimumOrderNote: 'MOQ: 20 kg',
    status: 'active',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  }
]

function SuppliersPageContent() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [capabilities, setCapabilities] = useState<SupplierIngredientCapability[]>([])
  const [masterIngredients, setMasterIngredients] = useState<IngredientMaster[]>([])
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)

  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State: Supplier
  const [supplierForm, setSupplierForm] = useState({
    supplierCode: '',
    supplierName: '',
    supplierType: 'food_supplier' as SupplierType,
    status: 'prospect' as SupplierStatus,
    priority: 'medium' as SupplierPriority,
    contactName: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    website: '',
    taxCode: '',
    invoiceNote: '',
    deliveryNote: '',
    paymentTermNote: '',
    qualityNote: '',
    storageHandlingNote: '',
    categoryNote: '',
    internalNote: '',
    ownerName: '',
    lastContactDate: '',
    nextReviewDate: ''
  })

  // Form State: Supplier Capability
  const [capForm, setCapForm] = useState({
    ingredientMasterId: '',
    ingredientCategory: 'seafood',
    capabilityNote: '',
    qualityNote: '',
    leadTimeNote: '',
    minimumOrderNote: '',
    status: 'active' as SupplierCapabilityStatus
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [capErrors, setCapErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedSuppliers = localStorage.getItem('mvos_suppliers')
        const storedCapabilities = localStorage.getItem('mvos_supplier_capabilities')
        const storedMaster = localStorage.getItem('mvos_ingredients')

        let loadedSuppliers: Supplier[] = []
        let loadedCapabilities: SupplierIngredientCapability[] = []
        let loadedIngredients: IngredientMaster[] = []

        if (storedSuppliers) {
          loadedSuppliers = JSON.parse(storedSuppliers)
        } else {
          localStorage.setItem('mvos_suppliers', JSON.stringify(INITIAL_SUPPLIERS))
          loadedSuppliers = INITIAL_SUPPLIERS
        }
        setSuppliers(loadedSuppliers)

        if (storedCapabilities) {
          loadedCapabilities = JSON.parse(storedCapabilities)
        } else {
          localStorage.setItem('mvos_supplier_capabilities', JSON.stringify(INITIAL_CAPABILITIES))
          loadedCapabilities = INITIAL_CAPABILITIES
        }
        setCapabilities(loadedCapabilities)

        if (storedMaster) {
          loadedIngredients = JSON.parse(storedMaster)
          setMasterIngredients(loadedIngredients)
        }

        if (loadedSuppliers.length > 0) {
          setSelectedSupplier(loadedSuppliers[0])
        }

        setLoading(false)
      } catch {
        setError('Không thể tải danh mục nhà cung cấp.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (!supplierForm.supplierName.trim()) errs.supplierName = 'Tên nhà cung cấp là bắt buộc'
    if (!supplierForm.supplierType) errs.supplierType = 'Vui lòng chọn nhóm dịch vụ cung cấp'
    if (!supplierForm.status) errs.status = 'Vui lòng chọn trạng thái sử dụng'
    if (!supplierForm.priority) errs.priority = 'Vui lòng chọn mức độ ưu tiên'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newSupplier: Supplier = {
      id: `sup-${Date.now().toString().slice(-4)}`,
      supplierCode: supplierForm.supplierCode || null,
      supplierName: supplierForm.supplierName,
      supplierType: supplierForm.supplierType,
      status: supplierForm.status,
      priority: supplierForm.priority,
      contactName: supplierForm.contactName || null,
      contactRole: supplierForm.contactRole || null,
      contactEmail: supplierForm.contactEmail || null,
      contactPhone: supplierForm.contactPhone || null,
      address: supplierForm.address || null,
      website: supplierForm.website || null,
      taxCode: supplierForm.taxCode || null,
      invoiceNote: supplierForm.invoiceNote || null,
      deliveryNote: supplierForm.deliveryNote || null,
      paymentTermNote: supplierForm.paymentTermNote || null,
      qualityNote: supplierForm.qualityNote || null,
      storageHandlingNote: supplierForm.storageHandlingNote || null,
      categoryNote: supplierForm.categoryNote || null,
      internalNote: supplierForm.internalNote || null,
      ownerName: supplierForm.ownerName || 'Chưa gán',
      lastContactDate: supplierForm.lastContactDate || null,
      nextReviewDate: supplierForm.nextReviewDate || null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...suppliers, newSupplier]
    localStorage.setItem('mvos_suppliers', JSON.stringify(updated))
    setSuppliers(updated)
    setSelectedSupplier(newSupplier)

    // Reset Form
    setSupplierForm({
      supplierCode: '',
      supplierName: '',
      supplierType: 'food_supplier',
      status: 'prospect',
      priority: 'medium',
      contactName: '',
      contactRole: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      website: '',
      taxCode: '',
      invoiceNote: '',
      deliveryNote: '',
      paymentTermNote: '',
      qualityNote: '',
      storageHandlingNote: '',
      categoryNote: '',
      internalNote: '',
      ownerName: '',
      lastContactDate: '',
      nextReviewDate: ''
    })
  }

  const handleCreateCapability = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSupplier) return

    const errs: Record<string, string> = {}
    if (!capForm.ingredientMasterId && !capForm.ingredientCategory) {
      errs.ingredientMasterId = 'Vui lòng chọn một nguyên liệu hoặc nhóm nguyên liệu cung cấp'
    }

    if (Object.keys(errs).length > 0) {
      setCapErrors(errs)
      return
    }

    setCapErrors({})

    const newCap: SupplierIngredientCapability = {
      id: `cap-${Date.now().toString().slice(-4)}`,
      supplierId: selectedSupplier.id,
      ingredientMasterId: capForm.ingredientMasterId || null,
      ingredientCategory: capForm.ingredientCategory || null,
      capabilityNote: capForm.capabilityNote || null,
      qualityNote: capForm.qualityNote || null,
      leadTimeNote: capForm.leadTimeNote || null,
      minimumOrderNote: capForm.minimumOrderNote || null,
      status: capForm.status,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [...capabilities, newCap]
    localStorage.setItem('mvos_supplier_capabilities', JSON.stringify(updated))
    setCapabilities(updated)

    setCapForm({
      ingredientMasterId: '',
      ingredientCategory: 'seafood',
      capabilityNote: '',
      qualityNote: '',
      leadTimeNote: '',
      minimumOrderNote: '',
      status: 'active'
    })
  }

  const handleUpdateStatus = (supplierId: string, nextStatus: SupplierStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = suppliers.map((s) => {
      if (s.id === supplierId) {
        const updatedItem = { ...s, status: nextStatus, updatedAt: nowStr }
        if (selectedSupplier?.id === supplierId) setSelectedSupplier(updatedItem)
        return updatedItem
      }
      return s
    })
    localStorage.setItem('mvos_suppliers', JSON.stringify(updated))
    setSuppliers(updated)
  }

  const handleUpdateCapabilityStatus = (capId: string, nextStatus: SupplierCapabilityStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = capabilities.map((c) => {
      if (c.id === capId) {
        return { ...c, status: nextStatus, updatedAt: nowStr }
      }
      return c
    })
    localStorage.setItem('mvos_supplier_capabilities', JSON.stringify(updated))
    setCapabilities(updated)
  }

  const getSupplierTypeLabel = (t: SupplierType) => {
    switch (t) {
      case 'food_supplier': return 'Nhà cung cấp thực phẩm'
      case 'beverage_supplier': return 'Nhà cung cấp đồ uống'
      case 'wine_supplier': return 'Nhà cung cấp rượu vang'
      case 'seafood_supplier': return 'Nhà cung cấp hải sản'
      case 'meat_supplier': return 'Nhà cung cấp thịt'
      case 'vegetable_supplier': return 'Nhà cung cấp rau củ'
      case 'dairy_supplier': return 'Nhà cung cấp sữa/phô mai'
      case 'dry_goods_supplier': return 'Nhà cung cấp hàng khô'
      case 'bakery_supplier': return 'Nhà cung cấp bánh ngọt'
      case 'equipment_supplier': return 'Nhà cung cấp thiết bị BOH'
      case 'cleaning_supplier': return 'Nhà cung cấp vệ sinh'
      case 'service_provider': return 'Nhà cung cấp dịch vụ'
      default: return 'Khác'
    }
  }

  const getSupplierStatusLabel = (s: SupplierStatus) => {
    switch (s) {
      case 'prospect': return 'Tiềm năng'
      case 'active': return 'Đang sử dụng'
      case 'paused': return 'Tạm dừng'
      case 'inactive': return 'Không hoạt động'
      case 'blocked': return 'Không sử dụng'
      case 'archived': return 'Lưu trữ'
      default: return s
    }
  }

  const getSupplierStatusClass = (s: SupplierStatus) => {
    switch (s) {
      case 'active': return 'bg-green-500/10 border border-green-500/25 text-green-500 font-bold'
      case 'prospect': return 'bg-blue-500/10 border border-blue-500/25 text-blue-400 font-bold'
      case 'paused': return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'blocked': return 'bg-red-500/10 border border-red-500/25 text-red-500'
      default: return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getPriorityLabel = (p: SupplierPriority) => {
    switch (p) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'strategic': return 'Nhà cung ứng Chiến lược'
      default: return p
    }
  }

  const getPriorityClass = (p: SupplierPriority) => {
    switch (p) {
      case 'strategic': return 'text-purple-400 font-bold'
      case 'high': return 'text-gold font-semibold'
      case 'medium': return 'text-foreground/80'
      default: return 'text-foreground/50'
    }
  }

  const getIngredientMasterName = (masterId: string | null | undefined) => {
    if (!masterId) return 'Tất cả nguyên liệu'
    const found = masterIngredients.find(m => m.id === masterId)
    return found ? found.ingredientNameVi : masterId
  }

  const getCategoryLabel = (cat: string | null | undefined) => {
    if (!cat) return 'Khác'
    switch (cat) {
      case 'seafood': return 'Hải sản'
      case 'vegetable': return 'Rau củ'
      case 'protein': return 'Đạm/thịt'
      case 'dairy': return 'Sữa/phô mai'
      case 'dry_goods': return 'Hàng khô'
      case 'spice': return 'Gia vị'
      default: return cat
    }
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải danh mục nhà cung cấp…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải danh mục nhà cung cấp.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Real data metrics
  const totalCount = suppliers.length
  const activeCount = suppliers.filter(s => s.status === 'active').length
  const strategicCount = suppliers.filter(s => s.priority === 'strategic').length
  const totalCapabilitiesCount = capabilities.length

  const selectedSupplierCapabilities = selectedSupplier
    ? capabilities.filter(cap => cap.supplierId === selectedSupplier.id || cap.supplierId === selectedSupplier.supplierCode)
    : []

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🤝 Danh mục nhà cung cấp (Supplier Master)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Quản lý thông tin nhà cung cấp, liên hệ, nhóm hàng, ghi chú giao hàng và năng lực cung ứng để chuẩn bị cho purchasing, inventory và food cost sau này.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng nhà cung cấp</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang sử dụng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{activeCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Nhà cung ứng chiến lược</span>
          <span className="text-2xl font-serif-cormorant font-bold text-purple-400 mt-1 block">{strategicCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Năng lực cung ứng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCapabilitiesCount}</span>
        </div>
      </div>

      {/* Workspace Grid */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: Suppliers list & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Mã</th>
                    <th className="py-3 px-4">Tên nhà cung cấp</th>
                    <th className="py-3 px-4">Loại hình cung ứng</th>
                    <th className="py-3 px-4 text-center">Trạng thái</th>
                    <th className="py-3 px-4">Độ ưu tiên</th>
                    <th className="py-3 px-4">Người liên hệ</th>
                    <th className="py-3 px-4">Điện thoại</th>
                    <th className="py-3 px-4">Đánh giá kế tiếp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {suppliers.length > 0 ? (
                    suppliers.map((s) => (
                      <tr
                        key={s.id}
                        onClick={() => setSelectedSupplier(s)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedSupplier?.id === s.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{s.supplierCode || '-'}</td>
                        <td className="py-3.5 px-4 font-bold text-foreground">{s.supplierName}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">{getSupplierTypeLabel(s.supplierType)}</td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getSupplierStatusClass(s.status)}`}>
                            {getSupplierStatusLabel(s.status)}
                          </span>
                        </td>
                        <td className={`py-3.5 px-4 font-mono text-[9px] ${getPriorityClass(s.priority)}`}>
                          {getPriorityLabel(s.priority)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75">{s.contactName || '-'}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold">{s.contactPhone || '-'}</td>
                        <td className="py-3.5 px-4 font-mono text-foreground/50">{s.nextReviewDate || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có nhà cung cấp nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form: Supplier */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Đăng ký nhà cung cấp mới
            </h3>

            <form onSubmit={handleCreateSupplier} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên nhà cung cấp *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Công ty Cổ phần Thực phẩm Sạch..."
                    value={supplierForm.supplierName}
                    onChange={(e) => setSupplierForm({ ...supplierForm, supplierName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.supplierName && <span className="text-[10px] text-red-400 italic">{validationErrors.supplierName}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã nhà cung cấp</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: SUP-HAIPHONG-FOOD..."
                    value={supplierForm.supplierCode}
                    onChange={(e) => setSupplierForm({ ...supplierForm, supplierCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Loại hình cung ứng *</label>
                  <select
                    value={supplierForm.supplierType}
                    onChange={(e) => setSupplierForm({ ...supplierForm, supplierType: e.target.value as SupplierType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="food_supplier">Nhà cung cấp thực phẩm chung</option>
                    <option value="seafood_supplier">Nhà cung cấp hải sản sống</option>
                    <option value="meat_supplier">Nhà cung cấp các loại thịt</option>
                    <option value="vegetable_supplier">Nhà cung cấp rau củ quả sạch</option>
                    <option value="dairy_supplier">Nhà cung cấp bơ sữa phô mai</option>
                    <option value="wine_supplier">Nhà phân phối rượu vang nhập khẩu</option>
                    <option value="dry_goods_supplier">Nhà cung cấp gia vị & đồ khô</option>
                    <option value="equipment_supplier">Nhà cung cấp thiết bị BOH</option>
                    <option value="cleaning_supplier">Nhà cung cấp thiết bị vệ sinh</option>
                    <option value="other">Nhà cung ứng dịch vụ khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mức độ ưu tiên *</label>
                  <select
                    value={supplierForm.priority}
                    onChange={(e) => setSupplierForm({ ...supplierForm, priority: e.target.value as SupplierPriority })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="low">Thấp (Low)</option>
                    <option value="medium">Trung bình (Medium)</option>
                    <option value="high">Cao (High)</option>
                    <option value="strategic">Đối tác cung ứng Chiến lược</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái quan hệ *</label>
                  <select
                    value={supplierForm.status}
                    onChange={(e) => setSupplierForm({ ...supplierForm, status: e.target.value as SupplierStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="prospect">Tiềm năng (Prospect)</option>
                    <option value="active">Đang giao dịch sử dụng (Active)</option>
                    <option value="paused">Tạm dừng lấy hàng (Paused)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Tên người liên hệ</label>
                  <input
                    type="text"
                    placeholder="Mr. Phạm Văn Hải..."
                    value={supplierForm.contactName}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Chức vụ liên hệ</label>
                  <input
                    type="text"
                    placeholder="Giám đốc kinh doanh..."
                    value={supplierForm.contactRole}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactRole: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono font-mono">Điện thoại liên hệ</label>
                  <input
                    type="text"
                    placeholder="0912-345-678..."
                    value={supplierForm.contactPhone}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactPhone: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Email liên hệ</label>
                  <input
                    type="email"
                    placeholder="email@company.vn..."
                    value={supplierForm.contactEmail}
                    onChange={(e) => setSupplierForm({ ...supplierForm, contactEmail: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] text-foreground/60 font-mono">Địa chỉ nhà xưởng / văn phòng</label>
                  <input
                    type="text"
                    placeholder="Số nhà, tên đường, tỉnh thành..."
                    value={supplierForm.address}
                    onChange={(e) => setSupplierForm({ ...supplierForm, address: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Mã số thuế doanh nghiệp</label>
                  <input
                    type="text"
                    placeholder="Tax code..."
                    value={supplierForm.taxCode}
                    onChange={(e) => setSupplierForm({ ...supplierForm, taxCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú giao nhận hàng (Delivery notes)</label>
                  <textarea
                    rows={2}
                    placeholder="Giao bằng xe đông lạnh trước 6h sáng, hạ hàng tại cửa sau bếp..."
                    value={supplierForm.deliveryNote}
                    onChange={(e) => setSupplierForm({ ...supplierForm, deliveryNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú hóa đơn & chứng từ (Invoicing)</label>
                  <textarea
                    rows={2}
                    placeholder="Xuất hóa đơn VAT điện tử từng chuyến giao hoặc gộp cuối tháng..."
                    value={supplierForm.invoiceNote}
                    onChange={(e) => setSupplierForm({ ...supplierForm, invoiceNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Quy chuẩn kiểm soát chất lượng (QA notes)</label>
                  <textarea
                    rows={2}
                    placeholder="Nhiệt độ xe giao cá hồi không quá 4 độ C, cá hồiNa Uy nguyên vẹn..."
                    value={supplierForm.qualityNote}
                    onChange={(e) => setSupplierForm({ ...supplierForm, qualityNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Thời hạn & Điều khoản thanh toán (Terms)</label>
                  <textarea
                    rows={2}
                    placeholder="Gối đầu 30 ngày kể từ khi nhận đủ hóa đơn tài chính..."
                    value={supplierForm.paymentTermNote}
                    onChange={(e) => setSupplierForm({ ...supplierForm, paymentTermNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Nhân sự phụ trách review *</label>
                  <input
                    type="text"
                    placeholder="Tên Chef phụ trách kiểm soát..."
                    value={supplierForm.ownerName}
                    onChange={(e) => setSupplierForm({ ...supplierForm, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ngày liên hệ gần nhất</label>
                  <input
                    type="date"
                    value={supplierForm.lastContactDate}
                    onChange={(e) => setSupplierForm({ ...supplierForm, lastContactDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Đánh giá năng lực kế tiếp</label>
                  <input
                    type="date"
                    value={supplierForm.nextReviewDate}
                    onChange={(e) => setSupplierForm({ ...supplierForm, nextReviewDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Ghi chú nhóm hàng cung cấp chính</label>
                <input
                  type="text"
                  placeholder="Hải sản nhập khẩu, rau sạch VietGAP..."
                  value={supplierForm.categoryNote}
                  onChange={(e) => setSupplierForm({ ...supplierForm, categoryNote: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Đăng ký nhà cung cấp
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Supplier Details & Mapped Capabilities */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết nhà cung cấp
            </h3>

            {selectedSupplier ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedSupplier.supplierName}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Mã: {selectedSupplier.supplierCode || selectedSupplier.id}</span>
                    <span>Loại: {getSupplierTypeLabel(selectedSupplier.supplierType)}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Liên hệ chính</span>
                    <span className="font-bold text-foreground/80 block">{selectedSupplier.contactName || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Điện thoại</span>
                    <span className="font-bold text-gold block font-mono">{selectedSupplier.contactPhone || '-'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái quan hệ</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getSupplierStatusClass(selectedSupplier.status)}`}>
                      {getSupplierStatusLabel(selectedSupplier.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mức độ ưu tiên</span>
                    <span className={`font-bold block ${getPriorityClass(selectedSupplier.priority)}`}>
                      {getPriorityLabel(selectedSupplier.priority)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mã số thuế VAT</span>
                    <span className="font-bold text-foreground/80 block font-mono">{selectedSupplier.taxCode || 'Chưa gán MST'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Email liên hệ</span>
                    <span className="font-bold text-foreground/80 block truncate font-mono" title={selectedSupplier.contactEmail || ''}>
                      {selectedSupplier.contactEmail || '-'}
                    </span>
                  </div>
                </div>

                {selectedSupplier.address && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Địa chỉ giao dịch</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedSupplier.address}</p>
                  </div>
                )}

                {selectedSupplier.deliveryNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú giao nhận hàng (Logistics)</span>
                    <p className="text-foreground/85 italic leading-relaxed font-sans">&ldquo;{selectedSupplier.deliveryNote}&rdquo;</p>
                  </div>
                )}

                {selectedSupplier.invoiceNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ghi chú hóa đơn chứng từ</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedSupplier.invoiceNote}</p>
                  </div>
                )}

                {selectedSupplier.paymentTermNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Điều khoản công nợ thanh toán</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedSupplier.paymentTermNote}</p>
                  </div>
                )}

                {selectedSupplier.qualityNote && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Quy chuẩn chất lượng QA BOH</span>
                    <p className="text-foreground/80 leading-relaxed font-sans">{selectedSupplier.qualityNote}</p>
                  </div>
                )}

                {/* Capabilities Section */}
                <div className="border-t border-gold-border/20 pt-4 space-y-3">
                  <span className="text-[10px] text-gold font-serif-cormorant font-bold uppercase tracking-wider block">🥗 Năng lực cung ứng mặt hàng</span>
                  
                  {selectedSupplierCapabilities.length > 0 ? (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {selectedSupplierCapabilities.map((cap) => (
                        <div key={cap.id} className="p-2 bg-background/40 rounded border border-gold-border/10 space-y-1 text-[10px]">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-foreground">
                                {getIngredientMasterName(cap.ingredientMasterId)}
                              </span>
                              <span className="text-[8px] text-gold-hover font-mono block mt-0.5">Category: {getCategoryLabel(cap.ingredientCategory)}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleUpdateCapabilityStatus(cap.id, cap.status === 'active' ? 'paused' : 'active')}
                              className={`rounded px-1.5 py-0.5 text-[8px] font-bold ${cap.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'}`}
                            >
                              {cap.status === 'active' ? 'Đang áp dụng' : 'Tạm dừng'}
                            </button>
                          </div>
                          {cap.capabilityNote && <div className="text-foreground/80"><span className="font-semibold text-foreground/50">Mô tả:</span> {cap.capabilityNote}</div>}
                          <div className="grid gap-1 grid-cols-2 text-[8px] text-foreground/50 font-mono pt-1">
                            <div>MOQ: {cap.minimumOrderNote || '-'}</div>
                            <div>Lead time: {cap.leadTimeNote || '-'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[9px] text-foreground/45 italic">Chưa có năng lực cung ứng nào được đăng ký.</p>
                  )}

                  {/* Add Capability Form */}
                  <form onSubmit={handleCreateCapability} className="bg-gold-muted/5 border border-gold-border/10 p-3 rounded space-y-2 mt-2">
                    <span className="text-[9px] text-gold font-bold block">➕ Đăng ký năng lực cung ứng mới</span>
                    
                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Nguyên liệu chuẩn</label>
                      <select
                        value={capForm.ingredientMasterId}
                        onChange={(e) => setCapForm({ ...capForm, ingredientMasterId: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      >
                        <option value="">-- Tất cả nguyên liệu / Theo nhóm --</option>
                        {masterIngredients.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.ingredientNameVi} ({m.defaultUnit})
                          </option>
                        ))}
                      </select>
                      {capErrors.ingredientMasterId && <span className="text-[8px] text-red-400 italic">{capErrors.ingredientMasterId}</span>}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Nhóm nguyên liệu chính</label>
                      <select
                        value={capForm.ingredientCategory}
                        onChange={(e) => setCapForm({ ...capForm, ingredientCategory: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      >
                        <option value="seafood">Hải sản (Seafood)</option>
                        <option value="vegetable">Rau củ quả (Vegetable)</option>
                        <option value="protein">Đạm / các loại thịt</option>
                        <option value="dairy">Bơ sữa phô mai</option>
                        <option value="dry_goods">Đồ khô & Gia vị</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Chi tiết năng lực cung cấp</label>
                      <input
                        type="text"
                        placeholder="Tôm hùm bọc đá Na Uy sống..."
                        value={capForm.capabilityNote}
                        onChange={(e) => setCapForm({ ...capForm, capabilityNote: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      />
                    </div>

                    <div className="grid gap-2 grid-cols-2">
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Lead time giao hàng</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: Đặt trước 24h..."
                          value={capForm.leadTimeNote}
                          onChange={(e) => setCapForm({ ...capForm, leadTimeNote: e.target.value })}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <label className="text-[8px] text-foreground/50">Yêu cầu MOQ tối thiểu</label>
                        <input
                          type="text"
                          placeholder="Ví dụ: MOQ: 10kg..."
                          value={capForm.minimumOrderNote}
                          onChange={(e) => setCapForm({ ...capForm, minimumOrderNote: e.target.value })}
                          className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <label className="text-[8px] text-foreground/50">Quy chuẩn chất lượng QA BOH</label>
                      <input
                        type="text"
                        placeholder="Nguyên vẹn không đứt râu, thịt săn..."
                        value={capForm.qualityNote}
                        onChange={(e) => setCapForm({ ...capForm, qualityNote: e.target.value })}
                        className="rounded border border-gold-border/20 bg-background/50 px-2 py-1 text-[10px] focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded bg-gold/90 hover:bg-gold text-background py-1 text-[10px] font-bold transition-all"
                    >
                      Đăng ký năng lực cung ứng
                    </button>
                  </form>
                </div>

                {/* State Actions for Supplier */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái nhà cung cấp</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedSupplier.id, 'active')}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Áp dụng sử dụng
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedSupplier.id, 'paused')}
                      className="rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-center text-[10px] text-yellow-500 hover:bg-yellow-500/10 transition-all font-semibold"
                    >
                      Tạm dừng lấy hàng
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedSupplier.id, 'inactive')}
                      className="rounded border border-foreground/30 hover:border-foreground/60 px-2 py-1.5 text-center text-[10px] text-foreground/60 hover:bg-foreground/5 transition-all font-semibold"
                    >
                      Không hoạt động
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedSupplier.id, 'archived')}
                      className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                    >
                      Lưu trữ nhà cung cấp
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một nhà cung cấp từ danh sách để xem thông tin chi tiết.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SuppliersPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải danh mục nhà cung cấp…</p>
      </div>
    }>
      <SuppliersPageContent />
    </Suspense>
  )
}
