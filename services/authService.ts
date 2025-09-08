import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { app } from "../firebase";

export const auth = getAuth(app);

// Skip authentication for client dashboard - just resolve immediately
export function ensureSignedIn(): Promise<void> {
  return new Promise(async (resolve) => {
    try {
      // Check if user is already signed in
      const currentUser = auth.currentUser;
      if (currentUser) {
        console.log('User already signed in:', currentUser.uid);
        resolve();
        return;
      }

      // For client dashboard, skip authentication since anonymous auth is disabled
      console.log('Skipping authentication for client dashboard (anonymous auth disabled)');
      resolve();
    } catch (e) { 
      console.error('Auth error:', e);
      // Even if auth fails, resolve to continue with fallback data
      resolve();
    }
  });
}

// Check if user has specific claims
export async function checkUserClaims(): Promise<{ role?: string; [key: string]: any }> {
  try {
    if (!auth.currentUser) {
      console.log('No user signed in, returning empty claims');
      return {};
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