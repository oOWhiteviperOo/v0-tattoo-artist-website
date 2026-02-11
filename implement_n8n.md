# Multi-Tenant Config-Driven Architecture — Implementation Plan

## Context

The codebase is a single-studio tattoo artist website (INK & IRON) with all content hardcoded in `lib/constants.ts` and scattered across 14+ component files. The goal is to convert it into a **multi-tenant, config-driven system** so that an **n8n automation workflow** can create personalized demo sites for prospective tattoo studio clients.

**How it works:** n8n's lead finder collects prospect data (business name, contact info, and eventually scraped portfolio/content). n8n generates a TypeScript config file via the **GitHub API**, pushes it to the repo, and Vercel auto-deploys. Each prospect gets a personalized demo site at `yoursite.com/<studio-slug>`.

**Scope:** Architecture only (no visual/UI enhancements in this pass).

---

## Implementation Steps

### Step 1: Create the StudioConfig type system

**Create:** `lib/types/studio-config.ts`

Define a comprehensive TypeScript interface that captures **every** piece of content currently hardcoded anywhere in the app. The interface is organized by section so each component knows exactly where to find its data:

- `identity` — name, slug, tagline, artistName
- `theme` — HSL color values matching the existing CSS variable format (background, foreground, accent, accentForeground, mutedForeground, dimmedForeground, border, card, accentRgb for glow shadows)
- `seo` — title, description, keywords, openGraph
- `nav` — links array, bookButtonText
- `hero` — headline (string array for line breaks), subheadline, urgencyText, ctaText, image, imageAlt
- `trustMetrics` — items array with iconName + label
- `portfolio` — sectionTitle, subtitle, images array
- `sessions` — sectionTitle, subtitle, items (SessionData[]), guarantee, popularLabel, waitlistButtonText
- `socialProof` — sectionTitle, testimonials, trustBadges, instagram (label + images)
- `about` — sectionTitle, paragraphs array, callout, image, imageAlt
- `faq` — sectionTitle, items array
- `finalCta` — headline, subheadline, ctaText
- `booking` — modalTitle, modalDescription, successTitle, successMessage, submitText, depositDisclaimer
- `contact` — email, instagram, instagramUrl, phone, address
- `footer` — copyrightHolder, tagline
- `blurDataUrl` — base64 placeholder

Also export the sub-interfaces (`SessionData`, `Testimonial`, `FAQItem`) from here so types have a single source of truth.

---

### Step 2: Extract INK & IRON into the first studio config

**Create:** `lib/studios/ink-and-iron.ts`

Extract **all** hardcoded data from:

| Source File | Data to Extract |
|-------------|----------------|
| `lib/constants.ts` | SESSIONS, TESTIMONIALS, FAQ_ITEMS, PORTFOLIO_IMAGES, INSTAGRAM_IMAGES, HERO_IMAGE, ABOUT_IMAGE, CONTACT, NAV_LINKS, TRUST_METRICS, TRUST_BADGES, BLUR_DATA_URL |
| `components/Hero.tsx` (lines 19-31) | Headline text, subtitle, urgency text, CTA text, alt text |
| `components/About.tsx` (lines 27, 64-74, 76) | Section title, bio paragraphs, callout text, alt text |
| `components/Header.tsx` (lines 55, 74) | "INK & IRON", "Book a Slot" |
| `components/Portfolio.tsx` | "Selected Work", subtitle |
| `components/Sessions.tsx` | "Available Sessions", subtitle, guarantee text |
| `components/SocialProof.tsx` | "What Clients Are Saying", Instagram label |
| `components/FinalCTA.tsx` | "Ready to Commit?", subheading, CTA text |
| `components/Footer.tsx` (lines 15, 18, 85) | "INK & IRON", tagline, copyright text |
| `components/BookingModal.tsx` (lines 32, 137-142, 127, 130, 290, 279-282) | SESSION_OPTIONS, modal title/desc, success text, submit text, deposit disclaimer |
| `app/layout.tsx` (lines 13-33) | All metadata (title, description, keywords, openGraph) |

