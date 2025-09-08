// Test Firebase connection and admin user
// Run this with: node scripts/testFirebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB0fOfo0VBOmkwTxTcGfKgvwhUKJYC4OEM",
  authDomain: "jegodigital-2ed98.firebaseapp.com",
  projectId: "jegodigital-2ed98",
  storageBucket: "jegodigital-2ed98.firebasestorage.app",
  messagingSenderId: "443719109773",
  appId: "1:443719109773:web:0297f7c56fda28302f66c4",
  measurementId: "G-GV8V7TZFH6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function testFirebase() {
  try {
    console.log('🔥 Testing Firebase connection...');
    console.log('Project ID:', firebaseConfig.projectId);
    
    // Test reading the admin user
    const adminDoc = await getDoc(doc(db, 'users', 'Tb4iOWLHsCcSm9gd6rRPzeys4um1'));
    
    if (adminDoc.exists()) {
      const adminData = adminDoc.data();
      console.log('✅ Admin user found in Firestore!');
      console.log('Email:', adminData.email);
      console.log('Name:', adminData.name);
      console.log('Role:', adminData.role);
      console.log('Company:', adminData.company);
    } else {
      console.log('❌ Admin user not found in Firestore');
      console.log('Run: node scripts/initAdmin.js to create the admin user');
    }
    
  } catch (error) {
    console.error('❌ Firebase connection error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure you have the correct Firebase config');
    console.log('2. Check if Firestore database is created');
    console.log('3. Verify your Firebase project is active');
  }
}

testFirebase();
