'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

export type SopCategory =
  | "reservation"
  | "email"
  | "foh_service"
  | "boh_kitchen"
  | "guest_experience"
  | "private_dining"
  | "tour_group"
  | "finance"
  | "inventory"
  | "hr_training"
  | "compliance"
  | "management"
  | "system"
  | "other"

export type SopStatus =
  | "draft"
  | "reviewing"
  | "active"
  | "archived"

export interface SopDocument {
  id: string
  title: string
  summary?: string | null
  content: string
  category: SopCategory
  status: SopStatus
  version: number
  ownerName?: string | null
  relatedImprovementActionId?: string | null
  effectiveDate?: string | null
  createdBy?: string | null
  createdAt: string
  updatedAt: string
}

interface ImprovementAction {
  id: string
  title: string
  description: string
  ownerName?: string | null
}

const INITIAL_SOPS: SopDocument[] = [
  {
    id: 'sop-301',
    title: 'Quy trình kiểm tra bàn giao vỏ chai rượu tại Salon Royal',
    summary: 'Quy trình chuẩn hóa việc đếm vỏ chai rượu vang trống hàng ca để đối chiếu số lượng thực tế khui tại Salon Royal nhằm ngăn ngừa thất thoát hàng hóa.',
    content: `1. Cuối mỗi ca làm việc, nhân viên phục vụ trực tại Salon Royal tập hợp toàn bộ vỏ chai rượu vang đã khui trong ca.
2. Đối chiếu số vỏ chai với phiếu order trên hệ thống POS.
3. Đại diện FOH và nhân viên Kho ký nhận vào Biên bản bàn giao vỏ chai rượu vang trống.
4. Chuyển giao vỏ chai về kho và lưu biên bản tại kẹp hồ sơ FOH.`,
    category: 'foh_service',
    status: 'active',
    version: 1,
    ownerName: 'Nguyễn Thị Hoa (FOH Lead)',
    relatedImprovementActionId: 'act-201',
    effectiveDate: '2026-07-01',
    createdAt: '2026-06-28 10:00',
    updatedAt: '2026-06-28 10:00'
  },
  {
    id: 'sop-302',
    title: 'Quy trình sử dụng khăn lọc cheesecloth lọc mịn súp hải sản',
    summary: 'Quy trình bếp chuẩn hóa việc dùng khăn cheesecloth thay cho rây lọc thông thường để đảm bảo súp hải sản đạt độ sánh mịn và loại bỏ hoàn toàn cặn xương nhỏ.',
    content: `1. Chuẩn bị khăn lọc cheesecloth sạch và đã được tiệt trùng bằng nước sôi trước ca làm việc.
2. Đặt khăn lọc cheesecloth lên khung đỡ rây trước khi đổ súp hải sản nóng qua.
3. Đổ súp từ từ và dùng thìa gỗ gạt nhẹ bề mặt để súp chảy đều mà không làm rách khăn.
4. Sau khi kết thúc, giặt sạch khăn cheesecloth bằng nước rửa chuyên dụng và sấy khô đúng nhiệt độ quy định.`,
    category: 'boh_kitchen',
    status: 'active',
    version: 1,
    ownerName: 'Chef Joel (Bếp trưởng)',
    relatedImprovementActionId: 'act-202',
    effectiveDate: '2026-06-28',
    createdAt: '2026-06-28 09:30',
    updatedAt: '2026-06-28 09:30'
  }
]

