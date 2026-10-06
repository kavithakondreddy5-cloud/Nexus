# Nexus — The Intelligent Enterprise Operations Hub

[![Architecture: Enterprise AI](https://img.shields.io/badge/Architecture-Enterprise%20AI-4F46E5.svg)](https://github.com/kavithakondreddy5-cloud/Nexus)
[![Database: Supabase + pgvector](https://img.shields.io/badge/Database-Supabase%20%7C%20pgvector-3ECF8E.svg)](https://supabase.com)
[![Models: Google Gemini](https://img.shields.io/badge/Models-Gemini%20Flash%20%26%20Pro-4285F4.svg)](https://ai.google.dev)
[![Deployment: Vercel & Render](https://img.shields.io/badge/Deploy-Vercel%20%26%20Render-black.svg)](https://vercel.com)

**Nexus** is an enterprise-grade AI Operations Platform and Intelligent Hub designed to unify fragmented SaaS tools (Salesforce, Jira, Workday, SAP, Google Drive, Snowflake) into a single, cohesive, agentic interface. 

With a newly upgraded **premium glassmorphism UI**, Nexus provides a stunning "Apple-meets-Stripe" experience, complete with micro-animations, aurora glows, and lightning-fast backend API connections.

---

## 🌟 Key Features

1. **Premium Glassmorphism Interface:**
   - A stunning, fully-responsive dashboard featuring frosted glass cards, dynamic animated gradients, and high-fidelity micro-animations.
   - Centralized **Omni-Search (`Ctrl+K`)** command bar with keyboard navigation and live filtering.
   - Designed to provide the best possible first impression with an ultra-premium aesthetic.

2. **Ask Company AI (Permission-Aware RAG):**
   - Natural language search across enterprise knowledge bases with source citations.
   - Built with PostgreSQL `pgvector` (768-dim embeddings) and strict Row Level Security (RLS) inheriting source system ACLs.

3. **Dual Google Gemini Key Management & Routing:**
   - **Workload Routing:** Directs high-speed, extraction tasks to **Key 1 (`gemini-3.8-flash`)** and complex multi-step reasoning to **Key 2 (`gemini-3.1-pro-preview`)**.
   - **Failover & Rate-Limit Circuit:** Catches HTTP 429 quota and timeout errors automatically, seamlessly falling back across keys without downtime.

4. **Human-in-the-Loop (HITL) Safety Checkpoint:**
   - Multi-step agent workflows pause for human authorization whenever financial transactions (e.g. >$5,000) or infrastructure changes are required.

---

## 🏗️ Project Architecture & Deployment Strategy

Nexus is decoupled into a static frontend (designed for Vercel) and a Node.js/Express backend (designed for Render).

```text
Nexus/
├── index.html              # Frontend UI structure
├── styles.css              # Frontend styling
├── app.js                  # Frontend logic & API connection
│
└── backend/                # Node.js/Express Backend API
    ├── package.json        # Backend dependencies
    └── src/
        └── server.ts       # Backend server entry point
```

---

## 🚀 Deployment Guide

### 1. Deploying the Backend (Render)

The backend is an Express.js API built with TypeScript. It is optimized to run seamlessly on Render.

1. Create a **Web Service** on [Render](https://dashboard.render.com).
2. Connect this GitHub repository.
3. Configure the following settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start` (which runs `node dist/server.js`)
4. Add the required Environment Variables (see the **Environment Variables** section below).
5. Click **Deploy**. Render will generate a public URL for you (e.g., `https://nexus-0n7h.onrender.com`).

### 2. Deploying the Frontend (Vercel)

The frontend is a pure HTML, CSS, and JS web application, requiring zero build steps. It is hardcoded to connect securely to your live Render backend.

1. Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New... > Project** and select this GitHub repository.
3. Keep the **Framework Preset** as `Other`.
4. Keep the **Root Directory** as `./` (the default root).
5. No Environment Variables are needed for the frontend!
6. Click **Deploy**. Vercel will instantly host your new premium UI.

---

## 💻 Local Development

If you wish to test or modify Nexus locally on your machine, follow these steps:

### 1. Start the Backend
```bash
cd backend
npm install
copy .env.example .env
# Edit .env and insert your API keys
npm run dev
```
*The backend will start locally on `http://localhost:4000`.*

### 2. Start the Frontend
Since the frontend is composed of static files, you can use any simple HTTP server:
```bash
# In the root folder (not backend)
npx serve .
```
*Or, simply open `index.html` directly in your web browser!*

---

## ⚙️ Environment Variables (Backend)

When deploying to Render or running locally, the backend requires the following environment variables (found in `backend/.env.example`):

| Variable Name | Description | Required? |
|--------------|-------------|-----------|
| `NODE_ENV` | Must be set to `production` on Render or `development` locally. | Yes |
| `PORT` | The port the backend listens on (Render sets this automatically). | No |
| `CORS_ORIGIN` | Allowed domains for the API. Set to `*` to allow Vercel to connect. | Yes |
| `GEMINI_API_KEY_1` | Primary Google Gemini API Key for high-speed tasks. | Yes |
| `GEMINI_API_KEY_2` | Secondary Google Gemini API Key for complex tasks/failover. | Yes |
| `SUPABASE_URL` | Your Supabase project URL (e.g., `https://xyz.supabase.co`). | Yes |
| `SUPABASE_ANON_KEY` | Your Supabase anonymous public key. | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase secure service role key (for admin actions). | Yes |

---

## 🔒 Security & Data Governance

* **Zero Leaked Secrets:** Environment files (`.env`) are strictly excluded via `.gitignore`. The frontend does not expose any private API keys.
* **Authentication:** The frontend securely connects to the backend using JWT Bearer tokens (currently using `nexus-test-token` for demonstration purposes).
* **Multi-Tenant RLS:** Row Level Security policies ensure employees can only synthesize documents they have permission to view.
* **Audit Trail:** Every interaction, token count, and latency metric is asynchronously logged to the `ai_interactions_log` table via Supabase.

---

## 📄 License
This project is licensed under the MIT License.
