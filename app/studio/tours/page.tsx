'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export type TourGroupMarket =
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

export type TourGroupBookingStatus =
  | "inquiry"
  | "tentative"
  | "confirmed"
  | "changed"
  | "cancelled"
  | "completed"
  | "archived"

export type TourGroupOperationStatus =
  | "not_ready"
  | "preparing"
  | "ready"
  | "in_service"
  | "completed"
  | "issue"

export interface TourGroupBooking {
  id: string
  agencyPartnerId?: string | null
  reservationId?: string | null
  tourCode?: string | null
  bookingReference?: string | null
  groupName: string
  market: TourGroupMarket
  guestCount: number
  confirmedGuestCount?: number | null
  arrivalDate: string
  arrivalTime: string
  departureTime?: string | null
  menuName?: string | null
  menuNote?: string | null
  allergyNote?: string | null
  specialRequestNote?: string | null
  guideName?: string | null
  guidePhone?: string | null
  leaderName?: string | null
  leaderPhone?: string | null
  floorTableNote?: string | null
  kitchenNote?: string | null
  serviceNote?: string | null
  status: TourGroupBookingStatus
  operationStatus: TourGroupOperationStatus
  ownerName?: string | null
  confirmedAt?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface TravelAgencyPartner {
  id: string
  partnerName: string
}

interface Reservation {
  id: string
  guestName: string
  bookingDate: string
}

const INITIAL_TOURS: TourGroupBooking[] = [
  {
    id: 'tour-201',
    agencyPartnerId: 'partner-101',
    reservationId: null,
    tourCode: 'SG-FR-2806',
    bookingReference: 'BK-991',
    groupName: 'Đoàn khách Saigontourist Pháp',
    market: 'france',
    guestCount: 22,
    confirmedGuestCount: 22,
    arrivalDate: '2026-06-28',
    arrivalTime: '11:30',
    departureTime: '13:30',
    menuName: 'Set Menu Âu Cổ Điển 1',
    menuNote: 'Đoàn có 2 khách ăn chay trường, 1 khách không ăn hải sản.',
    allergyNote: 'Dị ứng hải sản (1 pax), Ăn chay (2 pax)',
    specialRequestNote: 'Cần set phòng VIP lớn tầng 2, cờ Pháp trên bàn tiệc.',
    guideName: 'Mr. Jean-Pierre',
    guidePhone: '0912987654',
    leaderName: 'Ms. Sophie',
    leaderPhone: '0909555666',
    floorTableNote: 'Phòng VIP Napoleon, Tầng 2',
    kitchenNote: '2 phần súp nấm chay thay cho súp hải sản. 1 phần cá hồi áp chảo thay cho tôm hùm sốt bơ.',
    serviceNote: 'Phục vụ rượu vang trắng ướp lạnh sẵn khi đoàn đến.',
    status: 'confirmed',
    operationStatus: 'preparing',
    ownerName: 'Ms. Mai Lan (Account Lead)',
    confirmedAt: '2026-06-26 14:00',
    createdAt: '2026-06-26 10:00',
    updatedAt: '2026-06-28 09:30'
  }
]

function ToursPageContent() {
  const searchParams = useSearchParams()
  const queryPartnerId = searchParams.get('partner_id')

  const [tours, setTours] = useState<TourGroupBooking[]>([])
  const [partners, setPartners] = useState<TravelAgencyPartner[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [menus, setMenus] = useState<{ id: string; menuName: string }[]>([])
  const [selectedTour, setSelectedTour] = useState<TourGroupBooking | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [form, setForm] = useState({
    agencyPartnerId: '',
    reservationId: '',
    tourCode: '',
    bookingReference: '',
    groupName: '',
    market: 'europe' as TourGroupMarket,
    guestCount: '',
    confirmedGuestCount: '',
    arrivalDate: '2026-06-28',
    arrivalTime: '11:30',
    departureTime: '13:30',
    menuName: '',
    menuNote: '',
    allergyNote: '',
    specialRequestNote: '',
    guideName: '',
    guidePhone: '',
    leaderName: '',
    leaderPhone: '',
    floorTableNote: '',
    kitchenNote: '',
    serviceNote: '',
    status: 'inquiry' as TourGroupBookingStatus,
    operationStatus: 'not_ready' as TourGroupOperationStatus,
    ownerName: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedTours = localStorage.getItem('mvos_tour_group_bookings')
        const storedPartners = localStorage.getItem('mvos_travel_agency_partners')
        const storedRes = localStorage.getItem('mvos_reservations')

        let loadedTours: TourGroupBooking[] = []
        let loadedPartners: TravelAgencyPartner[] = []
        let loadedRes: Reservation[] = []

        if (storedTours) {
          loadedTours = JSON.parse(storedTours)
        } else {
          localStorage.setItem('mvos_tour_group_bookings', JSON.stringify(INITIAL_TOURS))
          loadedTours = INITIAL_TOURS
        }
        setTours(loadedTours)

        if (storedPartners) {
          loadedPartners = JSON.parse(storedPartners)
          setPartners(loadedPartners)
        }

        if (storedRes) {
          loadedRes = JSON.parse(storedRes)
          setReservations(loadedRes)
        }

        const storedMenus = localStorage.getItem('mvos_menu_catalogs')
        if (storedMenus) {
          setMenus(JSON.parse(storedMenus))
        } else {
          setMenus([{ id: 'menu-1', menuName: 'Set Menu Âu Cổ Điển 1' }])
        }

        // Pre-populate partner
        if (queryPartnerId) {
          const matched = loadedPartners.find(p => p.id === queryPartnerId)
          if (matched) {
            setForm((prev) => ({
              ...prev,
              agencyPartnerId: matched.id,
              groupName: `Đoàn của đối tác: ${matched.partnerName}`
            }))
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu vận hành đoàn tour.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [queryPartnerId])

  const handleCreateTour = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!form.groupName.trim()) errs.groupName = 'Vui lòng nhập tên đoàn tour'
    if (!form.arrivalDate) errs.arrivalDate = 'Vui lòng chọn ngày đến'
    if (!form.arrivalTime) errs.arrivalTime = 'Vui lòng chọn giờ đến'
    if (!form.guestCount || parseInt(form.guestCount) < 0) {
      errs.guestCount = 'Vui lòng nhập số khách dự kiến hợp lệ'
    }
    if (!form.market) errs.market = 'Vui lòng chọn thị trường'
    if (!form.status) errs.status = 'Vui lòng chọn trạng thái booking'
    if (!form.operationStatus) errs.operationStatus = 'Vui lòng chọn trạng thái vận hành'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newTour: TourGroupBooking = {
      id: `tour-${Date.now().toString().slice(-4)}`,
      agencyPartnerId: form.agencyPartnerId || null,
      reservationId: form.reservationId || null,
      tourCode: form.tourCode || null,
      bookingReference: form.bookingReference || null,
      groupName: form.groupName,
      market: form.market,
      guestCount: parseInt(form.guestCount),
      confirmedGuestCount: form.confirmedGuestCount ? parseInt(form.confirmedGuestCount) : null,
      arrivalDate: form.arrivalDate,
      arrivalTime: form.arrivalTime,
      departureTime: form.departureTime || null,
      menuName: form.menuName || null,
      menuNote: form.menuNote || null,
      allergyNote: form.allergyNote || null,
      specialRequestNote: form.specialRequestNote || null,
      guideName: form.guideName || null,
      guidePhone: form.guidePhone || null,
      leaderName: form.leaderName || null,
      leaderPhone: form.leaderPhone || null,
      floorTableNote: form.floorTableNote || null,
      kitchenNote: form.kitchenNote || null,
      serviceNote: form.serviceNote || null,
      status: form.status,
      operationStatus: form.operationStatus,
      ownerName: form.ownerName || 'Chưa phân công',
      confirmedAt: form.status === 'confirmed' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newTour, ...tours]
    localStorage.setItem('mvos_tour_group_bookings', JSON.stringify(updated))
    setTours(updated)
    setSelectedTour(newTour)

    // Reset Form
    setForm({
      agencyPartnerId: '',
      reservationId: '',
      tourCode: '',
      bookingReference: '',
      groupName: '',
      market: 'europe',
      guestCount: '',
      confirmedGuestCount: '',
      arrivalDate: '2026-06-28',
      arrivalTime: '11:30',
      departureTime: '13:30',
      menuName: '',
      menuNote: '',
      allergyNote: '',
      specialRequestNote: '',
      guideName: '',
      guidePhone: '',
      leaderName: '',
      leaderPhone: '',
      floorTableNote: '',
      kitchenNote: '',
      serviceNote: '',
      status: 'inquiry',
      operationStatus: 'not_ready',
      ownerName: ''
    })
  }

  const handleUpdateStatus = (tourId: string, nextStatus: TourGroupBookingStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = tours.map((t) => {
      if (t.id === tourId) {
        const updatedT = {
          ...t,
          status: nextStatus,
          confirmedAt: nextStatus === 'confirmed' ? nowStr : t.confirmedAt,
          updatedAt: nowStr
        }
        if (selectedTour?.id === tourId) setSelectedTour(updatedT)
        return updatedT
      }
      return t
    })
    localStorage.setItem('mvos_tour_group_bookings', JSON.stringify(updated))
    setTours(updated)
  }

  const handleUpdateOpsStatus = (tourId: string, nextOps: TourGroupOperationStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = tours.map((t) => {
      if (t.id === tourId) {
        const updatedT = {
          ...t,
          operationStatus: nextOps,
          updatedAt: nowStr
        }
        if (selectedTour?.id === tourId) setSelectedTour(updatedT)
        return updatedT
      }
      return t
    })
    localStorage.setItem('mvos_tour_group_bookings', JSON.stringify(updated))
    setTours(updated)
  }

  const getMarketLabel = (mkt: TourGroupMarket) => {
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

  const getBookingStatusLabel = (st: TourGroupBookingStatus) => {
    switch (st) {
      case 'inquiry': return 'Mới hỏi'
      case 'tentative': return 'Tạm giữ'
      case 'confirmed': return 'Đã xác nhận'
      case 'changed': return 'Có thay đổi'
      case 'cancelled': return 'Đã hủy'
      case 'completed': return 'Đã phục vụ'
      case 'archived': return 'Lưu trữ'
      default: return st
    }
  }

  const getBookingStatusClass = (st: TourGroupBookingStatus) => {
    switch (st) {
      case 'confirmed':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'changed':
        return 'bg-orange-500/10 border border-orange-500/25 text-orange-400'
      case 'tentative':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'cancelled':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getOperationStatusLabel = (ops: TourGroupOperationStatus) => {
    switch (ops) {
      case 'not_ready': return 'Chưa sẵn sàng'
      case 'preparing': return 'Đang chuẩn bị'
      case 'ready': return 'Sẵn sàng'
      case 'in_service': return 'Đang phục vụ'
      case 'completed': return 'Đã hoàn tất'
      case 'issue': return 'Có vấn đề'
      default: return ops
    }
  }

  const getOperationStatusClass = (ops: TourGroupOperationStatus) => {
    switch (ops) {
      case 'ready':
      case 'completed':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'preparing':
      case 'in_service':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'issue':
        return 'bg-red-500/10 border border-red-500/25 text-red-500 font-bold'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getPartnerName = (partnerId: string | null | undefined) => {
    if (!partnerId) return 'Vãng lai'
    const found = partners.find(p => p.id === partnerId)
    return found ? found.partnerName : partnerId
  }

  const getReservationLabel = (resId: string | null | undefined) => {
    if (!resId) return 'Chưa liên kết'
    const found = reservations.find(r => r.id === resId)
    return found ? `Đặt bàn: ${found.guestName} (${found.bookingDate})` : resId
  }

  // Calculate Metrics
  const referenceDateStr = '2026-06-28'
  const totalCount = tours.length
  const todayCount = tours.filter(t => t.arrivalDate === referenceDateStr).length
  const confirmedCount = tours.filter(t => t.status === 'confirmed').length
  const preparingCount = tours.filter(t => t.operationStatus === 'preparing').length
  const issueCount = tours.filter(t => t.operationStatus === 'issue').length

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải đoàn tour…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải đoàn tour.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🚌 Vận hành đoàn tour (Tour Group Operations)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Quản lý thông tin vận hành cho các đoàn tour, đối tác lữ hành, số khách, menu, dị ứng và ghi chú phục vụ.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng đoàn</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đoàn hôm nay</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{todayCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đã xác nhận</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{confirmedCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang chuẩn bị</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{preparingCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Có vấn đề</span>
          <span className="text-2xl font-serif-cormorant font-bold text-red-500 mt-1 block">{issueCount}</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Tours Listing & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Ngày đến</th>
                    <th className="py-3 px-4">Giờ đến</th>
                    <th className="py-3 px-4">Tên đoàn</th>
                    <th className="py-3 px-4">Đối tác</th>
                    <th className="py-3 px-4">Thị trường</th>
                    <th className="py-3 px-4 text-center">Số khách</th>
                    <th className="py-3 px-4">Menu</th>
                    <th className="py-3 px-4">Booking</th>
                    <th className="py-3 px-4">Vận hành</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {tours.length > 0 ? (
                    tours.map((t) => (
                      <tr
                        key={t.id}
                        onClick={() => setSelectedTour(t)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedTour?.id === t.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{t.arrivalDate}</td>
                        <td className="py-3.5 px-4 font-mono text-foreground/75">{t.arrivalTime}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground truncate max-w-[130px]" title={t.groupName}>
                          {t.groupName}
                          <span className="text-[9px] text-foreground/45 font-mono block mt-0.5">{t.tourCode || t.id}</span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/80 font-semibold">{getPartnerName(t.agencyPartnerId)}</td>
                        <td className="py-3.5 px-4 text-gold-hover font-semibold">{getMarketLabel(t.market)}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold">
                          {t.confirmedGuestCount !== null && t.confirmedGuestCount !== undefined ? (
                            <span>{t.confirmedGuestCount} <span className="text-[9px] text-foreground/45">/ {t.guestCount}</span></span>
                          ) : (
                            t.guestCount
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-foreground/80 truncate max-w-[110px]" title={t.menuName || ''}>{t.menuName || '-'}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getBookingStatusClass(t.status)}`}>
                            {getBookingStatusLabel(t.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getOperationStatusClass(t.operationStatus)}`}>
                            {getOperationStatusLabel(t.operationStatus)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có đoàn tour nào được ghi nhận.
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
              🆕 Khởi tạo đoàn tour mới
            </h3>

            <form onSubmit={handleCreateTour} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên đoàn tour *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Đoàn khách Saigontourist Pháp..."
                    value={form.groupName}
                    onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.groupName && <span className="text-[10px] text-red-400 italic">{validationErrors.groupName}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Đối tác lữ hành</label>
                  <select
                    value={form.agencyPartnerId}
                    onChange={(e) => setForm({ ...form, agencyPartnerId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn đối tác --</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.partnerName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã tour</label>
                  <input
                    type="text"
                    placeholder="Mã tour / Mã đoàn lữ hành..."
                    value={form.tourCode}
                    onChange={(e) => setForm({ ...form, tourCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã booking</label>
                  <input
                    type="text"
                    placeholder="Mã booking tham chiếu hệ thống..."
                    value={form.bookingReference}
                    onChange={(e) => setForm({ ...form, bookingReference: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Số khách dự kiến *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ví dụ: 20"
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.guestCount && <span className="text-[10px] text-red-400 italic">{validationErrors.guestCount}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Số khách xác nhận</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Chốt khách..."
                    value={form.confirmedGuestCount}
                    onChange={(e) => setForm({ ...form, confirmedGuestCount: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Thị trường khách *</label>
                  <select
                    value={form.market}
                    onChange={(e) => setForm({ ...form, market: e.target.value as TourGroupMarket })}
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
                    <option value="global">Quốc tế</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày đến *</label>
                  <input
                    type="date"
                    value={form.arrivalDate}
                    onChange={(e) => setForm({ ...form, arrivalDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.arrivalDate && <span className="text-[10px] text-red-400 italic">{validationErrors.arrivalDate}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Giờ đến *</label>
                  <input
                    type="time"
                    value={form.arrivalTime}
                    onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.arrivalTime && <span className="text-[10px] text-red-400 italic">{validationErrors.arrivalTime}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Giờ kết thúc dự kiến</label>
                  <input
                    type="time"
                    value={form.departureTime}
                    onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Thực đơn liên quan</label>
                  <select
                    value={form.menuName}
                    onChange={(e) => setForm({ ...form, menuName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn thực đơn --</option>
                    {menus.map((m) => (
                      <option key={m.id} value={m.menuName}>
                        {m.menuName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Đặt bàn liên quan</label>
                  <select
                    value={form.reservationId}
                    onChange={(e) => setForm({ ...form, reservationId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn đặt bàn liên kết --</option>
                    {reservations.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.guestName} ({r.bookingDate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú Menu & Chốt món</label>
                  <textarea
                    rows={2}
                    placeholder="Ghi chú về cơ cấu món, FOC hướng dẫn viên..."
                    value={form.menuNote}
                    onChange={(e) => setForm({ ...form, menuNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono font-bold text-red-400">Ghi chú dị ứng / Ăn chay / Kiêng kị</label>
                  <textarea
                    rows={2}
                    placeholder="Ví dụ: 2 khách ăn chay, 1 dị ứng hạt lạc..."
                    value={form.allergyNote}
                    onChange={(e) => setForm({ ...form, allergyNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Hướng dẫn viên dẫn đoàn</label>
                  <div className="grid gap-2 grid-cols-2">
                    <input
                      type="text"
                      placeholder="Tên HDV..."
                      value={form.guideName}
                      onChange={(e) => setForm({ ...form, guideName: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="SĐT HDV..."
                      value={form.guidePhone}
                      onChange={(e) => setForm({ ...form, guidePhone: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Trưởng đoàn / Leader</label>
                  <div className="grid gap-2 grid-cols-2">
                    <input
                      type="text"
                      placeholder="Tên Trưởng đoàn..."
                      value={form.leaderName}
                      onChange={(e) => setForm({ ...form, leaderName: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                    <input
                      type="text"
                      placeholder="SĐT Trưởng đoàn..."
                      value={form.leaderPhone}
                      onChange={(e) => setForm({ ...form, leaderPhone: e.target.value })}
                      className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú phòng/tầng/bàn</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Tầng 2 VIP Napoleon..."
                    value={form.floorTableNote}
                    onChange={(e) => setForm({ ...form, floorTableNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono font-bold text-gold">Chỉ thị cho Bếp (BOH)</label>
                  <input
                    type="text"
                    placeholder="Chuẩn bị riêng cho món dị ứng..."
                    value={form.kitchenNote}
                    onChange={(e) => setForm({ ...form, kitchenNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono font-bold text-gold">Chỉ thị cho Phục vụ (FOH)</label>
                  <input
                    type="text"
                    placeholder="Setup cờ, hoa, đón tiếp..."
                    value={form.serviceNote}
                    onChange={(e) => setForm({ ...form, serviceNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái booking *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as TourGroupBookingStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="inquiry">Mới hỏi (Inquiry)</option>
                    <option value="tentative">Tạm giữ chỗ (Tentative)</option>
                    <option value="confirmed">Đã xác nhận (Confirmed)</option>
                    <option value="changed">Có thay đổi (Changed)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái vận hành *</label>
                  <select
                    value={form.operationStatus}
                    onChange={(e) => setForm({ ...form, operationStatus: e.target.value as TourGroupOperationStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="not_ready">Chưa sẵn sàng</option>
                    <option value="preparing">Đang chuẩn bị</option>
                    <option value="ready">Sẵn sàng</option>
                    <option value="in_service">Đang phục vụ</option>
                    <option value="completed">Đã hoàn tất</option>
                    <option value="issue">Có vấn đề (Issue)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase font-bold text-gold">Người chịu trách nhiệm chính</label>
                  <input
                    type="text"
                    placeholder="Tên quản lý phụ trách đoàn..."
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono">Yêu cầu đặc biệt khác</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú thêm về cờ hoa, ngôn ngữ HDV..."
                  value={form.specialRequestNote}
                  onChange={(e) => setForm({ ...form, specialRequestNote: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Tạo đoàn tour
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Action panel */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết đoàn tour
            </h3>

            {selectedTour ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedTour.groupName}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Mã tour: {selectedTour.tourCode || selectedTour.id}</span>
                    <span>Thị trường: {getMarketLabel(selectedTour.market)}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Đối tác TA</span>
                    <span className="font-bold text-foreground/80 block">{getPartnerName(selectedTour.agencyPartnerId)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người chịu trách nhiệm</span>
                    <span className="font-bold text-gold block">{selectedTour.ownerName || 'Chưa phân công'}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Số lượng khách</span>
                    <span className="font-bold text-foreground/85 block">
                      Dự kiến: {selectedTour.guestCount} pax
                      {selectedTour.confirmedGuestCount !== null && ` / Chốt: ${selectedTour.confirmedGuestCount} pax`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block font-mono">Thời gian đến</span>
                    <span className="font-semibold text-foreground/80 block font-mono">
                      {selectedTour.arrivalDate} {selectedTour.arrivalTime} {selectedTour.departureTime && `- ${selectedTour.departureTime}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Booking Status</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getBookingStatusClass(selectedTour.status)}`}>
                      {getBookingStatusLabel(selectedTour.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block font-bold text-gold">Vận hành</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getOperationStatusClass(selectedTour.operationStatus)}`}>
                      {getOperationStatusLabel(selectedTour.operationStatus)}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[9px] text-foreground/50 font-mono block">Thông tin Thực đơn & Kiêng kị</span>
                  <div className="bg-background/40 p-2.5 rounded border border-gold-border/10 leading-relaxed space-y-1">
                    <div><span className="font-semibold text-gold">Menu:</span> {selectedTour.menuName || 'Chưa chọn'}</div>
                    {selectedTour.menuNote && <div><span className="font-semibold text-foreground/75">Ghi chú:</span> {selectedTour.menuNote}</div>}
                    {selectedTour.allergyNote && <div><span className="font-semibold text-red-400 font-bold">Ăn kiêng/Dị ứng:</span> {selectedTour.allergyNote}</div>}
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  {selectedTour.guideName && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Hướng dẫn viên</span>
                      <span className="font-semibold text-foreground/80 block">{selectedTour.guideName}</span>
                      {selectedTour.guidePhone && <span className="text-[10px] text-foreground/60 block font-mono">{selectedTour.guidePhone}</span>}
                    </div>
                  )}
                  {selectedTour.leaderName && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Trưởng đoàn (Leader)</span>
                      <span className="font-semibold text-foreground/80 block">{selectedTour.leaderName}</span>
                      {selectedTour.leaderPhone && <span className="text-[10px] text-foreground/60 block font-mono">{selectedTour.leaderPhone}</span>}
                    </div>
                  )}
                </div>

                <div className="border-t border-gold-border/10 pt-3 space-y-2">
                  <span className="text-[9px] text-gold font-mono uppercase block">Chỉ thị chi tiết phòng bàn:</span>
                  
                  {selectedTour.floorTableNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Bố trí phòng bàn:</span>
                      <p className="text-foreground/85">{selectedTour.floorTableNote}</p>
                    </div>
                  )}
                  {selectedTour.kitchenNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Giao việc cho Bếp (BOH):</span>
                      <p className="text-foreground/85 italic">&ldquo;{selectedTour.kitchenNote}&rdquo;</p>
                    </div>
                  )}
                  {selectedTour.serviceNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Giao việc cho Phục vụ (FOH):</span>
                      <p className="text-foreground/85 italic">&ldquo;{selectedTour.serviceNote}&rdquo;</p>
                    </div>
                  )}
                  {selectedTour.specialRequestNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Yêu cầu đặc biệt khác:</span>
                      <p className="text-foreground/85">&ldquo;{selectedTour.specialRequestNote}&rdquo;</p>
                    </div>
                  )}
                </div>

                <div className="text-[10px] space-y-1 font-mono border-t border-gold-border/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Lượt đặt bàn liên kết:</span>
                    <span className="text-gold font-bold truncate max-w-[120px]">{getReservationLabel(selectedTour.reservationId)}</span>
                  </div>
                  {selectedTour.confirmedAt && (
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Thời điểm chốt đoàn:</span>
                      <span className="text-foreground/80">{selectedTour.confirmedAt}</span>
                    </div>
                  )}
                </div>

                {/* State Actions */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái booking</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedTour.id, 'confirmed')}
                      disabled={selectedTour.status === 'completed' || selectedTour.status === 'cancelled'}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Đã xác nhận
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedTour.id, 'changed')}
                      disabled={selectedTour.status === 'completed' || selectedTour.status === 'cancelled'}
                      className="rounded border border-orange-500/40 hover:border-orange-500 px-2 py-1.5 text-center text-[10px] text-orange-400 hover:bg-orange-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Có thay đổi pax
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedTour.id, 'completed')}
                      disabled={selectedTour.status === 'cancelled'}
                      className="col-span-2 rounded border border-blue-500/40 hover:border-blue-500 px-2 py-1.5 text-center text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Đoàn ăn xong / Hoàn tất phục vụ
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedTour.id, 'cancelled')}
                      className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Hủy đoàn
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedTour.id, 'archived')}
                      className="rounded border border-foreground/30 hover:border-foreground px-2 py-1.5 text-center text-[10px] text-foreground/60 hover:bg-foreground/5 transition-all"
                    >
                      Lưu trữ đoàn
                    </button>
                  </div>
                </div>

                {/* Operation Status Actions */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật vận hành (Kitchen / FOH)</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateOpsStatus(selectedTour.id, 'preparing')}
                      className="rounded border border-blue-500/40 hover:border-blue-500 px-2 py-1.5 text-center text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all font-semibold"
                    >
                      Đang chuẩn bị
                    </button>

                    <button
                      onClick={() => handleUpdateOpsStatus(selectedTour.id, 'ready')}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Sẵn sàng đón tiếp
                    </button>

                    <button
                      onClick={() => handleUpdateOpsStatus(selectedTour.id, 'in_service')}
                      className="col-span-2 rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold"
                    >
                      Đoàn đã vào bàn / Đang phục vụ
                    </button>

                    <button
                      onClick={() => handleUpdateOpsStatus(selectedTour.id, 'issue')}
                      className="col-span-2 rounded border border-red-500/40 hover:border-red-500 px-2 py-2 text-center text-[10px] text-red-500 hover:bg-red-500/10 transition-all font-bold"
                    >
                      ⚠️ Cảnh báo sự cố vận hành đoàn!
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một đoàn tour từ danh sách để xem chi tiết đầy đủ, chỉ thị nhà bếp và chỉ đạo phục vụ.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ToursPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải đoàn tour…</p>
      </div>
    }>
      <ToursPageContent />
    </Suspense>
  )
}
