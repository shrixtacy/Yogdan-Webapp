// Vite configuration — references config/ for tailwind and postcss
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import tailwindConfig from './config/tailwind.config.js';

export default defineConfig({
  plugins: [
    // Treat .js files as JSX (CRA-style convention)
    react({ include: /\.(js|jsx)$/ }),
  ],
  css: {
    postcss: {
      plugins: [
        tailwindcss(tailwindConfig),
        autoprefixer(),
      ],
    },
  },
  esbuild: {
    // Tell esbuild to parse JSX syntax in .js files
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { '.js': 'jsx' },
    },
  },
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
});
