#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deploying to Vercel...\n');

// Check if Vercel CLI is installed
function checkVercelCLI() {
  try {
    execSync('vercel --version', { stdio: 'pipe' });
    console.log('✅ Vercel CLI is installed');
    return true;
  } catch (error) {
    console.log('❌ Vercel CLI not found. Installing...');
    try {
      execSync('npm install -g vercel', { stdio: 'inherit' });
      console.log('✅ Vercel CLI installed successfully');
      return true;
    } catch (installError) {
      console.error('❌ Failed to install Vercel CLI:', installError.message);
      return false;
    }
  }
}

// Create .env.local for local development
function createEnvLocal() {
  const envContent = `# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw
TELEGRAM_WEBHOOK_URL=https://grambotele.vercel.app/api/telegram/webhook

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDO9QTPwSLc7YEyEu-vkAewptzRVcWdF78
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=db-ind-b9d1c.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=db-ind-b9d1c
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=db-ind-b9d1c.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=142941537714
NEXT_PUBLIC_FIREBASE_APP_ID=1:142941537714:web:fbb4f4d18715688e8550ab

# TMDB API Configuration
TMDB_API_KEY=db10591f98182b1ca805e5ee581d820c
TMDB_READ_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjEwNTkxZjI4MTgyYjFjYWI4MDVlNWU1ODEwZDBjIiwic3ViIjoiNjMTc1OTExOTc2MjMyNTIsImlzcyI6InNlY3VyZSIsImV4cCI6MTcwOTYyOTBhNjJkZWMyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uOjF9.l9FbbJ6xmaGJ2EHW39QkDuMASTH8s5kwVtO0wcXffzk

# Production Environment
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://grambotele.vercel.app
`;

  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('✅ Created .env.local file');
  } catch (error) {
    console.error('❌ Failed to create .env.local:', error.message);
  }
}

// Deploy to Vercel
function deployToVercel() {
  try {
    console.log('🚀 Deploying to Vercel...');
    
    // Set environment variables
    const envVars = [
      'TELEGRAM_BOT_TOKEN=8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw',
      'TELEGRAM_WEBHOOK_URL=https://grambotele.vercel.app/api/telegram/webhook',
      'NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDO9QTPwSLc7YEyEu-vkAewptzRVcWdF78',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=db-ind-b9d1c.firebaseapp.com',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID=db-ind-b9d1c',
      'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=db-ind-b9d1c.firebasestorage.app',
      'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=142941537714',
      'NEXT_PUBLIC_FIREBASE_APP_ID=1:142941537714:web:fbb4f4d18715688e8550ab',
      'TMDB_API_KEY=db10591f98182b1ca805e5ee581d820c',
      'TMDB_READ_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjEwNTkxZjI4MTgyYjFjYWI4MDVlNWU1ODEwZDBjIiwic3ViIjoiNjMTc1OTExOTc2MjMyNTIsImlzcyI6InNlY3VyZSIsImV4cCI6MTcwOTYyOTBhNjJkZWMyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uOjF9.l9FbbJ6xmaGJ2EHW39QkDuMASTH8s5kwVtO0wcXffzk',
      'NODE_ENV=production',
      'NEXT_PUBLIC_APP_URL=https://grambotele.vercel.app'
    ];

    // Deploy with environment variables
    const deployCommand = `vercel --prod --yes ${envVars.map(env => `--env ${env}`).join(' ')}`;
    console.log('📦 Running deployment command...');
    
    execSync(deployCommand, { stdio: 'inherit' });
    console.log('✅ Deployment completed successfully!');
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.log('\n🔧 Manual deployment steps:');
    console.log('1. Run: vercel login');
    console.log('2. Run: vercel --prod');
    console.log('3. Set environment variables in Vercel dashboard');
  }
}

// Setup webhook after deployment
function setupWebhook() {
  try {
    console.log('🔧 Setting up webhook...');
    execSync('node setup-vercel-webhook.js', { stdio: 'inherit' });
    console.log('✅ Webhook setup completed!');
  } catch (error) {
    console.error('❌ Webhook setup failed:', error.message);
  }
}

function showInstructions() {
  console.log('\n📋 DEPLOYMENT INSTRUCTIONS:');
  console.log('============================');
  console.log('');
  console.log('✅ Deployment process completed!');
  console.log('');
  console.log('🔧 MANUAL STEPS (if needed):');
  console.log('=============================');
  console.log('1. Install Vercel CLI: npm install -g vercel');
  console.log('2. Login to Vercel: vercel login');
  console.log('3. Deploy: vercel --prod');
  console.log('4. Set environment variables in Vercel dashboard');
  console.log('');
  console.log('🌐 ENVIRONMENT VARIABLES:');
  console.log('=========================');
  console.log('TELEGRAM_BOT_TOKEN=8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw');
  console.log('TELEGRAM_WEBHOOK_URL=https://grambotele.vercel.app/api/telegram/webhook');
  console.log('NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDO9QTPwSLc7YEyEu-vkAewptzRVcWdF78');
  console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=db-ind-b9d1c.firebaseapp.com');
  console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID=db-ind-b9d1c');
  console.log('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=db-ind-b9d1c.firebasestorage.app');
  console.log('NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=142941537714');
  console.log('NEXT_PUBLIC_FIREBASE_APP_ID=1:142941537714:web:fbb4f4d18715688e8550ab');
  console.log('TMDB_API_KEY=db10591f98182b1ca805e5ee581d820c');
  console.log('TMDB_READ_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjEwNTkxZjI4MTgyYjFjYWI4MDVlNWU1ODEwZDBjIiwic3ViIjoiNjMTc1OTExOTc2MjMyNTIsImlzcyI6InNlY3VyZSIsImV4cCI6MTcwOTYyOTBhNjJkZWMyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uOjF9.l9FbbJ6xmaGJ2EHW39QkDuMASTH8s5kwVtO0wcXffzk');
  console.log('NODE_ENV=production');
  console.log('NEXT_PUBLIC_APP_URL=https://grambotele.vercel.app');
  console.log('');
  console.log('🧪 TESTING:');
  console.log('===========');
  console.log('1. Visit: https://grambotele.vercel.app');
  console.log('2. Test webhook: https://grambotele.vercel.app/api/telegram/webhook');
  console.log('3. Send message to bot in Telegram');
  console.log('4. Check if bot responds real-time');
  console.log('');
  console.log('🔗 LINKS:');
  console.log('=========');
  console.log('• Website: https://grambotele.vercel.app');
  console.log('• Webhook: https://grambotele.vercel.app/api/telegram/webhook');
  console.log('• Bot: @Backup_indBot');
}

async function main() {
  // Check Vercel CLI
  if (!checkVercelCLI()) {
    console.log('❌ Cannot proceed without Vercel CLI');
    return;
  }

  // Create .env.local
  createEnvLocal();

  // Deploy to Vercel
  deployToVercel();

  // Setup webhook
  setupWebhook();

  showInstructions();
}

main();
