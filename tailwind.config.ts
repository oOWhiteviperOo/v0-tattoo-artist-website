import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        'accent-hover': 'hsl(var(--accent-hover))',
        'accent-pressed': 'hsl(var(--accent-pressed))',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        dimmed: 'hsl(var(--dimmed-foreground))',
      },
      maxWidth: {
        content: '1200px',
      },
      spacing: {
        's': 'var(--space-s)',
        '1.5s': 'calc(var(--space-s) * 1.5)',
        '2s': 'calc(var(--space-s) * 2)',
        '3s': 'calc(var(--space-s) * 3)',
        '4s': 'calc(var(--space-s) * 4)',
        '6s': 'calc(var(--space-s) * 6)',
        '8s': 'calc(var(--space-s) * 8)',
      },
      boxShadow: {
        elevated: '0 4px 24px -4px rgba(0, 0, 0, 0.4)',
        subtle: '0 1px 3px rgba(0, 0, 0, 0.3)',
        glow: '0 0 20px rgba(var(--gold-glow), 0.2)',
        'glow-sm': '0 0 12px rgba(var(--gold-glow), 0.15)',
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        display: ['var(--font-display)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 1px)',
        sm: 'calc(var(--radius) - 2px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
