import TelegramBot from 'node-telegram-bot-api';

// Bot instance
let bot: TelegramBot | null = null;

export const getBot = () => {
  if (!bot && process.env.TELEGRAM_BOT_TOKEN) {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
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

export const sendMessage = async (chatId: number | string, text: string, options?: any) => {
  const botInstance = getBot();
  if (botInstance) {
    return await botInstance.sendMessage(chatId, text, options);
  }
  throw new Error('Bot not initialized');
};

export const sendPhoto = async (chatId: number | string, photo: string | Buffer, options?: any) => {
  const botInstance = getBot();
  if (botInstance) {
    return await botInstance.sendPhoto(chatId, photo, options);
  }
  throw new Error('Bot not initialized');
};

export const sendDocument = async (chatId: number | string, document: string | Buffer, options?: any) => {
  const botInstance = getBot();
  if (botInstance) {
    return await botInstance.sendDocument(chatId, document, options);
  }
  throw new Error('Bot not initialized');
};

export const answerCallbackQuery = async (callbackQueryId: string, text?: string, options?: any) => {
  const botInstance = getBot();
  if (botInstance) {
    return await botInstance.answerCallbackQuery(callbackQueryId, { text, ...options });
  }
  throw new Error('Bot not initialized');
};
