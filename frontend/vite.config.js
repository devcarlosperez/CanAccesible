import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    allowedHosts: ["canaccesible.es", "www.canaccesible.es", "localhost"],
  },
  test: {
    enviroment: "jsdom",
    globals: true,
    setupFiles: "./src/setupTest.js",
  },
});
