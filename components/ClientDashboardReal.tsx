import React, { useState, useEffect } from 'react';
import PaymentComponent from '../PaymentComponent';
import { FirebaseServiceOffline } from '../services/firebaseServiceOffline';
import { ensureSignedIn, checkUserClaims } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

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

const ClientDashboardReal: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState<string>('loading');

  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('ClientDashboardReal: Starting REAL data load...');
        
        // Set up fallback data immediately
        const fallbackServices: Service[] = [
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

        const fallbackBundles: Bundle[] = [
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

        // Set fallback data immediately so UI shows
        setServices(fallbackServices);
        setBundles(fallbackBundles);
        setProjects([]);
        setReports([]);
        setLoading(false);
        setDataSource('fallback');

        console.log('Fallback data set, attempting Firebase connection...');

        // Try to load real data from Firebase
        try {
          // Wait for authentication
          await ensureSignedIn();
          console.log('User authenticated for real data load');

          // Check user claims
          const claims = await checkUserClaims();
          console.log('User claims:', claims);

          // Try to load real data from Firebase
          const healthCheck = await FirebaseServiceOffline.healthCheck();
          console.log('Firebase health check:', healthCheck);

          if (healthCheck.status === 'healthy') {
            console.log('Firebase is healthy, loading real data...');
            setDataSource('loading');
            
            const [servicesData, bundlesData, projectsData, reportsData] = await Promise.allSettled([
              FirebaseServiceOffline.getProducts(),
              FirebaseServiceOffline.getBundles(),
              FirebaseServiceOffline.getProjects(),
              FirebaseServiceOffline.getReports()
            ]);

            let hasRealData = false;

            // Update with real data if available
            if (servicesData.status === 'fulfilled' && servicesData.value.length > 0) {
              console.log('Loaded real services from Firebase:', servicesData.value.length);
              setServices(servicesData.value.map(s => ({
                id: s.id,
                name: s.name,
                description: s.description || '',
                price: s.price,
                icon: s.icon || '🔧',
                monthly: s.monthly || false,
                category: s.category
              })));
              hasRealData = true;
            }

            if (bundlesData.status === 'fulfilled' && bundlesData.value.length > 0) {
              console.log('Loaded real bundles from Firebase:', bundlesData.value.length);
              setBundles(bundlesData.value);
              hasRealData = true;
            }

            if (projectsData.status === 'fulfilled' && projectsData.value.length > 0) {
              console.log('Loaded real projects from Firebase:', projectsData.value.length);
              setProjects(projectsData.value);
              hasRealData = true;
            }

            if (reportsData.status === 'fulfilled' && reportsData.value.length > 0) {
              console.log('Loaded real reports from Firebase:', reportsData.value.length);
              setReports(reportsData.value);
              hasRealData = true;
            }

            if (hasRealData) {
              setDataSource('success');
              console.log('Real data loaded successfully from Firebase');
            } else {
              setDataSource('no-data');
              console.log('No real data found in Firebase, using fallback');
            }
          } else {
            console.log('Firebase is not healthy, using fallback data');
            setDataSource('unhealthy');
          }
        } catch (firebaseError) {
          console.error('Firebase data loading failed, using fallback data:', firebaseError);
          setDataSource('error');
        }

      } catch (error) {
        console.error('Error in client dashboard:', error);
        setDataSource('error');
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const getStatusMessage = () => {
    switch (dataSource) {
      case 'success':
        return { text: '✅ Real data loaded from Firebase', color: 'bg-green-900 border-green-700 text-green-200' };
      case 'loading':
        return { text: '🔄 Loading real data from Firebase...', color: 'bg-blue-900 border-blue-700 text-blue-200' };
      case 'no-data':
        return { text: '📊 No real data found, using fallback', color: 'bg-yellow-900 border-yellow-700 text-yellow-200' };
      case 'error':
        return { text: '⚠️ Using fallback data (Firebase error)', color: 'bg-red-900 border-red-700 text-red-200' };
      case 'unhealthy':
        return { text: '⚠️ Using fallback data (Firebase unhealthy)', color: 'bg-orange-900 border-orange-700 text-orange-200' };
      default:
        return { text: '📊 Using fallback data', color: 'bg-gray-800 border-gray-600 text-gray-200' };
    }
  };

  const status = getStatusMessage();

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
        <div className={`border rounded-lg p-4 mb-8 ${status.color}`}>
          <div className="flex items-center">
            <span className="mr-2">{status.text.split(' ')[0]}</span>
            <span>{status.text.substring(status.text.indexOf(' ') + 1)}</span>
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
        {projects.length > 0 && (
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
        )}

        {/* Reports Section */}
        {reports.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default ClientDashboardReal;
