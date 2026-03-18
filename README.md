# 🧳 Cabinet Trip 2026 — Expense Calculator

A stunning, production-grade trip expense calculator built with **Next.js 14+**, **TypeScript**, and **Tailwind CSS**. Track shared expenses across 7 members, manage a COMPANY sponsor account, split costs equally, and export reports as CSV.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/cabinet-trip)

## ✨ Features

- 🎬 **Stunning Hero Section** — Dramatic gradient, animated tagline, bokeh effects
- 🏢 **COMPANY Account** — Sponsor fund with deposit/expense deduction priority
- 👥 **7 Pre-loaded Members** — Equal split, running balance, carryforward logic
- 📅 **Day Tabs** — Day 1 / Day 2 / Summary views
- ➕ **Dynamic Expenses** — Real-time split calculations with live preview
- ✅ **Mark as Paid** — Toggle per member with undo support
- 📥 **CSV Export** — Full trip report download on settlement day
- 📱 **Responsive** — Dark theme, mobile-first design

## 🚀 Getting Started

```bash
npm install
npm run dev       # local dev on localhost:3000
npm run build     # production build
```

## 🛠️ Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS**
- **lucide-react** icons
- Pure client-side — no backend, no localStorage

## 📁 Project Structure

```
/app
  layout.tsx         — Root layout with metadata
  page.tsx           — Home page with all state management
  globals.css        — Tailwind + custom animations
/components
  Hero.tsx           — Full-screen hero section
  CompanyCard.tsx    — COMPANY account card
  MemberCard.tsx     — Individual member card
  ExpenseModal.tsx   — Add expense modal
  DepositModal.tsx   — Deposit to company modal
  DayView.tsx        — Per-day expense table
  SummaryTab.tsx     — Trip summary
  CSVExport.tsx      — CSV download button
  Toast.tsx          — Toast notifications
/lib
  types.ts           — TypeScript interfaces
  calculations.ts   — Financial logic
  csvExport.ts       — CSV generation
  data.ts            — Initial state & utilities
```

## 📝 License

MIT
