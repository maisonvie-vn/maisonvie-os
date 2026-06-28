-- Seed Initial MVOS Studio Data
-- Enforce conflict handling: ON CONFLICT DO NOTHING to avoid duplicate errors

-- 1. SEED EPICS
INSERT INTO epics (id, epic_code, title, description, status, priority, owner, sprint, progress, version)
VALUES
    ('00000000-0000-0000-0000-000000000000', 'EPIC-000', 'MVOS Studio', 'Hệ thống quản trị dự án nội bộ và tiến độ phát triển MVOS.', 'Approved', 'High', 'Kiến trúc sư trưởng', 'Sprint 1', 10, 'v0.3.0'),
    ('00000000-0000-0000-0000-000000000001', 'EPIC-001', 'Enterprise Architecture', 'Đặc tả và cấu trúc kiến trúc doanh nghiệp Maison Vie.', 'Approved', 'High', 'Kiến trúc sư trưởng', 'Sprint 1', 100, 'v0.2.0'),
    ('00000000-0000-0000-0000-000000000002', 'EPIC-002', 'Reservation & Email OS', 'Quy trình định tuyến đặt bàn và thông báo tự động cho khách hàng.', 'Draft', 'High', 'Bộ phận vận hành', 'Sprint 2', 0, 'v0.4.0'),
    ('00000000-0000-0000-0000-000000000003', 'EPIC-003', 'Document Engine', 'Hệ thống quản lý tài liệu quy trình SOP và chính sách nội bộ.', 'Draft', 'Medium', 'Bộ phận vận hành', 'Sprint 3', 0, 'v0.5.0'),
    ('00000000-0000-0000-0000-000000000004', 'EPIC-004', 'Knowledge Engine', 'Công cụ quản lý tri thức và hướng dẫn nhân viên phục vụ.', 'Draft', 'Medium', 'Bộ phận vận hành', 'Sprint 3', 0, 'v0.6.0'),
    ('00000000-0000-0000-0000-000000000005', 'EPIC-005', 'FOH OS', 'Giao diện quản lý đặt bàn và quy trình tiếp đón sảnh.', 'Draft', 'High', 'Bộ phận lễ tân', 'Sprint 4', 0, 'v0.7.0'),
    ('00000000-0000-0000-0000-000000000006', 'EPIC-006', 'Kitchen OS', 'Hệ điều hành phối hợp bếp ăn và thực đơn nếm thử.', 'Draft', 'High', 'Bếp trưởng', 'Sprint 4', 0, 'v0.8.0'),
    ('00000000-0000-0000-0000-000000000007', 'EPIC-007', 'Inventory OS', 'Hệ thống kiểm soát nguyên vật liệu và quản lý nhà cung cấp.', 'Draft', 'Medium', 'Bộ phận kho', 'Sprint 5', 0, 'v0.9.0'),
    ('00000000-0000-0000-0000-000000000008', 'EPIC-008', 'Accounting OS', 'Đối soát tài chính két, lập hóa đơn VAT và báo cáo doanh thu.', 'Draft', 'High', 'Kế toán trưởng', 'Sprint 5', 0, 'v1.0.0'),
    ('00000000-0000-0000-0000-000000000009', 'EPIC-009', 'CEO Dashboard', 'Trung tâm tổng hợp số liệu và ra quyết định chiến lược cho ban giám đốc.', 'Draft', 'High', 'CEO', 'Sprint 6', 0, 'v1.1.0')
