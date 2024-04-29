const baseConfig = require('../tailwind.config.mjs')

export default {
  ...baseConfig,
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}', '!./src/pages'],
}
