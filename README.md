# 🩸 HemoLife — Blood Donation Platform

A modern, production-ready blood donation platform built with **React + Vite + Tailwind CSS**.

---

## ✨ Features

| Page | Highlights |
|------|-----------|
| **Home** | Full-width gradient hero, feature cards, campaign grid, CTA band, footer |
| **Dashboard** | Metrics cards, recent activity feed, blood-type inventory, quick actions |
| **Donors** | Searchable/filterable table, status pills, avatars |
| **Add Donor** | Multi-section form, real-time eligibility checker (permanent + temporary), dynamic status card |
| **Profile** | Donation history, impact stats, personal details |

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens at http://localhost:5173)
npm run dev

# 3. Production build
npm run build
```

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Navbar.jsx           # Fixed top nav with active link highlighting
│   ├── HeroSection.jsx      # Reusable full-width hero
│   ├── Button.jsx           # primary / secondary / outline / ghost variants
│   ├── Card.jsx             # Generic card + CardHeader / CardBody / CardFooter
│   ├── CampaignCard.jsx     # Donation drive card with progress bar
│   ├── FormInput.jsx        # FormInput / FormSelect / FormTextarea
│   ├── EligibilityCard.jsx  # Toggle-based eligibility check + StatusBadge
│   └── StatusBadge.jsx      # Re-export shim
│
├── pages/
│   ├── Home.jsx             # Landing page (hero + features + campaigns + CTA)
│   ├── Dashboard.jsx        # Admin metrics + activity + inventory
│   ├── Donors.jsx           # Donor registry table with live filtering
│   ├── AddDonor.jsx         # Registration form + eligibility logic
│   └── Profile.jsx          # Donor profile + history
│
├── services/
│   └── api.js               # Fetch-based API service (swap BASE_URL for backend)
│
├── utils/
│   └── eligibility.js       # Pure eligibility computation helpers
│
├── styles/
│   └── global.css           # Tailwind directives + CSS custom properties + overrides
│
├── App.jsx                  # BrowserRouter + route definitions
└── main.jsx                 # React 18 createRoot entry point
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary font | Poppins (300–800) |
| Display font | DM Serif Display |
| Primary red | `#e11d48` |
| Dark red | `#9f1239` / `#881337` |
| Border radius | 12 px (inputs) → 32 px (hero sections) |
| Shadow | `0 8px 32px rgba(193,21,42,.25)` |

### Page-level CSS overrides (`global.css`)

| Page | Override strategy |
|------|------------------|
| Home | Gradient-heavy backgrounds, floating glass cards |
| Dashboard | Clean white metric cards, accent top-border bars |
| Form / AddDonor | Structured minimal, 2-column grid, eligibility card blocks |
| Profile | Hero banner with decorative rings, side-by-side stats |

---

## 🩺 Eligibility Logic

Located in `src/utils/eligibility.js` and wired into `AddDonor.jsx`.

```js
import { computeEligibility } from "../utils/eligibility";

const status = computeEligibility(permValues, tempValues);
// → "eligible" | "temporary" | "permanent"
```

| Status | UI outcome |
|--------|-----------|
| `eligible` | Green status card, submit enabled |
| `temporary` | Orange status card, submit **disabled** |
| `permanent` | Red status card + warning banner, submit **disabled** |

---

## 🔌 Connecting a Backend

1. Copy `.env.example` → `.env.local`
2. Set `VITE_API_URL=https://your-api.com/api`
3. All calls in `src/services/api.js` will route there automatically.

---

## 📱 Responsive

- Mobile-first Tailwind breakpoints (`sm:`, `md:`, `lg:`)
- Hero illustration hidden on mobile
- Tables scroll horizontally on small screens
- Navbar collapses to hamburger below `md`

---

## 🛡️ Security & UX

- All form fields validated before submission
- Submit button disabled when eligibility check fails
- Input focus rings meet WCAG contrast guidelines
- Route-level protection scaffold ready in `App.jsx`