ON CONFLICT (epic_code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    owner = EXCLUDED.owner,
    sprint = EXCLUDED.sprint,
    progress = EXCLUDED.progress,
    version = EXCLUDED.version;

-- 2. SEED FEATURES (For EPIC-000)
INSERT INTO features (id, feature_code, epic_id, title, description, status, priority, owner, progress, version)
VALUES
    ('f0000000-0000-0000-0000-000000000001', 'FEATURE-0001', '00000000-0000-0000-0000-000000000000', 'Epic Management', 'Giao diện quản lý danh sách yêu cầu cấp cao.', 'Approved', 'High', 'Kỹ sư Antigravity', 100, 'v0.3.0'),
    ('f0000000-0000-0000-0000-000000000002', 'FEATURE-0002', '00000000-0000-0000-0000-000000000000', 'Feature Management', 'Giao diện phân rã các tính năng nghiệp vụ.', 'Approved', 'High', 'Kỹ sư Antigravity', 100, 'v0.3.0'),
    ('f0000000-0000-0000-0000-000000000003', 'FEATURE-0003', '00000000-0000-0000-0000-000000000000', 'Specification Library', 'Thư viện đặc tả kỹ thuật dự án.', 'Approved', 'Medium', 'Kỹ sư Antigravity', 100, 'v0.3.0'),
    ('f0000000-0000-0000-0000-000000000004', 'FEATURE-0004', '00000000-0000-0000-0000-000000000000', 'Task Management', 'Giao diện quản lý đầu việc kỹ thuật chi tiết.', 'Approved', 'High', 'Kỹ sư Antigravity', 100, 'v0.3.0'),
    ('f0000000-0000-0000-0000-000000000005', 'FEATURE-0005', '00000000-0000-0000-0000-000000000000', 'Architecture Decision Records', 'Lưu trữ các quyết định thiết kế kiến trúc (ADR).', 'Approved', 'Medium', 'Kỹ sư Antigravity', 100, 'v0.3.0'),
    ('f0000000-0000-0000-0000-000000000006', 'FEATURE-0006', '00000000-0000-0000-0000-000000000000', 'Release Notes', 'Lịch sử phát hành các phiên bản phần mềm.', 'Approved', 'Medium', 'Kỹ sư Antigravity', 100, 'v0.3.0'),
    ('f0000000-0000-0000-0000-000000000007', 'FEATURE-0007', '00000000-0000-0000-0000-000000000000', 'Change Requests', 'Nhật ký yêu cầu thay đổi (RFC).', 'Approved', 'High', 'Kỹ sư Antigravity', 100, 'v0.3.0'),
    ('f0000000-0000-0000-0000-000000000008', 'FEATURE-0008', '00000000-0000-0000-0000-000000000000', 'Enterprise Dictionary', 'Từ điển các khái niệm nghiệp vụ lõi.', 'Draft', 'High', 'Kỹ sư Antigravity', 0, 'v0.4.0')
ON CONFLICT (feature_code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    owner = EXCLUDED.owner,
    progress = EXCLUDED.progress,
    version = EXCLUDED.version;

-- 3. SEED SPECIFICATIONS
INSERT INTO specifications (id, spec_code, feature_id, title, description, status, version, owner, reviewer, approved_at, file_path)
VALUES
    ('s0000000-0000-0000-0000-000000000001', 'SPEC-0001', 'f0000000-0000-0000-0000-000000000001', 'MVOS Project Governance', 'Đặc tả các quy định phát triển, phân vai kỹ sư phát triển và trưởng dự án.', 'Approved', 'v1.0', 'Kiến trúc sư trưởng', 'Hội đồng quản trị', CURRENT_TIMESTAMP, '/docs/00_project/AI_DEVELOPMENT_RULES.md'),
    ('s0000000-0000-0000-0000-000000000002', 'SPEC-0002', 'f0000000-0000-0000-0000-000000000008', 'MVOS Language Policy', 'Đặc tả chính sách ngôn ngữ (Tiếng Việt trên UI, Tiếng Anh trong Code).', 'Approved', 'v1.0', 'Kiến trúc sư trưởng', 'Hội đồng quản trị', CURRENT_TIMESTAMP, '/docs/00_project/LANGUAGE_POLICY.md'),
    ('s0000000-0000-0000-0000-000000000003', 'SPEC-0003', 'f0000000-0000-0000-0000-000000000005', 'MVOS Enterprise Architecture', 'Đặc tả kiến trúc hệ thống tổng quan của biệt thự.', 'Approved', 'v1.0', 'Kiến trúc sư trưởng', 'Kiến trúc sư trưởng', CURRENT_TIMESTAMP, '/specifications/SPEC_001_ENTERPRISE_ARCHITECTURE.md'),
    ('s0000000-0000-0000-0000-000000000004', 'SPEC-0004', 'f0000000-0000-0000-0000-000000000005', 'Business Capability Map', 'Ánh xạ 12 Core Domains vận hành thực tế.', 'Approved', 'v1.0', 'Kiến trúc sư trưởng', 'Kiến trúc sư trưởng', CURRENT_TIMESTAMP, '/specifications/SPEC_002_BUSINESS_CAPABILITY_MAP.md'),
    ('s0000000-0000-0000-0000-000000000005', 'SPEC-0005', 'f0000000-0000-0000-0000-000000000004', 'MVOS Studio Specification', 'Yêu cầu nghiệp vụ phân hệ quản trị dự án Studio.', 'Approved', 'v1.0', 'Kỹ sư Antigravity', 'Kiến trúc sư trưởng', CURRENT_TIMESTAMP, '/specifications/SPEC_005_PERMISSION_ARCHITECTURE.md')
ON CONFLICT (spec_code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    version = EXCLUDED.version,
    owner = EXCLUDED.owner,
    reviewer = EXCLUDED.reviewer,
    approved_at = EXCLUDED.approved_at,
    file_path = EXCLUDED.file_path;

-- 4. SEED TASKS
INSERT INTO tasks (id, task_code, feature_id, spec_id, title, description, status, priority, owner, acceptance_criteria, completed_at)
VALUES
    ('t0000000-0000-0000-0000-000000000001', 'TASK-0001', 'f0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000005', 'Build MVOS Studio Foundation', 'Xây dựng giao diện danh sách và thanh điều hướng phụ cho Studio.', 'Completed', 'High', 'Kỹ sư Antigravity', 'Tất cả các trang trong Studio mở được bình thường và hiển thị đúng tiếng Việt.', CURRENT_TIMESTAMP),
    ('t0000000-0000-0000-0000-000000000002', 'TASK-0002', 'f0000000-0000-0000-0000-000000000004', 's0000000-0000-0000-0000-000000000005', 'Seed MVOS Studio Initial Data', 'Lập file dữ liệu mẫu 003_mvos_studio_seed_data.sql chứa epics, features, tasks mẫu.', 'In_Progress', 'High', 'Kỹ sư Antigravity', 'Có file seed_data.sql và hiển thị tổng số liệu thống kê ở trang tổng quan Studio.', NULL),
    ('t0000000-0000-0000-0000-000000000003', 'TASK-0003', 'f0000000-0000-0000-0000-000000000008', 's0000000-0000-0000-0000-000000000002', 'Build Enterprise Dictionary Foundation', 'Xây dựng giao diện tra cứu từ điển thuật ngữ doanh nghiệp nội bộ.', 'Planned', 'Medium', 'Kỹ sư Antigravity', 'Trang từ điển doanh nghiệp hoạt động hiển thị đầy đủ giải nghĩa từ vựng.', NULL),
    ('t0000000-0000-0000-0000-000000000004', 'TASK-0004', 'f0000000-0000-0000-0000-000000000001', 's0000000-0000-0000-0000-000000000003', 'Build Reservation & Email OS Foundation', 'Xây dựng phân hệ đặt bàn, kết nối mẫu email thông báo và RLS liên quan.', 'Planned', 'High', 'Kỹ sư Antigravity', 'Chức năng đặt bàn hoạt động ngoại tuyến và hiển thị danh sách VIP.', NULL)
ON CONFLICT (task_code) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    status = EXCLUDED.status,
    priority = EXCLUDED.priority,
    owner = EXCLUDED.owner,
    acceptance_criteria = EXCLUDED.acceptance_criteria,
    completed_at = EXCLUDED.completed_at;

-- 5. SEED ARCHITECTURE DECISIONS
INSERT INTO architecture_decisions (id, adr_code, title, context, decision, consequences, status, owner)
VALUES
    ('a0000000-0000-0000-0000-000000000001', 'ADR-0001', 'Use GitHub as Source of Truth', 'Mã nguồn và tài liệu quy chuẩn kỹ thuật cần được lưu vết tập trung.', 'Sử dụng GitHub làm kho lưu trữ duy nhất cho mã nguồn và tài liệu kiến trúc chính thức.', 'Lịch sử thay đổi được bảo toàn và có khả năng rollback khi cần thiết.', 'Approved', 'Kiến trúc sư trưởng'),
    ('a0000000-0000-0000-0000-000000000002', 'ADR-0002', 'Use Vercel for Deployment', 'Cần môi trường lưu trữ front-end tốc độ cao, hỗ trợ serverless và phân phối tĩnh toàn cầu.', 'Sử dụng nền tảng Vercel làm nơi triển khai các bản dựng tĩnh và máy chủ biên Next.js.', 'Tốc độ tải trang tối ưu cho khu vực tiếp khách sảnh.', 'Approved', 'Kiến trúc sư trưởng'),
    ('a0000000-0000-0000-0000-000000000003', 'ADR-0003', 'Use Supabase for Database and Auth', 'Hệ thống cần lưu trữ dữ liệu quan hệ an toàn, hỗ trợ cập nhật thời gian thực và quản lý tài khoản.', 'Ủy quyền lưu trữ dữ liệu cho Supabase PostgreSQL và quản lý đăng nhập thông qua Supabase Auth.', 'Giảm thiểu thời gian phát triển máy chủ backend.', 'Approved', 'Hội đồng kỹ thuật'),
    ('a0000000-0000-0000-0000-000000000004', 'ADR-0004', 'Frontend UI Must Be Vietnamese', 'Giao diện hệ thống cần thân thiện với nhân viên phục vụ nội bộ tại Việt Nam.', 'Toàn bộ nội dung hiển thị ở giao diện người dùng phải sử dụng 100% tiếng Việt.', 'Nhân viên dễ tiếp cận và thao tác chuẩn quy trình SOP.', 'Approved', 'Chủ biệt thự'),
    ('a0000000-0000-0000-0000-000000000005', 'ADR-0005', 'AI Agents Must Follow Specifications', 'Các tác nhân AI tự động cần hoạt động đúng ranh giới nghiệp vụ mà không tự ý sửa đổi kiến trúc.', 'Tác nhân AI chỉ thực thi nhiệm vụ trong các file đặc tả chính thức, không thiết kế kiến trúc mới.', 'Tránh các quyết định sai lệch ảnh hưởng đến hoạt động thực tế.', 'Approved', 'Hội đồng quản trị')
ON CONFLICT (adr_code) DO UPDATE SET
    title = EXCLUDED.title,
    context = EXCLUDED.context,
    decision = EXCLUDED.decision,
    consequences = EXCLUDED.consequences,
    status = EXCLUDED.status,
    owner = EXCLUDED.owner;

-- 6. SEED RELEASE NOTES
INSERT INTO release_notes (id, release_code, version, title, description, release_date, status)
VALUES
    ('r0000000-0000-0000-0000-000000000001', 'REL-010', 'MVOS v0.1', 'Foundation Release', 'Phát hành bản dựng nền tảng Next.js, i18n tiếng Việt, RLS và MVOS Studio.', CURRENT_DATE, 'In_Progress')
ON CONFLICT (release_code) DO UPDATE SET
    version = EXCLUDED.version,
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    release_date = EXCLUDED.release_date,
    status = EXCLUDED.status;
