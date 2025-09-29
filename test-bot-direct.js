#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🧪 Testing Bot Directly...\n');

async function getBotInfo() {
  try {
    console.log('🤖 Getting bot info...');
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getMe`,
      method: 'GET',
    };
    const botInfo = await makeRequest(options);
    console.log('✅ Bot Info:', botInfo);
    
    if (botInfo.ok) {
      console.log('✅ Bot is accessible and working');
      console.log('📱 Bot username:', botInfo.result.username);
      console.log('📝 Bot name:', botInfo.result.first_name);
    } else {
      console.log('❌ Bot is not accessible or not working');
    }
    return botInfo;
  } catch (error) {
    console.error('❌ Error getting bot info:', error.message);
    return null;
  }
}

async function getUpdates() {
  try {
    console.log('\n📨 Getting updates...');
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getUpdates`,
      method: 'GET',
    };
    const updates = await makeRequest(options);
    console.log('✅ Updates:', updates);
    
    if (updates.ok && updates.result.length > 0) {
      console.log('📱 Found', updates.result.length, 'updates');
      updates.result.forEach((update, index) => {
        if (update.message) {
          console.log(`📨 Update ${index + 1}:`, {
            chatId: update.message.chat.id,
            userId: update.message.from.id,
            text: update.message.text,
            username: update.message.from.username,
            firstName: update.message.from.first_name
          });
        }
      });
    } else {
      console.log('📭 No updates found');
    }
    return updates;
  } catch (error) {
    console.error('❌ Error getting updates:', error.message);
    return null;
  }
}

async function sendTestMessage(chatId) {
  try {
    console.log(`\n📤 Sending test message to chatId: ${chatId}`);
    
    const postData = JSON.stringify({
      chat_id: chatId,
      text: '🧪 Test message dari script langsung!\n\nBot sedang berfungsi dengan baik. Ketik /help untuk melihat daftar perintah.'
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
    
    if (response.ok) {
      console.log('🎉 Message sent successfully!');
    } else {
      console.log('❌ Failed to send message:', response.description);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error sending message:', error.message);
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
  console.log('\n📋 INSTRUKSI TESTING BOT:');
  console.log('==========================');
  console.log('');
  console.log('1. 🤖 Pastikan bot token benar');
  console.log('2. 📱 Kirim pesan ke bot di Telegram');
  console.log('3. 🔄 Jalankan script ini untuk cek updates');
  console.log('4. 📤 Test kirim pesan langsung');
  console.log('');
  console.log('🔧 TROUBLESHOOTING:');
  console.log('===================');
  console.log('• Jika bot tidak merespon: cek bot token');
  console.log('• Jika error 401: bot token salah');
  console.log('• Jika error 403: bot diblokir user');
  console.log('• Jika error 400: chat tidak ditemukan');
  console.log('');
  console.log('📱 CARA MENDAPATKAN CHAT ID:');
  console.log('============================');
  console.log('1. Kirim pesan ke bot');
  console.log('2. Jalankan script ini');
  console.log('3. Lihat chatId di output');
  console.log('4. Gunakan chatId untuk test');
}

async function main() {
  // Test bot info
  const botInfo = await getBotInfo();
  if (!botInfo || !botInfo.ok) {
    console.log('❌ Bot tidak dapat diakses. Cek token!');
    return;
  }

  // Get updates to find chat IDs
  const updates = await getUpdates();
  if (updates && updates.ok && updates.result.length > 0) {
    const lastUpdate = updates.result[updates.result.length - 1];
    if (lastUpdate.message) {
      const chatId = lastUpdate.message.chat.id;
      console.log(`\n📱 Found chatId: ${chatId}`);
      
      // Test send message
      await sendTestMessage(chatId);
    }
  } else {
    console.log('\n📭 Tidak ada updates. Kirim pesan ke bot terlebih dahulu.');
  }

  showInstructions();
}

main();
