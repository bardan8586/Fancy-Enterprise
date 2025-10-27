import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment for tests (simulates browser)
    environment: 'jsdom',
    
    // Setup files to run before tests
    setupFiles: ['./src/__tests__/setup.js'],
    
    // Globals (make describe, it, expect available without imports)
    globals: true,
    
    // Coverage settings
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.config.js',
        '**/*.config.ts',
      ],
    },
  },
});

