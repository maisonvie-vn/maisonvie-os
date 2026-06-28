export const vi = {
  // Navigation
  dashboard: 'Bảng điều khiển',
  documents: 'Tài liệu',
  sop: 'Quy trình vận hành',
  admin: 'Quản trị',
  settings: 'Cài đặt',

  // Actions
  save: 'Lưu',
  cancel: 'Hủy',
  create: 'Tạo mới',
  edit: 'Chỉnh sửa',
  delete: 'Xóa',
  search: 'Tìm kiếm',

  // Fields
  status: 'Trạng thái',
  version: 'Phiên bản',
  owner: 'Người phụ trách',
  department: 'Bộ phận',
  createdAt: 'Ngày tạo',
  updatedAt: 'Ngày cập nhật',

  // Status values
  approved: 'Đã duyệt',
  draft: 'Bản nháp',
  pendingReview: 'Chờ duyệt',
} as const

export type Translations = typeof vi
