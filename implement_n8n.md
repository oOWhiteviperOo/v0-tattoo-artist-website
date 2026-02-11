# Multi-Tenant Config-Driven Architecture — Implementation Plan

## Context

The codebase is a single-studio tattoo artist website (INK & IRON) with content hardcoded in `lib/constants.ts` and components. The goal is to convert it into a **multi-tenant, config-driven system** so that an **n8n automation workflow** can create personalized demo sites for prospective clients.

**How it works:**
1. n8n collects lead data.
2. n8n generates a TypeScript config file from a template.
3. n8n pushes the file and updates the registry via GitHub API.
4. Vercel auto-deploys.

## n8n Automation Strategy

We will use a **Template String Replacement** strategy. This is robust and low-code friendly for "vibecoding".

### 1. The Template (`lib/studios/_template.ts`)
This file will contain the full TypeScript structure with `{{HANDLEBARS_STYLE}}` placeholders.
*   **Static Defaults**: Generic text ("Book Now", "FAQs") remains hardcoded in the template.
*   **Dynamic Fields**: Studio-specific data uses placeholders like `{{STUDIO_NAME}}`, `{{ARTIST_NAME}}`, `{{THEME_ACCENT}}`.

### 2. The Registry (`lib/studios/index.ts`)
This file will contain **explicit marker comments** to tell n8n where to insert code. regex-based insertion is fragile without markers.

```typescript
import { inkAndIron } from './ink-and-iron'
// [N8N-MARKER-IMPORT] - Do not remove

export const studios: Record<string, StudioConfig> = {
  'ink-and-iron': inkAndIron,
  // [N8N-MARKER-REGISTRY] - Do not remove
}
...
```

### 3. n8n Data Schema (The "Vibecoding" Part)
Your n8n workflow needs to produce a JSON object mapped to these placeholders.

**Output Schema**:
```json
{
  "slug": "black-anchor",
  "identity": {
    "name": "Black Anchor",
    "artist": "Sarah Black",
    "tagline": "Traditional Tattoos / Modern Standards"
  },
  "theme": {
    "accent": "199 89% 48%", // HSL value
    "accentRgb": "13, 148, 231" // RGB value
  },
  "content": {
    "heroHeadline": "Precision Linework\nTimeless Art",
    "heroImage": "/images/placeholder-hero.jpg",
    "aboutParagraphs": "Sarah Black specializes in...",
    "instagramUrl": "https://instagram.com/blackanchor",
    "location": "Seattle, WA"
  }
}
```

**n8n Action (GitHub API)**:
1.  **Get Template**: Read `lib/studios/_template.ts`.
2.  **Replace**:
    *   `{{STUDIO_SLUG}}` -> `black-anchor`
    *   `{{STUDIO_NAME}}` -> `Black Anchor`
    *   ...etc
3.  **Create File**: `lib/studios/black-anchor.ts` with the replaced content.
4.  **Update Registry**: Read `lib/studios/index.ts`, replace `// [N8N-MARKER-IMPORT]` with `import { blackAnchor } from './black-anchor'\n// [N8N-MARKER-IMPORT]` and `// [N8N-MARKER-REGISTRY]` with `'black-anchor': blackAnchor,\n  // [N8N-MARKER-REGISTRY]`.

---

## Technical Implementation Steps

### Step 1: Create Type System
**File**: `lib/types/studio-config.ts`
*   Define `StudioConfig` interface covering all sections (Hero, About, Gallery, etc.).
*   Export sub-types (`Session`, `Testimonial`).

### Step 2: Extract Existing Content (INK & IRON)
**File**: `lib/studios/ink-and-iron.ts`
*   Move all hardcoded constants from `lib/constants.ts` and components into this config file.
*   Validate against `StudioConfig` interface.

### Step 3: Create Registry with Markers
**File**: `lib/studios/index.ts`
*   Implement `getStudio(slug)`, `getAllSlugs()`.
*   **Crucial**: Include `// [N8N-MARKER-IMPORT]` and `// [N8N-MARKER-REGISTRY]`.

### Step 4: Context & Hooks
**File**: `lib/studio-context.tsx`
*   Create `StudioContext` and `useStudio()` hook.
*   Implement `StudioConfigProvider` that sets CSS variables implementation (`style={{ "--accent": config.theme.accent }}`).

### Step 5: Routing & Page Wrapper
**Files**: `app/[slug]/page.tsx`, `components/StudioPage.tsx`
*   `[slug]/page.tsx`: Server Component. Fetches config, generates metadata, passes to client.
*   `StudioPage.tsx`: Client Component. Wraps `StudioConfigProvider`. Renders all sections.
*   Update `app/page.tsx` to utilize `ink-and-iron` as default.

### Step 6: Create n8n Template
**File**: `lib/studios/_template.ts`
*   TypeScript file exporting a `StudioConfig` object.
*   Use `{{PLACEHOLDERS}}` for values n8n will provide.
*   Comment heavily for n8n mapping.

### Step 7: Component Refactoring (The Heavy Lift)
Update all components to remove `lib/constants.ts` imports and use `useStudio()`:
*   `Hero`, `About`, `Portfolio`, `Sessions`, `TrustBar`, `SocialProof`, `FAQ`, `FinalCTA`, `Footer`, `BookingModal`, `MobileMenu`, `Header`.
*   Replace hex codes with Tailwind semantic classes (`bg-accent`, `text-muted-foreground`).

### Step 8: Safety Cleanup
*   Verify `lib/constants.ts` is unused.
*   Delete `lib/constants.ts`.

---

## Verification Plan

### Automated
1.  **Build Check**: `npm run build` must pass after every step.
2.  **Type Check**: `npx tsc --noEmit` to ensure configs satisfy interfaces.

### Manual
1.  **Default Site**: Visit `/` -> Should look exactly like INK & IRON today.
2.  **Demo Site**: Visit `/ink-and-iron` -> Should look identical.
3.  **404**: Visit `/fake-studio` -> Should render custom 404.
4.  **Theme Test**: Temporarily change `ink-and-iron` accent color -> Verify site-wide update.
5.  **n8n Simulation**:
    *   Manually copy `_template.ts`.
    *   Replace `{{STUDIO_SLUG}}` with `test-studio`.
    *   Manually add to registry.
    *   Visit `/test-studio`.
