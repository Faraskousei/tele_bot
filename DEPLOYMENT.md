# Deployment Guide - Bot Platform

Panduan lengkap untuk deployment Bot Platform ke berbagai platform.

## 🚀 Platform Deployment

### 1. Vercel (Recommended)

Vercel adalah platform yang paling mudah untuk deployment Next.js apps.

#### Setup Vercel:
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Setup Environment Variables**
   - Buka dashboard Vercel
   - Pilih project Anda
   - Pergi ke Settings > Environment Variables
   - Tambahkan semua variabel dari `.env.local`

#### Environment Variables untuk Vercel:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_WEBHOOK_URL=https://your-app.vercel.app/api/telegram/webhook
GOOGLE_TRANSLATE_API_KEY=your_google_translate_key
TMDB_API_KEY=your_tmdb_api_key
OPENAI_API_KEY=your_openai_api_key
```

#### Setup Webhook Telegram:
1. Setelah deployment, copy URL webhook dari Vercel
2. Update `TELEGRAM_WEBHOOK_URL` di environment variables
3. Set webhook di Telegram:
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
   -H "Content-Type: application/json" \
   -d '{"url": "https://your-app.vercel.app/api/telegram/webhook"}'
   ```

### 2. Netlify

#### Setup Netlify:
1. **Build settings**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

2. **Deploy**
   ```bash
   npm run build
   netlify deploy --prod --dir=.next
   ```

### 3. Railway

#### Setup Railway:
1. **Connect GitHub repository**
2. **Add environment variables**
3. **Deploy automatically**

#### railway.json:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/"
  }
}
```

### 4. DigitalOcean App Platform

#### Setup:
1. **Create new app**
2. **Connect GitHub repository**
3. **Configure build settings**
4. **Add environment variables**

#### .do/app.yaml:
```yaml
name: telegram-bot-platform
services:
- name: web
  source_dir: /
  github:
    repo: your-username/telegram-bot-platform
    branch: main
  run_command: npm start
  environment_slug: node-js
  instance_count: 1
  instance_size_slug: basic-xxs
  envs:
  - key: NODE_ENV
    value: production
```

## 🔧 Pre-deployment Checklist

### 1. Environment Variables
- [ ] Firebase configuration
- [ ] Telegram bot token
- [ ] Webhook URL
- [ ] API keys (Google Translate, TMDB, OpenAI)
- [ ] Database connection strings

### 2. Firebase Setup
- [ ] Firestore database created
- [ ] Storage bucket configured
- [ ] Security rules set
- [ ] Authentication enabled (if needed)

### 3. Telegram Bot Setup
- [ ] Bot created with @BotFather
- [ ] Bot token obtained
- [ ] Webhook configured
- [ ] Bot commands set

### 4. Code Quality
- [ ] TypeScript compilation passes
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] All dependencies installed

## 📱 Mobile Deployment

### PWA Setup
Untuk membuat app bisa diinstall di mobile:

1. **Add PWA manifest**
   ```json
   {
     "name": "Bot Platform",
     "short_name": "BotPlatform",
     "description": "Telegram Bot Management Platform",
     "start_url": "/",
     "display": "standalone",
     "background_color": "#ffffff",
     "theme_color": "#2563eb",
     "icons": [
       {
         "src": "/icon-192x192.png",
         "sizes": "192x192",
         "type": "image/png"
       }
     ]
   }
   ```

2. **Add service worker**
   ```javascript
   // public/sw.js
   self.addEventListener('fetch', (event) => {
     // Cache strategy
   });
   ```

## 🔐 Security Considerations

### 1. Environment Variables
- Jangan commit `.env.local` ke repository
- Gunakan environment variables di platform deployment
- Rotate API keys secara berkala

### 2. Firebase Security Rules
```javascript
// Firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. API Rate Limiting
```javascript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Rate limiting logic
  return NextResponse.next();
}
```

## 📊 Monitoring & Analytics

### 1. Vercel Analytics
```bash
npm install @vercel/analytics
```

```javascript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 2. Error Monitoring
```bash
npm install @sentry/nextjs
```

### 3. Performance Monitoring
- Vercel Speed Insights
- Google PageSpeed Insights
- Lighthouse audits

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 🚨 Troubleshooting

### Common Issues:

1. **Build fails**
   - Check TypeScript errors
   - Verify all dependencies installed
   - Check environment variables

2. **Telegram webhook not working**
   - Verify webhook URL is correct
   - Check bot token
   - Ensure HTTPS is enabled

3. **Firebase connection issues**
   - Verify Firebase config
   - Check security rules
   - Ensure project is properly set up

4. **Environment variables not loading**
   - Check variable names (case sensitive)
   - Verify deployment platform settings
   - Restart deployment after changes

## 📞 Support

Jika mengalami masalah deployment:
1. Check logs di platform deployment
2. Verify environment variables
3. Test locally dengan production build
4. Check GitHub issues atau buat issue baru

---

**Happy Deploying! 🚀**
