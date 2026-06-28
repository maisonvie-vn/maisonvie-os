'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Reservation {
  id: string
  guestName: string
  email: string
  phone: string
  vipLevel: string
  date: string
  time: string
  partySize: number
  roomName: string
  menuSelection: string
  specialRequests: string
  allergies: string
  status: string
  notes: string
}

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    guestName: 'Lord Henderson',
    email: 'henderson@royal.uk',
    phone: '+44 7911 123456',
    vipLevel: 'VIP Platinum',
    date: '2026-06-28',
    time: '19:30',
    partySize: 4,
    roomName: 'Phòng VIP 1 (Salon Privé)',
    menuSelection: 'Thực đơn nếm thử cổ điển Pháp (Tasting Menu)',
    specialRequests: 'Yêu cầu phòng yên tĩnh nhất biệt thự.',
    allergies: 'Không hành tỏi (Allergy: Onion/Garlic)',
    status: 'Confirmed',
    notes: 'Khách quen hoàng gia. Thích vang đỏ Bordeaux.'
  },
  {
    id: 'res-102',
    guestName: 'Dr. Minh Nguyen',
    email: 'minh.nguyen@hospital.vn',
    phone: '+84 909 123 456',
    vipLevel: 'VIP Gold',
    date: '2026-06-28',
    time: '20:00',
    partySize: 2,
    roomName: 'Khu vườn (Le Jardin)',
    menuSelection: 'Thực đơn hải sản cao cấp (Seafood Tasting Menu)',
    specialRequests: 'Bàn cạnh đài phun nước.',
    allergies: 'Dị ứng động vật vỏ giáp (Shellfish allergy)',
    status: 'Confirmed',
    notes: 'Kỷ niệm ngày cưới. Đặt sẵn hoa hồng trắng trên bàn.'
  }
]

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('Tất cả')

  useEffect(() => {
    const stored = localStorage.getItem('mvos_reservations')
    if (stored) {
      setReservations(JSON.parse(stored))
    } else {
      localStorage.setItem('mvos_reservations', JSON.stringify(INITIAL_RESERVATIONS))
      setReservations(INITIAL_RESERVATIONS)
    }
  }, [])

  const statuses = [
    { key: 'Tất cả', label: 'Tất cả' },
    { key: 'Draft', label: 'Bản nháp' },
    { key: 'Pending', label: 'Chờ duyệt' },
    { key: 'Confirmed', label: 'Đã xác nhận' },
    { key: 'Arrived', label: 'Đã đến sảnh' },
    { key: 'Dining', label: 'Đang dùng bữa' },
    { key: 'Completed', label: 'Hoàn thành' },
    { key: 'Cancelled', label: 'Đã hủy' },
    { key: 'No Show', label: 'Không đến' }
  ]

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Draft': return 'Bản nháp'
      case 'Pending': return 'Chờ duyệt'
      case 'Confirmed': return 'Đã xác nhận'
      case 'Arrived': return 'Đã đến sảnh'
      case 'Dining': return 'Đang dùng bữa'
      case 'Completed': return 'Hoàn thành'
      case 'Cancelled': return 'Đã hủy'
      case 'No Show': return 'Không đến'
      default: return status
    }
  }

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Confirmed':
      case 'Completed':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'Pending':
      case 'Arrived':
      case 'Dining':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'Draft':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      case 'Cancelled':
      case 'No Show':
        return 'bg-red-500/10 border border-red-500/25 text-red-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/70'
    }
  }

  const filtered = reservations.filter((res) => {
    const matchesSearch =
      res.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      res.phone.includes(searchTerm)
    const matchesStatus = statusFilter === 'Tất cả' || res.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold-border/40 pb-4 gap-4">
        <div>
          <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
            📅 Đặt bàn nhà hàng
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            Hệ thống quản lý đặt bàn biệt thự và điều phối bàn ăn khách VIP Maison Vie.
          </p>
        </div>
        <Link
          href="/reservations/create"
          className="self-start sm:self-center rounded-md border border-gold bg-gold/10 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold/20 transition-all tracking-wide"
        >
          + Tạo đặt bàn mới
        </Link>
      </div>

      {/* Toolbar / Search & Filters */}
      <div className="glass-panel rounded-xl p-4 border border-gold-border flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="w-full md:w-80 flex flex-col gap-1.5">
          <input
            type="text"
            placeholder="Tìm theo tên khách hoặc số điện thoại..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto">
          <span className="text-[10px] text-foreground/50 font-mono uppercase">Trạng thái:</span>
          <div className="flex gap-1 flex-wrap">
            {statuses.map((s) => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`rounded px-2 py-1 text-[10px] font-medium transition-all ${
                  statusFilter === s.key
                    ? 'bg-gold/20 text-gold border border-gold/40'
                    : 'text-foreground/70 hover:text-foreground hover:bg-gold-muted/5'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Reservation List Table */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Khách hàng</th>
                <th className="py-3 px-4">Liên hệ</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4 text-center">Số khách</th>
                <th className="py-3 px-4">Phòng tiệc</th>
                <th className="py-3 px-4">Dị ứng thực phẩm</th>
                <th className="py-3 px-4 text-right">Trạng thái</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {filtered.length > 0 ? (
                filtered.map((res) => (
                  <tr key={res.id} className="hover:bg-gold-muted/5 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-foreground font-serif-cormorant text-sm">{res.guestName}</div>
                      <div className="text-[9px] text-gold font-mono uppercase">{res.vipLevel}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{res.phone}</div>
                      <div className="text-[10px] text-foreground/50">{res.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div>{res.date}</div>
                      <div className="text-gold font-bold">{res.time}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-sm text-foreground">{res.partySize}</td>
                    <td className="py-3 px-4 text-foreground/75">{res.roomName}</td>
                    <td className="py-3 px-4 text-[11px] text-red-400 font-sans max-w-xs truncate">{res.allergies || 'Không'}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold tracking-wider ${getStatusClass(res.status)}`}>
                        {getStatusLabel(res.status)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={`/reservations/${res.id}`}
                        className="text-xs text-gold hover:underline font-semibold"
                      >
                        Chi tiết →
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                    Không tìm thấy thông tin đặt bàn phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
