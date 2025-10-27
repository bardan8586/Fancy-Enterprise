/**
 * ==========================================
 * FRONTEND TESTING - React Component Tests
 * ==========================================
 * 
 * This test file teaches you:
 * - How to test React components with React Testing Library
 * - How to render components
 * - How to query elements
 * - How to simulate user interactions
 * 
 * PEDAGOGICAL: Learning frontend testing step by step
 * CONTEXT: Testing a simple React component
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

// ═══════════════════════════════════════════════════════════
// EXAMPLE 1: Simple Component Test
// ═══════════════════════════════════════════════════════════

/**
 * WHAT: Simple button component that increments a counter
 * WHY: Demonstrates basic component testing
 * HOW: Render → Find element → Check text
 */
function CounterButton() {
  const [count, setCount] = React.useState(0);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  );
}

describe('🔢 Counter Button Component', () => {
  it('should render with initial count of 0', () => {
    // ACT: Render the component
    render(<CounterButton />);
    
    // ASSERT: Check if button text contains "0"
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('Clicked 0 times');
  });

  it('should increment count when clicked', async () => {
    // ARRANGE: Render the component and get user event
    render(<CounterButton />);
    const user = userEvent.setup();
    
    // ACT: Click the button
    const button = screen.getByRole('button');
    await user.click(button);
    
    // ASSERT: Check if count increased
    expect(button).toHaveTextContent('Clicked 1 times');
  });
});

// ═══════════════════════════════════════════════════════════
// EXAMPLE 2: Form Component Test
// ═══════════════════════════════════════════════════════════

/**
 * WHAT: Form component that handles user input
 * WHY: Demonstrates testing forms and input
 * HOW: Render → Find input → Type text → Check value
 */
function SearchForm() {
  const [searchTerm, setSearchTerm] = React.useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Searching for: ${searchTerm}`);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Search</button>
      <p>You searched for: {searchTerm}</p>
    </form>
  );
}

describe('🔍 Search Form Component', () => {
  it('should render search input', () => {
    // ACT: Render the form
    render(<SearchForm />);
    
    // ASSERT: Check if input exists
    const input = screen.getByPlaceholderText('Search products...');
    expect(input).toBeInTheDocument();
  });

  it('should update when user types', async () => {
    // ARRANGE
    render(<SearchForm />);
    const user = userEvent.setup();
    
    // ACT: Type in the input
    const input = screen.getByPlaceholderText('Search products...');
    await user.type(input, 'shirt');
    
    // ASSERT: Check if value updated
    expect(input).toHaveValue('shirt');
    expect(screen.getByText('You searched for: shirt')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════
// EXAMPLE 3: Conditional Rendering Test
// ═══════════════════════════════════════════════════════════

/**
 * WHAT: Component that shows content conditionally
 * WHY: Demonstrates testing conditional logic
 * HOW: Render → Check if element appears/disappears
 */
function LoginStatus({ isLoggedIn, userName }) {
  if (isLoggedIn) {
    return (
      <div>
        <p>Welcome back, {userName}!</p>
        <button>Logout</button>
      </div>
    );
  }
  
  return (
    <div>
      <p>Please log in</p>
      <button>Login</button>
    </div>
  );
}

describe('👤 Login Status Component', () => {
  it('should show login button when not logged in', () => {
    // ACT: Render with isLoggedIn=false
    render(<LoginStatus isLoggedIn={false} />);
    
    // ASSERT: Check if login button is visible
    expect(screen.getByText('Please log in')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
  });

  it('should show user name when logged in', () => {
    // ACT: Render with isLoggedIn=true
    render(<LoginStatus isLoggedIn={true} userName="John" />);
    
    // ASSERT: Check if welcome message shows user name
    expect(screen.getByText('Welcome back, John!')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════
// EXAMPLE 4: Product Card Component (E-Commerce!)
// ═══════════════════════════════════════════════════════════

/**
 * WHAT: Product card like in your E-commerce app
 * WHY: Real-world example from YOUR project
 * HOW: Render → Check product data → Test interactions
 */
function ProductCard({ product, onAddToCart }) {
  return (
    <div data-testid="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <button onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
      {product.inStock ? (
        <span className="in-stock">In Stock</span>
      ) : (
        <span className="out-of-stock">Out of Stock</span>
      )}
    </div>
  );
}

describe('🛍️ Product Card Component (E-Commerce)', () => {
  it('should display product information', () => {
    // ARRANGE: Create mock product data
    const mockProduct = {
      id: 1,
      name: 'Nike Shoes',
      price: 99.99,
      image: '/images/shoes.jpg',
      inStock: true
    };
    
    const mockAddToCart = () => {};
    
    // ACT: Render the component
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    
    // ASSERT: Check if product info is displayed
    expect(screen.getByText('Nike Shoes')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
    expect(screen.getByText('In Stock')).toBeInTheDocument();
  });

  it('should call onAddToCart when button clicked', async () => {
    // ARRANGE: Create mock product and handler
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      price: 29.99,
      image: '/test.jpg',
      inStock: true
    };
    
    const mockAddToCart = vi.fn(); // Mock function from Vitest
    
    // ACT: Render and click button
    render(<ProductCard product={mockProduct} onAddToCart={mockAddToCart} />);
    const user = userEvent.setup();
    
    const addButton = screen.getByRole('button', { name: 'Add to Cart' });
    await user.click(addButton);
    
    // ASSERT: Check if function was called with correct product
    expect(mockAddToCart).toHaveBeenCalledTimes(1);
    expect(mockAddToCart).toHaveBeenCalledWith(mockProduct);
  });

  it('should show out of stock message when product unavailable', () => {
    // ARRANGE: Product that's out of stock
    const mockProduct = {
      id: 1,
      name: 'Test Product',
      price: 29.99,
      image: '/test.jpg',
      inStock: false
    };
    
    // ACT: Render
    render(<ProductCard product={mockProduct} onAddToCart={() => {}} />);
    
    // ASSERT: Check if out of stock message is shown
    expect(screen.getByText('Out of Stock')).toBeInTheDocument();
  });
});

// ═══════════════════════════════════════════════════════════
// KEY CONCEPTS YOU'VE LEARNED
// ═══════════════════════════════════════════════════════════

/**
 * 📚 REACT TESTING LIBRARY CONCEPTS:
 * 
 * 1. render() - Renders a React component into the DOM
 * 2. screen - Object with methods to query elements
 * 3. getByRole() - Find element by its role (button, input, etc.)
 * 4. getByText() - Find element by its text content
 * 5. getByPlaceholderText() - Find input by placeholder
 * 6. toBeInTheDocument() - Check if element is rendered
 * 7. toHaveTextContent() - Check element's text content
 * 8. toHaveValue() - Check input's value
 * 
 * 🎯 KEY DIFFERENCES FROM BACKEND TESTS:
 * 
 * - Backend: Test API endpoints, database operations
 * - Frontend: Test UI, user interactions, rendering
 * - Backend uses Supertest for HTTP requests
 * - Frontend uses React Testing Library for components
 * - Both use async/await for handling async operations
 * 
 * 💡 BEST PRACTICES:
 * 
 * 1. Test from user's perspective
 * 2. Use semantic queries (getByRole is better than getById)
 * 3. Test behavior, not implementation
 * 4. Use userEvent for interactions (not fireEvent)
 * 5. Keep tests simple and focused
 * 
 * 🚀 NEXT STEPS:
 * 
 * - Test actual components from your E-commerce app
 * - Test Redux store and actions
 * - Test API calls and data fetching
 * - Test routing with React Router
 */

