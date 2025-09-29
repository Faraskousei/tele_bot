import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { sendMessage } from '../telegram';
import { updateUserSession } from '../bot-handlers';
import { TodoItem, ExpenseItem } from '@/types/bot';

export const processManagementFeatures = {
  async handleTodoCommand(chatId: number, userId: number) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '➕ Tambah Todo', callback_data: 'todo:add' },
          { text: '📋 Lihat Todo', callback_data: 'todo:list' }
        ],
        [
          { text: '✅ Selesai', callback_data: 'todo:completed' },
          { text: '🗑️ Hapus', callback_data: 'todo:delete' }
        ],
        [
          { text: '🔙 Kembali ke Menu Utama', callback_data: 'main:menu' }
        ]
      ]
    };

    await sendMessage(chatId, '📋 **Manajemen To-Do List**\n\nPilih aksi yang ingin Anda lakukan:', { reply_markup: keyboard });
  },

  async handleTodoCallback(chatId: number, userId: number, action: string, params: string[]) {
    switch (action) {
      case 'add':
        await updateUserSession(userId, chatId, 'waiting_for_todo', {});
        await sendMessage(chatId, '📝 Silakan ketik tugas yang ingin Anda tambahkan:');
        break;
      
      case 'list':
        await this.listTodos(chatId, userId);
        break;
      
      case 'completed':
        await this.showCompletedTodos(chatId, userId);
        break;
      
      case 'delete':
        await this.showDeleteOptions(chatId, userId);
        break;
      
      case 'toggle':
        const todoId = params[0];
        await this.toggleTodo(chatId, userId, todoId);
        break;
      
      case 'delete_item':
        const deleteId = params[0];
        await this.deleteTodo(chatId, userId, deleteId);
        break;
    }
  },

  async addTodo(chatId: number, userId: number, text: string) {
    try {
      const todo: TodoItem = {
        id: Date.now().toString(),
        userId,
        text,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await addDoc(collection(db, 'todos'), todo);
      await sendMessage(chatId, '✅ Todo berhasil ditambahkan!');
      await updateUserSession(userId, chatId, 'idle');
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal menambahkan todo.');
    }
  },

  async listTodos(chatId: number, userId: number) {
    try {
      const todosRef = collection(db, 'todos');
      const q = query(
        todosRef, 
        where('userId', '==', userId), 
        where('completed', '==', false),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await sendMessage(chatId, '📋 Tidak ada todo yang belum selesai.');
        return;
      }

      let todosText = '📋 **To-Do List Aktif:**\n\n';
      const todoButtons = [];

      querySnapshot.forEach((doc) => {
        const todo = doc.data() as TodoItem;
        const status = todo.completed ? '✅' : '⭕';
        todosText += `${status} ${todo.text}\n`;
        
        todoButtons.push([
          { 
            text: `✅ ${todo.text.substring(0, 20)}${todo.text.length > 20 ? '...' : ''}`, 
            callback_data: `todo:toggle:${doc.id}` 
          }
        ]);
      });

      const keyboard = {
        inline_keyboard: todoButtons
      };

      await sendMessage(chatId, todosText, { reply_markup: keyboard });
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mengambil todo list.');
    }
  },

  async toggleTodo(chatId: number, userId: number, todoId: string) {
    try {
      const todoRef = doc(db, 'todos', todoId);
      const todoSnap = await getDoc(todoRef);
      
      if (todoSnap.exists()) {
        const todo = todoSnap.data() as TodoItem;
        await updateDoc(todoRef, {
          completed: !todo.completed,
          updatedAt: new Date()
        });
        
        const status = todo.completed ? 'dibuka kembali' : 'diselesaikan';
        await sendMessage(chatId, `✅ Todo telah ${status}!`);
        await this.listTodos(chatId, userId);
      }
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mengupdate todo.');
    }
  },

  async showDeleteOptions(chatId: number, userId: number) {
    try {
      const todosRef = collection(db, 'todos');
      const q = query(todosRef, where('userId', '==', userId), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await sendMessage(chatId, '📋 Tidak ada todo untuk dihapus.');
        return;
      }

      const deleteButtons = [];
      querySnapshot.forEach((doc) => {
        const todo = doc.data() as TodoItem;
        deleteButtons.push([
          { 
            text: `🗑️ ${todo.text.substring(0, 25)}${todo.text.length > 25 ? '...' : ''}`, 
            callback_data: `todo:delete_item:${doc.id}` 
          }
        ]);
      });

      const keyboard = {
        inline_keyboard: deleteButtons
      };

      await sendMessage(chatId, '🗑️ **Pilih todo yang ingin dihapus:**', { reply_markup: keyboard });
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mengambil daftar todo.');
    }
  },

  async deleteTodo(chatId: number, userId: number, todoId: string) {
    try {
      const todoRef = doc(db, 'todos', todoId);
      await updateDoc(todoRef, {
        completed: true,
        updatedAt: new Date()
      });
      
      await sendMessage(chatId, '🗑️ Todo berhasil dihapus!');
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal menghapus todo.');
    }
  },

  async showCompletedTodos(chatId: number, userId: number) {
    try {
      const todosRef = collection(db, 'todos');
      const q = query(
        todosRef, 
        where('userId', '==', userId), 
        where('completed', '==', true),
        orderBy('updatedAt', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await sendMessage(chatId, '✅ Tidak ada todo yang sudah selesai.');
        return;
      }

      let todosText = '✅ **Todo yang Sudah Selesai:**\n\n';
      querySnapshot.forEach((doc) => {
        const todo = doc.data() as TodoItem;
        const date = todo.updatedAt.toDate().toLocaleDateString('id-ID');
        todosText += `✅ ${todo.text}\n📅 Selesai: ${date}\n\n`;
      });

      await sendMessage(chatId, todosText);
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mengambil todo yang sudah selesai.');
    }
  },

  // Expense Tracking Features
  async handleExpenseCommand(chatId: number, userId: number) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '💰 Tambah Pengeluaran', callback_data: 'expense:add_expense' },
          { text: '💵 Tambah Pemasukan', callback_data: 'expense:add_income' }
        ],
        [
          { text: '📊 Lihat Laporan', callback_data: 'expense:report' },
          { text: '📋 Riwayat', callback_data: 'expense:history' }
        ]
      ]
    };

    await sendMessage(chatId, '💰 **Tracking Pengeluaran & Pemasukan**\n\nPilih aksi yang ingin Anda lakukan:', { reply_markup: keyboard });
  },

  async handleExpenseCallback(chatId: number, userId: number, action: string, params: string[]) {
    switch (action) {
      case 'add_expense':
        await updateUserSession(userId, chatId, 'waiting_for_expense', { type: 'expense' });
        await sendMessage(chatId, '💰 Silakan ketik pengeluaran dalam format:\n\n**Jumlah Kategori Deskripsi**\n\nContoh: 50000 Makanan Nasi gudeg');
        break;
      
      case 'add_income':
        await updateUserSession(userId, chatId, 'waiting_for_expense', { type: 'income' });
        await sendMessage(chatId, '💵 Silakan ketik pemasukan dalam format:\n\n**Jumlah Kategori Deskripsi**\n\nContoh: 5000000 Gaji Gaji bulanan');
        break;
      
      case 'report':
        await this.showExpenseReport(chatId, userId);
        break;
      
      case 'history':
        await this.showExpenseHistory(chatId, userId);
        break;
    }
  },

  async addExpense(chatId: number, userId: number, text: string) {
    try {
      const parts = text.trim().split(' ');
      if (parts.length < 3) {
        await sendMessage(chatId, '❌ Format tidak benar. Gunakan: **Jumlah Kategori Deskripsi**');
        return;
      }

      const amount = parseInt(parts[0]);
      const category = parts[1];
      const description = parts.slice(2).join(' ');

      if (isNaN(amount)) {
        await sendMessage(chatId, '❌ Jumlah harus berupa angka.');
        return;
      }

      // Get session data to determine type
      const sessionRef = doc(db, 'sessions', `${userId}_${chatId}`);
      const sessionSnap = await getDoc(sessionRef);
      const expenseType = sessionSnap.exists() ? sessionSnap.data().data.type : 'expense';

      const expense: ExpenseItem = {
        id: Date.now().toString(),
        userId,
        amount,
        description,
        category,
        type: expenseType as 'income' | 'expense',
        createdAt: new Date()
      };

      await addDoc(collection(db, 'expenses'), expense);
      
      const typeText = expenseType === 'income' ? 'pemasukan' : 'pengeluaran';
      const emoji = expenseType === 'income' ? '💵' : '💰';
      
      await sendMessage(chatId, `${emoji} ${typeText.charAt(0).toUpperCase() + typeText.slice(1)} berhasil dicatat!\n\n**Jumlah:** Rp ${amount.toLocaleString('id-ID')}\n**Kategori:** ${category}\n**Deskripsi:** ${description}`);
      
      await updateUserSession(userId, chatId, 'idle');
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mencatat transaksi.');
    }
  },

  async showExpenseReport(chatId: number, userId: number) {
    try {
      const expensesRef = collection(db, 'expenses');
      const q = query(
        expensesRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await sendMessage(chatId, '📊 Belum ada catatan keuangan.');
        return;
      }

      let totalIncome = 0;
      let totalExpense = 0;
      const categories: Record<string, number> = {};

      querySnapshot.forEach((doc) => {
        const expense = doc.data() as ExpenseItem;
        if (expense.type === 'income') {
          totalIncome += expense.amount;
        } else {
          totalExpense += expense.amount;
          categories[expense.category] = (categories[expense.category] || 0) + expense.amount;
        }
      });

      const balance = totalIncome - totalExpense;
      
      let reportText = '📊 **Laporan Keuangan**\n\n';
      reportText += `💵 **Total Pemasukan:** Rp ${totalIncome.toLocaleString('id-ID')}\n`;
      reportText += `💰 **Total Pengeluaran:** Rp ${totalExpense.toLocaleString('id-ID')}\n`;
      reportText += `⚖️ **Saldo:** Rp ${balance.toLocaleString('id-ID')}\n\n`;
      
      if (Object.keys(categories).length > 0) {
        reportText += '📋 **Pengeluaran per Kategori:**\n';
        Object.entries(categories)
          .sort(([,a], [,b]) => b - a)
          .forEach(([category, amount]) => {
            reportText += `• ${category}: Rp ${amount.toLocaleString('id-ID')}\n`;
          });
      }

      await sendMessage(chatId, reportText);
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal membuat laporan keuangan.');
    }
  },

  async showExpenseHistory(chatId: number, userId: number) {
    try {
      const expensesRef = collection(db, 'expenses');
      const q = query(
        expensesRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await sendMessage(chatId, '📋 Belum ada riwayat transaksi.');
        return;
      }

      let historyText = '📋 **Riwayat Transaksi Terbaru:**\n\n';
      querySnapshot.forEach((doc) => {
        const expense = doc.data() as ExpenseItem;
        const date = expense.createdAt.toDate().toLocaleDateString('id-ID');
        const emoji = expense.type === 'income' ? '💵' : '💰';
        const typeText = expense.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
        
        historyText += `${emoji} **${typeText}**\n`;
        historyText += `💰 Rp ${expense.amount.toLocaleString('id-ID')}\n`;
        historyText += `📂 ${expense.category}\n`;
        historyText += `📝 ${expense.description}\n`;
        historyText += `📅 ${date}\n\n`;
      });

      await sendMessage(chatId, historyText);
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mengambil riwayat transaksi.');
    }
  }
};
