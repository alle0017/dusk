import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    watch: {
      // Add paths or files to watch
      ignored: ['!node_modules/gloomjs/**'], // Ensure this dependency is watched
    },
    fs: {
      allow: [
        './', // Allow default project files
        'node_modules/gloomjs' // Explicitly allow this dependency
      ],
    },
  },
  optimizeDeps: {
    exclude: ['gloomjs'], // Exclude from pre-bundling
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined, // Optional: Adjust chunking for dependencies
      },
    },
    commonjsOptions: {
      include: [/node_modules\/gloomjs/], // Ensure CJS dependencies are transformed
    },
  },
});
