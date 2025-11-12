# NorCal CARB Mobile - Customer Portal PWA

A Progressive Web App (PWA) for NorCal CARB Mobile that provides real-time job tracking, customer self-service, and seamless integration with Firebase and Cloudflare Workers.

## 🚀 Features

- **Real-time Job Tracking** - Customers can track their CARB compliance jobs in real-time
- **Log Entry System** - AI-powered log parsing using Google Genkit
- **Chat Interface** - Ask CARB Bot for compliance information
- **Webhook Integration** - Seamless integration with Cloudflare Workers
- **Firebase Backend** - Firestore, Cloud Functions, Authentication, and Storage
- **Progressive Web App** - Installable on mobile devices with offline support
- **TypeScript** - Full type safety across the stack
- **Next.js** - Modern React framework with server-side rendering

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase CLI: `npm install -g firebase-tools`
- A Google account for Firebase Console
- (Optional) Cloudflare Workers account for webhook integration

## 🛠️ Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd pwa-customer-portal
npm install
```

### 2. Firebase Setup

Follow the comprehensive setup guide in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)

Quick version:
```bash
# Login to Firebase
firebase login

# Select your Firebase project
firebase use --add

# Copy environment template
cp .env.local.example .env.local
# Edit .env.local with your Firebase config

# Install Functions dependencies
cd functions
npm install
cd ..
```

### 3. Run Development Server

```bash
# Start Firebase emulators
npm run firebase:emulators

# In a new terminal, start Next.js dev server
npm run dev
```

Visit http://localhost:3000

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   └── page.tsx             # Main dashboard with Log and Chat features
├── lib/                     # Shared libraries
│   └── firebase.ts          # Firebase client initialization
├── types/                   # TypeScript type definitions
│   └── firestore.ts         # Firestore data models
├── src/ai/flows/           # Google Genkit AI flows
│   └── logEntryFlow.ts     # Log entry parsing flow
├── functions/              # Firebase Cloud Functions
│   ├── src/
│   │   └── index.ts        # Webhook processing, job triggers, analytics
│   └── package.json
├── firebase.json            # Firebase configuration
├── firestore.rules          # Firestore security rules
├── firestore.indexes.json   # Firestore composite indexes
├── storage.rules            # Storage security rules
└── FIREBASE_SETUP.md        # Comprehensive setup guide
```

## 🔧 Configuration

### Environment Variables

Create `.env.local` with your Firebase configuration:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=...
```

See `.env.local.example` for a template.

### Firebase Functions Configuration

```bash
# Set Cloudflare webhook secret
firebase functions:config:set cloudflare.secret="YOUR_SECRET"

# Optional: Email/SMS services
firebase functions:config:set sendgrid.api_key="YOUR_KEY"
firebase functions:config:set twilio.account_sid="YOUR_SID"
firebase functions:config:set twilio.auth_token="YOUR_TOKEN"
```

## 🚢 Deployment

### Deploy Everything

```bash
firebase deploy
```

### Deploy Specific Resources

```bash
# Deploy only Cloud Functions
firebase deploy --only functions

# Deploy only Firestore (rules + indexes)
firebase deploy --only firestore

# Deploy only Hosting
firebase deploy --only hosting

# Deploy only Storage rules
firebase deploy --only storage
```

## 📊 Firebase Collections

- **users** - Authenticated users (admin, technician, customer)
- **customers** - Business customers with fleet information
- **jobs** - Service jobs with scheduling, payment, and results
- **webhooks** - Incoming webhook events (PayPal, SMS, Calendar, Ads)
- **leads** - Sales leads from various sources
- **logs** - System logs for the log entry feature
- **service_areas** - Geographic coverage areas
- **analytics** - Business analytics and reporting data

See `types/firestore.ts` for complete TypeScript interfaces.

## 🔐 Security

- Firestore security rules enforce authentication and role-based access
- Storage rules protect certificates and reports
- Cloud Functions use bearer token authentication for webhooks
- Environment variables for all secrets (never committed)

## 🧪 Testing

### Local Emulators

```bash
# Start all emulators
firebase emulators:start

# Access Emulator UI
open http://localhost:4000
```

### Test Webhook Function

```bash
curl -X POST http://localhost:5001/norcalcarb-mobile/us-central1/receiveWebhook \
  -H "Authorization: Bearer YOUR_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"source":"test","data":{"test":true},"webhookId":"test-123"}'
```

## 📝 Available Scripts

```bash
# Development
npm run dev                      # Start Next.js dev server
npm run firebase:emulators      # Start Firebase emulators

# Build
npm run build                   # Build for production
npm run start                   # Start production server

# Deployment
npm run firebase:deploy         # Deploy everything
npm run firebase:deploy:functions   # Deploy only functions
npm run firebase:deploy:firestore   # Deploy only Firestore
npm run firebase:deploy:hosting     # Deploy only hosting

# Monitoring
npm run firebase:logs           # View function logs
```

## 🔍 Monitoring & Logs

```bash
# Real-time function logs
firebase functions:log

# Filter by function
firebase functions:log --only receiveWebhook

# Check Firestore usage
firebase firestore:usage
```

## 💰 Cost Estimate

**Firebase Free Tier (Spark Plan):**
- Firestore: 50K reads/day, 20K writes/day
- Cloud Functions: 125K invocations/month
- Authentication: Unlimited
- Storage: 5GB
- Hosting: 10GB storage, 360MB/day transfer

**Expected usage for NorCal CARB: ~$0/month** (within free tier limits)

## 🔗 Integration with Cloudflare Workers

This project is designed to work with Cloudflare Workers for webhook processing:

1. Webhooks arrive at Cloudflare Worker (edge network)
2. Worker logs to KV/D1 for redundancy
3. Worker forwards to Firebase Cloud Function
4. Cloud Function processes and stores in Firestore
5. Real-time updates sync to all connected clients

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) Step 6 for Cloudflare integration details.

## 📚 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Firebase (Firestore, Functions, Auth, Storage)
- **AI**: Google Genkit with Gemini 1.5 Flash
- **Styling**: Tailwind CSS
- **Edge**: Cloudflare Workers (webhook ingestion)
- **Analytics**: Firebase Analytics

## 🆘 Troubleshooting

See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed troubleshooting steps.

Common issues:
- **Functions not deploying**: Check Node version (18+), rebuild with `cd functions && npm run build`
- **Permission denied**: Verify Firestore rules are deployed
- **Webhook not working**: Check `FIREBASE_SECRET` matches in Worker and Functions

## 📖 Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) - Complete setup instructions
- [Firestore Data Models](./types/firestore.ts) - TypeScript interfaces
- [Cloud Functions](./functions/src/index.ts) - Webhook processing logic

## 📄 License

See [LICENSE](./LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

**Built for NorCal CARB Mobile** - Compliance Made Simple
