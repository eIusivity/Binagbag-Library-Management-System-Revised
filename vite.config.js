import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  base: "/Binagbag-Library-Management-System-Revised/",
  server: {
    allowedHosts: ["alice-bookstore-translations-trades.trycloudflare.com"],
  },
});
