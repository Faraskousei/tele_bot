import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { sendMessage, answerCallbackQuery } from './telegram';
import { BotUser, BotSession, TelegramUpdate } from '@/types/bot';
import { processEducationFeatures } from './features/education';
import { processManagementFeatures } from './features/management';
import { processEntertainmentFeatures } from './features/entertainment';
import { processBusinessFeatures } from './features/business';
import { processTechnicalFeatures } from './features/technical';

export async function processMessage(update: TelegramUpdate) {
  try {
    const message = update.message;
    const callbackQuery = update.callback_query;

    console.log('🔄 Processing update:', { 
      hasMessage: !!message, 
      hasCallbackQuery: !!callbackQuery,
      messageId: message?.message_id,
      chatId: message?.chat?.id,
      userId: message?.from?.id,
      text: message?.text
    });

    if (message) {
      await handleMessage(message);
    } else if (callbackQuery) {
      await handleCallbackQuery(callbackQuery);
    } else {
      console.log('⚠️ Unknown update type:', update);
    }

    return { success: true, type: message ? 'message' : 'callback_query' };
  } catch (error) {
    console.error('❌ Error in processMessage:', error);
    throw error;
  }
}

async function handleMessage(message: any) {
  try {
    const chatId = message.chat.id;
    const userId = message.from.id;
    const text = message.text;
    const username = message.from.username;
    const firstName = message.from.first_name;
    const lastName = message.from.last_name;

    console.log('💬 Handling message:', {
      chatId,
      userId,
      text,
      username,
      firstName,
      lastName
    });

    // Save or update user
    await saveUser({
      id: userId.toString(),
      telegramId: userId,
      username,
      firstName,
      lastName,
      isBot: message.from.is_bot,
      languageCode: message.from.language_code,
      createdAt: new Date(),
      lastActiveAt: new Date()
    });

    // Get user session
    const session = await getUserSession(userId, chatId);
    console.log('📋 User session:', session);

    // Process based on session state or command
    if (text?.startsWith('/')) {
      console.log('🎯 Processing command:', text);
      await handleCommand(chatId, userId, text, session);
    } else {
      console.log('💭 Processing regular message:', text);
      await handleRegularMessage(chatId, userId, text, session);
    }
  } catch (error) {
    console.error('❌ Error in handleMessage:', error);
    throw error;
  }
}

async function handleCallbackQuery(callbackQuery: any) {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;

  await answerCallbackQuery(callbackQuery.id);

  // Process callback data
  const [feature, action, ...params] = data.split(':');
  
  switch (feature) {
    case 'todo':
      await processManagementFeatures.handleTodoCallback(chatId, userId, action, params);
      break;
    case 'expense':
      await processManagementFeatures.handleExpenseCallback(chatId, userId, action, params);
      break;
    case 'quiz':
      await processEducationFeatures.handleQuizCallback(chatId, userId, action, params);
      break;
    case 'movie':
      await processEntertainmentFeatures.handleMovieCallback(chatId, userId, action, params);
      break;
    case 'game':
      await processEntertainmentFeatures.handleGameCallback(chatId, userId, action, params);
      break;
    default:
      await sendMessage(chatId, 'Fitur belum tersedia.');
  }
}

async function handleCommand(chatId: number, userId: number, text: string, session: BotSession | null) {
  const command = text.split(' ')[0];

  switch (command) {
    case '/start':
      await sendWelcomeMessage(chatId);
      break;
    case '/help':
      await sendHelpMessage(chatId);
      break;
    case '/todo':
      await processManagementFeatures.handleTodoCommand(chatId, userId);
      break;
    case '/expense':
      await processManagementFeatures.handleExpenseCommand(chatId, userId);
      break;
    case '/quiz':
      await processEducationFeatures.handleQuizCommand(chatId, userId);
      break;
    case '/translate':
      await processEducationFeatures.handleTranslateCommand(chatId, userId, text);
      break;
    case '/game':
      await processEntertainmentFeatures.handleGameCommand(chatId, userId);
      break;
    case '/movie':
      await processEntertainmentFeatures.handleMovieCommand(chatId, userId, text);
      break;
    case '/shop':
      await processBusinessFeatures.handleShopCommand(chatId, userId);
      break;
    case '/monitor':
      await processTechnicalFeatures.handleMonitorCommand(chatId, userId);
      break;
    default:
      await sendMessage(chatId, 'Perintah tidak dikenali. Ketik /help untuk melihat daftar perintah.');
  }
}

