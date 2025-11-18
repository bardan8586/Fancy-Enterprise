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
  const brandName = process.env.EMAIL_FROM_NAME || 'Fancy';
  const accentColor = '#7C3AED';
  const darkText = '#0f172a';
  
  const transporter = createTransporter();
  
  const mailOptions = {
    from: {
      name: brandName,
      address: process.env.GMAIL_USER
    },
    to: email,
    subject: `Reset your ${brandName} password`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Password Reset</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            * { box-sizing: border-box; }
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: ${darkText}; margin: 0; padding: 0; background: #f4f3ff; }
            .container { max-width: 640px; margin: 0 auto; padding: 32px 16px; }
            .card { background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 65px rgba(15,23,42,0.12); }
            .hero { background: linear-gradient(120deg, #F472B6, ${accentColor}); padding: 32px 40px; color: #fff; }
            .hero h1 { margin: 0; font-size: 28px; }
            .hero p { margin-top: 8px; opacity: .85; }
            .content { padding: 40px; }
            .button { 
              display: inline-block; 
              background: ${accentColor}; 
              color: #ffffff; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 999px; 
              margin: 24px 0;
              font-weight: 600;
              box-shadow: 0 10px 25px rgba(124,58,237,0.3);
            }
            .pill { display:inline-block; padding:4px 12px; border-radius:999px; background:rgba(15,23,42,0.08); font-size:12px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; }
            .code-block { background: #0f172a; color: #e2e8f0; padding: 16px; border-radius: 14px; word-break: break-all; font-family: 'JetBrains Mono', Consolas, monospace; font-size: 13px; }
            .warning { background: #fef3c7; border-radius: 14px; padding: 16px 18px; border: 1px solid #fde68a; margin: 24px 0; }
            .footer { padding: 24px; text-align: center; font-size: 13px; color: #94a3b8; }
            @media (max-width: 600px) {
              .content, .hero { padding: 28px; }
              .hero h1 { font-size: 24px; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="hero">
                <span class="pill">Action required</span>
                <h1>Reset your password</h1>
                <p>We received a request to update your ${brandName} password.</p>
              </div>
              
              <div class="content">
                <p>Hi ${userName},</p>
                <p>Use the secure button below to create a fresh password and get back to curating your wardrobe.</p>
                
                <div style="text-align: center;">
                  <a href="${resetUrl}" class="button">Create a new password</a>
                </div>
                
                <p style="margin-bottom: 8px;">Prefer to copy the link?</p>
                <div class="code-block">
                  ${resetUrl}
                </div>
                
                <div class="warning">
                  <strong>Before you go:</strong>
                  <ul>
                    <li>This link expires in <strong>15 minutes</strong> to keep your account safe.</li>
                    <li>If you didn’t request this, you can ignore the email—your password stays the same.</li>
                    <li>Need help? Just reply to this email and our team will assist.</li>
                  </ul>
                </div>
                
                <p>With love,<br><strong>The ${brandName} stylist team</strong></p>
              </div>
            </div>
            
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${brandName}. Curated looks for every moment.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${brandName} password reset

Hi ${userName},

Tap the link below to create a new password:
${resetUrl}

The link expires in 15 minutes. If you didn’t request this, you can ignore the email.

With love,
The ${brandName} stylist team
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
  const brandName = process.env.EMAIL_FROM_NAME || 'Fancy';
  const accentColor = '#ec4899';
  
  const mailOptions = {
    from: {
      name: brandName,
      address: process.env.GMAIL_USER
    },
    to: email,
    subject: `Welcome to ${brandName}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
            * { box-sizing: border-box; }
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.7; color: #0f172a; margin: 0; padding: 0; background: #fcfbff; }
            .container { max-width: 640px; margin: 0 auto; padding: 32px 16px; }
            .card { background: #ffffff; border-radius: 32px; overflow: hidden; box-shadow: 0 25px 65px rgba(15,23,42,0.08); }
            .hero { padding: 40px; background: radial-gradient(circle at top, #fef3c7, #fdf2f8, #faf5ff); text-align: center; }
            .hero h1 { margin: 0; font-size: 30px; color: #0f172a; }
            .hero p { margin: 12px 0 0; color: #475569; }
            .content { padding: 40px; }
            .button { 
              display: inline-block; 
              background: ${accentColor}; 
              color: #fff; 
              padding: 12px 24px; 
              text-decoration: none;
              border-radius: 999px;
              font-weight: 600;
              margin-top: 24px;
              box-shadow: 0 12px 30px rgba(236,72,153,0.35);
            }
            .steps { list-style: none; padding: 0; margin: 24px 0; }
            .steps li { background: #f8fafc; border-radius: 18px; padding: 16px 18px; margin-bottom: 12px; display: flex; align-items: center; gap: 12px; }
            .steps li span { background: #fff; border-radius: 999px; padding: 6px 12px; font-weight: 600; color: ${accentColor}; box-shadow: inset 0 0 0 1px rgba(236,72,153,0.2); }
            .footer { padding: 28px; text-align: center; font-size: 13px; color: #94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="hero">
                <p style="letter-spacing:.1em; text-transform:uppercase; font-size:12px; color:#a855f7;">Welcome to ${brandName}</p>
                <h1>We saved you a front-row seat 💌</h1>
                <p>Your new fashion playground is ready.</p>
              </div>
              
              <div class="content">
                <p>Hi ${userName},</p>
                <p>We’re thrilled you joined ${brandName}. Here’s how to make the most of your new closet companion:</p>
                
                <ul class="steps">
                  <li><span>01</span>Explore curated drops tailored for you.</li>
                  <li><span>02</span>Save your favorites and build wishlists.</li>
                  <li><span>03</span>Checkout with secure payments (hello, PayPal!).</li>
                </ul>
                
                <div style="text-align:center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Step into Fancy</a>
                </div>
                
                <p style="margin-top:24px;">Need styling tips or support? We’re one reply away ♥️</p>
                <p>— The ${brandName} concierge</p>
            </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${brandName}. Because every day deserves a look.</p>
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
