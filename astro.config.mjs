import { fileURLToPath } from "node:url"
import react from "@astrojs/react"
import tailwind from "@astrojs/tailwind"
import { defineConfig } from "astro/config"

// https://astro.build/config - Astro configuration entry
export default defineConfig({
  // Static site generation (no SSR)
  output: "static",
  // Used for canonical URLs, og:url, and absolute og:image URLs
  site: "https://trungkien65.github.io/me.md/",
  integrations: [tailwind(), react()],
  vite: {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url))
      }
    }
  }
})
