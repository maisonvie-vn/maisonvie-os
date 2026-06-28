'use client'

import { useState } from 'react'
import { vi } from '@/lib/i18n/vi'

interface Document {
  id: string
  title: string
  document_type: string
  department: string
  status: string
  version: string
  owner: string
  effective_date: string
  created_at: string
}

export default function DocumentLibraryPage() {
  const [filterDept, setFilterDept] = useState('Tất cả')
  const [filterType, setFilterType] = useState('Tất cả')
  
  // Local state for interactive mockup
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 'doc-001',
      title: 'Tiêu chuẩn chiếu sáng mặt tiền biệt thự Maison Vie',
      document_type: 'SOP',
      department: 'Vận hành',
      status: vi.approved,
      version: '1.2',
      owner: 'Dr. Minh Nguyen',
      effective_date: '2026-06-01',
      created_at: '2026-05-15',
    },
    {
      id: 'doc-002',
      title: 'Quy trình đón tiếp sảnh chờ VIP',
      document_type: 'SOP',
      department: 'Lễ tân',
      status: vi.approved,
      version: '2.0',
      owner: 'Lord Henderson',
      effective_date: '2026-06-15',
      created_at: '2026-06-01',
    },
    {
      id: 'doc-003',
      title: 'Quy trình thực đơn nếm thử của Bếp trưởng Joel',
      document_type: 'GUIDELINE',
      department: 'Ẩm thực',
      status: vi.pendingReview,
      version: '1.0-RC1',
      owner: 'Chef Joel',
      effective_date: 'Chưa có',
      created_at: '2026-06-25',
    },
    {
      id: 'doc-004',
      title: 'Chính sách bảo mật dữ liệu & Khóa an toàn',
      document_type: 'POLICY',
      department: 'Quản trị',
      status: vi.approved,
      version: '1.0',
      owner: 'Kỹ sư Antigravity',
      effective_date: '2026-06-28',
      created_at: '2026-06-28',
    },
    {
      id: 'doc-005',
      title: 'Sơ đồ thoát hiểm khẩn cấp phòng VIP',
      document_type: 'SOP',
      department: 'Vận hành',
      status: vi.draft,
      version: '0.9',
      owner: 'Trưởng bộ phận vận hành',
      effective_date: 'Chưa có',
      created_at: '2026-06-27',
    },
  ])

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [newDoc, setNewDoc] = useState({
    title: '',
    document_type: 'SOP',
    department: 'Vận hành',
    status: 'Bản nháp',
    version: '1.0',
    owner: 'Lễ tân FOH',
    effective_date: new Date().toISOString().split('T')[0],
  })

  // Filter lists
  const departments = ['Tất cả', 'Vận hành', 'Lễ tân', 'Ẩm thực', 'Quản trị']
  const types = ['Tất cả', 'SOP', 'GUIDELINE', 'POLICY']

  const filteredDocs = documents.filter((doc) => {
    const matchDept = filterDept === 'Tất cả' || doc.department === filterDept
    const matchType = filterType === 'Tất cả' || doc.document_type === filterType
    return matchDept && matchType
  })

  const handleAddDocument = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDoc.title) return

    const docToAdd: Document = {
      id: `doc-${Date.now().toString().slice(-4)}`,
      title: newDoc.title,
      document_type: newDoc.document_type,
      department: newDoc.department,
      status: newDoc.status,
      version: newDoc.version,
      owner: newDoc.owner,
      effective_date: newDoc.status === 'Đã duyệt' ? newDoc.effective_date : 'Chưa có',
      created_at: new Date().toISOString().split('T')[0],
    }

    setDocuments([docToAdd, ...documents])
    setIsFormOpen(false)
    setNewDoc({
      title: '',
      document_type: 'SOP',
      department: 'Vận hành',
      status: 'Bản nháp',
      version: '1.0',
      owner: 'Lễ tân FOH',
      effective_date: new Date().toISOString().split('T')[0],
    })
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gold-border/40 pb-4 gap-4">
        <div>
          <h1 className="text-4xl font-serif-cormorant font-bold text-gold tracking-wide">
            {vi.documents}
          </h1>
          <p className="text-xs text-foreground/50 mt-1">
            Tra cứu và quản lý các quy trình vận hành tiêu chuẩn, hướng dẫn và chính sách của nhà hàng.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="self-start sm:self-center rounded-md border border-gold bg-gold/10 px-4 py-2 text-xs font-semibold text-gold hover:bg-gold/20 transition-all tracking-wide"
        >
          {isFormOpen ? vi.cancel : `+ ${vi.create}`}
        </button>
      </div>

      {/* Add Document Form Panel */}
      {isFormOpen && (
        <form onSubmit={handleAddDocument} className="glass-panel rounded-xl p-6 border border-gold-border space-y-4 max-w-xl animate-fadeIn">
          <h3 className="text-lg font-serif-cormorant font-bold text-gold tracking-wide border-b border-gold-border/20 pb-2">
            🏛️ Đăng ký tài liệu vận hành mới
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 flex flex-col gap-1.5">
              <label className="text-[10px] text-foreground/60 font-mono">Tiêu đề</label>
              <input
                type="text"
                required
                value={newDoc.title}
                onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                placeholder="Ví dụ: Quy định dọn phòng tiệc VIP tối"
                className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-foreground/60 font-mono">Loại tài liệu</label>
              <select
                value={newDoc.document_type}
                onChange={(e) => setNewDoc({ ...newDoc, document_type: e.target.value })}
                className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
              >
                <option value="SOP">SOP (Quy trình vận hành)</option>
                <option value="GUIDELINE">Hướng dẫn (Guideline)</option>
                <option value="POLICY">Chính sách (Policy)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-foreground/60 font-mono">{vi.department}</label>
              <select
                value={newDoc.department}
                onChange={(e) => setNewDoc({ ...newDoc, department: e.target.value })}
                className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
              >
                <option value="Vận hành">Vận hành</option>
                <option value="Lễ tân">Lễ tân</option>
                <option value="Ẩm thực">Ẩm thực</option>
                <option value="Quản trị">Quản trị</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-foreground/60 font-mono">{vi.owner}</label>
              <input
                type="text"
                value={newDoc.owner}
                onChange={(e) => setNewDoc({ ...newDoc, owner: e.target.value })}
                className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-foreground/60 font-mono">{vi.version}</label>
              <input
                type="text"
                value={newDoc.version}
                onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })}
                className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-foreground/60 font-mono">{vi.status}</label>
              <select
                value={newDoc.status}
                onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value })}
                className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
              >
                <option value={vi.draft}>{vi.draft}</option>
                <option value={vi.pendingReview}>{vi.pendingReview}</option>
                <option value={vi.approved}>{vi.approved}</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] text-foreground/60 font-mono">Ngày hiệu lực</label>
              <input
                type="date"
                value={newDoc.effective_date}
                onChange={(e) => setNewDoc({ ...newDoc, effective_date: e.target.value })}
                className="rounded border border-gold-border/30 bg-background/50 px-3 py-1.5 text-xs text-foreground focus:border-gold focus:outline-none"
              />
            </div>
          </div>
          <button
            type="submit"
            className="rounded bg-gold px-4 py-2 text-xs font-semibold text-background hover:bg-gold-hover transition-colors"
          >
            Đăng ký tài liệu
          </button>
        </form>
      )}

      {/* Filter Toolbar */}
      <div className="glass-panel rounded-xl p-4 border border-gold-border flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-foreground/50 font-mono uppercase">{vi.department}:</span>
          <div className="flex gap-1">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                  filterDept === dept
                    ? 'bg-gold/20 text-gold border border-gold/40'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 ml-0 sm:ml-auto">
          <span className="text-[10px] text-foreground/50 font-mono uppercase">Loại:</span>
          <div className="flex gap-1">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-all ${
                  filterType === t
                    ? 'bg-gold/20 text-gold border border-gold/40'
                    : 'text-foreground/70 hover:text-foreground'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Library Table */}
      <div className="glass-panel rounded-xl border border-gold-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground/80">
            <thead>
              <tr className="bg-gold-muted/10 border-b border-gold-border/20 text-gold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Tiêu đề</th>
                <th className="py-3 px-4">Loại</th>
                <th className="py-3 px-4">{vi.department}</th>
                <th className="py-3 px-4 text-center">{vi.version}</th>
                <th className="py-3 px-4">{vi.owner}</th>
                <th className="py-3 px-4">Ngày hiệu lực</th>
                <th className="py-3 px-4">{vi.createdAt}</th>
                <th className="py-3 px-4 text-right">{vi.status}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold-border/10">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gold-muted/5 transition-colors">
                    <td className="py-3 px-4 font-medium font-serif-cormorant text-sm text-foreground">{doc.title}</td>
                    <td className="py-3 px-4 font-mono text-[10px]">{doc.document_type}</td>
                    <td className="py-3 px-4 text-foreground/75">{doc.department}</td>
                    <td className="py-3 px-4 text-center font-mono text-[10px] text-gold">{doc.version}</td>
                    <td className="py-3 px-4">{doc.owner}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-foreground/60">{doc.effective_date}</td>
                    <td className="py-3 px-4 font-mono text-[10px] text-foreground/60">{doc.created_at}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-block rounded px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${
                        doc.status === vi.approved
                          ? 'bg-green-500/10 border border-green-500/25 text-green-500'
                          : doc.status === vi.pendingReview
                          ? 'bg-blue-500/10 border border-blue-500/25 text-blue-500'
                          : 'bg-yellow-500/10 border border-yellow-500/25 text-yellow-500'
                      }`}>
                        {doc.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-foreground/40 font-serif-cormorant italic text-base">
                    Không tìm thấy tài liệu phù hợp với bộ lọc.
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
