/**
 * ==========================================
 * YOUR FIRST TEST FILE - WITH EXPLANATIONS!
 * ==========================================
 * 
 * This file teaches you EVERYTHING about testing.
 * Each test has detailed comments explaining WHAT, WHY, and HOW.
 * 
 * CREDENTIALS: This is the foundational test file.
 * Read the comments carefully - they teach you testing concepts.
 */

// ═══════════════════════════════════════════════════════════
// SECTION 1: BASIC MATH TESTS (Understanding the basics)
// ═══════════════════════════════════════════════════════════

describe('🔢 Basic Math Operations', () => {
  /**
   * WHAT: Testing basic addition
   * WHY: To understand the test syntax
   * HOW: Jest's test() function runs a test
   */
  
  test('2 + 2 should equal 4', () => {
    // ARRANGE: Set up the data
    const num1 = 2;
    const num2 = 2;
    
    // ACT: Perform the operation
    const result = num1 + num2;
    
    // ASSERT: Check if result is correct
    expect(result).toBe(4);
  });

  test('should multiply numbers correctly', () => {
    expect(3 * 5).toBe(15);
  });
  
  test('should divide numbers correctly', () => {
    expect(10 / 2).toBe(5);
  });
});

// ═══════════════════════════════════════════════════════════
// SECTION 2: ARRAY MANIPULATION TESTS
// ═══════════════════════════════════════════════════════════

describe('📦 Array Operations', () => {
  
  test('should add item to cart', () => {
    // ARRANGE: Start with an empty cart
    const cart = [];
    
    // ACT: Add an item
    const item = { id: 1, name: 'Shirt', price: 29.99 };
    cart.push(item);
    
    // ASSERT: Check if item is in cart
    expect(cart.length).toBe(1);
    expect(cart[0].name).toBe('Shirt');
  });

  test('should calculate cart total', () => {
    // This simulates what happens in your E-commerce app!
    const cart = [
      { price: 29.99, quantity: 2 },
      { price: 49.99, quantity: 1 }
    ];
    
    const total = cart.reduce((sum, item) => 
      sum + (item.price * item.quantity), 0
    );
    
    expect(total).toBe(109.97); // 29.99 * 2 + 49.99 * 1
  });

  test('should find product by ID', () => {
    const products = [
      { id: 1, name: 'Shirt' },
      { id: 2, name: 'Pants' },
      { id: 3, name: 'Shoes' }
    ];
    
    const product = products.find(p => p.id === 2);
    
    expect(product).toBeTruthy(); // Check it exists
    expect(product.name).toBe('Pants');
  });
});

// ═══════════════════════════════════════════════════════════
// SECTION 3: OBJECT MANIPULATION TESTS
// ═══════════════════════════════════════════════════════════

describe('🎁 Object Operations', () => {
  
  test('should create user object', () => {
    // This is like testing user registration!
    const user = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedPassword123',
      role: 'customer'
    };
    
    expect(user.name).toBe('John Doe');
    expect(user.email).toContain('@'); // Check valid email format
    expect(user.role).toBe('customer');
  });

  test('should validate email format', () => {
    const emails = [
      'test@example.com',    // Valid
      'user.name@domain.com', // Valid
      'invalid-email',        // Invalid
      '@example.com'          // Invalid
    ];
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test(emails[0])).toBe(true);
    expect(emailRegex.test(emails[2])).toBe(false);
  });
});

// ═══════════════════════════════════════════════════════════
// SECTION 4: ASYNC/PROMISE TESTS
// ═══════════════════════════════════════════════════════════

