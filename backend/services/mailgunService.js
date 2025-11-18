const mailgun = require('mailgun-js');

// Initialize Mailgun
const mg = mailgun({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

/**
 * Send password reset email using Mailgun
 * @param {string} email - User's email address
 * @param {string} resetToken - Password reset token
 * @param {string} userName - User's name (optional)
 */
const sendPasswordResetEmail = async (email, resetToken, userName = 'User') => {
  const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
  const brandName = process.env.EMAIL_FROM_NAME || 'Fancy';
  const accentColor = '#7C3AED';
  
  const data = {
    from: `${brandName} <${process.env.MAILGUN_FROM_EMAIL}>`,
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
            body { font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #0f172a; margin: 0; padding: 0; background:#f4f3ff; }
            .container { max-width: 640px; margin:0 auto; padding:32px 16px; }
            .card { background:#fff; border-radius:24px; overflow:hidden; box-shadow:0 25px 60px rgba(15,23,42,.12); }
            .hero { background:linear-gradient(135deg,#F472B6,${accentColor}); padding:32px 40px; color:#fff; }
            .content { padding:40px; }
            .button { display:inline-block; background:${accentColor}; color:#fff; padding:12px 24px; border-radius:999px; font-weight:600; text-decoration:none; margin:24px 0; box-shadow:0 12px 30px rgba(124,58,237,.35); }
            .code-block { background:#0f172a; color:#e2e8f0; padding:16px; border-radius:14px; word-break:break-all; font-family:'JetBrains Mono',monospace; font-size:13px; }
            .warning { background:#fef3c7; border-radius:14px; padding:16px; border:1px solid #fde68a; margin:24px 0; }
            .footer { padding:24px; text-align:center; font-size:13px; color:#94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="hero">
                <p style="letter-spacing:.1em;text-transform:uppercase;font-size:12px;margin:0 0 6px;">Action required</p>
                <h1 style="margin:0;">Reset your password</h1>
                <p style="margin:10px 0 0;">We received a request to refresh your ${brandName} credentials.</p>
              </div>
              <div class="content">
                <p>Hi ${userName},</p>
                <p>Tap the button below to create a new password and step back into your wardrobe.</p>
                <div style="text-align:center;">
                  <a href="${resetUrl}" class="button">Create a new password</a>
                </div>
                <p style="margin-top:24px;">Prefer to copy the link?</p>
                <div class="code-block">${resetUrl}</div>
                <div class="warning">
                  <strong>Security notes:</strong>
                  <ul>
                    <li>The link expires in 15 minutes.</li>
                    <li>If this wasn’t you, ignore the email—your password stays the same.</li>
                    <li>Need help? Reply and our concierge will assist.</li>
                  </ul>
                </div>
                <p>With love,<br><strong>The ${brandName} team</strong></p>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${brandName}. Dressing every chapter.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
${brandName} password reset

Hi ${userName},

Use the link below to create a new password:
${resetUrl}

This link expires in 15 minutes. If you didn’t request it, ignore this email.

— The ${brandName} team
    `
  };

  try {
    const result = await mg.messages().send(data);
    console.log(`✅ Password reset email sent to ${email}:`, result.id);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send welcome email using Mailgun
 * @param {string} email - User's email address
 * @param {string} userName - User's name
 */
const sendWelcomeEmail = async (email, userName) => {
  const brandName = process.env.EMAIL_FROM_NAME || 'Fancy';
  const data = {
    from: `${brandName} <${process.env.MAILGUN_FROM_EMAIL}>`,
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
            body { font-family:'Inter',Arial,sans-serif; line-height:1.7; color:#0f172a; margin:0; padding:0; background:#fcfbff; }
            .container { max-width:640px; margin:0 auto; padding:32px 16px; }
            .card { background:#fff; border-radius:32px; overflow:hidden; box-shadow:0 20px 55px rgba(15,23,42,.08); }
            .hero { padding:40px; text-align:center; background:radial-gradient(circle at top,#fef3c7,#fdf2f8,#faf5ff); }
            .content { padding:40px; }
            .button { 
              display: inline-block; 
              background: #ec4899; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none;
              border-radius: 999px;
              font-weight: 600;
              margin-top: 24px;
            }
            .steps { list-style:none; padding:0; margin:24px 0; }
            .steps li { background:#f8fafc; border-radius:18px; padding:16px 18px; margin-bottom:12px; display:flex; align-items:center; gap:12px; }
            .steps span { background:#fff; border-radius:999px; padding:6px 12px; font-weight:600; color:#ec4899; box-shadow:inset 0 0 0 1px rgba(236,72,153,.2); }
            .footer { padding:24px; text-align:center; font-size:13px; color:#94a3b8; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="card">
              <div class="hero">
                <p style="letter-spacing:.15em;text-transform:uppercase;color:#a855f7;font-size:12px;margin:0;">${brandName}</p>
                <h1 style="margin:12px 0 0;">Your curated closet is ready</h1>
                <p style="margin:12px 0 0;color:#475569;">We’re thrilled to style your journey.</p>
              </div>
              
              <div class="content">
                <p>Hello ${userName},</p>
                <p>Welcome to ${brandName}! Here’s how to dive in:</p>
                <ul class="steps">
                  <li><span>01</span>Browse new arrivals curated for you.</li>
                  <li><span>02</span>Save pieces you love to wishlists.</li>
                  <li><span>03</span>Checkout securely with PayPal or card.</li>
                </ul>
                <div style="text-align:center;">
                  <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" class="button">Explore ${brandName}</a>
                </div>
                <p style="margin-top:24px;">Need recommendations? Reply and our stylists will help.</p>
                <p>— The ${brandName} concierge</p>
              </div>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} ${brandName}. Dressing every moment with intention.</p>
            </div>
          </div>
        </body>
      </html>
    `
  };

  try {
    const result = await mg.messages().send(data);
    console.log(`✅ Welcome email sent to ${email}:`, result.id);
    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('❌ Failed to send welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
};

module.exports = {
  sendPasswordResetEmail,
  sendWelcomeEmail
};







