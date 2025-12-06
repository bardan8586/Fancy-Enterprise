# 🚀 PRODUCTION DEPLOYMENT CHECKLIST

## ✅ CODE REVIEW - ALL GOOD!

### 1. Environment Variables ✅
- ✅ All URLs use environment variables
- ✅ No hardcoded localhost in production code
- ✅ Fallbacks are safe (localhost only as fallback)

### 2. CORS Configuration ✅
- ✅ Production mode enforces `FRONTEND_URL`
- ✅ Development allows localhost
- ✅ Proper error handling

### 3. Database Configuration ✅
- ✅ Uses `LOCAL_MONGODB` flag for local dev
- ✅ Falls back to `MONGODB_URI` for production
- ✅ Proper error handling

### 4. Google OAuth ✅
- ✅ Uses `GOOGLE_CLIENT_ID` from env
- ✅ Frontend uses `VITE_GOOGLE_CLIENT_ID`
- ✅ Backend verifies tokens properly

### 5. Dependencies ✅
- ✅ `google-auth-library` installed
- ✅ All required packages present

---

## ⚠️ REQUIRED ENVIRONMENT VARIABLES FOR PRODUCTION

### Backend (AWS/Your Server):
```env
# Database
MONGODB_URI=your-mongodb-atlas-connection-string

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Server
PORT=3000 (or your AWS port)
NODE_ENV=production

# Frontend URL (IMPORTANT!)
FRONTEND_URL=https://d1byhkw9eqezvg.cloudfront.net

# Google OAuth
GOOGLE_CLIENT_ID=504894052132-n8agsfim17ep0smk0dc4dm8eetoj4ib4.apps.googleusercontent.com
```

### Frontend (AWS CloudFront):
```env
# Backend URL (IMPORTANT!)
VITE_BACKEND_URL=https://your-backend-url.com

# Google OAuth
VITE_GOOGLE_CLIENT_ID=504894052132-n8agsfim17ep0smk0dc4dm8eetoj4ib4.apps.googleusercontent.com
```

---

## 🔍 PRE-DEPLOYMENT CHECKS

### 1. MongoDB Atlas ✅
- [ ] Database is set up in MongoDB Atlas
- [ ] Connection string is ready
- [ ] IP whitelist includes your AWS server IP (or 0.0.0.0/0 for all)
- [ ] Database user has proper permissions

### 2. Google Cloud Console ✅
- [x] OAuth consent screen configured
- [x] Client ID created: `504894052132-n8agsfim17ep0smk0dc4dm8eetoj4ib4.apps.googleusercontent.com`
- [x] Authorized JavaScript origins:
  - `http://localhost:5173`
  - `https://d1byhkw9eqezvg.cloudfront.net`
- [ ] Authorized redirect URIs (if needed):
  - `http://localhost:5173`
  - `https://d1byhkw9eqezvg.cloudfront.net`

### 3. AWS Configuration
- [ ] Backend server environment variables set
- [ ] Frontend build environment variables set
- [ ] CloudFront distribution configured
- [ ] Security groups allow traffic on port 3000 (backend)
- [ ] SSL certificates configured

### 4. Code Quality
- [x] No hardcoded localhost URLs
- [x] All environment variables used correctly
- [x] Error handling in place
- [x] CORS properly configured

---

## 🚨 CRITICAL: BEFORE DEPLOYING

### 1. Remove LOCAL_MONGODB Flag
In production, make sure `LOCAL_MONGODB` is **NOT** set to `true`.
The backend should use `MONGODB_URI` from environment.

### 2. Verify FRONTEND_URL
Make sure `FRONTEND_URL` in backend matches your CloudFront URL exactly:
```
FRONTEND_URL=https://d1byhkw9eqezvg.cloudfront.net
```
(No trailing slash!)

### 3. Verify VITE_BACKEND_URL
Make sure frontend knows where your backend is:
```
VITE_BACKEND_URL=https://your-backend-url.com
```

### 4. Test Google OAuth
After deployment, test:
- [ ] Google Sign-In button appears
- [ ] Clicking opens Google popup
- [ ] Authentication works
- [ ] User is created/logged in successfully

---

## 📝 DEPLOYMENT STEPS

### Backend Deployment:
1. Set all environment variables in AWS
2. Make sure `NODE_ENV=production`
3. Make sure `LOCAL_MONGODB` is NOT set (or set to false)
4. Deploy backend code
5. Test health endpoint: `https://your-backend.com/health`

### Frontend Deployment:
1. Build frontend with production env vars
2. Upload to CloudFront/S3
3. Verify `VITE_BACKEND_URL` is correct
4. Verify `VITE_GOOGLE_CLIENT_ID` is set
5. Test the app loads correctly

---

## 🧪 POST-DEPLOYMENT TESTS

### Basic Functionality:
- [ ] Homepage loads
- [ ] Products display
- [ ] User can register
- [ ] User can login
- [ ] Google Sign-In works
- [ ] Cart functionality works
- [ ] Checkout works

### API Tests:
```bash
# Test backend health
curl https://your-backend.com/health

# Test CORS (should work from your frontend domain)
curl -H "Origin: https://d1byhkw9eqezvg.cloudfront.net" \
     -H "Access-Control-Request-Method: POST" \
     -X OPTIONS \
     https://your-backend.com/api/users/login
```

---

## ⚠️ KNOWN ISSUES / NOTES

1. **Email Services**: All email services have localhost fallback, but will use `FRONTEND_URL` in production ✅

2. **Database**: Make sure MongoDB Atlas IP whitelist includes your AWS server IP

3. **Google OAuth**: Make sure CloudFront URL is in authorized origins (already done ✅)

4. **CORS**: Production mode is strict - only allows `FRONTEND_URL`. Make sure it's set correctly!

---

## ✅ READY TO DEPLOY!

All code checks passed. Just make sure:
1. Environment variables are set correctly in AWS
2. MongoDB Atlas is accessible from AWS
3. Google OAuth origins include your CloudFront URL
4. Test after deployment!

Good luck! 🚀