Theme values (HSL format matching `app/globals.css`):
- background: `0 0% 4%`, foreground: `0 0% 96%`, accent: `39 35% 61%`, etc.
- accentRgb: `200, 169, 110` (for the rgba glow shadows)

---

### Step 3: Create studio registry

**Create:** `lib/studios/index.ts`

Exports:
- `getStudio(slug: string): StudioConfig | undefined`
- `getStudioOrDefault(slug: string): StudioConfig` — falls back to default
- `getAllSlugs(): string[]` — used by `generateStaticParams()`
- `DEFAULT_STUDIO = 'ink-and-iron'`

Maintains a `Record<string, StudioConfig>` registry. When n8n adds a new studio, it creates a new `.ts` file AND appends an import + registry entry to this file.

---

### Step 4: Create StudioConfigProvider + useStudio hook

**Create:** `lib/studio-context.tsx` (marked `'use client'`)

- React context with `StudioConfigProvider` component that:
  1. Wraps children in a `<div>` with inline `style` that overrides CSS variables (`--background`, `--foreground`, `--accent`, `--accent-foreground`, `--muted-foreground`, `--border`, `--card`, `--ring`, plus new `--dimmed-foreground`)
  2. Provides the full `StudioConfig` via context
- `useStudio()` hook that reads from context (throws if used outside provider)

This approach works because the existing Tailwind config already references `hsl(var(--accent))` etc. — overriding the CSS variables automatically re-themes every semantic Tailwind class.

---

### Step 5: Extend Tailwind config + CSS variables

**Modify:** `tailwind.config.ts`
- Add `dimmed` color: `'hsl(var(--dimmed-foreground))'` (maps to `#6B6B6B`)
- Add `boxShadow` > `accent-glow`: `'0 0 20px hsl(var(--accent) / 0.25)'`

**Modify:** `app/globals.css`
- Add `--dimmed-foreground: 0 0% 42%;` to the `:root` block

---

### Step 6: Set up dynamic routing

**Create:** `app/[slug]/page.tsx` — **server component** that:
- Calls `getStudio(params.slug)`, returns `notFound()` if missing
- Exports `generateStaticParams()` using `getAllSlugs()` for SSG
- Exports `generateMetadata()` reading from the studio config (title, description, keywords, OG)
- Renders `<StudioPage config={studio} />`

**Create:** `components/StudioPage.tsx` — **client component** that:
- Receives `StudioConfig` as a prop (serializable across server/client boundary)
- Wraps everything in `<StudioConfigProvider>`
- Contains the booking state management (`useState` for bookingOpen/selectedSession)
- Renders all section components (same composition as current `app/page.tsx`)

**Modify:** `app/page.tsx` — becomes a **server component**:
- Loads default studio via `getStudioOrDefault(DEFAULT_STUDIO)`
- Exports its own `generateMetadata()` from the default studio config
- Renders `<StudioPage config={studio} />`
- Remove `'use client'` directive

**Modify:** `app/layout.tsx`:
- Remove hardcoded `metadata` export (each page handles its own)
- Keep minimal fallback metadata (`robots: 'index, follow'`)
- Replace `bg-[#0A0A0A] text-[#F5F5F5]` with `bg-background text-foreground`
- Remove hardcoded `viewport` export (move to per-page `generateMetadata`)

---

### Step 7: Refactor all components to use useStudio()

Each component gets the same treatment:
1. Remove imports from `@/lib/constants`
2. Add `const studio = useStudio()` (from `@/lib/studio-context`)
3. Replace hardcoded strings with `studio.<path>` references
4. Replace hardcoded hex colors with Tailwind semantic classes

**Components to refactor (14 files):**

