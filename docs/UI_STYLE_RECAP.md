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

---

## 3. Key Components & Styling Patterns

### Navigation Navbar
- Fixed to the top with a bottom border `1px solid #E4E4E7`.
- Logo is loaded from the public logotype `/logo type.png` at `32px` height, keeping navbar clean and monochrome.

### Buttons
- **Primary Buttons**: Minimalist monochrome style (black `#09090B` background, white text) instead of primary indigo. This matches modern minimal SaaS design rules.
- **Secondary Buttons**: White background, thin border, and dark text.
- **Danger Buttons**: White background, thin red border, red text.

### Iconography (Lucide-Style Inline SVGs)
Instead of using external packages or playful emojis, the dashboard actions and stats pages use inline SVG icons designed with `stroke="currentColor"`, `stroke-width="2"`, and configured to `16px` to `20px` to maintain a consistent developer SaaS look.

---

## 4. Current Opportunities for Improvement (UX/UI Backlog)

Future AI agents or developers can build upon this foundation by addressing the following checklist:

- [ ] **Skeleton Loaders**: Currently, loading pages display a simple concentric loading spinner (`.spinner`). This can be improved by replacing them with animated skeleton shapes (`.skeleton-box` or `.skeleton-line`) that mimic card structures to reduce layout shift.
- [ ] **Interactive Link Charts**: The link stats detail page currently displays total counts and timestamps. It can be improved by adding a time-series line chart (using an inline SVG chart or a lightweight library like Chart.js/Recharts) to show click frequencies over the last 7 days.
- [ ] **Interactive Copy Feedback**: Currently, clicking copy triggers a visual checkmark icon (`✓`) on the clicked card. This can be enhanced by showing a clean, floating toast notification at the bottom of the screen.
- [ ] **Theme Toggle (Optional)**: If dark mode support is ever requested, the CSS variables under `:root` are fully prepared to support a toggled `.dark` class body that redefines color tokens to dark-slate variants.
- [ ] **Real-time URL Validator**: Enhance the `CreateLink` input field to check URL parameters dynamically and show inline validation feedback (e.g. warning if protocols like `http://` or `https://` are missing before form submission).
