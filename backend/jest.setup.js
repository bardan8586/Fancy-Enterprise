// This file runs before each test
// Use it to set up testing environment

// Increase timeout for tests
jest.setTimeout(10000);

// Suppress console logs during tests (optional - cleaner output)
// Uncomment if you want to suppress console logs
// global.console = {
//   log: jest.fn(),
//   error: jest.fn(),
//   warn: jest.fn(),
//   info: jest.fn(),
// };

// Clean up after all tests
afterAll(async () => {
  // Close any open connections
  await new Promise(resolve => setTimeout(resolve, 1000));
});

console.log('Jest setup loaded! 🚀');

