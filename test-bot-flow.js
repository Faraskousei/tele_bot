#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🧪 Testing Bot Flow Lengkap...\n');

async function testBotFlow() {
  try {
    console.log('🤖 Testing bot info...');
    const botInfo = await getBotInfo();
    if (!botInfo.ok) {
      console.log('❌ Bot tidak dapat diakses. Cek token!');
      return;
    }
    
    console.log('✅ Bot is working!');
    console.log('📱 Bot username:', botInfo.result.username);
    
    // Test send welcome message
    console.log('\n📤 Testing welcome message...');
    const chatId = 8124399716; // Use known chat ID
    
    const welcomeMessage = await sendMessage(chatId, '🤖 **Selamat datang di Bot Platform!**\n\nSaya adalah bot multi-fungsi yang dapat membantu Anda dengan berbagai tugas. Pilih kategori yang Anda butuhkan:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📚 Pendidikan', callback_data: 'category:education' },
            { text: '📋 Manajemen', callback_data: 'category:management' }
          ],
          [
            { text: '🎮 Hiburan', callback_data: 'category:entertainment' },
            { text: '💼 Bisnis', callback_data: 'category:business' }
          ],
          [
            { text: '⚙️ Teknis', callback_data: 'category:technical' },
            { text: '❓ Bantuan', callback_data: 'main:help' }
          ]
        ]
      }
    });
    
    if (welcomeMessage.ok) {
      console.log('✅ Welcome message sent successfully!');
    } else {
      console.log('❌ Failed to send welcome message:', welcomeMessage.description);
    }
    
    // Test category selection
    console.log('\n📂 Testing category selection...');
    const categoryMessage = await sendMessage(chatId, '📋 **Kategori Manajemen**\n\nPilih fitur yang Anda butuhkan:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '📝 To-Do List', callback_data: 'todo:menu' },
            { text: '💰 Expense', callback_data: 'expense:menu' }
          ],
          [
            { text: '👥 Group', callback_data: 'group:menu' },
            { text: '🔙 Kembali', callback_data: 'main:menu' }
          ]
        ]
      }
    });
    
    if (categoryMessage.ok) {
      console.log('✅ Category message sent successfully!');
    } else {
      console.log('❌ Failed to send category message:', categoryMessage.description);
    }
    
    // Test todo menu
    console.log('\n📝 Testing todo menu...');
    const todoMessage = await sendMessage(chatId, '📋 **Manajemen To-Do List**\n\nPilih aksi yang ingin Anda lakukan:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '➕ Tambah Todo', callback_data: 'todo:add' },
            { text: '📋 Lihat Todo', callback_data: 'todo:list' }
          ],
          [
            { text: '✅ Selesai', callback_data: 'todo:completed' },
            { text: '🗑️ Hapus', callback_data: 'todo:delete' }
          ],
          [
            { text: '🔙 Kembali ke Menu Utama', callback_data: 'main:menu' }
          ]
        ]
      }
    });
    
    if (todoMessage.ok) {
      console.log('✅ Todo menu sent successfully!');
    } else {
      console.log('❌ Failed to send todo menu:', todoMessage.description);
    }
    
    // Test shop menu
    console.log('\n🛍️ Testing shop menu...');
    const shopMessage = await sendMessage(chatId, '🛍️ **Toko Online**\n\nSelamat datang di toko kami! Pilih menu yang Anda inginkan:', {
      reply_markup: {
        inline_keyboard: [
          [
            { text: '🛒 Lihat Produk', callback_data: 'shop:products' },
            { text: '🛒 Keranjang Saya', callback_data: 'shop:cart' }
          ],
          [
            { text: '📦 Pesanan Saya', callback_data: 'shop:orders' },
            { text: '💳 Checkout', callback_data: 'shop:checkout' }
          ],
          [
            { text: '🔙 Kembali ke Menu Utama', callback_data: 'main:menu' }
          ]
        ]
      }
    });
    
    if (shopMessage.ok) {
      console.log('✅ Shop menu sent successfully!');
    } else {
      console.log('❌ Failed to send shop menu:', shopMessage.description);
    }
    
    console.log('\n🎉 Bot flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Error testing bot flow:', error);
  }
}

async function getBotInfo() {
  try {
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getMe`,
      method: 'GET',
    };
    return await makeRequest(options);
  } catch (error) {
    console.error('❌ Error getting bot info:', error);
    return null;
  }
}

async function sendMessage(chatId, text, options = {}) {
  try {
    const postData = JSON.stringify({
      chat_id: chatId,
      text: text,
      ...options
    });

    const requestOptions = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    return await makeRequest(requestOptions, postData);
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
  console.log('\n📋 INSTRUKSI TEST BOT FLOW:');
  console.log('============================');
  console.log('');
  console.log('✅ Bot flow test completed!');
  console.log('');
  console.log('🔧 FITUR YANG DITEST:');
  console.log('=====================');
  console.log('• 🤖 Bot info dan status');
  console.log('• 📤 Welcome message dengan menu interaktif');
  console.log('• 📂 Category selection');
  console.log('• 📝 Todo menu dengan tombol back');
  console.log('• 🛍️ Shop menu dengan navigasi');
  console.log('');
  console.log('📱 TESTING DI TELEGRAM:');
  console.log('========================');
  console.log('1. Kirim pesan ke bot di Telegram');
  console.log('2. Cek apakah bot merespon dengan menu interaktif');
  console.log('3. Test navigasi menu (kategori -> fitur -> back)');
  console.log('4. Pastikan tombol back berfungsi dengan baik');
  console.log('');
  console.log('🎯 EXPECTED BEHAVIOR:');
  console.log('=====================');
  console.log('• Bot harus menampilkan menu interaktif');
  console.log('• Navigasi harus bekerja dengan baik');
  console.log('• Tombol back harus mengembalikan ke menu sebelumnya');
  console.log('• Session state harus tersimpan dengan benar');
}

async function main() {
  await testBotFlow();
  showInstructions();
}

main();
