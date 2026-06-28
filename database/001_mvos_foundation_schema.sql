-- Maison Vie Operating System (MVOS) Foundation Schema v0.1
-- Created: 2026-06-28
-- Description: Core database tables for departments, roles, user profiles, documents, SOPs, AI agents, and audit logging.

-- ============================================================================
-- 1. TABLES CREATION (If they do not exist)
-- ============================================================================

-- Departments
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Roles
CREATE TABLE IF NOT EXISTS roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(name, department_id)
);

-- Permissions
CREATE TABLE IF NOT EXISTS permissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Role Permissions Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  permission_id uuid REFERENCES permissions(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (role_id, permission_id)
);

-- User Profiles (linked to Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL UNIQUE,
  first_name text,
  last_name text,
  role_id uuid REFERENCES roles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Documents Library
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  document_type text NOT NULL, -- e.g. 'SOP', 'GUIDELINE', 'POLICY', 'CHARTER'
  department_id uuid REFERENCES departments(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'DRAFT', -- 'DRAFT', 'REVIEW', 'APPROVED', 'ARCHIVED'
  version text NOT NULL DEFAULT '1.0',
  owner_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  effective_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Document Versions (Audit Trail of file/content modifications)
CREATE TABLE IF NOT EXISTS document_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id uuid REFERENCES documents(id) ON DELETE CASCADE,
  version_string text NOT NULL,
  file_path text,
  changelog text,
  created_by uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Standard Operating Procedure (SOP) specific metadata
CREATE TABLE IF NOT EXISTS sop_documents (
  document_id uuid PRIMARY KEY REFERENCES documents(id) ON DELETE CASCADE,
  review_frequency_days integer DEFAULT 365 NOT NULL,
  next_review_date timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Business Rules (system logic rules for operations)
CREATE TABLE IF NOT EXISTS business_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  rule_logic jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Autonomous AI Agents Status & Directory
CREATE TABLE IF NOT EXISTS ai_agents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  purpose text NOT NULL,
  status text NOT NULL DEFAULT 'INACTIVE', -- 'ACTIVE', 'INACTIVE', 'ERROR'
  last_active_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- System Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES user_profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_table text NOT NULL,
  target_id uuid,
  details jsonb,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sop_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 3. RLS POLICIES DEFINITION
-- ============================================================================

-- General Read Policy for Static Configuration (Authenticated users can read)
CREATE POLICY "Allow read for authenticated users" ON departments 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON roles 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON permissions 
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow read for authenticated users" ON role_permissions 
  FOR SELECT TO authenticated USING (true);

-- User Profiles: Everyone authenticated can view, but only owners can update their own
CREATE POLICY "Allow read for authenticated users" ON user_profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow update for profile owners" ON user_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Documents: Authenticated users can view all documents, owners can manage them
CREATE POLICY "Allow read for authenticated users" ON documents
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for authenticated owners" ON documents
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Allow update for owners" ON documents
  FOR UPDATE TO authenticated USING (auth.uid() = owner_id);

-- Document Versions: Read by all authenticated, insert by document owner/creator
CREATE POLICY "Allow read for authenticated users" ON document_versions
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for document version creators" ON document_versions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

-- SOP Documents: Read by all authenticated, modified by system
CREATE POLICY "Allow read for authenticated users" ON sop_documents
  FOR SELECT TO authenticated USING (true);

-- Business Rules: Read by all authenticated
CREATE POLICY "Allow read for authenticated users" ON business_rules
  FOR SELECT TO authenticated USING (true);

-- AI Agents: Read by all authenticated
CREATE POLICY "Allow read for authenticated users" ON ai_agents
  FOR SELECT TO authenticated USING (true);

-- Audit Logs: Read and insert by authenticated users (only system inserts details, but we allow user profiling actions)
CREATE POLICY "Allow select for audit logs" ON audit_logs
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow insert for audit logs" ON audit_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