async function handleRegularMessage(chatId: number, userId: number, text: string, session: BotSession | null) {
  // Process based on current state if session exists
  if (session) {
    switch (session.state) {
      case 'waiting_for_todo':
        await processManagementFeatures.addTodo(chatId, userId, text);
        return;
      case 'waiting_for_expense':
        await processManagementFeatures.addExpense(chatId, userId, text);
        return;
      case 'waiting_for_quiz_answer':
        await processEducationFeatures.answerQuiz(chatId, userId, text);
        return;
      case 'waiting_for_guess':
        await processEntertainmentFeatures.checkGuess(chatId, userId, parseInt(text));
        return;
      case 'waiting_for_trivia_answer':
        await processEntertainmentFeatures.checkTriviaAnswer(chatId, userId, parseInt(text));
        return;
    }
  }

  // Real-time auto-reply untuk pesan biasa
  if (text && text.length > 0) {
    await handleRealTimeReply(chatId, userId, text);
  }
}

async function handleRealTimeReply(chatId: number, userId: number, text: string) {
  const lowerText = text.toLowerCase();
  
  // Greetings detection
  if (lowerText.includes('halo') || lowerText.includes('hai') || lowerText.includes('hello') || 
      lowerText.includes('hi') || lowerText.includes('pagi') || lowerText.includes('siang') || 
      lowerText.includes('sore') || lowerText.includes('malam')) {
    await sendMessage(chatId, `👋 Halo! Senang bertemu dengan Anda!\n\nSaya siap membantu. Ketik /help untuk melihat daftar perintah yang tersedia.`);
    return;
  }

  // Question detection
  if (lowerText.includes('apa') || lowerText.includes('bagaimana') || lowerText.includes('kapan') || 
      lowerText.includes('dimana') || lowerText.includes('siapa') || lowerText.includes('mengapa')) {
    await sendMessage(chatId, `🤔 Pertanyaan yang menarik! Saya akan mencoba membantu.\n\nUntuk pertanyaan spesifik, Anda bisa menggunakan:\n• /translate untuk terjemahan\n• /quiz untuk kuis\n• /ai untuk bantuan AI\n\nAtau ketik /help untuk melihat semua fitur.`);
    return;
  }

  // Thank you detection
  if (lowerText.includes('terima kasih') || lowerText.includes('makasih') || lowerText.includes('thanks')) {
    await sendMessage(chatId, `😊 Sama-sama! Senang bisa membantu.\n\nAda lagi yang bisa saya bantu? Ketik /help untuk melihat semua fitur.`);
    return;
  }

  // Goodbye detection
  if (lowerText.includes('selamat tinggal') || lowerText.includes('bye') || lowerText.includes('dadah') || 
      lowerText.includes('sampai jumpa') || lowerText.includes('sampai ketemu')) {
    await sendMessage(chatId, `👋 Sampai jumpa! Semoga hari Anda menyenangkan.\n\nJangan ragu untuk kembali lagi kapan saja!`);
    return;
  }

  // Help request detection
  if (lowerText.includes('bantuan') || lowerText.includes('help') || lowerText.includes('tolong')) {
    await sendMessage(chatId, `🤖 Saya siap membantu Anda!\n\n📚 **Fitur yang tersedia:**\n• /translate - Terjemahan teks\n• /todo - Manajemen tugas\n• /quiz - Kuis interaktif\n• /game - Permainan\n• /movie - Info film\n• /shop - Toko online\n\nKetik /help untuk daftar lengkap.`);
    return;
  }

  // Time/date detection
  if (lowerText.includes('jam') || lowerText.includes('waktu') || lowerText.includes('tanggal') || 
      lowerText.includes('hari ini')) {
    const now = new Date();
    const timeString = now.toLocaleString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    await sendMessage(chatId, `🕐 **Waktu saat ini:**\n${timeString}\n\nApakah ada yang ingin Anda lakukan?`);
    return;
  }

  // Weather detection
  if (lowerText.includes('cuaca') || lowerText.includes('hujan') || lowerText.includes('panas') || 
      lowerText.includes('dingin') || lowerText.includes('mendung')) {
    await sendMessage(chatId, `🌤️ Untuk informasi cuaca yang akurat, saya sarankan menggunakan aplikasi cuaca terpercaya.\n\nTapi saya bisa membantu dengan hal lain! Ketik /help untuk melihat fitur yang tersedia.`);
    return;
  }

  // Food/restaurant detection
  if (lowerText.includes('makan') || lowerText.includes('restoran') || lowerText.includes('makanan') || 
      lowerText.includes('lapar') || lowerText.includes('kuliner')) {
    await sendMessage(chatId, `🍽️ Wah, sepertinya Anda sedang mencari tempat makan!\n\nSaya bisa membantu dengan:\n• /shop - Toko online untuk makanan\n• /booking - Reservasi restoran\n• /translate - Terjemahan menu\n\nAtau ketik /help untuk fitur lainnya.`);
    return;
  }

  // Entertainment detection
  if (lowerText.includes('film') || lowerText.includes('movie') || lowerText.includes('nonton') || 
      lowerText.includes('hiburan') || lowerText.includes('game')) {
    await sendMessage(chatId, `🎬 Tertarik dengan hiburan?\n\nSaya punya beberapa fitur:\n• /movie <judul> - Info film\n• /game - Permainan sederhana\n• /quiz - Kuis interaktif\n\nMau coba yang mana?`);
    return;
  }

  // Work/productivity detection
  if (lowerText.includes('kerja') || lowerText.includes('tugas') || lowerText.includes('kerjaan') || 
      lowerText.includes('produktif') || lowerText.includes('sibuk')) {
    await sendMessage(chatId, `💼 Saya bisa membantu produktivitas Anda!\n\n📋 **Fitur Produktivitas:**\n• /todo - Manajemen tugas\n• /expense - Tracking pengeluaran\n• /translate - Bantuan terjemahan\n• /ai - Asisten AI\n\nMau mulai dengan yang mana?`);
    return;
  }

  // Default intelligent response
  await sendMessage(chatId, `🤖 Terima kasih atas pesannya! Saya memahami bahwa Anda berkata: "${text}"\n\nSaya siap membantu dengan berbagai fitur. Coba ketik:\n• /help - Lihat semua fitur\n• /start - Mulai dari awal\n• /translate <teks> - Terjemahan\n• /todo - Manajemen tugas\n\nAtau ajukan pertanyaan spesifik!`);
}

