#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const https = require('https');
const fs = require('fs');
const path = require('path');

// Bot configuration
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';
const LOCAL_PORT = 3000;

console.log('🚀 Starting Telegram Bot Real-time System...\n');

let ngrokProcess = null;
let nextProcess = null;

// Cleanup function
function cleanup() {
  console.log('\n🛑 Shutting down services...');
  
  if (ngrokProcess) {
    ngrokProcess.kill();
    console.log('✅ Ngrok stopped');
  }
  
  if (nextProcess) {
    nextProcess.kill();
    console.log('✅ Next.js stopped');
  }
  
  process.exit(0);
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

async function checkNgrokInstalled() {
  return new Promise((resolve) => {
    exec('ngrok version', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Ngrok tidak terinstall atau tidak ada di PATH');
        console.log('📥 Download dari: https://ngrok.com/download');
        console.log('💡 Atau install via npm: npm install -g ngrok');
        resolve(false);
      } else {
        console.log('✅ Ngrok terinstall:', stdout.trim());
        resolve(true);
      }
    });
  });
}

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

async function startNextJS() {
  return new Promise((resolve, reject) => {
    console.log('⚡ Starting Next.js development server...');
    
    nextProcess = spawn('npm', ['run', 'dev'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });
    
    let nextReady = false;
    
    nextProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log('Next.js:', output.trim());
      
      if (output.includes('Ready in') && !nextReady) {
        nextReady = true;
        console.log('✅ Next.js server ready');
        resolve();
      }
    });
    
    nextProcess.stderr.on('data', (data) => {
      console.error('Next.js error:', data.toString());
    });
    
    nextProcess.on('error', (error) => {
      console.error('❌ Failed to start Next.js:', error.message);
      reject(error);
    });
    
    // Timeout after 60 seconds
    setTimeout(() => {
      if (!nextReady) {
        console.error('❌ Next.js timeout - server tidak dapat dimulai');
        reject(new Error('Next.js timeout'));
      }
    }, 60000);
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

async function setBotCommands() {
  try {
    console.log('📋 Setting up bot commands...');
    
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

    const response = await makeRequest(commandsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    }, postData);
    
    if (response.ok) {
      console.log('✅ Bot commands berhasil di-setup!');
      return true;
    } else {
      console.error('❌ Gagal setup commands:', response.description);
      return false;
    }

  } catch (error) {
    console.error('❌ Error setting up commands:', error.message);
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
  console.log('\n🎉 BOT REAL-TIME SYSTEM READY!');
  console.log('================================\n');
  
  console.log('📊 System Status:');
  console.log('   ✅ Next.js Server: Running on http://localhost:' + LOCAL_PORT);
  console.log('   ✅ Ngrok Tunnel: ' + webhookUrl);
  console.log('   ✅ Telegram Webhook: ' + webhookUrl + '/api/telegram/webhook');
  console.log('   ✅ Real-time Auto-reply: Active');
  console.log('');
  
  console.log('📱 CARA TEST BOT:');
  console.log('================');
  console.log('1. 📱 Buka Telegram dan cari bot Anda');
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
  console.log('• Logs real-time akan muncul di terminal ini');
  console.log('• Web interface: http://localhost:' + LOCAL_PORT);
  console.log('• Test bot page: http://localhost:' + LOCAL_PORT + '/test-bot');
  console.log('• Dashboard: http://localhost:' + LOCAL_PORT + '/dashboard');
  console.log('');
  console.log('🛑 UNTUK BERHENTI:');
  console.log('==================');
  console.log('Tekan Ctrl+C untuk menghentikan semua services');
  console.log('');
}

// Main execution
async function main() {
  try {
    // Check if ngrok is installed
    const ngrokInstalled = await checkNgrokInstalled();
    if (!ngrokInstalled) {
      console.log('❌ Ngrok tidak tersedia. Silakan install terlebih dahulu.');
      return;
    }
    
    // Start Next.js server
    await startNextJS();
    
    // Wait a bit for Next.js to fully start
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Start ngrok tunnel
    const ngrokUrl = await startNgrok();
    
    // Wait a bit for ngrok to stabilize
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Setup webhook
    const webhookOk = await setupWebhook(ngrokUrl);
    if (!webhookOk) {
      console.log('❌ Gagal setup webhook. Bot tidak akan menerima pesan real-time.');
    }
    
    // Setup commands
    await setBotCommands();
    
    // Test webhook
    await testWebhook(ngrokUrl);
    
    // Show instructions
    showTestInstructions(ngrokUrl);
    
    // Keep the process running
    console.log('🔄 System running... Press Ctrl+C to stop');
    
  } catch (error) {
    console.error('❌ Error starting system:', error.message);
    cleanup();
  }
}

// Run the system
main().catch(console.error);
