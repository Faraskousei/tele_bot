# PowerShell script untuk deploy ke Vercel
Write-Host "🚀 Deploying Telegram Bot to Vercel..." -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git repository..." -ForegroundColor Yellow
    git init
    git add .
    git commit -m "Initial commit: Telegram Bot Platform"
}

# Check if remote origin exists
try {
    $origin = git remote get-url origin 2>$null
    if (-not $origin) {
        throw "No remote origin"
    }
} catch {
    Write-Host "⚠️  No remote origin found. Please add GitHub remote:" -ForegroundColor Red
    Write-Host "   git remote add origin https://github.com/yourusername/telegram-bot-platform.git" -ForegroundColor Cyan
    Write-Host "   git push -u origin main" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📋 Manual steps:" -ForegroundColor Yellow
    Write-Host "1. Create repository di GitHub" -ForegroundColor White
    Write-Host "2. Add remote origin" -ForegroundColor White
    Write-Host "3. Push code" -ForegroundColor White
    Write-Host "4. Deploy ke Vercel" -ForegroundColor White
    exit 1
}

# Push to GitHub
Write-Host "📤 Pushing to GitHub..." -ForegroundColor Blue
git add .
git commit -m "Deploy: Telegram Bot Real-time System"
git push origin main

Write-Host ""
Write-Host "✅ Code pushed to GitHub!" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "🌐 Checking Vercel CLI..." -ForegroundColor Blue
try {
    $vercelVersion = vercel --version 2>$null
    Write-Host "✅ Vercel CLI found: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "📦 Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Login to Vercel (if not already logged in)
Write-Host "🔐 Checking Vercel authentication..." -ForegroundColor Blue
try {
    $whoami = vercel whoami 2>$null
    Write-Host "✅ Logged in as: $whoami" -ForegroundColor Green
} catch {
    Write-Host "Please login to Vercel:" -ForegroundColor Yellow
    vercel login
}

# Deploy to production
Write-Host "🚀 Deploying to production..." -ForegroundColor Blue
vercel --prod

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the deployment URL from above" -ForegroundColor White
Write-Host "2. Update setup-production-webhook.js with the URL" -ForegroundColor White
Write-Host "3. Run: node setup-production-webhook.js" -ForegroundColor White
Write-Host "4. Test bot di Telegram" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "📱 Test Bot: @Backup_indBot" -ForegroundColor Cyan
