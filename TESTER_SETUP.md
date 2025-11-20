# 🚛 VIN DIESEL - Tester Dashboard Setup

## What's New
The tester side of VIN DIESEL is now live! Features include:
- 📸 **Photo Upload** → Auto-extract VIN + Plate + GPS
- 📅 **One-tap Schedule** → SMS to customer via Twilio
- 📊 **Today's Dashboard** → Real-time job tracking
- 🔐 **Secure Login** → Firebase Authentication

## Live URLs
- **Customer Page**: https://carb-compliance-app-3537-a1e48.web.app
- **Tester Dashboard**: https://carb-compliance-app-3537-a1e48.web.app/tester.html

---

## 🚀 Deployment Steps

### 1. Build Cloud Functions
```bash
cd functions
npm install
npm run build
cd ..
```

### 2. Deploy Everything to Firebase
```bash
# Deploy all (Functions, Firestore, Storage, Hosting)
firebase deploy

# OR deploy individually:
firebase deploy --only hosting
firebase deploy --only functions
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

### 3. Configure Twilio (for SMS)
```bash
# Set Twilio credentials
firebase functions:config:set \
  twilio.account_sid="YOUR_TWILIO_ACCOUNT_SID" \
  twilio.auth_token="YOUR_TWILIO_AUTH_TOKEN" \
  twilio.phone_number="+19165551234"

# Redeploy functions after config change
firebase deploy --only functions
```

### 4. Create Tester Accounts
Use Firebase Console or CLI to create tester accounts:

**Option A: Firebase Console**
1. Go to Firebase Console → Authentication
2. Add User → Email/Password
3. Email: `bryan@norcalcarbmobile.com`
4. Password: (set secure password)

**Option B: Firebase CLI**
```bash
# Create user via Firebase Auth
firebase auth:import users.json --hash-algo=SCRYPT
```

---

## 📱 How Testers Use It

### Login
1. Open: https://carb-compliance-app-3537-a1e48.web.app/tester.html
2. Enter email & password
3. Access tester dashboard

### Schedule a Test
1. **Tap "Take Photo"** → Capture truck photo (VIN visible)
2. **Auto-extract** → VIN, plate, GPS location extracted
3. **Enter owner phone** → Customer's mobile number
4. **Tap "Schedule Test"** → SMS sent, test created
5. **View dashboard** → See today's scheduled tests

### Today's Dashboard
- Real-time list of scheduled tests
- Shows: VIN, plate, owner phone, location, status
- Auto-refreshes every 30 seconds

---

## 🔐 Security Rules

### Firestore
- **tests collection**: Authenticated users can create/read their own tests
- **users, jobs, customers**: Admin/role-based access

### Storage
- **truck-photos**: Authenticated users can upload to their own folder
- **certificates, reports**: Admin only

---

## 🧪 Testing Locally

### Start Emulators
```bash
firebase emulators:start
```

### Access
- **Emulator UI**: http://localhost:4000
- **Hosting**: http://localhost:5000
- **Tester Dashboard**: http://localhost:5000/tester.html

### Test Photo Upload
1. Login to tester dashboard
2. Upload a test image with VIN visible
3. Check Firestore emulator for new test document
4. Check Storage emulator for uploaded photo

---

## 📊 Firestore Collections

### `tests` Collection
```typescript
{
  testId: string,
  testerId: string,        // Firebase Auth UID
  testerEmail: string,     // bryan@norcalcarbmobile.com
  vin: string,             // Auto-extracted 17-char VIN
  plate: string,           // License plate
  location: string,        // GPS coordinates "lat, lon"
  photoUrl: string,        // Firebase Storage URL
  ownerPhone: string,      // Customer phone number
  status: "scheduled" | "in-progress" | "completed",
  scheduledDate: Timestamp,
  createdAt: Timestamp,
  smsSid?: string,         // Twilio SMS ID
  smsStatus?: "sent" | "skipped"
}
```

---

## 🎨 Styling
Maintains Tesla-clean design from customer page:
- **Primary Green**: `#00A651`
- **Dark Blue**: `#1A3C5E`
- **Background**: `#f8f9fa`
- **White cards** with subtle shadows
- **Mobile-first** responsive design

---

## 🔮 Future Enhancements

### Phase 2 (Soon)
- ✅ Calendar invites (Google Calendar API)
- ✅ Test completion workflow
- ✅ Photo gallery per test
- ✅ Digital signature capture
- ✅ PDF report generation

### Phase 3 (Later)
- ⚡ **Downtime Monitor** → Alert testers when CARB systems are down
- 📍 Route optimization for multiple tests
- 💰 Payment tracking per test
- 📈 Analytics dashboard for testers
- 🔔 Push notifications for urgent tests

---

## 💡 Tips

1. **VIN Extraction**: Works best with clear, well-lit photos of VIN plate
2. **Phone Format**: Accepts any format - auto-converts to E.164 (+1xxxxxxxxxx)
3. **GPS Location**: Auto-captured on page load - grant location permissions
4. **Offline Mode**: Photos queue for upload when connection restored
5. **SMS Delivery**: Check Firebase Functions logs if SMS not sending

---

## 🐛 Troubleshooting

### SMS Not Sending
```bash
# Check Twilio config
firebase functions:config:get

# View function logs
firebase functions:log --only scheduleTest
```

### Photo Upload Fails
- Check Storage rules deployed: `firebase deploy --only storage`
- Verify user authenticated
- Check browser console for errors

### VIN Not Detected
- Retake photo with better lighting
- Ensure VIN plate is clearly visible
- May need to manually enter VIN

### Tests Not Showing
- Check Firestore rules deployed: `firebase deploy --only firestore`
- Verify testerId matches logged-in user
- Check browser console for Firestore errors

---

## 📞 Support
- **Email**: support@norcalcarbmobile.com
- **Phone**: (916) 890-4427
- **Firebase Console**: https://console.firebase.google.com/project/carb-compliance-app-3537-a1e48

---

**Built with Firebase, Tesseract.js OCR, and Twilio**
