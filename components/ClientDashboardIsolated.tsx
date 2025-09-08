import React, { useState, useEffect } from 'react';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  monthly: boolean;
  category: string;
}

interface Bundle {
  id: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  popular: boolean;
  order: number;
}

interface Project {
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

interface Report {
  id: string;
  title: string;
  generatedAt: string;
  type: 'monthly' | 'quarterly' | 'annual';
  data: any;
}

const ClientDashboardIsolated: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ClientDashboardIsolated: Starting ISOLATED dashboard load (NO FIREBASE IMPORTS AT ALL)...');
    
    // Simulate loading delay
    setTimeout(() => {
      // Set up static data - NO Firebase calls whatsoever
      const staticServices: Service[] = [
        {
          id: '1',
          name: 'Website Development',
          description: 'Custom website design and development',
          price: 2500,
          icon: '🌐',
          monthly: false,
          category: 'Development'
        },
        {
          id: '2',
          name: 'SEO Optimization',
          description: 'Search engine optimization services',
          price: 500,
          icon: '📈',
          monthly: true,
          category: 'Marketing'
        },
        {
          id: '3',
          name: 'Email Marketing',
          description: 'Automated email campaigns',
          price: 300,
          icon: '📧',
          monthly: true,
          category: 'Marketing'
        },
        {
          id: '4',
          name: 'Social Media Management',
          description: 'Complete social media strategy and management',
          price: 800,
          icon: '📱',
          monthly: true,
          category: 'Marketing'
        },
        {
          id: '5',
          name: 'Analytics & Reporting',
          description: 'Comprehensive analytics and monthly reports',
          price: 200,
          icon: '📊',
          monthly: true,
          category: 'Analytics'
        }
      ];

      const staticBundles: Bundle[] = [
        {
          id: '1',
          name: 'Starter Package',
          description: 'Perfect for small businesses getting started online',
          price: 1500,
          features: ['Basic Website', 'SEO Setup', 'Email Integration'],
          popular: false,
          order: 1
        },
        {
          id: '2',
          name: 'Growth Package',
          description: 'Comprehensive digital marketing solution',
          price: 3500,
          features: ['Advanced Website', 'Full SEO', 'Email Marketing', 'Social Media'],
          popular: true,
          order: 2
        },
        {
          id: '3',
          name: 'Enterprise Package',
          description: 'Complete digital transformation for large businesses',
          price: 7500,
          features: ['Custom Website', 'Advanced SEO', 'Marketing Automation', 'Analytics', 'Priority Support'],
          popular: false,
          order: 3
        }
      ];

      const staticProjects: Project[] = [
        {
          id: '1',
          name: 'Website Redesign',
          clientId: 'client-1',
          status: 'in_progress',
          priority: 'high',
          startDate: '2024-01-15',
          dueDate: '2024-02-15',
          progress: 75,
          description: 'Complete website redesign and optimization',
          budget: 5000,
          team: ['Designer', 'Developer']
        },
        {
          id: '2',
          name: 'SEO Campaign',
          clientId: 'client-1',
          status: 'planning',
          priority: 'medium',
          startDate: '2024-02-01',
          dueDate: '2024-03-01',
          progress: 25,
          description: 'Comprehensive SEO strategy and implementation',
          budget: 2000,
          team: ['SEO Specialist']
        }
      ];

      const staticReports: Report[] = [
        {
          id: '1',
          title: 'Monthly Performance Report',
          generatedAt: '2024-01-01T00:00:00Z',
          type: 'monthly',
          data: { visitors: 1250, conversions: 45, revenue: 15000 }
        },
        {
          id: '2',
          title: 'SEO Analysis Report',
          generatedAt: '2024-01-15T00:00:00Z',
          type: 'monthly',
          data: { keywords: 150, rankings: 85, traffic: 2100 }
        }
      ];

      // Set static data
      setServices(staticServices);
      setBundles(staticBundles);
      setProjects(staticProjects);
      setReports(staticReports);
      setLoading(false);
      
      console.log('ClientDashboardIsolated: Static data loaded successfully - ZERO FIREBASE IMPORTS OR CALLS');
    }, 1000); // 1 second delay to simulate loading
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white">Jegodigital</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select className="bg-gray-700 text-white px-3 py-2 rounded-md">
                <option value="en">EN</option>
              </select>
              <div className="relative">
                <button className="text-gray-300 hover:text-white">
                  🔔
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Welcome to Your Dashboard</h2>
          <p className="text-gray-300">Here's what's happening with your projects today.</p>
        </div>

        {/* Status Message */}
        <div className="bg-green-900 border border-green-700 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <span className="text-green-200">ISOLATED dashboard loaded successfully - ZERO Firebase imports or calls</span>
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Our Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors">
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{service.icon}</span>
                  <h4 className="text-lg font-semibold text-white">{service.name}</h4>
                </div>
                <p className="text-gray-300 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-400">${service.price.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">
                    {service.monthly ? '/month' : 'one-time'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bundles Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Service Bundles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bundles.map((bundle) => (
              <div key={bundle.id} className={`bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors ${bundle.popular ? 'ring-2 ring-blue-500' : ''}`}>
                {bundle.popular && (
                  <div className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h4 className="text-lg font-semibold text-white mb-2">{bundle.name}</h4>
                <p className="text-gray-300 mb-4">{bundle.description}</p>
                <div className="mb-4">
                  <ul className="space-y-2">
                    {bundle.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-300">
                        <span className="text-green-400 mr-2">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">${bundle.price.toLocaleString()}</div>
                  <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                    Get Started
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Your Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">{project.name}</h4>
                <p className="text-gray-300 mb-4">{project.description}</p>
                <div className="flex justify-between items-center mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    project.status === 'completed' ? 'bg-green-900 text-green-200' :
                    project.status === 'in_progress' ? 'bg-blue-900 text-blue-200' :
                    project.status === 'review' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-gray-700 text-gray-200'
                  }`}>
                    {project.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="text-sm text-gray-400">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reports Section */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <div key={report.id} className="bg-gray-800 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-2">{report.title}</h4>
                <p className="text-gray-300 mb-4">
                  {new Date(report.generatedAt).toLocaleDateString()}
                </p>
                <span className="px-2 py-1 bg-blue-900 text-blue-200 text-xs font-semibold rounded">
                  {report.type.toUpperCase()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Status */}
        <div className="bg-blue-900 border border-blue-700 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-blue-400 mr-2">ℹ️</span>
            <span className="text-blue-200">This dashboard uses only static data - no database connections, no authentication, no real-time updates, no Firebase imports whatsoever</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardIsolated;
