# Nexus Enterprise AI — Backend Infrastructure Guide

This directory contains the production-grade backend for **Nexus**, powered by **Supabase** (PostgreSQL, pgvector, Auth, RLS) and a **Dual Google Gemini Key Management Engine** with intelligent workload routing and automated failover.

---

## Phase 1: Supabase Zero-to-One Setup Checklist

Follow these exact steps in the [Supabase Dashboard](https://supabase.com/dashboard) to bootstrap your project securely from scratch:

### 1. Project Creation
1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) and sign in.
2. Click **"New Project"**.
3. **Organization:** Select or create your company organization.
4. **Name:** Enter `nexus-enterprise-ai`.
5. **Database Password:** Click **Generate a password** and securely save it in your company password manager (1Password / Bitwarden).
6. **Region:** Select the region closest to your enterprise infrastructure (e.g., `East US (North Virginia)` or `West Europe`).
7. **Pricing Plan:** Select `Free` (for development) or `Pro` (for production with dedicated pooling).
8. Click **"Create new project"** and wait ~90 seconds for provisioning.

### 2. Enable Database Extensions
1. In the left navigation, click **Database** &rarr; **Extensions**.
2. Search for `vector` and toggle on **`vector` (pgvector)**.
3. Verify that `uuid-ossp` and `pgcrypto` are active.

### 3. Run Foundational SQL Schema
1. In the left navigation, click **SQL Editor**.
2. Click **"New query"**.
3. Copy and paste the entire contents of [`backend/schema.sql`](./schema.sql).
4. Click **"Run"** (or press <kbd>Ctrl</kbd> + <kbd>Enter</kbd>).
5. Verify in **Table Editor** that the following tables now exist with Row Level Security (RLS) enabled:
   * `organizations`
   * `profiles`
   * `documents` (with 768-dim vector embedding column & HNSW index)
   * `ai_interactions_log`
   * `agent_workflows`

### 4. Copy API Credentials
1. In the left navigation, click **Project Settings** (gear icon) &rarr; **API**.
2. Copy the following credentials into your `.env` file:
   * **Project URL** &rarr; `SUPABASE_URL`
   * **Project API Keys `anon` `public`** &rarr; `SUPABASE_ANON_KEY`
   * **Project API Keys `service_role` (secret)** &rarr; `SUPABASE_SERVICE_ROLE_KEY` *(Never expose to clients!)*

---

## Phase 2: Dual Gemini API Key Strategy

The backend initializes two separate API keys and manages them through `GeminiService`:

```
Incoming Request: POST /api/generate
             │
             ▼
   [ Workload Router ]
             │
  ┌──────────┴──────────┐
  ▼                     ▼
taskComplexity:       taskComplexity:
"fast"                "reasoning"
  │                     │
  ▼                     ▼
[ KEY 1: Flash ]      [ KEY 2: Pro ]
Gemini 1.5 Flash      Gemini 1.5 Pro
  │                     │
  ▼                     ▼
Did it hit 429 / Rate Limit / Timeout?
  ├─ No ──────────────► Return result (failoverTriggered: false)
  └─ YES: Catch 429
       │
       ▼
  [ AUTOMATIC FAILOVER RETRY ]
  Switch to alternate key with backoff
  (Key 1 -> Key 2 or Key 2 -> Key 1)
       │
       ▼
  Return result (failoverTriggered: true)
```

1. **Workload Routing:**
   * **`GEMINI_API_KEY_1` (Key 1):** Configured for high-speed, lightweight tasks (`taskComplexity: "fast"`). Uses `gemini-1.5-flash` for low latency and high RPM quotas.
   * **`GEMINI_API_KEY_2` (Key 2):** Configured for complex reasoning tasks (`taskComplexity: "reasoning"`). Uses `gemini-1.5-pro` for multi-step audits, math reconciliation, and code rollbacks.
2. **Failover / Rate-Limit Protection:**
   * If Key 1 triggers `HTTP 429 (Too Many Requests / Quota Exceeded)` or `HTTP 503 / Timeout`, the service catches the error and immediately dispatches the request through Key 2.
   * The response payload includes `metadata.failoverTriggered: true` and `metadata.keyAliasUsed` to preserve observability.

---

## Phase 3: Running the Backend

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your values:
```bash
cp .env.example .env
```

### 3. Start Development Server
```bash
npm run dev
```
The server will start on `http://localhost:4000`.

### 4. Test Health Check
```bash
curl http://localhost:4000/api/health
```

### 5. Test AI Generation Endpoint
```bash
curl -X POST http://localhost:4000/api/generate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <YOUR_SUPABASE_USER_JWT>" \
  -d '{
    "prompt": "Compare our Q3 cloud spending against the approved budget.",
    "taskComplexity": "fast"
  }'
```

Expected Response:
```json
{
  "success": true,
  "text": "Based on the Q3 financial records, total cloud compute expenditure was $842,500...",
  "metadata": {
    "modelUsed": "gemini-1.5-flash",
    "keyAliasUsed": "GEMINI_KEY_1",
    "failoverTriggered": false,
    "taskComplexity": "fast",
    "promptTokens": 18,
    "completionTokens": 142,
    "totalTokens": 160,
    "latencyMs": 482
  }
}
```
All prompts, responses, token counts, latency, and failover status are asynchronously recorded in the Supabase `ai_interactions_log` table without blocking client response times.
