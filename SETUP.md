# Local Server Setup Guide

This guide will help you set up and run the CARB PWA Customer Portal on your local machine.

## Prerequisites

You need ONE of the following:
- ✅ Python 3.x (recommended - usually pre-installed)
- ✅ Node.js (optional)
- ✅ Any static file server

## Setup Instructions

### Step 1: Clone/Navigate to Project
```bash
cd /path/to/pwa-customer-portal
```

### Step 2: Start Local Server

#### Option A: Python HTTP Server (Recommended)
```bash
# Using the provided script
./dev-server.sh

# OR manually
python3 -m http.server 8000
```

#### Option B: Node.js
```bash
npx http-server -p 8000
```

#### Option C: PHP
```bash
php -S localhost:8000
```

### Step 3: Open in Browser
Navigate to: **http://localhost:8000**

## Verifying PWA Setup

### Check Service Worker
1. Open browser DevTools (F12)
2. Go to **Application** tab
3. Click **Service Workers**
4. You should see: `sw.js` with status "activated"

### Check Manifest
1. In DevTools **Application** tab
2. Click **Manifest**
3. Verify:
   - Name: "NorCal CARB Portal"
   - Start URL: "/"
   - Icons: 192px, 512px, SVG

### Check Caching
1. In DevTools **Application** tab
2. Click **Storage > Cache Storage**
3. Expand "carb-portal-v2"
4. You should see cached resources:
   - `/` (index.html)
   - `/manifest.json`
   - Icons
   - Tesseract.js CDN

## Testing PWA Installation

### Desktop (Chrome/Edge)
1. Look for install icon in address bar (usually top-right)
2. Click to install
3. App opens in standalone window

### Mobile (Android Chrome)
1. Open http://YOUR_IP:8000 on mobile
2. Tap menu (⋮)
3. Select "Add to Home Screen"
4. App icon appears on home screen

### Mobile (iOS Safari)
1. Open http://YOUR_IP:8000
2. Tap Share button
3. Tap "Add to Home Screen"
4. Confirm

## Testing Offline Functionality

1. With app open in browser:
   - DevTools > Network tab
   - Check "Offline" checkbox
   - Reload page
   - App should still load from cache

2. With installed PWA:
   - Close all browser windows
   - Disconnect internet
   - Open installed PWA
   - App should work offline

## Mobile Testing on Local Network

### Find Your IP Address

**macOS/Linux:**
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```

**Windows:**
```cmd
ipconfig | findstr IPv4
```

### Access from Mobile
1. Ensure mobile device is on same WiFi network
2. On mobile browser, navigate to:
   ```
   http://YOUR_IP_ADDRESS:8000
   ```
3. Example: `http://192.168.1.100:8000`

### Enable HTTPS for Mobile Testing

Service Workers require HTTPS (except localhost). Use ngrok:

```bash
# Install ngrok (https://ngrok.com/)
ngrok http 8000

# Use the HTTPS URL provided (e.g., https://abc123.ngrok.io)
```

## Troubleshooting

### Port Already in Use
```bash
# Use a different port
python3 -m http.server 8001
```

### Service Worker Not Registering
- **Problem:** Browser console shows SW registration error
- **Fix:** Ensure you're accessing via `localhost` or `HTTPS`
- **Check:** Look for errors in Console tab

### Icons Not Loading
- **Problem:** Broken icon images
- **Fix:** Verify icon files exist in root directory:
  ```bash
  ls -la icon-*.png icon.svg
  ```

### Manifest 404 Error
- **Problem:** Browser can't find manifest.json
- **Fix:** Verify manifest.json is in root directory
- **Check:** Access directly: http://localhost:8000/manifest.json

### CORS Errors with Tesseract.js
- **Problem:** CDN blocked by firewall/network
- **Fix:** Try different network or download Tesseract.js locally

## Development Tips

### Auto-Reload Changes

For HTML/CSS changes:
- Just reload browser (Ctrl+R or Cmd+R)

For Service Worker changes:
1. DevTools > Application > Service Workers
2. Check "Update on reload"
3. Reload page
4. New SW activates automatically

### Clear Everything
```javascript
// Run in browser console to clear all caches
caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(reg => reg.unregister()));
```

### View Service Worker Logs
- DevTools > Console
- Filter by "Service Worker" or look for [SW] prefix

## Next Steps

Once local server is running:

1. ✅ Verify PWA installs correctly
2. ✅ Test all features (VIN upload, links)
3. ✅ Run Lighthouse audit (aim for 90+)
4. ✅ Test on real mobile device
5. ✅ Test offline functionality
6. 🚀 Deploy to Firebase Hosting (optional)

## Quick Reference Commands

```bash
# Start server
./dev-server.sh

# Check what's running on port 8000
lsof -i :8000          # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process on port 8000
kill -9 $(lsof -t -i:8000)    # macOS/Linux

# Find your IP
ifconfig | grep inet          # macOS/Linux
ipconfig                      # Windows
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify all files are in correct locations
3. Try different browser
4. Clear cache and try again
5. Check firewall/antivirus settings

---

**Happy Testing! 🚀**
