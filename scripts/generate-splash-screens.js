#!/usr/bin/env node

/**
 * Script to generate iOS splash screens from icon-512.png
 * Splash screens will have the CARB green background with centered logo
 */

const fs = require('fs');
const path = require('path');

// Splash screen configurations for all iOS devices
const splashScreens = [
  { width: 1290, height: 2796, name: 'iPhone_15_Pro_Max__iPhone_15_Plus__iPhone_14_Pro_Max_portrait.png' },
  { width: 1179, height: 2556, name: 'iPhone_15_Pro__iPhone_15__iPhone_14_Pro_portrait.png' },
  { width: 1284, height: 2778, name: 'iPhone_14_Plus__iPhone_13_Pro_Max__iPhone_12_Pro_Max_portrait.png' },
  { width: 1170, height: 2532, name: 'iPhone_14__iPhone_13_Pro__iPhone_13__iPhone_12_Pro__iPhone_12_portrait.png' },
  { width: 1125, height: 2436, name: 'iPhone_13_mini__iPhone_12_mini__iPhone_11_Pro__iPhone_XS__iPhone_X_portrait.png' },
  { width: 1242, height: 2688, name: 'iPhone_11_Pro_Max__iPhone_XS_Max_portrait.png' },
  { width: 828, height: 1792, name: 'iPhone_11__iPhone_XR_portrait.png' },
  { width: 1242, height: 2208, name: 'iPhone_8_Plus__iPhone_7_Plus__iPhone_6s_Plus__iPhone_6_Plus_portrait.png' },
  { width: 750, height: 1334, name: 'iPhone_8__iPhone_7__iPhone_6s__iPhone_6__4.7__iPhone_SE_portrait.png' },
  { width: 2048, height: 2732, name: '12.9__iPad_Pro_portrait.png' },
  { width: 1668, height: 2388, name: '11__iPad_Pro__10.5__iPad_Pro_portrait.png' },
  { width: 1640, height: 2360, name: '10.9__iPad_Air_portrait.png' },
  { width: 1620, height: 2160, name: '10.2__iPad_portrait.png' },
];

console.log('📱 iOS Splash Screen Generator\n');
console.log('This script will create placeholder splash screens.');
console.log('For production, use a tool like https://github.com/elegantapp/pwa-asset-generator\n');

// Create splash directory if it doesn't exist
const splashDir = path.join(__dirname, '..', 'public', 'splash');
if (!fs.existsSync(splashDir)) {
  fs.mkdirSync(splashDir, { recursive: true });
  console.log('✅ Created splash directory\n');
}

// Create an HTML file that can generate splash screens
const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Splash Screen Generator</title>
</head>
<body>
  <h1>iOS Splash Screen Generator</h1>
  <p>Generating ${splashScreens.length} splash screens...</p>
  <canvas id="canvas" style="border: 1px solid #ccc;"></canvas>
  <div id="status"></div>
  <script>
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const status = document.getElementById('status');

    const splashScreens = ${JSON.stringify(splashScreens)};
    const brandColor = '#00A651';
    const backgroundColor = '#f8f9fa';

    let currentIndex = 0;

    // Load the icon
    const icon = new Image();
    icon.onload = function() {
      generateNext();
    };
    icon.src = '../icon-512.png';

    function generateNext() {
      if (currentIndex >= splashScreens.length) {
        status.innerHTML = '<h2>✅ All splash screens generated!</h2>';
        return;
      }

      const screen = splashScreens[currentIndex];
      canvas.width = screen.width;
      canvas.height = screen.height;

      // Background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, screen.width, screen.height);

      // Center brand color circle
      const centerX = screen.width / 2;
      const centerY = screen.height / 2;
      const circleRadius = Math.min(screen.width, screen.height) * 0.25;

      ctx.beginPath();
      ctx.arc(centerX, centerY, circleRadius, 0, Math.PI * 2);
      ctx.fillStyle = brandColor;
      ctx.fill();

      // Draw icon centered
      const iconSize = circleRadius * 1.2;
      ctx.drawImage(
        icon,
        centerX - iconSize / 2,
        centerY - iconSize / 2,
        iconSize,
        iconSize
      );

      // Convert to blob and download
      canvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = screen.name;
        a.click();
        URL.revokeObjectURL(url);

        status.innerHTML = \`Generated \${currentIndex + 1}/\${splashScreens.length}: \${screen.name}\`;
        currentIndex++;
        setTimeout(generateNext, 100);
      }, 'image/png');
    }
  </script>
</body>
</html>`;

const htmlPath = path.join(__dirname, '..', 'generate-splash.html');
fs.writeFileSync(htmlPath, htmlContent);

console.log('📄 Generated splash screen generator HTML');
console.log('');
console.log('To generate splash screens:');
console.log('1. Open generate-splash.html in your browser');
console.log('2. Wait for all images to download');
console.log('3. Move downloaded files to public/splash/');
console.log('');
console.log('OR use pwa-asset-generator for production-quality assets:');
console.log('  npx pwa-asset-generator icon-512.png public/splash \\');
console.log('    --background "#f8f9fa" \\');
console.log('    --splash-only \\');
console.log('    --type png');
console.log('');
console.log('✨ Done!\n');
