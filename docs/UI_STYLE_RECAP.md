# Shrnk UI Style & Design System Recap

This document outlines the current visual identity, color tokens, layout specifications, and component designs implemented in the Shrnk frontend. Use this as a guide for maintainability or when guiding future AI agents on UI modifications.

---

## 1. Visual Identity & Brand Personality
- **Theme**: Pure Light Theme (No dark theme variables or toggles).
- **Style**: Stark, minimal, developer-focused SaaS interface. Similar to Vercel, Linear, and Dub.co.
- **Rules**: Zero gradients, zero neon glows, zero floating cards, and zero heavy shadows. Visual separation is achieved strictly through clean borders and flat background changes.

---

## 2. Design Tokens (CSS Variables)

Defined in [index.css](file:///d:/Learning%20System/02_SCHOOL/Semester%204/Web%20Advance%20Development/shrnk/frontend/src/index.css):

| Variable | Value | Description |
|---|---|---|
| `--font-sans` | `'Plus Jakarta Sans', sans-serif` | Main typography family. |
| `--bg-primary` | `#FFFFFF` | Core application background. |
| `--bg-secondary` | `#FAFAFA` | Surface background for input forms, summary cards, and hover cards. |
| `--border-color` | `#E4E4E7` | Slate-200 border for dividers and card wrappers. |
| `--border-hover` | `#D4D4D8` | Slate-300 border for interactive card hover states. |
| `--color-primary` | `#6366F1` | Accent Indigo color (for links and active fields). |
| `--color-text-primary` | `#09090B` | Zinc-950 (high contrast typography). |
| `--color-text-secondary`| `#71717A` | Zinc-500 (description text and subheadings). |
| `--color-text-muted` | `#A1A1AA` | Zinc-400 (inactive states or original URLs). |

### Border Radii
- **Cards**: `16px` (`--radius-card`)
- **Buttons / Inputs**: `12px` (`--radius-button`, `--radius-input`)
- **Badges**: `999px` (`--radius-badge`)

### Typographic Scale
- **H1 (Bold)**: `32px` (2rem)
- **H2 (Semibold)**: `24px` (1.5rem)
- **H3 (Semibold)**: `20px` (1.25rem)
- **Body (Regular)**: `16px` (1rem)
- **Small (Regular)**: `14px` (0.875rem)
- **Caption (Regular)**: `12px` (0.75rem)

---

## 3. Key Components & Styling Patterns

### Navigation Navbar (per `stylekit.png`)
- Left section aligns the `shrnk` logotype image next to direct navigation links (`Dashboard` and `Shorten Link`).
- Right section renders a notification bell icon button (`🔔`) alongside the user avatar badge (e.g. initials `MU`) that triggers a profile dropdown menu.

### Buttons (per `stylekit.png`)
- **Primary Buttons**: Solid black (`#000000` background, white text) with a hover state transitioning to `#27272A`.
- **Secondary Buttons**: White background, thin border, and dark text.
- **Danger Buttons**: White background, thin red border (`#EF4444`), red text.

### Layouts & Elements (per `stylekit.png`)
- **Desktop Table View**: Generates a clean tabular representation of links on screen widths > 768px with columns `Short Link`, `Clicks`, and `Created At`.
- **Mobile Card View**: Stacks records on mobile displays (< 768px). Each card includes a rounded icon wrapper (`rgba(99, 102, 241, 0.08)` background, indigo link icon), title, short URL, original URL, click counter, and a computed time-ago indicator (e.g. `2 hours ago`).
- **Badges**: Styled active (`#22C55E` text on light green background with border), inactive, and archived states.

---

## 4. Current Opportunities for Improvement (UX/UI Backlog)

Future AI agents or developers can build upon this foundation by addressing the following checklist:

- [ ] **Skeleton Loaders**: Currently, loading pages display a simple concentric loading spinner (`.spinner`). This can be improved by replacing them with animated skeleton shapes (`.skeleton-box` or `.skeleton-line`) that mimic card structures to reduce layout shift.
- [ ] **Interactive Link Charts**: The link stats detail page currently displays total counts and timestamps. It can be improved by adding a time-series line chart (using an inline SVG chart or a lightweight library like Chart.js/Recharts) to show click frequencies over the last 7 days.
- [ ] **Interactive Copy Feedback**: Currently, clicking copy triggers a visual checkmark icon (`✓`) on the clicked card. This can be enhanced by showing a clean, floating toast notification at the bottom of the screen.
- [ ] **Theme Toggle (Optional)**: If dark mode support is ever requested, the CSS variables under `:root` are fully prepared to support a toggled `.dark` class body that redefines color tokens to dark-slate variants.
- [ ] **Real-time URL Validator**: Enhance the `CreateLink` input field to check URL parameters dynamically and show inline validation feedback (e.g. warning if protocols like `http://` or `https://` are missing before form submission).
