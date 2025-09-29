#!/usr/bin/env node

const https = require('https');

// Production configuration
const PRODUCTION_DOMAIN = 'grambotele.vercel.app';
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';

console.log('🧪 Testing Production Bot...\n');
console.log('🌐 Domain:', PRODUCTION_DOMAIN);

async function testWebhookEndpoint() {
  try {
    console.log('🔍 Testing webhook endpoint...');
    
    const options = {
      hostname: PRODUCTION_DOMAIN,
      path: '/api/telegram/webhook',
      method: 'GET',
    };

    const response = await makeRequest(options);
    console.log('✅ Webhook endpoint response:', response);
    
    if (response.status === 'active') {
      console.log('✅ Webhook endpoint is active!');
      return true;
    } else {
      console.log('❌ Webhook endpoint is not active');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing webhook endpoint:', error.message);
    return false;
  }
}

async function testBotInfo() {
  try {
    console.log('🤖 Testing bot info...');
    
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getMe`,
      method: 'GET',
    };

    const response = await makeRequest(options);
    console.log('✅ Bot info:', response);
    
    if (response.ok) {
      console.log('✅ Bot is accessible!');
      console.log('📱 Bot username:', response.result.username);
      return true;
    } else {
      console.log('❌ Bot is not accessible');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing bot info:', error.message);
    return false;
  }
}

async function testWebhookInfo() {
  try {
    console.log('📊 Testing webhook info...');
    
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/getWebhookInfo`,
      method: 'GET',
    };

    const response = await makeRequest(options);
    console.log('✅ Webhook info:', response);
    
    if (response.ok && response.result.url.includes(PRODUCTION_DOMAIN)) {
      console.log('✅ Webhook is correctly configured!');
      console.log('🔗 Webhook URL:', response.result.url);
      return true;
    } else {
      console.log('❌ Webhook is not correctly configured');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing webhook info:', error.message);
    return false;
  }
}

async function testWebhookWithMessage() {
  try {
    console.log('📤 Testing webhook with message...');
    
    const testMessage = {
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

    const postData = JSON.stringify(testMessage);

    const options = {
      hostname: PRODUCTION_DOMAIN,
      path: '/api/telegram/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const response = await makeRequest(options, postData);
    console.log('✅ Webhook test response:', response);
    
    if (response.ok) {
      console.log('✅ Webhook is processing messages correctly!');
      return true;
    } else {
      console.log('❌ Webhook is not processing messages correctly');
      return false;
    }
  } catch (error) {
    console.error('❌ Error testing webhook with message:', error.message);
    return false;
  }
}

async function sendTestMessage() {
  try {
    console.log('📤 Sending test message to bot...');
    
    const chatId = 8124399716; // Known chat ID
    const message = '🧪 Test message from production deployment!\n\nBot is working correctly in production environment.';

    const postData = JSON.stringify({
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
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
    console.log('✅ Test message response:', response);
    
    if (response.ok) {
      console.log('✅ Test message sent successfully!');
      return true;
    } else {
      console.log('❌ Failed to send test message');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending test message:', error.message);
    return false;
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

function showResults(results) {
  console.log('\n📊 TEST RESULTS:');
  console.log('================');
  console.log('');
  console.log('🔍 Webhook Endpoint:', results.webhookEndpoint ? '✅ PASS' : '❌ FAIL');
  console.log('🤖 Bot Info:', results.botInfo ? '✅ PASS' : '❌ FAIL');
  console.log('📊 Webhook Info:', results.webhookInfo ? '✅ PASS' : '❌ FAIL');
  console.log('📤 Webhook Message:', results.webhookMessage ? '✅ PASS' : '❌ FAIL');
  console.log('📨 Test Message:', results.testMessage ? '✅ PASS' : '❌ FAIL');
  console.log('');
  
  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  console.log(`📈 Overall Score: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Bot is ready for production!');
  } else {
    console.log('⚠️ Some tests failed. Check the issues above.');
  }
}

function showInstructions() {
  console.log('\n📋 PRODUCTION BOT INSTRUCTIONS:');
  console.log('================================');
  console.log('');
  console.log('🌐 PRODUCTION URLS:');
  console.log('===================');
  console.log('• Website: https://grambotele.vercel.app');
  console.log('• Webhook: https://grambotele.vercel.app/api/telegram/webhook');
  console.log('• Bot: @Backup_indBot');
  console.log('');
  console.log('🧪 TESTING IN TELEGRAM:');
  console.log('=======================');
  console.log('1. Send message to @Backup_indBot');
  console.log('2. Check if bot responds real-time');
  console.log('3. Test all features and navigation');
  console.log('4. Verify session management works');
  console.log('');
  console.log('🔧 TROUBLESHOOTING:');
  console.log('===================');
  console.log('• If bot doesn\'t respond: Check webhook configuration');
  console.log('• If webhook fails: Check Vercel deployment');
  console.log('• If features don\'t work: Check environment variables');
  console.log('• If session issues: Check Firebase configuration');
  console.log('');
  console.log('📱 BOT FEATURES:');
  console.log('================');
  console.log('• Interactive menus with navigation');
  console.log('• Session management');
  console.log('• Real-time responses');
  console.log('• Category-based features');
  console.log('• Back button navigation');
}

async function main() {
  console.log('🚀 Starting production bot tests...\n');
  
  const results = {
    webhookEndpoint: await testWebhookEndpoint(),
    botInfo: await testBotInfo(),
    webhookInfo: await testWebhookInfo(),
    webhookMessage: await testWebhookWithMessage(),
    testMessage: await sendTestMessage()
  };
  
  showResults(results);
  showInstructions();
}

main();