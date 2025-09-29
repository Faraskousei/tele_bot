#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🔧 Setting up Production Webhook...\n');

async function setupWebhook(webhookUrl) {
  try {
    console.log('📡 Setting webhook URL:', webhookUrl);
    
    const postData = JSON.stringify({
      url: webhookUrl,
      allowed_updates: ['message', 'callback_query']
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/setWebhook`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    console.log('✅ Webhook setup response:', response);
    
    if (response.ok) {
      console.log('🎉 Webhook berhasil di-setup!');
    } else {
      console.log('❌ Gagal setup webhook:', response.description);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error setting webhook:', error);
    return null;
  }
}

async function getWebhookInfo() {
  try {
    console.log('📊 Getting webhook info...');
    
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getWebhookInfo`,
      method: 'GET',
    };

    const response = await makeRequest(options);
    console.log('✅ Webhook info:', response);
    return response;
  } catch (error) {
    console.error('❌ Error getting webhook info:', error);
    return null;
  }
}

async function deleteWebhook() {
  try {
    console.log('🗑️ Deleting webhook...');
    
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/deleteWebhook`,
      method: 'POST',
    };

    const response = await makeRequest(options);
    console.log('✅ Delete webhook response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error deleting webhook:', error);
    return null;
  }
}

async function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
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
  console.log('\n📋 INSTRUKSI SETUP WEBHOOK PRODUCTION:');
  console.log('=====================================');
  console.log('');
  console.log('1. 🚀 Deploy aplikasi ke Vercel');
  console.log('2. 📝 Dapatkan URL Vercel (contoh: https://your-app-name.vercel.app)');
  console.log('3. 🔧 Ganti URL di script ini');
  console.log('4. ▶️ Jalankan: node setup-production-webhook-final.js');
  console.log('5. ✅ Test bot dengan mengirim pesan');
  console.log('');
  console.log('🔧 TROUBLESHOOTING:');
  console.log('===================');
  console.log('• Pastikan URL Vercel benar dan aplikasi sudah running');
  console.log('• Pastikan environment variables sudah di-set di Vercel');
  console.log('• Cek logs di Vercel dashboard jika bot tidak merespon');
  console.log('• Pastikan webhook URL menggunakan HTTPS');
  console.log('');
  console.log('📱 TESTING:');
  console.log('===========');
  console.log('1. Kirim pesan ke bot di Telegram');
  console.log('2. Cek logs di Vercel dashboard');
  console.log('3. Pastikan bot membalas pesan');
  console.log('4. Jika tidak merespon, cek error logs');
}

async function main() {
  // Ganti dengan URL Vercel Anda
  const webhookUrl = 'https://your-app-name.vercel.app/api/telegram/webhook';
  
  console.log('🔍 Current webhook info:');
  await getWebhookInfo();
  
  console.log('\n🔧 Setting up new webhook...');
  await setupWebhook(webhookUrl);
  
  console.log('\n🔍 Updated webhook info:');
  await getWebhookInfo();
  
  showInstructions();
}

main();
