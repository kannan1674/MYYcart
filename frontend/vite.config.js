import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Export the Vite config with the react plugin and chunking logic
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',  // Change the output folder name from 'dist' to 'build'
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';  // Bundle all node_modules into a single vendor chunk
          }
        }
      }
    }
  }
});
