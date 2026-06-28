-- Seed Enterprise Dictionary Terms
-- Enforce conflict handling: ON CONFLICT DO NOTHING to avoid duplicate errors

INSERT INTO enterprise_terms (term_code, term_name, vietnamese_name, english_name, domain, definition, business_owner, related_module, related_database_table, related_workflow, related_kpi, status, version)
VALUES
    ('TERM-GUEST', 'Guest', 'Khách hàng', 'Guest', 'Guest & Reservation', 'Người sử dụng dịch vụ ăn uống và tham quan tại biệt thự Maison Vie.', 'FOH Lead', 'Guest & Reservation', 'guests', 'SOP-01: Đón tiếp khách VIP', 'Tỷ lệ khách quay lại', 'Approved', '1.0'),
    ('TERM-RESERV', 'Reservation', 'Đặt bàn', 'Reservation', 'Guest & Reservation', 'Hồ sơ đăng ký giữ chỗ trước của khách hàng cho một ngày giờ và bàn cụ thể.', 'FOH Lead', 'Guest & Reservation', 'reservations', 'SOP-01: Đón tiếp khách VIP', 'Tỷ lệ lấp đầy bàn VIP', 'Approved', '1.0'),
    ('TERM-MENU', 'Menu', 'Thực đơn', 'Menu', 'Menu & Recipe', 'Danh sách các món ăn và đồ uống được thiết kế phục vụ cho thực khách.', 'Bếp trưởng', 'Kitchen OS', 'menus', 'SOP-02: Phối hợp Bếp', 'Sự hài lòng thực đơn', 'Approved', '1.0'),
    ('TERM-RECIPE', 'Recipe', 'Công thức', 'Recipe', 'Menu & Recipe', 'Định lượng chi tiết thành phần nguyên liệu và các bước chế biến món ăn.', 'Bếp trưởng', 'Kitchen OS', 'recipes', 'SOP-02: Phối hợp Bếp', 'Độ hao hụt thành phẩm', 'Approved', '1.0'),
    ('TERM-INGRED', 'Ingredient', 'Nguyên liệu', 'Ingredient', 'Inventory & Purchasing', 'Thành phần thực phẩm thô phục vụ cho việc nấu nướng và pha chế.', 'Bếp trưởng', 'Inventory OS', 'ingredients', 'SOP-02: Phối hợp Bếp', 'Tỷ lệ hao hụt nguyên liệu', 'Approved', '1.0'),
    ('TERM-INVITEM', 'Inventory Item', 'Hàng tồn kho', 'Inventory Item', 'Inventory & Purchasing', 'Sản phẩm hoặc nguyên liệu được bảo quản trong kho hàng cần kiểm kê.', 'Thủ kho', 'Inventory OS', 'inventory_items', 'Đơn hàng mua sắm tự động', 'Chênh lệch tồn kho thực tế', 'Approved', '1.0'),
    ('TERM-SUPPL', 'Supplier', 'Nhà cung cấp', 'Supplier', 'Inventory & Purchasing', 'Đơn vị cung ứng thực phẩm hoặc dịch vụ bảo trì cho biệt thự.', 'Thủ kho', 'Inventory OS', 'vendors', 'Quy trình đặt hàng NCC', 'Độ tin cậy giao hàng', 'Approved', '1.0'),
    ('TERM-INVOI', 'Invoice', 'Hóa đơn', 'Invoice', 'Accounting & VAT', 'Chứng từ thanh toán ghi nhận giá trị giao dịch của thực khách.', 'Kế toán trưởng', 'Accounting OS', 'invoices', 'Quy trình thanh toán két', 'Doanh thu phòng ăn', 'Approved', '1.0'),
    ('TERM-VATINVOI', 'VAT Invoice', 'Hóa đơn VAT', 'VAT Invoice', 'Accounting & VAT', 'Hóa đơn tài chính chính thức có ghi nhận thuế giá trị gia tăng.', 'Kế toán trưởng', 'Accounting OS', 'tax_ledgers', 'Báo cáo thuế hàng tháng', 'Tuân thủ đối soát VAT', 'Approved', '1.0'),
    ('TERM-EMPLOY', 'Employee', 'Nhân sự', 'Employee', 'HR & Training', 'Hồ sơ thông tin nhân viên đang làm việc trực tiếp tại biệt thự.', 'CEO', 'Admin/HR Module', 'employees', 'Lập lịch ca làm việc', 'Tỷ lệ giữ chân nhân viên', 'Approved', '1.0'),
    ('TERM-SOP', 'SOP', 'Quy trình vận hành', 'SOP', 'Document & Knowledge', 'Tài liệu hướng dẫn từng bước chuẩn hóa nghiệp vụ phục vụ.', 'Kiến trúc sư trưởng', 'Document Engine', 'sop_documents', 'Kiểm tra SOP định kỳ', 'Điểm kiểm tra nghiệp vụ', 'Approved', '1.0'),
    ('TERM-TASK', 'Task', 'Công việc', 'Task', 'AI & Automation', 'Đầu việc chi tiết được phân công cho kỹ sư hoặc nhân viên thực hiện.', 'Kỹ sư Antigravity', 'MVOS Studio', 'tasks', 'Quy trình Sprint hàng tuần', 'Tỷ lệ hoàn thành nhiệm vụ', 'Approved', '1.0'),
    ('TERM-EPIC', 'Epic', 'Epic', 'Epic', 'CEO & Governance', 'Nhóm yêu cầu nghiệp vụ hoặc phân hệ tính năng lớn của hệ thống.', 'Kiến trúc sư trưởng', 'MVOS Studio', 'epics', 'Báo cáo tiến độ Sprint', 'Tốc độ hoàn thiện phân hệ', 'Approved', '1.0'),
    ('TERM-FEAT', 'Feature', 'Tính năng', 'Feature', 'CEO & Governance', 'Đơn vị tính năng nghiệp vụ được phân rã cụ thể từ các Epic.', 'Kiến trúc sư trưởng', 'MVOS Studio', 'features', 'Báo cáo tiến độ Sprint', 'Mật độ tính năng hoàn thành', 'Approved', '1.0'),
    ('TERM-SPEC', 'Specification', 'Đặc tả', 'Specification', 'Document & Knowledge', 'Tài liệu mô tả chi tiết yêu cầu kỹ thuật và luồng dữ liệu.', 'Kiến trúc sư trưởng', 'MVOS Studio', 'specifications', 'Đánh giá kỹ thuật định kỳ', 'Độ chính xác đặc tả', 'Approved', '1.0'),
    ('TERM-AGNT', 'AI Agent', 'AI Agent', 'AI Agent', 'AI & Automation', 'Tác nhân trí tuệ nhân tạo chạy ngầm hỗ trợ tự động hóa nghiệp vụ.', 'Kiến trúc sư trưởng', 'Agent Platform', 'ai_agents', 'Giám sát hoạt động Agent', 'Thời gian hoạt động liên tục', 'Approved', '1.0')
ON CONFLICT (term_code) DO UPDATE SET
    term_name = EXCLUDED.term_name,
    vietnamese_name = EXCLUDED.vietnamese_name,
    english_name = EXCLUDED.english_name,
    domain = EXCLUDED.domain,
    definition = EXCLUDED.definition,
    business_owner = EXCLUDED.business_owner,
    related_module = EXCLUDED.related_module,
    related_database_table = EXCLUDED.related_database_table,
    related_workflow = EXCLUDED.related_workflow,
    related_kpi = EXCLUDED.related_kpi,
    status = EXCLUDED.status,
    version = EXCLUDED.version;
