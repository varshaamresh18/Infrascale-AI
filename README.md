# InfraScale AI — Enterprise AI Infrastructure & FinOps Advisor

> **Stateful Multi-Agent FinOps, Workload Capacity & Architecture Advisor**  
> Built with React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, and Recharts.

---

## 🚀 Overview

InfraScale AI functions as an automated Senior AI Solutions Architect and FinOps Advisor. When an organization plans to deploy an enterprise AI application (such as customer support RAG bots, automated legal & invoice extraction, or internal developer copilots), InfraScale AI calculates:
1. **Accurate Token OpEx & SRE Costs** across managed APIs (Gemini/OpenAI/Claude) vs. self-hosted cloud GPUs (NVIDIA L4 / A10G / A100).
2. **Workload Capacity & Hardware Sizing** (peak concurrency, Tokens Per Second, Time-To-First-Token, per-sequence KV-cache memory, and replica counts with a 70% utilization target).
3. **Conventional 12-Month Financial ROI** incorporating remaining human QA review (e.g., 20% QA overhead), net monthly savings, and payback period.
4. **Architectural Compliance Readiness** (Data residency, Zero Data Retention (ZDR), VPC Peering / PrivateLink, encryption, and audit logging).

---

## 🛠️ Architecture & Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **FinOps Engine:** 100% Deterministic calculation modules (**Zero-Hallucination Math**).
- **Presentation Controls:** Instantaneous USD ($) / INR (₹) toggle (illustrative FX: 1 USD = ₹84).
- **Interactive Simulation:** Live reactive sliders for monthly volume, context window, peak concurrency, prompt cache hit rate, and human QA retention.
- **Reporting:** Downloadable comprehensive Architecture Decision Record (`.md`).
- **Backend Ready:** Cleanly decoupled `src/lib/api.ts` adapter configured to drop in FastAPI + LangGraph endpoints.

---

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Build output is generated inside the `dist/` directory.

---

## 📊 Enterprise Presets Included

1. **Customer Support RAG Bot:** 100k requests/mo, strict data residency, 20% human review buffer ($8k manual baseline -> $640/mo AI OpEx, 530.5% 12M ROI, 0.78 mo payback).
2. **Legal & Invoice Extraction:** 50k docs/mo, async batch processing windows (50% discount), large 8,500 token context window.
3. **Internal Engineering Copilot:** 2,500 developers, 350k req/mo, dedicated VPC airgap, sub-second latency SLA (<800ms TTFT).
