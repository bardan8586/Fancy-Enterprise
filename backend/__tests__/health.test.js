/**
 * ==========================================
 * TESTING YOUR API - HEALTH CHECK ENDPOINT
 * ==========================================
 * 
 * This test file teaches you:
 * - How to use Supertest to test API endpoints
 * - How to test Express routes
 * - How to check HTTP status codes and responses
 * 
 * PATIENT: First API test (simple and important)
 * CONTEXT: Testing the /health endpoint
 */

const request = require('supertest');
const express = require('express');

// ═══════════════════════════════════════════════════════════
// CREATE A MINI EXPRESS APP FOR TESTING
// ═══════════════════════════════════════════════════════════

const app = express();

// Add a test /health route (simulating your actual server.js)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ═══════════════════════════════════════════════════════════
// YOUR FIRST API TEST!
// ═══════════════════════════════════════════════════════════

describe('🏥 Health Check API Tests', () => {
  
  /**
   * TEST: Check if /health endpoint works
   * WHAT: Testing GET request to /health
   * WHY: Health check is crucial for monitoring server status
   * HOW: Send GET request, check status and response
   */
  
  test('GET /health should return 200 status', async () => {
    // Using Supertest to make HTTP request
    const response = await request(app)
      .get('/health')              // Make GET request to /health
      .expect(200);                // Expect status code 200
    
    // Check the response body
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Server is healthy');
  });

  /**
   * TEST: Check if response has correct structure
   * WHAT: Testing that response has all required fields
   * WHY: Frontend expects specific data structure
   */
  
  test('GET /health should return correct data structure', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    // Check if response has required properties
    expect(response.body).toHaveProperty('success');
    expect(response.body).toHaveProperty('message');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('environment');
    
    // Check data types
    expect(typeof response.body.success).toBe('boolean');
    expect(typeof response.body.message).toBe('string');
    expect(typeof response.body.timestamp).toBe('string');
  });

  /**
   * TEST: Check if timestamp is valid ISO string
   * WHAT: Testing timestamp format
   * WHY: Frontend may need valid dates
   */
  
  test('GET /health should return valid timestamp', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    // Create a Date object from the timestamp string
    const timestamp = new Date(response.body.timestamp);
    
    // Check if it's a valid date
    expect(timestamp.toString()).not.toBe('Invalid Date');
    expect(timestamp.getTime()).toBeGreaterThan(0);
  });
});

/**
 * 📚 LEARNING POINTS:
 * 
 * 1. request(app) - Creates a test version of your Express app
 * 2. .get('/health') - Makes a GET request to /health endpoint
 * 3. .expect(200) - Checks if status code is 200
 * 4. response.body - Contains the JSON response data
 * 5. expect() - Jest assertion library
 * 
 * 🎯 KEY CONCEPTS:
 * - HTTP methods: GET, POST, PUT, DELETE
 * - Status codes: 200 (OK), 400 (Bad Request), 401 (Unauthorized), etc.
 * - Response structure: Always check data shape
 * - Async/await: API calls are asynchronous
 */

