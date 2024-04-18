import lit from '@astrojs/lit'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
    outDir: './out/dist',
    integrations: [lit()],
    server: {
        host: '0.0.0.0',
    },
})
