#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';
const WEBHOOK_URL = 'http://localhost:3000/api/telegram/webhook'; // Local testing

console.log('🧪 Testing Webhook Directly...\n');

// Test message payload with real chat ID
const testMessage = {
  update_id: 123456789,
  message: {
    message_id: 102,
    from: {
      id: 8124399716,
      is_bot: false,
      first_name: 'Peng',
      last_name: 'Ko',
      username: 'biji_sapi',
      language_code: 'id'
    },
    chat: {
      id: 8124399716,
      first_name: 'Peng',
      last_name: 'Ko',
      username: 'biji_sapi',
      type: 'private'
    },
    date: Math.floor(Date.now() / 1000),
    text: 'halo'
  }
};

async function testWebhook() {
  try {
    console.log('📡 Testing webhook endpoint...');
    console.log('🔗 URL:', WEBHOOK_URL);
    console.log('📨 Payload:', JSON.stringify(testMessage, null, 2));
    
    const url = new URL(WEBHOOK_URL);
    const postData = JSON.stringify(testMessage);

    const options = {
      hostname: url.hostname,
      port: url.port || 3000,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await makeRequest(options, postData);
    console.log('✅ Webhook Response:', response);

  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
  }
}

async function testBotDirect() {
  try {
    console.log('\n🤖 Testing bot directly...');
    
    // Test bot info
    const botInfoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getMe`;
    const botInfo = await makeRequest({ hostname: 'api.telegram.org', path: botInfoUrl.replace('https://api.telegram.org', ''), method: 'GET' });
    
    console.log('✅ Bot Info:', botInfo);
    
    if (botInfo.ok) {
      console.log('✅ Bot is accessible and working');
    } else {
      console.log('❌ Bot error:', botInfo.description);
    }

  } catch (error) {
    console.error('❌ Error testing bot:', error.message);
  }
}

async function testSendMessage() {
  try {
    console.log('\n📤 Testing send message...');
    
    // Using real chat ID from get-chat-id.js
    const chatId = 8124399716;
    
    const sendMessageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const postData = JSON.stringify({
      chat_id: chatId,
      text: '🧪 Test message dari script langsung!'
    });

    const options = {
      hostname: 'api.telegram.org',
      path: sendMessageUrl.replace('https://api.telegram.org', ''),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await makeRequest(options, postData);
    console.log('✅ Send Message Response:', response);

  } catch (error) {
    console.error('❌ Error sending message:', error.message);
  }
}

async function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const isHttps = options.hostname === 'api.telegram.org';
    const request = isHttps ? https.request : http.request;
    
    const req = request(options, (res) => {
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
  console.log('\n📋 INSTRUKSI TESTING:');
  console.log('=====================');
  console.log('');
  console.log('1. 🚀 Pastikan Next.js server berjalan di http://localhost:3000');
  console.log('2. 📱 Buka Telegram dan cari bot Anda');
  console.log('3. 💬 Kirim pesan "halo" ke bot');
  console.log('4. 🔍 Lihat logs di terminal Next.js');
  console.log('5. 📊 Cek apakah webhook endpoint menerima request');
  console.log('');
  console.log('🔧 TROUBLESHOOTING:');
  console.log('===================');
  console.log('• Jika webhook tidak menerima request: cek URL webhook di Telegram');
  console.log('• Jika bot tidak merespon: cek logs error di terminal');
  console.log('• Jika error 500: cek Firebase connection dan bot token');
  console.log('• Jika tidak ada log: webhook URL mungkin salah');
  console.log('');
  console.log('📱 CARA MENDAPATKAN CHAT ID:');
  console.log('============================');
  console.log('1. Kirim pesan ke bot');
  console.log('2. Buka: https://api.telegram.org/bot' + BOT_TOKEN + '/getUpdates');
  console.log('3. Lihat chat.id di response JSON');
  console.log('4. Ganti chatId di script ini dengan ID yang benar');
}

// Main execution
async function main() {
  console.log('🧪 Telegram Bot Webhook Test Suite');
  console.log('===================================\n');
  
  await testBotDirect();
  await testWebhook();
  showInstructions();
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('==============');
  console.log('1. Jalankan: node test-webhook-direct.js');
  console.log('2. Kirim pesan ke bot di Telegram');
  console.log('3. Monitor logs di terminal Next.js');
  console.log('4. Cek apakah bot membalas');
}

// Run the test
main().catch(console.error);
