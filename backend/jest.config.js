module.exports = {
  // Tell Jest where to find test files
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  
  // Set environment to node (not browser)
  testEnvironment: 'node',
  
  // Files to clean up before running tests
  clearMocks: true,
  
  // Coverage settings (shows which lines are tested)
  collectCoverage: false, // Set to true when you want coverage reports
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Files to exclude from coverage
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/config/',
    '/seeder.js'
  ],
  
  // Maximum amount of workers used to run tests
  maxWorkers: '50%',
  
  // Setup files to run before tests
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Verbose output (shows more details)
  verbose: true,
  
  // Transform ES6 to CommonJS (if needed)
  transform: {},
  
  // Module paths (if you have path aliases)
  modulePaths: ['<rootDir>'],
  
  // Maximum time a test can run (prevent infinite loops)
  testTimeout: 10000
};

