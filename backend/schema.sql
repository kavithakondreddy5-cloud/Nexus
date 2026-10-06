-- ============================================================================
-- NEXUS ENTERPRISE AI: FOUNDATIONAL DATABASE SCHEMA
-- PostgreSQL + pgvector + Supabase Row Level Security (RLS)
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector"; -- pgvector for semantic RAG search

-- ============================================================================
-- 2. Organizations & Multi-Tenant Boundaries
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    tier TEXT NOT NULL DEFAULT 'enterprise' CHECK (tier IN ('starter', 'growth', 'enterprise')),
    settings JSONB NOT NULL DEFAULT '{"data_retention_days": 90, "pii_redaction_enabled": true}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 3. User Profiles (Extends Supabase auth.users)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE RESTRICT,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('super_admin', 'admin', 'manager', 'member', 'read_only')),
    security_clearance_level INT NOT NULL DEFAULT 1 CHECK (security_clearance_level BETWEEN 1 AND 5),
    acl_groups TEXT[] NOT NULL DEFAULT ARRAY['general']::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ============================================================================
-- 4. Enterprise Documents & Knowledge Base (pgvector for RAG)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    source_type TEXT NOT NULL CHECK (source_type IN ('salesforce', 'jira', 'workday', 'sap', 'sharepoint', 'google_drive', 'manual_upload')),
    external_id TEXT, -- Original ID in Salesforce/SharePoint
    content TEXT NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb, -- author, file_size, last_modified, etc.
    acl_groups TEXT[] NOT NULL DEFAULT ARRAY['general']::TEXT[], -- Inherited ACLs from source system
    embedding vector(768), -- 768 dimensions for Google Gemini text-embedding-004
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- HNSW Vector Index for sub-50ms Approximate Nearest Neighbor (ANN) search
CREATE INDEX IF NOT EXISTS idx_documents_embedding_hnsw 
ON public.documents 
USING hnsw (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS idx_documents_org_acl 
ON public.documents (org_id, acl_groups);

-- ============================================================================
-- 5. AI Interactions & Audit Logging
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.ai_interactions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    endpoint TEXT NOT NULL DEFAULT '/api/generate',
    task_complexity TEXT NOT NULL CHECK (task_complexity IN ('fast', 'reasoning')),
    model_requested TEXT NOT NULL,
    model_resolved TEXT NOT NULL,
    key_alias_used TEXT NOT NULL CHECK (key_alias_used IN ('GEMINI_KEY_1', 'GEMINI_KEY_2')),
    failover_triggered BOOLEAN NOT NULL DEFAULT FALSE,
    prompt_text TEXT NOT NULL,
    response_text TEXT,
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    total_tokens INT DEFAULT 0,
    latency_ms INT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'rate_limited', 'failed')),
    error_details TEXT,
    client_ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_ai_interactions_org_user 
ON public.ai_interactions_log (org_id, user_id, created_at DESC);

-- ============================================================================
-- 6. Human-in-the-Loop (HITL) Workflow Execution Table
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.agent_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    workflow_type TEXT NOT NULL CHECK (workflow_type IN ('vendor_onboarding', 'expense_reconciliation', 'incident_rollback', 'contract_audit', 'capacity_requisition')),
    status TEXT NOT NULL DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'executing', 'completed', 'rejected')),
    risk_level TEXT NOT NULL DEFAULT 'medium' CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    target_system TEXT NOT NULL,
    payload JSONB NOT NULL,
    diff_preview JSONB NOT NULL,
    requested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    review_notes TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_agent_workflows_org_status 
ON public.agent_workflows (org_id, status);

-- ============================================================================
-- 7. Row Level Security (RLS) Configuration
-- ============================================================================

-- Enable RLS across all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_interactions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_workflows ENABLE ROW LEVEL SECURITY;

-- Helper Function: Get current authenticated user's org_id
CREATE OR REPLACE FUNCTION public.current_user_org_id() 
RETURNS UUID AS $$
  SELECT org_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper Function: Get current user's ACL groups
CREATE OR REPLACE FUNCTION public.current_user_acl_groups() 
RETURNS TEXT[] AS $$
  SELECT acl_groups FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles Policies
CREATE POLICY "Users can view profiles in their own organization"
ON public.profiles FOR SELECT
USING (org_id = public.current_user_org_id());

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (id = auth.uid());

-- Documents Policies (Multi-tenant + Permission-Aware ACLs)
CREATE POLICY "Users can search documents in their org matching their ACLs"
ON public.documents FOR SELECT
USING (
  org_id = public.current_user_org_id() 
  AND acl_groups && public.current_user_acl_groups()
);

-- AI Interactions Policies (Auditing)
CREATE POLICY "Users can view their own AI interaction logs"
ON public.ai_interactions_log FOR SELECT
USING (
  org_id = public.current_user_org_id() 
  AND user_id = auth.uid()
);

CREATE POLICY "Admins can view all org AI interaction logs"
ON public.ai_interactions_log FOR SELECT
USING (
  org_id = public.current_user_org_id() 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('admin', 'super_admin')
  )
);

-- Workflows Policies
CREATE POLICY "Org members can view workflows in their org"
ON public.agent_workflows FOR SELECT
USING (org_id = public.current_user_org_id());

CREATE POLICY "Managers and Admins can approve or update workflows"
ON public.agent_workflows FOR UPDATE
USING (
  org_id = public.current_user_org_id() 
  AND EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('manager', 'admin', 'super_admin')
  )
);

-- ============================================================================
-- 8. Hybrid Semantic RAG Matching RPC Function
-- ============================================================================
CREATE OR REPLACE FUNCTION public.match_enterprise_documents(
  query_embedding vector(768),
  match_threshold FLOAT DEFAULT 0.70,
  match_count INT DEFAULT 5
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  source_type TEXT,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id,
    d.title,
    d.source_type,
    d.content,
    d.metadata,
    1 - (d.embedding <=> query_embedding) AS similarity
  FROM public.documents d
  WHERE d.org_id = public.current_user_org_id()
    AND d.acl_groups && public.current_user_acl_groups()
    AND 1 - (d.embedding <=> query_embedding) > match_threshold
  ORDER BY d.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
