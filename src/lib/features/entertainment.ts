import { collection, doc, setDoc, getDoc, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { sendMessage } from '../telegram';
import { updateUserSession } from '../bot-handlers';

export const processEntertainmentFeatures = {
  async handleGameCommand(chatId: number, userId: number) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '🎯 Tebak Angka', callback_data: 'game:guess_number' },
          { text: '🧩 Trivia Quiz', callback_data: 'game:trivia' }
        ],
        [
          { text: '🎲 Rolling Dice', callback_data: 'game:dice' },
          { text: '🎰 Random Quote', callback_data: 'game:quote' }
        ]
      ]
    };

    await sendMessage(chatId, '🎮 **Game & Hiburan**\n\nPilih permainan yang ingin Anda mainkan:', { reply_markup: keyboard });
  },

  async handleGameCallback(chatId: number, userId: number, action: string, params: string[]) {
    switch (action) {
      case 'guess_number':
        await this.startGuessNumberGame(chatId, userId);
        break;
      
      case 'trivia':
        await this.startTriviaQuiz(chatId, userId);
        break;
      
      case 'dice':
        await this.rollDice(chatId, userId);
        break;
      
      case 'quote':
        await this.getRandomQuote(chatId, userId);
        break;
      
      case 'guess':
        const guessedNumber = parseInt(params[0]);
        await this.checkGuess(chatId, userId, guessedNumber);
        break;
      
      case 'trivia_answer':
        const answer = parseInt(params[0]);
        await this.checkTriviaAnswer(chatId, userId, answer);
        break;
    }
  },

  async startGuessNumberGame(chatId: number, userId: number) {
    const randomNumber = Math.floor(Math.random() * 100) + 1;
    
    await updateUserSession(userId, chatId, 'playing_guess_number', {
      targetNumber: randomNumber,
      attempts: 0,
      maxAttempts: 7
    });

    await sendMessage(chatId, '🎯 **Game Tebak Angka**\n\nSaya sudah memikirkan angka antara 1-100!\nAnda punya 7 kesempatan untuk menebak.\n\nSilakan tebak angka yang Anda pikirkan:');
  },

  async checkGuess(chatId: number, userId: number, guessedNumber: number) {
    try {
      const sessionRef = doc(db, 'sessions', `${userId}_${chatId}`);
      const sessionSnap = await getDoc(sessionRef);
      
      if (!sessionSnap.exists()) {
        await sendMessage(chatId, '❌ Game tidak ditemukan. Mulai ulang dengan /game');
        return;
      }

      const session = sessionSnap.data();
      const { targetNumber, attempts, maxAttempts } = session.data;
      
      const newAttempts = attempts + 1;
      
      if (guessedNumber === targetNumber) {
        await sendMessage(chatId, `🎉 **Selamat! Anda menang!**\n\nAngka yang benar adalah **${targetNumber}**\nAnda berhasil menebak dalam **${newAttempts}** percobaan!`);
        await updateUserSession(userId, chatId, 'idle');
        return;
      }
      
      if (newAttempts >= maxAttempts) {
        await sendMessage(chatId, `😞 **Game Over!**\n\nAngka yang benar adalah **${targetNumber}**\nAnda sudah menggunakan semua kesempatan.`);
        await updateUserSession(userId, chatId, 'idle');
        return;
      }
      
      const hint = guessedNumber > targetNumber ? 'terlalu besar' : 'terlalu kecil';
      const remainingAttempts = maxAttempts - newAttempts;
      
      await sendMessage(chatId, `❌ **Salah!** Angka Anda ${hint}.\n\nPercobaan: ${newAttempts}/${maxAttempts}\nKesempatan tersisa: ${remainingAttempts}\n\nCoba lagi:`);
      
      await updateUserSession(userId, chatId, 'playing_guess_number', {
        ...session.data,
        attempts: newAttempts
      });
      
    } catch (error) {
      await sendMessage(chatId, '❌ Terjadi kesalahan dalam game.');
    }
  },

  async startTriviaQuiz(chatId: number, userId: number) {
    const triviaQuestions = [
      {
        question: "Apa nama planet terdekat dengan Matahari?",
        options: ["Venus", "Mercury", "Mars", "Jupiter"],
        correctAnswer: 1,
        explanation: "Mercury adalah planet terdekat dengan Matahari dalam tata surya kita."
      },
      {
        question: "Berapa banyak hari dalam setahun kabisat?",
        options: ["365", "366", "364", "367"],
        correctAnswer: 1,
        explanation: "Tahun kabisat memiliki 366 hari karena bulan Februari memiliki 29 hari."
      },
      {
        question: "Apa nama samudera terbesar di dunia?",
        options: ["Atlantik", "Pasifik", "Hindia", "Arktik"],
        correctAnswer: 1,
        explanation: "Samudera Pasifik adalah samudera terbesar di dunia."
      }
    ];

    const randomQuestion = triviaQuestions[Math.floor(Math.random() * triviaQuestions.length)];
    
    const keyboard = {
      inline_keyboard: [
        randomQuestion.options.map((option, index) => ({
          text: option,
          callback_data: `game:trivia_answer:${index}`
        }))
      ]
    };

    await updateUserSession(userId, chatId, 'playing_trivia', {
      question: randomQuestion,
      startTime: new Date()
    });

    await sendMessage(chatId, `🧩 **Trivia Quiz**\n\n❓ **${randomQuestion.question}**`, { reply_markup: keyboard });
  },

  async checkTriviaAnswer(chatId: number, userId: number, selectedAnswer: number) {
    try {
      const sessionRef = doc(db, 'sessions', `${userId}_${chatId}`);
      const sessionSnap = await getDoc(sessionRef);
      
      if (!sessionSnap.exists()) {
        await sendMessage(chatId, '❌ Quiz tidak ditemukan.');
        return;
      }

      const session = sessionSnap.data();
      const { question } = session.data;
      
      const isCorrect = selectedAnswer === question.correctAnswer;
      const correctAnswerText = question.options[question.correctAnswer];
      
      let responseText = '';
      
      if (isCorrect) {
        responseText = '🎉 **Benar!** Jawaban Anda tepat!\n\n';
      } else {
        responseText = `❌ **Salah!** Jawaban yang benar adalah **${correctAnswerText}**\n\n`;
      }
      
      responseText += `📚 **Penjelasan:** ${question.explanation}\n\n`;
      
      const keyboard = {
        inline_keyboard: [[
          { text: '🧩 Pertanyaan Lainnya', callback_data: 'game:trivia' },
          { text: '🎮 Menu Game', callback_data: 'game:menu' }
        ]]
      };
      
      await sendMessage(chatId, responseText, { reply_markup: keyboard });
      await updateUserSession(userId, chatId, 'idle');
      
    } catch (error) {
      await sendMessage(chatId, '❌ Terjadi kesalahan dalam quiz.');
    }
  },

  async rollDice(chatId: number, userId: number) {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2;
    
    const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    
    let resultText = '🎲 **Rolling Dice**\n\n';
    resultText += `${diceEmojis[dice1 - 1]} **Dadu 1:** ${dice1}\n`;
    resultText += `${diceEmojis[dice2 - 1]} **Dadu 2:** ${dice2}\n`;
    resultText += `🎯 **Total:** ${total}\n\n`;
    
    if (total === 7 || total === 11) {
      resultText += '🎉 **Lucky!** Angka keberuntungan!';
    } else if (total === 2 || total === 12) {
      resultText += '😱 **Wow!** Angka ekstrem!';
    } else if (dice1 === dice2) {
      resultText += '🎊 **Double!** Kedua dadu sama!';
    }

    const keyboard = {
      inline_keyboard: [[
        { text: '🎲 Roll Lagi', callback_data: 'game:dice' }
      ]]
    };

    await sendMessage(chatId, resultText, { reply_markup: keyboard });
  },

  async getRandomQuote(chatId: number, userId: number) {
    const quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs"
      },
      {
        text: "Life is what happens when you're busy making other plans.",
        author: "John Lennon"
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt"
      },
      {
        text: "It is during our darkest moments that we must focus to see the light.",
        author: "Aristotle"
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill"
      }
    ];

    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    
    let quoteText = '🎰 **Random Quote of the Day**\n\n';
    quoteText += `💭 "${randomQuote.text}"\n\n`;
    quoteText += `👤 — ${randomQuote.author}`;

    const keyboard = {
      inline_keyboard: [[
        { text: '🎰 Quote Lainnya', callback_data: 'game:quote' }
      ]]
    };

    await sendMessage(chatId, quoteText, { reply_markup: keyboard });
  },

  async handleMovieCommand(chatId: number, userId: number, text: string) {
    const movieTitle = text.replace('/movie', '').trim();
    
    if (!movieTitle) {
      await sendMessage(chatId, 'Silakan ketik judul film yang ingin dicari.\nContoh: /movie Avengers');
      return;
    }

    try {
      // Mock movie data - in production, integrate with TMDB API
      const mockMovies = [
        {
          title: "Avengers: Endgame",
          year: 2019,
          rating: 8.4,
          genre: "Action, Adventure, Drama",
          plot: "After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more to reverse Thanos' actions and restore balance to the universe."
        },
        {
          title: "The Dark Knight",
          year: 2008,
          rating: 9.0,
          genre: "Action, Crime, Drama",
          plot: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice."
        }
      ];

      const foundMovie = mockMovies.find(movie => 
        movie.title.toLowerCase().includes(movieTitle.toLowerCase())
      );

      if (foundMovie) {
        let movieText = '🎬 **Info Film**\n\n';
        movieText += `🎭 **Judul:** ${foundMovie.title}\n`;
        movieText += `📅 **Tahun:** ${foundMovie.year}\n`;
        movieText += `⭐ **Rating:** ${foundMovie.rating}/10\n`;
        movieText += `🎭 **Genre:** ${foundMovie.genre}\n`;
        movieText += `📖 **Sinopsis:** ${foundMovie.plot}`;

        await sendMessage(chatId, movieText);
      } else {
        await sendMessage(chatId, `❌ Film "${movieTitle}" tidak ditemukan.\n\nCoba dengan judul film populer seperti:\n• Avengers\n• The Dark Knight\n• Inception`);
      }
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mencari info film. Silakan coba lagi.');
    }
  },

  async handleMemeCommand(chatId: number, userId: number) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '😀 Meme Lucu', callback_data: 'meme:funny' },
          { text: '🤔 Meme Motivasi', callback_data: 'meme:meme' }
        ],
        [
          { text: '🎭 Meme Random', callback_data: 'meme:random' }
        ]
      ]
    };

    await sendMessage(chatId, '🎭 **Generator Meme**\n\nPilih jenis meme yang ingin Anda lihat:', { reply_markup: keyboard });
  },

  async handleMemeCallback(chatId: number, userId: number, action: string, params: string[]) {
    const memes = {
      funny: [
        { text: "When you realize it's Monday tomorrow", image: "😭" },
        { text: "Me trying to adult", image: "🤯" },
        { text: "When the WiFi is slow", image: "😤" }
      ],
      motivation: [
        { text: "You can do it!", image: "💪" },
        { text: "Keep going!", image: "🔥" },
        { text: "Success is coming!", image: "⭐" }
      ],
      random: [
        { text: "This is fine", image: "🔥" },
        { text: "Big brain time", image: "🧠" },
        { text: "Task failed successfully", image: "✅" }
      ]
    };

    const category = action || 'random';
    const categoryMemes = memes[category] || memes.random;
    const randomMeme = categoryMemes[Math.floor(Math.random() * categoryMemes.length)];

    let memeText = '🎭 **Meme Generator**\n\n';
    memeText += `${randomMeme.image} **${randomMeme.text}**`;

    const keyboard = {
      inline_keyboard: [
        [
          { text: '🎭 Meme Lainnya', callback_data: `meme:${category}` }
        ]
      ]
    };

    await sendMessage(chatId, memeText, { reply_markup: keyboard });
  }
};
