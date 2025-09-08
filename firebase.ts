import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { initializeFirestore, connectFirestoreEmulator } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB0fOfo0VBOmkwTxTcGfKgvwhUKJYC4OEM",
  authDomain: "jegodigital-2ed98.firebaseapp.com",
  projectId: "jegodigital-2ed98",
  storageBucket: "jegodigital-2ed98.firebasestorage.app",
  messagingSenderId: "443719109773",
  appId: "1:443719109773:web:0297f7c56fda28302f66c4",
  measurementId: "G-GV8V7TZFH6"
};

// Initialize Firebase with error handling
let app;
let auth;
let db;

try {
  // Use existing app if available, otherwise create new one
  app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Initialize Firestore with safe transport
  db = initializeFirestore(app, {
    experimentalForceLongPolling: true,   // ON - as recommended by GPT
    // experimentalAutoDetectLongPolling: true, // OFF when forceLongPolling is ON
    useFetchStreams: false,
  });
  
  console.log('Firebase initialized successfully');
} catch (error) {
  console.error('Firebase initialization error:', error);
  // Create fallback objects to prevent crashes
  app = null;
  auth = null;
  db = null;
}

export { app, auth, db };

// Configure Firestore settings to handle connection issues
import { enableNetwork, disableNetwork } from 'firebase/firestore';

// Configure Firestore for better error handling
if (typeof window !== 'undefined' && db) {
  // Try to enable network and handle connection errors gracefully
  enableNetwork(db).catch((error) => {
    console.log('Firestore network connection issue:', error);
    // Don't throw error, just log it
  });
}

// Connect to emulators in development (only if not in production)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined' && window.location.hostname === 'localhost') {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch (error) {
    console.log('Emulators not available, using production Firebase');
  }
}

export default app;
