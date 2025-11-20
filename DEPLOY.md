# Deployment Guide

## Quick Deploy to Firebase Hosting

The app is ready to deploy! Follow these steps:

### 1. Login to Firebase
```bash
firebase login
```
This will open a browser window to authenticate with your Google account (bgillis99@gmail.com).

### 2. Deploy Hosting Only
```bash
firebase deploy --only hosting
```

Or use the npm script:
```bash
npm run firebase:deploy:hosting
```

### 3. Your Site Will Be Live At:
```
https://norcalcarb-mobile.web.app
```
or
```
https://norcalcarb-mobile.firebaseapp.com
```

## What's Deployed

- ✅ Homepage (index.html) with updated buttons and branding
- ✅ VIN DIESEL compliance checker at `/vin-diesel`
- ✅ FAQ page at `/faq`
- ✅ PWA manifest with app icons
- ✅ Service worker for offline support
- ✅ Apple touch icons
- ✅ Proper caching headers

## Deployment Files Updated

- `firebase.json` - Now points to root directory as public folder
- `.firebaserc` - Set to `norcalcarb-mobile` project
- `components/ui/card.tsx` - Fixed to support interactive components
- Next.js app built successfully

## Alternative: GitHub Actions Auto-Deploy

Want automatic deployments on every push? Add this to `.github/workflows/firebase-deploy.yml`:

```yaml
name: Deploy to Firebase Hosting
on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          projectId: norcalcarb-mobile
```

## Firebase Project Info

- **Project ID**: norcalcarb-mobile
- **Account**: bgillis99@gmail.com
- **Hosting URL**: https://norcalcarb-mobile.web.app

## Features Now Working

1. **Home Screen Install** - Users can add to home screen with proper icons
2. **Modern UI** - Updated buttons and styling throughout
3. **PWA Icons** - Proper favicon and app icons (192x192, 512x512, apple-touch-icon)
4. **VIN DIESEL** - Full compliance checking flow
5. **FAQ** - Knowledge base with CARB information
6. **Offline Support** - Service worker caches assets

## Testing Locally

Before deploying, test locally:
```bash
firebase serve
```

Visit http://localhost:5000

## Need Help?

If deployment fails, check:
1. Firebase CLI is installed: `npm install -g firebase-tools`
2. Logged in: `firebase login:list`
3. Correct project: `firebase use norcalcarb-mobile`
4. Build succeeded: `npm run build`

---

**Ready to deploy!** Just run `firebase deploy --only hosting`
