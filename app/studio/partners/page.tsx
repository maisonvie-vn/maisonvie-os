'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'

export type TravelAgencyPartnerType =
  | "travel_agency"
  | "tour_operator"
  | "dmc"
  | "corporate_client"
  | "hotel_concierge"
  | "event_planner"
  | "other"

export type TravelAgencyMarket =
  | "japan"
  | "korea"
  | "europe"
  | "france"
  | "usa"
  | "australia"
  | "vietnam"
  | "southeast_asia"
  | "global"
  | "other"

export type TravelAgencyPartnerStatus =
  | "prospect"
  | "active"
  | "inactive"
  | "paused"
  | "blacklisted"
  | "archived"

export type TravelAgencyPartnerPriority =
  | "low"
  | "medium"
  | "high"
  | "strategic"

export type TravelAgencyPreferredLanguage =
  | "vietnamese"
  | "english"
  | "japanese"
  | "korean"
  | "french"
  | "chinese"
  | "other"

export interface TravelAgencyPartner {
  id: string
  partnerName: string
  partnerCode?: string | null
  partnerType: TravelAgencyPartnerType
  market: TravelAgencyMarket
  status: TravelAgencyPartnerStatus
  priority: TravelAgencyPartnerPriority
  contactName?: string | null
  contactRole?: string | null
  contactEmail?: string | null
  contactPhone?: string | null
  preferredLanguage?: TravelAgencyPreferredLanguage | null
  address?: string | null
  website?: string | null
  bookingPolicyNote?: string | null
  menuPolicyNote?: string | null
  paymentPolicyNote?: string | null
  vatPolicyNote?: string | null
  focPolicyNote?: string | null
  surchargePolicyNote?: string | null
  allergyPolicyNote?: string | null
  internalNote?: string | null
  ownerName?: string | null
  lastContactDate?: string | null
  nextFollowUpDate?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

const INITIAL_PARTNERS: TravelAgencyPartner[] = [
  {
    id: 'partner-101',
    partnerName: 'Saigontourist Group',
    partnerCode: 'SG-001',
    partnerType: 'travel_agency',
    market: 'europe',
    status: 'active',
    priority: 'strategic',
    contactName: 'Ms. Nguyễn Anh',
    contactRole: 'Inbound Operations Manager',
    contactEmail: 'anh.nguyen@saigontourist.com',
    contactPhone: '0909123456',
    preferredLanguage: 'english',
    address: '45 Lê Lợi, Quận 1, TP. HCM',
    website: 'www.saigontourist.net',
    bookingPolicyNote: 'Cần xác nhận danh sách khách ít nhất 48h trước giờ dùng bữa.',
    menuPolicyNote: 'Set menu Âu cổ điển hoặc set menu Việt truyền thống cao cấp.',
    paymentPolicyNote: 'Thanh toán trả sau bằng chuyển khoản ngân hàng trong vòng 15 ngày.',
    vatPolicyNote: 'Giá đã bao gồm VAT 10%. Xuất hóa đơn đỏ trực tiếp.',
    focPolicyNote: 'FOC 1 hướng dẫn viên cho mỗi đoàn từ 15 pax trở lên.',
    surchargePolicyNote: 'Phụ thu lễ tết 15%.',
    allergyPolicyNote: 'Thông báo chi tiết khách ăn kiêng/dị ứng hải sản/ăn chay 24h trước.',
    internalNote: 'Đối tác lâu năm cực kỳ quan trọng, luôn dành chỗ phòng VIP sang trọng.',
    ownerName: 'Ms. Mai Lan (Account Lead)',
    lastContactDate: '2026-06-25',
    nextFollowUpDate: '2026-06-30',
    createdAt: '2026-06-25 10:00',
    updatedAt: '2026-06-25 10:00'
  }
]

function PartnersPageContent() {
  const [partners, setPartners] = useState<TravelAgencyPartner[]>([])
  const [selectedPartner, setSelectedPartner] = useState<TravelAgencyPartner | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [form, setForm] = useState({
    partnerName: '',
    partnerCode: '',
    partnerType: 'travel_agency' as TravelAgencyPartnerType,
    market: 'europe' as TravelAgencyMarket,
    status: 'prospect' as TravelAgencyPartnerStatus,
    priority: 'medium' as TravelAgencyPartnerPriority,
    contactName: '',
    contactRole: '',
    contactEmail: '',
    contactPhone: '',
    preferredLanguage: 'english' as TravelAgencyPreferredLanguage,
    address: '',
    website: '',
    bookingPolicyNote: '',
    menuPolicyNote: '',
    paymentPolicyNote: '',
    vatPolicyNote: '',
    focPolicyNote: '',
    surchargePolicyNote: '',
    allergyPolicyNote: '',
    internalNote: '',
    ownerName: '',
    lastContactDate: '2026-06-28',
    nextFollowUpDate: '2026-07-05'
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedPartners = localStorage.getItem('mvos_travel_agency_partners')
        let loaded: TravelAgencyPartner[] = []

        if (storedPartners) {
          loaded = JSON.parse(storedPartners)
        } else {
          localStorage.setItem('mvos_travel_agency_partners', JSON.stringify(INITIAL_PARTNERS))
          loaded = INITIAL_PARTNERS
        }
        setPartners(loaded)
        setLoading(false)
      } catch {
        setError('Không thể tải danh sách đối tác từ bộ nhớ.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleCreatePartner = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!form.partnerName.trim()) errs.partnerName = 'Vui lòng nhập tên đối tác'
    if (!form.partnerType) errs.partnerType = 'Vui lòng chọn loại đối tác'
    if (!form.market) errs.market = 'Vui lòng chọn thị trường'
    if (!form.status) errs.status = 'Vui lòng chọn trạng thái'
    if (!form.priority) errs.priority = 'Vui lòng chọn mức độ ưu tiên'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newPartner: TravelAgencyPartner = {
      id: `partner-${Date.now().toString().slice(-4)}`,
      partnerName: form.partnerName,
      partnerCode: form.partnerCode || `PART-${Date.now().toString().slice(-3)}`,
      partnerType: form.partnerType,
      market: form.market,
      status: form.status,
      priority: form.priority,
      contactName: form.contactName || null,
      contactRole: form.contactRole || null,
      contactEmail: form.contactEmail || null,
      contactPhone: form.contactPhone || null,
      preferredLanguage: form.preferredLanguage || null,
      address: form.address || null,
      website: form.website || null,
      bookingPolicyNote: form.bookingPolicyNote || null,
      menuPolicyNote: form.menuPolicyNote || null,
      paymentPolicyNote: form.paymentPolicyNote || null,
      vatPolicyNote: form.vatPolicyNote || null,
      focPolicyNote: form.focPolicyNote || null,
      surchargePolicyNote: form.surchargePolicyNote || null,
      allergyPolicyNote: form.allergyPolicyNote || null,
      internalNote: form.internalNote || null,
      ownerName: form.ownerName || 'Chưa phân công',
      lastContactDate: form.lastContactDate || null,
      nextFollowUpDate: form.nextFollowUpDate || null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newPartner, ...partners]
    localStorage.setItem('mvos_travel_agency_partners', JSON.stringify(updated))
    setPartners(updated)
    setSelectedPartner(newPartner)

    // Reset Form
    setForm({
      partnerName: '',
      partnerCode: '',
      partnerType: 'travel_agency',
      market: 'europe',
      status: 'prospect',
      priority: 'medium',
      contactName: '',
      contactRole: '',
      contactEmail: '',
      contactPhone: '',
      preferredLanguage: 'english',
      address: '',
      website: '',
      bookingPolicyNote: '',
      menuPolicyNote: '',
      paymentPolicyNote: '',
      vatPolicyNote: '',
      focPolicyNote: '',
      surchargePolicyNote: '',
      allergyPolicyNote: '',
      internalNote: '',
      ownerName: '',
      lastContactDate: '2026-06-28',
      nextFollowUpDate: '2026-07-05'
    })
  }

  const handleUpdateStatus = (partnerId: string, nextStatus: TravelAgencyPartnerStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = partners.map((p) => {
      if (p.id === partnerId) {
        const updatedP = {
          ...p,
          status: nextStatus,
          updatedAt: nowStr
        }
        if (selectedPartner?.id === partnerId) setSelectedPartner(updatedP)
        return updatedP
      }
      return p
    })
    localStorage.setItem('mvos_travel_agency_partners', JSON.stringify(updated))
    setPartners(updated)
  }

  const getPartnerTypeLabel = (tp: TravelAgencyPartnerType) => {
    switch (tp) {
      case 'travel_agency': return 'Công ty lữ hành'
      case 'tour_operator': return 'Tour operator'
      case 'dmc': return 'DMC'
      case 'corporate_client': return 'Khách corporate'
      case 'hotel_concierge': return 'Concierge khách sạn'
      case 'event_planner': return 'Đơn vị tổ chức sự kiện'
      default: return 'Khác'
    }
  }

  const getMarketLabel = (mkt: TravelAgencyMarket) => {
    switch (mkt) {
      case 'japan': return 'Nhật Bản'
      case 'korea': return 'Hàn Quốc'
      case 'europe': return 'Châu Âu'
      case 'france': return 'Pháp'
      case 'usa': return 'Mỹ'
      case 'australia': return 'Úc'
      case 'vietnam': return 'Việt Nam'
      case 'southeast_asia': return 'Đông Nam Á'
      case 'global': return 'Quốc tế'
      default: return 'Khác'
    }
  }

  const getStatusLabel = (st: TravelAgencyPartnerStatus) => {
    switch (st) {
      case 'prospect': return 'Tiềm năng'
      case 'active': return 'Đang hợp tác'
      case 'inactive': return 'Không hoạt động'
      case 'paused': return 'Tạm dừng'
      case 'blacklisted': return 'Không tiếp nhận'
      case 'archived': return 'Lưu trữ'
      default: return st
    }
  }

  const getStatusClass = (st: TravelAgencyPartnerStatus) => {
    switch (st) {
      case 'active':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'paused':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'prospect':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-400'
      case 'blacklisted':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getPriorityLabel = (pr: TravelAgencyPartnerPriority) => {
    switch (pr) {
      case 'low': return 'Thấp'
      case 'medium': return 'Trung bình'
      case 'high': return 'Cao'
      case 'strategic': return 'Chiến lược'
      default: return pr
    }
  }

  const getPriorityClass = (pr: TravelAgencyPartnerPriority) => {
    switch (pr) {
      case 'strategic':
        return 'text-red-500 font-bold border border-red-500/35 bg-red-500/5 px-1.5 py-0.2 rounded text-[9px]'
      case 'high':
        return 'text-orange-400 font-semibold border border-orange-500/25 bg-orange-500/5 px-1.5 py-0.2 rounded text-[9px]'
      case 'medium':
        return 'text-yellow-500 border border-yellow-500/25 bg-yellow-500/5 px-1.5 py-0.2 rounded text-[9px]'
      default:
        return 'text-foreground/50 border border-foreground/15 px-1.5 py-0.2 rounded text-[9px]'
    }
  }

  const getPreferredLanguageLabel = (l: TravelAgencyPreferredLanguage) => {
    switch (l) {
      case 'vietnamese': return 'Tiếng Việt'
      case 'english': return 'Tiếng Anh'
      case 'japanese': return 'Tiếng Nhật'
      case 'korean': return 'Tiếng Hàn'
      case 'french': return 'Tiếng Pháp'
      case 'chinese': return 'Tiếng Trung'
      default: return 'Khác'
    }
  }

  // Calculate Metrics
  const totalCount = partners.length
  const activeCount = partners.filter(p => p.status === 'active').length
  const strategicCount = partners.filter(p => p.priority === 'strategic').length
  const prospectCount = partners.filter(p => p.status === 'prospect').length
  
  // Follow-up required today (2026-06-28)
  const followUpRequiredCount = partners.filter(p => {
    if (p.status === 'archived' || p.status === 'inactive') return false
    if (!p.nextFollowUpDate) return false
    return new Date(p.nextFollowUpDate) <= new Date('2026-06-28')
  }).length

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải đối tác lữ hành…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải đối tác lữ hành.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🤝 Đối tác lữ hành (Travel Agency Partner Database)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Quản lý thông tin công ty lữ hành, tour operator và đối tác đặt đoàn của Maison Vie.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng đối tác</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang hợp tác</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{activeCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đối tác chiến lược</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-400 mt-1 block">{strategicCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cần follow-up</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{followUpRequiredCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tiềm năng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{prospectCount}</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Partners Listing & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Tên đối tác</th>
                    <th className="py-3 px-4">Loại đối tác</th>
                    <th className="py-3 px-4">Thị trường</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Ưu tiên</th>
                    <th className="py-3 px-4">Liên hệ chính</th>
                    <th className="py-3 px-4">Ngôn ngữ</th>
                    <th className="py-3 px-4">Follow-up tiếp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {partners.length > 0 ? (
                    partners.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => setSelectedPartner(p)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedPartner?.id === p.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-bold text-foreground truncate max-w-[150px]" title={p.partnerName}>
                          {p.partnerName}
                          <span className="text-[9px] text-gold font-mono block mt-0.5">{p.partnerCode || p.id}</span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/85">{getPartnerTypeLabel(p.partnerType)}</td>
                        <td className="py-3.5 px-4 font-semibold text-gold-hover">{getMarketLabel(p.market)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(p.status)}`}>
                            {getStatusLabel(p.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={getPriorityClass(p.priority)}>{getPriorityLabel(p.priority)}</span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-foreground/75 truncate max-w-[120px]" title={p.contactName || ''}>
                          {p.contactName || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-foreground/60">{p.preferredLanguage ? getPreferredLanguageLabel(p.preferredLanguage) : '-'}</td>
                        <td className="py-3.5 px-4 font-mono font-semibold text-foreground/75">{p.nextFollowUpDate || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có đối tác lữ hành nào được ghi nhận.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Creation Form */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tiếp nhận đối tác lữ hành mới
            </h3>

            <form onSubmit={handleCreatePartner} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên đối tác *</label>
                  <input
                    type="text"
                    placeholder="Tên công ty lữ hành..."
                    value={form.partnerName}
                    onChange={(e) => setForm({ ...form, partnerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.partnerName && <span className="text-[10px] text-red-400 italic">{validationErrors.partnerName}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã đối tác (Code)</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: SG-001..."
                    value={form.partnerCode}
                    onChange={(e) => setForm({ ...form, partnerCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Phân loại đối tác *</label>
                  <select
                    value={form.partnerType}
                    onChange={(e) => setForm({ ...form, partnerType: e.target.value as TravelAgencyPartnerType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="travel_agency">Công ty lữ hành (Travel Agency)</option>
                    <option value="tour_operator">Tour Operator</option>
                    <option value="dmc">DMC (Destination Management Company)</option>
                    <option value="corporate_client">Khách corporate (Doanh nghiệp)</option>
                    <option value="hotel_concierge">Concierge khách sạn</option>
                    <option value="event_planner">Đơn vị tổ chức sự kiện</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Thị trường khách *</label>
                  <select
                    value={form.market}
                    onChange={(e) => setForm({ ...form, market: e.target.value as TravelAgencyMarket })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="vietnam">Việt Nam</option>
                    <option value="japan">Nhật Bản</option>
                    <option value="korea">Hàn Quốc</option>
                    <option value="europe">Châu Âu</option>
                    <option value="france">Pháp</option>
                    <option value="usa">Mỹ</option>
                    <option value="australia">Úc</option>
                    <option value="southeast_asia">Đông Nam Á</option>
                    <option value="global">Quốc tế / Toàn cầu</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngôn ngữ ưu tiên</label>
                  <select
                    value={form.preferredLanguage}
                    onChange={(e) => setForm({ ...form, preferredLanguage: e.target.value as TravelAgencyPreferredLanguage })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="vietnamese">Tiếng Việt</option>
                    <option value="english">Tiếng Anh</option>
                    <option value="japanese">Tiếng Nhật</option>
                    <option value="korean">Tiếng Hàn</option>
                    <option value="french">Tiếng Pháp</option>
                    <option value="chinese">Tiếng Trung</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái hợp tác *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as TravelAgencyPartnerStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="prospect">Tiềm năng</option>
                    <option value="active">Đang hợp tác (Active)</option>
                    <option value="paused">Tạm dừng (Paused)</option>
                    <option value="inactive">Không hoạt động (Inactive)</option>
                    <option value="blacklisted">Không tiếp nhận (Blacklisted)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mức ưu tiên *</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as TravelAgencyPartnerPriority })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="low">Thấp</option>
                    <option value="medium">Trung bình</option>
                    <option value="high">Cao</option>
                    <option value="strategic">Chiến lược (Strategic)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Người đại diện liên hệ</label>
                  <input
                    type="text"
                    placeholder="Tên liên hệ chính..."
                    value={form.contactName}
                    onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Chức vụ / Vai trò</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Sale Executive..."
                    value={form.contactRole}
                    onChange={(e) => setForm({ ...form, contactRole: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Số điện thoại liên hệ</label>
                  <input
                    type="text"
                    placeholder="090..."
                    value={form.contactPhone}
                    onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Email liên hệ chính</label>
                  <input
                    type="email"
                    placeholder="partner@saigontourist.com..."
                    value={form.contactEmail}
                    onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Website doanh nghiệp</label>
                  <input
                    type="text"
                    placeholder="www.saigontourist.net..."
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Địa chỉ trụ sở</label>
                <input
                  type="text"
                  placeholder="Số nhà, đường, quận/huyện, tỉnh/thành..."
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày liên hệ gần nhất</label>
                  <input
                    type="date"
                    value={form.lastContactDate}
                    onChange={(e) => setForm({ ...form, lastContactDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold text-gold">Ngày follow-up tiếp theo</label>
                  <input
                    type="date"
                    value={form.nextFollowUpDate}
                    onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>
              </div>

              {/* Policy notes (Text only, no calculations) */}
              <div className="border-t border-gold-border/25 pt-4 space-y-3">
                <h4 className="font-serif-cormorant font-bold text-gold text-sm">📜 Quy tắc / Chính sách đặc thù (Ghi chú text)</h4>
                
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Chính sách đặt đoàn</label>
                    <textarea
                      rows={2}
                      placeholder="Thời gian chốt cọc, hủy đoàn..."
                      value={form.bookingPolicyNote}
                      onChange={(e) => setForm({ ...form, bookingPolicyNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Chính sách thực đơn</label>
                    <textarea
                      rows={2}
                      placeholder="Lựa chọn menu và định dạng set ăn..."
                      value={form.menuPolicyNote}
                      onChange={(e) => setForm({ ...form, menuPolicyNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Chính sách thanh toán</label>
                    <textarea
                      rows={2}
                      placeholder="Phương thức chuyển khoản, công nợ..."
                      value={form.paymentPolicyNote}
                      onChange={(e) => setForm({ ...form, paymentPolicyNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Chính sách VAT</label>
                    <textarea
                      rows={2}
                      placeholder="Xuất hóa đơn, phí dịch vụ..."
                      value={form.vatPolicyNote}
                      onChange={(e) => setForm({ ...form, vatPolicyNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Chính sách FOC (Free of Charge)</label>
                    <textarea
                      rows={2}
                      placeholder="Chính sách hướng dẫn viên/trưởng đoàn..."
                      value={form.focPolicyNote}
                      onChange={(e) => setForm({ ...form, focPolicyNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Chính sách phụ thu</label>
                    <textarea
                      rows={2}
                      placeholder="Phụ thu phòng VIP, lễ tết, đêm muộn..."
                      value={form.surchargePolicyNote}
                      onChange={(e) => setForm({ ...form, surchargePolicyNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Chính sách dị ứng / Ăn kiêng</label>
                    <textarea
                      rows={2}
                      placeholder="Thông báo về dị ứng, ăn chay, halal..."
                      value={form.allergyPolicyNote}
                      onChange={(e) => setForm({ ...form, allergyPolicyNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] text-foreground/60 font-mono">Ghi chú nội bộ</label>
                    <textarea
                      rows={2}
                      placeholder="Báo cáo đánh giá hiệu năng đối tác..."
                      value={form.internalNote}
                      onChange={(e) => setForm({ ...form, internalNote: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold text-gold">Người phụ trách (Account Manager)</label>
                <input
                  type="text"
                  placeholder="Tên nhân viên Maison Vie làm đầu mối liên hệ..."
                  value={form.ownerName}
                  onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Lưu thông tin đối tác
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Action panel */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết đối tác
            </h3>

            {selectedPartner ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedPartner.partnerName}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Mã: {selectedPartner.partnerCode || selectedPartner.id}</span>
                    <span>Thị trường: {getMarketLabel(selectedPartner.market)}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Liên hệ chính</span>
                    <span className="font-bold text-foreground/80 block">{selectedPartner.contactName || '-'}</span>
                    {selectedPartner.contactRole && <span className="text-[10px] text-foreground/60 block">{selectedPartner.contactRole}</span>}
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Thông tin liên lạc</span>
                    {selectedPartner.contactPhone && <span className="text-foreground/80 block font-mono font-bold">{selectedPartner.contactPhone}</span>}
                    {selectedPartner.contactEmail && <span className="text-[10px] text-foreground/60 block">{selectedPartner.contactEmail}</span>}
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Mức ưu tiên</span>
                    <span className={getPriorityClass(selectedPartner.priority)}>{getPriorityLabel(selectedPartner.priority)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái hợp tác</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(selectedPartner.status)}`}>
                      {getStatusLabel(selectedPartner.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block font-bold text-gold">Người phụ trách</span>
                    <span className="font-bold text-foreground/85 block">{selectedPartner.ownerName || 'Chưa phân công'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ngôn ngữ giao tiếp</span>
                    <span className="font-semibold text-foreground/80 block">
                      {selectedPartner.preferredLanguage ? getPreferredLanguageLabel(selectedPartner.preferredLanguage) : '-'}
                    </span>
                  </div>
                </div>

                {selectedPartner.address && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Địa chỉ</span>
                    <p className="text-foreground/80 font-sans leading-normal">{selectedPartner.address}</p>
                  </div>
                )}

                {selectedPartner.website && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Website</span>
                    <a
                      href={`https://${selectedPartner.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold font-mono font-semibold hover:underline block truncate"
                    >
                      {selectedPartner.website}
                    </a>
                  </div>
                )}

                {/* Policies text only */}
                <div className="border-t border-gold-border/10 pt-3 space-y-2">
                  <span className="text-[10px] text-gold font-serif-cormorant font-bold block">📜 Điều khoản chính sách đối tác:</span>
                  
                  {selectedPartner.bookingPolicyNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Chính sách đặt đoàn:</span>
                      <p className="text-foreground/85 italic leading-relaxed">&ldquo;{selectedPartner.bookingPolicyNote}&rdquo;</p>
                    </div>
                  )}
                  {selectedPartner.menuPolicyNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Chính sách thực đơn:</span>
                      <p className="text-foreground/85 italic leading-relaxed">&ldquo;{selectedPartner.menuPolicyNote}&rdquo;</p>
                    </div>
                  )}
                  {selectedPartner.paymentPolicyNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Chính sách thanh toán:</span>
                      <p className="text-foreground/85 italic leading-relaxed">&ldquo;{selectedPartner.paymentPolicyNote}&rdquo;</p>
                    </div>
                  )}
                  {selectedPartner.focPolicyNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Chính sách FOC:</span>
                      <p className="text-foreground/85 italic leading-relaxed">&ldquo;{selectedPartner.focPolicyNote}&rdquo;</p>
                    </div>
                  )}
                  {selectedPartner.allergyPolicyNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Chính sách dị ứng / Ăn chay:</span>
                      <p className="text-foreground/85 italic leading-relaxed">&ldquo;{selectedPartner.allergyPolicyNote}&rdquo;</p>
                    </div>
                  )}
                </div>

                {selectedPartner.internalNote && (
                  <div className="p-3 border border-gold-border/20 bg-gold-muted/5 rounded-lg space-y-1">
                    <span className="text-[9px] text-gold font-mono block font-bold">Ghi chú nội bộ:</span>
                    <p className="text-foreground/85 leading-relaxed">{selectedPartner.internalNote}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 text-[9px] text-foreground/55 font-mono border-t border-gold-border/10 pt-3">
                  <div>Liên hệ gần nhất: {selectedPartner.lastContactDate || '-'}</div>
                  <div className="font-bold text-gold">Follow-up tiếp: {selectedPartner.nextFollowUpDate || '-'}</div>
                </div>

                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Hoạt động lữ hành & Sự kiện</span>
                  <div className="grid gap-2 grid-cols-2">
                    <Link
                      href={`/studio/tours?partner_id=${selectedPartner.id}`}
                      className="rounded border border-gold hover:border-gold-hover px-2 py-2 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block"
                    >
                      🚌 Xem đoàn đối tác
                    </Link>
                    <Link
                      href={`/studio/events?partner_id=${selectedPartner.id}`}
                      className="rounded border border-gold hover:border-gold-hover px-2 py-2 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold block"
                    >
                      🎉 Xem sự kiện đối tác
                    </Link>
                  </div>
                </div>

                {/* State Actions */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật đối tác</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedPartner.id, 'active')}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Đang hợp tác
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedPartner.id, 'paused')}
                      className="rounded border border-yellow-500/40 hover:border-yellow-500 px-2 py-1.5 text-center text-[10px] text-yellow-500 hover:bg-yellow-500/10 transition-all font-semibold"
                    >
                      Tạm dừng
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedPartner.id, 'inactive')}
                      className="rounded border border-foreground/30 hover:border-foreground px-2 py-1.5 text-center text-[10px] text-foreground/60 hover:bg-foreground/5 transition-all"
                    >
                      Không hoạt động
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedPartner.id, 'archived')}
                      className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Lưu trữ đối tác
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một đối tác từ danh sách để xem thông tin chi tiết và điều khoản chính sách.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PartnersPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải đối tác lữ hành…</p>
      </div>
    }>
      <PartnersPageContent />
    </Suspense>
  )
}
