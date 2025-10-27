# 📧 Email Setup Guide for Production

## 🚀 **SendGrid Setup (Recommended)**

### **Step 1: Create SendGrid Account**
1. Go to [SendGrid.com](https://sendgrid.com)
2. Sign up for free account (100 emails/day free)
3. Verify your email address

### **Step 2: Get API Key**
1. Go to **Settings** → **API Keys**
2. Click **Create API Key**
3. Choose **Restricted Access**
4. Give it **Mail Send** permissions
5. Copy the API key

### **Step 3: Verify Sender Identity**
1. Go to **Settings** → **Sender Authentication**
2. Choose **Single Sender Verification**
3. Add your email address (e.g., `noreply@yourapp.com`)
4. Verify the email

### **Step 4: Environment Variables**
Add these to your `.env` file:

```bash
# Email Configuration
SENDGRID_API_KEY=SG.your_api_key_here
SENDGRID_FROM_EMAIL=noreply@yourapp.com
SENDGRID_FROM_NAME=Your App Name
FRONTEND_URL=https://yourapp.com
NODE_ENV=production
```

## 🔄 **Alternative Email Services**

### **AWS SES (Amazon)**
- More complex setup but cheaper for high volume
- Requires AWS account and domain verification

### **Mailgun**
- Similar to SendGrid
- Good for transactional emails

### **Nodemailer with SMTP**
- Use any SMTP provider (Gmail, Outlook, etc.)
- More configuration required

## 🧪 **Testing Email in Development**

Currently, the app logs reset URLs to console in development mode. To test actual emails:

1. Set `NODE_ENV=production` in your `.env`
2. Add your SendGrid API key
3. Restart the server
4. Test forgot password flow

## 📋 **Email Templates Included**

✅ **Password Reset Email**
- Professional HTML template
- Security warnings
- 15-minute expiry notice
- Fallback text version

✅ **Welcome Email**
- Branded welcome message
- Call-to-action button
- Getting started tips

## 🔧 **Customization**

Edit `backend/services/emailService.js` to:
- Change email templates
- Add your branding
- Modify email content
- Add more email types

## 🚨 **Important Notes**

1. **Rate Limits**: SendGrid free tier = 100 emails/day
2. **Spam Prevention**: Always use verified sender addresses
3. **Testing**: Test with real email addresses
4. **Monitoring**: Check SendGrid dashboard for delivery stats
5. **Backup**: Email sending is non-blocking (won't break registration)

## 🎯 **Next Steps**

1. Set up SendGrid account
2. Add environment variables
3. Test with real email
4. Deploy to production
5. Monitor email delivery rates


