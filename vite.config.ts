import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import TanStackRouterVite from "@tanstack/router-plugin/vite";
import dsv from "@rollup/plugin-dsv";
import mdx from "@mdx-js/rollup";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    dsv(),
    { enforce: "pre", ...mdx({ providerImportSource: "@mdx-js/react" }) },
    TanStackRouterVite({ target: "react", autoCodeSplitting: true }),
    react(),
    basicSsl(),
  ],
});
