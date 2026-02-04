#!/bin/bash
# Kinetik UI Instagram Automation - Vercel Deployment Script

set -e

echo "🚀 Deploying Dashboard to Vercel..."

cd dashboard

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

echo "📦 Installing dependencies..."
npm install

echo "🔐 Setting environment variables..."
echo "⚠️  You need to configure these in Vercel:"
echo "  - NEXT_PUBLIC_API_URL=http://46.62.209.17:3000"
echo ""
echo "Run: vercel env add NEXT_PUBLIC_API_URL"
echo "Enter: http://46.62.209.17:3000"

echo "🚀 Deploying to Vercel..."
echo "Run one of these commands:"
echo "  - vercel --prod  (for production deployment)"
echo "  - vercel         (for preview deployment)"
echo ""
echo "After deployment, your dashboard will be live at:"
echo "  https://kinetikui-automation-[hash].vercel.app"
