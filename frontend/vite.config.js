import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const backendTarget = "http://127.0.0.1:8000";
const apiRoutes = [
  "/auth",
  "/users",
  "/scores",
  "/leaderboard",
  "/stats",
  "/questions",
  "/admin",
  "/health"
];

const proxy = Object.fromEntries(
  apiRoutes.map((route) => [
    route,
    {
      target: backendTarget,
      changeOrigin: true
    }
  ])
);

export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "serve" ? "/" : "/app/",
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
    proxy
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
    strictPort: true
  }
}));
