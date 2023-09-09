import type { Config } from 'tailwindcss';

export default {
  content: ['libs/**/*.{html, ts}', 'apps/ysera/src/**/*.{html, ts}'],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
