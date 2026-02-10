export const BLUR_DATA_URL =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/BfwAJhAPkQ0rGbQAAAABJRU5ErkJggg=='

export interface SessionData {
  iconName: 'Zap' | 'Clock' | 'Calendar'
  title: string
  duration: string
  price: string
  priceSubtitle: string
  features: string[]
  status: 'available' | 'limited' | 'sold_out'
  availabilityText: string
  buttonText: string
  popular?: boolean
  buttonVariant: 'default' | 'outline'
}

export const SESSIONS: SessionData[] = [
  {
    iconName: 'Zap',
    title: 'Flash Drop',
    duration: '2-3 hours',
    price: '$250-$500',
    priceSubtitle: 'Custom design at limited time pricing',
    features: ['Original design concept', 'Custom placement', 'Touch-ups at 2 weeks'],
    status: 'limited',
    availabilityText: '3 Slots Left \u2014 March',
    buttonText: 'Book Flash',
    popular: false,
    buttonVariant: 'outline',
  },
  {
    iconName: 'Clock',
    title: 'Half-Day Session',
    duration: '6 hours',
    price: '$750-$1,200',
    priceSubtitle: 'Ideal for detailed, medium-large pieces',
    features: ['Larger, detailed piece', 'Color or blackwork', 'Unlimited revisions'],
    status: 'limited',
    availabilityText: '1 Slot Left',
    buttonText: 'Book Half-Day',
    popular: true,
    buttonVariant: 'default',
  },
  {
    iconName: 'Calendar',
    title: 'Full-Day Session',
    duration: '8 hours',
    price: '$1,500-$2,500',
    priceSubtitle: 'Full sleeve or large-scale project',
    features: ['Full sleeve or large project', 'Bring your own artist', 'Payment plan available'],
    status: 'available',
    availabilityText: 'Available',
    buttonText: 'Book Full Day',
    popular: false,
    buttonVariant: 'outline',
  },
]

export interface Testimonial {
  quote: string
  author: string
  city: string
  rating: number
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Raven is the most talented blackwork artist I've ever seen. He took my vague idea and created something I'll wear forever. Highly recommend.",
    author: 'Maya Chen',
    city: 'Los Angeles, CA',
    rating: 5,
  },
  {
    quote:
      "Professional, detail-oriented, and genuinely cares about the client's vision. The entire process was seamless.",
    author: 'Jordan Smith',
    city: 'Venice, CA',
    rating: 5,
  },
  {
    quote:
      'Best decision I made. The piece is absolutely stunning. He nailed the dark realism aesthetic I was going for.',
    author: 'Alex Rodriguez',
    city: 'Arts District LA',
    rating: 5,
  },
  {
    quote:
      'Incredible artist with an eye for composition. My half-sleeve turned out exactly as I imagined. 10/10.',
    author: 'Sam Williams',
    city: 'West Hollywood',
    rating: 5,
  },
  {
    quote:
      "The trust I have in Raven's work is unmatched. He listens, refines, and delivers. A true professional.",
    author: 'Riley Morgan',
    city: 'Downtown LA',
    rating: 5,
  },
  {
    quote: 'Custom designs only, and it shows. Zero regrets. His work speaks for itself.',
    author: 'Casey Bennett',
    city: 'Arts District LA',
    rating: 5,
  },
]

export interface FAQItem {
  id: string
  question: string
  answer: string
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-1',
    question: "What if I don't like the design?",
    answer:
      "That's why revisions exist. Unlimited revisions within 30 days of the session. Your satisfaction is non-negotiable.",
  },
  {
    id: 'faq-2',
    question: 'How do you approach custom design?',
    answer:
      'I start with a consultation to understand your vision, style preferences, and placement. I create 2-3 initial concept sketches, then refine based on your feedback. You see everything before the needle touches your skin.',
  },
  {
    id: 'faq-3',
    question: "What's included in the deposit?",
    answer:
      "The deposit secures your slot and covers the design consultation. It's applied toward your final tattoo cost. Non-refundable, but credits are available if rescheduled with 2+ weeks' notice.",
  },
  {
    id: 'faq-4',
    question: 'Do you offer color work?',
    answer:
      "Yes, but my specialty is dark realism & blackwork. I can do selective color, but I'm best known for black & grey depth and shading.",
  },
  {
    id: 'faq-5',
    question: 'How long after booking until I can get tattooed?',
    answer:
      'Depends on session availability. Flash drops typically book 2-4 weeks out. Half-day and full-day sessions can be scheduled up to 3 months in advance.',
  },
  {
    id: 'faq-6',
    question: "What's your aftercare process?",
    answer:
      'I provide detailed written aftercare instructions and am available for questions for 30 days post-session. Proper care ensures the best-looking healed result.',
  },
  {
    id: 'faq-7',
    question: 'Do you work with reference images?',
    answer:
      'Absolutely. Pinterest boards, photos, art styles\u2014bring whatever inspires you. The more reference material, the better I can execute your vision.',
  },
]

export const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=800&q=80',
  'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=800&q=80',
  'https://images.unsplash.com/photo-1590246814883-57c511e9a5c8?w=800&q=80',
  'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=800&q=80',
  'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=800&q=80',
  'https://images.unsplash.com/photo-1612459284270-27b3a394b076?w=800&q=80',
  'https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?w=800&q=80',
  'https://images.unsplash.com/photo-1594361858624-6c5d6b5d88f8?w=800&q=80',
  'https://images.unsplash.com/photo-1542556398-95fb5b9f9304?w=800&q=80',
]

export const INSTAGRAM_IMAGES = [
  'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&q=80',
  'https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?w=400&q=80',
  'https://images.unsplash.com/photo-1590246814883-57c511e9a5c8?w=400&q=80',
  'https://images.unsplash.com/photo-1562962230-16e4623d36e6?w=400&q=80',
  'https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?w=400&q=80',
  'https://images.unsplash.com/photo-1612459284270-27b3a394b076?w=400&q=80',
]

export const HERO_IMAGE = 'https://images.unsplash.com/photo-1598371839696-5c5bb1ae531c?w=1200&q=80'
export const ABOUT_IMAGE = 'https://images.unsplash.com/photo-1621607505115-d3c4a03fa9c4?w=800&q=80'

export const CONTACT = {
  email: 'hello@inkandiron.la',
  instagram: '@inkandironla',
  instagramUrl: 'https://instagram.com/inkandironla',
  phone: '(555) 000-RAVEN',
  address: 'Arts District, Los Angeles, CA',
}

export const NAV_LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Sessions', href: '#sessions' },
  { label: 'FAQ', href: '#faq' },
]

export const TRUST_METRICS = [
  { iconName: 'CheckCircle2' as const, label: '500+ Completed Tattoos' },
  { iconName: 'Zap' as const, label: '100% Custom Design' },
  { iconName: 'Award' as const, label: '5+ Years Experience' },
  { iconName: 'Shield' as const, label: 'Licensed & Insured' },
]

export const TRUST_BADGES = [
  { iconName: 'CheckCircle2' as const, label: 'Licensed & Insured' },
  { iconName: 'TrendingUp' as const, label: '500+ Happy Clients' },
  { iconName: 'Sparkles' as const, label: 'Custom Designs Only' },
  { iconName: 'Star' as const, label: '4.9 \u2605 Average Rating' },
]
