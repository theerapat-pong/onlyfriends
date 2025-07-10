import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Expose environment variables to the client.
      // This is required for the @google/genai SDK, which uses process.env.API_KEY.
      // Vite automatically handles 'import.meta.env' for VITE_ prefixed variables,
      // so this is only needed for non-prefixed ones.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});