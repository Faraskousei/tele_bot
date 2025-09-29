import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sendMessage } from '../telegram';
import { updateUserSession } from '../bot-handlers';

export const processEducationFeatures = {
  async handleTranslateCommand(chatId: number, userId: number, text: string) {
    const textToTranslate = text.replace('/translate', '').trim();
    
    if (!textToTranslate) {
      await sendMessage(chatId, 'Silakan ketik teks yang ingin diterjemahkan.\nContoh: /translate Hello world');
      return;
    }

    try {
      // Simple translation simulation (you can integrate with Google Translate API)
      const translatedText = await this.translateText(textToTranslate);
      await sendMessage(chatId, `🌐 **Terjemahan:**\n\n📝 **Original:** ${textToTranslate}\n🔄 **Bahasa Indonesia:** ${translatedText}`);
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal menerjemahkan teks. Silakan coba lagi.');
    }
  },

  async translateText(text: string): Promise<string> {
    // This is a simple mock translation
    // In production, integrate with Google Translate API
    const translations: Record<string, string> = {
      'hello': 'halo',
      'world': 'dunia',
      'good morning': 'selamat pagi',
      'thank you': 'terima kasih',
      'how are you': 'apa kabar',
      'goodbye': 'selamat tinggal'
    };

    const lowerText = text.toLowerCase();
    return translations[lowerText] || `[Terjemahan untuk "${text}" akan tersedia dengan integrasi Google Translate API]`;
  },

  async handleQuizCommand(chatId: number, userId: number) {
    const quizQuestions = [
      {
        id: 1,
        question: "Apa ibu kota Indonesia?",
        options: ["Jakarta", "Surabaya", "Bandung", "Medan"],
        correctAnswer: 0
      },
      {
        id: 2,
        question: "Berapa hasil dari 5 + 3?",
        options: ["6", "7", "8", "9"],
        correctAnswer: 2
      },
      {
        id: 3,
        question: "Apa warna langit pada siang hari?",
        options: ["Merah", "Biru", "Hijau", "Kuning"],
        correctAnswer: 1
      }
    ];

    const randomQuestion = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    
    const keyboard = {
      inline_keyboard: [
        randomQuestion.options.map((option, index) => ({
          text: option,
          callback_data: `quiz:answer:${randomQuestion.id}:${index}`
        }))
      ]
    };

    await sendMessage(chatId, `🧠 **Kuis Matematika & Umum**\n\n❓ **Pertanyaan:** ${randomQuestion.question}`, { reply_markup: keyboard });
    
    // Save quiz state
    await updateUserSession(userId, chatId, 'waiting_for_quiz_answer', {
      questionId: randomQuestion.id,
      correctAnswer: randomQuestion.correctAnswer
    });
  },

  async handleQuizCallback(chatId: number, userId: number, action: string, params: string[]) {
    if (action === 'answer') {
      const [questionId, selectedAnswer] = params;
      const correctAnswer = parseInt(selectedAnswer);
      
      // Get session data
      const sessionRef = doc(db, 'sessions', `${userId}_${chatId}`);
      const sessionSnap = await getDoc(sessionRef);
      
      if (sessionSnap.exists()) {
        const session = sessionSnap.data();
        const isCorrect = session.data.correctAnswer === correctAnswer;
        
        if (isCorrect) {
          await sendMessage(chatId, '🎉 **Benar!** Jawaban Anda tepat!');
        } else {
          await sendMessage(chatId, `❌ **Salah!** Jawaban yang benar adalah pilihan ke-${session.data.correctAnswer + 1}`);
        }
        
        // Reset session
        await updateUserSession(userId, chatId, 'idle');
        
        // Offer next question
        const keyboard = {
          inline_keyboard: [[
            { text: '🎯 Pertanyaan Berikutnya', callback_data: 'quiz:next' }
          ]]
        };
        
        await sendMessage(chatId, 'Ingin mencoba pertanyaan lain?', { reply_markup: keyboard });
      }
    } else if (action === 'next') {
      await this.handleQuizCommand(chatId, userId);
    }
  },

  async answerQuiz(chatId: number, userId: number, text: string) {
    // Handle text-based quiz answers if needed
    await sendMessage(chatId, 'Silakan gunakan tombol untuk menjawab kuis.');
  },

  async handleNotesCommand(chatId: number, userId: number) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '📝 Tambah Catatan', callback_data: 'notes:add' },
          { text: '📋 Lihat Catatan', callback_data: 'notes:list' }
        ],
        [
          { text: '🔍 Cari Catatan', callback_data: 'notes:search' }
        ]
      ]
    };

    await sendMessage(chatId, '📚 **Manajemen Catatan Pribadi**\n\nPilih aksi yang ingin Anda lakukan:', { reply_markup: keyboard });
  },

  async handleNotesCallback(chatId: number, userId: number, action: string, params: string[]) {
    switch (action) {
      case 'add':
        await updateUserSession(userId, chatId, 'waiting_for_note', {});
        await sendMessage(chatId, '📝 Silakan ketik catatan yang ingin Anda simpan:');
        break;
      
      case 'list':
        await this.listNotes(chatId, userId);
        break;
      
      case 'search':
        await updateUserSession(userId, chatId, 'waiting_for_search', {});
        await sendMessage(chatId, '🔍 Silakan ketik kata kunci untuk mencari catatan:');
        break;
    }
  },

  async listNotes(chatId: number, userId: number) {
    try {
      const notesRef = collection(db, 'notes');
      const q = query(notesRef, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await sendMessage(chatId, '📋 Belum ada catatan tersimpan.');
        return;
      }

      let notesText = '📋 **Catatan Terbaru:**\n\n';
      querySnapshot.forEach((doc) => {
        const note = doc.data();
        const date = note.createdAt.toDate().toLocaleDateString('id-ID');
        notesText += `📝 ${note.content.substring(0, 50)}${note.content.length > 50 ? '...' : ''}\n📅 ${date}\n\n`;
      });

      await sendMessage(chatId, notesText);
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mengambil catatan.');
    }
  },

  async addNote(chatId: number, userId: number, content: string) {
    try {
      await addDoc(collection(db, 'notes'), {
        userId,
        content,
        createdAt: new Date()
      });
      
      await sendMessage(chatId, '✅ Catatan berhasil disimpan!');
      await updateUserSession(userId, chatId, 'idle');
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal menyimpan catatan.');
    }
  }
};
