# Firebase Setup - NorCal CARB Mobile Customer Portal

## Overview

This document provides complete setup instructions for Firebase integration with the NorCal CARB Mobile Customer Portal. The setup includes Firestore, Cloud Functions, Authentication, Storage, and Analytics.

---

## Prerequisites

- Node.js 18+ installed
- Firebase CLI installed globally: `npm install -g firebase-tools`
- A Google account for Firebase Console access
- Git repository access

---

## Step 1: Create Firebase Project

### 1.1 Firebase Console Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click **"Add Project"**
3. Project name: `norcalcarb-mobile` (or your preferred name)
4. Enable Google Analytics: **Yes**
5. Analytics location: **United States**
6. Click **"Create Project"**

### 1.2 Register Web App

1. In Firebase Console, click the **Web icon** (</>)
2. App nickname: `NorCal CARB Portal`
3. ✅ Check **"Also set up Firebase Hosting"**
4. Click **"Register app"**
5. **Save the configuration** (you'll need it for Step 4)

### 1.3 Enable Firebase Services

In the Firebase Console, enable the following services:

1. **Firestore Database**
   - Go to Build → Firestore Database
   - Click "Create database"
   - Select "Start in production mode"
   - Choose location: `us-central1` (or closest to your users)

2. **Authentication**
   - Go to Build → Authentication
   - Click "Get started"
   - Enable "Email/Password" provider
   - Enable "Google" provider (optional)

3. **Storage**
   - Go to Build → Storage
   - Click "Get started"
   - Select "Start in production mode"

4. **Analytics**
   - Should be already enabled if selected during project creation

---

## Step 2: Local Setup

### 2.1 Install Dependencies

```bash
# Install project dependencies
npm install

# Install Firebase Functions dependencies
cd functions
npm install
cd ..
```

### 2.2 Firebase Login

```bash
# Login to Firebase
firebase login

# Initialize Firebase (select existing project)
firebase use --add
# Select your project: norcalcarb-mobile
# Give it an alias: default
```

### 2.3 Environment Variables

Create a `.env.local` file in the project root:

```bash
# Firebase Configuration (get these from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=norcalcarb-mobile.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=norcalcarb-mobile
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=norcalcarb-mobile.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
```

**Important:** Add `.env.local` to your `.gitignore` file!

---

## Step 3: Configure Cloud Functions

### 3.1 Set Function Configuration

```bash
# Set Cloudflare Worker secret for webhook authentication
firebase functions:config:set cloudflare.secret="YOUR_WEBHOOK_SECRET_HERE"

# Optional: Set email/SMS service credentials
firebase functions:config:set sendgrid.api_key="YOUR_SENDGRID_KEY"
firebase functions:config:set twilio.account_sid="YOUR_TWILIO_SID"
firebase functions:config:set twilio.auth_token="YOUR_TWILIO_TOKEN"

# View current configuration
firebase functions:config:get
```

### 3.2 Create .runtimeconfig.json for Emulator

For local development with emulators, create `functions/.runtimeconfig.json`:

```json
{
  "cloudflare": {
    "secret": "YOUR_WEBHOOK_SECRET_HERE"
  },
  "sendgrid": {
    "api_key": "YOUR_SENDGRID_KEY"
  },
  "twilio": {
    "account_sid": "YOUR_TWILIO_SID",
    "auth_token": "YOUR_TWILIO_TOKEN"
  }
}
```

**Important:** Add `functions/.runtimeconfig.json` to your `.gitignore`!

---

## Step 4: Deploy to Firebase

### 4.1 Deploy Everything

```bash
# Deploy all Firebase resources
firebase deploy
```

### 4.2 Deploy Specific Resources

```bash
# Deploy only Firestore rules and indexes
firebase deploy --only firestore

# Deploy only Cloud Functions
firebase deploy --only functions

# Deploy only Hosting
firebase deploy --only hosting

# Deploy only Storage rules
firebase deploy --only storage
```

### 4.3 Verify Deployment

After deployment, you should see:

1. **Firestore**: Rules and indexes deployed
2. **Functions**: 4 functions deployed
   - `receiveWebhook`
   - `onJobStatusChange`
   - `dailyRevenueReport`
   - `processLogEntry`
3. **Hosting**: Site deployed to `https://norcalcarb-mobile.web.app`
4. **Storage**: Rules deployed

---

## Step 5: Test the Setup

### 5.1 Run Local Emulators

```bash
# Start Firebase emulators
npm run firebase:emulators

# Or directly
firebase emulators:start
```

This will start:
- Firestore Emulator: http://localhost:8080
- Functions Emulator: http://localhost:5001
- Hosting Emulator: http://localhost:5000
- Storage Emulator: http://localhost:9199
- Auth Emulator: http://localhost:9099
- Emulator UI: http://localhost:4000

### 5.2 Test Webhook Function

```bash
# Test the receiveWebhook function
curl -X POST http://localhost:5001/norcalcarb-mobile/us-central1/receiveWebhook \
  -H "Authorization: Bearer YOUR_WEBHOOK_SECRET_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "source": "test",
    "data": {"test": true},
    "webhookId": "test-123"
  }'
```

Expected response:
```json
{"success": true, "webhookId": "test-123"}
```

### 5.3 Verify Firestore

1. Open Emulator UI: http://localhost:4000
2. Go to Firestore tab
3. Check if `webhooks/test-123` document exists

---

## Step 6: Cloudflare Worker Integration

### 6.1 Update Worker Environment Variables

In your Cloudflare Worker project (`wrangler.jsonc`):

```jsonc
{
  "vars": {
    "FIREBASE_FUNCTION_URL": "https://us-central1-norcalcarb-mobile.cloudfunctions.net/receiveWebhook",
    "FIREBASE_SECRET": "YOUR_WEBHOOK_SECRET_HERE"
  }
}
```

### 6.2 Worker Code Example

Add this to your Cloudflare Worker to forward webhooks to Firebase:

```typescript
async function forwardToFirebase(
  env: Env,
  source: string,
  data: any,
  webhookId: string
): Promise<boolean> {
  try {
    const response = await fetch(env.FIREBASE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${env.FIREBASE_SECRET}`,
      },
      body: JSON.stringify({
        source,
        data,
        webhookId,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Firebase forward error:', error);
    return false;
  }
}

