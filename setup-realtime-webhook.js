#!/usr/bin/env node

const https = require('https');
const http = require('http');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';
const BOT_USERNAME = '@your_bot_username'; // Ganti dengan username bot Anda

// Webhook URL - Ganti dengan URL ngrok atau hosting Anda
const WEBHOOK_URL = 'https://your-ngrok-url.ngrok.io/api/telegram/webhook';

console.log('🚀 Setting up Telegram Bot Real-time Webhook...\n');

async function setupWebhook() {
  try {
    console.log('📡 Setting up webhook...');
    console.log('🔗 Webhook URL:', WEBHOOK_URL);
    
    const webhookUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
    const postData = JSON.stringify({
      url: WEBHOOK_URL,
      max_connections: 100,
      allowed_updates: ['message', 'callback_query', 'inline_query'],
      drop_pending_updates: true
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await makeRequest(webhookUrl, options, postData);
    console.log('✅ Webhook setup response:', response);

    if (response.ok) {
      console.log('🎉 Webhook berhasil di-setup!');
      console.log('📝 Bot sekarang akan menerima pesan secara real-time');
      
      // Set bot commands
      await setBotCommands();
      
      // Test webhook
      await testWebhook();
      
    } else {
      console.error('❌ Gagal setup webhook:', response.description);
    }

  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
  }
}

async function setBotCommands() {
  try {
    console.log('\n📋 Setting up bot commands...');
    
    const commands = [
      { command: 'start', description: 'Memulai bot dan melihat menu utama' },
      { command: 'help', description: 'Menampilkan daftar semua perintah yang tersedia' },
      { command: 'translate', description: 'Terjemahkan teks ke bahasa Indonesia' },
      { command: 'todo', description: 'Kelola daftar tugas pribadi' },
      { command: 'quiz', description: 'Mulai kuis interaktif' },
      { command: 'game', description: 'Mainkan permainan sederhana' },
      { command: 'movie', description: 'Cari informasi film dari TMDB' },
      { command: 'shop', description: 'Akses toko online' },
      { command: 'monitor', description: 'Lihat status server monitoring' }
    ];

    const commandsUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`;
    const postData = JSON.stringify({ commands });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const response = await makeRequest(commandsUrl, options, postData);
    
    if (response.ok) {
      console.log('✅ Bot commands berhasil di-setup!');
    } else {
      console.error('❌ Gagal setup commands:', response.description);
    }

  } catch (error) {
    console.error('❌ Error setting up commands:', error.message);
  }
}

async function testWebhook() {
  try {
    console.log('\n🧪 Testing webhook...');
    
    const webhookInfoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`;
    const response = await makeRequest(webhookInfoUrl);
    
    if (response.ok) {
      console.log('📊 Webhook Info:');
      console.log('   URL:', response.result.url);
      console.log('   Pending Updates:', response.result.pending_update_count);
      console.log('   Last Error Date:', response.result.last_error_date ? new Date(response.result.last_error_date * 1000) : 'None');
      console.log('   Last Error Message:', response.result.last_error_message || 'None');
      
      if (response.result.url === WEBHOOK_URL) {
        console.log('✅ Webhook URL sesuai dengan yang di-setup!');
      } else {
        console.log('⚠️  Webhook URL tidak sesuai. Pastikan menggunakan URL yang benar.');
      }
    }

  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
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

// Test bot dengan mengirim pesan
async function testBot() {
  try {
    console.log('\n🤖 Testing bot functionality...');
    
    // Get bot info
    const botInfoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getMe`;
    const botInfo = await makeRequest(botInfoUrl);
    
    if (botInfo.ok) {
      console.log('✅ Bot Info:');
      console.log('   Username:', '@' + botInfo.result.username);
      console.log('   First Name:', botInfo.result.first_name);
      console.log('   ID:', botInfo.result.id);
      console.log('   Can Join Groups:', botInfo.result.can_join_groups ? 'Yes' : 'No');
      console.log('   Can Read All Group Messages:', botInfo.result.can_read_all_group_messages ? 'Yes' : 'No');
    }

  } catch (error) {
    console.error('❌ Error testing bot:', error.message);
  }
}

// Instructions untuk setup ngrok
function showNgrokInstructions() {
  console.log('\n📋 INSTRUKSI SETUP NGROK (untuk testing lokal):');
  console.log('1. Download ngrok dari https://ngrok.com/download');
  console.log('2. Install dan jalankan: ngrok http 3000');
  console.log('3. Copy URL HTTPS yang diberikan (contoh: https://abc123.ngrok.io)');
  console.log('4. Update WEBHOOK_URL di script ini dengan URL ngrok');
  console.log('5. Jalankan script ini lagi');
  console.log('\n📋 ATAU untuk production:');
  console.log('1. Deploy aplikasi ke hosting (Vercel, Netlify, dll)');
  console.log('2. Update WEBHOOK_URL dengan URL production');
  console.log('3. Pastikan aplikasi berjalan di port yang benar');
}

// Main execution
async function main() {
  console.log('🤖 Telegram Bot Real-time Setup');
  console.log('================================\n');
  
  if (WEBHOOK_URL.includes('your-ngrok-url')) {
    console.log('⚠️  PERINGATAN: Webhook URL belum dikonfigurasi!');
    showNgrokInstructions();
    return;
  }
  
  await setupWebhook();
  await testBot();
  
  console.log('\n🎉 Setup selesai!');
  console.log('\n📱 Cara test bot:');
  console.log('1. Buka Telegram dan cari bot Anda');
  console.log('2. Kirim pesan apapun (contoh: "halo", "apa kabar?", "terima kasih")');
  console.log('3. Bot akan membalas secara real-time');
  console.log('4. Coba perintah seperti /start, /help, /todo');
  console.log('\n🔍 Monitor logs di terminal untuk melihat aktivitas real-time');
}

// Run the setup
main().catch(console.error);
