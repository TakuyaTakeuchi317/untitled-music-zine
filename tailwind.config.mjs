/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // The only accent: neon yellow-green
        accent: {
          DEFAULT: '#E2FF00',
          muted:   '#B8CC00',
        },
      },
      fontFamily: {
        impact:  ['"Barlow Condensed"', '"Arial Narrow"', 'Impact', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        mono:    ['"Space Mono"', '"Courier New"', 'monospace'],
        sans:    ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: () => ({
        DEFAULT: {
          css: {
            '--tw-prose-body':          '#a1a1aa',
            '--tw-prose-headings':      '#ffffff',
            '--tw-prose-lead':          '#71717a',
            '--tw-prose-links':         '#E2FF00',
            '--tw-prose-bold':          '#ffffff',
            '--tw-prose-counters':      '#52525b',
            '--tw-prose-bullets':       '#3f3f46',
            '--tw-prose-hr':            '#27272a',
            '--tw-prose-quotes':        '#ffffff',
            '--tw-prose-quote-borders': '#E2FF00',
            '--tw-prose-captions':      '#71717a',
            '--tw-prose-code':          '#E2FF00',
            '--tw-prose-th-borders':    '#3f3f46',
            '--tw-prose-td-borders':    '#27272a',
            'h2': {
              fontFamily:    '"Barlow Condensed", Impact, sans-serif',
              fontWeight:    '800',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              lineHeight:    '1',
            },
            'h3': {
              fontFamily:    '"Barlow Condensed", Impact, sans-serif',
              fontWeight:    '700',
              textTransform: 'uppercase',
            },
            'blockquote': {
              fontFamily:      '"Playfair Display", Georgia, serif',
              fontStyle:       'italic',
              fontSize:        '1.25em',
              borderLeftColor: '#E2FF00',
              borderLeftWidth: '3px',
              color:           '#a1a1aa',
            },
            'a': {
              color:          '#E2FF00',
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            },
            'strong': { color: '#ffffff' },
          },
        },
      }),
      animation: {
        marquee: 'marquee 32s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-12.5%)' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
