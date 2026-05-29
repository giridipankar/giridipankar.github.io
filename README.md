# Dipankar Giri — Portfolio

Static HTML/CSS/JS portfolio site. Designed from the ground up for a clean **Next.js migration** — every section maps to a future React component, every CSS file maps to a future CSS Module, and the JS is structured as self-contained blocks ready to become `useEffect` hooks.

---

## Quick Start

No build step needed for the static version.

```bash
# Option 1 — just open the file
open index.html

# Option 2 — serve with a local dev server (avoids font CORS quirks)
npx serve .
# or
python3 -m http.server 3000
```

> **Fonts**: Gilroy is loaded via `fonts.cdnfonts.com`. A local dev server avoids any browser CORS issues with cross-origin font requests.

---

## Project Structure

```
giri_potfolio/
│
├── index.html              ← Single-page entry point. No inline styles or scripts.
│
├── styles/                 ← One CSS file per section / concern
│   ├── globals.css         ← Reset, CSS custom properties (:root), base typography
│   ├── nav.css             ← Fixed top navigation bar
│   ├── hero.css            ← Hero section, iOS + Android phone mockups, floating cards
│   ├── sections.css        ← Shared section chrome (.section-tag, .section-title, .reveal, .tag)
│   ├── experience.css      ← Experience timeline cards
│   ├── projects.css        ← Project grid, cards, screen previews, metrics
│   ├── contributions.css   ← Bento grid, stat numbers, skill bars
│   ├── footer.css          ← Footer layout and links
│   └── responsive.css      ← Breakpoint overrides — always loaded last
│
├── scripts/
│   └── main.js             ← All page interactions (3 IntersectionObservers)
│
└── README.md               ← You are here
```

---

## CSS Architecture

### Load Order (in `<head>`)

```
globals → nav → hero → sections → experience → projects → contributions → footer → responsive
```

Order matters: `globals.css` defines the CSS custom properties (`--bg`, `--blue`, `--teal`, etc.) that every subsequent file consumes. `responsive.css` overrides rules from all other files so it must come last.

### CSS Custom Properties (globals.css)

All theme tokens live in `:root`. Change these and the whole site updates.

| Variable     | Value       | Role                          |
|--------------|-------------|-------------------------------|
| `--bg`       | `#080808`   | Page background               |
| `--bg2`      | `#101010`   | Section alt background        |
| `--card`     | `rgba(255,255,255,.04)` | Card fill    |
| `--card2`    | `rgba(255,255,255,.08)` | Card hover   |
| `--border`   | `rgba(255,255,255,.08)` | Default border |
| `--border2`  | `rgba(255,255,255,.16)` | Highlighted border |
| `--blue`     | `#FFFFFF`   | Primary accent (brightest)    |
| `--teal`     | `#C0C0C0`   | Secondary accent (silver)     |
| `--purple`   | `#888888`   | Tertiary accent (mid-grey)    |
| `--text`     | `#F0F0F0`   | Body text                     |
| `--muted`    | `#686868`   | Secondary text / labels       |
| `--faint`    | `#252525`   | Subtle fills (tag bg, bars)   |
| `--r`        | `14px`      | Base border radius            |
| `--r2`       | `20px`      | Large border radius (cards)   |

### Fonts

| Font      | Source                                  | Weights    | Used for                          |
|-----------|-----------------------------------------|------------|-----------------------------------|
| Gilroy    | `fonts.cdnfonts.com/css/gilroy-free`    | 300, 800   | All headings and body text        |
| DM Mono   | Google Fonts                            | 400, 500   | Labels, tags, code-style elements |

> Gilroy free only ships **Light (300)** and **ExtraBold (800)** — these are mapped to body and heading weights respectively. When migrating to Next.js, self-host the full Gilroy family (or purchase it) using `next/font/local` for all weights.

---

## Section → File Mapping

| Section in `index.html`       | CSS file(s)                              | Future Next.js component     |
|-------------------------------|------------------------------------------|------------------------------|
| `<nav>`                       | `nav.css`                                | `components/Nav.tsx`         |
| `<section class="hero">`      | `hero.css`                               | `components/Hero.tsx`        |
| `<section id="experience">`   | `sections.css`, `experience.css`         | `components/Experience.tsx`  |
| `<section id="projects">`     | `sections.css`, `projects.css`           | `components/Projects.tsx`    |
| `<section id="contributions">`| `sections.css`, `contributions.css`      | `components/Contributions.tsx`|
| `<footer>`                    | `footer.css`                             | `components/Footer.tsx`      |
| All sections                  | `responsive.css` (breakpoint overrides)  | included in each module      |

