import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { app } from "../firebase";

export const auth = getAuth(app);

// Make sure there is a user (email/password OR anonymous) before any Firestore reads
export function ensureSignedIn(): Promise<void> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Unsubscribe immediately to prevent multiple calls
      try {
        if (!user) {
          console.log('No user found, signing in anonymously...');
          await signInAnonymously(auth);
          console.log('Signed in anonymously successfully');
        } else {
          console.log('User already signed in:', user.uid);
        }
        resolve(); // Always resolve after handling the user state
      } catch (e) { 
        console.error('Auth error:', e);
        reject(e); 
      }
    });
  });
}

// Check if user has specific claims
export async function checkUserClaims(): Promise<{ role?: string; [key: string]: any }> {
  try {
    if (!auth.currentUser) {
      throw new Error('No user signed in');
    }
    
    const tokenResult = await auth.currentUser.getIdTokenResult(true);
    console.log('User claims:', tokenResult.claims);
    return tokenResult.claims;
  } catch (error) {
    console.error('Error checking claims:', error);
    return {};
  }
}

// Force token refresh to get latest claims
export async function refreshUserToken(): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('No user signed in');
    }
    
    await auth.currentUser.getIdToken(true);
    console.log('User token refreshed');
  } catch (error) {
    console.error('Error refreshing token:', error);
  }
}