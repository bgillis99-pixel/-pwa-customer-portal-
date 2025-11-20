# Branding Setup Guide

## Quick Start - Adding Your Logos

Your PWA is now configured with professional branding! Follow these steps to complete the setup:

### 1. Save Your Logo Files

From the images you provided, save your logos as PNG files to these locations:

```
public/
├── images/
│   └── logos/
│       ├── norcalcarb-logo.png          (Primary logo with truck)
│       └── clean-truck-check-logo.png   (Credentialed Tester badge)
└── icons/
    ├── icon-192.png                      (PWA icon - 192x192px)
    ├── icon-512.png                      (PWA icon - 512x512px)
    └── favicon.ico                       (Browser favicon)
```

### 2. Logo Specifications

**NorCal CARB Logo** (`norcalcarb-logo.png`):
- Recommended width: 800-1000px
- Format: PNG with transparent background (preferred)
- Used in: App header, landing page, investor materials

**Clean Truck Check Logo** (`clean-truck-check-logo.png`):
- Recommended width: 1200-1400px
- Format: PNG with transparent background (preferred)
- Used in: App header badge, credential displays

**PWA Icons**:
- icon-192.png: 192x192px, PNG
- icon-512.png: 512x512px, PNG
- These are required for Progressive Web App installation

### 3. Creating PWA Icons

**⚡ SUPER QUICK METHOD (Recommended for now):**

1. Open `/public/icons/generate-icons.html` in your browser
2. Click "Download 192x192" and "Download 512x512"
3. Save both files in `/public/icons/` directory
4. Done! (Simple design: white background, blue "CARB" text, green wave)

This gives you a clean, professional icon instantly. Easy to change later!

**Option B: Use Your Full Logo (Optional)**
1. Visit: https://realfavicongenerator.net/
2. Upload your norcalcarb-logo.png
3. Generate and download icons
4. Place in `/public/icons/` directory

**Option C: Manual (Using design software)**
1. Open your logo in Photoshop/GIMP/Figma
2. Create square canvases: 192x192 and 512x512
3. Center your logo (may need to adjust size)
4. Add background color (#1A3C5E or #00A651 recommended)
5. Export as PNG files

### 4. Brand Colors Used

Your app now uses these consistent brand colors:

```css
Primary Blue: #1A3C5E  (Navy - headers, text)
Primary Green: #00A651 (Action buttons, highlights)
Background: #f8f9fa    (Light gray)
White: #ffffff         (Cards, header background)
```

### 5. Where Logos Appear

**Next.js App** (`/app`):
- Header: Both logos displayed (NorCal on left, Credential badge on right)
- Responsive: Credential badge hidden on mobile (<640px)
- Footer: Text branding with credential mention

**Static HTML** (`/index.html`):
- Same header layout as Next.js app
- Fallback text if images not found
- Professional footer with credential display

## Files Modified

```
✅ Created:
- /app/layout.tsx              (Professional layout with branded header)
- /app/globals.css             (Brand color system and styling)
- /public/images/logos/README.md (This guide)

✅ Updated:
- /app/page.tsx                (Enhanced UI with brand colors)
- /index.html                  (Professional branding and layout)

📁 Created directories:
- /public/images/logos/        (For your logo files)
- /public/icons/               (For PWA icons)
```

## For Investor Presentations

Your app now has:

✅ Professional header with dual-logo credentialing
✅ Consistent brand colors throughout
✅ Clean, modern UI with smooth interactions
✅ Mobile-responsive design
✅ Progressive Web App capabilities
✅ Credentialed Tester badging prominently displayed

### Screenshots for Pitch Deck

After adding your logos, take screenshots of:
1. Landing page (index.html) - Shows full branding
2. App dashboard (Next.js app) - Shows functional interface
3. Mobile view - Demonstrates responsive design
4. PWA installation - Shows "Add to Home Screen" capability

## Testing Your Logos

1. Add your logo files to the specified directories
2. Run your dev server:
   ```bash
   npm run dev
   ```
3. Visit:
   - http://localhost:3000 (Next.js app)
   - http://localhost:3000/index.html (Static page)
4. Check that logos display correctly
5. Test responsive behavior (resize browser)

## Troubleshooting

**Logos not showing?**
- Check file paths match exactly
- Verify file names (case-sensitive)
- Check file formats (PNG recommended)
- Clear browser cache and reload

**Logos look blurry?**
- Ensure high-resolution source files (minimum 2x display size)
- Use PNG format (not JPEG)
- For vector logos, SVG is ideal

**PWA icons not working?**
- Ensure icons are exactly 192x192 and 512x512 pixels
- Must be PNG format
- Update manifest.json paths if needed

## Next Steps

1. ✅ Add your logo files to `/public/images/logos/`
2. ✅ Create PWA icons for `/public/icons/`
3. Test on development server
4. Deploy to Firebase Hosting
5. Test PWA installation on mobile devices

## Need Help?

The app includes fallback text branding if images aren't found, so you can test the layout immediately. Your logos will replace the text fallbacks once added.

---

**Ready for investors!** 🚀

Your PWA now presents a professional, credentialed appearance that demonstrates:
- Legitimate business operations
- Official Clean Truck Check credentialing
- Professional software development
- Mobile-first approach
- Scalable technology stack