| Component | Key Changes |
|-----------|-------------|
| `Header.tsx` | `NAV_LINKS` -> `studio.nav.links`, "INK & IRON" -> `studio.identity.name`, "Book a Slot" -> `studio.nav.bookButtonText`, `rgba(10,10,10,...)` -> `hsl(var(--background) / ${opacity})` |
| `Hero.tsx` | `HERO_IMAGE`/`BLUR_DATA_URL` -> `studio.hero.image`/`studio.blurDataUrl`, all hardcoded text -> `studio.hero.*` |
| `TrustBar.tsx` | `TRUST_METRICS` -> `studio.trustMetrics.items` |
| `Portfolio.tsx` | `PORTFOLIO_IMAGES` -> `studio.portfolio.images`, section text -> `studio.portfolio.*` |
| `Sessions.tsx` | `SESSIONS` -> `studio.sessions.items`, section text + guarantee -> `studio.sessions.*` |
| `SessionCard.tsx` | Type import moves to `@/lib/types/studio-config`. Receives `popularLabel`/`waitlistButtonText` as props from Sessions |
| `SocialProof.tsx` | All 5 imports replaced with `studio.socialProof.*`, `studio.contact`, `studio.blurDataUrl` |
| `TestimonialCarousel.tsx` | Type import moves to `@/lib/types/studio-config` |
| `About.tsx` | `ABOUT_IMAGE`/`BLUR_DATA_URL` replaced, bio paragraphs -> `studio.about.paragraphs.map(...)`, callout -> `studio.about.callout` |
| `FAQ.tsx` | `FAQ_ITEMS` -> `studio.faq.items`, section title -> `studio.faq.sectionTitle` |
| `FinalCTA.tsx` | All hardcoded text -> `studio.finalCta.*` |
| `Footer.tsx` | `NAV_LINKS`/`CONTACT` -> `studio.nav.links`/`studio.contact`, "INK & IRON" -> `studio.footer.copyrightHolder` |
| `MobileMenu.tsx` | `NAV_LINKS` -> `studio.nav.links`, "Book a Slot" -> `studio.nav.bookButtonText` |
| `BookingModal.tsx` | `SESSION_OPTIONS` -> `studio.sessions.items.map(s => s.title)`, all modal text -> `studio.booking.*` |

**Color migration (applies to all components above + ScrollToTop):**

| Hardcoded | Semantic Replacement |
|-----------|---------------------|
| `bg-[#0A0A0A]` | `bg-background` |
| `text-[#F5F5F5]` | `text-foreground` |
| `text-[#C8A96E]`, `bg-[#C8A96E]`, `border-[#C8A96E]`, `fill-[#C8A96E]` | `text-accent`, `bg-accent`, `border-accent`, `fill-accent` |
| `text-[#0A0A0A]` (on accent bg) | `text-accent-foreground` |
| `text-[#A1A1A1]` | `text-muted-foreground` |
| `text-[#6B6B6B]` | `text-dimmed` |
| `border-[#1F1F1F]` | `border-border` |
| `bg-[#141414]` | `bg-popover` |
| `hover:shadow-[0_0_20px_rgba(200,169,110,0.25)]` | `hover:shadow-accent-glow` |
| `data-[state=checked]:bg-[#C8A96E]` | `data-[state=checked]:bg-accent` |
| `data-[state=checked]:text-[#0A0A0A]` | `data-[state=checked]:text-accent-foreground` |
| All `hover:`, `focus:`, `after:`, `placeholder:` variants | Same pattern with semantic tokens |

---

### Step 8: Create n8n template studio config

**Create:** `lib/studios/_template.ts`

A clearly commented config file with `{{PLACEHOLDER}}` markers for every field that n8n should fill in. Fields that are generic (theme defaults, form labels, guarantee text) get sensible defaults. Fields that are studio-specific (name, artist, images, testimonials) get placeholder markers.

This serves as the contract between the Next.js app and the n8n automation.

---

### Step 9: Clean up lib/constants.ts

**Modify:** `lib/constants.ts` — replace all content with re-exports from the default studio config. This is a safety net during migration. Once all component imports are confirmed removed, delete the file entirely.

---

### Step 10: Create 404 page

**Create:** `app/[slug]/not-found.tsx` — simple "Studio Not Found" page using semantic color classes.

---

## Implementation Order (build stays green at every step)

