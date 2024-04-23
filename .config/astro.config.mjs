import lit from '@astrojs/lit'
import tailwind from '@astrojs/tailwind'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
    outDir: './dist/web-site',
    integrations: [tailwind(), lit()],
    server: {
        host: '0.0.0.0',
    },
})
