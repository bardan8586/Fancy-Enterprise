// Test Gmail SMTP Email Service
require('dotenv').config();
const { sendPasswordResetEmail } = require('./services/gmailService');

// Test function
const testEmail = async () => {
  try {
    console.log('🧪 Testing Gmail SMTP...');
    
    // Replace with your email for testing
    const testEmail = 'karkibardan063@gmail.com';
    const testToken = 'test-token-123';
    const testName = 'Test User';
    
    const result = await sendPasswordResetEmail(testEmail, testToken, testName);
    console.log('✅ Email sent successfully:', result);
    
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.log('\n📋 Setup Checklist:');
    console.log('1. Enable 2-Factor Authentication on Gmail');
    console.log('2. Generate App Password');
    console.log('3. Add GMAIL_USER and GMAIL_APP_PASSWORD to .env');
    console.log('4. Restart server');
  }
};

// Uncomment the line below to test
testEmail();

module.exports = { testEmail };
