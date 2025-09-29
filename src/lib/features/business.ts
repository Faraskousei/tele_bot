import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { sendMessage } from '../telegram';
import { updateUserSession } from '../bot-handlers';

export const processBusinessFeatures = {
  async handleShopCommand(chatId: number, userId: number) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '🛍️ Lihat Produk', callback_data: 'shop:products' },
          { text: '🛒 Keranjang', callback_data: 'shop:cart' }
        ],
        [
          { text: '📦 Pesanan Saya', callback_data: 'shop:orders' },
          { text: '💳 Checkout', callback_data: 'shop:checkout' }
        ]
      ]
    };

    await sendMessage(chatId, '🛍️ **Toko Online**\n\nSelamat datang di toko kami! Pilih menu yang Anda inginkan:', { reply_markup: keyboard });
  },

  async handleShopCallback(chatId: number, userId: number, action: string, params: string[]) {
    switch (action) {
      case 'products':
        await processBusinessFeatures.showProducts(chatId, userId);
        break;
      
      case 'cart':
        await processBusinessFeatures.showCart(chatId, userId);
        break;
      
      case 'orders':
        await processBusinessFeatures.showOrders(chatId, userId);
        break;
      
      case 'checkout':
        await processBusinessFeatures.processCheckout(chatId, userId);
        break;
      
      case 'add_to_cart':
        const productId = params[0];
        await processBusinessFeatures.addToCart(chatId, userId, productId);
        break;
      
      case 'remove_from_cart':
        const removeId = params[0];
        await processBusinessFeatures.removeFromCart(chatId, userId, removeId);
        break;
    }
  },

  async showProducts(chatId: number, userId: number) {
    // Mock product data - in production, fetch from database
    const products = [
      {
        id: '1',
        name: 'Laptop Gaming',
        price: 15000000,
        description: 'Laptop gaming dengan spesifikasi tinggi',
        category: 'Electronics',
        stock: 10
      },
      {
        id: '2',
        name: 'Smartphone Flagship',
        price: 8000000,
        description: 'Smartphone dengan kamera terbaik',
        category: 'Electronics',
        stock: 25
      },
      {
        id: '3',
        name: 'Sepatu Sneakers',
        price: 500000,
        description: 'Sepatu olahraga yang nyaman',
        category: 'Fashion',
        stock: 50
      },
      {
        id: '4',
        name: 'Buku Programming',
        price: 150000,
        description: 'Buku panduan programming lengkap',
        category: 'Books',
        stock: 100
      }
    ];

    let productsText = '🛍️ **Katalog Produk**\n\n';
    
    products.forEach((product, index) => {
      productsText += `**${index + 1}. ${product.name}**\n`;
      productsText += `💰 Rp ${product.price.toLocaleString('id-ID')}\n`;
      productsText += `📝 ${product.description}\n`;
      productsText += `📂 ${product.category}\n`;
      productsText += `📦 Stock: ${product.stock}\n\n`;
    });

    const keyboard = {
      inline_keyboard: products.map(product => [
        {
          text: `🛒 ${product.name} - Rp ${product.price.toLocaleString('id-ID')}`,
          callback_data: `shop:add_to_cart:${product.id}`
        }
      ])
    };

    await sendMessage(chatId, productsText, { reply_markup: keyboard });
  },

  async addToCart(chatId: number, userId: number, productId: string) {
    try {
      // In production, implement proper cart management
      await sendMessage(chatId, '✅ Produk berhasil ditambahkan ke keranjang!');
      await processBusinessFeatures.showCart(chatId, userId);
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal menambahkan produk ke keranjang.');
    }
  },

  async removeFromCart(chatId: number, userId: number, productId: string) {
    try {
      // In production, implement proper cart management
      await sendMessage(chatId, '✅ Produk berhasil dihapus dari keranjang!');
      await processBusinessFeatures.showCart(chatId, userId);
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal menghapus produk dari keranjang.');
    }
  },

  async showCart(chatId: number, userId: number) {
    try {
      const cartRef = collection(db, 'cart');
      const q = query(cartRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await sendMessage(chatId, '🛒 Keranjang Anda kosong.');
        return;
      }

      let cartText = '🛒 **Keranjang Belanja**\n\n';
      let totalPrice = 0;

      // Mock product data for cart display
      const products = {
        '1': { name: 'Laptop Gaming', price: 15000000 },
        '2': { name: 'Smartphone Flagship', price: 8000000 },
        '3': { name: 'Sepatu Sneakers', price: 500000 },
        '4': { name: 'Buku Programming', price: 150000 }
      };

      querySnapshot.forEach((doc) => {
        const cartItem = doc.data() as { productId: string; quantity: number };
        const product = products[cartItem.productId as keyof typeof products];
        if (product) {
          const itemTotal = product.price * cartItem.quantity;
          totalPrice += itemTotal;
          
          cartText += `📦 ${product.name}\n`;
          cartText += `💰 Rp ${product.price.toLocaleString('id-ID')} x ${cartItem.quantity}\n`;
          cartText += `📊 Subtotal: Rp ${itemTotal.toLocaleString('id-ID')}\n\n`;
        }
      });

      cartText += `💳 **Total: Rp ${totalPrice.toLocaleString('id-ID')}**`;

      const keyboard = {
        inline_keyboard: [
          [
            { text: '💳 Checkout', callback_data: 'shop:checkout' },
            { text: '🛍️ Lanjut Belanja', callback_data: 'shop:products' }
          ]
        ]
      };

      await sendMessage(chatId, cartText, { reply_markup: keyboard });
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mengambil keranjang belanja.');
    }
  },

  async processCheckout(chatId: number, userId: number) {
    try {
      const cartRef = collection(db, 'cart');
      const q = query(cartRef, where('userId', '==', userId));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await sendMessage(chatId, '❌ Keranjang kosong. Tidak ada yang bisa di-checkout.');
        return;
      }

      // Create order
      const orderId = Date.now().toString();
      let totalPrice = 0;
      const orderItems: Array<{ name: string; price: number; quantity: number }> = [];

      const products = {
        '1': { name: 'Laptop Gaming', price: 15000000 },
        '2': { name: 'Smartphone Flagship', price: 8000000 },
        '3': { name: 'Sepatu Sneakers', price: 500000 },
        '4': { name: 'Buku Programming', price: 150000 }
      };

      querySnapshot.forEach((doc) => {
        const cartItem = doc.data();
        const product = products[cartItem.productId];
        if (product) {
          const itemTotal = product.price * cartItem.quantity;
          totalPrice += itemTotal;
          
          orderItems.push({
            productId: cartItem.productId,
            productName: product.name,
            price: product.price,
            quantity: cartItem.quantity,
            subtotal: itemTotal
          });
        }
      });

      // Save order
      await addDoc(collection(db, 'orders'), {
        orderId,
        userId,
        items: orderItems,
        totalPrice,
        status: 'pending',
        createdAt: new Date()
      });

      // Clear cart
      querySnapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });

      let orderText = '✅ **Checkout Berhasil!**\n\n';
      orderText += `🆔 **Order ID:** ${orderId}\n`;
      orderText += `📅 **Tanggal:** ${new Date().toLocaleDateString('id-ID')}\n\n`;
      orderText += '📦 **Detail Pesanan:**\n';
      
      orderItems.forEach(item => {
        orderText += `• ${item.productName} x${item.quantity}\n`;
        orderText += `  Rp ${item.subtotal.toLocaleString('id-ID')}\n`;
      });
      
      orderText += `\n💳 **Total:** Rp ${totalPrice.toLocaleString('id-ID')}\n`;
      orderText += `📊 **Status:** Menunggu Konfirmasi`;

      await sendMessage(chatId, orderText);
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal memproses checkout.');
    }
  },

  async showOrders(chatId: number, userId: number) {
    try {
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef, 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        await sendMessage(chatId, '📦 Anda belum memiliki pesanan.');
        return;
      }

      let ordersText = '📦 **Riwayat Pesanan**\n\n';
      
      querySnapshot.forEach((doc) => {
        const order = doc.data();
        const date = order.createdAt.toDate().toLocaleDateString('id-ID');
        
        ordersText += `🆔 **Order ID:** ${order.orderId}\n`;
        ordersText += `📅 **Tanggal:** ${date}\n`;
        ordersText += `💰 **Total:** Rp ${order.totalPrice.toLocaleString('id-ID')}\n`;
        ordersText += `📊 **Status:** ${order.status}\n`;
        ordersText += `📦 **Items:** ${order.items.length} produk\n\n`;
      });

      await sendMessage(chatId, ordersText);
    } catch (error) {
      await sendMessage(chatId, '❌ Gagal mengambil riwayat pesanan.');
    }
  },

  async handleBookingCommand(chatId: number, userId: number) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '🏨 Hotel', callback_data: 'booking:hotel' },
          { text: '✈️ Flight', callback_data: 'booking:flight' }
        ],
        [
          { text: '🍽️ Restaurant', callback_data: 'booking:restaurant' },
          { text: '🎓 Course', callback_data: 'booking:course' }
        ]
      ]
    };

    await sendMessage(chatId, '📅 **Sistem Reservasi**\n\nPilih jenis reservasi yang Anda butuhkan:', { reply_markup: keyboard });
  },

  async handleBookingCallback(chatId: number, userId: number, action: string, params: string[]) {
    switch (action) {
      case 'hotel':
        await processBusinessFeatures.showHotelBooking(chatId, userId);
        break;
      
      case 'flight':
        await processBusinessFeatures.showFlightBooking(chatId, userId);
        break;
      
      case 'restaurant':
        await processBusinessFeatures.showRestaurantBooking(chatId, userId);
        break;
      
      case 'course':
        await processBusinessFeatures.showCourseBooking(chatId, userId);
        break;
    }
  },

  async showHotelBooking(chatId: number, userId: number) {
    const hotels = [
      { name: 'Hotel Grand Indonesia', price: 800000, rating: 4.5 },
      { name: 'Hotel Shangri-La', price: 1200000, rating: 4.8 },
      { name: 'Hotel Ibis Budget', price: 300000, rating: 3.9 }
    ];

    let hotelsText = '🏨 **Pilihan Hotel**\n\n';
    
    hotels.forEach((hotel, index) => {
      hotelsText += `**${index + 1}. ${hotel.name}**\n`;
      hotelsText += `💰 Rp ${hotel.price.toLocaleString('id-ID')}/malam\n`;
      hotelsText += `⭐ Rating: ${hotel.rating}/5\n\n`;
    });

    const keyboard = {
      inline_keyboard: hotels.map((hotel, index) => [
        {
          text: `🏨 ${hotel.name}`,
          callback_data: `booking:hotel_select:${index}`
        }
      ])
    };

    await sendMessage(chatId, hotelsText, { reply_markup: keyboard });
  },

  async showFlightBooking(chatId: number, userId: number) {
    const flights = [
      { from: 'Jakarta', to: 'Surabaya', price: 500000, airline: 'Garuda Indonesia' },
      { from: 'Jakarta', to: 'Bali', price: 800000, airline: 'Lion Air' },
      { from: 'Jakarta', to: 'Medan', price: 600000, airline: 'AirAsia' }
    ];

    let flightsText = '✈️ **Pilihan Penerbangan**\n\n';
    
    flights.forEach((flight, index) => {
      flightsText += `**${index + 1}. ${flight.from} → ${flight.to}**\n`;
      flightsText += `✈️ ${flight.airline}\n`;
      flightsText += `💰 Rp ${flight.price.toLocaleString('id-ID')}\n\n`;
    });

    const keyboard = {
      inline_keyboard: flights.map((flight, index) => [
        {
          text: `✈️ ${flight.from} → ${flight.to}`,
          callback_data: `booking:flight_select:${index}`
        }
      ])
    };

    await sendMessage(chatId, flightsText, { reply_markup: keyboard });
  },

  async showRestaurantBooking(chatId: number, userId: number) {
    const restaurants = [
      { name: 'Restoran Padang Sederhana', cuisine: 'Indonesian', price: '$$' },
      { name: 'Sushi Tei', cuisine: 'Japanese', price: '$$$' },
      { name: 'McDonald\'s', cuisine: 'Fast Food', price: '$' }
    ];

    let restaurantsText = '🍽️ **Pilihan Restoran**\n\n';
    
    restaurants.forEach((restaurant, index) => {
      restaurantsText += `**${index + 1}. ${restaurant.name}**\n`;
      restaurantsText += `🍴 ${restaurant.cuisine}\n`;
      restaurantsText += `💰 ${restaurant.price}\n\n`;
    });

    const keyboard = {
      inline_keyboard: restaurants.map((restaurant, index) => [
        {
          text: `🍽️ ${restaurant.name}`,
          callback_data: `booking:restaurant_select:${index}`
        }
      ])
    };

    await sendMessage(chatId, restaurantsText, { reply_markup: keyboard });
  },

  async showCourseBooking(chatId: number, userId: number) {
    const courses = [
      { name: 'Web Development Bootcamp', duration: '3 months', price: 5000000 },
      { name: 'Data Science Course', duration: '2 months', price: 4000000 },
      { name: 'Digital Marketing', duration: '1 month', price: 2000000 }
    ];

    let coursesText = '🎓 **Pilihan Kursus**\n\n';
    
    courses.forEach((course, index) => {
      coursesText += `**${index + 1}. ${course.name}**\n`;
      coursesText += `⏱️ ${course.duration}\n`;
      coursesText += `💰 Rp ${course.price.toLocaleString('id-ID')}\n\n`;
    });

    const keyboard = {
      inline_keyboard: courses.map((course, index) => [
        {
          text: `🎓 ${course.name}`,
          callback_data: `booking:course_select:${index}`
        }
      ])
    };

    await sendMessage(chatId, coursesText, { reply_markup: keyboard });
  },

  async handleSupportCommand(chatId: number, userId: number) {
    const keyboard = {
      inline_keyboard: [
        [
          { text: '❓ FAQ', callback_data: 'support:faq' },
          { text: '📞 Contact', callback_data: 'support:contact' }
        ],
        [
          { text: '💬 Live Chat', callback_data: 'support:livechat' },
          { text: '📝 Submit Ticket', callback_data: 'support:ticket' }
        ]
      ]
    };

    await sendMessage(chatId, '🆘 **Customer Support**\n\nBagaimana kami bisa membantu Anda?', { reply_markup: keyboard });
  },

  async handleSupportCallback(chatId: number, userId: number, action: string, params: string[]) {
    switch (action) {
      case 'faq':
        await processBusinessFeatures.showFAQ(chatId, userId);
        break;
      
      case 'contact':
        await processBusinessFeatures.showContact(chatId, userId);
        break;
      
      case 'livechat':
        await processBusinessFeatures.startLiveChat(chatId, userId);
        break;
      
      case 'ticket':
        await processBusinessFeatures.createTicket(chatId, userId);
        break;
    }
  },

  async showFAQ(chatId: number, userId: number) {
    const faqText = `❓ **Frequently Asked Questions**

**Q: Bagaimana cara memesan produk?**
A: Gunakan menu 🛍️ Toko Online, pilih produk, dan lakukan checkout.

**Q: Bagaimana cara melacak pesanan?**
A: Gunakan menu 📦 Pesanan Saya untuk melihat status pesanan.

**Q: Apa metode pembayaran yang tersedia?**
A: Transfer Bank, E-wallet, dan COD (Cash on Delivery).

**Q: Berapa lama waktu pengiriman?**
A: 1-3 hari kerja untuk wilayah Jabodetabek, 3-7 hari untuk luar kota.

**Q: Bagaimana cara mengembalikan produk?**
A: Hubungi customer support atau buat tiket pengembalian.`;

    await sendMessage(chatId, faqText);
  },

  async showContact(chatId: number, userId: number) {
    const contactText = `📞 **Kontak Customer Support**

🕒 **Jam Operasional:**
Senin - Jumat: 08:00 - 17:00 WIB
Sabtu: 08:00 - 12:00 WIB

📧 **Email:** support@botplatform.com
📱 **WhatsApp:** +62-812-3456-7890
💬 **Telegram:** @BotPlatformSupport

🌐 **Website:** www.botplatform.com
📍 **Alamat:** Jakarta, Indonesia`;

    await sendMessage(chatId, contactText);
  },

  async startLiveChat(chatId: number, userId: number) {
    await updateUserSession(userId, chatId, 'live_chat_waiting', {});
    await sendMessage(chatId, '💬 **Live Chat**\n\nAnda sedang dalam antrian untuk chat dengan customer support. Mohon tunggu sebentar...\n\n*Dalam implementasi nyata, ini akan terhubung dengan sistem live chat yang sebenarnya.*');
  },

  async createTicket(chatId: number, userId: number) {
    await updateUserSession(userId, chatId, 'creating_ticket', {});
    await sendMessage(chatId, '📝 **Buat Tiket Support**\n\nSilakan jelaskan masalah atau pertanyaan Anda secara detail:');
  }
};