// Example usage in webhook handler
app.post('/webhooks/paypal', async (c) => {
  const payload = await c.req.json();
  const logEntry = await logWebhook(c.env, 'paypal', payload);

  // Forward to Firebase
  await forwardToFirebase(c.env, 'paypal', payload, logEntry.id);

  return c.json({ success: true, webhookId: logEntry.id });
});
```

### 6.3 Deploy Worker

```bash
npx wrangler deploy
```

---

## Step 7: Monitoring & Logs

### 7.1 View Function Logs

```bash
# Real-time logs
firebase functions:log

# Filter by function
firebase functions:log --only receiveWebhook

# View last 100 lines
firebase functions:log --lines 100
```

### 7.2 Firebase Console Monitoring

1. Go to Firebase Console → Functions
2. View function invocations, errors, and performance
3. Set up alerts for failures

### 7.3 Firestore Usage

```bash
# Check Firestore usage
firebase firestore:usage
```

---

## Project Structure

```
norcalcarb-pwa-customer-portal/
├── app/                      # Next.js app directory
│   └── page.tsx             # Main dashboard page
├── lib/                     # Shared libraries
│   └── firebase.ts          # Firebase client initialization
├── types/                   # TypeScript type definitions
│   └── firestore.ts         # Firestore data models
├── src/ai/flows/           # Genkit AI flows
│   └── logEntryFlow.ts     # Log entry parsing flow
├── functions/              # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts        # Cloud Functions implementation
│   ├── package.json
│   ├── tsconfig.json
│   └── .eslintrc.js
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore indexes
├── storage.rules            # Storage security rules
├── package.json             # Project dependencies
└── FIREBASE_SETUP.md        # This file
```

---

## Data Models

See `types/firestore.ts` for complete TypeScript interfaces:

- **User**: Authenticated users (admin, technician, customer)
- **Customer**: Business customers with fleet information
- **Job**: Service jobs with scheduling, payment, and results
- **Webhook**: Incoming webhook events from external services
- **Lead**: Sales leads from various sources
- **Log**: System logs (for the existing log feature)
- **ServiceArea**: Geographic coverage areas
- **Analytics**: Business analytics and reporting data

---

## Security

### Firestore Rules

- ✅ Authentication required for most collections
- ✅ Role-based access control (admin, technician, customer)
- ✅ Owner-based permissions for user data
- ✅ Cloud Functions only for webhooks and analytics

### Storage Rules

- ✅ Authenticated access for certificates and reports
- ✅ Public read for company logos
- ✅ Owner-only access for user uploads

### Function Security

- ✅ Bearer token authentication for webhook endpoint
- ✅ Environment variables for secrets
- ✅ HTTPS only

---

## Costs (Free Tier Limits)

**Firebase Spark Plan (Free):**
- Firestore: 50K reads/day, 20K writes/day, 1GB storage
- Cloud Functions: 125K invocations/month, 40K GB-seconds
- Hosting: 10GB storage, 360MB/day transfer
- Authentication: Unlimited users
- Storage: 5GB, 1GB/day downloads

**Expected Usage for NorCal CARB:**
- ~500 webhooks/day = 15K/month ✅ FREE
- ~1000 Firestore reads/day = 30K/month ✅ FREE
- ~200 Firestore writes/day = 6K/month ✅ FREE
- ~1GB storage ✅ FREE

**Estimated Monthly Cost: $0**

---

## Troubleshooting

### Functions Not Deploying

```bash
# Check Node version (must be 18+)
node --version

