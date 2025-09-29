# Bot Platform - Telegram Bot Management System

Platform manajemen bot Telegram yang terintegrasi dengan berbagai fitur sesuai kategori yang telah ditentukan. Dibangun menggunakan Next.js, Firebase, dan Telegram Bot API.

## 🚀 Fitur Utama

### 📚 Pendidikan & Pembelajaran
- **Dictionary / Translate Bot**: Terhubung ke Google Translate API untuk menerjemahkan teks
- **Quiz & Practice Questions Bot**: Kuis interaktif dengan pertanyaan pilihan ganda
- **Personal Notes Bot**: Menyimpan dan mengelola catatan pribadi dengan fungsi pencarian

### 📋 Manajemen & Produktivitas
- **To-Do List Bot**: Manajemen tugas dengan fitur tambah, selesaikan, dan hapus
- **Expense Tracking Bot**: Tracking pemasukan dan pengeluaran dengan laporan
- **Group Management Bot**: Auto-kick spammer, filter kata, pesan selamat datang

### 🎮 Hiburan
- **Simple Games Bot**: Permainan seperti tebak angka, trivia quiz, rolling dice
- **Music / Film Info Bot**: Mencari informasi film dan musik dari TMDB API
- **Meme Generator Bot**: Generator meme otomatis dari template

### 💼 Bisnis & Layanan
- **Simple E-commerce Bot**: Katalog produk, keranjang belanja, checkout
- **Reservation / Booking Bot**: Sistem reservasi untuk hotel, restoran, kursus
- **Customer Support Bot**: FAQ otomatis dan live chat support

### ⚙️ Teknis & Developer
- **GitHub/CI Notifier Bot**: Notifikasi untuk commit, pull request, CI/CD
- **Server Monitoring Bot**: Monitoring server, CPU/RAM, alert system
- **AI / Chat Assistant Bot**: Integrasi dengan AI APIs (ChatGPT, Gemini)

## 🛠️ Teknologi yang Digunakan

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Bot Integration**: node-telegram-bot-api
- **UI Components**: Custom components dengan Radix UI
- **Icons**: Lucide React

## 📦 Instalasi

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd telegram-bot-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Edit `.env.local` dengan konfigurasi Anda:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Telegram Bot Configuration
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_WEBHOOK_URL=your_webhook_url

   # API Keys for additional services
   GOOGLE_TRANSLATE_API_KEY=your_google_translate_key
   TMDB_API_KEY=your_tmdb_api_key
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Setup Firebase**
   - Buat project Firebase baru
   - Enable Firestore Database
   - Enable Storage
   - Copy konfigurasi ke `.env.local`

5. **Setup Telegram Bot**
   - Chat dengan @BotFather di Telegram
   - Buat bot baru dengan `/newbot`
   - Copy token bot ke `.env.local`

6. **Run development server**
   ```bash
   npm run dev
   ```

7. **Build untuk production**
   ```bash
   npm run build
   npm start
   ```

## 🎯 Penggunaan

### Web Interface
1. Buka `http://localhost:3000` untuk mengakses dashboard utama
2. Kelola fitur-fitur bot dari interface web
3. Monitor statistik dan aktivitas bot
4. Test bot langsung dari halaman test

### Telegram Bot
1. Cari bot Anda di Telegram
2. Mulai dengan `/start`
3. Gunakan `/help` untuk melihat daftar perintah
4. Eksplorasi berbagai fitur sesuai kategori

### Perintah Bot yang Tersedia

#### Perintah Umum
- `/start` - Memulai bot
- `/help` - Menampilkan bantuan

#### Pendidikan
- `/translate <teks>` - Terjemahkan teks
- `/quiz` - Mulai kuis interaktif
- `/notes` - Kelola catatan pribadi

#### Manajemen
- `/todo` - Kelola to-do list
- `/expense` - Tracking pengeluaran
- `/group` - Manajemen grup

#### Hiburan
- `/game` - Mulai permainan
- `/movie <judul>` - Cari info film
- `/meme` - Generator meme

#### Bisnis
- `/shop` - Toko online
- `/booking` - Sistem reservasi
- `/support` - Customer support

#### Teknis
- `/github` - GitHub notifier
- `/monitor` - Server monitoring
- `/ai` - AI assistant

## 📁 Struktur Project

```
telegram-bot-platform/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   └── telegram/      # Telegram webhook
│   │   ├── dashboard/         # Dashboard page
│   │   ├── test-bot/          # Bot testing page
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   ├── ui/                # UI components
│   │   ├── FeatureCard.tsx    # Feature card component
│   │   └── CategoryTabs.tsx   # Category tabs
│   ├── lib/                   # Utilities and configurations
│   │   ├── features/          # Bot feature implementations
│   │   ├── data/              # Default data
│   │   ├── firebase.ts        # Firebase config
│   │   ├── telegram.ts        # Telegram bot config
│   │   └── bot-handlers.ts    # Bot message handlers
│   └── types/                 # TypeScript type definitions
│       └── bot.ts             # Bot-related types
├── public/                    # Static assets
├── env.example               # Environment variables example
└── README.md                 # Documentation
```

## 🔧 Konfigurasi

### Firebase Setup
1. Buat project Firebase baru
2. Enable Firestore Database
3. Enable Storage
4. Setup security rules
5. Copy konfigurasi ke environment variables

### Telegram Bot Setup
1. Chat dengan @BotFather
2. Buat bot baru
3. Set webhook URL
4. Konfigurasi bot commands
5. Copy token ke environment variables

### API Integrations
- **Google Translate API**: Untuk fitur terjemahan
- **TMDB API**: Untuk informasi film
- **OpenAI API**: Untuk AI assistant

## 🚀 Deployment

### Vercel (Recommended)
1. Push code ke GitHub
2. Connect repository ke Vercel
3. Set environment variables di Vercel
4. Deploy

### Other Platforms
- **Netlify**: Compatible dengan Next.js
- **Railway**: Easy deployment dengan database
- **DigitalOcean**: VPS deployment

## 📊 Monitoring & Analytics

Platform menyediakan:
- Real-time bot statistics
- User activity tracking
- Feature usage analytics
- System health monitoring
- Error logging dan alerting

## 🤝 Contributing

1. Fork repository
2. Buat feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

Jika mengalami masalah atau butuh bantuan:
- Buat issue di GitHub repository
- Dokumentasi lengkap tersedia di wiki
- Community support di Telegram group

## 🔮 Roadmap

- [ ] Integrasi dengan lebih banyak API
- [ ] Dashboard analytics yang lebih detail
- [ ] Multi-language support
- [ ] Plugin system untuk fitur custom
- [ ] Mobile app companion
- [ ] Advanced AI features
- [ ] Payment gateway integration
- [ ] White-label solution

---

**Dibuat dengan ❤️ menggunakan Next.js, Firebase, dan Telegram Bot API**