#!/bin/bash

echo "🚀 Deploying Telegram Bot to Vercel..."
echo "======================================"
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Telegram Bot Platform"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found. Please add GitHub remote:"
    echo "   git remote add origin https://github.com/yourusername/telegram-bot-platform.git"
    echo "   git push -u origin main"
    echo ""
    echo "📋 Manual steps:"
    echo "1. Create repository di GitHub"
    echo "2. Add remote origin"
    echo "3. Push code"
    echo "4. Deploy ke Vercel"
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Deploy: Telegram Bot Real-time System"
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "Please login to Vercel:"
    vercel login
fi

# Deploy to production
echo "🚀 Deploying to production..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Next steps:"
echo "1. Copy the deployment URL from above"
echo "2. Update setup-production-webhook.js with the URL"
echo "3. Run: node setup-production-webhook.js"
echo "4. Test bot di Telegram"
echo ""
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo "📱 Test Bot: @Backup_indBot"
