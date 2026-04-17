# Holiday Planner 2026

> Maximize your time off by combining leave days with weekends and public holidays.

**[→ Live Demo](https://holiday-planner-lilac.vercel.app/)**

---

## What It Does

Holiday Planner analyzes Turkey's 2026 public holiday calendar and finds the most efficient ways to use your annual leave days. Enter how many leave days you have and get up to 10 optimized vacation plans — ranked by total days off and efficiency.

### Features

- **Smart optimization** — bridges leave days with weekends and public holidays to maximize consecutive days off
- **Up to 10 diverse plans** — each plan uses a genuinely different set of leave days
- **Mandatory leave days** — pin specific dates you must take off; the algorithm accounts for them either from your budget or as extra free days
- **Interactive calendar** — full 12-month view with color-coded leave days, vacation blocks, public holidays, and mandatory days
- **Dark mode** — full light/dark theme support
- **English / Turkish** — switch languages from the header

### Color Legend

| Color | Meaning |
|---|---|
| 🟩 Emerald (dark) | Leave day used by the algorithm |
| 🟪 Violet | Mandatory leave day |
| 🟩 Emerald (light) | Vacation block (days off around leave days) |
| 🟥 Red | Public holiday |
| 🟧 Orange | Half-day holiday (arife) |
| 🟦 Blue | Weekend |

---

## Tech Stack

- [Next.js 15](https://nextjs.org) — App Router, server components
- [React 19](https://react.dev)
- [Tailwind CSS 4](https://tailwindcss.com)
- [dayjs](https://day.js.org) — date manipulation

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## How the Algorithm Works

1. **Build free-day set** — collects all weekends, public holidays, and mandatory days
2. **Exhaustive window scan** — for every pair of free days, calculates the leave days needed to bridge between them and the resulting efficiency (`total days / leave days used`)
3. **Plan generation** — greedily combines the highest-efficiency opportunities without leave-day conflicts; deduplicates by both block ranges and leave-day sets to ensure each plan is genuinely distinct
4. **Ranking** — sorts by total vacation days, then efficiency; returns the top 10 plans

---

