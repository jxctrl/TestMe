import { defineConfig, loadEnv } from "vite";
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

function normalizeBasePath(value, fallback) {
  const trimmed = (value || fallback).trim();
  if (!trimmed || trimmed === "/") {
    return "/";
  }

  return `/${trimmed.replace(/^\/+|\/+$/g, "")}/`;
}

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const base = normalizeBasePath(
    env.VITE_APP_BASE_PATH,
    command === "serve" ? "/" : "/app/"
  );

  return {
    plugins: [react()],
    base,
    build: {
      outDir: mode === "mobile" ? "dist-mobile" : "dist"
    },
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
  };
});
