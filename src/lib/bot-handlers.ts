import { collection, doc, setDoc, getDoc, updateDoc, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from './firebase';
import { sendMessage, answerCallbackQuery } from './telegram';
import { BotUser, BotSession, BotCategory, TodoItem, ExpenseItem } from '@/types/bot';
import { processEducationFeatures } from './features/education';
import { processManagementFeatures } from './features/management';
import { processEntertainmentFeatures } from './features/entertainment';
import { processBusinessFeatures } from './features/business';
import { processTechnicalFeatures } from './features/technical';

export async function processMessage(update: any) {
  const message = update.message;
  const callbackQuery = update.callback_query;

  if (message) {
    await handleMessage(message);
  } else if (callbackQuery) {
    await handleCallbackQuery(callbackQuery);
  }
}

async function handleMessage(message: any) {
  const chatId = message.chat.id;
  const userId = message.from.id;
  const text = message.text;
  const username = message.from.username;
  const firstName = message.from.first_name;
  const lastName = message.from.last_name;

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

  // Process based on session state or command
  if (text?.startsWith('/')) {
    await handleCommand(chatId, userId, text, session);
  } else {
    await handleRegularMessage(chatId, userId, text, session);
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
  if (!session) return;

  // Process based on current state
  switch (session.state) {
    case 'waiting_for_todo':
      await processManagementFeatures.addTodo(chatId, userId, text);
      break;
    case 'waiting_for_expense':
      await processManagementFeatures.addExpense(chatId, userId, text);
      break;
    case 'waiting_for_quiz_answer':
      await processEducationFeatures.answerQuiz(chatId, userId, text);
      break;
    default:
      // Default: try to translate or process as general message
      if (text && text.length > 2) {
        await processEducationFeatures.translateText(chatId, text);
      }
  }
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
