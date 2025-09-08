import { collection, getDocs, doc, getDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';

// Interfaces
export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  lastLogin?: string;
  avatar?: string;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'bank_transfer' | 'paypal' | 'crypto';
  createdAt: string;
  description?: string;
  service?: string;
  type?: string;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: 'planning' | 'in_progress' | 'review' | 'completed' | 'on_hold';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  startDate: string;
  dueDate?: string;
  progress: number;
  description?: string;
  budget?: number;
  team?: string[];
}

export interface SupportTicket {
  id: string;
  clientId: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  category: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: 'active' | 'inactive' | 'draft';
  description?: string;
  icon?: string;
  monthly?: boolean;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular: boolean;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'designer' | 'manager';
  status: 'active' | 'inactive';
  avatar: string;
  createdAt?: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'Performance';
  status: 'Ready';
  generatedAt: string;
  data: any;
}

// Offline-first Firebase Service - NO real-time listeners
export class FirebaseServiceOffline {
  
  // Simple one-shot read with retry logic
  static async readWithRetry<T>(
    collectionName: string,
    retries: number = 3,
    delay: number = 1000
  ): Promise<T[]> {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`Attempting to read ${collectionName} (attempt ${i + 1}/${retries})...`);
        
        if (!db) {
          throw new Error('Firebase not initialized');
        }
        
        const collectionRef = collection(db, collectionName);
        const snapshot = await getDocs(collectionRef);
        
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as object)
        })) as T[];
        
        console.log(`Successfully read ${collectionName}: ${data.length} items`);
        return data;
        
      } catch (error) {
        console.error(`Read attempt ${i + 1} failed for ${collectionName}:`, error);
        
        if (i === retries - 1) {
          console.error(`All read attempts failed for ${collectionName}, returning empty array`);
          return [];
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
    
    return [];
  }

  // Get all clients
  static async getClients(): Promise<Client[]> {
    return this.readWithRetry<Client>('clients');
  }

  // Get all payments
  static async getPayments(): Promise<Payment[]> {
    return this.readWithRetry<Payment>('payments');
  }

  // Get all projects
  static async getProjects(): Promise<Project[]> {
    return this.readWithRetry<Project>('projects');
  }

  // Get all support tickets
  static async getSupportTickets(): Promise<SupportTicket[]> {
    return this.readWithRetry<SupportTicket>('support_tickets');
  }

  // Get all products
  static async getProducts(): Promise<Product[]> {
    return this.readWithRetry<Product>('products');
  }

  // Get all bundles
  static async getBundles(): Promise<Bundle[]> {
    return this.readWithRetry<Bundle>('bundles');
  }

  // Get all team members
  static async getTeamMembers(): Promise<TeamMember[]> {
    return this.readWithRetry<TeamMember>('team');
  }

  // Get all reports
  static async getReports(): Promise<Report[]> {
    return this.readWithRetry<Report>('reports');
  }

  // Get single document
  static async getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
      if (!db) {
        throw new Error('Firebase not initialized');
      }
      
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...(docSnap.data() as object)
        } as T;
      } else {
        console.log(`Document ${docId} not found in ${collectionName}`);
        return null;
      }
    } catch (error) {
      console.error(`Error getting document ${docId} from ${collectionName}:`, error);
      return null;
    }
  }

  // Health check - test if Firebase is working
  static async healthCheck(): Promise<{ status: 'healthy' | 'unhealthy', message: string }> {
    try {
      if (!db) {
        return { status: 'unhealthy', message: 'Firebase not initialized' };
      }
      
      // Try to read a simple collection
      const collectionRef = collection(db, 'products');
      const snapshot = await getDocs(collectionRef);
      
      return { 
        status: 'healthy', 
        message: `Firebase is working. Found ${snapshot.docs.length} products.` 
      };
    } catch (error) {
      return { 
        status: 'unhealthy', 
        message: `Firebase health check failed: ${error.message}` 
      };
    }
  }
}