function SopsPageContent() {
  const searchParams = useSearchParams()
  const queryActionId = searchParams.get('improvement_action_id')

  const [sops, setSops] = useState<SopDocument[]>([])
  const [actions, setActions] = useState<ImprovementAction[]>([])
  const [selectedSop, setSelectedSop] = useState<SopDocument | null>(null)
  
  // UX States
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form State
  const [form, setForm] = useState({
    title: '',
    summary: '',
    content: '',
    category: 'foh_service' as SopCategory,
    status: 'draft' as SopStatus,
    version: 1,
    ownerName: '',
    effectiveDate: '',
    relatedImprovementActionId: ''
  })

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const storedSops = localStorage.getItem('mvos_sops')
        const storedActions = localStorage.getItem('mvos_improvements')
        
        let loadedSops: SopDocument[] = []
        let loadedActions: ImprovementAction[] = []

        if (storedSops) {
          loadedSops = JSON.parse(storedSops)
        } else {
          localStorage.setItem('mvos_sops', JSON.stringify(INITIAL_SOPS))
          loadedSops = INITIAL_SOPS
        }
        setSops(loadedSops)

        if (storedActions) {
          loadedActions = JSON.parse(storedActions)
          setActions(loadedActions)
        }

        // Handle pre-population if redirected from an improvement action
        if (queryActionId) {
          const matchedAct = loadedActions.find(a => a.id === queryActionId)
          if (matchedAct) {
            setForm((prev) => ({
              ...prev,
              relatedImprovementActionId: matchedAct.id,
              title: `Quy trình chuẩn hóa: ${matchedAct.title}`,
              summary: `Quy trình chuẩn hóa vận hành dựa trên hành động cải tiến: ${matchedAct.description}`,
              ownerName: matchedAct.ownerName || ''
            }))
          }
        }

        setLoading(false)
      } catch {
        setError('Không thể tải thư viện SOP.')
        setLoading(false)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [queryActionId])

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault()

    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = 'Tiêu đề SOP không được để trống'
    if (!form.content.trim()) errs.content = 'Nội dung SOP không được để trống'
    if (!form.category) errs.category = 'Vui lòng chọn nhóm SOP'
    if (!form.status) errs.status = 'Vui lòng chọn trạng thái ban đầu'

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs)
      return
    }

    setValidationErrors({})

    const newSop: SopDocument = {
      id: `sop-${Date.now().toString().slice(-4)}`,
      title: form.title,
      summary: form.summary || '',
      content: form.content,
      category: form.category,
      status: form.status,
      version: Number(form.version) || 1,
      ownerName: form.ownerName || 'Chưa phân công',
      effectiveDate: form.effectiveDate || null,
      relatedImprovementActionId: form.relatedImprovementActionId || null,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    }

    const updated = [newSop, ...sops]
    localStorage.setItem('mvos_sops', JSON.stringify(updated))
    setSops(updated)

    // Reset Form
    setForm({
      title: '',
      summary: '',
      content: '',
      category: 'foh_service',
      status: 'draft',
      version: 1,
      ownerName: '',
      effectiveDate: '',
      relatedImprovementActionId: ''
    })
  }

  const handleUpdateStatus = (sopId: string, nextStatus: SopStatus) => {
    const nowStr = new Date().toISOString().replace('T', ' ').slice(0, 16)
    
    const updated = sops.map((sop) => {
      if (sop.id === sopId) {
        const updatedSop = {
          ...sop,
          status: nextStatus,
          updatedAt: nowStr
        }
        if (selectedSop?.id === sopId) {
          setSelectedSop(updatedSop)
        }
        return updatedSop
      }
      return sop
    })

    localStorage.setItem('mvos_sops', JSON.stringify(updated))
    setSops(updated)
  }

  const getCategoryLabel = (cat: SopCategory) => {
    switch (cat) {
      case 'reservation': return 'Đặt bàn'
      case 'email': return 'Email'
      case 'foh_service': return 'Phục vụ FOH'
      case 'boh_kitchen': return 'Bếp BOH'
      case 'guest_experience': return 'Trải nghiệm khách'
      case 'private_dining': return 'Phòng riêng'
      case 'tour_group': return 'Khách đoàn'
      case 'finance': return 'Tài chính'
      case 'inventory': return 'Kho'
      case 'hr_training': return 'Nhân sự & đào tạo'
      case 'compliance': return 'Tuân thủ'
      case 'management': return 'Quản lý'
      case 'system': return 'Hệ thống'
      default: return 'Khác'
    }
  }

  const getStatusLabel = (st: SopStatus) => {
    switch (st) {
      case 'draft': return 'Bản nháp'
      case 'reviewing': return 'Đang xem xét'
      case 'active': return 'Đang áp dụng'
      case 'archived': return 'Lưu trữ'
      default: return st
    }
  }

  const getStatusClass = (st: SopStatus) => {
    switch (st) {
      case 'active':
        return 'bg-green-500/10 border border-green-500/25 text-green-500'
      case 'reviewing':
        return 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
      case 'draft':
        return 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
      default:
        return 'bg-foreground/5 border border-foreground/10 text-foreground/60'
    }
  }

  const getActionTitle = (actId: string | null | undefined) => {
    if (!actId) return 'Không liên kết'
    const found = actions.find(a => a.id === actId)
    return found ? found.title : actId
  }

  // Calculate metrics
  const totalSops = sops.length
  const activeCount = sops.filter(s => s.status === 'active').length
  const draftCount = sops.filter(s => s.status === 'draft').length
  const reviewingCount = sops.filter(s => s.status === 'reviewing').length
  const archivedCount = sops.filter(s => s.status === 'archived').length

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải thư viện SOP…</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-panel rounded-xl p-8 border border-red-500/30 bg-red-500/5 text-center space-y-4">
        <span className="text-3xl">⚠️</span>
        <h3 className="text-lg font-serif-cormorant font-bold text-red-400">Không thể tải thư viện SOP.</h3>
        <p className="text-xs text-foreground/70">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Title Header */}
      <div className="border-b border-gold-border/40 pb-4">
        <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
          🏛️ Thư viện SOP (Standard Operating Procedures)
        </h1>
        <p className="text-xs text-foreground/50 mt-1">
          Lưu trữ và quản lý các quy trình vận hành chuẩn của Maison Vie.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Tổng SOP</span>
          <span className="text-2xl font-serif-cormorant font-bold text-gold mt-1 block">{totalSops}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang áp dụng</span>
          <span className="text-2xl font-serif-cormorant font-bold text-green-500 mt-1 block">{activeCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Bản nháp</span>
          <span className="text-2xl font-serif-cormorant font-bold text-yellow-500 mt-1 block">{draftCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Đang xem xét</span>
          <span className="text-2xl font-serif-cormorant font-bold text-blue-400 mt-1 block">{reviewingCount}</span>
        </div>
        <div className="glass-panel p-4 rounded-xl border border-gold-border/30 bg-gold-muted/5 text-center">
          <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Lưu trữ</span>
          <span className="text-2xl font-serif-cormorant font-bold text-foreground/60 mt-1 block">{archivedCount}</span>
        </div>
      </div>

      {/* Split layout: SOP list + Detail/Form */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column: SOP List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-foreground/80">
                <thead>
                  <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                    <th className="py-3 px-4">Tiêu đề</th>
                    <th className="py-3 px-4">Nhóm SOP</th>
                    <th className="py-3 px-4">Trạng thái</th>
                    <th className="py-3 px-4">Phiên bản</th>
                    <th className="py-3 px-4">Người phụ trách</th>
                    <th className="py-3 px-4">Ngày hiệu lực</th>
                    <th className="py-3 px-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold-border/10">
                  {sops.length > 0 ? (
                    sops.map((sop) => (
                      <tr 
                        key={sop.id} 
                        onClick={() => setSelectedSop(sop)}
                        className={`cursor-pointer hover:bg-gold-muted/5 transition-colors ${selectedSop?.id === sop.id ? 'bg-gold-muted/10' : ''}`}
                      >
                        <td className="py-3.5 px-4 font-semibold text-foreground">{sop.title}</td>
                        <td className="py-3.5 px-4 text-foreground/75">{getCategoryLabel(sop.category)}</td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-block rounded px-2 py-0.5 text-[9px] font-bold ${getStatusClass(sop.status)}`}>
                            {getStatusLabel(sop.status)}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-center font-bold">v{sop.version}</td>
                        <td className="py-3.5 px-4 text-foreground/75">{sop.ownerName}</td>
                        <td className="py-3.5 px-4 font-mono text-gold-hover font-semibold">{sop.effectiveDate || 'N/A'}</td>
                        <td className="py-3.5 px-4 text-right">
                          <button className="text-gold hover:underline font-semibold">Chi tiết</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                        Chưa có SOP nào được tạo.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form to create new SOP */}
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🆕 Tạo quy trình SOP mới
            </h3>
            
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Tiêu đề SOP *</label>
                <input
                  type="text"
                  placeholder="Nhập tiêu đề quy trình chuẩn..."
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
                {validationErrors.title && <span className="text-[10px] text-red-400 italic">{validationErrors.title}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Tóm tắt</label>
                <input
                  type="text"
                  placeholder="Tóm tắt ngắn gọn phạm vi và mục đích áp dụng của quy trình..."
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Nội dung SOP *</label>
                <textarea
                  placeholder="Liệt kê chi tiết các bước thực thi tiêu chuẩn (1. Bước 1, 2. Bước 2...)..."
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={5}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none font-sans whitespace-pre-wrap"
                />
                {validationErrors.content && <span className="text-[10px] text-red-400 italic">{validationErrors.content}</span>}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Nhóm SOP *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as SopCategory })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="reservation">Đặt bàn</option>
                    <option value="email">Email</option>
                    <option value="foh_service">Phục vụ FOH</option>
                    <option value="boh_kitchen">Bếp BOH</option>
                    <option value="guest_experience">Trải nghiệm khách</option>
                    <option value="private_dining">Phòng riêng</option>
                    <option value="tour_group">Khách đoàn</option>
                    <option value="finance">Tài chính</option>
                    <option value="inventory">Kho</option>
                    <option value="hr_training">Nhân sự & đào tạo</option>
                    <option value="compliance">Tuân thủ</option>
                    <option value="management">Quản lý</option>
                    <option value="system">Hệ thống</option>
                    <option value="other">Khác</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Trạng thái *</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as SopStatus })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  >
                    <option value="draft">Bản nháp (Draft)</option>
                    <option value="reviewing">Đang xem xét (Reviewing)</option>
                    <option value="active">Đang áp dụng (Active)</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Phiên bản *</label>
                  <input
                    type="number"
                    min={1}
                    value={form.version}
                    onChange={(e) => setForm({ ...form, version: Number(e.target.value) || 1 })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Người phụ trách</label>
                  <input
                    type="text"
                    placeholder="Chủ sở hữu / người cập nhật chính..."
                    value={form.ownerName}
                    onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] text-foreground/60 font-mono uppercase">Ngày hiệu lực</label>
                  <input
                    type="date"
                    value={form.effectiveDate}
                    onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })}
                    className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] text-foreground/60 font-mono uppercase">Hành động cải tiến liên quan</label>
                <select
                  value={form.relatedImprovementActionId}
                  onChange={(e) => setForm({ ...form, relatedImprovementActionId: e.target.value })}
                  className="rounded border border-gold-border/30 bg-background/50 px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
                >
                  <option value="">-- Không có liên kết --</option>
                  {actions.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title} ({a.id})
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="rounded bg-gold px-5 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
              >
                Lưu SOP
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Detailed View & Status updating */}
        <div className="space-y-6">
          <div className="glass-panel rounded-xl p-6 border border-gold-border space-y-4">
            <h3 className="text-lg font-serif-cormorant font-bold text-gold border-b border-gold-border/25 pb-2">
              🔎 Chi tiết SOP
            </h3>

            {selectedSop ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-foreground font-serif-cormorant">{selectedSop.title}</h4>
                  <div className="flex gap-4 text-[9px] text-foreground/40 font-mono mt-0.5">
                    <span>Mã số: {selectedSop.id}</span>
                    <span>Phiên bản: v{selectedSop.version}</span>
                  </div>
                </div>

                <div className="grid gap-2 grid-cols-2">
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Nhóm quy trình</span>
                    <span className="font-semibold text-foreground/80 block">{getCategoryLabel(selectedSop.category)}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Trạng thái</span>
                    <span className={`inline-block rounded px-1.5 py-0.2 text-[8px] font-bold ${getStatusClass(selectedSop.status)}`}>
                      {getStatusLabel(selectedSop.status)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Người phụ trách</span>
                    <span className="font-semibold text-foreground/80">{selectedSop.ownerName || 'Chưa phân công'}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Ngày hiệu lực</span>
                    <span className="font-semibold text-gold-hover font-mono">{selectedSop.effectiveDate || 'N/A'}</span>
                  </div>
                </div>

                {selectedSop.summary && (
                  <div>
                    <span className="text-[9px] text-foreground/50 font-mono block">Tóm tắt phạm vi</span>
                    <p className="text-foreground/80 italic font-serif-cormorant leading-relaxed">{selectedSop.summary}</p>
                  </div>
                )}

                <div className="border-t border-gold-border/10 pt-3">
                  <span className="text-[9px] text-foreground/50 font-mono block">Nội dung quy trình chuẩn</span>
                  <p className="text-foreground/90 bg-background/40 p-2.5 rounded border border-gold-border/10 mt-1 font-sans leading-relaxed whitespace-pre-line">{selectedSop.content}</p>
                </div>

                <div className="border-t border-gold-border/10 pt-3">
                  <span className="text-[9px] text-foreground/50 font-mono block">Hành động cải tiến liên quan</span>
                  <span className="font-semibold text-foreground/80 block truncate" title={getActionTitle(selectedSop.relatedImprovementActionId)}>
                    {getActionTitle(selectedSop.relatedImprovementActionId)}
                  </span>
                </div>

                <div className="text-[9px] text-foreground/40 font-mono border-t border-gold-border/10 pt-3">
                  <div>Ngày tạo: {selectedSop.createdAt}</div>
                  <div>Ngày cập nhật: {selectedSop.updatedAt}</div>
                </div>

                {/* Status workflow triggers */}
                <div className="border-t border-gold-border/20 pt-4 space-y-2">
                  <span className="text-[10px] text-foreground/50 font-mono uppercase tracking-wider block">Cập nhật trạng thái</span>
                  <div className="grid gap-2 grid-cols-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedSop.id, 'reviewing')}
                      className="rounded border border-gold-border/40 hover:border-gold px-2 py-1.5 text-center text-[10px] hover:text-gold transition-all"
                    >
                      Chuyển sang đang xem xét
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedSop.id, 'active')}
                      className="rounded border border-green-500/40 hover:border-green-500 px-2 py-1.5 text-center text-[10px] text-green-400 hover:bg-green-500/10 transition-all font-semibold"
                    >
                      Đánh dấu đang áp dụng
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedSop.id, 'archived')}
                      className="col-span-2 rounded border border-red-500/40 hover:border-red-500 px-2 py-1.5 text-center text-[10px] text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Lưu trữ SOP
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-foreground/40 italic text-center py-10">Chọn một quy trình từ danh sách để xem chi tiết và cập nhật trạng thái.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SopsPage() {
  return (
    <Suspense fallback={
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gold border-t-transparent" />
        <p className="text-sm font-serif-cormorant italic text-gold">Đang tải thư viện SOP…</p>
      </div>
    }>
      <SopsPageContent />
    </Suspense>
  )
}
