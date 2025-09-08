import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  updateProfile,
  User,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'staff';
  company?: string;
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
}

class SimpleAuthService {
  private currentUser: User | null = null;
  private userProfile: UserProfile | null = null;

  constructor() {
    try {
      // Listen for auth state changes
      if (auth) {
        onAuthStateChanged(auth, async (user) => {
          this.currentUser = user;
          if (user) {
            // Create a basic profile from Firebase Auth data
            this.userProfile = {
              id: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'User',
              email: user.email!,
              role: 'client', // Default role
              company: '',
              avatar: user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U',
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString()
            };
          } else {
            this.userProfile = null;
          }
        });
      } else {
        console.warn('Firebase auth not available, using fallback mode');
      }
    } catch (error) {
      console.error('Error initializing SimpleAuthService:', error);
    }
  }

  // Sign in with email and password
  async signIn(email: string, password: string): Promise<UserProfile> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Create profile from Firebase Auth data
      const profile: UserProfile = {
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email!,
        role: 'client', // Default role
        company: '',
        avatar: user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      return profile;
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign up with email and password
  async signUp(email: string, password: string, userData: {
    name: string;
    company?: string;
    phone?: string;
    role?: 'client' | 'admin' | 'staff';
  }): Promise<UserProfile> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: userData.name
      });

      // Create user profile
      const profile: UserProfile = {
        id: user.uid,
        name: userData.name,
        email: user.email!,
        role: userData.role || 'client',
        company: userData.company || '',
        avatar: userData.name.charAt(0).toUpperCase(),
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      
      return profile;
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign in with Google
  async signInWithGoogle(): Promise<UserProfile> {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Create profile from Google data
      const profile: UserProfile = {
        id: user.uid,
        name: user.displayName || 'Google User',
        email: user.email!,
        role: 'client',
        company: '',
        avatar: user.photoURL || user.displayName?.charAt(0).toUpperCase() || 'G',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };

      return profile;
    } catch (error: any) {
      console.error('Google sign in error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Sign out
  async signOut(): Promise<void> {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.userProfile = null;
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  // Send password reset email
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error('Password reset error:', error);
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  // Get current user
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // Get current user profile
  getCurrentUserProfile(): UserProfile | null {
    return this.userProfile;
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  // Get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed';
      case 'auth/cancelled-popup-request':
        return 'Sign-in was cancelled';
      default:
        return 'An error occurred. Please try again';
    }
  }
}

// Export singleton instance
export const simpleAuthService = new SimpleAuthService();
export default simpleAuthService;
