# 🚀 AWS PRODUCTION DEPLOYMENT CHECKLIST

## 📊 CURRENT SERVER STATUS (From Logs)

✅ **Server is running** - PM2 shows online  
✅ **MongoDB connected** - Database working  
✅ **CORS working** - Requests from CloudFront succeeding  
⚠️ **Server has OLD code** - Still has wishlist routes (we removed them)  
❌ **Google OAuth missing** - Not in current server code  

---

## 🔧 WHAT NEEDS TO BE DONE ON AWS SERVER

### 1. **Update Code on Server** ⚠️ CRITICAL
```bash
# SSH into server
ssh -i /Users/bardankarki/Downloads/ecommerce-key.pem ubuntu@54.252.251.170

# Navigate to project
cd ~/Fancy-Enterprise

# Pull latest code (with Google OAuth)
git pull origin main

# If conflicts, stash local changes first
git stash
git pull origin main
```

### 2. **Install Google Auth Library on Server** ⚠️ REQUIRED
```bash
cd ~/Fancy-Enterprise/backend
npm install google-auth-library
```

### 3. **Add Environment Variables to Server** ⚠️ CRITICAL

Edit `~/.pm2/ecosystem.config.js` or add to `.env` file:

```bash
cd ~/Fancy-Enterprise/backend
nano .env
```

**Add this line:**
```env
GOOGLE_CLIENT_ID=504894052132-n8agsfim17ep0smk0dc4dm8eetoj4ib4.apps.googleusercontent.com
```

**Verify existing vars:**
```env
FRONTEND_URL=https://d1byhkw9eqezvg.cloudfront.net
NODE_ENV=production
MONGODB_URI=your-atlas-connection-string
JWT_SECRET=your-secret
```

### 4. **Restart Server with New Env Vars**
```bash
pm2 restart all --update-env
# OR
pm2 delete all
pm2 start server.js --name ecommerce-api --update-env
pm2 save
```

### 5. **Verify Server is Running**
```bash
pm2 logs --lines 20
# Should see: "MongoDB connected successfully"
# Should see: "Server running in production mode"
```

---

## 🎨 FRONTEND DEPLOYMENT (CloudFront)

### 1. **Build Frontend with Production Env Vars**

**On your local machine:**
```bash
cd ~/Desktop/FancyERP/E-COOMERCE/frontend

# Create/update .env.production
echo "VITE_BACKEND_URL=https://your-backend-url.com" > .env.production
echo "VITE_GOOGLE_CLIENT_ID=504894052132-n8agsfim17ep0smk0dc4dm8eetoj4ib4.apps.googleusercontent.com" >> .env.production

# Build for production
npm run build

# The dist/ folder contains your production build
```

### 2. **Upload to CloudFront/S3**
- Upload `dist/` folder contents to your S3 bucket
- Invalidate CloudFront cache
- Or use your deployment method

---

## ✅ VERIFICATION CHECKLIST

### Backend Verification:
- [ ] `GOOGLE_CLIENT_ID` is in server `.env`
- [ ] `google-auth-library` is installed (`npm list google-auth-library`)
- [ ] Server restarted with `--update-env` flag
- [ ] Test endpoint: `curl https://your-backend.com/api/users/google-auth` (should return 400, not 404)
- [ ] Check logs: `pm2 logs --lines 50` (no errors)

### Frontend Verification:
- [ ] `VITE_GOOGLE_CLIENT_ID` is set in build
- [ ] `VITE_BACKEND_URL` points to correct backend
- [ ] Google Sign-In button appears on login page
- [ ] Button has glow effect and colored text

### Google Cloud Console:
- [x] Client ID created
- [x] Authorized origins include CloudFront URL
- [ ] Test Google Sign-In works

---

## 🚨 CRITICAL ISSUES TO FIX

### Issue 1: Server Code is Outdated
**Problem:** Server still has wishlist routes, missing Google OAuth  
**Fix:** Pull latest code from GitHub

### Issue 2: Missing Google Auth Library
**Problem:** Server doesn't have `google-auth-library` installed  
**Fix:** Run `npm install google-auth-library` on server

### Issue 3: Missing Environment Variable
**Problem:** `GOOGLE_CLIENT_ID` not set on server  
**Fix:** Add to `.env` and restart with `--update-env`

### Issue 4: Frontend Needs Rebuild
**Problem:** Frontend build doesn't have Google Sign-In  
**Fix:** Rebuild with `VITE_GOOGLE_CLIENT_ID` set

---

## 📝 QUICK DEPLOYMENT COMMANDS

### On AWS Server:
```bash
cd ~/Fancy-Enterprise
git pull origin main
cd backend
npm install google-auth-library
echo "GOOGLE_CLIENT_ID=504894052132-n8agsfim17ep0smk0dc4dm8eetoj4ib4.apps.googleusercontent.com" >> .env
pm2 restart all --update-env
pm2 logs --lines 30
```

### On Local (for Frontend):
```bash
cd frontend
echo "VITE_BACKEND_URL=https://your-backend-url" > .env.production
echo "VITE_GOOGLE_CLIENT_ID=504894052132-n8agsfim17ep0smk0dc4dm8eetoj4ib4.apps.googleusercontent.com" >> .env.production
npm run build
# Upload dist/ to CloudFront
```

---

## ✅ READY TO DEPLOY!

Once you:
1. Pull latest code to server ✅
2. Install google-auth-library ✅
3. Add GOOGLE_CLIENT_ID to server .env ✅
4. Rebuild frontend with env vars ✅
5. Upload frontend to CloudFront ✅

Then test Google Sign-In! 🚀
