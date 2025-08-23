# RENDER DEPLOYMENT - DEPENDENCY FIX

## 🔧 **IMMEDIATE SOLUTION:**

### **Update Build Command in Render Dashboard:**

```bash
npm install --production=false && cd client && rm -rf node_modules package-lock.json && npm install ajv@^6.12.6 ajv-keywords@^3.5.2 --legacy-peer-deps && npm install --legacy-peer-deps && npm run build
```

### **Alternative Build Command (if above fails):**

```bash
npm install --production=false && cd client && rm -rf node_modules package-lock.json && npm install --legacy-peer-deps --force && npm install ajv@6.12.6 --force && npm run build
```

### **Simple Build Command (last resort):**

```bash
npm install && cd client && npm install --legacy-peer-deps --force && SKIP_PREFLIGHT_CHECK=true npm run build
```

## 🎯 **Root Cause:**
- The `ajv` package version incompatibility with `ajv-keywords`
- Node.js 22.16.0 has stricter module resolution
- `react-scripts 5.0.1` dependencies conflict

## ✅ **Solution Applied:**
1. **Fixed package.json** with `resolutions` and `overrides` for `ajv` versions
2. **Updated .npmrc** with compatibility flags
3. **Created build script** that handles dependency conflicts
4. **Downgraded `ajv`** to compatible version (6.12.6)

## 🚀 **Deployment Steps:**

1. **Commit these changes:**
   ```bash
   git add .
   git commit -m "Fix ajv dependency conflict for Render deployment"
   git push origin main
   ```

2. **Update Build Command in Render Dashboard** (use first option above)

3. **Set Environment Variables:**
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://ganesh:Prodiny123@cluster0.ucqxdv1.mongodb.net/prodiny?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=your_super_secure_jwt_secret_key_at_least_32_characters_long_change_this_for_production
   JWT_EXPIRE=7d
   CLIENT_URL=https://www.prodiny.com
   ```

4. **Trigger Redeploy**

## 📝 **What Changed:**
- ✅ `ajv` downgraded to v6.12.6 (compatible version)
- ✅ `ajv-keywords` downgraded to v3.5.2 
- ✅ Added `resolutions` and `overrides` in package.json
- ✅ Enhanced .npmrc with compatibility flags
- ✅ Created robust build script

This should resolve the `Cannot find module 'ajv/dist/compile/codegen'` error! 🎉
