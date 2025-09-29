// Test Firebase Connection
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDO9QTPwSLc7YEyEu-vkAewptzRVcWdF78",
  authDomain: "db-ind-b9d1c.firebaseapp.com",
  projectId: "db-ind-b9d1c",
  storageBucket: "db-ind-b9d1c.firebasestorage.app",
  messagingSenderId: "142941537714",
  appId: "1:142941537714:web:fbb4f4d18715688e8550ab",
  measurementId: "G-8XYH1H62E4"
};

async function testFirebase() {
  console.log('🔥 Testing Firebase connection...');
  
  try {
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('✅ Firebase initialized successfully!');
    
    // Test write to Firestore
    console.log('📝 Testing Firestore write...');
    const docRef = await addDoc(collection(db, 'test'), {
      message: 'Hello from Bot Platform!',
      timestamp: new Date(),
      test: true
    });
    
    console.log('✅ Document written with ID:', docRef.id);
    
    // Test read from Firestore
    console.log('📖 Testing Firestore read...');
    const querySnapshot = await getDocs(collection(db, 'test'));
    
    console.log('✅ Documents found:', querySnapshot.size);
    querySnapshot.forEach((doc) => {
      console.log('   Document:', doc.id, '=>', doc.data());
    });
    
    console.log('\n🎉 Firebase test completed successfully!');
    console.log('✅ Database connection: OK');
    console.log('✅ Read/Write operations: OK');
    
  } catch (error) {
    console.error('❌ Firebase test failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Check if Firestore is enabled in Firebase Console');
    console.log('   2. Check security rules');
    console.log('   3. Verify project ID and API key');
  }
}

// Run test
testFirebase();
