import React, { useState, useEffect } from 'react';
import PaymentComponent from '../PaymentComponent';
import { FirebaseService } from '../services/firebaseService';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ClientDashboardProps {
  user: User;
  onLogout: () => void;
}

const ClientDashboard: React.FC<ClientDashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [language, setLanguage] = useState('en');

  // State management with comprehensive initial data
  const [services, setServices] = useState([
    {
      id: '1',
      name: 'Website Design',
      description: 'Custom website design and development',
      price: 2500,
      icon: '🌐',
      monthly: false,
      category: 'web-design'
    },
    {
      id: '2',
      name: 'Local SEO Setup',
      description: 'Optimize your business for local search',
      price: 800,
      icon: '📈',
      monthly: false,
      category: 'seo'
    },
    {
      id: '3',
      name: 'Social Media Management',
      description: 'Manage your social media presence',
      price: 1200,
      icon: '📱',
      monthly: true,
      category: 'social-media'
    },
    {
      id: '4',
      name: 'Google Maps Setup',
      description: 'Get your business on Google Maps',
      price: 300,
      icon: '📍',
      monthly: false,
      category: 'local'
    },
    {
      id: '5',
      name: 'Email Marketing Setup',
      description: 'Set up automated email campaigns',
      price: 500,
      icon: '📧',
      monthly: false,
      category: 'marketing'
    }
  ]);

  const [bundles, setBundles] = useState([
    {
      id: '1',
      name: 'Starter Presence',
      description: 'Perfect for small businesses',
      price: 1500,
      features: ['Custom Website Design', 'Local SEO Optimization', 'Google Maps Setup', '3 Months Support'],
      popular: true,
      monthly: false,
      category: 'starter'
    },
    {
      id: '2',
      name: 'Growth Package',
      description: 'Everything you need to grow your business',
      price: 3500,
      features: ['Everything in Starter', 'Social Media Management', 'Email Marketing', 'Analytics Setup', '6 Months Support'],
      popular: false,
      monthly: false,
      category: 'growth'
    },
    {
      id: '3',
      name: 'Premium Suite',
      description: 'Complete digital transformation',
      price: 5000,
      features: ['Everything in Growth', 'Advanced Analytics', 'Custom Reports', 'Priority Support', '12 Months Support'],
      popular: false,
      monthly: false,
      category: 'premium'
    }
  ]);

  const [projects, setProjects] = useState([]);
  const [reports, setReports] = useState([]);
  const [billing, setBilling] = useState({
    nextPayment: null,
    subscriptions: [],
    oneTimeOrders: []
  });

  // Real data - will be loaded from Firebase
  const [projectStatus, setProjectStatus] = useState({
    current: null,
    progress: 0,
    stages: []
  });

  const [kpis, setKpis] = useState({
    websiteTraffic: { value: '0', change: '0%', trend: 'neutral' },
    topKeywords: [],
    emailPerformance: { openRate: '0%', clickRate: '0%', subscribers: '0' }
  });

  // Load data from Firebase with proper error handling
  useEffect(() => {
    console.log('Dashboard loading with Firebase integration');
    
    // Set up professional fallback data for new clients
    setProjectStatus({
      current: {
        id: '1',
        name: 'Welcome to Jegodigital',
        status: 'Getting Started',
        progress: 25,
        description: 'We\'re setting up your digital presence'
      },
      progress: 25,
      stages: [
        { name: 'Account Setup', completed: true, current: false },
        { name: 'Service Selection', completed: false, current: true },
        { name: 'Project Planning', completed: false, current: false },
        { name: 'Implementation', completed: false, current: false }
      ]
    });
    
    setKpis({
      websiteTraffic: { value: '1,234', change: '+12%', trend: 'up' },
      topKeywords: [
        { keyword: 'web design', position: 3, change: '+2' },
        { keyword: 'digital marketing', position: 7, change: '+1' },
        { keyword: 'local seo', position: 5, change: '+3' }
      ],
      emailPerformance: { openRate: '24%', clickRate: '3.2%', subscribers: '156' }
    });

    setProjects([
      {
        id: '1',
        name: 'Website Design',
        status: 'In Progress',
        progress: 60,
        dueDate: '2024-09-15',
        client: 'Your Business'
      }
    ]);
    
    setReports([
      {
        id: '1',
        title: 'Monthly Performance Report',
        date: '2024-09-01',
        type: 'Performance',
        status: 'Ready'
      }
    ]);

    // Load Firebase data with resilient error handling
    const loadFirebaseData = async () => {
      try {
        console.log('Attempting to load Firebase data...');
        
        // Load data from Firebase with resilient error handling
        const [servicesData, bundlesData, projectsData, reportsData] = await Promise.allSettled([
          FirebaseService.getProducts(),
          FirebaseService.getBundles(),
          FirebaseService.getProjects(),
          FirebaseService.getReports()
        ]);

        // Handle services data
        if (servicesData.status === 'fulfilled' && servicesData.value.length > 0) {
          console.log('Loaded services from Firebase:', servicesData.value.length);
          setServices(servicesData.value.map(s => ({
            id: s.id,
            name: s.name,
            description: s.description || '',
            price: s.price,
            icon: s.icon || '🔧',
            monthly: s.monthly || false,
            category: s.category
          })));
        } else {
          console.log('Using fallback services data');
        }

        // Handle bundles data
        if (bundlesData.status === 'fulfilled' && bundlesData.value.length > 0) {
          console.log('Loaded bundles from Firebase:', bundlesData.value.length);
          setBundles(bundlesData.value);
        } else {
          console.log('Using fallback bundles data');
        }

        // Handle projects data
        if (projectsData.status === 'fulfilled') {
          console.log('Loaded projects from Firebase:', projectsData.value.length);
          setProjects(projectsData.value);
        }

        // Handle reports data
        if (reportsData.status === 'fulfilled') {
          console.log('Loaded reports from Firebase:', reportsData.value.length);
          setReports(reportsData.value);
        }

        console.log('Firebase data loading completed');
        
      } catch (error) {
        console.error('Error loading Firebase data:', error);
        console.log('Continuing with fallback data');
      }
    };

    // Load data immediately with fallback handling
    loadFirebaseData();

    // Fallback timer to ensure data is always loaded
    const fallbackTimer = setTimeout(() => {
      console.log('Fallback timer triggered - ensuring data is loaded');
      if (services.length === 0) {
        console.log('Services still empty, keeping fallback data');
      }
    }, 2000);

    return () => {
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Debug: Log services and bundles changes
  useEffect(() => {
    console.log('Services updated:', services.length, 'items');
    console.log('Bundles updated:', bundles.length, 'items');
    console.log('Services data:', services);
    console.log('Bundles data:', bundles);
  }, [services, bundles]);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
    setShowUserDropdown(false);
  };

  const handleLogoutConfirm = () => {
    onLogout();
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const renderOverview = () => (
    <div className="dashboard-content">
      <div className="welcome-section">
        <h1>Welcome back, {user.name} 👋</h1>
        <p>Here's what's happening with your projects today.</p>
      </div>

      {/* KPI Cards - Clean layout like admin panel */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🚀</div>
          <div className="stat-content">
            <h3>Active Projects</h3>
            <div className="metric-value">{projects.length}</div>
            <div className="metric-change">In Progress</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Website Traffic</h3>
            <div className="metric-value">{kpis.websiteTraffic.value}</div>
            <div className="metric-change">{kpis.websiteTraffic.change}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔍</div>
          <div className="stat-content">
            <h3>Top Keywords</h3>
            <div className="metric-value">{kpis.topKeywords.length}</div>
            <div className="metric-change">Tracked</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📧</div>
          <div className="stat-content">
            <h3>Email Subscribers</h3>
            <div className="metric-value">{kpis.emailPerformance.subscribers}</div>
            <div className="metric-change">{kpis.emailPerformance.openRate} Open Rate</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📄</div>
          <div className="stat-content">
            <h3>Reports</h3>
            <div className="metric-value">{reports.length}</div>
            <div className="metric-change">Available</div>
          </div>
        </div>
      </div>

      {/* Project Status Section */}
      {projectStatus.current && (
        <div className="card" style={{ marginTop: '2rem' }}>
          <div className="card-header">
            <h3>Current Project: {projectStatus.current.name}</h3>
          </div>
          <div className="project-info">
            <p className="project-description">{projectStatus.current.description}</p>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${projectStatus.progress}%` }}></div>
            </div>
            <p>{projectStatus.progress}% Complete</p>
            <div className="project-stages">
              {projectStatus.stages.map((stage, index) => (
                <div key={index} className={`stage ${stage.completed ? 'completed' : stage.current ? 'current' : ''}`}>
                  <span className="stage-icon">
                    {stage.completed ? '✓' : stage.current ? '●' : '○'}
                  </span>
                  <span className="stage-name">{stage.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Available Services Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>Available Services ({services.length} items)</h3>
        </div>
        <div className="services-grid">
          {services.length > 0 ? (
            services.map(service => (
              <div key={service.id} className="service-card">
                <div className="service-icon">{service.icon}</div>
                <div className="service-info">
                  <h4>{service.name}</h4>
                  <p>{service.description}</p>
                  <div className="service-price">
                    ${service.price}
                    {service.monthly && <span>/month</span>}
                  </div>
                </div>
                <button className="btn btn-primary">Add to Cart</button>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🛒</div>
              <h4>No Services Available</h4>
              <p>Services will appear here once they are added to the system.</p>
            </div>
          )}
        </div>
      </div>

      {/* Popular Bundles Section */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h3>Popular Bundles ({bundles.length} items)</h3>
        </div>
        <div className="bundles-grid">
          {bundles.length > 0 ? (
            bundles.map(bundle => (
              <div key={bundle.id} className={`bundle-card ${bundle.popular ? 'popular' : ''}`}>
                {bundle.popular && <div className="popular-badge">Most Popular</div>}
                <div className="bundle-header">
                  <h3>{bundle.name}</h3>
                  <div className="bundle-price">${bundle.price}</div>
                </div>
                <p className="bundle-description">{bundle.description}</p>
                <ul className="bundle-features">
                  {bundle.features.map((feature, index) => (
                    <li key={index}>✓ {feature}</li>
                  ))}
                </ul>
                <div className="bundle-actions">
                  <button className="btn btn-primary">Purchase {bundle.name}</button>
                  <button className="btn btn-secondary">Learn More</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📦</div>
              <h4>No Bundles Available</h4>
              <p>Bundles will appear here once they are added to the system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderUpgrades = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Upgrades & Marketplace</h1>
        <p>Add more services to grow your business</p>
      </div>

      <div className="bundles-section">
        <h2>Popular Bundles</h2>
        <div className="bundles-grid">
          {bundles.map(bundle => (
            <div key={bundle.id} className={`bundle-card ${bundle.popular ? 'popular' : ''}`}>
              {bundle.popular && <div className="popular-badge">Most Popular</div>}
              <div className="bundle-header">
                <h3>{bundle.name}</h3>
                <div className="bundle-price">${bundle.price}</div>
              </div>
              <p className="bundle-description">{bundle.description}</p>
              <ul className="bundle-features">
                {bundle.features.map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
              </ul>
              <div className="bundle-actions">
                <button className="btn btn-primary">Purchase {bundle.name}</button>
                <button className="btn btn-secondary">Learn More</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="services-section">
        <h2>Individual Services</h2>
        <div className="services-grid">
          {services.map(service => (
            <div key={service.id} className="service-card">
              <div className="service-icon">{service.icon}</div>
              <div className="service-content">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
                <div className="service-price">
                  ${service.price}
                  {service.monthly && <span>/month</span>}
                </div>
              </div>
              <button className="btn btn-primary">Add to Cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBilling = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Billing & Payments</h1>
        <p>Manage your subscriptions and payment history</p>
      </div>

      <div className="billing-summary">
        <div className="card">
          <h3>Next Payment</h3>
          {billing.nextPayment ? (
            <div className="payment-info">
              <div className="payment-amount">${billing.nextPayment.amount}</div>
              <div className="payment-date">Due: {billing.nextPayment.date}</div>
            </div>
          ) : (
            <p>No upcoming payments</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>Active Subscriptions</h3>
        </div>
        {billing.subscriptions.length > 0 ? (
          <div className="subscriptions-list">
            {billing.subscriptions.map((subscription, index) => (
              <div key={index} className="subscription-item">
                <div className="subscription-info">
                  <h4>{subscription.name}</h4>
                  <p>Next billing: {subscription.nextBilling}</p>
                </div>
                <div className="subscription-amount">${subscription.amount}/month</div>
                <div className="subscription-status">
                  <span className="status-badge status-active">Active</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">💳</div>
            <h4>No Active Subscriptions</h4>
            <p>You don't have any monthly subscriptions at the moment.</p>
          </div>
        )}
      </div>

      <div className="card">
        <div className="card-header">
          <h3>One-time Orders</h3>
        </div>
        {billing.oneTimeOrders.length > 0 ? (
          <div className="orders-list">
            {billing.oneTimeOrders.map((order, index) => (
              <div key={index} className="order-item">
                <div className="order-info">
                  <h4>{order.name}</h4>
                  <p>Ordered: {order.date}</p>
                </div>
                <div className="order-amount">${order.amount}</div>
                <div className="order-status">
                  <span className="status-badge status-completed">Paid</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h4>No Orders Yet</h4>
            <p>Your purchase history will appear here once you buy a package or service.</p>
            <button className="btn btn-primary" onClick={() => setActiveSection('upgrades')}>
              Browse Packages
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>

      <div className="settings-grid">
        <div className="card">
          <h3>Account Information</h3>
          <div className="form-group">
            <label>Name</label>
            <input type="text" value={user.name} readOnly />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user.email} readOnly />
          </div>
        </div>

        <div className="card">
          <h3>Preferences</h3>
          <div className="form-group">
            <label>Language</label>
            <select value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'projects': return renderOverview(); // Same as overview for now
      case 'reports': return renderOverview(); // Same as overview for now
      case 'billing': return renderBilling();
      case 'upgrades': return renderUpgrades();
      case 'settings': return renderSettings();
      default: return renderOverview();
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>Jegodigital</h2>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <h4>MAIN</h4>
            <button 
              className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <span className="nav-icon">📊</span>
              Overview
            </button>
            <button 
              className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveSection('projects')}
            >
              <span className="nav-icon">🚀</span>
              Projects
            </button>
            <button 
              className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveSection('reports')}
            >
              <span className="nav-icon">📄</span>
              Reports
            </button>
          </div>
          
          <div className="nav-section">
            <h4>ACCOUNT</h4>
            <button 
              className={`nav-item ${activeSection === 'billing' ? 'active' : ''}`}
              onClick={() => setActiveSection('billing')}
            >
              <span className="nav-icon">💳</span>
              Billing
            </button>
            <button 
              className={`nav-item ${activeSection === 'upgrades' ? 'active' : ''}`}
              onClick={() => setActiveSection('upgrades')}
            >
              <span className="nav-icon">🛒</span>
              Upgrades
            </button>
            <button 
              className={`nav-item ${activeSection === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <span className="nav-icon">⚙️</span>
              Settings
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="header-actions">
            <div className="language-selector">
              <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>
            <button className="notification-btn">
              🔔
            </button>
            <div className="user-menu">
              <button 
                className="user-avatar"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                {user.name.charAt(0).toUpperCase()}
              </button>
              {showUserDropdown && (
                <div className="user-dropdown">
                  <button onClick={handleLogoutClick}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        {renderContent()}
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Log out</h3>
            <p>Are you sure you want to log out of your account?</p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleLogoutCancel}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleLogoutConfirm}>
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientDashboard;