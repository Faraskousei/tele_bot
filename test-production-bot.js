#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';
const PRODUCTION_URL = 'https://your-app-name.vercel.app'; // Ganti dengan URL Vercel Anda

console.log('🧪 Testing Production Bot...\n');

// Test message payload
const testMessage = {
  update_id: 123456789,
  message: {
    message_id: 102,
    from: {
      id: 8124399716,
      is_bot: false,
      first_name: 'Test',
      last_name: 'User',
      username: 'test_user',
      language_code: 'id'
    },
    chat: {
      id: 8124399716,
      first_name: 'Test',
      last_name: 'User',
      username: 'test_user',
      type: 'private'
    },
    date: Math.floor(Date.now() / 1000),
    text: 'halo'
  }
};

async function testProductionWebhook() {
  try {
    console.log('📡 Testing production webhook...');
    console.log('🔗 URL:', `${PRODUCTION_URL}/api/telegram/webhook`);
    console.log('📨 Payload:', JSON.stringify(testMessage, null, 2));

    const postData = JSON.stringify(testMessage);

    const options = {
      hostname: 'your-app-name.vercel.app', // Ganti dengan domain Vercel Anda
      port: 443,
      path: '/api/telegram/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    console.log('✅ Production Webhook Response:', response);
  } catch (error) {
    console.error('❌ Error testing production webhook:', error);
  }
}

async function getBotInfo() {
  try {
    console.log('\n🤖 Testing bot directly...');
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getMe`,
      method: 'GET',
    };
    const botInfo = await makeRequest(options);
    console.log('✅ Bot Info:', botInfo);
    if (botInfo.ok) {
      console.log('✅ Bot is accessible and working');
    } else {
      console.log('❌ Bot is not accessible or not working');
    }
  } catch (error) {
    console.error('❌ Error getting bot info:', error.message);
  }
}

async function testSendMessage() {
  try {
    console.log('\n📤 Testing send message...');
    
    const chatId = 8124399716;
    
    const postData = JSON.stringify({
      chat_id: chatId,
      text: '🧪 Test message dari production!'
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    console.log('✅ Message sent response:', response);
  } catch (error) {
    console.error('❌ Error sending message:', error.message);
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
  console.log('\n📋 INSTRUKSI TESTING PRODUCTION:');
  console.log('=================================');
  console.log('');
  console.log('1. 🚀 Pastikan aplikasi sudah di-deploy ke Vercel');
  console.log('2. 🔧 Ganti URL di script ini dengan URL Vercel Anda');
  console.log('3. 📱 Buka Telegram dan cari bot Anda');
  console.log('4. 💬 Kirim pesan "halo" ke bot');
  console.log('5. 🔍 Lihat logs di Vercel dashboard');
  console.log('6. 📊 Cek apakah webhook endpoint menerima request');
  console.log('');
  console.log('🔧 TROUBLESHOOTING:');
  console.log('===================');
  console.log('• Jika webhook tidak menerima request: cek URL webhook di Telegram');
  console.log('• Jika bot tidak merespon: cek logs error di Vercel dashboard');
  console.log('• Jika error 500: cek Firebase connection dan bot token');
  console.log('• Jika tidak ada log: webhook URL mungkin salah');
  console.log('');
  console.log('📱 CARA MENDAPATKAN CHAT ID:');
  console.log('============================');
  console.log('1. Kirim pesan ke bot');
  console.log(`2. Buka: https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);
  console.log('3. Lihat chat.id di response JSON');
  console.log('4. Ganti chatId di script ini dengan ID yang benar');
  console.log('');
  console.log('🎯 NEXT STEPS:');
  console.log('==============');
  console.log('1. Jalankan: node test-production-bot.js');
  console.log('2. Kirim pesan ke bot di Telegram');
  console.log('3. Monitor logs di Vercel dashboard');
  console.log('4. Cek apakah bot membalas');
}

async function main() {
  await getBotInfo();
  await testProductionWebhook();
  // await testSendMessage(); // Uncomment to test sending a message directly via Telegram API
  showInstructions();
}

main();
