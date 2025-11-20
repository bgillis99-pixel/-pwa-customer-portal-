# Deployment Guide

Complete guide for deploying the NorCal CARB Mobile Customer Portal to Firebase.

---

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [GitHub Actions Setup](#github-actions-setup)
- [Automated Deployments](#automated-deployments)
- [Manual Deployments](#manual-deployments)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

---

## Overview

This project uses **Firebase** for hosting and backend services, with **GitHub Actions** for automated CI/CD pipelines.

### Services Deployed

- **Firebase Hosting** - Next.js PWA (Static Site Generation)
- **Cloud Functions** - 4 serverless functions (webhooks, reports, log processing)
- **Firestore** - Database rules and indexes
- **Storage** - File storage rules

---

## Prerequisites

Before deploying, ensure you have:

1. ✅ Firebase project created (`norcalcarb-mobile`)
2. ✅ Firebase CLI installed locally (`npm install -g firebase-tools`)
3. ✅ GitHub repository secrets configured
4. ✅ Firebase service account with deployment permissions

---

## GitHub Actions Setup

### Required GitHub Secrets

Configure these secrets in your GitHub repository settings (`Settings > Secrets and variables > Actions`):

#### Firebase Credentials

```
FIREBASE_SERVICE_ACCOUNT
```
- **Description:** Firebase service account JSON (entire file content)
- **How to get:**
  1. Go to [Firebase Console](https://console.firebase.google.com)
  2. Select your project (`norcalcarb-mobile`)
  3. Go to **Project Settings** > **Service Accounts**
  4. Click **Generate new private key**
  5. Copy entire JSON file content into this secret

#### Next.js Environment Variables

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
```

- **How to get:**
  1. Go to [Firebase Console](https://console.firebase.google.com)
  2. Select your project
  3. Go to **Project Settings** > **General**
  4. Scroll to **Your apps** > **SDK setup and configuration**
  5. Copy each value into the corresponding GitHub secret

---

## Automated Deployments

### Production Deployment (Automatic)

**Triggers:**
- Push to `main` or `master` branch
- Manual trigger via GitHub Actions UI

**What gets deployed:**
- ✅ Next.js app to Firebase Hosting
- ✅ Cloud Functions
- ✅ Firestore rules and indexes
- ✅ Storage rules

**Workflow file:** `.github/workflows/deploy-production.yml`

**Process:**
1. Push to main/master branch
2. GitHub Actions automatically:
   - Installs dependencies
   - Builds Next.js app
   - Builds Cloud Functions
   - Deploys everything to Firebase
3. Deployment completes in ~5-10 minutes

### Preview Deployments (Pull Requests)

**Triggers:**
- Any pull request to `main` or `master`

**What happens:**
- ✅ Builds and validates code
- ✅ Deploys preview to temporary Firebase Hosting channel
- ✅ Posts preview URL as PR comment
- ⏰ Preview expires in 7 days

**Workflow file:** `.github/workflows/deploy-preview.yml`

**Preview URL format:**
```
https://norcalcarb-mobile--pr-{PR_NUMBER}-preview.web.app
```

### CI Checks (All Branches)

**Triggers:**
- Push to any branch
- Pull requests to main/master

**What it checks:**
- ✅ Linting (Next.js and Functions)
- ✅ Type checking (TypeScript)
- ✅ Build smoke test
- ✅ Configuration file validation

**Workflow file:** `.github/workflows/ci-checks.yml`

---

## Manual Deployments

### Via GitHub Actions UI

1. Go to **Actions** tab in GitHub
2. Select **"Manual Deployment"** workflow
3. Click **"Run workflow"**
4. Choose options:
   - **Environment:** production/staging/development
   - **Deploy Hosting:** ✅/❌
   - **Deploy Functions:** ✅/❌
   - **Deploy Firestore:** ✅/❌
   - **Deploy Storage:** ✅/❌
5. Click **"Run workflow"**

**Workflow file:** `.github/workflows/manual-deploy.yml`

### Via Local CLI

#### Prerequisites
```bash
# Login to Firebase
firebase login

# Select project
firebase use norcalcarb-mobile
```

#### Deploy Everything
```bash
npm run firebase:deploy
```

#### Deploy Specific Components
```bash
# Deploy only hosting
npm run firebase:deploy:hosting

# Deploy only functions
npm run firebase:deploy:functions

# Deploy only Firestore rules
npm run firebase:deploy:firestore

# Deploy only Storage rules
npm run firebase:deploy:storage
```

#### Deploy with Firebase CLI directly
```bash
# Deploy all
firebase deploy --project norcalcarb-mobile

# Deploy specific services
firebase deploy --only hosting --project norcalcarb-mobile
firebase deploy --only functions --project norcalcarb-mobile
firebase deploy --only firestore --project norcalcarb-mobile
firebase deploy --only storage --project norcalcarb-mobile

# Deploy specific function
firebase deploy --only functions:receiveWebhook --project norcalcarb-mobile
```

---

## Environment Configuration

### Local Development

1. **Create `.env.local` file:**
```bash
cp .env.local.example .env.local
```

2. **Fill in Firebase credentials:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=norcalcarb-mobile.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=norcalcarb-mobile
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=norcalcarb-mobile.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
```

3. **Start local emulators:**
```bash
npm run firebase:emulators
```

4. **Start Next.js dev server:**
```bash
npm run dev
```

### Production Configuration

**Hosting URL:** `https://norcalcarb-mobile.web.app`

**Functions URLs:**
```
https://us-central1-norcalcarb-mobile.cloudfunctions.net/receiveWebhook
https://us-central1-norcalcarb-mobile.cloudfunctions.net/processLogEntry
```

**Cloud Functions Configuration:**

Set secrets via Firebase CLI:
```bash
firebase functions:config:set cloudflare.secret="your-secret"
firebase functions:config:set sendgrid.api_key="your-api-key"
firebase functions:config:set twilio.account_sid="your-sid"
firebase functions:config:set twilio.auth_token="your-token"
```

View configuration:
```bash
firebase functions:config:get
```

---

## Troubleshooting

### Build Failures

**Issue:** Next.js build fails with Firebase errors
**Solution:**
- Ensure all `NEXT_PUBLIC_FIREBASE_*` secrets are set in GitHub
- Check that values match Firebase Console

**Issue:** Cloud Functions build fails with TypeScript errors
**Solution:**
```bash
cd functions
npm run lint
npm run build
```

### Deployment Failures

**Issue:** Firebase deployment fails with authentication error
**Solution:**
- Verify `FIREBASE_SERVICE_ACCOUNT` secret is set correctly
- Ensure service account has required permissions:
  - Firebase Hosting Admin
  - Cloud Functions Developer
  - Datastore User

**Issue:** Functions deployment fails
**Solution:**
```bash
# Check functions logs
firebase functions:log --project norcalcarb-mobile

# Deploy with debug
firebase deploy --only functions --debug --project norcalcarb-mobile
```

### Preview Deployment Issues

**Issue:** Preview URL returns 404
**Solution:**
- Wait 2-3 minutes after deployment completes
- Check GitHub Actions logs for errors
- Verify Firebase Hosting is enabled in Firebase Console

### CI Check Failures

**Issue:** Linting fails
**Solution:**
```bash
npm run lint
cd functions && npm run lint
```

**Issue:** Type checking fails
**Solution:**
```bash
npm run type-check
```

**Issue:** Build smoke test fails
**Solution:**
```bash
# Clean and rebuild
rm -rf .next build
npm run build
```

---

## Deployment Checklist

Before deploying to production:

- [ ] All CI checks passing
- [ ] Functions tested in emulator
- [ ] Environment variables configured
- [ ] Firebase rules tested
- [ ] Cloudflare Worker webhook integration tested
- [ ] Preview deployment tested in PR
- [ ] Database backups verified
- [ ] Monitoring and alerts configured
- [ ] Rollback plan documented

---

## Rollback Procedure

If a deployment causes issues:

### Via Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select **Hosting** > **Dashboard**
3. Find previous deployment
4. Click **"..."** > **"Rollback"**

### Via CLI

```bash
# List previous hosting releases
firebase hosting:channel:list --project norcalcarb-mobile

# Rollback to previous version (if tagged)
git checkout <previous-commit>
firebase deploy --only hosting --project norcalcarb-mobile
```

---

## Monitoring and Logs

### View Deployment History

**GitHub Actions:**
- Go to **Actions** tab in GitHub repository

**Firebase Console:**
- Hosting: **Hosting** > **Dashboard** > **Release history**
- Functions: **Functions** > **Dashboard** > **Deployment history**

### View Runtime Logs

```bash
# Real-time function logs
npm run firebase:logs

# Filter by function
firebase functions:log --only receiveWebhook

# Functions usage and metrics
firebase functions:list --project norcalcarb-mobile
```

### Firebase Console Monitoring

- **Functions:** Performance, errors, invocations
- **Hosting:** Traffic, bandwidth, requests
- **Firestore:** Read/write operations, storage
- **Analytics:** User activity, engagement

---

## Cost Management

**Expected costs on Firebase Free Tier:** $0/month

**Resource limits (free tier):**
- **Hosting:** 10 GB storage, 360 MB/day bandwidth
- **Functions:** 2M invocations/month, 400K GB-seconds/month
- **Firestore:** 50K reads/day, 20K writes/day, 1 GB storage
- **Storage:** 5 GB storage, 1 GB/day downloads

**Monitoring costs:**
```bash
# Check Firebase usage
firebase projects:list
firebase firestore:usage --project norcalcarb-mobile
```

---

## Support and Resources

- **Firebase Documentation:** https://firebase.google.com/docs
- **Next.js Documentation:** https://nextjs.org/docs
- **GitHub Actions Documentation:** https://docs.github.com/en/actions
- **Project README:** `README.md`
- **Firebase Setup Guide:** `FIREBASE_SETUP.md`

---

## Summary

✅ **Automated CI/CD** - Push to main = instant deployment
✅ **Preview Deployments** - Every PR gets a preview URL
✅ **CI Checks** - Automated linting, type checking, builds
✅ **Manual Control** - Deploy specific components when needed
✅ **Comprehensive Monitoring** - Logs, metrics, alerts
✅ **Cost Efficient** - Runs on Firebase free tier

**Happy Deploying! 🚀**
