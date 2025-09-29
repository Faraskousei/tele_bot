#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🔄 Resetting Webhook...\n');

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

async function setWebhook(webhookUrl) {
  try {
    console.log('🔧 Setting webhook URL:', webhookUrl);
    
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
    console.log('✅ Set webhook response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error setting webhook:', error);
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
  console.log('\n📋 INSTRUKSI RESET WEBHOOK:');
  console.log('============================');
  console.log('');
  console.log('1. 🔄 Webhook sudah di-reset');
  console.log('2. 📱 Bot sekarang menggunakan polling (jika tidak ada webhook)');
  console.log('3. 🧪 Test bot dengan mengirim pesan');
  console.log('4. 🔧 Set webhook baru jika diperlukan');
  console.log('');
  console.log('🔧 TROUBLESHOOTING:');
  console.log('===================');
  console.log('• Jika bot tidak merespon: cek bot token');
  console.log('• Jika error 401: bot token salah');
  console.log('• Jika error 403: bot diblokir user');
  console.log('• Jika error 400: chat tidak ditemukan');
  console.log('');
  console.log('📱 TESTING:');
  console.log('===========');
  console.log('1. Kirim pesan ke bot di Telegram');
  console.log('2. Cek apakah bot merespon');
  console.log('3. Jika tidak merespon, cek bot token');
  console.log('4. Jika masih error, cek bot permissions');
}

async function main() {
  // Get current webhook info
  console.log('🔍 Current webhook info:');
  await getWebhookInfo();
  
  // Delete webhook
  console.log('\n🗑️ Deleting webhook...');
  await deleteWebhook();
  
  // Get updated webhook info
  console.log('\n🔍 Updated webhook info:');
  await getWebhookInfo();
  
  showInstructions();
}

main();
