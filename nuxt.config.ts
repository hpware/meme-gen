import tailwindcss from "@tailwindcss/vite";
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/global.css"],
  modules: ["@nuxt/ui", "@nuxt/scripts", "@nuxt/image"],
  vite: { plugins: [tailwindcss()] },
});