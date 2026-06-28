-- Migration: Build MVOS Studio Foundation
-- Only create tables if they do not exist.

-- 1. EPICS TABLE
CREATE TABLE IF NOT EXISTS epics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    epic_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    priority VARCHAR(50) DEFAULT 'Medium',
    owner VARCHAR(100),
    sprint VARCHAR(50),
    progress INTEGER DEFAULT 0,
    version VARCHAR(50),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 2. FEATURES TABLE
CREATE TABLE IF NOT EXISTS features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_code VARCHAR(50) UNIQUE NOT NULL,
    epic_id UUID REFERENCES epics(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    priority VARCHAR(50) DEFAULT 'Medium',
    owner VARCHAR(100),
    progress INTEGER DEFAULT 0,
    version VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- 3. SPECIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS specifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spec_code VARCHAR(50) UNIQUE NOT NULL,
    feature_id UUID REFERENCES features(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    version VARCHAR(50),
    owner VARCHAR(100),
    reviewer VARCHAR(100),
    approved_at TIMESTAMP WITH TIME ZONE,
    file_path VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TASKS TABLE
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_code VARCHAR(50) UNIQUE NOT NULL,
    feature_id UUID REFERENCES features(id) ON DELETE SET NULL,
    spec_id UUID REFERENCES specifications(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    priority VARCHAR(50) DEFAULT 'Medium',
    owner VARCHAR(100),
    acceptance_criteria TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 5. ARCHITECTURE DECISIONS TABLE
CREATE TABLE IF NOT EXISTS architecture_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    adr_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    context TEXT,
    decision TEXT,
    consequences TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    owner VARCHAR(100),
    decision_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. RELEASE NOTES TABLE
CREATE TABLE IF NOT EXISTS release_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    release_code VARCHAR(50) UNIQUE NOT NULL,
    version VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_date DATE,
    status VARCHAR(50) DEFAULT 'Draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. CHANGE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS change_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfc_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    reason TEXT,
    impact TEXT,
    status VARCHAR(50) DEFAULT 'Draft',
    requested_by VARCHAR(100),
    approved_by VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS for all tables
ALTER TABLE epics ENABLE ROW LEVEL SECURITY;
ALTER TABLE features ENABLE ROW LEVEL SECURITY;
ALTER TABLE specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE architecture_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE change_requests ENABLE ROW LEVEL SECURITY;

-- Create policies (Allows Authenticated users full read, and write/delete for development)
CREATE POLICY "Allow read access to authenticated users on epics" ON epics FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on epics" ON epics FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on features" ON features FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on features" ON features FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on specifications" ON specifications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on specifications" ON specifications FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on tasks" ON tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on tasks" ON tasks FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on architecture_decisions" ON architecture_decisions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on architecture_decisions" ON architecture_decisions FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on release_notes" ON release_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on release_notes" ON release_notes FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow read access to authenticated users on change_requests" ON change_requests FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow write access to authenticated users on change_requests" ON change_requests FOR ALL TO authenticated USING (true);
