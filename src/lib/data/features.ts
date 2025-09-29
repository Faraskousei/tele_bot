import { BotFeature, BotCategory } from '@/types/bot';

export const defaultFeatures: BotFeature[] = [
  // Education Features
  {
    id: 'translate',
    name: 'Dictionary / Translate Bot',
    description: 'Terhubung ke Google Translate API atau database kamus untuk menerjemahkan teks.',
    category: BotCategory.EDUCATION,
    enabled: true,
    settings: {
      defaultLanguages: ['id', 'en'],
      autoDetect: true,
      supportedLanguages: ['id', 'en', 'ja', 'ko', 'zh']
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'quiz',
    name: 'Quiz & Practice Questions Bot',
    description: 'Untuk latihan ujian, menawarkan pertanyaan pilihan ganda atau flashcards.',
    category: BotCategory.EDUCATION,
    enabled: true,
    settings: {
      categories: ['umum', 'matematika', 'sains', 'sejarah'],
      difficulty: ['easy', 'medium', 'hard'],
      timeLimit: 30
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'notes',
    name: 'Personal Notes Bot',
    description: 'Menyimpan catatan dalam chat pribadi, menggunakan database untuk fungsi pencarian.',
    category: BotCategory.EDUCATION,
    enabled: true,
    settings: {
      maxNotes: 100,
      searchEnabled: true,
      categories: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Management Features
  {
    id: 'todo',
    name: 'To-Do List Bot',
    description: 'Memungkinkan menambah, menghapus, dan mencentang tugas; sinkronisasi dengan interface web.',
    category: BotCategory.MANAGEMENT,
    enabled: true,
    settings: {
      maxTasks: 50,
      categories: true,
      dueDate: true,
      priority: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'expense',
    name: 'Expense Tracking Bot',
    description: 'Mencatat pemasukan/pengeluaran dan menampilkan laporan.',
    category: BotCategory.MANAGEMENT,
    enabled: true,
    settings: {
      categories: ['makanan', 'transport', 'belanja', 'hiburan'],
      currency: 'IDR',
      monthlyReports: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'group_management',
    name: 'Group Management Bot',
    description: 'Fitur auto-kick spammer, filter kata, pesan selamat datang, dan polling.',
    category: BotCategory.MANAGEMENT,
    enabled: false,
    settings: {
      autoKick: false,
      wordFilter: [],
      welcomeMessage: '',
      adminOnly: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Entertainment Features
  {
    id: 'games',
    name: 'Simple Games Bot',
    description: 'Contoh: tebak gambar, trivia quiz, tebak angka, atau RPG sederhana.',
    category: BotCategory.ENTERTAINMENT,
    enabled: true,
    settings: {
      availableGames: ['guess_number', 'trivia', 'dice', 'quote'],
      scoreTracking: true,
      leaderboard: false
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'movie_info',
    name: 'Music / Film Info Bot',
    description: 'Mencari lirik lagu, rekomendasi musik, atau informasi film dari TMDB API.',
    category: BotCategory.ENTERTAINMENT,
    enabled: false,
    settings: {
      tmdbApiKey: '',
      includePosters: true,
      language: 'id'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'meme_generator',
    name: 'Meme Generator Bot',
    description: 'Otomatis membuat meme dari template gambar + teks.',
    category: BotCategory.ENTERTAINMENT,
    enabled: false,
    settings: {
      templates: [],
      maxTextLength: 50,
      allowCustomImages: false
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Business Features
  {
    id: 'ecommerce',
    name: 'Simple E-commerce Bot',
    description: 'Fitur katalog produk, keranjang belanja, dan proses checkout.',
    category: BotCategory.BUSINESS,
    enabled: false,
    settings: {
      maxProducts: 100,
      paymentMethods: ['transfer', 'cod'],
      currency: 'IDR'
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'booking',
    name: 'Reservation / Booking Bot',
    description: 'Untuk booking hotel, kursus, atau layanan lainnya.',
    category: BotCategory.BUSINESS,
    enabled: false,
    settings: {
      types: ['hotel', 'restaurant', 'course'],
      maxBookings: 10,
      reminderEnabled: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'customer_support',
    name: 'Customer Support Bot',
    description: 'Memberikan jawaban FAQ otomatis atau integrasi dengan admin via live chat.',
    category: BotCategory.BUSINESS,
    enabled: false,
    settings: {
      faqEnabled: true,
      liveChat: false,
      ticketSystem: true
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Technical Features
  {
    id: 'github_notifier',
    name: 'GitHub/CI Notifier Bot',
    description: 'Mengirim notifikasi untuk commit, pull request, atau hasil CI/CD.',
    category: BotCategory.TECHNICAL,
    enabled: false,
    settings: {
      repositories: [],
      events: ['push', 'pull_request', 'issues'],
      webhookUrl: ''
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'server_monitor',
    name: 'Server Monitoring Bot',
    description: 'Mengirim status server, penggunaan CPU/RAM, atau alert error.',
    category: BotCategory.TECHNICAL,
    enabled: false,
    settings: {
      servers: [],
      metrics: ['cpu', 'memory', 'disk'],
      alertThresholds: { cpu: 80, memory: 85, disk: 90 }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'ai_assistant',
    name: 'AI / Chat Assistant Bot',
    description: 'Integrasi dengan AI APIs (ChatGPT, Gemini, atau open-source LLMs).',
    category: BotCategory.TECHNICAL,
    enabled: false,
    settings: {
      provider: 'openai',
      model: 'gpt-3.5-turbo',
      maxTokens: 1000,
      temperature: 0.7
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }
];