describe('⚡ Async Operations', () => {
  
  /**
   * WHAT: Testing async operations (like API calls)
   * WHY: Your app does many async things (save to DB, send emails, etc.)
   * HOW: Use async/await or .then()
   */
  
  test('should handle async operations', async () => {
    // Simulating an async function (like saving to database)
    const saveUser = async () => {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve({ id: 1, name: 'Test User' });
        }, 100);
      });
    };
    
    // ACT: Call the async function
    const user = await saveUser();
    
    // ASSERT: Check the result
    expect(user.id).toBe(1);
    expect(user.name).toBe('Test User');
  });

  test('should handle errors in async', async () => {
    // Simulating a function that throws an error
    const failingFunction = async () => {
      throw new Error('Something went wrong!');
    };
    
    // Use .rejects to test if function throws error
    await expect(failingFunction()).rejects.toThrow('Something went wrong!');
  });
});

// ═══════════════════════════════════════════════════════════
// SECTION 5: TESTING E-COMMERCE BUSINESS LOGIC
// ═══════════════════════════════════════════════════════════

describe('🛒 E-Commerce Logic Tests', () => {
  
  /**
   * These tests simulate REAL business logic from your E-commerce app!
   */
  
  // Calculate price with tax
  function calculatePriceWithTax(price, taxRate) {
    return price + (price * taxRate);
  }
  
  test('should calculate total price with 10% tax', () => {
    const price = 100;
    const taxRate = 0.10;
    const total = calculatePriceWithTax(price, taxRate);
    
    expect(total).toBe(110); // 100 + 10% = 110
  });
  
  // Check if user has admin role
  function isAdmin(user) {
    return user.role === 'admin';
  }
  
  test('should identify admin users', () => {
    const adminUser = { role: 'admin', email: 'admin@example.com' };
    const regularUser = { role: 'customer', email: 'user@example.com' };
    
    expect(isAdmin(adminUser)).toBe(true);
    expect(isAdmin(regularUser)).toBe(false);
  });
  
  // Calculate shipping cost
  function calculateShipping(total) {
    if (total > 100) return 0;      // Free shipping
    if (total > 50) return 10;      // $10 shipping
    return 15;                       // $15 shipping
  }
  
  test('should apply correct shipping costs', () => {
    expect(calculateShipping(150)).toBe(0);   // Free shipping
    expect(calculateShipping(75)).toBe(10);    // $10 shipping
    expect(calculateShipping(25)).toBe(15);   // $15 shipping
  });
});

// ═══════════════════════════════════════════════════════════
// SECTION 6: TESTING ARRAYS WITH DIFFERENT ASSERTIONS
// ═══════════════════════════════════════════════════════════

describe('🎯 Advanced Assertions', () => {
  
  test('should check if array contains item', () => {
    const cart = ['shirt', 'pants', 'shoes'];
    
    expect(cart).toContain('shirt');
    expect(cart).toHaveLength(3);
  });
  
  test('should check object properties', () => {
    const product = {
      id: 1,
      name: 'Nike Shoes',
      price: 99.99,
      inStock: true
    };
    
    // Check if object has property
    expect(product).toHaveProperty('name');
    expect(product).toHaveProperty('price', 99.99);
    
    // Check if value is truthy/falsy
    expect(product.inStock).toBeTruthy();
  });
  
  test('should check partial object match', () => {
    const user = {
      id: 1,
      name: 'John',
      email: 'john@example.com',
      role: 'customer',
      password: 'hashed123'
    };
    
    // Match only some properties
    expect(user).toEqual(
      expect.objectContaining({
        name: 'John',
        email: 'john@example.com'
      })
    );
  });
});

// ═══════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════

/**
 * 🎉 CONGRATULATIONS! You just learned:
 * 
 * ✅ Test structure (describe, test, expect)
 * ✅ The AAA pattern (Arrange, Act, Assert)
 * ✅ Different types of assertions (toBe, toEqual, toContain)
 * ✅ Testing arrays and objects
 * ✅ Testing async operations
 * ✅ Testing business logic
 * 
 * 💡 NEXT STEPS:
 * 1. Run these tests: npm test
 * 2. See what passes/fails
 * 3. Modify tests to understand better
 * 4. Create your own tests
 * 
 * 🚀 READY FOR REAL API TESTS? Let's test your actual backend!
 */

