# 🚀 CARB Compliance Portal - Deployment Guide

## Quick Deployment to Firebase Hosting

Your complete CARB compliance PWA is ready to deploy! Follow these steps:

### Prerequisites

1. **Firebase CLI installed** (you already have this)
2. **Firebase project created** (appears to be `carb-help-app-251117-bg` based on your terminal history)
3. **Authenticated with Firebase** (you need to complete this)

---

## Step 1: Authenticate with Firebase

Run this command and follow the prompts:

```bash
firebase login
```

**OR** if browser login isn't working, use the device code method:

```bash
firebase logout
firebase login --no-localhost
```

This will give you a URL to visit and a code to enter. Complete the authentication in your browser.

---

## Step 2: Set Your Firebase Project

```bash
firebase use carb-help-app-251117-bg
```

**OR** if you want to create a new project:

```bash
firebase projects:create your-new-project-id
firebase use your-new-project-id
```

---

## Step 3: Deploy to Firebase Hosting

```bash
firebase deploy --only hosting
```

That's it! Your app will be live at:
- `https://carb-help-app-251117-bg.web.app`
- `https://carb-help-app-251117-bg.firebaseapp.com`

---

## Alternative: Deploy Everything (All Firebase Services)

If you want to deploy Firestore, Functions, and Storage too:

```bash
firebase deploy
```

---

## Troubleshooting

### Problem: "Failed to authenticate"

**Solution:**
```bash
# Clear cached credentials
rm -f ~/.config/configstore/firebase-tools.json

# Re-authenticate
firebase login --no-localhost --reauth
```

### Problem: "No project active"

**Solution:**
```bash
# List available projects
firebase projects:list

# Select your project
firebase use <project-id>
```

### Problem: "Permission denied"

**Solution:**
Make sure you're logged in with the correct Google account that has access to the Firebase project.

```bash
firebase login:list  # Check which accounts are logged in
firebase login:use <email>  # Switch to correct account
```

---

## What's Deployed

Your CARB Compliance Portal includes:

✅ **Complete PWA** - Installable on mobile and desktop
✅ **Quote Request Form** - Customers can request quotes
✅ **Job Tracking** - Track service status
✅ **VIN Lookup** - Check CARB compliance status
✅ **Resource Links** - Direct links to official CARB websites
✅ **Mobile Optimized** - Fully responsive design
✅ **Offline Support** - Works offline with service worker
✅ **Fast Loading** - Optimized performance

---

## File Structure

```
build/web/
├── index.html       # Main app (complete CARB portal)
├── manifest.json    # PWA manifest
├── sw.js           # Service worker for offline support
├── icon-192.png    # App icon (192x192)
├── icon-512.png    # App icon (512x512)
└── 404.html        # 404 redirect page
```

---

## Custom Domain (Optional)

To use a custom domain like `carbcompliance.com`:

1. Go to Firebase Console: https://console.firebase.google.com
2. Select your project
3. Go to Hosting
4. Click "Add custom domain"
5. Follow the instructions to verify your domain

---

## Next Steps After Deployment

1. **Test the live site** - Visit your Firebase Hosting URL
2. **Install as PWA** - On mobile, tap "Add to Home Screen"
3. **Share the link** - Give the URL to customers
4. **Monitor analytics** - Check Firebase Console for visitor stats
5. **Update content** - Edit `build/web/index.html` and redeploy

---

## Updating the App

To make changes:

1. Edit files in `build/web/`
2. Run `firebase deploy --only hosting`
3. Changes are live in ~30 seconds

---

## Support

If you encounter issues:

1. Check Firebase Console logs
2. Run `firebase --help` for command help
3. Visit Firebase docs: https://firebase.google.com/docs/hosting

---

**Your app is ready to go live!** 🎉

Just run: `firebase login` → `firebase use <project-id>` → `firebase deploy --only hosting`
