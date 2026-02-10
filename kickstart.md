# INK & IRON Tattoo Artist Website — Implementation Kickstart

**Project:** Dark-themed portfolio & booking platform for tattoo artist Raven Morales  
**Tech Stack:** Next.js 16 (App Router), Tailwind CSS, shadcn/ui, Framer Motion, Lucide Icons  
**Status:** Ready for development. No further clarifications needed.

---

## Table of Contents

1. [Design System](#design-system)
2. [Architecture & File Structure](#architecture--file-structure)
3. [Component Breakdown](#component-breakdown)
4. [Data & Constants](#data--constants)
5. [Key Features & Interactions](#key-features--interactions)
6. [Technical Implementation Details](#technical-implementation-details)
7. [Responsive Specifications](#responsive-specifications)
8. [SEO & Accessibility](#seo--accessibility)

---

## Design System

### Typography

**Font:** Geist (via next/font/google or local) — ONE font only. No Bebas Neue.

- **Headings:** Geist 700–800, uppercase, letter-spacing: -0.02em, tight
- **Body:** Geist 300–400, normal case, letter-spacing: normal
- **Labels/Small:** Geist 400, uppercase, letter-spacing: 0.05em

**Type Scale (Desktop):**
- Hero heading: 72–96px
- Section headings: 36–48px
- Subheadings: 24–32px
- Body copy: 16–18px
- Small/fine print: 12–14px

**Type Scale (Mobile):**
- Hero heading: 40–48px
- Section headings: 28–36px
- Subheadings: 18–24px
- Body copy: 14–16px
- Small: 12px

---

### Color Palette

**Background:** #0A0A0A (dark, not pure black)

**Text:**
- Primary (headings, key content, CTAs): #F5F5F5
- Secondary (body text on glass): #A1A1A1 (bumped from #8A8A8A for contrast)
- Muted (fine print, labels): #6B6B6B
- Gold Accent: #C8A96E (CTAs, badges, icons, highlights only)

**Surfaces:**
- Card backgrounds: `rgba(255, 255, 255, 0.03)` with `backdrop-filter: blur(12px)`
- Card borders: `1px solid rgba(255, 255, 255, 0.06)`
- Card hover borders: `1px solid rgba(200, 169, 110, 0.15)`
- Modal backgrounds: Solid `#141414` (no glass — readability)
- Modal borders: `border-[#1F1F1F]`
- Input backgrounds: `bg-[#0A0A0A]`
- Input borders: `border-[#1F1F1F]`, focus: `border-[#C8A96E]`

**Contrast Note:** All text must pass WCAG AA (at least 4.5:1). Gold (#C8A96E) is only used for 16px+ and accent colors — never body text <16px.

---

### Glassmorphism

**Applied to:** All cards (session, testimonials, FAQ items)

```css
background: rgba(255, 255, 255, 0.03);
backdrop-filter: blur(12px);
-webkit-backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.06);
```

**On Hover:**
```css
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(200, 169, 110, 0.15);
```

**Exception:** Modal dialogs use solid `#141414` background (no glass) for readability.

---

### Animations

**Hover Effects (300ms ease-out):**
- Cards: `translateY(-4px)` + glass border shifts to gold tint
- CTA buttons: `scale(1.02)` + `box-shadow: 0 0 20px rgba(200, 169, 110, 0.25)`
- Images: `scale(1.03)` with `overflow: hidden`
- Links: underline opacity fade-in

**Scroll-Based Transitions (Framer Motion):**
- All sections: `initial={{ opacity: 0, y: 20 }} → whileInView={{ opacity: 1, y: 0 }}`
- `viewport={{ once: true }}` — animations fire once on first scroll into view, never repeat
- `transition={{ duration: 0.5, ease: "easeOut" }}`
- Portfolio grid: stagger children with `staggerChildren: 0.1`

**Parallax (Desktop Only, lg Breakpoint+):**
- Artist image: `max 40px Y shift`, disabled on tablet/mobile
- Uses `useScroll()` + `useTransform()` (Framer Motion)
- Does **NOT** use `once: true` — responds to scroll position continuously

**Micro-Interactions:**
- FAQ accordion: smooth height transition on open/close (shadcn default)
- Mobile menu: fade in/out (200ms)
- Modal: fade + slight scale-up on open, fade on close
- Gold pulse dot on urgency text ("Only 4 slots remaining"): subtle opacity pulse, 2s loop

**No:** parallax scrolling backgrounds, text reveals, staggered letter animations. Minimal motion.

---

### Grain Overlay

- Separate component: `<GrainOverlay />`
- Absolute positioned, `pointer-events: none`, `mix-blend-mode: overlay`, `z-index: 10`
- Applied to hero section only
- Accepts opacity prop (default 0.05)
- Uses inline base64 grain PNG

---

### Imagery

- **Source:** Unsplash placeholders (dark, moody tattoo photography)
- **Approach:** Build all image components to accept URLs as props or constants
- **Implementation:** `next/image` with `placeholder="blur"` and shared base64 blur constant
- **Note:** All assets will be replaced later — make swapping trivial

---

## Architecture & File Structure

### Directory Organization

```
app/
├── layout.tsx              # Global styles, fonts, metadata only
├── page.tsx                # SHORT file (~50 lines) — imports and stacks all sections
└── globals.css

components/
├── Header.tsx              # Sticky nav + mobile hamburger
├── MobileMenu.tsx          # Full-screen overlay menu
├── Hero.tsx                # Full viewport hero with image
├── TrustBar.tsx            # Social proof metrics strip
├── Portfolio.tsx           # Masonry image grid
├── Sessions.tsx            # 3 session cards + pricing details + guarantee block
├── SessionCard.tsx         # Reusable card component
├── SocialProof.tsx         # Testimonials + trust badges + Instagram strip
├── TestimonialCarousel.tsx # Carousel component (desktop: 3 visible, mobile: swipe)
├── About.tsx               # Artist bio section (2-column internally)
├── FAQ.tsx                 # Accordion section
├── FinalCTA.tsx            # Closing conversion section
├── Footer.tsx              # Hybrid A+F footer
├── BookingModal.tsx        # Contract intake form modal
├── GrainOverlay.tsx        # Reusable grain texture (hero only)
├── ScrollToTop.tsx         # Floating back-to-top button
└── ui/                     # shadcn/ui components (default set)

lib/
├── constants.ts            # All hardcoded data (colors, testimonials, FAQ, sessions, images)
└── utils.ts                # Scroll helpers, media query hooks
```

### page.tsx Template

```tsx
export default function Home() {
  return (
    <main>
      <Header />
      <Hero />
      <TrustBar />
      <Portfolio />
      <Sessions />
      <SocialProof />
      <About />
      <FAQ />
      <FinalCTA />
      <Footer />
      <BookingModal />
      <ScrollToTop />
    </main>
  );
}
```

**Constraints:**
- Keep individual component files 50–150 lines where possible
- All hardcoded data lives in `lib/constants.ts`
- Components import data from constants, never define inline
- No state management libraries — useState only for: modal open/close, mobile menu open/close, form fields

---

## Component Breakdown

### Header

**Elements:**
- Sticky to top, `z-index: 40`
- Logo/brand left side (text "INK & IRON" or icon)
- Desktop nav: horizontal links ("Work" | "Sessions" | "FAQ") + gold CTA button "Book a Slot"
- Mobile: hamburger menu icon (Lucide Menu, 24px)

**Behavior:**
- Nav links smooth-scroll to sections (id attributes: #work, #sessions, #faq)
- CTA button ("Book a Slot"): opens `<BookingModal />`
- Hamburger: triggers `<MobileMenu />`
- Respects `prefers-reduced-motion`

**Styling:**
- Background: `rgba(10, 10, 10, 0.8)` with `backdrop-filter: blur(4px)`
- Border-bottom: `1px solid rgba(255, 255, 255, 0.05)`

---

### MobileMenu

**Layout:**
- Full-screen overlay on tap hamburger
- Fade-in animation (200ms)
- Close via: X button (top-right), Escape key, nav link tap

**Content (vertically centered, stacked):**
- Nav links: "Work" | "Sessions" | "FAQ" (Geist 32px weight 600, uppercase)
- CTA button: "Book a Slot" (gold, full-width-ish, bottom of menu)
- Gap between items: 24px

**Styling:**
- Overlay: `bg-[#0A0A0A]/95` with `backdrop-filter: blur(8px)`
- Text: `text-primary` (#F5F5F5)
- Body scroll locked when open: `overflow: hidden`

**Animation on Close:**
- Fade out (200ms)
- THEN smooth scroll to section (if nav link) OR open modal (if CTA)
- Sequential, not simultaneous

---

### Hero

**Layout:**
- Full viewport: `min-h-screen` or `min-h-[100dvh]`
- Content flex-centered vertically and horizontally
- Two-column: left text/CTA, right image (desktop) → stacked (mobile)

**Content (left):**
- Heading: "Permanent Art. Limited Slots." (uppercase, 72–96px, #F5F5F5)
- Subheading: "Dark realism & blackwork tattoos by Raven Morales. Book your session at INK & IRON, Arts District, Los Angeles." (18px, #A1A1A1)
- CTA button: "Book Your Slot →" (gold, opens `<BookingModal />`)

**Image (right):**
- Dark, moody tattoo artist portrait via `next/image`
- `fill` + `object-cover` (no hardcoded dimensions)
- No parallax on hero image itself
- `<GrainOverlay />` absolutely positioned over image, z-index 10

**Grain Overlay:**
- Applied only to hero section
- Opacity: 0.05 (5%)
- `mix-blend-mode: overlay`

---

### TrustBar

**Content:**
- 4 metrics in a row: "500+ Completed Tattoos" | "100% Custom Design" | "5+ Years Experience" | "Licensed & Insured"
- Small icons above each metric (Lucide: CheckCircle2, Zap, Award, Shield)
- Icons: 20px, gold fill
- Text: 14px, secondary (#A1A1A1)

**Responsive:**
- Desktop (lg+): 4 across
- Tablet: 2×2 grid
- Mobile: 2×2 grid

---

### Portfolio

**Grid Layout:**
- Desktop (lg+): 3 columns
- Tablet (md): 2 columns
- Mobile: 1 column

**Image Component:**
- `next/image` with `fill`, `object-cover`
- `placeholder="blur"` + shared base64 constant
- `sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"`
- Lucide overlays on hover: Play icon for video, Link icon for external (if applicable)

**Scrolling Animation:**
- Section fade-in on scroll: `initial={{ opacity: 0, y: 20 }} → whileInView={{ opacity: 1, y: 0 }}`
- `viewport={{ once: true }}`
- Stagger children: `staggerChildren: 0.1`

**Parallax on section image (if applicable):**
- Desktop only (lg+)
- Max 40px Y offset
- `useScroll()` + `useTransform()` for continuous scroll response

---

### Sessions

**Layout:**
- Heading: "AVAILABLE SESSIONS" (36–48px, uppercase, #F5F5F5)
- Subheading: "Limited slots. Serious clients only. Custom designs, no flash work." (18px, #A1A1A1)
- 3 `<SessionCard />` components side by side (desktop), stacked (mobile)
- Below: optional guarantee block (see below)

**SessionCard Component (Reusable)**

**Props:**
```ts
{
  icon: React.ReactNode;           // Lucide icon
  title: string;                   // "Flash Drop" | "Half-Day Session" | "Full-Day Session"
  duration: string;                // "2–3 hours" | "6 hours" | "8 hours"
  price: string;                   // "$250" | "$750" | "$1,500"
  priceSubtitle: string;           // "$250–$500 for custom work" etc.
  features: string[];              // Array of feature strings
  status: "available" | "limited" | "sold_out";
  availabilityText: string;        // "Available" | "3 Slots Left" | "Sold Out"
  buttonText: string;              // "Book Flash →" | "Book Half-Day →" | "Book Full Day →"
  buttonAction: () => void;        // Opens BookingModal with sessionTitle
  popular?: boolean;               // Show "MOST POPULAR" badge (Half-Day only)
  buttonVariant: "default" | "outline";
}
```

**Styling:**
- Glassmorphic background + border (see Design System)
- Gold accent on badge and CTA button
- Hover: `translateY(-4px)` + glass border to gold tint

**Three Instance Examples (in Sessions.tsx, sourced from lib/constants.ts):**

1. **Flash Drop**
   - Duration: 2–3 hours
   - Price: $250–$500
   - Features: ["Original design concept", "Custom placement", "Touch-ups at 2 weeks"]
   - Status: available (or limited: "3 Slots Left — March")
   - Button: "Book Flash →"

2. **Half-Day Session** (MOST POPULAR)
   - Duration: 6 hours
   - Price: $750–$1,200
   - Features: ["Larger, detailed piece", "Color or blackwork", "Unlimited revisions"]
   - Status: limited ("1 Slot Left")
   - Badge: "MOST POPULAR" (angled or horizontal ribbon at top of card)
   - Button: "Book Half-Day →"

3. **Full-Day Session**
   - Duration: 8 hours
   - Price: $1,500–$2,500
   - Features: ["Full sleeve or large project", "Bring your own artist", "Payment plan available"]
   - Status: available ("Available")
   - Button: "Book Full Day →"

**Button Behavior:**
- All click handlers open `<BookingModal sessionTitle={title} />`
- If status is "sold_out", button text becomes "Join Waitlist" and styling is muted

**Guarantee Block** (below cards, optional visual element):
- 30-day satisfaction guarantee copy
- Subtext: "Not happy with your work? Unlimited revisions within 30 days of the session."

---

### SocialProof

**Layout:**
- Section heading: "WHAT CLIENTS ARE SAYING" (36–48px, uppercase, #F5F5F5)
- `<TestimonialCarousel />` component
- Trust badges below carousel: "Licensed & Insured" | "500+ Happy Clients" | "Custom Designs Only" | "4.9 ★ Average Rating"
- Instagram strip below badges: 6 darkmoody images, entire row links to Instagram profile

**TestimonialCarousel Component**

**Props:**
```ts
{
  testimonials: Testimonial[];
}

interface Testimonial {
  quote: string;
  author: string;
  city: string; // e.g., "Los Angeles, CA"
  rating: number; // 1–5 (render as filled/empty stars)
}
```

**Desktop Behavior:**
- 3 visible testimonials in a row
- Next/prev arrow buttons (if >3 testimonials)
- Click arrows to scroll

**Mobile Behavior:**
- Horizontal scroll-snap carousel
- 1 card visible at a time
- Dot indicators at bottom (pagination dots)
- Swipe to navigate
- No auto-play

**Testimonial Card Styling:**
- Glassmorphic background
- Author name + city (14px, secondary text)
- 5-star rating: Lucide Star icons (14px), gold fill if rated, muted if empty
- Quote: 16px, #F5F5F5

**Data (lib/constants.ts, 6 testimonials, all 5-star):**
```
1. "Raven is the most talented blackwork artist I've ever seen. He took my vague idea and created something I'll wear forever. Highly recommend." — Maya Chen, Los Angeles, CA
2. "Professional, detail-oriented, and genuinely cares about the client's vision. The entire process was seamless." — Jordan Smith, Venice, CA
3. "Best decision I made. The piece is absolutely stunning. He nailed the dark realism aesthetic I was going for." — Alex Rodriguez, Arts District LA
4. "Incredible artist with an eye for composition. My half-sleeve turned out exactly as I imagined. 10/10." — Sam Williams, West Hollywood
5. "The trust I have in Raven's work is unmatched. He listens, refines, and delivers. A true professional." — Riley Morgan, Downtown LA
6. "Custom designs only, and it shows. Zero regrets. His work speaks for itself." — Casey Bennett, Arts District LA
```

**Trust Badges:**
- 4 icons + text, displayed in a row (desktop) / 2×2 grid (mobile)
- Icons: Lucide CheckCircle2 (Licensed), TrendingUp (Happy Clients), Sparkles (Custom), Star (Rating)
- Text: 14px, secondary color

**Instagram Strip:**
- 6 hardcoded Unsplash URLs (dark, moody photography)
- Aspect ratio: square (1:1)
- Always 6 images, never flexible
- Entire row links to Instagram profile
- `next/image` with responsive sizing

---

### About

**Layout:**
- Section heading: "THE ARTIST" (36–48px, uppercase, #F5F5F5)
- Two-column (desktop): image left, text right
- Stacked (tablet/mobile): image on top, text below

**Image:**
- Dark, moody portrait of artist
- `next/image` with rounded corners (8–12px)
- Parallax on scroll (desktop, lg+ only): max 40px Y offset

**Text Content:**
- Intro paragraph: "Raven Morales is a dark realism & blackwork specialist..." (18px, #A1A1A1)
- Bio paragraph: "5+ years refining the craft, 500+ completed pieces..." (16px, secondary text)
- Small call-out box: "All designs are custom. No flash work. No walk-ins. Serious clients only." (14px, gold background or border, #C8A96E)

**Scroll Animation:**
- Fade-in on scroll: `initial={{ opacity: 0, y: 20 }} → whileInView={{ opacity: 1, y: 0 }}`
- `viewport={{ once: true }}`

---

### FAQ

**Layout:**
- Section heading: "FREQUENTLY ASKED QUESTIONS" (36–48px, uppercase, #F5F5F5)
- shadcn Accordion component: `type="single" collapsible defaultValue="faq-1"`
- Question appears open by default: "What if I don't like the design?"

**FAQ Items (lib/constants.ts, at least 5–7 questions):**

1. **"What if I don't like the design?"** (open by default)
   - Answer: "That's why revisions exist. Unlimited revisions within 30 days of the session. Your satisfaction is non-negotiable."

2. **"How do you approach custom design?"**
   - Answer: "I start with a consultation to understand your vision, style preferences, and placement. I create 2–3 initial concept sketches, then refine based on your feedback. You see everything before the needle touches your skin."

3. **"What's included in the deposit?"**
   - Answer: "The deposit secures your slot and covers the design consultation. It's applied toward your final tattoo cost. Non-refundable, but credits are available if rescheduled with 2+ weeks' notice."

4. **"Do you offer color work?"**
   - Answer: "Yes, but my specialty is dark realism & blackwork. I can do selective color, but I'm best known for black & grey depth and shading."

5. **"How long after booking until I can get tattooed?"**
   - Answer: "Depends on session availability. Flash drops typically book 2–4 weeks out. Half-day and full-day sessions can be scheduled up to 3 months in advance."

6. **"What's your aftercare process?"**
   - Answer: "I provide detailed written aftercare instructions and am available for questions for 30 days post-session. Proper care ensures the best-looking healed result."

7. **"Do you work with reference images?"**
   - Answer: "Absolutely. Pinterest boards, photos, art styles—bring whatever inspires you. The more reference material, the better I can execute your vision."

**Accordion Styling:**
- Glassmorphic background (cards)
- Gold accent text for question headings
- Smooth height transition on open/close (shadcn default)
- No border-radius (sharp corners)

---

### FinalCTA

**Layout:**
- Dark background section
- Large, centered heading: "Ready to Commit?" (48–72px, uppercase, #F5F5F5)
- Subheading: "The creative process starts with one decision. Let's create something permanent." (18px, secondary)
- Gold CTA button: "Book Your Slot →" (opens `<BookingModal />`)
- Optional visual: gold horizontal line above/below heading

---

### Footer

**Layout (Hybrid A+F):**
- Top row: About info + Quick links + Contact info
- Bottom row: Copyright + social icons

**Content:**

**Left Column (About):**
- Brand name: "INK & IRON"
- Tagline: "Permanent Art. Limited Slots."
- Street address: "Arts District, Los Angeles, CA" (no full address for privacy)

**Center Column (Links):**
- Section nav links: "Work" | "Sessions" | "FAQ"
- External links (optional): Instagram, other socials

**Right Column (Contact):**
- Email: hello@inkandiron.la
- Phone: (555) 000-RAVEN (placeholder or real)
- Instagram: @inkandironla

**Bottom Row:**
- Copyright: "© 2025 INK & IRON. All rights reserved."
- Legal: "Terms & Conditions" | "Privacy Policy" (not fully implemented, just placeholder links)

**Responsive:**
- Desktop (lg+): 3 columns top row
- Tablet: 2 columns or stacked
- Mobile: Full vertical stack

**Styling:**
- Glassmorphic background or subtle border-top
- Text: secondary color (#A1A1A1)
- Links: hover to gold with underline

---

### BookingModal

**Trigger:**
- All CTA buttons open this modal: Header nav, Hero, Session cards, FinalCTA, Footer
- Prop: `sessionTitle` (optional, defaults to "Request a Session")

**Modal Structure:**

**Heading:** "REQUEST A SESSION" (Geist 700, gold, uppercase)  
**Subheading:** "Fill out the details below. I'll review your request and confirm your slot within 48 hours." (Geist 300, secondary)

**Form Fields (required unless marked optional):**

1. **Full Name** (text input, required)
   - Placeholder: "Your name"
   - Validation: non-empty

2. **Email** (email input, required)
   - Placeholder: "your@email.com"
   - Validation: valid email format

3. **Phone** (tel input, optional)
   - Placeholder: "(555) 000-0000"
   - Validation: none

4. **Instagram Handle** (text input, optional)
   - Placeholder: "@yourhandle"
   - Prefix: @ label inside input

5. **Session Type** (select dropdown, required)
   - Options: "Flash Drop" | "Half-Day Session" | "Full-Day Session"
   - If modal opened from a session card, pre-fill this dropdown with that session

6. **Preferred Date** (date input, required)
   - Min date: today
   - Validation: date cannot be in the past

7. **Placement** (text input, required)
   - Placeholder: "e.g. Left forearm, upper back, full sleeve"
   - Validation: non-empty

8. **Description / References** (textarea, required)
   - Placeholder: "Describe your idea, share reference images, or link a Pinterest board. The more detail, the better."
   - Rows: 6–8
   - Validation: non-empty

9. **Agreement Checkbox** (required)
   - Label: "I understand that a non-refundable deposit is required to secure my session. Pricing and final details will be confirmed before any payment is taken."
   - Validation: must be checked to submit

**Submit Button:**
- Text: "Submit Request →"
- Full-width at bottom
- Color: gold, disabled until all required fields filled and checkbox checked
- On click: prevent default, show success state

**Success State:**
- Gold checkmark icon (Lucide Check)
- Message: "Request submitted. I'll be in touch within 48 hours."
- Modal auto-closes after 3 seconds
- Form resets internally

**Modal Styling:**
- Overlay: `bg-black/80`, `backdrop-filter: blur(4px)`
- Dialog: solid `bg-[#141414]` (no glass), `border border-[#1F1F1F]`
- Sharp corners (no border-radius)
- Max width: `sm:max-w-lg` (512px)
- Scrollable if form overflows viewport

**Input Styling:**
- Background: `bg-[#0A0A0A]`
- Border: `border-[#1F1F1F]`
- Focus: `border-[#C8A96E]`
- Text: `text-primary` (#F5F5F5)
- Placeholder: muted color (#6B6B6B)
- Sharp corners

---

### GrainOverlay

**Purpose:** Subtle grain texture over hero section

**Props:**
```ts
{
  opacity?: number; // default 0.05
}
```

**Styling:**
- Absolute positioned
- `pointer-events: none`
- `mix-blend-mode: overlay`
- `z-index: 10`
- Base64 grain PNG (inline)

**Usage:** Applied in `<Hero />` component only

---

### ScrollToTop

**Appearance:**
- Small circle button (40×40px or larger)
- Gold border: `border-2 border-[#C8A96E]`
- Glassmorphic background: `rgba(255, 255, 255, 0.03)` + `backdrop-filter: blur(8px)`
- Lucide ChevronUp icon (20px, gold)
- Rounded: `rounded-full`

**Position:**
- Fixed bottom-right: `bottom: 24px; right: 24px`
- `z-index: 30`

**Behavior:**
- Appears after scrolling past hero (trigger at ~100vh or when header leaves viewport)
- Fade-in/out animation (200ms)
- On click: smooth-scroll to top of page
- Respects `prefers-reduced-motion` (instant jump if enabled)

**State:**
- Hidden on initial page load
- Visible when user has scrolled past hero
- Hide when back at top

---

## Data & Constants

### lib/constants.ts Structure

**All hardcoded data lives here.** Components import and use these constants.

```ts
// Colors
export const COLORS = {
  background: '#0A0A0A',
  text: {
    primary: '#F5F5F5',
    secondary: '#A1A1A1',
    muted: '#6B6B6B',
  },
  accent: '#C8A96E',
  surfaces: {
    card: 'rgba(255, 255, 255, 0.03)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',
    cardHoverBorder: 'rgba(200, 169, 110, 0.15)',
    modal: '#141414',
    modalBorder: '#1F1F1F',
    input: '#0A0A0A',
  },
};

// Blur placeholder for next/image
export const BLUR_DATA_URL = 'data:image/png;base64,...'; // Single shared blur

// Session data
export const SESSIONS = [
  {
    icon: <Sparkles />,
    title: 'Flash Drop',
    duration: '2–3 hours',
    price: '$250–$500',
    priceSubtitle: 'Custom design at limited time pricing',
    features: [
      'Original design concept',
      'Custom placement',
      'Touch-ups at 2 weeks',
    ],
    status: 'limited',
    availabilityText: '3 Slots Left — March',
    buttonText: 'Book Flash →',
    popular: false,
  },
  // ... other sessions
];

// Testimonials
export const TESTIMONIALS = [
  {
    quote: 'Raven is the most talented blackwork artist...',
    author: 'Maya Chen',
    city: 'Los Angeles, CA',
    rating: 5,
  },
  // ... 5 more testimonials
];

// FAQ
export const FAQ_ITEMS = [
  {
    id: 'faq-1',
    question: 'What if I don\'t like the design?',
    answer: 'That\'s why revisions exist...',
  },
  // ... more FAQ items
];

// Portfolio images (Unsplash URLs)
export const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/...',
  // ... 8–12 portfolio images
];

// Instagram strip images (always 6)
export const INSTAGRAM_IMAGES = [
  'https://images.unsplash.com/...',
  // ... exactly 6 images
];

// Other constants: contact info, social links, etc.
export const CONTACT = {
  email: 'hello@inkandiron.la',
  instagram: '@inkandironla',
  phone: '(555) 000-RAVEN',
  address: 'Arts District, Los Angeles, CA',
};
```

---

## Key Features & Interactions

### 1. Navigation Flow

**Desktop:**
- Header: sticky nav bar with links + CTA button
- Links ("Work" | "Sessions" | "FAQ"): smooth-scroll to section (id-based)
- CTA button ("Book a Slot"): opens modal
- Respects `prefers-reduced-motion`

**Mobile:**
- Hamburger menu icon opens full-screen overlay
- Overlay: vertical nav links + CTA button (bottom)
- Close: X button, Escape key, tap any nav link
- Body scroll locked during open
- Sequential: fade out (200ms) → THEN scroll to section

---

### 2. Booking Modal Flow

**Trigger:** All CTA buttons

**Steps:**
1. User taps "Book Your Slot"
2. Modal opens with fade + scale animation
3. User fills 9-field form
4. User agrees to terms
5. User taps "Submit Request →"
6. Form validates (required fields)
7. If valid:
   - Show success state (checkmark + message)
   - Modal auto-closes after 3 seconds
   - Form resets (for potential next open)
8. If invalid:
   - Show field-level error indicators

**No backend:** Form is front-end only. No API call, no email, no persistence.

---

### 3. Session Card Interaction

**Desktop:**
- Hover: `translateY(-4px)` + glass border to gold
- Click button: opens modal with `sessionTitle` prop

**Mobile:**
- Tap button: opens modal with `sessionTitle` prop
- No hover state (touch device)

**Availability Logic:**
- `status: 'available'` → Button says "Book [Session]", normal styling
- `status: 'limited'` → Button says "Book [Session]", badge shows "X Slots Left"
- `status: 'sold_out'` → Button says "Join Waitlist", muted styling

---

### 4. Testimonial Carousel

**Desktop:**
- 3 visible testimonials side by side
- Next/prev arrows if >3 testimonials
- No auto-play

**Mobile:**
- Horizontal scroll-snap carousel
- 1 visible at a time
- Dot indicators at bottom
- Swipe to navigate
- No auto-play

---

### 5. Portfolio Grid

**Animation:**
- Entire grid fades in on scroll: `initial={{ opacity: 0, y: 20 }} → whileInView={{ opacity: 1, y: 0 }}`
- Children stagger: `staggerChildren: 0.1`

**Image Hover (Desktop):**
- `scale(1.03)` with `overflow: hidden`
- Optional overlay icon (Lucide icons)

---

### 6. Parallax on Artist Image (About Section)

**Trigger:** Desktop (lg+) only

**Implementation:**
- `useScroll()` + `useTransform()` (Framer Motion)
- Y offset: `useTransform(scrollYProgress, [0, 1], [0, -40])`
- Max 40px shift
- Disabled on tablet/mobile (static image)

---

### 7. Scroll-Triggered Animations

**Applied to:** Hero, TrustBar, Portfolio, About, FAQ, FinalCTA sections

**Animation:**
```tsx
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5, ease: 'easeOut' }}
```

**Note:** `once: true` means animations fire once on first scroll into view, never repeat. Parallax does NOT use `once: true` because it's continuous.

---

## Technical Implementation Details

### Next.js Setup

**Layout (app/layout.tsx):**
```tsx
import { Geist } from 'next/font/google';
import type { Metadata } from 'next';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "INK & IRON — Permanent Art. Limited Slots. | Los Angeles Tattoo Studio",
  description: "Dark realism and blackwork tattoos by Raven Morales. Book your session at INK & IRON, Arts District, Los Angeles. Limited slots available.",
  keywords: ["tattoo", "Los Angeles", "dark realism", "blackwork", "tattoo studio", "tattoo artist", "Arts District LA"],
  openGraph: {
    title: "INK & IRON — Permanent Art. Limited Slots.",
    description: "Dark realism and blackwork by Raven Morales. Book your slot.",
    type: "website",
    locale: "en_US",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
      </body>
    </html>
  );
}
```

**Tailwind Configuration:**
- Apply design tokens as CSS variables in `globals.css`
- Override default shadcn colors to match dark theme
- No custom spacing or sizing beyond standard Tailwind

**Fonts:**
- Load Geist via `next/font/google`
- Apply via `font-sans` class in body
- No alternate fonts

---

### Image Optimization

**All Portfolio Images:**
```tsx
<Image
  src={imageUrl}
  alt="Tattoo portfolio image"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL={BLUR_DATA_URL}
  className="object-cover"
  priority={false}
/>
```

**Hero Image:**
```tsx
<Image
  src={heroImageUrl}
  alt="Tattoo artist Raven Morales"
  fill
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
  placeholder="blur"
  blurDataURL={BLUR_DATA_URL}
  className="object-cover"
  priority={true}
/>
```

---

### Framer Motion Setup

**Scroll Detection:**
```tsx
import { useScroll, useTransform, motion } from 'framer-motion';

// For parallax
const { scrollY } = useScroll();
const yTransform = useTransform(scrollY, [0, 800], [0, -40]);

// For scroll-triggered animations
<motion.section
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
>
  ...
</motion.section>
```

---

### State Management

**No external state library.** Use React hooks:

```tsx
// Modal state
const [isBookingOpen, setIsBookingOpen] = useState(false);

// Mobile menu state
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

// Form state
const [formData, setFormData] = useState({
  fullName: '',
  email: '',
  phone: '',
  instagram: '',
  sessionType: '',
  preferredDate: '',
  placement: '',
  description: '',
  agreedToTerms: false,
});
```

---

### Utility Hooks

**useMediaQuery (lib/utils.ts):**
```tsx
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
}

// Usage
const isDesktop = useMediaQuery('(min-width: 1024px)');
```

**useScrollPosition:**
```tsx
export function useScrollPosition(): number {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => setPosition(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return position;
}
```

---

### Accessibility Requirements

**Semantic HTML:**
- `<header>` for nav
- `<main>` wrapping all sections
- `<section id="work">`, `<section id="sessions">`, `<section id="faq">` for scroll targets
- `<footer>` for footer
- `<h1>` on hero heading only (one per page)
- `<h2>` for section headings
- `<h3>` for card titles

**ARIA Attributes:**
- Modal: `role="dialog"` + `aria-labelledby` + `aria-describedby`
- Mobile menu: `role="navigation"` + `aria-label="Mobile menu"`
- Accordion: shadcn handles this automatically

**Keyboard Navigation:**
- All interactive elements (buttons, links, form inputs) accessible via Tab
- Mobile menu close: Escape key
- Focus outline: visible (don't hide)

**Motion:**
- Respect `prefers-reduced-motion` on all animations
- Smooth scroll disabled if user prefers reduced motion
- Parallax disabled if user prefers reduced motion

**Color Contrast:**
- Primary text (#F5F5F5) on dark background (#0A0A0A): 19.5:1 ✓
- Secondary text (#A1A1A1) on dark background: 8.6:1 ✓
- Gold (#C8A96E) on dark: 4.8:1 ✓ (acceptable for 18px+)
- All text >14px uses primary or secondary color minimum

**Image Alt Text:**
- All images have descriptive alt text
- Decorative images use `alt=""`

---

## Responsive Specifications

### Breakpoints (Tailwind defaults)

- **Mobile:** `<640px` (sm)
- **Tablet:** `640px–1023px` (md–lg)
- **Desktop:** `≥1024px` (lg+)

### Mobile (< 640px)

- Single column: Hero, Portfolio, Sessions, About, Footer
- Hamburger nav (no horizontal nav)
- Session cards: stacked vertically
- Testimonials: 1 visible, swipe to navigate
- Portfolio: 1 column
- Trust bar: 2×2 grid
- About: image on top, text below
- Footer: full vertical stack
- All text scaled down per type scale
- Tap targets: minimum 44×44px

### Tablet (640px–1023px)

- Two-column: Portfolio (2 columns), About (side by side narrower)
- Session cards: scrollable row or 2+1 layout
- Testimonials: 2 visible in row
- Trust bar: 2×2 or 4 across (depends on spacing)
- Can keep horizontal nav if space allows
- Some padding/margins increased vs. mobile

### Desktop (≥ 1024px)

- Full layouts: Portfolio (3 columns), About (2-column with parallax)
- 3 session cards side by side
- 3 testimonials visible side by side
- Trust bar: 4 across, single row
- Horizontal nav visible
- Max-width container: 1280px (xl)
- Full parallax on artist image
- All animations at full speed

### Testing Viewports

- **Mobile:** 375px (iPhone SE), 390px (iPhone 14)
- **Tablet:** 640px, 768px (iPad), 820px (iPad landscape)
- **Desktop:** 1024px, 1280px, 1440px+

---

## SEO & Accessibility

### Metadata (in app/layout.tsx)

Already specified above. Key elements:
- Title: specific, brand + value prop
- Description: 155 characters, action-oriented
- Keywords: tattoo-related terms
- Open Graph: title, description, type, locale
- Robots: index, follow

### Semantic HTML

Already specified above.

### Structured Data (Schema.org)

**Not included in initial build.** Optional additions:
- LocalBusiness schema for studio address/contact
- Review schema for testimonials
- Can be added post-launch if needed

### Accessibility

Already specified above. Key checklist:
- ✓ Semantic HTML
- ✓ ARIA labels where needed (modals, menus)
- ✓ Keyboard navigation (Tab, Enter, Escape)
- ✓ Focus indicators visible
- ✓ Alt text on images
- ✓ Color contrast >= 4.5:1 (AA standard)
- ✓ `prefers-reduced-motion` respected
- ✓ Scrollable form on mobile (not cut off)

---

## Final Notes

### What's NOT Included

- Backend/database
- Email integration
- Analytics/tracking
- CMS
- Multi-page routing
- Light mode
- Theme toggle
- Payment processing
- Real form submission

### What IS Included

- Fully responsive design
- Dark theme with glassmorphism
- All interactive components
- Scroll animations
- Parallax (desktop)
- Booking modal (front-end prototype)
- Mobile navigation
- Semantic HTML + accessibility
- Metadata/SEO basics
- Image optimization
- Modular component structure

### Deployment Ready

Once built:
1. Run `npm run build`
2. Deploy to Vercel (recommended)
3. Custom domain setup
4. Monitor Lighthouse scores (target: 90+ overall)
5. Replace Unsplash images with real portfolio

---

## Component Development Checklist

- [ ] Setup: Font (Geist), Colors (CSS variables), Tailwind config
- [ ] Header & Navigation
- [ ] MobileMenu
- [ ] Hero + GrainOverlay
- [ ] TrustBar
- [ ] Portfolio Grid
- [ ] SessionCard (reusable)
- [ ] Sessions section
- [ ] TestimonialCarousel
- [ ] SocialProof
- [ ] About
- [ ] FAQ
- [ ] FinalCTA
- [ ] BookingModal
- [ ] ScrollToTop
- [ ] Footer
- [ ] lib/constants.ts (all data)
- [ ] lib/utils.ts (hooks)
- [ ] Responsive testing
- [ ] Accessibility audit
- [ ] Performance optimization
- [ ] Deploy to Vercel

---

**Status:** Ready for development. No further clarifications needed. Proceed with implementation.
