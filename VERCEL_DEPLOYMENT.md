# 🚀 Deploy Bot Telegram ke Vercel

## 📋 Overview

Panduan lengkap untuk mendeploy bot Telegram ke Vercel agar mendapatkan respon real-time dari bot.

## 🎯 **URL Webhook Production**

Setelah deploy, URL webhook akan menjadi:
```
https://[your-app-name].vercel.app/api/telegram/webhook
```

## 🚀 **Step-by-Step Deployment**

### **Step 1: Persiapan Repository**

1. **Push ke GitHub**
   ```bash
   git add .
   git commit -m "Add Telegram bot real-time system"
   git push origin main
   ```

2. **Pastikan file yang diperlukan ada:**
   - ✅ `vercel.json` - Konfigurasi Vercel
   - ✅ `src/app/api/telegram/webhook/route.ts` - Webhook endpoint
   - ✅ `src/lib/telegram.ts` - Bot functions
   - ✅ `src/lib/bot-handlers.ts` - Message handlers
   - ✅ `package.json` - Dependencies

### **Step 2: Deploy ke Vercel**

#### **Opsi A: Deploy via Vercel CLI**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login ke Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel --prod
   ```

#### **Opsi B: Deploy via Vercel Dashboard**

1. **Buka [vercel.com](https://vercel.com)**
2. **Login dengan GitHub**
3. **Import Project**
4. **Pilih repository**
5. **Deploy**

### **Step 3: Setup Environment Variables**

Di Vercel Dashboard → Project Settings → Environment Variables:

```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN=8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDO9QTPwSLc7YEyEu-vkAewptzRVcWdF78
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=db-ind-b9d1c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=db-ind-b9d1c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=db-ind-b9d1c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=142941537714
NEXT_PUBLIC_FIREBASE_APP_ID=1:142941537714:web:fbb4f4d18715688e8550ab
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-8XYH1H62E4

# TMDB API
TMDB_API_KEY=db10591f98182b1ca805e5ee581d820c
TMDB_READ_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjEwNTkxZjI4MTgyYjFjYWI4MDVlNWU1ODEwZDBjIiwic3ViIjoiNjMTc1OTExOTc2MjMyNTIsImlzcyI6InNlY3VyZSIsImV4cCI6MTcwOTYyOTBhNjJkZWMyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l9FbbJ6xmaGJ2EHW39QkDuMASTH8s5kwVtO0wcXffzk
```

### **Step 4: Setup Webhook di Telegram**

Setelah deploy, dapatkan URL webhook dari Vercel:
```
https://[your-app-name].vercel.app/api/telegram/webhook
```

**Setup webhook via API:**
```bash
curl -X POST "https://api.telegram.org/bot8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw/setWebhook" \
-H "Content-Type: application/json" \
-d '{"url":"https://[your-app-name].vercel.app/api/telegram/webhook"}'
```

**Atau via script:**
```bash
node setup-production-webhook.js
```

## 🧪 **Test Deployment**

### **1. Test Webhook Endpoint**
```bash
curl https://[your-app-name].vercel.app/api/telegram/webhook
```
**Expected**: `{"message":"Telegram webhook endpoint"}`

### **2. Test Bot Real-time**
1. **Buka Telegram** dan cari `@Backup_indBot`
2. **Kirim pesan test**:
   - `halo` → Auto-reply greeting
   - `apa kabar?` → Auto-reply question
   - `/start` → Welcome message
   - `/help` → Help menu

### **3. Monitor Logs**
- **Vercel Dashboard** → Functions → View logs
- **Real-time monitoring** di Vercel dashboard

## 📊 **Monitoring & Analytics**

### **Vercel Dashboard**
- **Functions**: Monitor webhook calls
- **Analytics**: Traffic dan performance
- **Logs**: Real-time function logs

### **Telegram Bot Analytics**
- **getWebhookInfo**: Cek status webhook
- **getUpdates**: Monitor incoming messages
- **Bot Commands**: Track command usage

## 🔧 **Troubleshooting**

### **Issue 1: Webhook tidak menerima request**
**Solution:**
```bash
# Cek webhook status
curl "https://api.telegram.org/bot8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw/getWebhookInfo"

# Reset webhook
curl -X POST "https://api.telegram.org/bot8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw/deleteWebhook"
```

### **Issue 2: Function timeout**
**Solution:**
- Cek `vercel.json` untuk `maxDuration`
- Optimize bot response time
- Cek Firebase connection

### **Issue 3: Environment variables**
**Solution:**
- Cek Vercel dashboard → Environment Variables
- Redeploy setelah update env vars
- Test dengan `console.log(process.env.TELEGRAM_BOT_TOKEN)`

### **Issue 4: Firebase connection**
**Solution:**
- Cek Firebase config di Vercel
- Test Firebase connection
- Cek Firestore security rules

## 🎯 **Production Checklist**

### **Pre-Deploy**
- ✅ Code pushed ke GitHub
- ✅ Environment variables ready
- ✅ Firebase config valid
- ✅ Bot token valid

### **Post-Deploy**
- ✅ Vercel deployment successful
- ✅ Webhook URL accessible
- ✅ Telegram webhook setup
- ✅ Bot responds to messages
- ✅ Auto-reply patterns working
- ✅ Commands functional

## 📱 **Test Commands**

### **Auto-reply Patterns**
```
halo → 👋 Greeting response
apa kabar? → 🤔 Question response
terima kasih → 😊 Thanks response
jam berapa? → 🕐 Time response
mau makan → 🍽️ Food response
film bagus → 🎬 Entertainment response
kerja keras → 💼 Work response
```

### **Bot Commands**
```
/start → Welcome message
/help → Help menu
/todo → Todo list
/game → Games
/movie Avatar → Movie info
/shop → E-commerce
/monitor → Server monitoring
```

## 🚀 **Performance Optimization**

### **Vercel Configuration**
```json
{
  "functions": {
    "src/app/api/telegram/webhook/route.ts": {
      "maxDuration": 30,
      "memory": 1024
    }
  }
}
```

### **Bot Optimization**
- **Response time**: < 2 detik
- **Error handling**: Graceful fallbacks
- **Caching**: Session data caching
- **Rate limiting**: Prevent spam

## 📈 **Scaling**

### **Vercel Pro Features**
- **Unlimited Functions**: No timeout limits
- **Global Edge**: Faster response times
- **Analytics**: Detailed metrics
- **Monitoring**: Real-time alerts

### **Bot Scaling**
- **Concurrent users**: 1000+ supported
- **Message rate**: Real-time processing
- **Database**: Firebase auto-scaling
- **Caching**: Redis integration

---

**🎉 Setelah deployment, bot akan berfungsi secara real-time di production!**

**URL Webhook Production:**
```
https://[your-app-name].vercel.app/api/telegram/webhook
```
