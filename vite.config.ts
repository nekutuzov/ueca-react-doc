import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths'; // For resolving Typescript path aliases

// https://vite.dev/config/
export default defineConfig({
  base: '/ueca-react-doc/',
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 5001,
  },
})
