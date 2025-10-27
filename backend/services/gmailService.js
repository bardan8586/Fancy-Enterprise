const nodemailer = require('nodemailer');

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER, // Your Gmail address
      pass: process.env.GMAIL_APP_PASSWORD // Gmail App Password (not regular password)
    }
  });
};

/**
 * Send password reset email using Gmail SMTP
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name (optional)
 */
const sendPasswordResetEmail = async (email, resetToken, userName = 'User') => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Your App Name',
      address: process.env.GMAIL_USER
    },
    to: email,
    subject: 'Password Reset Request',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e9ecef; }
            .button { 
              display: inline-block; 
              background: #007bff; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            
            <div class="content">
              <p>Hello ${userName},</p>
              
              <p>We received a request to reset your password. If you made this request, click the button below to reset your password:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset My Password</a>
              </div>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in <strong>15 minutes</strong></li>
                  <li>If you didn't request this reset, please ignore this email</li>
                  <li>Your password will remain unchanged until you click the link above</li>
                </ul>
              </div>
              
              <p>If you're having trouble with the button above, copy and paste the URL into your web browser.</p>
              
              <p>Best regards,<br>Your App Team</p>
            </div>
            
            <div class="footer">
              <p>This email was sent because a password reset was requested for your account.</p>
              <p>If you didn't request this, please contact support.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Password Reset Request
      
      Hello ${userName},
      
      We received a request to reset your password. If you made this request, visit the link below to reset your password:
      
      ${resetUrl}
      
      This link will expire in 15 minutes.
      
      If you didn't request this reset, please ignore this email.
      
      Best regards,
      Your App Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset email sent to ${email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send welcome email using Gmail SMTP
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 */
const sendWelcomeEmail = async (email, userName) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: {
      name: process.env.EMAIL_FROM_NAME || 'Your App Name',
      address: process.env.GMAIL_USER
    },
    to: email,
    subject: 'Welcome to Your App!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e9ecef; }
            .button { 
              display: inline-block; 
              background: #007bff; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 5px; 
              margin: 20px 0;
            }
            .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; color: #6c757d; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Welcome to Your App!</h1>
            </div>
            
            <div class="content">
              <p>Hello ${userName},</p>
              
              <p>Welcome to our platform! We're excited to have you on board.</p>
              
              <p>Here's what you can do next:</p>
              <ul>
                <li>Complete your profile</li>
                <li>Explore our products</li>
                <li>Start shopping</li>
              </ul>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Get Started</a>
              </div>
              
              <p>If you have any questions, feel free to contact our support team.</p>
              
              <p>Best regards,<br>Your App Team</p>
            </div>
            
            <div class="footer">
              <p>Thank you for joining us!</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${email}:`, info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};
