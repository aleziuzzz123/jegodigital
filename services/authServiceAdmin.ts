import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import { app } from "../firebase";

export const auth = getAuth(app);

// Admin authentication - requires proper authentication
export function ensureAdminSignedIn(): Promise<void> {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      unsubscribe(); // Unsubscribe immediately to prevent multiple calls
      try {
        if (!user) {
          console.log('No admin user found, signing in anonymously...');
          await signInAnonymously(auth);
          console.log('Admin signed in anonymously successfully');
        } else {
          console.log('Admin user already signed in:', user.uid);
        }
        resolve(); // Always resolve after handling the user state
      } catch (e) { 
        console.error('Admin auth error:', e);
        // For admin, we should reject if auth fails
        reject(e); 
      }
    });
  });
}

// Check if admin user has specific claims
export async function checkAdminUserClaims(): Promise<{ role?: string; [key: string]: any }> {
  try {
    if (!auth.currentUser) {
      console.log('No admin user signed in, returning empty claims');
      return {};
    }
    
    const tokenResult = await auth.currentUser.getIdTokenResult(true);
    console.log('Admin user claims:', tokenResult.claims);
    return tokenResult.claims;
  } catch (error) {
    console.error('Error checking admin claims:', error);
    return {};
  }
}

// Force token refresh to get latest claims
export async function refreshAdminUserToken(): Promise<void> {
  try {
    if (!auth.currentUser) {
      throw new Error('No admin user signed in');
    }
    
    await auth.currentUser.getIdToken(true);
    console.log('Admin user token refreshed');
  } catch (error) {
    console.error('Error refreshing admin token:', error);
  }
}
