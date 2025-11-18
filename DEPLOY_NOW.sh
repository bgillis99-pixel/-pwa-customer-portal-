#!/bin/bash
# Quick Deploy Script for CARB PWA
# Just run: bash DEPLOY_NOW.sh

echo "🚀 Deploying CARB Compliance PWA..."
echo ""

# Step 1: Login (if needed)
echo "Step 1/3: Checking Firebase authentication..."
npx -y firebase-tools@latest login --no-localhost || npx -y firebase-tools@latest login

# Step 2: Set project
echo ""
echo "Step 2/3: Setting Firebase project..."
npx -y firebase-tools@latest use carb-help-app-251117-bg

# Step 3: Deploy
echo ""
echo "Step 3/3: Deploying to Firebase Hosting..."
npx -y firebase-tools@latest deploy --only hosting --project carb-help-app-251117-bg

echo ""
echo "✅ DEPLOYMENT COMPLETE!"
echo ""
echo "🌐 Your app is live at:"
echo "   https://carb-help-app-251117-bg.web.app"
echo "   https://carb-help-app-251117-bg.firebaseapp.com"
echo ""
