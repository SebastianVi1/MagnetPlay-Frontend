/// <reference types="vite/client" />
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

declare const process: { cwd: () => string; env?: Record<string, string> };

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const apiUrl = env.VITE_API_URL || "http://localhost:8080";
  const streamingUrl = env.VITE_STREAMING_URL || "http://localhost:3000";

  return {
    plugins: [react()],
    server: {
      host: "0.0.0.0", // Allow external connections
      port: 5173,
      proxy: {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
        },
        "/api/torrent": {
          target: streamingUrl,
          changeOrigin: true,
          secure: false,
        },
      },
      watch: {
        usePolling: true,
      },
    },
  };
});
