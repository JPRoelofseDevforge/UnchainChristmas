import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'unchain-red': '#e53e3e',
        'unchain-green': '#38a169',
        'unchain-blue': '#3182ce',
        'unchain-yellow': '#d69e2e',
        'unchain-orange': '#dd6b20',
      },
    },
  },
  plugins: [],
}
export default config