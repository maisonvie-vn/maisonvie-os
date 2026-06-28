export const vi = {
  // Navigation
  dashboard: 'Bảng điều khiển',
  documents: 'Tài liệu',
  sop: 'Quy trình vận hành',
  architecture: 'Kiến trúc',
  studio: 'Studio',
  reservationsMenu: 'Đặt bàn',
  emailsMenu: 'Email',
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
  priority: 'Mức ưu tiên',
  progress: 'Tiến độ',

  // Status values
  approved: 'Đã duyệt',
  draft: 'Bản nháp',
  pendingReview: 'Chờ duyệt',
  inProgress: 'Đang làm',
  completed: 'Hoàn thành',

  // Studio terms
  projectOverview: 'Tổng quan dự án',
  epic: 'Epic',
  feature: 'Tính năng',
  spec: 'Đặc tả',
  task: 'Công việc',
  adr: 'Quyết định kiến trúc',
  release: 'Phiên bản phát hành',
  changeRequest: 'Yêu cầu thay đổi',
  ceoDashboard: 'Dashboard CEO',
  learningMenu: 'Học tập vận hành',
  improvementMenu: 'Hành động cải tiến',
  sopMenu: 'SOP vận hành',
  trainingMenu: 'Đào tạo SOP',
  checklistMenu: 'Checklist vận hành',
  dailyReportMenu: 'Báo cáo ngày',
  feedbackMenu: 'Phản hồi khách',
  recoveryMenu: 'Phục hồi khách',
  partnerMenu: 'Đối tác TA',
  tourMenu: 'Đoàn tour',
  eventMenu: 'Sự kiện',
  menuMenu: 'Thực đơn',
  recipeMenu: 'Công thức',
} as const

export type Translations = typeof vi
