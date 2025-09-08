import React, { useState, useEffect } from 'react';
import { FirebaseService, Client, Payment, Project, SupportTicket } from '../services/firebaseService';
import ProductModal from './ProductModal';
import InviteMemberModal from './InviteMemberModal';
import NewProjectModal from './NewProjectModal';
import ProjectDetailsModal from './ProjectDetailsModal';
import UpdateStatusModal from './UpdateStatusModal';
import AddClientModal from './AddClientModal';
import NewOrderModal from './NewOrderModal';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'staff';
  company?: string;
  avatar?: string;
}

interface AdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [currentLanguage, setCurrentLanguage] = useState<'en' | 'es'>('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications] = useState([]);
  const [overview, setOverview] = useState({
    dailyRevenue: 0,
    activeClients: 0,
    activeSubscriptions: 0,
    projectsDue: 0,
    openTickets: 0
  });
  const [clients, setClients] = useState<Client[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showEditProductModal, setShowEditProductModal] = useState(false);
  const [showInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [showUpdateStatusModal, setShowUpdateStatusModal] = useState(false);
  const [showAddClientModal, setShowAddClientModal] = useState(false);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [products, setProducts] = useState([
    { id: '1', name: 'Website Design', category: 'One-time', price: 990, status: 'ACTIVE', description: 'Professional 5-page website design with modern UI/UX' },
    { id: '2', name: 'Website Redesign', category: 'One-time', price: 490, status: 'ACTIVE', description: 'Optimize and redesign existing website for better performance' },
    { id: '3', name: 'Local SEO Setup', category: 'One-time', price: 600, status: 'ACTIVE', description: 'Complete local SEO optimization for Google My Business and local search' },
    { id: '4', name: 'Google Maps Setup', category: 'One-time', price: 280, status: 'ACTIVE', description: 'Google My Business profile optimization and local listing management' },
    { id: '5', name: 'Email Marketing Setup', category: 'One-time', price: 420, status: 'ACTIVE', description: 'Email automation setup and campaign configuration' },
    { id: '6', name: 'Analytics Setup', category: 'One-time', price: 180, status: 'ACTIVE', description: 'Google Analytics 4 and Google Search Console setup' },
    { id: '7', name: 'Email Campaigns', category: 'Monthly', price: 300, status: 'ACTIVE', description: 'Monthly email marketing campaign management and optimization' },
    { id: '8', name: 'Hosting & Maintenance', category: 'Monthly', price: 69, status: 'ACTIVE', description: 'Website hosting, security updates, and technical maintenance' },
    { id: '9', name: 'Advanced SEO', category: 'Monthly', price: 300, status: 'ACTIVE', description: 'Ongoing SEO optimization, keyword research, and content strategy' },
    { id: '10', name: 'Custom Reports', category: 'Monthly', price: 150, status: 'ACTIVE', description: 'Monthly performance reports and analytics insights' }
  ]);
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Alex Jego', email: 'alex@jegodigital.com', role: 'ADMIN', status: 'ACTIVE', avatar: 'A' }
  ]);

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

  // Product Management Functions
  const handleAddProduct = async (productData: any) => {
    try {
      const newProduct = {
        id: Date.now().toString(),
        ...productData,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
      };
      
      // Add to Firebase
      await FirebaseService.addProduct(newProduct);
      
      // Update local state
      setProducts([...products, newProduct]);
      setShowAddProductModal(false);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleEditProduct = async (productData: any) => {
    try {
      const updatedProduct = { ...editingProduct, ...productData };
      
      // Update in Firebase
      await FirebaseService.updateProduct(editingProduct.id, updatedProduct);
      
      // Update local state
      setProducts(products.map(p => p.id === editingProduct.id ? updatedProduct : p));
      setShowEditProductModal(false);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      // Delete from Firebase
      await FirebaseService.deleteProduct(productId);
      
      // Update local state
      setProducts(products.filter(p => p.id !== productId));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const openEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowEditProductModal(true);
  };

  // Team Management Functions
  const handleInviteMember = async (memberData: any) => {
    try {
      const newMember = {
        id: Date.now().toString(),
        ...memberData,
        status: 'PENDING',
        avatar: memberData.name.charAt(0).toUpperCase(),
        createdAt: new Date().toISOString()
      };
      
      // Add to Firebase
      await FirebaseService.addTeamMember(newMember);
      
      // Update local state
      setTeamMembers([...teamMembers, newMember]);
      setShowInviteMemberModal(false);
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const handleToggleMemberStatus = async (memberId: string) => {
    try {
      const member = teamMembers.find(m => m.id === memberId);
      if (!member) return;
      
      const newStatus = member.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      
      // Update in Firebase
      await FirebaseService.updateTeamMember(memberId, { status: newStatus });
      
      // Update local state
      setTeamMembers(teamMembers.map(m => 
        m.id === memberId 
          ? { ...m, status: newStatus }
          : m
      ));
    } catch (error) {
      console.error('Error updating member status:', error);
    }
  };

  // Project Management Functions
  const handleNewProject = async (projectData: any) => {
    try {
      console.log('Creating new project with data:', projectData);
      
      const newProject = {
        id: Date.now().toString(),
        name: projectData.name,
        client: projectData.client,
        clientId: 'client-' + Date.now(), // Generate a client ID
        dueDate: projectData.dueDate,
        priority: projectData.priority,
        description: projectData.description || '',
        status: 'IN-PROGRESS',
        created: new Date().toISOString().split('T')[0],
        milestones: [],
        createdAt: new Date().toISOString()
      };
      
      console.log('Formatted project data:', newProject);
      
      // Add to Firebase
      await FirebaseService.addProject(newProject);
      console.log('Project added to Firebase successfully');
      
      // Update local state
      setProjects([...projects, newProject]);
      setShowNewProjectModal(false);
      console.log('Project created successfully');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project: ' + error.message);
    }
  };

  const handleViewProjectDetails = (project: any) => {
    setSelectedProject(project);
    setShowProjectDetailsModal(true);
  };

  const handleUpdateProjectStatus = (project: any) => {
    setSelectedProject(project);
    setShowUpdateStatusModal(true);
  };

  const handleStatusUpdate = async (projectId: string, newStatus: string) => {
    try {
      // Update in Firebase
      await FirebaseService.updateProject(projectId, { status: newStatus });
      
      // Update local state
      setProjects(projects.map(p => 
        p.id === projectId 
          ? { ...p, status: newStatus }
          : p
      ));
      setShowUpdateStatusModal(false);
      setSelectedProject(null);
    } catch (error) {
      console.error('Error updating project status:', error);
    }
  };

  // Client Management Functions
  const handleAddClient = async (clientData: any) => {
    try {
      console.log('Creating new client with data:', clientData);
      
      const newClient = {
        id: 'client-' + Date.now(),
        name: clientData.name,
        email: clientData.email,
        company: clientData.company || 'N/A',
        phone: clientData.phone || 'N/A',
        status: clientData.status,
        createdAt: new Date().toISOString()
      };
      
      console.log('Formatted client data:', newClient);
      
      // Add to Firebase
      await FirebaseService.addClient(newClient);
      console.log('Client added to Firebase successfully');
      
      // Update local state
      setClients([...clients, newClient]);
      setShowAddClientModal(false);
      console.log('Client created successfully');
    } catch (error) {
      console.error('Error creating client:', error);
      alert('Error creating client: ' + error.message);
    }
  };

  // Order Management Functions
  const handleNewOrder = async (orderData: any) => {
    try {
      console.log('Creating new order with data:', orderData);
      
      const newOrder = {
        id: 'order-' + Date.now(),
        clientId: orderData.clientId,
        productId: orderData.productId,
        amount: parseFloat(orderData.amount),
        type: orderData.type,
        description: orderData.description || '',
        status: orderData.status,
        createdAt: new Date().toISOString()
      };
      
      console.log('Formatted order data:', newOrder);
      
      // Add to Firebase
      await FirebaseService.addPayment(newOrder);
      console.log('Order added to Firebase successfully');
      
      // Update local state
      setPayments([...payments, newOrder]);
      setShowNewOrderModal(false);
      console.log('Order created successfully');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order: ' + error.message);
    }
  };

  // Load data from Firebase
  useEffect(() => {
    // Load immediately with existing data (no loading state)
    setLoading(false);
    
    // Load Firebase data in background (non-blocking)
    const loadFirebaseData = async () => {
      try {
        const [productsData, teamData, projectsData, clientsData, paymentsData, ticketsData] = await Promise.all([
          FirebaseService.getProducts(),
          FirebaseService.getTeamMembers(),
          FirebaseService.getProjects(),
          FirebaseService.getClients(),
          FirebaseService.getPayments(),
          FirebaseService.getSupportTickets()
        ]);

        // Update state with Firebase data only if we have data
        if (productsData.length > 0) {
          setProducts(productsData.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            status: p.status,
            description: p.description || ''
          })));
        }
        if (teamData.length > 0) {
          setTeamMembers(teamData);
        }
        if (projectsData.length > 0) {
          setProjects(projectsData);
        }
        if (clientsData.length > 0) {
          setClients(clientsData);
        }
        if (paymentsData.length > 0) {
          setPayments(paymentsData);
        }
        if (ticketsData.length > 0) {
          setSupportTickets(ticketsData);
        }

        // Calculate overview metrics from real data
        const today = new Date().toDateString();
        const dailyRevenue = paymentsData.reduce((sum, payment) => 
          new Date(payment.createdAt).toDateString() === today ? sum + payment.amount : sum, 0);
        
        const activeClients = clientsData.filter(c => c.status === 'ACTIVE' || c.status === 'active').length;
        const activeSubscriptions = paymentsData.filter(p => 
          p.type === 'subscription' && (p.status === 'ACTIVE' || p.status === 'completed')).length;
        const projectsDue = projectsData.filter(p => new Date(p.dueDate) <= new Date()).length;
        const openTickets = ticketsData.filter(t => t.status === 'OPEN' || t.status === 'open').length;

        setOverview({
          dailyRevenue,
          activeClients,
          activeSubscriptions,
          projectsDue,
          openTickets
        });

      } catch (error) {
        console.error('Error loading Firebase data:', error);
        // Don't show error to user, just log it
      }
    };

    // Load Firebase data in background
    loadFirebaseData();
  }, []);

  // Helper function to get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Unknown Client';
  };


  const analytics = {
    revenue: {
      oneTime: 0,
      subscriptions: 0,
      total: 0
    },
    topServices: [],
    churnRate: 0,
    conversionRate: 0
  };

  const renderOverview = () => {
    if (loading) {
      return (
        <div className="dashboard-content">
          <div className="welcome-section">
            <h1>Welcome back, {user.name} 👋</h1>
            <p>Loading your business data...</p>
          </div>
          <div className="loading-spinner">⏳</div>
        </div>
      );
    }

    return (
      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome back, {user.name} 👋</h1>
          <p>Here's your business overview for today.</p>
        </div>

        {/* Key Metrics */}
        <div className="metrics-grid">
          <div className="card metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <div className="metric-value">${overview.dailyRevenue.toLocaleString()}</div>
              <div className="metric-label">Daily Revenue</div>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <div className="metric-value">{overview.activeClients}</div>
              <div className="metric-label">Active Clients</div>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon">🔄</div>
            <div className="metric-content">
              <div className="metric-value">{overview.activeSubscriptions}</div>
              <div className="metric-label">Active Subscriptions</div>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon">🚀</div>
            <div className="metric-content">
              <div className="metric-value">{overview.projectsDue}</div>
              <div className="metric-label">Projects Due This Week</div>
            </div>
          </div>
          <div className="card metric-card">
            <div className="metric-icon">🎫</div>
            <div className="metric-content">
              <div className="metric-value">{overview.openTickets}</div>
              <div className="metric-label">Open Support Tickets</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="recent-activity">
          <div className="card">
            <div className="card-header">
              <h3>Recent Activity</h3>
            </div>
            <div className="activity-list">
              {payments.length > 0 && (
                <div className="activity-item">
                  <div className="activity-icon">💰</div>
                  <div className="activity-content">
                    <div className="activity-text">New payment received from {getClientName(payments[0].clientId)}</div>
                    <div className="activity-time">Recently</div>
                  </div>
                  <div className="activity-amount">${payments[0].amount.toLocaleString()}</div>
                </div>
              )}
              {projects.length > 0 && (
                <div className="activity-item">
                  <div className="activity-icon">🚀</div>
                  <div className="activity-content">
                    <div className="activity-text">Project "{projects[0].name}" is {projects[0].status}</div>
                    <div className="activity-time">Recently</div>
                  </div>
                </div>
              )}
              {supportTickets.length > 0 && (
                <div className="activity-item">
                  <div className="activity-icon">🎫</div>
                  <div className="activity-content">
                    <div className="activity-text">New support ticket from {getClientName(supportTickets[0].clientId)}</div>
                    <div className="activity-time">Recently</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderClients = () => {
    if (loading) {
      return (
        <div className="dashboard-content">
          <div className="section-header">
            <h1>Clients</h1>
          </div>
          <div className="loading-spinner">⏳ Loading clients...</div>
        </div>
      );
    }

    return (
      <div className="dashboard-content">
        <div className="section-header">
          <h1>Clients</h1>
          <button className="btn btn-primary" onClick={() => setShowAddClientModal(true)}>Add New Client</button>
        </div>

        {clients.length > 0 ? (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {clients.map(client => (
                  <tr key={client.id}>
                    <td>
                      <div className="client-info">
                        <div className="client-avatar">{client.name.charAt(0)}</div>
                        <div>
                          <div className="client-name">{client.name}</div>
                          <div className="client-email">{client.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{client.company}</td>
                    <td>
                      <span className={`status-badge status-${client.status}`}>
                        {client.status}
                      </span>
                    </td>
                    <td>{client.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</td>
                    <td>
                      <button className="btn btn-outline">View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">👥</div>
            <h3>No Clients Yet</h3>
            <p>Your client list is empty. Start by adding your first client.</p>
            <button className="btn btn-primary">Add Your First Client</button>
          </div>
        )}
      </div>
    );
  };

  const renderOrders = () => {
    if (loading) {
      return (
        <div className="dashboard-content">
          <div className="section-header">
            <h1>Orders & Payments</h1>
          </div>
          <div className="loading-spinner">⏳ Loading payments...</div>
        </div>
      );
    }

    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);

    return (
      <div className="dashboard-content">
        <div className="section-header">
          <h1>Orders & Payments</h1>
          <div className="section-actions">
            <button className="btn btn-outline">Export</button>
            <button className="btn btn-primary" onClick={() => setShowNewOrderModal(true)}>New Order</button>
          </div>
        </div>

        {/* Revenue Summary */}
        <div className="revenue-summary">
          <div className="card">
            <h3>Revenue Summary</h3>
            <div className="revenue-grid">
              <div className="revenue-item">
                <div className="revenue-label">Total Revenue</div>
                <div className="revenue-value total">${totalRevenue.toLocaleString()}</div>
              </div>
              <div className="revenue-item">
                <div className="revenue-label">Completed Payments</div>
                <div className="revenue-value">{payments.filter(p => p.status === 'completed').length}</div>
              </div>
              <div className="revenue-item">
                <div className="revenue-label">Pending Payments</div>
                <div className="revenue-value">{payments.filter(p => p.status === 'pending').length}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Client</th>
                <th>Service</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{getClientName(payment.clientId)}</td>
                  <td>{payment.service}</td>
                  <td>${payment.amount.toLocaleString()}</td>
                  <td>
                    <span className={`status-badge status-${payment.status}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td>{payment.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}</td>
                  <td>
                    <button className="btn btn-outline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderProjects = () => {
    if (loading) {
      return (
        <div className="dashboard-content">
          <div className="section-header">
            <h1>Projects</h1>
          </div>
          <div className="loading-spinner">⏳ Loading projects...</div>
        </div>
      );
    }

    return (
      <div className="dashboard-content">
        <div className="section-header">
          <h1>Projects</h1>
          <button 
            className="btn btn-primary"
            onClick={() => setShowNewProjectModal(true)}
          >
            New Project
          </button>
        </div>

        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map(project => (
              <div key={project.id} className="card project-card">
                <div className="project-header">
                  <h3>{project.name}</h3>
                  <span className={`status-badge status-${project.status}`}>
                    {project.status}
                  </span>
                </div>
                <div className="project-client">{getClientName(project.clientId)}</div>
                <div className="project-details">
                  <div className="project-due">
                    <strong>Due:</strong> {project.dueDate}
                  </div>
                  <div className="project-created">
                    <strong>Created:</strong> {project.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </div>
                </div>
                <div className="project-actions">
                  <button 
                    className="btn btn-outline"
                    onClick={() => handleViewProjectDetails(project)}
                  >
                    View Details
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleUpdateProjectStatus(project)}
                  >
                    Update Status
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">🚀</div>
            <h3>No Projects Yet</h3>
            <p>Create your first project to start managing client work.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setShowNewProjectModal(true)}
            >
              Create Your First Project
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderSupport = () => {
    if (loading) {
      return (
        <div className="dashboard-content">
          <div className="section-header">
            <h1>Support Tickets</h1>
          </div>
          <div className="loading-spinner">⏳ Loading support tickets...</div>
        </div>
      );
    }

    return (
      <div className="dashboard-content">
        <div className="section-header">
          <h1>Support Tickets</h1>
          <button className="btn btn-primary">New Ticket</button>
        </div>

        <div className="tickets-grid">
          {supportTickets.map(ticket => (
            <div key={ticket.id} className="card ticket-card">
              <div className="ticket-header">
                <div className="ticket-id">{ticket.id}</div>
                <span className={`status-badge status-${ticket.status}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="ticket-client">{getClientName(ticket.clientId)}</div>
              <div className="ticket-subject">{ticket.subject}</div>
              <div className="ticket-details">
                <div className="ticket-priority">
                  <strong>Priority:</strong> 
                  <span className={`priority-${ticket.priority}`}>{ticket.priority}</span>
                </div>
                <div className="ticket-date">
                  <strong>Created:</strong> {ticket.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                </div>
              </div>
              <div className="ticket-actions">
                <button className="btn btn-outline">View</button>
                <button className="btn btn-primary">Reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


  const renderAnalytics = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <h1>Analytics</h1>
      </div>

      {/* Key Metrics */}
      <div className="analytics-grid">
        <div className="card">
          <h3>Revenue Breakdown</h3>
          <div className="revenue-chart">
            <div className="chart-item">
              <div className="chart-label">One-time Sales</div>
              <div className="chart-bar">
                <div className="chart-fill" style={{ width: '58%' }}></div>
              </div>
              <div className="chart-value">${analytics.revenue.oneTime.toLocaleString()}</div>
            </div>
            <div className="chart-item">
              <div className="chart-label">Subscriptions</div>
              <div className="chart-bar">
                <div className="chart-fill" style={{ width: '42%' }}></div>
              </div>
              <div className="chart-value">${analytics.revenue.subscriptions.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="card">
          <h3>Top Selling Services</h3>
          <div className="top-services">
            {analytics.topServices.map((service, index) => (
              <div key={index} className="service-item">
                <div className="service-rank">#{index + 1}</div>
                <div className="service-info">
                  <div className="service-name">{service.name}</div>
                  <div className="service-stats">
                    {service.sales} sales • ${service.revenue.toLocaleString()} revenue
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Business Metrics</h3>
          <div className="metrics-list">
            <div className="metric-item">
              <div className="metric-label">Churn Rate</div>
              <div className="metric-value">{analytics.churnRate}%</div>
            </div>
            <div className="metric-item">
              <div className="metric-label">Conversion Rate</div>
              <div className="metric-value">{analytics.conversionRate}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <div>
          <h1>Products & Pricing</h1>
          <p>Manage your service catalog and pricing</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAddProductModal(true)}
        >
          Add Product
        </button>
      </div>

      {products.length > 0 ? (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>${product.price}</td>
                  <td>
                    <span className={`status-badge status-${product.status.toLowerCase()}`}>
                      {product.status}
                    </span>
                  </td>
                  <td>
                    <button 
                      className="btn btn-outline btn-sm"
                      onClick={() => openEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No Products Yet</h3>
          <p>Start building your service catalog by adding your first product.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAddProductModal(true)}
          >
            Add Your First Product
          </button>
        </div>
      )}
    </div>
  );

  const renderTeam = () => (
    <div className="dashboard-content">
      <div className="section-header">
        <div>
          <h1>Team Management</h1>
          <p>Manage your team members and their roles</p>
        </div>
        <button 
          className="btn btn-primary"
          onClick={() => setShowInviteMemberModal(true)}
        >
          Invite Member
        </button>
      </div>

      {teamMembers.length > 0 ? (
        <div className="team-grid">
          {teamMembers.map(member => (
            <div key={member.id} className="team-card">
              <div className="team-avatar">{member.avatar}</div>
              <div className="team-info">
                <h3>{member.name}</h3>
                <p>{member.email}</p>
                <span className="team-role">{member.role}</span>
              </div>
              <div className="team-actions">
                <span className={`status-badge status-${member.status.toLowerCase()}`}>
                  {member.status}
                </span>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={() => handleToggleMemberStatus(member.id)}
                >
                  {member.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <h3>No Team Members Yet</h3>
          <p>Invite your first team member to start collaborating.</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowInviteMemberModal(true)}
          >
            Invite Your First Member
          </button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview': return renderOverview();
      case 'clients': return renderClients();
      case 'orders': return renderOrders();
      case 'projects': return renderProjects();
      case 'support': return renderSupport();
      case 'products': return renderProducts();
      case 'team': return renderTeam();
      case 'analytics': return renderAnalytics();
      default: return renderOverview();
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <div className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">Jegodigital</div>
        </div>
        
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Overview</div>
            <div 
              className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <span className="nav-item-icon">📊</span>
              <span className="nav-item-text">Dashboard</span>
            </div>
            <div 
              className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveSection('analytics')}
            >
              <span className="nav-item-icon">📈</span>
              <span className="nav-item-text">Analytics</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Management</div>
            <div 
              className={`nav-item ${activeSection === 'clients' ? 'active' : ''}`}
              onClick={() => setActiveSection('clients')}
            >
              <span className="nav-item-icon">👥</span>
              <span className="nav-item-text">Clients</span>
            </div>
            <div 
              className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveSection('orders')}
            >
              <span className="nav-item-icon">💳</span>
              <span className="nav-item-text">Orders & Payments</span>
            </div>
            <div 
              className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`}
              onClick={() => setActiveSection('projects')}
            >
              <span className="nav-item-icon">🚀</span>
              <span className="nav-item-text">Projects</span>
            </div>
            <div 
              className={`nav-item ${activeSection === 'support' ? 'active' : ''}`}
              onClick={() => setActiveSection('support')}
            >
              <span className="nav-item-icon">🎫</span>
              <span className="nav-item-text">Support</span>
            </div>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">Settings</div>
            <div 
              className={`nav-item ${activeSection === 'products' ? 'active' : ''}`}
              onClick={() => setActiveSection('products')}
            >
              <span className="nav-item-icon">🛍️</span>
              <span className="nav-item-text">Products</span>
            </div>
            <div 
              className={`nav-item ${activeSection === 'team' ? 'active' : ''}`}
              onClick={() => setActiveSection('team')}
            >
              <span className="nav-item-icon">👥</span>
              <span className="nav-item-text">Team</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="dashboard-header">
          <div className="header-left">
            <h1 className="header-title">
              {activeSection === 'overview' && 'Admin Dashboard'}
              {activeSection === 'clients' && 'Clients'}
              {activeSection === 'orders' && 'Orders & Payments'}
              {activeSection === 'projects' && 'Projects'}
              {activeSection === 'support' && 'Support'}
              {activeSection === 'products' && 'Products'}
              {activeSection === 'team' && 'Team'}
              {activeSection === 'analytics' && 'Analytics'}
            </h1>
          </div>
          <div className="header-right">
            {/* Language Selector */}
            <div className="header-language-selector">
              <button 
                className="header-language-btn"
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                {currentLanguage.toUpperCase()}
                <span className="header-language-arrow">▼</span>
              </button>
              {showLanguageDropdown && (
                <div className="header-language-dropdown">
                  <button 
                    className={`header-language-option ${currentLanguage === 'en' ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentLanguage('en');
                      setShowLanguageDropdown(false);
                    }}
                  >
                    English
                  </button>
                  <button 
                    className={`header-language-option ${currentLanguage === 'es' ? 'active' : ''}`}
                    onClick={() => {
                      setCurrentLanguage('es');
                      setShowLanguageDropdown(false);
                    }}
                  >
                    Español
                  </button>
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="header-notifications">
              <button className="notification-bell">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                {notifications.filter(n => n.unread).length > 0 && (
                  <span className="notification-badge">
                    {notifications.filter(n => n.unread).length}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="header-user-menu">
              <button 
                className="user-avatar-btn"
                onClick={() => setShowUserDropdown(!showUserDropdown)}
              >
                <div className="user-avatar">{user.avatar || user.name.charAt(0)}</div>
                <span className="user-arrow">▼</span>
              </button>
              
              {showUserDropdown && (
                <div className="header-user-dropdown">
                  <button className="user-dropdown-item logout-item" onClick={handleLogoutClick}>
                    <span className="dropdown-icon">🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {renderContent()}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="logout-modal-overlay" onClick={handleLogoutCancel}>
          <div className="logout-modal" onClick={(e) => e.stopPropagation()}>
            <button className="logout-modal-close" onClick={handleLogoutCancel}>×</button>
            <div className="logout-modal-icon">⚠️</div>
            <h2 className="logout-modal-title">Log Out?</h2>
            <p className="logout-modal-message">Are you sure you want to log out of your account?</p>
            <div className="logout-modal-actions">
              <button className="logout-modal-cancel" onClick={handleLogoutCancel}>
                Cancel
              </button>
              <button className="logout-modal-confirm" onClick={handleLogoutConfirm}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddProductModal && (
        <ProductModal
          onClose={() => setShowAddProductModal(false)}
          onSave={handleAddProduct}
          title="Add New Product"
        />
      )}

      {/* Edit Product Modal */}
      {showEditProductModal && editingProduct && (
        <ProductModal
          onClose={() => {
            setShowEditProductModal(false);
            setEditingProduct(null);
          }}
          onSave={handleEditProduct}
          title="Edit Product"
          product={editingProduct}
        />
      )}

      {/* Invite Member Modal */}
      {showInviteMemberModal && (
        <InviteMemberModal
          onClose={() => setShowInviteMemberModal(false)}
          onSave={handleInviteMember}
        />
      )}

      {/* New Project Modal */}
      {showNewProjectModal && (
        <NewProjectModal
          onClose={() => setShowNewProjectModal(false)}
          onSave={handleNewProject}
        />
      )}

      {/* Project Details Modal */}
      {showProjectDetailsModal && selectedProject && (
        <ProjectDetailsModal
          project={selectedProject}
          onClose={() => {
            setShowProjectDetailsModal(false);
            setSelectedProject(null);
          }}
        />
      )}

      {/* Update Status Modal */}
      {showUpdateStatusModal && selectedProject && (
        <UpdateStatusModal
          project={selectedProject}
          onClose={() => {
            setShowUpdateStatusModal(false);
            setSelectedProject(null);
          }}
          onUpdate={handleStatusUpdate}
        />
      )}

      {/* Add Client Modal */}
      {showAddClientModal && (
        <AddClientModal
          onClose={() => setShowAddClientModal(false)}
          onSave={handleAddClient}
        />
      )}

      {/* New Order Modal */}
      {showNewOrderModal && (
        <NewOrderModal
          onClose={() => setShowNewOrderModal(false)}
          onSave={handleNewOrder}
          clients={clients}
          products={products}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
