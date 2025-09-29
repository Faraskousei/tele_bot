# 🚀 Deployment Guide - Telegram Bot Platform

## 📋 Overview
This guide will help you deploy the Telegram Bot Platform to Vercel with real-time webhook support.

## 🌐 Production Domain
- **Domain**: `grambotele.vercel.app`
- **Webhook URL**: `https://grambotele.vercel.app/api/telegram/webhook`
- **Bot**: `@Backup_indBot`

## 🔧 Prerequisites

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

## 🚀 Deployment Steps

### Step 1: Deploy to Vercel
```bash
# Deploy to production
vercel --prod

# Or use the automated script
node deploy-to-vercel.js
```

### Step 2: Set Environment Variables
Set these environment variables in Vercel dashboard:

```env
TELEGRAM_BOT_TOKEN=8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw
TELEGRAM_WEBHOOK_URL=https://grambotele.vercel.app/api/telegram/webhook
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDO9QTPwSLc7YEyEu-vkAewptzRVcWdF78
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=db-ind-b9d1c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=db-ind-b9d1c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=db-ind-b9d1c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=142941537714
NEXT_PUBLIC_FIREBASE_APP_ID=1:142941537714:web:fbb4f4d18715688e8550ab
TMDB_API_KEY=db10591f98182b1ca805e5ee581d820c
TMDB_READ_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjEwNTkxZjI4MTgyYjFjYWI4MDVlNWU1ODEwZDBjIiwic3ViIjoiNjMTc1OTExOTc2MjMyNTIsImlzcyI6InNlY3VyZSIsImV4cCI6MTcwOTYyOTBhNjJkZWMyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uOjF9.l9FbbJ6xmaGJ2EHW39QkDuMASTH8s5kwVtO0wcXffzk
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://grambotele.vercel.app
```

### Step 3: Configure Webhook
```bash
# Setup webhook for production
node setup-vercel-webhook.js
```

### Step 4: Test Production Bot
```bash
# Test all production features
node test-production-bot.js
```

## 🧪 Testing

### 1. Test Webhook Endpoint
Visit: `https://grambotele.vercel.app/api/telegram/webhook`

Expected response:
```json
{
  "message": "Telegram webhook endpoint",
  "status": "active",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "domain": "grambotele.vercel.app"
}
```

### 2. Test Bot in Telegram
1. Send message to `@Backup_indBot`
2. Check if bot responds real-time
3. Test all features and navigation
4. Verify session management works

### 3. Test Features
- ✅ Interactive menus
- ✅ Session management
- ✅ Real-time responses
- ✅ Category navigation
- ✅ Back button functionality

## 🔧 Troubleshooting

### Bot Not Responding
1. Check webhook configuration:
   ```bash
   node setup-vercel-webhook.js
   ```

2. Verify environment variables in Vercel dashboard

3. Check Vercel function logs

### Webhook Issues
1. Test webhook endpoint:
   ```bash
   curl https://grambotele.vercel.app/api/telegram/webhook
   ```

2. Check webhook info:
   ```bash
   node test-production-bot.js
   ```

### Environment Variables
1. Go to Vercel dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add all required variables

## 📱 Bot Features

### Interactive Menus
- Main menu with categories
- Category-based navigation
- Back button functionality
- Session state management

### Categories
- 📚 **Education**: Translate, Quiz, Notes
- 📋 **Management**: To-Do, Expense, Group
- 🎮 **Entertainment**: Game, Movie, Meme
- 💼 **Business**: Shop, Booking, Support
- ⚙️ **Technical**: Monitor, AI, GitHub

### Real-time Features
- Instant message processing
- Session management
- Callback query handling
- Error handling and recovery

## 🔗 Links

- **Website**: https://grambotele.vercel.app
- **Webhook**: https://grambotele.vercel.app/api/telegram/webhook
- **Bot**: @Backup_indBot
- **GitHub**: [Repository URL]

## 📊 Monitoring

### Vercel Dashboard
- Function execution logs
- Performance metrics
- Error tracking

### Telegram Bot API
- Webhook status
- Message delivery
- Error handling

## 🚀 Production Checklist

- [ ] Deploy to Vercel
- [ ] Set environment variables
- [ ] Configure webhook
- [ ] Test webhook endpoint
- [ ] Test bot in Telegram
- [ ] Verify all features work
- [ ] Check session management
- [ ] Monitor error logs
- [ ] Test real-time responses

## 📞 Support

If you encounter any issues:

1. Check Vercel function logs
2. Test webhook endpoint
3. Verify environment variables
4. Check Telegram bot status
5. Review error messages

## 🎉 Success!

Once deployed successfully, your bot will:
- Respond in real-time to Telegram messages
- Handle interactive menus and navigation
- Manage user sessions properly
- Provide all features as expected

**Your bot is now live at `grambotele.vercel.app`! 🚀**