async function sendWelcomeMessage(chatId: number) {
  const welcomeText = `
🤖 Selamat datang di Bot Platform!

Saya adalah bot multi-fungsi yang dapat membantu Anda dengan berbagai tugas:

📚 **Pendidikan & Pembelajaran**
• Kamus/Translate: /translate <teks>
• Quiz & Latihan: /quiz
• Catatan Pribadi: /notes

📋 **Manajemen & Produktivitas**
• To-Do List: /todo
• Tracking Pengeluaran: /expense
• Manajemen Grup: /group

🎮 **Hiburan**
• Game Sederhana: /game
• Info Film/Music: /movie
• Generator Meme: /meme

💼 **Bisnis & Layanan**
• E-commerce: /shop
• Reservasi: /booking
• Customer Support: /support

⚙️ **Teknis & Developer**
• GitHub Notifier: /github
• Server Monitor: /monitor
• AI Assistant: /ai

Ketik /help untuk melihat daftar lengkap perintah.
  `;

  await sendMessage(chatId, welcomeText);
}

async function sendHelpMessage(chatId: number) {
  const helpText = `
📖 **Daftar Perintah:**

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
/group - Manajemen grup

**Hiburan:**
/game - Mulai permainan
/movie <judul> - Cari info film
/meme - Generator meme

**Bisnis:**
/shop - Toko online
/booking - Sistem reservasi
/support - Customer support

**Teknis:**
/github - GitHub notifier
/monitor - Server monitoring
/ai - AI assistant

Pilih kategori yang Anda butuhkan!
  `;

  await sendMessage(chatId, helpText);
}

async function saveUser(user: BotUser) {
  try {
    const userRef = doc(db, 'users', user.id);
    await setDoc(userRef, user, { merge: true });
  } catch (error) {
    console.error('Error saving user:', error);
  }
}

async function getUserSession(userId: number, chatId: number): Promise<BotSession | null> {
  try {
    const sessionRef = doc(db, 'sessions', `${userId}_${chatId}`);
    const sessionSnap = await getDoc(sessionRef);
    
    if (sessionSnap.exists()) {
      return sessionSnap.data() as BotSession;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user session:', error);
    return null;
  }
}

export async function updateUserSession(userId: number, chatId: number, state: string, data: any = {}) {
  try {
    const sessionRef = doc(db, 'sessions', `${userId}_${chatId}`);
    await setDoc(sessionRef, {
      id: `${userId}_${chatId}`,
      userId,
      chatId,
      state,
      data,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user session:', error);
  }
}
