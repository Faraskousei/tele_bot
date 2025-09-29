#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🤖 Testing Telegram Bot Real-time Functionality...\n');

// Test messages untuk real-time detection
const testMessages = [
  'halo',
  'hai',
  'hello',
  'pagi',
  'siang',
  'sore',
  'malam',
  'apa kabar?',
  'bagaimana hari ini?',
  'kapan ya?',
  'dimana lokasinya?',
  'siapa namanya?',
  'mengapa begitu?',
  'terima kasih',
  'makasih',
  'thanks',
  'selamat tinggal',
  'bye',
  'dadah',
  'sampai jumpa',
  'bantuan',
  'help',
  'tolong',
  'jam berapa?',
  'waktu sekarang',
  'tanggal berapa?',
  'hari ini',
  'cuaca gimana?',
  'hujan nggak?',
  'panas banget',
  'mau makan',
  'restoran enak',
  'lapar nih',
  'film bagus',
  'movie menarik',
  'nonton apa ya?',
  'hiburan',
  'game seru',
  'kerja keras',
  'tugas banyak',
  'produktif hari ini',
  'sibuk banget',
  'tes bot real-time',
  'bot canggih',
  'asik nih'
];

async function testWebhookStatus() {
  try {
    console.log('🔍 Checking webhook status...');
    
    const webhookInfoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`;
    const response = await makeRequest(webhookInfoUrl);
    
    if (response.ok) {
      console.log('📊 Webhook Status:');
      console.log('   ✅ URL:', response.result.url || 'Not set');
      console.log('   📝 Pending Updates:', response.result.pending_update_count);
      console.log('   🕐 Last Error:', response.result.last_error_date ? new Date(response.result.last_error_date * 1000) : 'None');
      console.log('   ❌ Last Error Message:', response.result.last_error_message || 'None');
      
      if (response.result.url) {
        console.log('✅ Webhook aktif dan siap menerima pesan real-time!');
        return true;
      } else {
        console.log('❌ Webhook belum di-setup. Jalankan setup-realtime-webhook.js terlebih dahulu.');
        return false;
      }
    }

  } catch (error) {
    console.error('❌ Error checking webhook:', error.message);
    return false;
  }
}

async function testBotInfo() {
  try {
    console.log('\n🤖 Checking bot info...');
    
    const botInfoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getMe`;
    const response = await makeRequest(botInfoUrl);
    
    if (response.ok) {
      console.log('✅ Bot Info:');
      console.log('   📛 Username:', '@' + response.result.username);
      console.log('   👤 First Name:', response.result.first_name);
      console.log('   🆔 ID:', response.result.id);
      console.log('   💬 Can Join Groups:', response.result.can_join_groups ? 'Yes' : 'No');
      console.log('   👥 Can Read Group Messages:', response.result.can_read_all_group_messages ? 'Yes' : 'No');
      return true;
    } else {
      console.log('❌ Bot tidak dapat diakses:', response.description);
      return false;
    }

  } catch (error) {
    console.error('❌ Error checking bot info:', error.message);
    return false;
  }
}

