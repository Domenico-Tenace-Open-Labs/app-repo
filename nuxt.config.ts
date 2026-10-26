/**
 * COLOR THEME
 */
const customLightTheme = {
  dark: false,
  colors: {
    background: "#f1f1f1",
    surface: "#FFFFFF",
    primary: "#fa892d",
    secondary: "#fa892d",
    error: "#BA1A1A",
    info: "#2196F3",
    success: "#006045",
    warning: "#FB8C00",
  },
};
const customDarkTheme = {
  dark: true,
  colors: {
    background: "#1e1e2e",
    surface: "#1a1a2a",
    primary: "#fa892d",
    secondary: "#fa892d",
    error: "#FFB4AB",
    info: "#2196F3",
    success: "#006045",
    warning: "#FB8C00",
  },
};

/**
 * COMPONENTS
 */
const customVBtn = {
  rounded: true,
  elevation: 0,
};
const customVSelect = {
  rounded: true,
  clearable: true,
  variant: "outlined",
};
const customVTextField = {
  rounded: true,
  clearable: true,
  variant: "outlined",
};
const customVCard = {
  rounded: true,
  elevation: 0,
  variant: "flat",
};
const customChip = {
  elevation: 0,
  variant: "elevated",
};

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      title: "App Repo",
    },
  },

  modules: ["vuetify-nuxt-module", "@pinia/nuxt", "@vite-pwa/nuxt"],
  pwa: {
    manifest: {
      name: "App Repo",
      short_name: "App Repo",
      description: "Simple toolbox for store your favourite applications 📦",
      theme_color: "#ffffff",
      icons: [
        {
          src: "pwa-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "pwa-512x512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable",
        },
      ],
    },
    workbox: {
      navigateFallback: "/pages/index.vue",
    },
    registerType: "autoUpdate",
    devOptions: {
      enabled: true,
      type: "module",
    },
  },
  vuetify: {
    vuetifyOptions: {
      theme: {
        themes: {
          light: customLightTheme,
          dark: customDarkTheme,
        },
      },
      defaults: {
        VBtn: customVBtn,
        VSelect: customVSelect,
        VChip: customChip,
        VTextField: customVTextField,
        VCard: customVCard,
      },
    },
  },
  imports: {
    presets: [{ from: "@pinia/nuxt", imports: ["defineStore"] }],
  },
});