---

## Hero — Phone Mockups

The hero right column contains two device mockups side-by-side inside `.phone-duo`.

### iOS Phone (`.phone`)
- Wide notch at the top (`phone-notch`)
- Rotates `-2deg`, floats with `floatIOS` keyframe
- Screen content: portfolio overview (holdings, chart, returns)

### Android Phone (`.phone.phone-android`)
- Punch-hole camera (`android-camera`, 10px circle)
- Hardware buttons on right side (`android-side-btns`)
- Rotates `+1.5deg`, floats with `floatAndroid` keyframe (offset by 0.7s so they're out of phase)
- Screen content: transactions list (salary, SIP debit, payments, freelance income)
- Gesture pill at bottom (`android-gesture-bar`)

**Key CSS selectors for the duo layout:**

```css
.phone-scene   /* position: relative container — floating cards anchor here */
.phone-duo     /* flex row, align-items: flex-end — holds both phones */
.phone         /* iOS — 196 × 392px, border-radius: 38px */
.phone-android /* Android — 180 × 372px, border-radius: 30px */
```

---

## JavaScript (`scripts/main.js`)

Three self-contained `IntersectionObserver` blocks — no external dependencies.

| Block                   | What it does                                                    | Next.js home                     |
|-------------------------|-----------------------------------------------------------------|----------------------------------|
| `revealObserver`        | Adds `.visible` class to `.reveal` elements as they scroll in  | `hooks/useScrollReveal.ts`       |
| `barObserver`           | Animates `.bar-fill` widths (from `data-w` attr) on scroll     | `components/Contributions.tsx` `useEffect` |
| `navObserver`           | Highlights `.nav-link` matching the currently visible section  | `components/Nav.tsx` `useEffect` |

---

## Next.js Migration Guide

This project was structured with migration in mind. Here's the upgrade path:

### 1. Bootstrap

```bash
npx create-next-app@latest portfolio --typescript --app --tailwind=false
```

### 2. CSS

- Copy `styles/globals.css` → `app/globals.css` (import in `app/layout.tsx`)
- Convert each component CSS file to a CSS Module:
  - `styles/nav.css` → `components/Nav.module.css`
  - `styles/hero.css` → `components/Hero.module.css`
  - etc.
- Keep `responsive.css` as a global import in `globals.css` (media queries cross component boundaries)

### 3. Fonts

Replace the cdnfonts `<link>` with `next/font/local` (self-host) or `next/font/google` (for DM Mono):

```ts
// app/layout.tsx
import localFont from 'next/font/local'
import { DM_Mono } from 'next/font/google'

const gilroy = localFont({
  src: [
    { path: '../public/fonts/Gilroy-Light.woff2',     weight: '300' },
    { path: '../public/fonts/Gilroy-ExtraBold.woff2', weight: '800' },
  ],
  variable: '--font-gilroy',
})

const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-dm-mono' })
```

### 4. Components

Each `<section>` becomes a server component. The three `IntersectionObserver` blocks in `main.js` move into `'use client'` components or custom hooks:

```
app/
  layout.tsx        ← imports globals.css, font variables
  page.tsx          ← assembles all section components
components/
  Nav.tsx           ← 'use client' (active link state)
  Hero.tsx          ← static (phone mockups are pure HTML/CSS)
  Experience.tsx    ← static
  Projects.tsx      ← static
  Contributions.tsx ← 'use client' (bar fill animation)
  Footer.tsx        ← static
hooks/
  useScrollReveal.ts  ← wraps revealObserver
public/
  fonts/            ← self-hosted Gilroy woff2 files
```

### 5. Data

The experience, project, and contribution data is currently hard-coded in HTML. Before migrating, extract it into:

```
lib/
  data/
    experience.ts
    projects.ts
    contributions.ts
```

Then pass as props to each section component.

---

## Customisation

| What to change           | Where                                  |
|--------------------------|----------------------------------------|
| Accent colours           | `:root` in `styles/globals.css`        |
| Fonts                    | `<head>` in `index.html` + `globals.css` |
| Name / contact details   | `index.html` (nav, hero, footer)       |
| Experience entries       | `index.html` — `#experience` section  |
| Project cards            | `index.html` — `#projects` section    |
| Skill bar percentages    | `data-w` attribute on `.bar-fill` divs |
| iOS phone screen content | `index.html` — `.phone` block in hero |
| Android screen content   | `index.html` — `.phone-android` block |
| Breakpoints              | `styles/responsive.css`               |
