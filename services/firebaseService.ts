import { collection, getDocs, doc, getDoc, query, where, orderBy, limit, addDoc, updateDoc, deleteDoc, onSnapshot, QuerySnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  status: string;
  createdAt: any;
}

export interface Payment {
  id: string;
  clientId: string;
  amount: number;
  status: string;
  service?: string;
  type?: string;
  description?: string;
  createdAt: any;
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  status: string;
  dueDate: string;
  createdAt: any;
}

export interface SupportTicket {
  id: string;
  clientId: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: any;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  status: string;
  description?: string;
  icon?: string;
  monthly?: boolean;
  createdAt?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
  createdAt?: string;
}

export class FirebaseService {
  // Resilient data fetching with fallback mechanisms
  static async safeListen<T>(
    q: any, 
    onData: (data: T[]) => void, 
    fallbackData: T[] = [],
    timeoutMs: number = 4000
  ): Promise<() => void> {
    let stopped = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const fallbackRead = async () => {
      try {
        console.log('Attempting fallback one-shot read...');
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as object)
        })) as T[];
        onData(data);
        console.log('Fallback read successful:', data.length, 'items');
      } catch (error) {
        console.error('Fallback read failed:', error);
        onData(fallbackData);
      }
    };

    // Set up timeout fallback
    timeoutId = setTimeout(() => {
      if (!stopped) {
        console.log('Realtime listener timeout, falling back to one-shot read');
        fallbackRead();
      }
    }, timeoutMs);

    try {
      const unsub = onSnapshot(q, {
        next: (snap: QuerySnapshot) => {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          stopped = true;
          const data = snap.docs.map(doc => ({
            id: doc.id,
            ...(doc.data() as object)
          })) as T[];
          onData(data);
          console.log('Realtime listener successful:', data.length, 'items');
        },
        error: async (err) => {
          console.error('Realtime listener failed, falling back:', err);
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          await fallbackRead();
        }
      });

      return () => {
        stopped = true;
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        unsub();
      };
    } catch (error) {
      console.error('Failed to set up realtime listener, using fallback:', error);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      await fallbackRead();
      
      // Return a no-op unsubscribe function
      return () => {};
    }
  }

  // Safe one-shot read with timeout and error handling
  static async safeRead<T>(
    collectionName: string,
    fallbackData: T[] = [],
    timeoutMs: number = 5000
  ): Promise<T[]> {
    try {
      if (!db) {
        console.log('Firebase not available, using fallback data');
        return fallbackData;
      }

      console.log(`Fetching ${collectionName} from Firebase...`);
      const ref = collection(db, collectionName);
      
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), timeoutMs);
      });
      
      const snapshotPromise = getDocs(ref);
      const snapshot = await Promise.race([snapshotPromise, timeoutPromise]);
      
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as object)
      })) as T[];
      
      console.log(`${collectionName} loaded:`, data.length, 'items');
      return data;
    } catch (error: any) {
      console.error(`Error fetching ${collectionName}:`, error);
      
      // Handle all Firebase errors gracefully
      if (error.code === 'permission-denied' || 
          error.message?.includes('400') || 
          error.code === 'unavailable' ||
          error.message?.includes('timeout') ||
          error.message?.includes('network') ||
          error.code === 'unauthenticated') {
        console.log(`Firebase connection issue for ${collectionName}, using fallback data`);
        return fallbackData;
      }
      return fallbackData;
    }
  }

  // Get all clients
  static async getClients(): Promise<Client[]> {
    return this.safeRead<Client>('clients');
  }

  // Get all payments
  static async getPayments(): Promise<Payment[]> {
    return this.safeRead<Payment>('payments');
  }

  // Get all projects
  static async getProjects(): Promise<Project[]> {
    return this.safeRead<Project>('projects');
  }

  // Get all support tickets
  static async getSupportTickets(): Promise<SupportTicket[]> {
    return this.safeRead<SupportTicket>('support_tickets');
  }

  // Get dashboard overview data
  static async getDashboardOverview() {
    try {
      console.log('Starting Firebase data fetch...');
      
      const [clients, payments, projects, tickets] = await Promise.all([
        this.getClients(),
        this.getPayments(),
        this.getProjects(),
        this.getSupportTickets()
      ]);
      
      console.log('Firebase data fetched:', { clients, payments, projects, tickets });

      // Calculate metrics
      const activeClients = clients.filter(c => c.status === 'active').length;
      const totalRevenue = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0);
      
      // Get today's revenue (for demo, we'll use total)
      const dailyRevenue = totalRevenue;
      
      // Count active subscriptions (for demo, we'll use payments as subscriptions)
      const activeSubscriptions = payments.filter(p => p.status === 'completed').length;
      
      // Count projects due this week (for demo, we'll count all projects)
      const projectsDue = projects.length;
      
      // Count open tickets
      const openTickets = tickets.filter(t => t.status === 'open').length;

      return {
        dailyRevenue,
        activeClients,
        activeSubscriptions,
        projectsDue,
        openTickets,
        clients,
        payments,
        projects,
        tickets
      };
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      return {
        dailyRevenue: 0,
        activeClients: 0,
        activeSubscriptions: 0,
        projectsDue: 0,
        openTickets: 0,
        clients: [],
        payments: [],
        projects: [],
        tickets: []
      };
    }
  }

  // Product Management
  static async getProducts(): Promise<Product[]> {
    return this.safeRead<Product>('products');
  }

  static async addProduct(product: Omit<Product, 'id'>): Promise<void> {
    try {
      const productsRef = collection(db, 'products');
      await addDoc(productsRef, product);
      console.log('Product added successfully');
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  static async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(db, 'products', productId);
      await updateDoc(productRef, updates);
      console.log('Product updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      console.log('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  // Team Management
  static async getTeamMembers(): Promise<TeamMember[]> {
    return this.safeRead<TeamMember>('team_members');
  }

  static async addTeamMember(member: Omit<TeamMember, 'id'>): Promise<void> {
    try {
      const teamRef = collection(db, 'team_members');
      await addDoc(teamRef, member);
      console.log('Team member added successfully');
    } catch (error) {
      console.error('Error adding team member:', error);
      throw error;
    }
  }

  static async updateTeamMember(memberId: string, updates: Partial<TeamMember>): Promise<void> {
    try {
      const memberRef = doc(db, 'team_members', memberId);
      await updateDoc(memberRef, updates);
      console.log('Team member updated successfully');
    } catch (error) {
      console.error('Error updating team member:', error);
      throw error;
    }
  }

  static async deleteTeamMember(memberId: string): Promise<void> {
    try {
      const memberRef = doc(db, 'team_members', memberId);
      await deleteDoc(memberRef);
      console.log('Team member deleted successfully');
    } catch (error) {
      console.error('Error deleting team member:', error);
      throw error;
    }
  }

  // Reports Management
  static async getReports(): Promise<any[]> {
    return this.safeRead<any>('reports');
  }

  static async addReport(report: any): Promise<void> {
    try {
      const reportsRef = collection(db, 'reports');
      await addDoc(reportsRef, report);
      console.log('Report added successfully');
    } catch (error) {
      console.error('Error adding report:', error);
      throw error;
    }
  }

  // Project Management
  static async addProject(project: any): Promise<void> {
    try {
      const projectsRef = collection(db, 'projects');
      await addDoc(projectsRef, project);
      console.log('Project added successfully');
    } catch (error) {
      console.error('Error adding project:', error);
      throw error;
    }
  }

  static async updateProject(projectId: string, updates: any): Promise<void> {
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, updates);
      console.log('Project updated successfully');
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  }

  // Bundles Management
  static async getBundles(): Promise<any[]> {
    return this.safeRead<any>('bundles');
  }

  static async addBundle(bundle: any): Promise<void> {
    try {
      const bundlesRef = collection(db, 'bundles');
      await addDoc(bundlesRef, bundle);
      console.log('Bundle added successfully');
    } catch (error) {
      console.error('Error adding bundle:', error);
      throw error;
    }
  }

  static async updateBundle(bundleId: string, updates: any): Promise<void> {
    try {
      const bundleRef = doc(db, 'bundles', bundleId);
      await updateDoc(bundleRef, updates);
      console.log('Bundle updated successfully');
    } catch (error) {
      console.error('Error updating bundle:', error);
      throw error;
    }
  }

  static async deleteBundle(bundleId: string): Promise<void> {
    try {
      const bundleRef = doc(db, 'bundles', bundleId);
      await deleteDoc(bundleRef);
      console.log('Bundle deleted successfully');
    } catch (error) {
      console.error('Error deleting bundle:', error);
      throw error;
    }
  }

  // Client Management
  static async addClient(client: Omit<Client, 'id'>): Promise<void> {
    try {
      const clientsRef = collection(db, 'clients');
      await addDoc(clientsRef, client);
      console.log('Client added successfully');
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  }

  static async updateClient(clientId: string, updates: Partial<Client>): Promise<void> {
    try {
      const clientRef = doc(db, 'clients', clientId);
      await updateDoc(clientRef, updates);
      console.log('Client updated successfully');
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }

  static async deleteClient(clientId: string): Promise<void> {
    try {
      const clientRef = doc(db, 'clients', clientId);
      await deleteDoc(clientRef);
      console.log('Client deleted successfully');
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }

  // Payment Management
  static async addPayment(payment: Omit<Payment, 'id'>): Promise<void> {
    try {
      const paymentsRef = collection(db, 'payments');
      await addDoc(paymentsRef, payment);
      console.log('Payment added successfully');
    } catch (error) {
      console.error('Error adding payment:', error);
      throw error;
    }
  }

  static async updatePayment(paymentId: string, updates: Partial<Payment>): Promise<void> {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      await updateDoc(paymentRef, updates);
      console.log('Payment updated successfully');
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  }

  static async deletePayment(paymentId: string): Promise<void> {
    try {
      const paymentRef = doc(db, 'payments', paymentId);
      await deleteDoc(paymentRef);
      console.log('Payment deleted successfully');
    } catch (error) {
      console.error('Error deleting payment:', error);
      throw error;
    }
  }
}
