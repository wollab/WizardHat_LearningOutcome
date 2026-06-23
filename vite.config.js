import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base: './' -> relative paths, works on GitHub Pages under any sub-path
export default defineConfig({
  plugins: [react()],
  base: './',
});
