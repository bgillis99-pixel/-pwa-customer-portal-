# NorCal CARB Customer Portal (PWA)

Progressive Web App for California Air Resources Board (CARB) compliance and mobile heavy-duty vehicle testing.

## 🚀 Quick Start - Local Development

### Method 1: Using the dev server script
```bash
./dev-server.sh
```

### Method 2: Using Python directly
```bash
python3 -m http.server 8000
```

### Method 3: Using Node.js http-server (if installed)
```bash
npx http-server -p 8000
```

Then open your browser to:
- **Local:** http://localhost:8000
- **Mobile Testing:** http://YOUR_LOCAL_IP:8000

## 📱 PWA Features

This application is a fully-functional Progressive Web App with:

✅ **Offline Support** - Service worker caches resources for offline use
✅ **Installable** - Can be installed on mobile devices and desktops
✅ **Fast Loading** - Cached resources load instantly
✅ **Mobile-First** - Optimized for mobile devices
✅ **Auto-Update** - Service worker checks for updates every minute

## 🔧 Testing PWA Functionality

### 1. Chrome DevTools Testing
1. Open http://localhost:8000 in Chrome or Edge
2. Press F12 to open DevTools
3. Navigate to **Application** tab
4. Check these sections:
   - **Manifest** - Verify PWA configuration
   - **Service Workers** - Ensure SW is registered and active
   - **Storage > Cache Storage** - See cached resources
   - **Storage > IndexedDB** - (Future: Firebase data)

### 2. Lighthouse PWA Audit
1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Select **Progressive Web App** category
4. Click **Generate report**
5. Aim for 90+ PWA score

### 3. Install PWA
- **Desktop Chrome/Edge:** Look for install icon in address bar
- **Mobile Chrome:** Tap menu → "Add to Home Screen"
- **iOS Safari:** Tap Share → "Add to Home Screen"

## 📂 Project Structure

```
.
├── index.html              # Main PWA entry point
├── manifest.json           # PWA manifest (metadata, icons)
├── sw.js                   # Service worker (caching, offline)
├── icon-192.png            # PWA icon (192x192)
├── icon-512.png            # PWA icon (512x512)
├── icon.svg                # Scalable vector icon
├── dev-server.sh           # Local development server script
│
├── app/
│   └── page.tsx            # Next.js app (future dashboard)
├── lib/
│   └── firebase.ts         # Firebase configuration
├── src/
│   └── ai/
│       └── flows/
│           └── logEntryFlow.ts  # Genkit AI log parsing flow
│
├── firebase.json           # Firebase hosting config
├── .env.example            # Environment variables template
└── .gitignore              # Git ignore patterns
```

## 🎯 Features

### Current Features (HTML/JS PWA)
- **VIN Photo Upload** - OCR extraction using Tesseract.js
- **Find a Tester** - ZIP code-based lead generation
- **Quick Links** - Vehicle status and profile checks
- **Mobile-Optimized** - Touch-friendly interface
- **Offline Capable** - Works without internet connection

### Future Features (Next.js + Firebase)
- **Log Entry Dashboard** - Track trips, fuel, maintenance
- **AI-Powered Parsing** - Natural language log entry via Genkit
- **Real-time Sync** - Firebase Firestore integration
- **Chat Assistant** - CARB regulation Q&A bot
- **Voice Input** - Hands-free log entry

## 🐛 Troubleshooting

See [SETUP.md](./SETUP.md) for detailed setup instructions and troubleshooting.

## 📧 Support

- Email: support@norcalcarbmobile.com
- Phone: (916) 890-4427

---

**Built with ❤️ for California's Clean Air Initiative**
