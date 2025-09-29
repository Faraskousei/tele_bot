'use client';

import React, { useState } from 'react';
import { Card, Button, Input } from '@/components/ui';
import { Bot, Send, MessageSquare, User, Bot as BotIcon } from 'lucide-react';
import Link from 'next/link';

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
      text: 'Halo! Saya adalah bot multi-fungsi. Ketik /help untuk melihat daftar perintah yang tersedia.',
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
      return `🌐 **Terjemahan:**\n\n📝 **Original:** ${textToTranslate}\n🔄 **Bahasa Indonesia:** [Terjemahan akan tersedia dengan integrasi Google Translate API]`;
    }
    
    if (lowerInput.includes('/todo')) {
      return `📋 **Manajemen To-Do List**

Pilih aksi yang ingin Anda lakukan:
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  ← Back
                </Button>
              </Link>
              <div className="bg-blue-600 p-2 rounded-lg">
                <BotIcon className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Test Bot</h1>
                <p className="text-sm text-gray-600">Simulasi interaksi dengan bot Telegram</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Bot Online</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Chat Interface */}
        <Card className="h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.sender === 'bot' && (
                      <Bot className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="w-4 h-4 mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
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
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan atau perintah (contoh: /help, /start, /todo)..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
                size="md"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Commands */}
        <div className="mt-6">
          <Card title="Quick Commands" description="Klik untuk mengirim perintah dengan cepat">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText('/start')}
                className="justify-start"
              >
                <Bot className="w-4 h-4 mr-2" />
                /start
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText('/help')}
                className="justify-start"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                /help
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText('/translate Hello')}
                className="justify-start"
              >
                🌐 /translate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText('/todo')}
                className="justify-start"
              >
                📋 /todo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText('/quiz')}
                className="justify-start"
              >
                🧠 /quiz
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText('/game')}
                className="justify-start"
              >
                🎮 /game
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText('/shop')}
                className="justify-start"
              >
                🛍️ /shop
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setInputText('/monitor')}
                className="justify-start"
              >
                ⚙️ /monitor
              </Button>
            </div>
          </Card>
        </div>

        {/* Bot Features Info */}
        <div className="mt-6">
          <Card title="Bot Features" description="Fitur-fitur yang tersedia dalam bot">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">📚 Pendidikan</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• /translate - Terjemahan teks</li>
                  <li>• /quiz - Kuis interaktif</li>
                  <li>• /notes - Catatan pribadi</li>
                </ul>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">📋 Manajemen</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• /todo - To-do list</li>
                  <li>• /expense - Tracking pengeluaran</li>
                  <li>• /group - Manajemen grup</li>
                </ul>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">🎮 Hiburan</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• /game - Permainan sederhana</li>
                  <li>• /movie - Info film</li>
                  <li>• /meme - Generator meme</li>
                </ul>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">💼 Bisnis</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• /shop - Toko online</li>
                  <li>• /booking - Sistem reservasi</li>
                  <li>• /support - Customer support</li>
                </ul>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">⚙️ Teknis</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• /github - GitHub notifier</li>
                  <li>• /monitor - Server monitoring</li>
                  <li>• /ai - AI assistant</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