# Rebuild functions
cd functions
npm install
npm run build
cd ..
firebase deploy --only functions
```

### Firestore Permission Denied

1. Check if user is authenticated
2. Verify Firestore rules are deployed: `firebase deploy --only firestore`
3. Check user role in `/users/{userId}` document

### Webhook Not Receiving Data

1. Verify `FIREBASE_SECRET` matches in both Worker and Functions
2. Check function logs: `firebase functions:log --only receiveWebhook`
3. Test with curl (see Step 5.2)

### Emulator Connection Issues

```bash
# Clear emulator data
firebase emulators:start --import=./emulator-data --export-on-exit

# Or start fresh
rm -rf .firebase
firebase emulators:start
```

---

## Next Steps

1. ✅ Complete Firebase setup (this guide)
2. ⏳ Set up user authentication in the app
3. ⏳ Build admin dashboard for job management
4. ⏳ Implement customer self-service features
5. ⏳ Set up push notifications (Firebase Cloud Messaging)
6. ⏳ Configure SendGrid/Twilio for email/SMS
7. ⏳ Deploy to production

---

## Support Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Queries Guide](https://firebase.google.com/docs/firestore/query-data)
- [Cloud Functions Guide](https://firebase.google.com/docs/functions)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)

---

## Quick Reference Commands

```bash
# Development
npm run dev                          # Start Next.js dev server
npm run firebase:emulators          # Start Firebase emulators

# Deployment
firebase deploy                      # Deploy everything
firebase deploy --only functions    # Deploy only functions
firebase deploy --only firestore    # Deploy only Firestore
firebase deploy --only hosting      # Deploy only hosting

# Monitoring
firebase functions:log              # View function logs
firebase firestore:usage           # Check Firestore usage

# Configuration
firebase functions:config:set key=value  # Set config
firebase functions:config:get            # View config
```

---

*Last Updated: November 2024*
*Created for NorCal CARB Mobile Customer Portal*
