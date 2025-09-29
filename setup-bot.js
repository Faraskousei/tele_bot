// Setup Bot Telegram dengan webhook
const BOT_TOKEN = '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';
const WEBHOOK_URL = 'http://localhost:3000/api/telegram/webhook';

async function setupBot() {
  console.log('🤖 Setting up Telegram Bot...');
  
  try {
    // 1. Set webhook
    console.log('📡 Setting webhook...');
    const webhookResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['message', 'callback_query']
      })
    });
    
    const webhookResult = await webhookResponse.json();
    console.log('Webhook result:', webhookResult);
    
    if (webhookResult.ok) {
      console.log('✅ Webhook set successfully!');
    } else {
      console.log('❌ Webhook setup failed:', webhookResult.description);
    }
    
    // 2. Set bot commands
    console.log('⚙️ Setting bot commands...');
    const commandsResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setMyCommands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        commands: [
          { command: 'start', description: 'Memulai bot' },
          { command: 'help', description: 'Menampilkan bantuan' },
          { command: 'translate', description: 'Terjemahkan teks' },
          { command: 'todo', description: 'Kelola to-do list' },
          { command: 'quiz', description: 'Mulai kuis' },
          { command: 'game', description: 'Mulai permainan' },
          { command: 'shop', description: 'Toko online' },
          { command: 'monitor', description: 'Server monitoring' },
          { command: 'ai', description: 'AI assistant' }
        ]
      })
    });
    
    const commandsResult = await commandsResponse.json();
    console.log('Commands result:', commandsResult);
    
    if (commandsResult.ok) {
      console.log('✅ Bot commands set successfully!');
    } else {
      console.log('❌ Bot commands setup failed:', commandsResult.description);
    }
    
    // 3. Get bot info
    console.log('ℹ️ Getting bot info...');
    const botInfoResponse = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);
    const botInfo = await botInfoResponse.json();
    
    if (botInfo.ok) {
      console.log('✅ Bot Info:');
      console.log(`   Name: ${botInfo.result.first_name}`);
      console.log(`   Username: @${botInfo.result.username}`);
      console.log(`   ID: ${botInfo.result.id}`);
      console.log(`   Can join groups: ${botInfo.result.can_join_groups}`);
      console.log(`   Can read all group messages: ${botInfo.result.can_read_all_group_messages}`);
    }
    
    console.log('\n🎉 Bot setup completed!');
    console.log(`\n📱 To test your bot:`);
    console.log(`   1. Open Telegram`);
    console.log(`   2. Search for @${botInfo.result.username}`);
    console.log(`   3. Send /start to begin`);
    console.log(`\n🌐 Web interface: http://localhost:3000/fixed`);
    
  } catch (error) {
    console.error('❌ Error setting up bot:', error);
  }
}

// Run setup
setupBot();
