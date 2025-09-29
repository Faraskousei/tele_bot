import TelegramBot from 'node-telegram-bot-api';

// Bot instance
let bot: TelegramBot | null = null;

export const getBot = () => {
  if (!bot) {
    // Use hardcoded token for now since env var is not set
    const token = process.env.TELEGRAM_BOT_TOKEN || '8311046872:AAFJz-zTPe4X49YWyibejV4-ydDYl_jPdMw';
    bot = new TelegramBot(token, { polling: false });
  }
  return bot;
};

export const initializeBot = async () => {
  const botInstance = getBot();
  if (botInstance) {
    // Set webhook for production
    if (process.env.TELEGRAM_WEBHOOK_URL) {
      await botInstance.setWebHook(process.env.TELEGRAM_WEBHOOK_URL);
    }
  }
  return botInstance;
};

export const sendMessage = async (chatId: number | string, text: string, options?: TelegramBot.SendMessageOptions) => {
  try {
    const botInstance = getBot();
    if (botInstance) {
      // Validate chatId
      if (!chatId || chatId === 0) {
        console.error('❌ Invalid chatId:', chatId);
        return null;
      }
      
      console.log('📤 Sending message:', { chatId, text: text.substring(0, 100), options });
      const result = await botInstance.sendMessage(chatId, text, options);
      console.log('✅ Message sent successfully:', result.message_id);
      return result;
    }
    throw new Error('Bot not initialized');
  } catch (error) {
    console.error('❌ Error sending message:', error);
    // Don't throw error to prevent webhook failure
    return null;
  }
};

export const sendPhoto = async (chatId: number | string, photo: string | Buffer, options?: TelegramBot.SendPhotoOptions) => {
  const botInstance = getBot();
  if (botInstance) {
    return await botInstance.sendPhoto(chatId, photo, options);
  }
  throw new Error('Bot not initialized');
};

export const sendDocument = async (chatId: number | string, document: string | Buffer, options?: TelegramBot.SendDocumentOptions) => {
  const botInstance = getBot();
  if (botInstance) {
    return await botInstance.sendDocument(chatId, document, options);
  }
  throw new Error('Bot not initialized');
};

export const answerCallbackQuery = async (callbackQueryId: string, text?: string, options?: TelegramBot.AnswerCallbackQueryOptions) => {
  const botInstance = getBot();
  if (botInstance) {
    return await botInstance.answerCallbackQuery(callbackQueryId, { text, ...options });
  }
  throw new Error('Bot not initialized');
};
