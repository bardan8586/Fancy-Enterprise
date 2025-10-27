/**
 * Vitest Setup File
 * This runs before all tests
 */

import '@testing-library/jest-dom';
import { expect, afterEach, vi } from 'vitest';

// Clean up after each test
afterEach(() => {
  // Clean up any side effects
  vi.clearAllMocks();
});

console.log('✅ Vitest setup loaded!');

