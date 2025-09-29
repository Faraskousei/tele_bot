// Bot Configuration
export const BOT_CONFIG = {
  // Telegram Bot Token
  TOKEN: '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw',
  
  // Webhook URL (update this when deploying)
  WEBHOOK_URL: 'http://localhost:3000/api/telegram/webhook',
  
  // Bot Commands
  COMMANDS: [
    { command: 'start', description: 'Memulai bot' },
    { command: 'help', description: 'Menampilkan bantuan' },
    { command: 'translate', description: 'Terjemahkan teks' },
    { command: 'todo', description: 'Kelola to-do list' },
    { command: 'quiz', description: 'Mulai kuis' },
    { command: 'game', description: 'Mulai permainan' },
    { command: 'shop', description: 'Toko online' },
    { command: 'monitor', description: 'Server monitoring' },
    { command: 'ai', description: 'AI assistant' }
  ],
  
  // Feature Settings
  FEATURES: {
    TRANSLATE: {
      enabled: true,
      defaultLanguages: ['id', 'en'],
      autoDetect: true
    },
    TODO: {
      enabled: true,
      maxTasks: 50,
      categories: true
    },
    QUIZ: {
      enabled: true,
      timeLimit: 30,
      difficulty: ['easy', 'medium', 'hard']
    },
    GAMES: {
      enabled: true,
      availableGames: ['guess_number', 'trivia', 'dice', 'quote']
    },
    ECOMMERCE: {
      enabled: false,
      maxProducts: 100,
      currency: 'IDR'
    },
    MONITORING: {
      enabled: false,
      metrics: ['cpu', 'memory', 'disk'],
      alertThresholds: { cpu: 80, memory: 85, disk: 90 }
    }
  }
};

// Firebase Configuration
export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDO9QTPwSLc7YEyEu-vkAewptzRVcWdF78",
  authDomain: "db-ind-b9d1c.firebaseapp.com",
  projectId: "db-ind-b9d1c",
  storageBucket: "db-ind-b9d1c.firebasestorage.app",
  messagingSenderId: "142941537714",
  appId: "1:142941537714:web:fbb4f4d18715688e8550ab",
  measurementId: "G-8XYH1H62E4"
};

// API Keys
export const API_KEYS = {
  GOOGLE_TRANSLATE: "your_google_translate_key",
  TMDB: "db10591f98182b1ca805e5ee581d820c",
  TMDB_READ_ACCESS_TOKEN: "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkYjEwNTkxZjI4MTgyYjFjYWI4MDVlNWU1ODEwZDBjIiwic3ViIjoiNjMTc1OTExOTc2MjMyNTIsImlzcyI6InNlY3VyZSIsImV4cCI6MTcwOTYyOTBhNjJkZWMyMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.l9FbbJ6xmaGJ2EHW39QkDuMASTH8s5kwVtO0wcXffzk",
  OPENAI: "your_openai_api_key"
};
