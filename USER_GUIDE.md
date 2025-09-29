# 📱 Panduan Pengguna Bot Platform

## 🚀 Cara Menggunakan Sistem

### 1. **Registrasi & Login**
1. Buka http://localhost:3000
2. Klik "Daftar di sini" untuk membuat akun baru
3. Isi form registrasi:
   - Nama Lengkap
   - Email
   - Password (minimal 6 karakter)
   - Konfirmasi Password
4. Setelah berhasil, Anda akan diarahkan ke dashboard

### 2. **Setup Telegram Chat ID**
1. Buka Telegram dan cari bot **@Backup_indBot**
2. Kirim pesan `/start` ke bot
3. Kirim pesan `/myid` untuk mendapatkan Chat ID Anda
4. Salin Chat ID yang muncul
5. Di web dashboard, klik "Profil" di header
6. Masukkan Chat ID dan username Telegram Anda
7. Klik "Simpan Profil"

### 3. **Menggunakan Fitur Bot**

#### 📚 **Fitur Pendidikan**
- **Translate**: `/translate <teks>` - Terjemahkan teks
- **Quiz**: `/quiz` - Mulai kuis interaktif
- **Notes**: `/notes` - Kelola catatan pribadi

#### 📋 **Fitur Manajemen**
- **To-Do List**: `/todo` - Kelola daftar tugas
  - `/todo add <tugas>` - Tambah tugas baru
  - `/todo list` - Lihat daftar tugas
  - `/todo done <nomor>` - Tandai tugas selesai
- **Expense Tracking**: `/expense` - Catat pengeluaran

#### 🎮 **Fitur Hiburan**
- **Games**: `/game` - Mulai permainan
  - `/game guess` - Tebak angka
  - `/game trivia` - Kuis trivia
  - `/game rps` - Rock Paper Scissors
- **Movie Info**: `/movie <judul>` - Cari info film
- **Meme Generator**: `/meme` - Buat meme

#### 💼 **Fitur Bisnis**
- **E-commerce**: `/shop` - Toko online
- **Booking**: `/booking` - Sistem reservasi
- **Customer Support**: `/support` - Bantuan pelanggan

#### ⚙️ **Fitur Teknis**
- **Server Monitor**: `/monitor` - Monitor server
- **GitHub Notifier**: `/github` - Notifikasi GitHub
- **AI Assistant**: `/ai` - Asisten AI

### 4. **Web Dashboard**

#### 🏠 **Halaman Utama**
- Lihat semua fitur bot yang tersedia
- Toggle enable/disable fitur
- Filter berdasarkan kategori
- Statistik penggunaan

#### 📊 **Dashboard**
- Statistik bot real-time
- Informasi pengguna
- Link ke halaman lain
- Status sistem

#### 👤 **Profil Pengguna**
- Edit informasi akun
- Setup Chat ID Telegram
- Update username Telegram
- Logout

## 🔧 Konfigurasi Lanjutan

### **Mengaktifkan Fitur**
1. Di halaman utama, klik toggle switch pada fitur yang ingin diaktifkan
2. Fitur yang aktif akan tersedia di bot Telegram
3. Konfigurasi tambahan bisa dilakukan di halaman settings

### **Firebase Integration**
- Semua data tersimpan di Firebase Firestore
- User authentication menggunakan Firebase Auth
- Real-time sync antara web dan bot

### **Bot Commands**
Semua perintah bot tersedia melalui:
- Telegram: Chat dengan @Backup_indBot
- Web: Dashboard dan halaman fitur

## 📞 **Troubleshooting**

### **Bot Tidak Merespon**
1. Pastikan Chat ID sudah diatur di profil
2. Cek status bot di dashboard
3. Restart bot jika diperlukan

### **Login Gagal**
1. Pastikan email dan password benar
2. Cek koneksi internet
3. Clear browser cache jika perlu

### **Fitur Tidak Bekerja**
1. Pastikan fitur sudah diaktifkan di dashboard
2. Cek konfigurasi fitur
3. Restart server jika perlu

## 🌐 **URL Penting**

- **Web Dashboard**: http://localhost:3000
- **Login**: http://localhost:3000/login
- **Register**: http://localhost:3000/register
- **Profile**: http://localhost:3000/profile
- **Dashboard**: http://localhost:3000/dashboard
- **Bot Telegram**: @Backup_indBot

## 📝 **Tips Penggunaan**

1. **Simpan Chat ID**: Chat ID diperlukan untuk semua fitur bot
2. **Gunakan Dashboard**: Web dashboard untuk konfigurasi lengkap
3. **Test Fitur**: Gunakan `/help` di Telegram untuk melihat semua perintah
4. **Backup Data**: Semua data tersimpan otomatis di Firebase
5. **Update Profil**: Pastikan informasi profil selalu up-to-date

## 🔒 **Keamanan**

- Password minimal 6 karakter
- Data tersimpan aman di Firebase
- Authentication diperlukan untuk akses web
- Chat ID bersifat pribadi

---

**Selamat menggunakan Bot Platform!** 🎉

Jika ada pertanyaan atau masalah, silakan cek troubleshooting atau hubungi support.
