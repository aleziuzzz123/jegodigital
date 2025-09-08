import React, { useState } from 'react';
import PaymentComponent from '../PaymentComponent';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'staff';
  company?: string;
  avatar?: string;
}

interface ClientDashboardProps {
  user: User;
  onLogout: () => void;
}

const OfflineClientDashboard: React.FC<ClientDashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'es'>('en');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Mock data - no Firebase connection
  const services = [
    {
      id: '1',
      name: 'Website Design',
      description: 'Custom website design and development',
      price: 2500,
      icon: '🌐'
    },
    {
      id: '2',
      name: 'Local SEO Setup',
      description: 'Optimize your business for local search',
      price: 800,
      icon: '📈'
    },
    {
      id: '3',
      name: 'Google Maps Setup',
      description: 'Get your business on Google Maps',
      price: 300,
      icon: '📍'
    }
  ];

  const bundles = [
    {
      id: '1',
      name: 'Starter Package',
      description: 'Perfect for small businesses',
      price: 1500,
      services: ['Website Design', 'Local SEO Setup'],
      icon: '🚀'
    },
    {
      id: '2',
      name: 'Growth Package',
      description: 'Everything you need to grow',
      price: 3500,
      services: ['Website Design', 'Local SEO Setup', 'Google Maps Setup'],
      icon: '📈'
    }
  ];

  const projects = [];
  const reports = [];
  const billing = {
    nextPayment: null,
    subscriptions: [],
    oneTimeOrders: []
  };

  const kpis = {
    websiteTraffic: { value: '0', change: '0%', trend: 'neutral' },
    topKeywords: [],
    emailPerformance: { openRate: '0%', clickRate: '0%', subscribers: '0' }
  };

  const handleLogout = () => {
    setShowLogoutModal(false);
    onLogout();
  };

  const renderOverview = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h1>Welcome back, {user.name} 👋</h1>
        <p>Here's what's happening with your projects today.</p>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card project-status">
          <div className="card-header">
            <h3>Project Status</h3>
            <span className="card-icon">🚀</span>
          </div>
          <div className="card-content">
            <div className="status-message">
              <h4>No Active Projects</h4>
              <p>Your projects will appear here once you purchase a package.</p>
              <button 
                className="btn-primary"
                onClick={() => setShowUpgradeModal(true)}
              >
                Browse Packages
              </button>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Website Traffic</h3>
          </div>
          <div className="card-content">
            <div className="metric-value">{kpis.websiteTraffic.value}</div>
            <div className="metric-change">{kpis.websiteTraffic.change}</div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <h3>Top Keywords</h3>
          </div>
          <div className="card-content">
            <div className="empty-state">No data available</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>My Projects</h1>
        <button 
          className="btn-primary"
          onClick={() => setShowUpgradeModal(true)}
        >
          Purchase Package
        </button>
      </div>

      <div className="empty-state">
        <div className="empty-icon">📁</div>
        <h3>No Projects Yet</h3>
        <p>Your projects will appear here once you purchase a package.</p>
        <button 
          className="btn-primary"
          onClick={() => setShowUpgradeModal(true)}
        >
          Browse Packages
        </button>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Reports</h1>
      </div>

      <div className="empty-state">
        <div className="empty-icon">📊</div>
        <h3>No Reports Available</h3>
        <p>Reports will be generated once you have active projects.</p>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Billing</h1>
      </div>

      <div className="billing-section">
        <div className="billing-card">
          <h3>Next Payment</h3>
          <div className="billing-info">
            <p>No upcoming payments</p>
          </div>
        </div>

        <div className="billing-card">
          <h3>Payment History</h3>
          <div className="billing-info">
            <p>No payment history available</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUpgrades = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Upgrade Your Plan</h1>
      </div>

      <div className="packages-grid">
        {bundles.map((bundle) => (
          <div key={bundle.id} className="package-card">
            <div className="package-header">
              <span className="package-icon">{bundle.icon}</span>
              <h3>{bundle.name}</h3>
              <p>{bundle.description}</p>
            </div>
            <div className="package-price">
              <span className="price">${bundle.price.toLocaleString()}</span>
            </div>
            <div className="package-services">
              <h4>Includes:</h4>
              <ul>
                {bundle.services.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
            <button className="btn-primary package-btn">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-section">
        <div className="setting-item">
          <h3>Account Information</h3>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Company: {user.company || 'Not specified'}</p>
        </div>

        <div className="setting-item">
          <h3>Language</h3>
          <select 
            value={currentLanguage} 
            onChange={(e) => setCurrentLanguage(e.target.value as 'en' | 'es')}
            className="language-select"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="dashboard">
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Jegodigital</h2>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3>MAIN</h3>
            <ul>
              <li>
                <button 
                  className={activeSection === 'overview' ? 'active' : ''}
                  onClick={() => setActiveSection('overview')}
                >
                  Overview
                </button>
              </li>
              <li>
                <button 
                  className={activeSection === 'projects' ? 'active' : ''}
                  onClick={() => setActiveSection('projects')}
                >
                  Projects
                </button>
              </li>
              <li>
                <button 
                  className={activeSection === 'reports' ? 'active' : ''}
                  onClick={() => setActiveSection('reports')}
                >
                  Reports
                </button>
              </li>
            </ul>
          </div>
          
          <div className="nav-section">
            <h3>ACCOUNT</h3>
            <ul>
              <li>
                <button 
                  className={activeSection === 'billing' ? 'active' : ''}
                  onClick={() => setActiveSection('billing')}
                >
                  Billing
                </button>
              </li>
              <li>
                <button 
                  className={activeSection === 'upgrades' ? 'active' : ''}
                  onClick={() => setActiveSection('upgrades')}
                >
                  Upgrades
                </button>
              </li>
              <li>
                <button 
                  className={activeSection === 'settings' ? 'active' : ''}
                  onClick={() => setActiveSection('settings')}
                >
                  Settings
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="dashboard-main">
        <header className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <select 
              value={currentLanguage} 
              onChange={(e) => setCurrentLanguage(e.target.value as 'en' | 'es')}
              className="language-selector"
            >
              <option value="en">EN</option>
              <option value="es">ES</option>
            </select>
            
            <button className="notification-btn">
              🔔
            </button>
            
            <div className="user-menu">
              <button 
                className="user-avatar"
                onClick={() => setShowLogoutModal(true)}
              >
                {user.avatar || user.name.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </header>

        <main className="dashboard-body">
          {activeSection === 'overview' && renderOverview()}
          {activeSection === 'projects' && renderProjects()}
          {activeSection === 'reports' && renderReports()}
          {activeSection === 'billing' && renderBilling()}
          {activeSection === 'upgrades' && renderUpgrades()}
          {activeSection === 'settings' && renderSettings()}
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Confirm Logout</h3>
              <button 
                className="modal-close"
                onClick={() => setShowLogoutModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <p>Are you sure you want to logout?</p>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="modal-overlay">
          <div className="modal upgrade-modal">
            <div className="modal-header">
              <h3>Choose Your Package</h3>
              <button 
                className="modal-close"
                onClick={() => setShowUpgradeModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-content">
              <PaymentComponent amount={0} description="Test payment" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfflineClientDashboard;

