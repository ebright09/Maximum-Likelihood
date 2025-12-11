import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    // IMPORTANT: This must match your repository name for GitHub Pages to find assets
    base: '/Maximum-Likelihood/',
    define: {
      // safe exposure of API key for the "tutoring" context logic
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});
