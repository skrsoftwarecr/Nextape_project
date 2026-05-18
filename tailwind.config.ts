
import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        body: ['DM Sans', 'sans-serif'],
        headline: ['Playfair Display', 'serif'],
        code: ['monospace'],
      },
      colors: {
        background: '#FDFFFC',
        foreground: '#020100',
        card: {
          DEFAULT: '#FDFFFC',
          foreground: '#020100',
        },
        popover: {
          DEFAULT: '#FDFFFC',
          foreground: '#020100',
        },
        primary: {
          DEFAULT: '#235789',
          foreground: '#FDFFFC',
        },
        secondary: {
          DEFAULT: '#C1292E',
          foreground: '#FDFFFC',
        },
        muted: {
          DEFAULT: '#F1F1F1',
          foreground: '#666666',
        },
        accent: {
          DEFAULT: '#F1D302',
          foreground: '#020100',
        },
        destructive: {
          DEFAULT: '#C1292E',
          foreground: '#FDFFFC',
        },
        border: '#020100',
        input: '#020100',
        ring: '#235789',
        chart: {
          '1': '#235789',
          '2': '#C1292E',
          '3': '#F1D302',
          '4': '#020100',
          '5': '#666666',
        },
        sidebar: {
          DEFAULT: '#FDFFFC',
          foreground: '#020100',
          primary: '#235789',
          'primary-foreground': '#FDFFFC',
          accent: '#F1D302',
          'accent-foreground': '#020100',
          border: '#020100',
          ring: '#235789',
        },
      },
      borderRadius: {
        lg: '0px',
        md: '0px',
        sm: '0px',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'typewriter': {
          from: { width: '0' },
          to: { width: '100%' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'typewriter': 'typewriter 2s steps(40, end)'
      },
      borderWidth: {
        DEFAULT: '1px',
        '2': '2px',
        '3': '3px',
        '4': '4px',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
