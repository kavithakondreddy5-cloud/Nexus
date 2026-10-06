# Nexus — The Intelligent Enterprise Operations Hub

[![Architecture: Enterprise AI](https://img.shields.io/badge/Architecture-Enterprise%20AI-4F46E5.svg)](https://github.com/kavithakondreddy5-cloud/Nexus)
[![Database: Supabase + pgvector](https://img.shields.io/badge/Database-Supabase%20%7C%20pgvector-3ECF8E.svg)](https://supabase.com)
[![Models: Google Gemini](https://img.shields.io/badge/Models-Gemini%20Flash%20%26%20Pro-4285F4.svg)](https://ai.google.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-gray.svg)](LICENSE)

**Nexus** is an enterprise-grade AI Operations Platform and Intelligent Hub designed to unify fragmented SaaS tools (Salesforce, Jira, Workday, SAP, Google Drive, Snowflake) into a single, cohesive, agentic interface.

---

## 🌟 Key Features

1. **Ask Company AI (Permission-Aware RAG):**
   - Natural language search across enterprise knowledge bases with source citations.
   - Built with PostgreSQL `pgvector` (768-dim embeddings) and strict Row Level Security (RLS) inheriting source system ACLs.

2. **Dual Google Gemini Key Management & Routing:**
   - **Workload Routing:** Directs high-speed, extraction tasks to **Key 1 (`gemini-3.8-flash`)** and complex multi-step reasoning to **Key 2 (`gemini-3.1-pro-preview`)**.
   - **Failover & Rate-Limit Circuit:** Catches HTTP 429 quota and timeout errors automatically, seamlessly falling back across keys without downtime.

3. **Human-in-the-Loop (HITL) Safety Checkpoint:**
   - Multi-step agent workflows pause for human authorization whenever financial transactions (e.g. >$5,000) or infrastructure changes are required.

4. **"Apple-meets-Stripe" Interface:**
   - Clean, accessible design language with subtle shadows, Inter typography, and zero clutter.
   - Centralized **Omni-Search (`Ctrl+K`)** command bar with keyboard navigation and live filtering.
   - Real-time interactive Canvas charts and drag-and-drop dashboard widgets.

---

## 🏗️ Project Architecture

```
Nexus/
├── index.html              # Frontend Command Center UI
├── styles.css              # Apple-meets-Stripe Design System
├── app.js                  # Frontend interactive controller & charts
├── server.js               # Zero-dependency local frontend web server
├── test-routing.js         # Automated backend test suite
│
└── backend/                # Production-grade Node.js/TypeScript Backend
    ├── schema.sql          # Supabase PostgreSQL DDL + pgvector + RLS
    ├── test-routing.js     # Backend test runner
    ├── .env.example        # Environment variables template
    ├── package.json        # Backend dependencies & scripts
    ├── tsconfig.json       # TypeScript configuration
    └── src/
        ├── config/         # Zod environment & Supabase client factories
        ├── middleware/     # Supabase Auth Bearer JWT validator
        ├── services/       # Dual-key Gemini router & non-blocking audit logger
        ├── controllers/    # POST /api/generate handler
        ├── routes/         # Express router definitions
        └── server.ts       # HTTP application entry point
```

---

## 🚀 Quick Start Guide

### 1. Run the Frontend (Port 3000)
```powershell
node server.js
```
Open **`http://localhost:3000`** in your browser.

### 2. Configure & Start the Backend (Port 4000)
```powershell
cd backend
npm install
copy .env.example .env
# Edit .env with your Supabase & Gemini API keys
npm run dev
```

### 3. Run the Routing & Logging Test Suite
```powershell
node test-routing.js
```

---

## 🔒 Security & Data Governance

* **Zero Leaked Secrets:** Environment files (`.env`) are strictly excluded via `.gitignore`.
* **Multi-Tenant RLS:** Row Level Security policies ensure employees can only synthesize documents they have permission to view.
* **Audit Trail:** Every interaction, token count, and latency metric is asynchronously logged to the `ai_interactions_log` table.

---

## 📄 License
This project is licensed under the MIT License.
