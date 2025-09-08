import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client' | 'staff';
  avatar?: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboardIsolated: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  useEffect(() => {
    console.log('AdminDashboardIsolated: Loading with static data (NO FIREBASE IMPORTS)');
    
    // Set static admin data - NO Firebase calls whatsoever
    const staticProducts = [
      {
        id: '1',
        name: 'Website Development',
        description: 'Custom website design and development',
        price: 2500,
        category: 'Development',
        active: true,
        createdAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '2',
        name: 'SEO Optimization',
        description: 'Search engine optimization services',
        price: 500,
        category: 'Marketing',
        active: true,
        createdAt: '2024-01-15T00:00:00Z'
      },
      {
        id: '3',
        name: 'Email Marketing',
        description: 'Automated email campaigns',
        price: 300,
        category: 'Marketing',
        active: true,
        createdAt: '2024-01-15T00:00:00Z'
      }
    ];

    const staticTeamMembers = [
      {
        id: '1',
        name: 'Alex Jego',
        email: 'alex@jegodigital.com',
        role: 'admin',
        status: 'active',
        avatar: 'AJ',
        lastLogin: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@jegodigital.com',
        role: 'staff',
        status: 'active',
        avatar: 'SJ',
        lastLogin: '2024-01-15T09:15:00Z'
      }
    ];

    const staticProjects = [
      {
        id: '1',
        name: 'Restaurant Website',
        clientId: 'client-1',
        status: 'in_progress',
        priority: 'high',
        startDate: '2024-01-10T00:00:00Z',
        dueDate: '2024-02-10T00:00:00Z',
        progress: 75,
        budget: 5000,
        team: ['Alex Jego', 'Sarah Johnson']
      },
      {
        id: '2',
        name: 'Gym SEO Campaign',
        clientId: 'client-2',
        status: 'completed',
        priority: 'medium',
        startDate: '2024-01-01T00:00:00Z',
        dueDate: '2024-01-31T00:00:00Z',
        progress: 100,
        budget: 2000,
        team: ['Sarah Johnson']
      }
    ];

    const staticClients = [
      {
        id: 'client-1',
        name: 'Maria Rodriguez',
        email: 'maria@restaurant.com',
        company: 'El Sabor Restaurant',
        status: 'active',
        createdAt: '2024-01-01T00:00:00Z',
        lastLogin: '2024-01-15T08:30:00Z'
      },
      {
        id: 'client-2',
        name: 'David Chen',
        email: 'david@gym.com',
        company: 'FitLife Gym',
        status: 'active',
        createdAt: '2024-01-05T00:00:00Z',
        lastLogin: '2024-01-14T16:45:00Z'
      }
    ];

    const staticPayments = [
      {
        id: '1',
        clientId: 'client-1',
        amount: 2500,
        currency: 'USD',
        status: 'completed',
        method: 'card',
        createdAt: '2024-01-15T10:00:00Z',
        description: 'Website Development - Initial Payment'
      },
      {
        id: '2',
        clientId: 'client-2',
        amount: 500,
        currency: 'USD',
        status: 'completed',
        method: 'bank_transfer',
        createdAt: '2024-01-10T14:30:00Z',
        description: 'SEO Optimization - Monthly'
      }
    ];

    const staticTickets = [
      {
        id: '1',
        clientId: 'client-1',
        subject: 'Website update request',
        status: 'open',
        priority: 'medium',
        createdAt: '2024-01-15T09:00:00Z',
        lastUpdated: '2024-01-15T09:00:00Z'
      },
      {
        id: '2',
        clientId: 'client-2',
        subject: 'SEO report question',
        status: 'resolved',
        priority: 'low',
        createdAt: '2024-01-14T15:30:00Z',
        lastUpdated: '2024-01-15T10:00:00Z'
      }
    ];

    // Set static data
    setProducts(staticProducts);
    setTeamMembers(staticTeamMembers);
    setProjects(staticProjects);
    setClients(staticClients);
    setPayments(staticPayments);
    setTickets(staticTickets);
    setLoading(false);
    
    console.log('AdminDashboardIsolated: Static admin data loaded successfully - ZERO Firebase imports or calls');
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 shadow-lg">
        <div className="flex items-center justify-center h-16 px-4 bg-gray-900">
          <h1 className="text-xl font-bold text-white">Jegodigital</h1>
        </div>
        
        <nav className="mt-8">
          <div className="px-4 space-y-2">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">OVERVIEW</div>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-blue-400 bg-blue-900 rounded-lg">
              <span className="mr-3">📊</span>
              Dashboard
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
              <span className="mr-3">📈</span>
              Analytics
            </a>
          </div>
          
          <div className="px-4 space-y-2 mt-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">MANAGEMENT</div>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
              <span className="mr-3">👥</span>
              Clients
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
              <span className="mr-3">📋</span>
              Orders & Payments
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
              <span className="mr-3">🚀</span>
              Projects
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
              <span className="mr-3">🎫</span>
              Support
            </a>
          </div>
          
          <div className="px-4 space-y-2 mt-6">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">SETTINGS</div>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
              <span className="mr-3">🛍️</span>
              Products
            </a>
            <a href="#" className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 rounded-lg">
              <span className="mr-3">👥</span>
              Team
            </a>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Header */}
        <header className="bg-gray-800 shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-400">Welcome back, {user.name} 👋</p>
            </div>
            <div className="flex items-center space-x-4">
              <select className="bg-gray-700 text-white px-3 py-2 rounded-md">
                <option value="en">EN</option>
              </select>
              <button className="text-gray-300 hover:text-white">
                🔔
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.avatar || user.name.charAt(0)}
                </div>
                <div className="relative">
                  <button className="text-gray-300 hover:text-white">
                    ▼
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Here's your business overview for today.</h2>
          </div>

          {/* Status Message */}
          <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <span className="text-green-400 mr-2">✅</span>
              <span className="text-green-200">ISOLATED admin dashboard loaded successfully - ZERO Firebase imports or calls</span>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-600 rounded-lg">
                  <span className="text-white text-xl">💰</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Daily Revenue</p>
                  <p className="text-2xl font-bold text-white">$0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-600 rounded-lg">
                  <span className="text-white text-xl">👥</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Active Clients</p>
                  <p className="text-2xl font-bold text-white">{clients.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-600 rounded-lg">
                  <span className="text-white text-xl">🔄</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Active Subscriptions</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Projects Due This Week</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-600 rounded-lg">
                  <span className="text-white text-xl">🎫</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-400">Open Support Tickets</p>
                  <p className="text-2xl font-bold text-white">{tickets.filter(t => t.status === 'open').length}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">New client registered: {clients[0]?.name}</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Project completed: {projects[1]?.name}</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-300">Payment received: ${payments[0]?.amount}</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Status */}
          <div className="bg-blue-900 border border-blue-700 rounded-lg p-4 mt-8">
            <div className="flex items-center">
              <span className="text-blue-400 mr-2">ℹ️</span>
              <span className="text-blue-200">This admin dashboard uses only static data - no database connections, no authentication, no real-time updates, no Firebase imports whatsoever</span>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardIsolated;
