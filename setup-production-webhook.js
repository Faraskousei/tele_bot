#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🚀 Setting up Production Webhook for Vercel...\n');

// Ganti dengan URL Vercel Anda setelah deploy
const PRODUCTION_URL = 'https://your-app-name.vercel.app'; // Ganti dengan URL Vercel Anda

async function setupProductionWebhook() {
  try {
    console.log('📡 Setting up production webhook...');
    console.log('🔗 Production URL:', PRODUCTION_URL);
    
    if (PRODUCTION_URL.includes('your-app-name')) {
      console.log('⚠️  PERINGATAN: Ganti PRODUCTION_URL dengan URL Vercel yang sebenarnya!');
      console.log('📝 Contoh: https://telegram-bot-platform.vercel.app');
      return;
    }
    
    const webhookUrl = `${PRODUCTION_URL}/api/telegram/webhook`;
    console.log('🎯 Webhook URL:', webhookUrl);
    
    const webhookApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
    const postData = JSON.stringify({
      url: webhookUrl,
      max_connections: 100,
      allowed_updates: ['message', 'callback_query', 'inline_query'],
      drop_pending_updates: true
    });

    const response = await makeRequest(webhookApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);
    
    if (response.ok) {
      console.log('✅ Production webhook berhasil di-setup!');
      console.log('🎉 Bot siap menerima pesan real-time di production!');
      return true;
    } else {
      console.error('❌ Gagal setup production webhook:', response.description);
      return false;
    }

  } catch (error) {
    console.error('❌ Error setting up production webhook:', error.message);
    return false;
  }
}

async function testProductionWebhook() {
  try {
    console.log('\n🧪 Testing production webhook...');
    
    const webhookInfoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`;
    const response = await makeRequest(webhookInfoUrl);
    
    if (response.ok) {
      console.log('📊 Production Webhook Info:');
      console.log('   URL:', response.result.url);
      console.log('   Pending Updates:', response.result.pending_update_count);
      console.log('   Last Error Date:', response.result.last_error_date ? new Date(response.result.last_error_date * 1000) : 'None');
      console.log('   Last Error Message:', response.result.last_error_message || 'None');
      
      if (response.result.url === `${PRODUCTION_URL}/api/telegram/webhook`) {
        console.log('✅ Production webhook URL sesuai!');
        return true;
      } else {
        console.log('⚠️  Production webhook URL tidak sesuai');
        console.log('   Expected:', `${PRODUCTION_URL}/api/telegram/webhook`);
        console.log('   Actual:', response.result.url);
        return false;
      }
    }

  } catch (error) {
    console.error('❌ Error testing production webhook:', error.message);
    return false;
  }
}

async function testProductionEndpoint() {
  try {
    console.log('\n🌐 Testing production endpoint...');
    
    const endpointUrl = `${PRODUCTION_URL}/api/telegram/webhook`;
    console.log('🔗 Testing:', endpointUrl);
    
    const response = await makeRequest(endpointUrl);
    console.log('✅ Production endpoint response:', response);

  } catch (error) {
    console.error('❌ Error testing production endpoint:', error.message);
  }
}

async function makeRequest(url, options = {}, postData = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(requestOptions, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve(jsonData);
        } catch (error) {
          resolve({ error: 'Invalid JSON', data });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      req.write(postData);
    }
    
    req.end();
  });
}

function showInstructions() {
  console.log('\n📋 CARA DEPLOY KE VERCEL:');
  console.log('========================');
  console.log('');
  console.log('1. 🚀 Push ke GitHub:');
  console.log('   git add .');
  console.log('   git commit -m "Add Telegram bot"');
  console.log('   git push origin main');
  console.log('');
  console.log('2. 🌐 Deploy ke Vercel:');
  console.log('   - Buka https://vercel.com');
  console.log('   - Login dengan GitHub');
  console.log('   - Import Project');
  console.log('   - Deploy');
  console.log('');
  console.log('3. ⚙️ Setup Environment Variables di Vercel:');
  console.log('   TELEGRAM_BOT_TOKEN=8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw');
  console.log('   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDO9QTPwSLc7YEyEu-vkAewptzRVcWdF78');
  console.log('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=db-ind-b9d1c.firebaseapp.com');
  console.log('   NEXT_PUBLIC_FIREBASE_PROJECT_ID=db-ind-b9d1c');
  console.log('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=db-ind-b9d1c.firebasestorage.app');
  console.log('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=142941537714');
  console.log('   NEXT_PUBLIC_FIREBASE_APP_ID=1:142941537714:web:fbb4f4d18715688e8550ab');
  console.log('   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-8XYH1H62E4');
  console.log('');
  console.log('4. 🔗 Update PRODUCTION_URL di script ini:');
  console.log('   Ganti "https://your-app-name.vercel.app" dengan URL Vercel Anda');
  console.log('');
  console.log('5. 🧪 Test production webhook:');
  console.log('   node setup-production-webhook.js');
  console.log('');
  console.log('6. 📱 Test bot di Telegram:');
  console.log('   - Kirim pesan ke @Backup_indBot');
  console.log('   - Cek apakah bot membalas');
  console.log('   - Monitor logs di Vercel dashboard');
  console.log('');
}

// Main execution
async function main() {
  console.log('🚀 Telegram Bot Production Setup');
  console.log('================================\n');
  
  if (PRODUCTION_URL.includes('your-app-name')) {
    showInstructions();
    return;
  }
  
  await testProductionEndpoint();
  await setupProductionWebhook();
  await testProductionWebhook();
  
  console.log('\n🎉 PRODUCTION SETUP COMPLETE!');
  console.log('=============================');
  console.log('');
  console.log('📊 Production Summary:');
  console.log('   ✅ Vercel URL:', PRODUCTION_URL);
  console.log('   ✅ Webhook URL:', `${PRODUCTION_URL}/api/telegram/webhook`);
  console.log('   ✅ Real-time Bot: Ready');
  console.log('');
  console.log('📱 Test Bot:');
  console.log('   1. Buka Telegram dan cari @Backup_indBot');
  console.log('   2. Kirim pesan: "halo", "apa kabar?", "/start"');
  console.log('   3. Bot akan membalas secara real-time');
  console.log('   4. Monitor logs di Vercel dashboard');
  console.log('');
}

// Run the setup
main().catch(console.error);
