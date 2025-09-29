#!/usr/bin/env node

const https = require('https');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';
const VERCEL_DOMAIN = 'grambotele.vercel.app';
const WEBHOOK_URL = `https://${VERCEL_DOMAIN}/api/telegram/webhook`;

console.log('🚀 Setting up Vercel Webhook for Telegram Bot...\n');
console.log('🌐 Domain:', VERCEL_DOMAIN);
console.log('🔗 Webhook URL:', WEBHOOK_URL);

async function deleteWebhook() {
  try {
    console.log('🗑️ Deleting existing webhook...');
    
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

async function setWebhook() {
  try {
    console.log('🔧 Setting webhook URL...');
    
    const postData = JSON.stringify({
      url: WEBHOOK_URL,
      allowed_updates: ['message', 'callback_query'],
      drop_pending_updates: true
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

async function testWebhook() {
  try {
    console.log('🧪 Testing webhook endpoint...');
    
    const testData = {
      update_id: 999999999,
      message: {
        message_id: 1,
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
        text: '/start'
      }
    };

    const postData = JSON.stringify(testData);

    const options = {
      hostname: VERCEL_DOMAIN,
      path: '/api/telegram/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    console.log('✅ Webhook test response:', response);
    return response;
  } catch (error) {
    console.error('❌ Error testing webhook:', error);
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
  console.log('\n📋 INSTRUKSI SETUP VERCEL WEBHOOK:');
  console.log('====================================');
  console.log('');
  console.log('✅ Webhook sudah dikonfigurasi!');
  console.log('');
  console.log('🔧 LANGKAH SELANJUTNYA:');
  console.log('=======================');
  console.log('1. Deploy aplikasi ke Vercel');
  console.log('2. Set environment variables di Vercel');
  console.log('3. Test bot di production');
  console.log('');
  console.log('🌐 VERCEL DEPLOYMENT:');
  console.log('=====================');
  console.log('1. Push code ke GitHub');
  console.log('2. Connect repository ke Vercel');
  console.log('3. Set environment variables:');
  console.log('   - TELEGRAM_BOT_TOKEN');
  console.log('   - NEXT_PUBLIC_FIREBASE_API_KEY');
  console.log('   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN');
  console.log('   - NEXT_PUBLIC_FIREBASE_PROJECT_ID');
  console.log('   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET');
  console.log('   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID');
  console.log('   - NEXT_PUBLIC_FIREBASE_APP_ID');
  console.log('');
  console.log('🧪 TESTING:');
  console.log('===========');
  console.log('1. Kirim pesan ke bot di Telegram');
  console.log('2. Cek apakah bot merespon real-time');
  console.log('3. Test fitur-fitur bot');
  console.log('');
  console.log('🔗 WEBHOOK URL:');
  console.log('===============');
  console.log(`https://${VERCEL_DOMAIN}/api/telegram/webhook`);
}

async function main() {
  // Delete existing webhook
  await deleteWebhook();
  
  // Set new webhook
  const setResult = await setWebhook();
  
  if (setResult && setResult.ok) {
    console.log('✅ Webhook berhasil diset!');
  } else {
    console.log('❌ Gagal set webhook:', setResult?.description);
  }
  
  // Get webhook info
  await getWebhookInfo();
  
  showInstructions();
}

main();
