# 🔧 Bot Troubleshooting Guide

## 🚨 Masalah: Bot Tidak Membalas

### ✅ **Status Saat Ini**
- ✅ **Bot Token**: Valid dan berfungsi
- ✅ **Webhook Endpoint**: Berfungsi di `/api/telegram/webhook`
- ✅ **Auto-reply System**: Sudah diimplementasi
- ✅ **Chat ID**: Ditemukan (8124399716)
- ⚠️ **Webhook URL**: Belum di-setup di Telegram

## 🔍 **Diagnosis Masalah**

### 1. **Cek Status Bot**
```bash
node get-chat-id.js
```
**Expected Output**: Bot info dan chat ID yang valid

### 2. **Test Webhook Endpoint**
```bash
node test-webhook-direct.js
```
**Expected Output**: `{ ok: true, result: { success: true, type: 'message' } }`

### 3. **Cek Logs Next.js**
Monitor terminal Next.js untuk melihat:
- `📨 Received Telegram update`
- `💬 Handling message`
- `📤 Sending message`
- `✅ Message sent successfully`

## 🚀 **Solusi: Setup Webhook**

### **Opsi 1: Setup dengan Ngrok (Recommended)**

1. **Install Ngrok**
   ```bash
   # Download dari https://ngrok.com/download
   # Atau install via npm
   npm install -g ngrok
   ```

2. **Start Ngrok**
   ```bash
   # Di terminal terpisah
   ngrok http 3000
   ```

3. **Setup Webhook**
   ```bash
   node setup-webhook-ngrok.js
   ```

4. **Test Bot**
   - Buka Telegram
   - Cari @Backup_indBot
   - Kirim pesan "halo"

### **Opsi 2: Setup Manual**

1. **Copy URL ngrok** (contoh: `https://abc123.ngrok.io`)

2. **Setup webhook via API**
   ```bash
   curl -X POST "https://api.telegram.org/bot8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw/setWebhook" \
   -H "Content-Type: application/json" \
   -d '{"url":"https://abc123.ngrok.io/api/telegram/webhook"}'
   ```

3. **Verify webhook**
   ```bash
   curl "https://api.telegram.org/bot8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw/getWebhookInfo"
   ```

## 🧪 **Test Scenarios**

### **Test Auto-reply Patterns**
```
halo → 👋 Halo! Senang bertemu dengan Anda!
apa kabar? → 🤔 Pertanyaan yang menarik! Saya akan mencoba membantu.
terima kasih → 😊 Sama-sama! Senang bisa membantu.
jam berapa? → 🕐 Waktu saat ini: [current time]
mau makan → 🍽️ Wah, sepertinya Anda sedang mencari tempat makan!
film bagus → 🎬 Tertarik dengan hiburan?
kerja keras → 💼 Saya bisa membantu produktivitas Anda!
```

### **Test Commands**
```
/start → Welcome message dengan menu utama
/help → Daftar lengkap perintah
/todo → Manajemen to-do list
/game → Games menu
/movie Avatar → Movie information
```

## 📊 **Monitoring & Logs**

### **Webhook Logs**
```bash
# Monitor terminal Next.js untuk melihat:
📨 Received Telegram update: {...}
🔄 Processing update: { hasMessage: true, chatId: 8124399716, text: "halo" }
💬 Handling message: { chatId: 8124399716, userId: 8124399716, text: "halo" }
📤 Sending message: { chatId: 8124399716, text: "👋 Halo! Senang bertemu dengan Anda!" }
✅ Message sent successfully: 123
```

### **Error Logs**
```bash
# Jika ada error, akan muncul:
❌ Error processing webhook: [error details]
❌ Error in processMessage: [error details]
❌ Error sending message: [error details]
```

## 🔧 **Troubleshooting Steps**

### **Step 1: Cek Bot Status**
```bash
node get-chat-id.js
```
- ✅ Jika berhasil: Bot token valid
- ❌ Jika gagal: Cek bot token

### **Step 2: Cek Webhook Endpoint**
```bash
node test-webhook-direct.js
```
- ✅ Jika berhasil: Endpoint berfungsi
- ❌ Jika gagal: Cek Next.js server

### **Step 3: Cek Webhook URL**
```bash
curl "https://api.telegram.org/bot8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw/getWebhookInfo"
```
- ✅ Jika URL ada: Webhook sudah di-setup
- ❌ Jika URL null: Perlu setup webhook

### **Step 4: Test Manual Send**
```bash
# Ganti CHAT_ID dengan ID yang benar
curl -X POST "https://api.telegram.org/bot8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw/sendMessage" \
-H "Content-Type: application/json" \
-d '{"chat_id":8124399716,"text":"Test manual"}'
```

## 🚨 **Common Issues**

### **Issue 1: "chat not found"**
**Cause**: Chat ID tidak valid
**Solution**: Gunakan Chat ID yang benar dari `get-chat-id.js`

### **Issue 2: "webhook not set"**
**Cause**: Webhook belum di-setup
**Solution**: Setup webhook dengan ngrok atau hosting

### **Issue 3: "Internal server error"**
**Cause**: Error di webhook endpoint
**Solution**: Cek logs Next.js untuk error details

### **Issue 4: "Bot not responding"**
**Cause**: Webhook tidak menerima request
**Solution**: Cek webhook URL di Telegram

### **Issue 5: "Firebase error"**
**Cause**: Firebase connection issue
**Solution**: Cek Firebase config dan credentials

## 📱 **Quick Test Commands**

```bash
# Test bot status
node get-chat-id.js

# Test webhook endpoint
node test-webhook-direct.js

# Setup webhook dengan ngrok
node setup-webhook-ngrok.js

# Test real-time system
node test-realtime-bot.js
```

## 🎯 **Expected Behavior**

### **Setelah Setup Webhook**
1. **Kirim pesan ke bot** → Bot membalas dalam 1-2 detik
2. **Auto-reply patterns** → Response sesuai konteks
3. **Commands** → Response sesuai perintah
4. **Logs** → Real-time di terminal Next.js

### **Success Indicators**
- ✅ Webhook URL ter-set di Telegram
- ✅ Logs muncul di terminal Next.js
- ✅ Bot membalas pesan dengan benar
- ✅ Auto-reply patterns berfungsi
- ✅ Commands berfungsi normal

## 🆘 **Jika Masih Tidak Berfungsi**

1. **Restart Next.js server**
2. **Restart ngrok tunnel**
3. **Clear webhook dan setup ulang**
4. **Cek firewall/network settings**
5. **Verify bot token dan permissions**

---

**🎉 Setelah mengikuti troubleshooting ini, bot akan membalas pesan secara real-time!**
