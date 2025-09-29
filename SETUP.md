# Setup Guide - Bot Platform

Panduan lengkap untuk setup dan konfigurasi Bot Platform dari awal.

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ 
- npm atau yarn
- Git
- Akun Firebase
- Akun Telegram (untuk membuat bot)

### 2. Installation
```bash
# Clone repository
git clone <repository-url>
cd telegram-bot-platform

# Install dependencies
npm install

# Copy environment template
cp env.example .env.local
```

### 3. Configuration

#### Firebase Setup:
1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Buat project baru atau pilih existing project
3. Enable Firestore Database:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode"
   - Select location (preferably asia-southeast1)
4. Enable Storage:
   - Go to Storage
   - Click "Get started"
   - Choose "Start in test mode"
5. Copy Firebase config ke `.env.local`

#### Telegram Bot Setup:
1. Chat dengan [@BotFather](https://t.me/BotFather) di Telegram
2. Buat bot baru:
   ```
   /newbot
   Bot name: Your Bot Name
   Username: your_bot_username
   ```
3. Copy bot token ke `.env.local`
4. Set bot commands:
   ```
   /setcommands
   start - Memulai bot
   help - Menampilkan bantuan
   translate - Terjemahkan teks
   todo - Kelola to-do list
   quiz - Mulai kuis
   game - Mulai permainan
   shop - Toko online
   monitor - Server monitoring
   ```

#### Environment Variables:
Edit `.env.local` dengan konfigurasi Anda:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_WEBHOOK_URL=http://localhost:3000/api/telegram/webhook

# API Keys (Optional)
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key
TMDB_API_KEY=your_tmdb_api_key
OPENAI_API_KEY=your_openai_api_key
```

### 4. Run Development Server
```bash
npm run dev
```

Akses aplikasi di: http://localhost:3000

## 🔧 Detailed Configuration

### Firebase Security Rules

#### Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Sessions collection
    match /sessions/{sessionId} {
      allow read, write: if true; // Allow for bot functionality
    }
    
    // Todos collection
    match /todos/{todoId} {
      allow read, write: if true; // Allow for bot functionality
    }
    
    // Expenses collection
    match /expenses/{expenseId} {
      allow read, write: if true; // Allow for bot functionality
    }
    
    // Notes collection
    match /notes/{noteId} {
      allow read, write: if true; // Allow for bot functionality
    }
    
    // Cart collection
    match /cart/{cartId} {
      allow read, write: if true; // Allow for bot functionality
    }
    
    // Orders collection
    match /orders/{orderId} {
      allow read, write: if true; // Allow for bot functionality
    }
  }
}
```

#### Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true; // Allow for bot functionality
    }
  }
}
```

### API Keys Setup

#### Google Translate API:
1. Buka [Google Cloud Console](https://console.cloud.google.com/)
2. Enable Cloud Translation API
3. Create API key
4. Copy ke `GOOGLE_TRANSLATE_API_KEY`

#### TMDB API:
1. Daftar di [The Movie Database](https://www.themoviedb.org/)
2. Request API key
3. Copy ke `TMDB_API_KEY`

#### OpenAI API:
1. Buka [OpenAI Platform](https://platform.openai.com/)
2. Create API key
3. Copy ke `OPENAI_API_KEY`

## 🧪 Testing

### 1. Local Testing
```bash
# Run development server
npm run dev

# Test web interface
open http://localhost:3000

# Test bot simulation
open http://localhost:3000/test-bot
```

### 2. Bot Testing
1. Buka bot di Telegram
2. Kirim `/start`
3. Test berbagai perintah:
   - `/help`
   - `/translate Hello`
   - `/todo`
   - `/quiz`
   - `/game`

### 3. Webhook Testing
```bash
# Set webhook untuk development
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
-H "Content-Type: application/json" \
-d '{"url": "https://your-domain.com/api/telegram/webhook"}'

# Test webhook
curl -X POST "https://your-domain.com/api/telegram/webhook" \
-H "Content-Type: application/json" \
-d '{"update_id": 123, "message": {"message_id": 1, "from": {"id": 123, "is_bot": false, "first_name": "Test"}, "chat": {"id": 123, "type": "private"}, "date": 1234567890, "text": "/start"}}'
```

## 📱 Mobile Setup

### PWA Configuration:
1. Add manifest.json ke public folder
2. Add service worker
3. Configure icons

### Mobile Testing:
1. Open di mobile browser
2. Add to home screen
3. Test offline functionality

## 🔒 Security Setup

### 1. Environment Variables
- Jangan commit `.env.local`
- Gunakan environment variables di production
- Rotate keys secara berkala

### 2. Firebase Security
- Set up proper security rules
- Enable authentication jika diperlukan
- Monitor usage dan access

### 3. Bot Security
- Jangan expose bot token
- Monitor bot usage
- Set up rate limiting

## 🚀 Production Deployment

### 1. Build for Production
```bash
npm run build
```

### 2. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add TELEGRAM_BOT_TOKEN
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... add all other variables
```

### 3. Set Webhook
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
-H "Content-Type: application/json" \
-d '{"url": "https://your-app.vercel.app/api/telegram/webhook"}'
```

## 🔍 Troubleshooting

### Common Issues:

#### 1. Build Errors
```bash
# Clear cache
rm -rf .next
npm run build
```

#### 2. Firebase Connection Issues
- Check Firebase config
- Verify project ID
- Check security rules
- Ensure APIs are enabled

#### 3. Telegram Bot Issues
- Verify bot token
- Check webhook URL
- Test with curl
- Check bot permissions

#### 4. Environment Variables Not Loading
- Check variable names (case sensitive)
- Restart development server
- Verify .env.local location
- Check for typos

#### 5. TypeScript Errors
```bash
# Check types
npm run type-check

# Fix linting
npm run lint:fix
```

## 📊 Monitoring

### 1. Firebase Monitoring
- Monitor Firestore usage
- Check Storage usage
- Monitor API calls

### 2. Telegram Bot Monitoring
- Check bot analytics
- Monitor webhook responses
- Track user interactions

### 3. Application Monitoring
- Use Vercel Analytics
- Monitor performance
- Track errors

## 🆘 Support

Jika mengalami masalah:
1. Check logs di console
2. Verify configuration
3. Test dengan minimal setup
4. Check GitHub issues
5. Create new issue jika diperlukan

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Telegram Bot API](https://core.telegram.org/bots/api)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Setup selesai! Selamat menggunakan Bot Platform! 🎉**
