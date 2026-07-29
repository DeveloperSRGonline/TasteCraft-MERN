import type { Config } from 'tailwindcss';

export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': '#0B0C0E',       /* Deep Obsidian */
        'bg-surface': '#16181C',       /* Charcoal Slate — cards, modals, drawers */
        'accent-primary': '#FF385C',   /* Vibrant Coral Red — primary CTA */
        'accent-primary-2': '#E63946', /* Crimson Flame — secondary CTA / badges */
        'accent-secondary': '#FFB703', /* Warm Amber — ratings, highlights */
        'text-heading': '#FFFFFF',
        'text-body': '#A0AEC0',
        'border-muted': '#4A5568',
      },
    },
  },
  plugins: [],
} satisfies Config;
