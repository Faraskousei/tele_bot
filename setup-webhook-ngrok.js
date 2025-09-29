#!/usr/bin/env node

const https = require('https');
const { spawn } = require('child_process');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';
const LOCAL_PORT = 3000;

console.log('🚀 Setting up Telegram Webhook with Ngrok...\n');

let ngrokProcess = null;

// Cleanup function
function cleanup() {
  console.log('\n🛑 Shutting down ngrok...');
  if (ngrokProcess) {
    ngrokProcess.kill();
    console.log('✅ Ngrok stopped');
  }
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

async function startNgrok() {
  return new Promise((resolve, reject) => {
    console.log('🌐 Starting ngrok tunnel...');
    
    ngrokProcess = spawn('ngrok', ['http', LOCAL_PORT.toString(), '--log=stdout'], {
      stdio: ['pipe', 'pipe', 'pipe']
    });
    
    let ngrokUrl = null;
    
    ngrokProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Ngrok:', output.trim());
      
      // Look for the tunnel URL
      const urlMatch = output.match(/https:\/\/[a-z0-9-]+\.ngrok\.io/);
      if (urlMatch && !ngrokUrl) {
        ngrokUrl = urlMatch[0];
        console.log('🎉 Ngrok tunnel ready:', ngrokUrl);
        resolve(ngrokUrl);
      }
    });
    
    ngrokProcess.stderr.on('data', (data) => {
      console.error('Ngrok error:', data.toString());
    });
    
    ngrokProcess.on('error', (error) => {
      console.error('❌ Failed to start ngrok:', error.message);
      reject(error);
    });
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (!ngrokUrl) {
        console.error('❌ Ngrok timeout - tidak dapat mendapatkan URL tunnel');
        reject(new Error('Ngrok timeout'));
      }
    }, 30000);
  });
}

async function setupWebhook(webhookUrl) {
  try {
    console.log('📡 Setting up webhook...');
    console.log('🔗 Webhook URL:', webhookUrl);
    
    const webhookApiUrl = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
    const postData = JSON.stringify({
      url: webhookUrl + '/api/telegram/webhook',
      max_connections: 100,
      allowed_updates: ['message', 'callback_query', 'inline_query'],
      drop_pending_updates: true
    });

    const response = await makeRequest(webhookApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);
    
    if (response.ok) {
      console.log('✅ Webhook berhasil di-setup!');
      return true;
    } else {
      console.error('❌ Gagal setup webhook:', response.description);
      return false;
    }

  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
    return false;
  }
}

async function testWebhook(webhookUrl) {
  try {
    console.log('🧪 Testing webhook...');
    
    const webhookInfoUrl = `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`;
    const response = await makeRequest(webhookInfoUrl);
    
    if (response.ok) {
      console.log('📊 Webhook Info:');
      console.log('   URL:', response.result.url);
      console.log('   Pending Updates:', response.result.pending_update_count);
      console.log('   Last Error Date:', response.result.last_error_date ? new Date(response.result.last_error_date * 1000) : 'None');
      console.log('   Last Error Message:', response.result.last_error_message || 'None');
      
      if (response.result.url === webhookUrl + '/api/telegram/webhook') {
        console.log('✅ Webhook URL sesuai!');
        return true;
      } else {
        console.log('⚠️  Webhook URL tidak sesuai');
        return false;
      }
    }

  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
    return false;
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

function showTestInstructions(webhookUrl) {
  console.log('\n🎉 WEBHOOK SETUP COMPLETE!');
  console.log('==========================\n');
  
  console.log('📊 Setup Summary:');
  console.log('   ✅ Next.js Server: http://localhost:' + LOCAL_PORT);
  console.log('   ✅ Ngrok Tunnel: ' + webhookUrl);
  console.log('   ✅ Telegram Webhook: ' + webhookUrl + '/api/telegram/webhook');
  console.log('   ✅ Real-time Bot: Ready');
  console.log('');
  
  console.log('📱 CARA TEST BOT REAL-TIME:');
  console.log('===========================');
  console.log('1. 📱 Buka Telegram dan cari @Backup_indBot');
  console.log('2. 💬 Kirim pesan berikut untuk test auto-reply:');
  console.log('');
  console.log('   • "halo" → Greeting response');
  console.log('   • "apa kabar?" → Question response');
  console.log('   • "terima kasih" → Thanks response');
  console.log('   • "jam berapa?" → Time response');
  console.log('   • "mau makan" → Food response');
  console.log('   • "film bagus" → Entertainment response');
  console.log('   • "kerja keras" → Work response');
  console.log('');
  console.log('3. 🎮 Test commands:');
  console.log('   • /start → Welcome message');
  console.log('   • /help → Help menu');
  console.log('   • /todo → Todo list');
  console.log('   • /game → Games');
  console.log('   • /movie Avatar → Movie info');
  console.log('');
  console.log('🔍 MONITORING:');
  console.log('==============');
  console.log('• Logs real-time akan muncul di terminal Next.js');
  console.log('• Web interface: http://localhost:' + LOCAL_PORT);
  console.log('• Test bot page: http://localhost:' + LOCAL_PORT + '/test-bot');
  console.log('• Dashboard: http://localhost:' + LOCAL_PORT + '/dashboard');
  console.log('');
  console.log('🛑 UNTUK BERHENTI:');
  console.log('==================');
  console.log('Tekan Ctrl+C untuk menghentikan ngrok tunnel');
  console.log('');
  console.log('🚨 TROUBLESHOOTING:');
  console.log('===================');
  console.log('• Jika bot tidak merespon: cek logs di terminal Next.js');
  console.log('• Jika error 500: cek Firebase connection');
  console.log('• Jika tidak ada log: webhook mungkin belum aktif');
  console.log('• Test manual: node test-webhook-direct.js');
  console.log('');
}

// Main execution
async function main() {
  try {
    console.log('🤖 Telegram Bot Webhook Setup');
    console.log('==============================\n');
    
    console.log('⚠️  PASTIKAN:');
    console.log('1. Next.js server sudah berjalan di http://localhost:' + LOCAL_PORT);
    console.log('2. Ngrok sudah terinstall (download dari https://ngrok.com/download)');
    console.log('');
    
    // Start ngrok tunnel
    const ngrokUrl = await startNgrok();
    
    // Wait a bit for ngrok to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Setup webhook
    const webhookOk = await setupWebhook(ngrokUrl);
    if (!webhookOk) {
      console.log('❌ Gagal setup webhook. Bot tidak akan menerima pesan real-time.');
      return;
    }
    
    // Test webhook
    await testWebhook(ngrokUrl);
    
    // Show instructions
    showTestInstructions(ngrokUrl);
    
    // Keep the process running
    console.log('🔄 Ngrok tunnel aktif... Press Ctrl+C to stop');
    
  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message);
    cleanup();
  }
}

// Run the setup
main().catch(console.error);
