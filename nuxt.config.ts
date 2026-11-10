/**
 * COLOR THEME
 */
const customLightTheme = {
  dark: false,
  colors: {
    primary: "#FA892D",
    "on-primary": "#FFFFFF",
    "primary-container": "#FFE5D1",
    "on-primary-container": "#3D1C00",
    secondary: "#1E1E2E",
    "on-secondary": "#FFFFFF",
    "secondary-container": "#E2E2EC",
    "on-secondary-container": "#131320",
    tertiary: "#737373",
    "tertiary-container": "#F0F0F2",
    background: "#FAF8FC",
    surface: "#FFFFFF",
    "on-surface": "#1E1E2E",
    "surface-container": "#F6F6F9",
    "surface-container-high": "#EEEDF2",
    "surface-variant": "#E5E5EB",
    "on-surface-variant": "#4B4B5A",
    outline: "#727285",
    "outline-variant": "#D1D1DB",
    error: "#BA1A1A",
    "error-container": "#FFDAD6",
    "on-error-container": "#410002",
    info: "#2196F3",
    success: "#006045",
    warning: "#FB8C00",
  },
};
const customDarkTheme = {
  dark: true,
  colors: {
    primary: "#FA892D",
    "on-primary": "#FFFFFF",
    "primary-container": "#502A06",
    "on-primary-container": "#FFE5D1",
    secondary: "#E2E2EC",
    "on-secondary": "#1E1E2E",
    "secondary-container": "#2A2A38",
    "on-secondary-container": "#E2E2EC",
    tertiary: "#A6A6A6",
    "tertiary-container": "#2E2E2E",
    background: "#0E0E14",
    surface: "#14141E",
    "on-surface": "#E2E2EC",
    "surface-container": "#1B1B26",
    "surface-container-high": "#232332",
    "surface-variant": "#2A2A3A",
    "on-surface-variant": "#A4A4B4",
    outline: "#8B8B9B",
    "outline-variant": "#484858",
    error: "#FFB4AB",
    "error-container": "#93000A",
    "on-error-container": "#FFDAD6",
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
