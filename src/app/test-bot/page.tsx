'use client';

import React, { useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function TestBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Selamat datang di Bot Platform!\n\nSaya dapat membantu Anda dengan berbagai tugas:\n\n📚 Pendidikan & Pembelajaran\n📋 Manajemen & Produktivitas\n🎮 Hiburan\n💼 Bisnis & Layanan\n⚙️ Teknis & Developer\n\nKetik /help untuk melihat daftar lengkap perintah.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputText);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const generateBotResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('/start') || lowerInput.includes('halo') || lowerInput.includes('hello')) {
      return '🤖 Selamat datang di Bot Platform!\n\nSaya dapat membantu Anda dengan berbagai tugas:\n\n📚 Pendidikan & Pembelajaran\n📋 Manajemen & Produktivitas\n🎮 Hiburan\n💼 Bisnis & Layanan\n⚙️ Teknis & Developer\n\nKetik /help untuk melihat daftar lengkap perintah.';
    }
    
    if (lowerInput.includes('/help')) {
      return `📖 **Daftar Perintah:**

**Perintah Umum:**
/start - Memulai bot
/help - Menampilkan bantuan ini

**Pendidikan:**
/translate <teks> - Terjemahkan teks
/quiz - Mulai kuis
/notes - Kelola catatan

**Manajemen:**
/todo - Kelola to-do list
/expense - Tracking pengeluaran

**Hiburan:**
/game - Mulai permainan
/movie <judul> - Cari info film

**Bisnis:**
/shop - Toko online
/booking - Sistem reservasi

**Teknis:**
/github - GitHub notifier
/monitor - Server monitoring
/ai - AI assistant`;
    }
    
    if (lowerInput.includes('/translate')) {
      const textToTranslate = input.replace('/translate', '').trim();
      if (!textToTranslate) {
        return 'Silakan ketik teks yang ingin diterjemahkan.\nContoh: /translate Hello world';
      }
      return `🌐 **Terjemahan:**

📝 **Original:** ${textToTranslate}
🔄 **Bahasa Indonesia:** [Terjemahan akan tersedia dengan integrasi Google Translate API]`;
    }
    
    if (lowerInput.includes('/todo')) {
      return `📋 **Manajemen To-Do List**

Fitur-fitur yang dapat Anda lakukan:
• Tambah Todo
• Lihat Todo
• Selesaikan Todo
• Hapus Todo

*Gunakan tombol interaktif di Telegram untuk navigasi yang lebih mudah.*`;
    }
    
    if (lowerInput.includes('/quiz')) {
      return `🧠 **Kuis Matematika & Umum**

❓ **Pertanyaan:** Apa ibu kota Indonesia?
A) Jakarta
B) Surabaya  
C) Bandung
D) Medan

*Gunakan tombol untuk menjawab di Telegram.*`;
    }
    
    if (lowerInput.includes('/game')) {
      return `🎮 **Game & Hiburan**

Pilih permainan yang ingin Anda mainkan:
• Tebak Angka
• Trivia Quiz
• Rolling Dice
• Random Quote

*Gunakan tombol interaktif untuk memulai permainan.*`;
    }
    
    if (lowerInput.includes('/shop')) {
      return `🛍️ **Toko Online**

Selamat datang di toko kami! Kami memiliki berbagai produk:
• Laptop Gaming - Rp 15.000.000
• Smartphone Flagship - Rp 8.000.000
• Sepatu Sneakers - Rp 500.000
• Buku Programming - Rp 150.000

*Gunakan tombol untuk menambahkan ke keranjang.*`;
    }
    
    if (lowerInput.includes('/monitor')) {
      return `⚙️ **Server Monitoring**

🖥️ **Server Status:**
🟢 Web Server - Online (99.9% uptime)
🟢 Database Server - Online (99.8% uptime)
🟢 API Server - Online (99.7% uptime)
🟡 Cache Server - Warning (95.2% uptime)

📊 **System Stats:**
CPU: 45%
Memory: 62%
Disk: 71%
Network: 234 MB/s`;
    }
    
    if (lowerInput.includes('/ai')) {
      return `🤖 **AI Assistant**

Saya siap membantu Anda dengan:
• Chat Assistant
• Code Helper
• Text Analysis
• Content Generator

Silakan ajukan pertanyaan atau ceritakan apa yang Anda butuhkan.

*Dalam implementasi nyata, ini akan terhubung dengan OpenAI API.*`;
    }
    
    // Default response for unrecognized commands
    return `🤔 Saya tidak mengenali perintah "${input}". 

Ketik /help untuk melihat daftar perintah yang tersedia, atau coba salah satu perintah berikut:
• /start - Memulai bot
• /translate <teks> - Terjemahkan teks
• /todo - Kelola to-do list
• /quiz - Mulai kuis
• /game - Mulai permainan`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickCommands = [
    { command: '/start', label: '/start', icon: '🤖' },
    { command: '/help', label: '/help', icon: '❓' },
    { command: '/translate Hello', label: '/translate', icon: '🌐' },
    { command: '/todo', label: '/todo', icon: '📋' },
    { command: '/quiz', label: '/quiz', icon: '🧠' },
    { command: '/game', label: '/game', icon: '🎮' },
    { command: '/shop', label: '/shop', icon: '🛍️' },
    { command: '/monitor', label: '/monitor', icon: '⚙️' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <a href="/" style={{ 
                padding: '0.5rem 1rem', 
                backgroundColor: '#f3f4f6', 
                color: '#374151', 
                textDecoration: 'none', 
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                ← Back
              </a>
              <div style={{ backgroundColor: '#2563eb', padding: '0.5rem', borderRadius: '0.5rem' }}>
                <span style={{ color: 'white', fontSize: '1.5rem' }}>🤖</span>
              </div>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                  Test Bot
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>
                  Simulasi interaksi dengan bot Telegram
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '0.5rem', height: '0.5rem', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>Bot Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem' }}>
        {/* Chat Interface */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '0.5rem', 
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          height: '600px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ 
            flex: 1, 
            overflowY: 'auto', 
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            {messages.map((message) => (
              <div
                key={message.id}
                style={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start'
                }}
              >
                <div
                  style={{
                    maxWidth: '75%',
                    padding: '0.75rem 1rem',
                    borderRadius: '1rem',
                    backgroundColor: message.sender === 'user' ? '#2563eb' : '#f3f4f6',
                    color: message.sender === 'user' ? 'white' : '#111827'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem', marginTop: '0.125rem' }}>
                      {message.sender === 'bot' ? '🤖' : '👤'}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        margin: 0,
                        whiteSpace: 'pre-line',
                        lineHeight: '1.4'
                      }}>
                        {message.text}
                      </p>
                      <p style={{ 
                        fontSize: '0.75rem', 
                        marginTop: '0.25rem',
                        color: message.sender === 'user' ? 'rgba(255,255,255,0.8)' : '#6b7280'
                      }}>
                        {message.timestamp.toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  backgroundColor: '#f3f4f6',
                  color: '#111827',
                  maxWidth: '75%',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1rem' }}>🤖</span>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <div style={{ 
                        width: '0.5rem', 
                        height: '0.5rem', 
                        backgroundColor: '#9ca3af', 
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite'
                      }}></div>
                      <div style={{ 
                        width: '0.5rem', 
                        height: '0.5rem', 
                        backgroundColor: '#9ca3af', 
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite 0.1s'
                      }}></div>
                      <div style={{ 
                        width: '0.5rem', 
                        height: '0.5rem', 
                        backgroundColor: '#9ca3af', 
                        borderRadius: '50%',
                        animation: 'bounce 1s infinite 0.2s'
                      }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div style={{ 
            borderTop: '1px solid #e5e7eb', 
            padding: '1rem',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan atau perintah (contoh: /help, /start, /todo)..."
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                outline: 'none'
              }}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: inputText.trim() && !isLoading ? '#2563eb' : '#9ca3af',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: inputText.trim() && !isLoading ? 'pointer' : 'not-allowed',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              📤
            </button>
          </div>
        </div>

        {/* Quick Commands */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
              Quick Commands
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1rem 0' }}>
              Klik untuk mengirim perintah dengan cepat
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
              gap: '0.75rem' 
            }}>
              {quickCommands.map((cmd, index) => (
                <button
                  key={index}
                  onClick={() => setInputText(cmd.command)}
                  style={{
                    padding: '0.75rem',
                    backgroundColor: '#f9fafb',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    justifyContent: 'flex-start',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }}
                >
                  <span>{cmd.icon}</span>
                  {cmd.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bot Features Info */}
        <div style={{ marginTop: '1.5rem' }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '0.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '1.5rem'
          }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
              Bot Features
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0 0 1rem 0' }}>
              Fitur-fitur yang tersedia dalam bot
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem' 
            }}>
              {[
                {
                  title: '📚 Pendidikan',
                  features: ['/translate - Terjemahan teks', '/quiz - Kuis interaktif', '/notes - Catatan pribadi']
                },
                {
                  title: '📋 Manajemen',
                  features: ['/todo - To-do list', '/expense - Tracking pengeluaran', '/group - Manajemen grup']
                },
                {
                  title: '🎮 Hiburan',
                  features: ['/game - Permainan sederhana', '/movie - Info film', '/meme - Generator meme']
                },
                {
                  title: '💼 Bisnis',
                  features: ['/shop - Toko online', '/booking - Sistem reservasi', '/support - Customer support']
                },
                {
                  title: '⚙️ Teknis',
                  features: ['/github - GitHub notifier', '/monitor - Server monitoring', '/ai - AI assistant']
                }
              ].map((category, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.5rem',
                  backgroundColor: '#f9fafb'
                }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: '600', color: '#111827', margin: '0 0 0.5rem 0' }}>
                    {category.title}
                  </h4>
                  <ul style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0, paddingLeft: '1rem' }}>
                    {category.features.map((feature, idx) => (
                      <li key={idx} style={{ marginBottom: '0.25rem' }}>{feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-8px,0);
          }
          70% {
            transform: translate3d(0,-4px,0);
          }
          90% {
            transform: translate3d(0,-2px,0);
          }
        }
      `}</style>
    </div>
  );
}