1. Step 1 — type definitions (additive, no impact)
2. Step 2 — ink-and-iron config (additive, no impact)
3. Step 3 — studio registry (additive, no impact)
4. Step 4 — context provider (additive, no impact)
5. Step 5 — Tailwind + CSS extensions (additive, existing hex classes still work)
6. Step 6 — routing + StudioPage wrapper (root page still works via default studio; components still read from old constants)
7. Step 7 — component refactoring (one at a time, each independently testable)
8. Step 8 — n8n template
9. Step 9 — constants.ts cleanup
10. Step 10 — 404 page

---

## Files Summary

### New files (8)

| File | Purpose |
|------|---------|
| `lib/types/studio-config.ts` | StudioConfig interface and sub-interfaces |
| `lib/studios/ink-and-iron.ts` | First studio config (all extracted data) |
| `lib/studios/index.ts` | Studio registry with getStudio/getAllSlugs |
| `lib/studio-context.tsx` | React context provider + useStudio hook |
| `components/StudioPage.tsx` | Client component wrapper with provider |
| `app/[slug]/page.tsx` | Dynamic route server component |
| `app/[slug]/not-found.tsx` | 404 page for invalid studio slugs |
| `lib/studios/_template.ts` | n8n template with placeholder values |

### Modified files (19)

| File | Nature of Change |
|------|-----------------|
| `app/page.tsx` | Server component, load default studio |
| `app/layout.tsx` | Remove hardcoded metadata/colors |
| `app/globals.css` | Add `--dimmed-foreground` |
| `tailwind.config.ts` | Add dimmed color + accent-glow shadow |
| `components/Header.tsx` | useStudio(), replace constants + hex |
| `components/Hero.tsx` | useStudio(), replace constants + hex |
| `components/TrustBar.tsx` | useStudio(), replace constants + hex |
| `components/Portfolio.tsx` | useStudio(), replace constants + hex |
| `components/Sessions.tsx` | useStudio(), replace constants + hex |
| `components/SessionCard.tsx` | Type import change, hex replacement |
| `components/SocialProof.tsx` | useStudio(), replace constants + hex |
| `components/TestimonialCarousel.tsx` | Type import change, hex replacement |
| `components/About.tsx` | useStudio(), replace constants + hex |
| `components/FAQ.tsx` | useStudio(), replace constants + hex |
| `components/FinalCTA.tsx` | useStudio(), replace constants + hex |
| `components/Footer.tsx` | useStudio(), replace constants + hex |
| `components/MobileMenu.tsx` | useStudio(), replace constants + hex |
| `components/BookingModal.tsx` | useStudio(), replace constants + hex + SESSION_OPTIONS |
| `components/ScrollToTop.tsx` | Hex replacement only |
| `lib/constants.ts` | Re-exports, then delete |

---

## n8n Integration Details

### How n8n creates a new demo studio:

1. n8n collects lead data (studio name, artist name, contact info, eventually scraped portfolio/testimonials)
2. n8n uses the `_template.ts` as a reference to generate a new TypeScript config file
3. n8n calls the **GitHub API** to:
   - Create `lib/studios/<new-slug>.ts` with the populated config
   - Update `lib/studios/index.ts` to add the import and registry entry
4. Vercel detects the push and auto-deploys (~30 seconds)
5. n8n sends the personalized demo URL (`yoursite.com/<new-slug>`) to the prospect

### How n8n updates an existing studio:

n8n edits the specific studio's `.ts` file via GitHub API. Push. Vercel rebuilds.

### How n8n deactivates a studio:

n8n removes the studio from the registry in `lib/studios/index.ts`. The slug then returns 404.

---

## Verification Checklist

- [ ] `npm run build` succeeds with no TypeScript errors at every step
- [ ] Root URL (`/`) renders the default INK & IRON site identically to current behavior
- [ ] Slug URL (`/ink-and-iron`) renders the same INK & IRON site
- [ ] Invalid slug (`/nonexistent`) shows 404 page
- [ ] Visual diff: no visible changes — every color, string, image, and animation identical
- [ ] Theme override test: change accent color in config, verify it propagates everywhere
- [ ] Template validation: `_template.ts` satisfies the `StudioConfig` type (TypeScript compile check)
