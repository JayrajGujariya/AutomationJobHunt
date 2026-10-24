# Job Hunt Autopilot 🚀
> **Track Every Application. Catch Every Fake Offer.**  
> *Garbathon 2026 | Challenge: 02 · Automation (Job Hunt Autopilot)*  
> Built with **Google Gemini 2.0** & **Google Antigravity**

[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.0-blue?logo=google)](https://ai.google.dev/)
[![Google Antigravity](https://img.shields.io/badge/Agent-Google%20Antigravity-purple)](https://antigravity.google/)
[![React 19](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61dafb?logo=react)](https://react.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Styling-Tailwind%20v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

---

## 🎯 The Problem: AI-Era Layoffs & Fraud Vulnerability

After an unexpected tech layoff, job seekers apply to 100+ roles within days. Inboxes rapidly turn into an overwhelming labyrinth of silent ghosting, auto-acknowledgements, and interview invitations. 

Crucially, **laid-off engineers are the primary target of employment syndicates and fake job offers**:
- Fraudulent fee requests disguised as "refundable training fees" (₹4,999) or "MacBook courier deposits".
- Impersonators sending offers from generic free-mail accounts (`hr.infosys.jobs@gmail.com`).
- Premature KYC identity theft demanding high-resolution scans of Aadhaar & PAN cards prior to any interview round.

---

## 💡 The Solution: Job Hunt Autopilot

**Job Hunt Autopilot** ingests raw post-layoff email inboxes (JSON/.mbox) and executes a unified Google Gemini classification pipeline:

1. **Self-Updating Kanban Board:** Automatically extracts status into `Applied`, `Interview`, `Offer`, and `Rejected` columns.
2. **Scam Shield (Flagged in RED):** Detects predatory fraud with deep forensic explanations:
   - Fee extortion triggers (UPI deposits, registration fees)
   - Enterprise domain impersonation (`@gmail.com` posing as Infosys/Wipro/Google)
   - Pre-interview Aadhaar & PAN document phishing
3. **7-Day Follow-Up Automation:** Flags silent applications (>7 days) and generates tailored follow-up email drafts in 3 selectable tones (*Polite*, *Direct*, *Concise*).
4. **Instant Interview Prep (Stretch):** Generates targeted company architectural overviews, high-yield system design questions, and smart questions to ask the interviewer.
5. **Interactive Custom Email Tester:** Test any custom email live on stage with immediate classification.
6. **Dual-Mode Offline Safety Net:** Connects to live Google Gemini 2.0 / Flash API with an instantaneous cached fallback so the stage demo **never fails** under venue Wi-Fi drops.

---

## ⚡ Quickstart

### Prerequisites
- Node.js v18+ (tested on Node v20.20.2 & npm v10.8.2)

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd AutomationJobHunt
npm install --legacy-peer-deps
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Production Build & Preview
```bash
# Production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🏗️ Architecture

```
/home/jayraj/AutomationJobHunt/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # KPI strip, live ingest trigger, API key config
│   │   ├── KanbanBoard.tsx         # 4 status columns + quarantine fraud banner
│   │   ├── JobCard.tsx             # Cards with red scam badges & follow-up notices
│   │   ├── ScamBannerModal.tsx     # High-contrast red forensic fraud report
│   │   ├── FollowUpModal.tsx       # 7-day ghosting email generator (3 tones)
│   │   ├── InterviewPrepDrawer.tsx # Stretch: Gemini interview cheat sheet
│   │   ├── AddEmailModal.tsx       # Live custom email testing modal for judges
│   │   ├── RawInboxModal.tsx       # Raw 20-email dataset viewer (Cards & JSON)
│   │   └── EmailViewerModal.tsx    # Raw email inspector
│   ├── data/
│   │   ├── sampleInbox.json        # 20 authentic post-layoff job emails
│   │   └── cachedClassification.json # Fail-proof offline classification backup
│   ├── services/
│   │   └── geminiService.ts        # Google Gemini 2.0 API + offline fallback
│   ├── styles.css                  # VesentPrep Obsidian dark theme (Tailwind v4 OKLCH)
│   └── types/job.ts                # Strict TypeScript data models
```

---

## 🏆 Hackathon Submission Checklist (100% Complete)

- [x] **Sample Inbox of ~20 Emails Loaded from JSON** (No Gmail API needed, 100% compliant)
- [x] **Self-Updating Tracker Board** (`Applied`, `Interview`, `Rejected`, `Offer`)
- [x] **Fake Offers Flagged in RED with Forensic Reasons** (Fee requests, free-mail sender, Aadhaar/PAN before interview)
- [x] **Follow-Up Reminders After 7 Days of No Reply** (One-click tailored drafts)
- [x] **Stretch Goal: Interview Prep Notes** for upcoming rounds
- [x] **Live Testing Button** for judges to paste arbitrary test emails
- [x] **Built Strictly with Google Technologies** (Gemini 2.0, Google Antigravity, AI Studio)
- [x] **Offline Backup Included** (Meets hackathon offline rule for full credit)

---

## 👥 Authors
Built for **Garbathon 2026** (GDG Ahmedabad) by **Jayraj Gujariya**.
Licensed under the [MIT License](LICENSE).
