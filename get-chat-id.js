#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🔍 Getting Chat ID from Bot Updates...\n');

async function getUpdates() {
  try {
    console.log('📡 Fetching bot updates...');
    
    const updatesUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`;
    const response = await makeRequest(updatesUrl);
    
    if (response.ok && response.result.length > 0) {
      console.log('✅ Found updates!');
      console.log('📊 Total updates:', response.result.length);
      console.log('');
      
      response.result.forEach((update, index) => {
        if (update.message) {
          console.log(`📨 Update ${index + 1}:`);
          console.log(`   Chat ID: ${update.message.chat.id}`);
          console.log(`   User: ${update.message.from.first_name} ${update.message.from.last_name || ''}`);
          console.log(`   Username: @${update.message.from.username || 'N/A'}`);
          console.log(`   Message: "${update.message.text || 'N/A'}"`);
          console.log(`   Date: ${new Date(update.message.date * 1000).toLocaleString()}`);
          console.log('');
        }
      });
      
      // Get unique chat IDs
      const chatIds = [...new Set(response.result
        .filter(u => u.message)
        .map(u => u.message.chat.id)
      )];
      
      console.log('🎯 Unique Chat IDs:');
      chatIds.forEach((chatId, index) => {
        console.log(`   ${index + 1}. ${chatId}`);
      });
      
      return chatIds;
      
    } else if (response.ok && response.result.length === 0) {
      console.log('⚠️  No updates found.');
      console.log('💡 Kirim pesan ke bot terlebih dahulu, lalu jalankan script ini lagi.');
      return [];
    } else {
      console.log('❌ Error getting updates:', response.description);
      return [];
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    return [];
  }
}

async function testSendMessage(chatId) {
  try {
    console.log(`\n📤 Testing send message to chat ID: ${chatId}`);
    
    const sendMessageUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const postData = JSON.stringify({
      chat_id: chatId,
      text: '🧪 Test message berhasil! Bot real-time sudah berfungsi.'
    });

    const response = await makeRequest(sendMessageUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);
    
    if (response.ok) {
      console.log('✅ Message sent successfully!');
      console.log('📝 Message ID:', response.result.message_id);
    } else {
      console.log('❌ Failed to send message:', response.description);
    }

  } catch (error) {
    console.error('❌ Error sending message:', error.message);
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
          reject(new Error('Invalid JSON response: ' + data));
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
  console.log('\n📋 CARA MENGGUNAKAN:');
  console.log('====================');
  console.log('');
  console.log('1. 📱 Buka Telegram dan cari bot @Backup_indBot');
  console.log('2. 💬 Kirim pesan apapun ke bot (contoh: "halo", "/start")');
  console.log('3. 🔄 Jalankan script ini lagi: node get-chat-id.js');
  console.log('4. 📊 Copy Chat ID yang muncul');
  console.log('5. 🧪 Test kirim pesan dengan Chat ID tersebut');
  console.log('');
  console.log('🔧 TROUBLESHOOTING:');
  console.log('===================');
  console.log('• Jika tidak ada updates: pastikan sudah kirim pesan ke bot');
  console.log('• Jika error 401: cek bot token');
  console.log('• Jika bot tidak ditemukan: cek username @Backup_indBot');
  console.log('');
  console.log('📱 BOT INFO:');
  console.log('============');
  console.log('• Username: @Backup_indBot');
  console.log('• Name: Backup Data');
  console.log('• Token: 8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw');
}

// Main execution
async function main() {
  console.log('🔍 Telegram Bot Chat ID Finder');
  console.log('==============================\n');
  
  const chatIds = await getUpdates();
  
  if (chatIds.length > 0) {
    console.log('\n🧪 Testing message sending...');
    for (const chatId of chatIds.slice(0, 3)) { // Test first 3 chat IDs
      await testSendMessage(chatId);
    }
  }
  
  showInstructions();
  
  console.log('\n🎯 NEXT STEPS:');
  console.log('==============');
  console.log('1. Gunakan Chat ID yang ditemukan untuk test webhook');
  console.log('2. Update test-webhook-direct.js dengan Chat ID yang benar');
  console.log('3. Test webhook endpoint dengan Chat ID yang valid');
  console.log('4. Monitor logs di terminal Next.js saat mengirim pesan');
}

// Run the script
main().catch(console.error);
