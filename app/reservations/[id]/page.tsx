'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { vi } from '@/lib/i18n/vi'

interface HistoryEntry {
  previousStatus: string
  newStatus: string
  time: string
  actor: string
  note: string
}

interface NoteEntry {
  content: string
  time: string
  author: string
}

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
  history?: HistoryEntry[]
  internalNotesList?: NoteEntry[]
}

export default function ReservationDetailPage() {
  const params = useParams()
  const id = params.id as string

  const [res, setRes] = useState<Reservation | null>(null)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState<Reservation | null>(null)
  
  // Note inputs
  const [newNote, setNewNote] = useState('')
  
  // Status change workflow inputs
  const [selectedNextStatus, setSelectedNextStatus] = useState('')
  const [statusChangeNote, setStatusChangeNote] = useState('')
  const [transitionError, setTransitionError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('mvos_reservations')
    if (stored) {
      const list: Reservation[] = JSON.parse(stored)
      const found = list.find((item) => item.id === id)
      if (found) {
        // Initialize history with initial record if missing
        if (!found.history) {
          found.history = [
            { previousStatus: '-', newStatus: 'Draft', time: '2026-06-28 10:00', actor: 'Hệ thống', note: 'Khởi tạo đặt bàn nháp' },
            { previousStatus: 'Draft', newStatus: found.status, time: '2026-06-28 12:00', actor: 'Lễ tân FOH', note: 'Duyệt lên danh sách chính thức' }
          ]
        }
        if (!found.internalNotesList) {
          found.internalNotesList = found.notes ? [
            { content: found.notes, time: '2026-06-28 12:00', author: 'Lễ tân FOH' }
          ] : []
        }
        setRes(found)
        setFormData(found)
        
        // Pre-select first allowed status if any
        const allowed = getAllowedTransitions(found.status)
        if (allowed.length > 0) {
          setSelectedNextStatus(allowed[0])
        } else {
          setSelectedNextStatus('')
        }
      }
    }
  }, [id])

  if (!res || !formData) {
    return (
      <div className="py-8 text-center text-foreground/50 font-serif-cormorant italic text-base">
        Đang tải thông tin đặt bàn hoặc đặt bàn không tồn tại...
      </div>
    )
  }

  const updateLocalStorage = (updatedRes: Reservation) => {
    const stored = localStorage.getItem('mvos_reservations')
    if (stored) {
      const list: Reservation[] = JSON.parse(stored)
      const index = list.findIndex((item) => item.id === id)
      if (index !== -1) {
        list[index] = updatedRes
        localStorage.setItem('mvos_reservations', JSON.stringify(list))
        setRes(updatedRes)
        setFormData(updatedRes)
        
        // Reset and pre-select next status
        const allowed = getAllowedTransitions(updatedRes.status)
        if (allowed.length > 0) {
          setSelectedNextStatus(allowed[0])
        } else {
          setSelectedNextStatus('')
        }
        setStatusChangeNote('')
        setTransitionError('')
      }
    }
  }

  // Business Rules for Allowed Next Statuses
  const getAllowedTransitions = (currentStatus: string): string[] => {
    switch (currentStatus) {
      case 'Draft':
        return ['Pending', 'Cancelled']
      case 'Pending':
        return ['Confirmed', 'Cancelled']
      case 'Confirmed':
        return ['Reminder', 'Arrived', 'Cancelled', 'No Show']
      case 'Reminder':
        return ['Arrived', 'Cancelled', 'No Show']
      case 'Arrived':
        return ['Dining']
      case 'Dining':
        return ['Completed']
      default:
        return [] // Completed, Cancelled, No Show cannot move to another status
    }
  }

  const handleStatusChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNextStatus) return

    // Double check transition safety
    const allowed = getAllowedTransitions(res.status)
    if (!allowed.includes(selectedNextStatus)) {
      setTransitionError('Không được phép chuyển trạng thái này')
      return
    }

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updatedHistory = [
      ...(res.history || []),
      {
        previousStatus: res.status,
        newStatus: selectedNextStatus,
        time: nowStr,
        actor: 'FOH Hostess',
        note: statusChangeNote || 'Cập nhật trạng thái thủ công'
      }
    ]

    const updatedRes = {
      ...res,
      status: selectedNextStatus,
      history: updatedHistory
    }

    updateLocalStorage(updatedRes)
  }

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updatedNotes = [
      ...(res.internalNotesList || []),
      { content: newNote, time: nowStr, author: 'FOH Lead' }
    ]

    const updatedRes = {
      ...res,
      notes: newNote,
      internalNotesList: updatedNotes
    }

    updateLocalStorage(updatedRes)
    setNewNote('')
  }

  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault()
    
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    const updatedHistory = [
      ...(res.history || []),
      {
        previousStatus: res.status,
        newStatus: res.status,
        time: nowStr,
        actor: 'Chỉnh sửa hồ sơ',
        note: 'Cập nhật thông tin chi tiết đặt bàn'
      }
    ]

    const updatedRes = {
      ...formData,
      history: updatedHistory
    }

    updateLocalStorage(updatedRes)
    setEditing(false)
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Draft': return 'Bản nháp'
      case 'Pending': return 'Chờ duyệt'
      case 'Confirmed': return 'Đã xác nhận'
      case 'Reminder': return 'Đã nhắc lịch'
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
      case 'Reminder':
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

  const allowedNext = getAllowedTransitions(res.status)

  // Standard lifecycle for timeline
  const lifecycle = ['Draft', 'Pending', 'Confirmed', 'Reminder', 'Arrived', 'Dining', 'Completed']

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold-border/40 pb-4 gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-serif-cormorant font-bold text-gold tracking-wide">
            Hồ sơ: {res.guestName}
          </h1>
          <span className={`rounded px-2.5 py-0.5 text-[10px] font-bold tracking-wider ${getStatusClass(res.status)}`}>
            {getStatusLabel(res.status)}
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setEditing(!editing)}
            className="rounded border border-gold bg-gold/5 hover:bg-gold/10 px-3.5 py-1.5 text-xs text-gold transition-colors font-semibold"
          >
            {editing ? vi.cancel : vi.edit}
          </button>
          <Link
            href="/reservations"
            className="rounded border border-gold-border/40 px-3.5 py-1.5 text-xs text-foreground/80 hover:text-foreground transition-all font-semibold"
          >
            Quay lại
          </Link>
        </div>
      </div>

      {/* Dòng thời gian (Timeline lifecycle status) */}
      <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
        <h3 className="text-sm font-semibold text-gold tracking-wider uppercase">
          📍 Dòng thời gian
        </h3>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          {lifecycle.map((step, idx) => {
            const isCurrent = res.status === step
            const isPast = lifecycle.indexOf(res.status) > idx
            return (
              <div key={step} className="flex-1 flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isCurrent 
                      ? 'bg-gold text-background shadow-[0_0_8px_#C5A55A]'
                      : isPast
                      ? 'bg-green-500/20 border border-green-500/40 text-green-500'
                      : 'bg-background border border-gold-border/20 text-foreground/40'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className={`text-xs ${isCurrent ? 'text-gold font-bold' : isPast ? 'text-foreground/75' : 'text-foreground/40'}`}>
                    {getStatusLabel(step)}
                  </span>
                </div>
                {idx < lifecycle.length - 1 && (
                  <span className="hidden sm:inline-block text-foreground/20 font-mono">→</span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left 2 Columns: Details & Notes */}
        <div className="lg:col-span-2 space-y-6">
          {editing ? (
            <form onSubmit={handleSaveInfo} className="glass-panel rounded-xl p-6 border border-gold-border space-y-6">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
                ✏️ Chỉnh sửa thông tin đặt bàn
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Tên khách hàng</label>
                  <input
                    type="text"
                    required
                    value={formData.guestName}
                    onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Phân khúc VIP</label>
                  <select
                    value={formData.vipLevel}
                    onChange={(e) => setFormData({ ...formData, vipLevel: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="Regular">Regular</option>
                    <option value="VIP Gold">VIP Gold</option>
                    <option value="VIP Platinum">VIP Platinum</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Số điện thoại</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày đặt bàn</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Giờ đặt bàn</label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Số lượng khách</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.partySize}
                    onChange={(e) => setFormData({ ...formData, partySize: parseInt(e.target.value) || 2 })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Phòng ăn</label>
                  <input
                    type="text"
                    value={formData.roomName}
                    onChange={(e) => setFormData({ ...formData, roomName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Lựa chọn thực đơn</label>
                  <input
                    type="text"
                    value={formData.menuSelection}
                    onChange={(e) => setFormData({ ...formData, menuSelection: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Cảnh báo dị ứng thực phẩm</label>
                  <input
                    type="text"
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="rounded border border-red-500/20 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Yêu cầu đặc biệt</label>
                  <textarea
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    rows={2}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end border-t border-gold-border/20 pt-4">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="rounded border border-gold-border/40 px-3.5 py-1.5 text-xs text-foreground/80"
                >
                  {vi.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded bg-gold px-4 py-1.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
                >
                  {vi.save}
                </button>
              </div>
            </form>
          ) : (
            <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-6">
              <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
                📋 Thông tin chi tiết đặt bàn
              </h3>
              
              <div className="grid gap-6 sm:grid-cols-2 text-xs">
                <div>
                  <span className="text-[10px] text-foreground/50 block font-mono uppercase">Khách hàng</span>
                  <div className="text-sm font-semibold text-foreground font-serif-cormorant mt-0.5">{res.guestName}</div>
                  <span className="text-[9px] font-mono text-gold bg-gold-muted/10 border border-gold-border/20 rounded px-1.5 py-0.5 mt-1 inline-block uppercase font-bold">{res.vipLevel}</span>
                </div>
                <div>
                  <span className="text-[10px] text-foreground/50 block font-mono uppercase">Liên hệ</span>
                  <div className="mt-0.5">ĐT: {res.phone}</div>
                  <div className="text-foreground/60">Email: {res.email || 'Không'}</div>
                </div>
                <div>
                  <span className="text-[10px] text-foreground/50 block font-mono uppercase">Lịch hẹn</span>
                  <div className="text-sm font-bold text-gold font-mono mt-0.5">{res.date} vào {res.time}</div>
                </div>
                <div>
                  <span className="text-[10px] text-foreground/50 block font-mono uppercase">Bố trí phòng & Khách</span>
                  <div className="mt-0.5">{res.roomName}</div>
                  <div className="text-foreground/75 font-semibold">Số khách: {res.partySize} người</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-foreground/50 block font-mono uppercase">Lựa chọn thực đơn</span>
                  <div className="mt-0.5 font-medium">{res.menuSelection}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-red-400 block font-mono uppercase">Cảnh báo dị ứng</span>
                  <div className="mt-0.5 font-semibold text-red-300 bg-red-500/5 border border-red-500/10 rounded p-2.5">{res.allergies || 'Không có ghi chú dị ứng'}</div>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-[10px] text-foreground/50 block font-mono uppercase">Yêu cầu đặc biệt</span>
                  <div className="mt-0.5 p-2.5 bg-gold-muted/5 border border-gold-border/10 rounded italic text-foreground/90">{res.specialRequests || 'Không có yêu cầu đặc biệt.'}</div>
                </div>
              </div>
            </div>
          )}

          {/* Internal Notes log */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              📝 Ghi chú dịch vụ nội bộ
            </h3>
            
            <div className="space-y-3">
              {res.internalNotesList && res.internalNotesList.length > 0 ? (
                res.internalNotesList.map((n, idx) => (
                  <div key={idx} className="p-3 bg-background border border-gold-border/10 rounded-lg space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-semibold text-gold">{n.author}</span>
                      <span className="text-foreground/40 font-mono">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-foreground/80 leading-relaxed font-sans">{n.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-foreground/40 italic">Chưa có ghi chú nào được thêm.</p>
              )}
            </div>

            <form onSubmit={handleAddNote} className="flex gap-2 pt-2 border-t border-gold-border/10">
              <input
                type="text"
                required
                placeholder="Thêm ghi chú phục vụ nội bộ mới..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
              />
              <button
                type="submit"
                className="rounded bg-gold px-4 py-1.5 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Ghi chú
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Workflow Control & Status History */}
        <div className="space-y-6">
          {/* Workflow Control */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              🕹️ Chuyển trạng thái đặt bàn
            </h3>
            
            <div className="text-xs space-y-1">
              <div className="flex justify-between border-b border-gold-border/10 pb-2">
                <span className="text-foreground/50">Trạng thái hiện tại:</span>
                <span className="font-bold text-gold">{getStatusLabel(res.status)}</span>
              </div>
            </div>

            {allowedNext.length > 0 ? (
              <form onSubmit={handleStatusChangeSubmit} className="space-y-4 pt-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái tiếp theo được phép</label>
                  <select
                    value={selectedNextStatus}
                    onChange={(e) => setSelectedNextStatus(e.target.value)}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    {allowedNext.map((st) => (
                      <option key={st} value={st}>
                        {getStatusLabel(st)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ghi chú đổi trạng thái</label>
                  <input
                    type="text"
                    placeholder="Lý do đổi trạng thái (Ví dụ: Đã gọi điện nhắc khách)"
                    value={statusChangeNote}
                    onChange={(e) => setStatusChangeNote(e.target.value)}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                {transitionError && (
                  <p className="text-[10px] text-red-500 font-sans italic">{transitionError}</p>
                )}

                <button
                  type="submit"
                  className="w-full rounded bg-gold py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
                >
                  Xác nhận chuyển trạng thái
                </button>
              </form>
            ) : (
              <div className="rounded border border-red-500/20 bg-red-500/5 p-3 text-xs text-red-400 font-sans italic text-center">
                Không được phép chuyển trạng thái này (Chu trình đặt bàn đã hoàn thành hoặc kết thúc).
              </div>
            )}
          </div>

          {/* Lịch sử trạng thái */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
              📜 Lịch sử đặt bàn
            </h3>
            <div className="space-y-4 relative pl-2">
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-gold-border/25" />
              {res.history && res.history.length > 0 ? (
                res.history.map((h, index) => (
                  <div key={index} className="relative pl-5 space-y-1 text-xs">
                    <span className="absolute left-0 top-1.5 h-1.5 w-1.5 rounded-full bg-gold border border-gold shadow-[0_0_4px_#C5A55A]" />
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-mono text-[9px] text-foreground/50 truncate max-w-[80px]">{getStatusLabel(h.previousStatus)}</span>
                      <span className="text-[10px] text-foreground/30 font-mono">→</span>
                      <span className="font-mono text-[9px] rounded bg-gold-muted border border-gold-border/20 px-1 py-0.2 text-gold font-bold">
                        {getStatusLabel(h.newStatus)}
                      </span>
                    </div>
                    <div className="text-[10px] text-foreground/80 leading-normal font-sans">Ghi chú: {h.note}</div>
                    <div className="text-[9px] text-foreground/40 font-mono flex justify-between items-center pt-0.5">
                      <span>Người thay đổi: {h.actor}</span>
                      <span>{h.time}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-foreground/40 italic">Chưa ghi nhận lịch sử.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
