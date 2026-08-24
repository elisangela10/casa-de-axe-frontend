import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify((process.env.VERCEL_GIT_COMMIT_SHA || process.env.GIT_COMMIT || "dev").slice(0, 7)),
  },
  plugins: [react()],
  server: {
    port: 5173,
  },
});
