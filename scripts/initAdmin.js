// Script to initialize admin user in Firestore
// Run this with: node scripts/initAdmin.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp } from 'firebase/firestore';

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

async function initAdmin() {
  try {
    const adminData = {
      uid: 'Tb4iOWLHsCcSm9gd6rRPzeys4um1',
      email: 'jegoalexdigital@gmail.com',
      name: 'Alex Jego',
      role: 'admin',
      company: 'Jegodigital',
      avatar: 'AJ',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      isActive: true,
      permissions: [
        'manage_clients',
        'manage_projects',
        'manage_orders',
        'manage_team',
        'view_analytics',
        'manage_products'
      ]
    };

    await setDoc(doc(db, 'users', 'Tb4iOWLHsCcSm9gd6rRPzeys4um1'), adminData);
    console.log('✅ Admin user initialized successfully!');
    console.log('Email: jegoalexdigital@gmail.com');
    console.log('UID: Tb4iOWLHsCcSm9gd6rRPzeys4um1');
    console.log('Role: admin');
    console.log('Name: Alex Jego');
    
  } catch (error) {
    console.error('❌ Error initializing admin user:', error);
  }
}

initAdmin();
