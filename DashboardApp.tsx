import React, { useState, useEffect } from 'react';
import './DashboardApp.css';
import ClientDashboardClean from './components/ClientDashboardClean';
import ClientDashboardMinimal from './components/ClientDashboardMinimal';
import ClientDashboardNoFirebase from './components/ClientDashboardNoFirebase';
import ClientDashboardHybrid from './components/ClientDashboardHybrid';
import ClientDashboardPure from './components/ClientDashboardPure';
import ClientDashboardReal from './components/ClientDashboardReal';
import ClientDashboardIsolated from './components/ClientDashboardIsolated';
import AdminDashboardIsolated from './components/AdminDashboardIsolated';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'staff';
  company: string;
  avatar: string;
}

// Demo users (only for development/testing)
const demoUsers = {
  client: {
    id: 'client-1',
    name: 'Demo Client',
    email: 'client@demo.com',
    role: 'client' as const,
    company: 'Demo Company',
    avatar: 'DC'
  },
  admin: {
    id: 'admin-1',
    name: 'Alex Jego',
    email: 'jegoalexdigital@gmail.com',
    role: 'admin' as const,
    company: 'Jegodigital',
    avatar: 'AJ'
  }
};

function DashboardApp() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check URL parameters for demo users FIRST (override sessionStorage)
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get('user');
    
    if (userParam && demoUsers[userParam as keyof typeof demoUsers]) {
      console.log('Using URL parameter user:', userParam, demoUsers[userParam as keyof typeof demoUsers]);
      setUser(demoUsers[userParam as keyof typeof demoUsers]);
      setIsLoading(false);
      return;
    }

    // Check for user in sessionStorage (from homepage login)
    const sessionUser = sessionStorage.getItem('jegodigital_current_user');
    if (sessionUser) {
      console.log('Using sessionStorage user:', JSON.parse(sessionUser));
      setUser(JSON.parse(sessionUser));
      setIsLoading(false);
      return;
    }

    // Check localStorage for stored user
    const storedUser = localStorage.getItem('jegodigital_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
      return;
    }

    // No user found, redirect to homepage
    window.location.href = '/';
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('jegodigital_current_user');
    localStorage.removeItem('jegodigital_user');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Redirecting to login...</p>
      </div>
    );
  }

  console.log('DashboardApp rendering with user:', user);
  console.log('User role:', user.role);
  console.log('Will render:', user.role === 'client' ? 'ClientDashboardIsolated' : 'AdminDashboardIsolated');

  return (
    <div className="dashboard-app">
      {user.role === 'client' ? (
        <ClientDashboardIsolated />
      ) : (
        <AdminDashboardIsolated user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default DashboardApp;
