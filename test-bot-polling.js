#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🧪 Testing Bot with Polling...\n');

let lastUpdateId = 0;

async function getUpdates() {
  try {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`,
      method: 'GET',
    };
    
    const updates = await makeRequest(options);
    
    if (updates.ok && updates.result.length > 0) {
      console.log('📨 Received', updates.result.length, 'updates');
      
      for (const update of updates.result) {
        lastUpdateId = update.update_id;
        
        if (update.message) {
          const message = update.message;
          const chatId = message.chat.id;
          const text = message.text;
          const username = message.from.username || message.from.first_name;
          
          console.log(`📱 Message from ${username} (${chatId}): ${text}`);
          
          // Process message
          await processMessage(chatId, text);
        }
      }
    }
    
    return updates;
  } catch (error) {
    console.error('❌ Error getting updates:', error);
    return null;
  }
}

async function processMessage(chatId, text) {
  try {
    let response = '';
    
    if (text === '/start') {
      response = '🤖 Selamat datang di Bot Platform!\n\nSaya siap membantu. Ketik /help untuk melihat daftar perintah.';
    } else if (text === '/help') {
      response = '📖 **Daftar Perintah:**\n\n/start - Memulai bot\n/help - Bantuan\n/translate <teks> - Terjemahan\n/todo - To-do list\n/quiz - Kuis\n/game - Permainan';
    } else if (text.toLowerCase().includes('halo') || text.toLowerCase().includes('hai')) {
      response = '👋 Halo! Senang bertemu dengan Anda!\n\nSaya siap membantu. Ketik /help untuk melihat daftar perintah.';
    } else if (text.toLowerCase().includes('terima kasih') || text.toLowerCase().includes('makasih')) {
      response = '😊 Sama-sama! Senang bisa membantu.';
    } else {
      response = `🤖 Terima kasih atas pesannya! Saya memahami bahwa Anda berkata: "${text}"\n\nSaya siap membantu dengan berbagai fitur. Coba ketik /help untuk melihat semua fitur.`;
    }
    
    // Send response
    await sendMessage(chatId, response);
    
  } catch (error) {
    console.error('❌ Error processing message:', error);
  }
}

async function sendMessage(chatId, text) {
  try {
    const postData = JSON.stringify({
      chat_id: chatId,
      text: text
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
    
    if (response.ok) {
      console.log('✅ Message sent successfully');
    } else {
      console.log('❌ Failed to send message:', response.description);
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error sending message:', error);
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
  console.log('\n📋 INSTRUKSI POLLING BOT:');
  console.log('==========================');
  console.log('');
  console.log('1. 🤖 Bot sedang berjalan dengan polling');
  console.log('2. 📱 Kirim pesan ke bot di Telegram');
  console.log('3. 🔄 Bot akan merespon secara real-time');
  console.log('4. ⏹️ Tekan Ctrl+C untuk berhenti');
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
  console.log('🚀 Starting bot polling...');
  showInstructions();
  
  // Polling loop
  while (true) {
    try {
      await getUpdates();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    } catch (error) {
      console.error('❌ Error in polling loop:', error);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds on error
    }
  }
}

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n👋 Stopping bot polling...');
  process.exit(0);
});

main();