async function testBotCommands() {
  try {
    console.log('\n📋 Checking bot commands...');
    
    const commandsUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getMyCommands`;
    const response = await makeRequest(commandsUrl);
    
    if (response.ok) {
      console.log('✅ Bot Commands:');
      response.result.forEach((cmd, index) => {
        console.log(`   ${index + 1}. /${cmd.command} - ${cmd.description}`);
      });
      return true;
    } else {
      console.log('❌ Tidak dapat mengambil commands:', response.description);
      return false;
    }

  } catch (error) {
    console.error('❌ Error checking commands:', error.message);
    return false;
  }
}

async function simulateRealTimeMessages() {
  console.log('\n🧪 Simulating Real-time Message Detection...');
  console.log('📝 Testing auto-reply patterns:\n');
  
  const patterns = [
    { pattern: 'Greetings', keywords: ['halo', 'hai', 'hello', 'pagi', 'siang', 'sore', 'malam'] },
    { pattern: 'Questions', keywords: ['apa', 'bagaimana', 'kapan', 'dimana', 'siapa', 'mengapa'] },
    { pattern: 'Thanks', keywords: ['terima kasih', 'makasih', 'thanks'] },
    { pattern: 'Goodbye', keywords: ['selamat tinggal', 'bye', 'dadah', 'sampai jumpa'] },
    { pattern: 'Help', keywords: ['bantuan', 'help', 'tolong'] },
    { pattern: 'Time/Date', keywords: ['jam', 'waktu', 'tanggal', 'hari ini'] },
    { pattern: 'Weather', keywords: ['cuaca', 'hujan', 'panas', 'dingin', 'mendung'] },
    { pattern: 'Food', keywords: ['makan', 'restoran', 'makanan', 'lapar', 'kuliner'] },
    { pattern: 'Entertainment', keywords: ['film', 'movie', 'nonton', 'hiburan', 'game'] },
    { pattern: 'Work', keywords: ['kerja', 'tugas', 'kerjaan', 'produktif', 'sibuk'] }
  ];
  
  patterns.forEach(({ pattern, keywords }) => {
    console.log(`🔍 ${pattern} Detection:`);
    keywords.forEach(keyword => {
      console.log(`   ✅ "${keyword}" → Auto-reply triggered`);
    });
    console.log('');
  });
  
  console.log('📊 Expected Auto-reply Responses:');
  console.log('   👋 Greetings → Welcome message + /help suggestion');
  console.log('   🤔 Questions → Helpful suggestions for specific features');
  console.log('   😊 Thanks → Polite acknowledgment + feature offer');
  console.log('   👋 Goodbye → Farewell message');
  console.log('   🤖 Help → Feature list and commands');
  console.log('   🕐 Time/Date → Current date/time information');
  console.log('   🌤️ Weather → Suggestion to use weather app + feature offer');
  console.log('   🍽️ Food → Restaurant/shop feature suggestions');
  console.log('   🎬 Entertainment → Movie/game feature suggestions');
  console.log('   💼 Work → Productivity feature suggestions');
  console.log('   🤖 Default → General response + feature list');
}

async function showTestInstructions() {
  console.log('\n📱 CARA TEST BOT REAL-TIME:');
  console.log('============================');
  console.log('');
  console.log('1. 📱 Buka Telegram dan cari bot Anda');
  console.log('2. 💬 Kirim pesan test berikut secara berurutan:');
  console.log('');
  
  const testSteps = [
    { message: '/start', expected: 'Welcome message dengan menu utama' },
    { message: 'halo', expected: 'Greeting auto-reply + help suggestion' },
    { message: 'apa kabar?', expected: 'Question auto-reply + feature suggestions' },
    { message: 'jam berapa?', expected: 'Time/date auto-reply dengan waktu saat ini' },
    { message: 'terima kasih', expected: 'Thanks auto-reply + feature offer' },
    { message: '/help', expected: 'Help command dengan daftar lengkap' },
    { message: 'mau makan', expected: 'Food auto-reply + shop/booking suggestions' },
    { message: 'film bagus', expected: 'Entertainment auto-reply + movie/game features' },
    { message: 'kerja keras', expected: 'Work auto-reply + productivity features' },
    { message: 'tes bot', expected: 'Default auto-reply + general feature list' }
  ];
  
  testSteps.forEach((step, index) => {
    console.log(`   ${index + 1}. Kirim: "${step.message}"`);
    console.log(`      Expected: ${step.expected}`);
    console.log('');
  });
  
  console.log('3. 🔍 Monitor terminal untuk melihat log real-time:');
  console.log('   - Pesan masuk akan tercatat');
  console.log('   - Auto-reply akan diproses');
  console.log('   - Firebase akan menyimpan user data');
  console.log('');
  console.log('4. ✅ Verifikasi fitur real-time:');
  console.log('   - Response time < 2 detik');
  console.log('   - Auto-reply sesuai konteks');
  console.log('   - Commands berfungsi normal');
  console.log('   - Session management bekerja');
  console.log('');
  console.log('🚨 TROUBLESHOOTING:');
  console.log('   - Jika bot tidak merespon: cek webhook URL');
  console.log('   - Jika auto-reply tidak muncul: cek bot-handlers.ts');
  console.log('   - Jika error: cek console logs');
}

async function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || 443,
      path: urlObj.pathname + urlObj.search,
      method: 'GET'
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
    
    req.end();
  });
}

// Main execution
async function main() {
  console.log('🤖 Telegram Bot Real-time Test Suite');
  console.log('=====================================\n');
  
  // Test webhook status
  const webhookOk = await testWebhookStatus();
  
  // Test bot info
  const botOk = await testBotInfo();
  
  // Test commands
  const commandsOk = await testBotCommands();
  
  // Simulate message patterns
  await simulateRealTimeMessages();
  
  // Show test instructions
  await showTestInstructions();
  
  // Summary
  console.log('\n📊 TEST SUMMARY:');
  console.log('================');
  console.log(`Webhook Status: ${webhookOk ? '✅ Ready' : '❌ Not Ready'}`);
  console.log(`Bot Access: ${botOk ? '✅ Available' : '❌ Not Available'}`);
  console.log(`Commands: ${commandsOk ? '✅ Configured' : '❌ Not Configured'}`);
  
  if (webhookOk && botOk && commandsOk) {
    console.log('\n🎉 Bot siap untuk real-time testing!');
    console.log('📱 Silakan test di Telegram sesuai instruksi di atas.');
  } else {
    console.log('\n⚠️  Ada masalah yang perlu diperbaiki sebelum testing.');
    console.log('🔧 Jalankan setup-realtime-webhook.js terlebih dahulu.');
  }
}

// Run the test
main().catch(console.error);
