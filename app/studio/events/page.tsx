'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export type PrivateDiningEventType =
  | "private_dining"
  | "corporate"
  | "birthday"
  | "anniversary"
  | "proposal"
  | "wine_dinner"
  | "banquet"
  | "meeting"
  | "family_event"
  | "press_event"
  | "other"

export type PrivateDiningRoomArea =
  | "floor_1"
  | "vip_1"
  | "vip_2"
  | "vip_3"
  | "vip_4"
  | "floor_3"
  | "full_restaurant"
  | "offsite"
  | "other"

export type PrivateDiningSetupStyle =
  | "standard_dining"
  | "u_shape"
  | "long_table"
  | "round_table"
  | "cocktail"
  | "theater"
  | "classroom"
  | "buffet_style"
  | "custom"

export type PrivateDiningEventStatus =
  | "inquiry"
  | "tentative"
  | "confirmed"
  | "changed"
  | "cancelled"
  | "completed"
  | "archived"

export type PrivateDiningOperationStatus =
  | "not_ready"
  | "preparing"
  | "ready"
  | "in_service"
  | "completed"
  | "issue"

export interface PrivateDiningEvent {
  id: string
  reservationId?: string | null
  agencyPartnerId?: string | null
  checklistRunId?: string | null
  eventCode?: string | null
  eventName: string
  eventType: PrivateDiningEventType
  hostName?: string | null
  hostContact?: string | null
  companyName?: string | null
  guestCount: number
  confirmedGuestCount?: number | null
  eventDate: string
  startTime: string
  endTime?: string | null
  roomArea: PrivateDiningRoomArea
  setupStyle: PrivateDiningSetupStyle
  menuName?: string | null
  menuNote?: string | null
  beverageNote?: string | null
  allergyNote?: string | null
  specialRequestNote?: string | null
  decorationNote?: string | null
  cakeNote?: string | null
  flowerNote?: string | null
  avEquipmentNote?: string | null
  kitchenNote?: string | null
  serviceNote?: string | null
  status: PrivateDiningEventStatus
  operationStatus: PrivateDiningOperationStatus
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

interface ChecklistRun {
  id: string
  runDate: string
  checklistName: string
}

const INITIAL_EVENTS: PrivateDiningEvent[] = [
  {
    id: 'evt-301',
    reservationId: null,
    agencyPartnerId: null,
    checklistRunId: null,
    eventCode: 'EV-BD-2806',
    eventName: 'Tiệc sinh nhật ấm cúng gia đình bác sĩ Nguyễn Văn A',
    eventType: 'birthday',
    hostName: 'Nguyễn Văn A',
    hostContact: '0913456789',
    companyName: 'Bệnh viện Quân Y',
    guestCount: 12,
    confirmedGuestCount: 12,
    eventDate: '2026-06-28',
    startTime: '18:00',
    endTime: '21:30',
    roomArea: 'vip_1',
    setupStyle: 'round_table',
    menuName: 'Set Menu Âu Hải Sản 2',
    menuNote: 'Không có sashimi hải sản sống. Chuyển món cá hồi áp chảo.',
    beverageNote: 'Phục vụ 2 chai vang đỏ Chateau Margaux, rót sẵn khi bắt đầu món khai vị.',
    allergyNote: '1 khách dị ứng hải sản vỏ cứng (tôm cua), bếp làm riêng 1 phần súp kem nấm.',
    specialRequestNote: 'Chủ tiệc tuổi 60, thích âm nhạc cổ điển nhẹ nhàng.',
    decorationNote: 'Bóng bay chữ màu vàng chủ đề sinh nhật 60 tuổi, treo phông nền chính diện phòng.',
    cakeNote: 'Khách tự mang bánh kem đến lúc 17:30, nhà hàng hỗ trợ bảo quản tủ mát và nến.',
    flowerNote: '1 lẵng hoa hồng đỏ tươi đặt bàn tiệc.',
    avEquipmentNote: 'Màn hình TV kết nối HDMI để chiếu ảnh gia đình, 1 micro không dây.',
    kitchenNote: 'Set 11 hải sản và 1 phần bò wagyu / súp nấm thay thế cho khách dị ứng tôm.',
    serviceNote: 'Đón tiếp chu đáo, chuẩn bị dao đĩa cắt bánh kem khi khách yêu cầu thổi nến.',
    status: 'confirmed',
    operationStatus: 'preparing',
    ownerName: 'Mr. Quang (Supervisor Tầng 2)',
    confirmedAt: '2026-06-27 10:00',
    createdAt: '2026-06-27 09:00',
    updatedAt: '2026-06-28 10:00'
  }
]

function EventsPageContent() {
  const searchParams = useSearchParams()
  const queryPartnerId = searchParams.get('partner_id')

  const [events, setEvents] = useState<PrivateDiningEvent[]>([])
  const [partners, setPartners] = useState<TravelAgencyPartner[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [checklistRuns, setChecklistRuns] = useState<ChecklistRun[]>([])
  const [menus, setMenus] = useState<{ id: string; menuName: string }[]>([])
  const [selectedEvent, setSelectedEvent] = useState<PrivateDiningEvent | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [form, setForm] = useState({
    reservationId: '',
    agencyPartnerId: '',
    checklistRunId: '',
    eventCode: '',
    eventName: '',
    eventType: 'birthday' as PrivateDiningEventType,
    hostName: '',
    hostContact: '',
    companyName: '',
    guestCount: '',
    confirmedGuestCount: '',
    eventDate: '2026-06-28',
    startTime: '18:00',
    endTime: '21:30',
    roomArea: 'vip_1' as PrivateDiningRoomArea,
    setupStyle: 'round_table' as PrivateDiningSetupStyle,
    menuName: '',
    menuNote: '',
    beverageNote: '',
    allergyNote: '',
    specialRequestNote: '',
    decorationNote: '',
    cakeNote: '',
    flowerNote: '',
    avEquipmentNote: '',
    kitchenNote: '',
    serviceNote: '',
    status: 'inquiry' as PrivateDiningEventStatus,
    operationStatus: 'not_ready' as PrivateDiningOperationStatus,
    ownerName: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedEvents = localStorage.getItem('mvos_private_dining_events')
        const storedPartners = localStorage.getItem('mvos_travel_agency_partners')
        const storedRes = localStorage.getItem('mvos_reservations')
        const storedChecklists = localStorage.getItem('mvos_checklist_runs')

        let loadedEvents: PrivateDiningEvent[] = []
        let loadedPartners: TravelAgencyPartner[] = []
        let loadedRes: Reservation[] = []
        let loadedChecklists: ChecklistRun[] = []

        if (storedEvents) {
          loadedEvents = JSON.parse(storedEvents)
        } else {
          localStorage.setItem('mvos_private_dining_events', JSON.stringify(INITIAL_EVENTS))
          loadedEvents = INITIAL_EVENTS
        }
        setEvents(loadedEvents)

        if (storedPartners) {
          loadedPartners = JSON.parse(storedPartners)
          setPartners(loadedPartners)
        }

        if (storedRes) {
          loadedRes = JSON.parse(storedRes)
          setReservations(loadedRes)
        }

        if (storedChecklists) {
          loadedChecklists = JSON.parse(storedChecklists)
          setChecklistRuns(loadedChecklists)
        }

        const storedMenus = localStorage.getItem('mvos_menu_catalogs')
        if (storedMenus) {
          setMenus(JSON.parse(storedMenus))
        } else {
          setMenus([{ id: 'menu-1', menuName: 'Set Menu Âu Cổ Điển 1' }])
        }

        // Pre-populate partner from query param
        if (queryPartnerId) {
          const matched = loadedPartners.find(p => p.id === queryPartnerId)
          if (matched) {
            setForm((prev) => ({
              ...prev,
              agencyPartnerId: matched.id,
              eventName: `Sự kiện của đối tác: ${matched.partnerName}`
            }))
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải dữ liệu sự kiện & phòng riêng.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [queryPartnerId])

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!form.eventName.trim()) errs.eventName = 'Vui lòng nhập tên sự kiện'
    if (!form.eventType) errs.eventType = 'Vui lòng chọn loại sự kiện'
    if (!form.eventDate) errs.eventDate = 'Vui lòng chọn ngày tổ chức'
    if (!form.startTime) errs.startTime = 'Vui lòng chọn giờ bắt đầu'
    if (!form.guestCount || parseInt(form.guestCount) < 0) {
      errs.guestCount = 'Vui lòng nhập số lượng khách dự kiến hợp lệ'
    }
    if (!form.roomArea) errs.roomArea = 'Vui lòng chọn phòng/khu vực'
    if (!form.setupStyle) errs.setupStyle = 'Vui lòng chọn kiểu setup'
    if (!form.status) errs.status = 'Vui lòng chọn trạng thái booking'
    if (!form.operationStatus) errs.operationStatus = 'Vui lòng chọn trạng thái vận hành'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newEvent: PrivateDiningEvent = {
      id: `evt-${Date.now().toString().slice(-4)}`,
      reservationId: form.reservationId || null,
      agencyPartnerId: form.agencyPartnerId || null,
      checklistRunId: form.checklistRunId || null,
      eventCode: form.eventCode || null,
      eventName: form.eventName,
      eventType: form.eventType,
      hostName: form.hostName || null,
      hostContact: form.hostContact || null,
      companyName: form.companyName || null,
      guestCount: parseInt(form.guestCount),
      confirmedGuestCount: form.confirmedGuestCount ? parseInt(form.confirmedGuestCount) : null,
      eventDate: form.eventDate,
      startTime: form.startTime,
      endTime: form.endTime || null,
      roomArea: form.roomArea,
      setupStyle: form.setupStyle,
      menuName: form.menuName || null,
      menuNote: form.menuNote || null,
      beverageNote: form.beverageNote || null,
      allergyNote: form.allergyNote || null,
      specialRequestNote: form.specialRequestNote || null,
      decorationNote: form.decorationNote || null,
      cakeNote: form.cakeNote || null,
      flowerNote: form.flowerNote || null,
      avEquipmentNote: form.avEquipmentNote || null,
      kitchenNote: form.kitchenNote || null,
      serviceNote: form.serviceNote || null,
      status: form.status,
      operationStatus: form.operationStatus,
      ownerName: form.ownerName || 'Chưa phân công',
      confirmedAt: form.status === 'confirmed' ? new Date().toISOString().replace('T', ' ').slice(0, 16) : null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newEvent, ...events]
    localStorage.setItem('mvos_private_dining_events', JSON.stringify(updated))
    setEvents(updated)
    setSelectedEvent(newEvent)

    // Reset Form
    setForm({
      reservationId: '',
      agencyPartnerId: '',
      checklistRunId: '',
      eventCode: '',
      eventName: '',
      eventType: 'birthday',
      hostName: '',
      hostContact: '',
      companyName: '',
      guestCount: '',
      confirmedGuestCount: '',
      eventDate: '2026-06-28',
      startTime: '18:00',
      endTime: '21:30',
      roomArea: 'vip_1',
      setupStyle: 'round_table',
      menuName: '',
      menuNote: '',
      beverageNote: '',
      allergyNote: '',
      specialRequestNote: '',
      decorationNote: '',
      cakeNote: '',
      flowerNote: '',
      avEquipmentNote: '',
      kitchenNote: '',
      serviceNote: '',
      status: 'inquiry',
      operationStatus: 'not_ready',
      ownerName: ''
    })
  }

  const handleUpdateStatus = (eventId: string, nextStatus: PrivateDiningEventStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = events.map((e) => {
      if (e.id === eventId) {
        const updatedE = {
          ...e,
          status: nextStatus,
          confirmedAt: nextStatus === 'confirmed' ? nowStr : e.confirmedAt,
          updatedAt: nowStr
        }
        if (selectedEvent?.id === eventId) setSelectedEvent(updatedE)
        return updatedE
      }
      return e
    })
    localStorage.setItem('mvos_private_dining_events', JSON.stringify(updated))
    setEvents(updated)
  }

  const handleUpdateOpsStatus = (eventId: string, nextOps: PrivateDiningOperationStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updated = events.map((e) => {
      if (e.id === eventId) {
        const updatedE = {
          ...e,
          operationStatus: nextOps,
          updatedAt: nowStr
        }
        if (selectedEvent?.id === eventId) setSelectedEvent(updatedE)
        return updatedE
      }
      return e
    })
    localStorage.setItem('mvos_private_dining_events', JSON.stringify(updated))
    setEvents(updated)
  }

  const getEventTypeLabel = (t: PrivateDiningEventType) => {
    switch (t) {
      case 'private_dining': return 'Phòng riêng'
      case 'corporate': return 'Corporate'
      case 'birthday': return 'Sinh nhật'
      case 'anniversary': return 'Kỷ niệm'
      case 'proposal': return 'Cầu hôn'
      case 'wine_dinner': return 'Wine dinner'
      case 'banquet': return 'Tiệc lớn'
      case 'meeting': return 'Họp'
      case 'family_event': return 'Gia đình'
      case 'press_event': return 'Báo chí/truyền thông'
      default: return 'Khác'
    }
  }

  const getRoomAreaLabel = (area: PrivateDiningRoomArea) => {
    switch (area) {
      case 'floor_1': return 'Tầng 1'
      case 'vip_1': return 'VIP 1'
      case 'vip_2': return 'VIP 2'
      case 'vip_3': return 'VIP 3'
      case 'vip_4': return 'VIP 4'
      case 'floor_3': return 'Tầng 3'
      case 'full_restaurant': return 'Toàn nhà hàng'
      case 'offsite': return 'Ngoài nhà hàng'
      default: return 'Khác'
    }
  }

  const getSetupStyleLabel = (style: PrivateDiningSetupStyle) => {
    switch (style) {
      case 'standard_dining': return 'Bàn ăn tiêu chuẩn'
      case 'u_shape': return 'Chữ U'
      case 'long_table': return 'Bàn dài'
      case 'round_table': return 'Bàn tròn'
      case 'cocktail': return 'Cocktail'
      case 'theater': return 'Nhà hát'
      case 'classroom': return 'Lớp học'
      case 'buffet_style': return 'Kiểu buffet'
      default: return 'Tùy chỉnh'
    }
  }

  const getBookingStatusLabel = (st: PrivateDiningEventStatus) => {
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

  const getBookingStatusClass = (st: PrivateDiningEventStatus) => {
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

  const getOperationStatusLabel = (ops: PrivateDiningOperationStatus) => {
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

  const getOperationStatusClass = (ops: PrivateDiningOperationStatus) => {
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
    if (!partnerId) return 'Trực tiếp'
    const found = partners.find(p => p.id === partnerId)
    return found ? found.partnerName : partnerId
  }

  const getReservationLabel = (resId: string | null | undefined) => {
    if (!resId) return 'Không liên kết'
    const found = reservations.find(r => r.id === resId)
    return found ? `Đặt bàn: ${found.guestName} (${found.bookingDate})` : resId
  }

  const getChecklistLabel = (runId: string | null | undefined) => {
    if (!runId) return 'Không liên kết'
    const found = checklistRuns.find(c => c.id === runId)
    return found ? `Checklist: ${found.checklistName} (${found.runDate})` : runId
  }

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải sự kiện & phòng riêng…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải sự kiện & phòng riêng.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  // Calculate Metrics
  const referenceDateStr = '2026-06-28'
  const totalCount = events.length
  const todayCount = events.filter(e => e.eventDate === referenceDateStr).length
  const confirmedCount = events.filter(e => e.status === 'confirmed').length
  const preparingCount = events.filter(e => e.operationStatus === 'preparing').length
  const issueCount = events.filter(e => e.operationStatus === 'issue').length

  return (
    <div className="space-y-8 font-sans">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🎉 Sự kiện & phòng riêng (Events & Private Dining)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Quản lý thông tin vận hành cho private dining, corporate, sinh nhật, wine dinner và các sự kiện đặc biệt tại Maison Vie.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5 text-center">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng sự kiện</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Sự kiện hôm nay</span>
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
        {/* Events Listing & Creation Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Ngày sự kiện</th>
                    <th className="py-3 px-4">Giờ bắt đầu</th>
                    <th className="py-3 px-4">Tên sự kiện</th>
                    <th className="py-3 px-4">Loại</th>
                    <th className="py-3 px-4">Khu vực/phòng</th>
                    <th className="py-3 px-4 text-center">Số khách</th>
                    <th className="py-3 px-4">Booking</th>
                    <th className="py-3 px-4">Vận hành</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {events.length > 0 ? (
                    events.map((e) => (
                      <tr
                        key={e.id}
                        onClick={() => setSelectedEvent(e)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedEvent?.id === e.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-gold">{e.eventDate}</td>
                        <td className="py-3.5 px-4 font-mono text-foreground/75">{e.startTime}</td>
                        <td className="py-3.5 px-4 font-semibold text-foreground truncate max-w-[130px]" title={e.eventName}>
                          {e.eventName}
                          <span className="text-[9px] text-foreground/45 font-mono block mt-0.5">{e.eventCode || e.id}</span>
                        </td>
                        <td className="py-3.5 px-4 text-foreground/80 font-semibold">{getEventTypeLabel(e.eventType)}</td>
                        <td className="py-3.5 px-4 text-gold-hover font-semibold">{getRoomAreaLabel(e.roomArea)}</td>
                        <td className="py-3.5 px-4 text-center font-mono font-bold">
                          {e.confirmedGuestCount !== null && e.confirmedGuestCount !== undefined ? (
                            <span>{e.confirmedGuestCount} <span className="text-[9px] text-foreground/45">/ {e.guestCount}</span></span>
                          ) : (
                            e.guestCount
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getBookingStatusClass(e.status)}`}>
                            {getBookingStatusLabel(e.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getOperationStatusClass(e.operationStatus)}`}>
                            {getOperationStatusLabel(e.operationStatus)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có sự kiện hoặc phòng riêng nào được ghi nhận.
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
              🆕 Thiết lập sự kiện / phòng riêng mới
            </h3>

            <form onSubmit={handleCreateEvent} className="space-y-4 text-xs">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên sự kiện *</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Tiệc sinh nhật ấm cúng gia đình bác sĩ A..."
                    value={form.eventName}
                    onChange={(e) => setForm({ ...form, eventName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.eventName && <span className="text-[10px] text-red-400 italic">{validationErrors.eventName}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Loại sự kiện *</label>
                  <select
                    value={form.eventType}
                    onChange={(e) => setForm({ ...form, eventType: e.target.value as PrivateDiningEventType })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="private_dining">Phòng riêng (Private Dining)</option>
                    <option value="corporate">Corporate</option>
                    <option value="birthday">Sinh nhật (Birthday)</option>
                    <option value="anniversary">Kỷ niệm (Anniversary)</option>
                    <option value="proposal">Cầu hôn (Proposal)</option>
                    <option value="wine_dinner">Wine dinner</option>
                    <option value="banquet">Tiệc lớn (Banquet)</option>
                    <option value="meeting">Họp (Meeting)</option>
                    <option value="family_event">Gia đình (Family)</option>
                    <option value="press_event">Báo chí/truyền thông</option>
                    <option value="other">Khác</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Mã sự kiện</label>
                  <input
                    type="text"
                    placeholder="Mã sự kiện tham chiếu..."
                    value={form.eventCode}
                    onChange={(e) => setForm({ ...form, eventCode: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên khách/host</label>
                  <input
                    type="text"
                    placeholder="Tên người đại diện..."
                    value={form.hostName}
                    onChange={(e) => setForm({ ...form, hostName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Liên hệ khách/host</label>
                  <input
                    type="text"
                    placeholder="Số điện thoại / email..."
                    value={form.hostContact}
                    onChange={(e) => setForm({ ...form, hostContact: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1 col-span-2">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Công ty</label>
                  <input
                    type="text"
                    placeholder="Tên công ty/tổ chức..."
                    value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Số khách dự kiến *</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Ví dụ: 15"
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
                    placeholder="Chốt số khách..."
                    value={form.confirmedGuestCount}
                    onChange={(e) => setForm({ ...form, confirmedGuestCount: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày tổ chức *</label>
                  <input
                    type="date"
                    value={form.eventDate}
                    onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.eventDate && <span className="text-[10px] text-red-400 italic">{validationErrors.eventDate}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Giờ bắt đầu *</label>
                  <input
                    type="time"
                    value={form.startTime}
                    onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                  {validationErrors.startTime && <span className="text-[10px] text-red-400 italic">{validationErrors.startTime}</span>}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Giờ kết thúc dự kiến</label>
                  <input
                    type="time"
                    value={form.endTime}
                    onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Khu vực/phòng *</label>
                  <select
                    value={form.roomArea}
                    onChange={(e) => setForm({ ...form, roomArea: e.target.value as PrivateDiningRoomArea })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="vip_1">Phòng VIP 1</option>
                    <option value="vip_2">Phòng VIP 2</option>
                    <option value="vip_3">Phòng VIP 3</option>
                    <option value="vip_4">Phòng VIP 4</option>
                    <option value="floor_1">Tầng 1</option>
                    <option value="floor_3">Tầng 3</option>
                    <option value="full_restaurant">Toàn bộ nhà hàng</option>
                    <option value="offsite">Ngoài nhà hàng</option>
                    <option value="other">Khu vực khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Kiểu setup bàn ghế *</label>
                  <select
                    value={form.setupStyle}
                    onChange={(e) => setForm({ ...form, setupStyle: e.target.value as PrivateDiningSetupStyle })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="round_table">Bàn tròn (Round Table)</option>
                    <option value="long_table">Bàn dài (Long Table)</option>
                    <option value="standard_dining">Bàn ăn tiêu chuẩn</option>
                    <option value="u_shape">Setup chữ U</option>
                    <option value="cocktail">Tiệc Cocktail đứng</option>
                    <option value="theater">Kiểu nhà hát</option>
                    <option value="classroom">Kiểu lớp học</option>
                    <option value="buffet_style">Quầy Buffet tự phục vụ</option>
                    <option value="custom">Setup tùy chỉnh</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Đặt bàn liên quan</label>
                  <select
                    value={form.reservationId}
                    onChange={(e) => setForm({ ...form, reservationId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn đặt bàn --</option>
                    {reservations.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.guestName} ({r.bookingDate})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Đối tác TA liên quan</label>
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

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Checklist liên quan</label>
                  <select
                    value={form.checklistRunId}
                    onChange={(e) => setForm({ ...form, checklistRunId: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="">-- Chọn checklist run --</option>
                    {checklistRuns.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.checklistName} ({c.runDate})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Thực đơn liên quan</label>
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
                  <label className="text-[10px] text-foreground/60 font-mono font-bold text-red-400">Dị ứng / Kiêng ăn / Ăn chay</label>
                  <input
                    type="text"
                    placeholder="Ví dụ: 1 pax không ăn tôm cua..."
                    value={form.allergyNote}
                    onChange={(e) => setForm({ ...form, allergyNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú đồ uống</label>
                  <input
                    type="text"
                    placeholder="Rót vang đỏ khai tiệc, đá bia..."
                    value={form.beverageNote}
                    onChange={(e) => setForm({ ...form, beverageNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Ghi chú thực đơn chi tiết</label>
                  <textarea
                    rows={2}
                    placeholder="Thay thế món cá hồi, FOC hoa quả tráng miệng..."
                    value={form.menuNote}
                    onChange={(e) => setForm({ ...form, menuNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Yêu cầu đặc biệt khách hàng</label>
                  <textarea
                    rows={2}
                    placeholder="Nhạc nhẹ cổ điển, không gian yên tĩnh cho đôi tình nhân..."
                    value={form.specialRequestNote}
                    onChange={(e) => setForm({ ...form, specialRequestNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Trang trí / Background</label>
                  <input
                    type="text"
                    placeholder="Set bong bóng, backdrop..."
                    value={form.decorationNote}
                    onChange={(e) => setForm({ ...form, decorationNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Bánh kem / Quà tặng</label>
                  <input
                    type="text"
                    placeholder="Nhà hàng bảo quản bánh kem..."
                    value={form.cakeNote}
                    onChange={(e) => setForm({ ...form, cakeNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Hoa tươi</label>
                  <input
                    type="text"
                    placeholder="Lẵng hoa đặt bàn..."
                    value={form.flowerNote}
                    onChange={(e) => setForm({ ...form, flowerNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono">Âm thanh / TV / Thiết bị</label>
                  <input
                    type="text"
                    placeholder="Chiếu TV HDMI, mic không dây..."
                    value={form.avEquipmentNote}
                    onChange={(e) => setForm({ ...form, avEquipmentNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-2.5 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono font-bold text-gold">Chỉ thị cho nhà Bếp (BOH)</label>
                  <textarea
                    rows={2}
                    placeholder="Làm riêng món kiêng hải sản, lên món sau 15 phút..."
                    value={form.kitchenNote}
                    onChange={(e) => setForm({ ...form, kitchenNote: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono font-bold text-gold">Chỉ thị cho Phục vụ (FOH)</label>
                  <textarea
                    rows={2}
                    placeholder="Hỗ trợ đốt nến bánh kem, chuẩn bị loa mic..."
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
                    onChange={(e) => setForm({ ...form, status: e.target.value as PrivateDiningEventStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="inquiry">Mới hỏi (Inquiry)</option>
                    <option value="tentative">Tạm giữ (Tentative)</option>
                    <option value="confirmed">Đã xác nhận (Confirmed)</option>
                    <option value="changed">Có thay đổi (Changed)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái vận hành *</label>
                  <select
                    value={form.operationStatus}
                    onChange={(e) => setForm({ ...form, operationStatus: e.target.value as PrivateDiningOperationStatus })}
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
                    placeholder="Tên quản lý phụ trách sự kiện..."
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none font-semibold"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-6 py-2.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Tạo sự kiện
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Action panel */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 font-sans text-xs">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết sự kiện & phòng riêng
            </h3>

            {selectedEvent ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-bold text-gold font-serif-cormorant">
                    {selectedEvent.eventName}
                  </h4>
                  <div className="flex gap-4 text-[9px] text-foreground/45 font-mono mt-0.5">
                    <span>Mã: {selectedEvent.eventCode || selectedEvent.id}</span>
                    <span>Loại: {getEventTypeLabel(selectedEvent.eventType)}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2 border-b border-gold-border/10 pb-3">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Khách đại diện / Host</span>
                    <span className="font-bold text-foreground/80 block">{selectedEvent.hostName || 'Chưa cập nhật'}</span>
                    {selectedEvent.hostContact && <span className="text-[9px] text-foreground/60 block font-mono">{selectedEvent.hostContact}</span>}
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người chịu trách nhiệm</span>
                    <span className="font-bold text-gold block">{selectedEvent.ownerName || 'Chưa phân công'}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Số lượng khách</span>
                    <span className="font-bold text-foreground/85 block">
                      Dự kiến: {selectedEvent.guestCount} pax
                      {selectedEvent.confirmedGuestCount !== null && ` / Chốt: ${selectedEvent.confirmedGuestCount} pax`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Thời gian diễn ra</span>
                    <span className="font-semibold text-foreground/80 block font-mono">
                      {selectedEvent.eventDate} {selectedEvent.startTime} {selectedEvent.endTime && `- ${selectedEvent.endTime}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Khu vực phòng</span>
                    <span className="font-bold text-gold-hover block">{getRoomAreaLabel(selectedEvent.roomArea)} ({getSetupStyleLabel(selectedEvent.setupStyle)})</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block font-bold text-gold">Vận hành</span>
                    <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getOperationStatusClass(selectedEvent.operationStatus)}`}>
                      {getOperationStatusLabel(selectedEvent.operationStatus)}
                    </span>
                  </div>
                </div>

                {selectedEvent.companyName && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Đơn vị / Công ty</span>
                    <span className="font-semibold text-foreground/80 block">{selectedEvent.companyName}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-[9px] text-foreground/50 font-mono block">Thông tin Set Menu & Đồ uống</span>
                  <div className="bg-background/40 p-2.5 rounded border border-gold-border/10 leading-relaxed space-y-1">
                    <div><span className="font-semibold text-gold">Menu:</span> {selectedEvent.menuName || 'Chưa chốt'}</div>
                    {selectedEvent.menuNote && <div><span className="font-semibold text-foreground/75">Ghi chú menu:</span> {selectedEvent.menuNote}</div>}
                    {selectedEvent.beverageNote && <div><span className="font-semibold text-foreground/75">Ghi chú đồ uống:</span> {selectedEvent.beverageNote}</div>}
                    {selectedEvent.allergyNote && <div><span className="font-semibold text-red-400 font-bold">Ăn kiêng/Dị ứng:</span> {selectedEvent.allergyNote}</div>}
                  </div>
                </div>

                <div className="border-t border-gold-border/10 pt-3 space-y-2">
                  <span className="text-[9px] text-gold font-mono uppercase block">Setup chi tiết, Decor & AV:</span>
                  
                  {selectedEvent.decorationNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Trang trí phòng:</span>
                      <p className="text-foreground/85">{selectedEvent.decorationNote}</p>
                    </div>
                  )}
                  {selectedEvent.cakeNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Bánh kem:</span>
                      <p className="text-foreground/85">{selectedEvent.cakeNote}</p>
                    </div>
                  )}
                  {selectedEvent.flowerNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Hoa tươi setup:</span>
                      <p className="text-foreground/85">{selectedEvent.flowerNote}</p>
                    </div>
                  )}
                  {selectedEvent.avEquipmentNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Thiết bị âm thanh/ánh sáng/tivi:</span>
                      <p className="text-foreground/85">{selectedEvent.avEquipmentNote}</p>
                    </div>
                  )}
                </div>

                <div className="border-t border-gold-border/10 pt-3 space-y-2">
                  <span className="text-[9px] text-gold font-mono uppercase block">Chỉ thị cho bếp & phục vụ:</span>
                  
                  {selectedEvent.kitchenNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Chỉ thị cho Bếp (BOH):</span>
                      <p className="text-foreground/85 italic">&ldquo;{selectedEvent.kitchenNote}&rdquo;</p>
                    </div>
                  )}
                  {selectedEvent.serviceNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Chỉ thị cho Phục vụ (FOH):</span>
                      <p className="text-foreground/85 italic">&ldquo;{selectedEvent.serviceNote}&rdquo;</p>
                    </div>
                  )}
                  {selectedEvent.specialRequestNote && (
                    <div>
                      <span className="text-[9px] text-foreground/50 font-mono block">Yêu cầu đặc biệt khác:</span>
                      <p className="text-foreground/85">&ldquo;{selectedEvent.specialRequestNote}&rdquo;</p>
                    </div>
                  )}
                </div>

                <div className="text-[10px] space-y-1 font-mono border-t border-gold-border/10 pt-3">
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Lượt đặt bàn liên kết:</span>
                    <span className="text-gold font-bold truncate max-w-[120px]">{getReservationLabel(selectedEvent.reservationId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Đối tác TA liên kết:</span>
                    <span className="text-foreground/80 truncate max-w-[120px]">{getPartnerName(selectedEvent.agencyPartnerId)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/50">Checklist liên quan:</span>
                    <span className="text-foreground/80 truncate max-w-[120px]">{getChecklistLabel(selectedEvent.checklistRunId)}</span>
                  </div>
                  {selectedEvent.confirmedAt && (
                    <div className="flex justify-between">
                      <span className="text-foreground/50">Thời điểm chốt phòng:</span>
                      <span className="text-foreground/80">{selectedEvent.confirmedAt}</span>
                    </div>
                  )}
                </div>

                {/* State Actions */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái booking</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedEvent.id, 'confirmed')}
                      disabled={selectedEvent.status === 'completed' || selectedEvent.status === 'cancelled'}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Đã xác nhận
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedEvent.id, 'changed')}
                      disabled={selectedEvent.status === 'completed' || selectedEvent.status === 'cancelled'}
                      className="rounded border border-orange-500/40 hover:border-orange-500 px-2 py-1.5 text-center text-[10px] text-orange-400 hover:bg-orange-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Có thay đổi pax
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedEvent.id, 'completed')}
                      disabled={selectedEvent.status === 'cancelled'}
                      className="col-span-2 rounded border border-blue-500/40 hover:border-blue-500 px-2 py-1.5 text-center text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all font-semibold disabled:opacity-40"
                    >
                      Sự kiện hoàn tất / Phục vụ xong
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedEvent.id, 'cancelled')}
                      className="rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all font-semibold"
                    >
                      Hủy sự kiện
                    </button>

                    <button
                      onClick={() => handleUpdateStatus(selectedEvent.id, 'archived')}
                      className="rounded border border-foreground/30 hover:border-foreground px-2 py-1.5 text-center text-[10px] text-foreground/60 hover:bg-foreground/5 transition-all"
                    >
                      Lưu trữ sự kiện
                    </button>
                  </div>
                </div>

                {/* Operation Status Actions */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật vận hành (Kitchen / FOH / Decor)</span>
                  
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateOpsStatus(selectedEvent.id, 'preparing')}
                      className="rounded border border-blue-500/40 hover:border-blue-500 px-2 py-1.5 text-center text-[10px] text-blue-400 hover:bg-blue-500/10 transition-all font-semibold"
                    >
                      Đang chuẩn bị
                    </button>

                    <button
                      onClick={() => handleUpdateOpsStatus(selectedEvent.id, 'ready')}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Sẵn sàng tổ chức
                    </button>

                    <button
                      onClick={() => handleUpdateOpsStatus(selectedEvent.id, 'in_service')}
                      className="col-span-2 rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] text-gold hover:bg-gold/10 transition-all font-semibold"
                    >
                      Khách đã vào phòng / Đang diễn ra
                    </button>

                    <button
                      onClick={() => handleUpdateOpsStatus(selectedEvent.id, 'issue')}
                      className="col-span-2 rounded border border-red-500/40 hover:border-red-500 px-2 py-2 text-center text-[10px] text-red-500 hover:bg-red-500/10 transition-all font-bold"
                    >
                      ⚠️ Cảnh báo sự cố vận hành sự kiện!
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một sự kiện từ danh sách để xem chi tiết đầy đủ, chỉ thị nhà bếp, điều phối phục vụ và trang trí.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải sự kiện & phòng riêng…</p>
      </div>
    }>
      <EventsPageContent />
    </Suspense>
  )
}
