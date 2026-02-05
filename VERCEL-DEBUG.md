# Vercel Proxy Debug Guide

## Problem
Vercel serverless functions can't reach VPS backend on port 6000.

## Possible Causes

### 1. Environment Variable Missing
Check if `BACKEND_URL` is set in Vercel:
```
BACKEND_URL=http://46.62.209.17:6000
```

### 2. Vercel Network Restrictions
Vercel serverless functions might have egress restrictions to non-standard ports.

### 3. Firewall/Network Issue
Even though port 6000 is open on VPS, Vercel's IP range might be blocked.

## Solutions

### Option A: Use Standard Port (Recommended)
Move backend to port 80 or 443:
```bash
# On VPS
sudo ufw allow 80/tcp
cd /home/deploy/kinetikui-automation/backend
echo "PORT=80" >> .env
pm2 restart kinetikui-backend
```

Then update Vercel env:
```
BACKEND_URL=http://46.62.209.17
```

### Option B: Use Domain with Reverse Proxy
Set up nginx on VPS:
```nginx
server {
  listen 80;
  server_name api.kinetikui.com;
  location / {
    proxy_pass http://localhost:6000;
  }
}
```

Then update Vercel env:
```
BACKEND_URL=https://api.kinetikui.com
```

### Option C: Direct Client-Side Calls (Quick Fix)
Remove proxy entirely and call backend directly from browser:

**dashboard/app/marketing/page.tsx:**
```typescript
const BACKEND_URL = 'http://46.62.209.17:6000/api';

const generateScript = async () => {
  const res = await axios.post(`${BACKEND_URL}/marketing/script/generate`, {...});
};
```

⚠️ **Note:** This requires CORS to be properly configured on backend.

## Current Status
- Backend: ✅ Running on port 6000
- Firewall: ✅ Port 6000 open
- Proxy: ❌ Vercel can't connect

## Testing
Check if Vercel can reach backend:
```bash
curl https://kinetikui-automation.vercel.app/api/proxy/marketing/script/templates
```

Direct backend test (should work):
```bash
curl http://46.62.209.17:6000/api/marketing/script/templates
```
