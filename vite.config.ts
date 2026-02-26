import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig, loadEnv } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

export default defineConfig(({ mode }) => {
  // Load environment variables from .env file
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [
      remix({
        future: {
          v3_fetcherPersist: true,
          v3_relativeSplatPath: true,
          v3_throwAbortReason: true,
        },
      }),
      tsconfigPaths(),
      svgr({
        svgrOptions: {
          icon: false,
        },
      }),
    ],
    define: {
      // Ensure environment variables are available at build time
      'import.meta.env.USE_LOCALHOST': JSON.stringify(env.USE_LOCALHOST),
      'import.meta.env.PROD_API_URL': JSON.stringify(env.PROD_API_URL),
      'import.meta.env.LOCAL_API_URL': JSON.stringify(env.LOCAL_API_URL),
    },
  };
});
