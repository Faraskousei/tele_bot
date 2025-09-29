#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🧪 Testing Bot Simple...\n');

async function testBot() {
  try {
    console.log('🤖 Testing bot info...');
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getMe`,
      method: 'GET',
    };
    const botInfo = await makeRequest(options);
    console.log('✅ Bot Info:', botInfo);
    
    if (!botInfo.ok) {
      console.log('❌ Bot tidak dapat diakses. Cek token!');
      return;
    }
    
    console.log('✅ Bot is working!');
    console.log('📱 Bot username:', botInfo.result.username);
    console.log('📝 Bot name:', botInfo.result.first_name);
    
    // Test get updates
    console.log('\n📨 Testing get updates...');
    const updatesOptions = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getUpdates`,
      method: 'GET',
    };
    const updates = await makeRequest(updatesOptions);
    console.log('✅ Updates:', updates);
    
    if (updates.ok && updates.result.length > 0) {
      console.log('📱 Found', updates.result.length, 'updates');
      const lastUpdate = updates.result[updates.result.length - 1];
      if (lastUpdate.message) {
        const chatId = lastUpdate.message.chat.id;
        console.log('📱 Last chatId:', chatId);
        
        // Test send message
        console.log('\n📤 Testing send message...');
        const sendData = JSON.stringify({
          chat_id: chatId,
          text: '🧪 Test message dari script!\n\nBot sedang berfungsi dengan baik.'
        });

        const sendOptions = {
          hostname: 'api.telegram.org',
          path: `/bot${BOT_TOKEN}/sendMessage`,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(sendData),
          },
        };

        const sendResponse = await makeRequest(sendOptions, sendData);
        console.log('✅ Send message response:', sendResponse);
        
        if (sendResponse.ok) {
          console.log('🎉 Message sent successfully!');
        } else {
          console.log('❌ Failed to send message:', sendResponse.description);
        }
      }
    } else {
      console.log('📭 No updates found. Kirim pesan ke bot terlebih dahulu.');
    }
    
  } catch (error) {
    console.error('❌ Error testing bot:', error);
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
  console.log('\n📋 INSTRUKSI TESTING:');
  console.log('=====================');
  console.log('');
  console.log('1. 🤖 Bot info sudah di-test');
  console.log('2. 📨 Updates sudah di-check');
  console.log('3. 📤 Message sudah di-test');
  console.log('');
  console.log('🔧 TROUBLESHOOTING:');
  console.log('===================');
  console.log('• Jika bot tidak merespon: cek bot token');
  console.log('• Jika error 401: bot token salah');
  console.log('• Jika error 403: bot diblokir user');
  console.log('• Jika error 400: chat tidak ditemukan');
  console.log('');
  console.log('📱 NEXT STEPS:');
  console.log('==============');
  console.log('1. Kirim pesan ke bot di Telegram');
  console.log('2. Cek apakah bot merespon');
  console.log('3. Jika tidak merespon, cek bot token');
  console.log('4. Jika masih error, cek bot permissions');
}

async function main() {
  await testBot();
  showInstructions();
}

main();
