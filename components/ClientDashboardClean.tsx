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
  data: any;
  type: string;
  status: string;
}

const ClientDashboardClean: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // Set a timeout to prevent hanging
      const timeoutId = setTimeout(() => {
        console.log('Data loading timeout, using fallback data');
        setLoading(false);
      }, 10000); // 10 second timeout

      try {
        console.log('Starting clean client dashboard data load...');
        
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

        // Set fallback data immediately
        setServices(fallbackServices);
        setBundles(fallbackBundles);
        setProjects([]);
        setReports([]);

        console.log('Fallback data set, attempting Firebase connection...');
        
        // Set loading to false immediately so UI shows
        setLoading(false);

        // Wait for authentication
        await ensureSignedIn();
        console.log('User authenticated');

        // Check user claims
        const claims = await checkUserClaims();
        console.log('User claims:', claims);

        // Try to load real data from Firebase
        try {
          const healthCheck = await FirebaseServiceOffline.healthCheck();
          console.log('Firebase health check:', healthCheck);

          if (healthCheck.status === 'healthy') {
            console.log('Firebase is healthy, loading real data...');
            
            const [servicesData, bundlesData, projectsData, reportsData] = await Promise.allSettled([
              FirebaseServiceOffline.getProducts(),
              FirebaseServiceOffline.getBundles(),
              FirebaseServiceOffline.getProjects(),
              FirebaseServiceOffline.getReports()
            ]);

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
            }

            if (bundlesData.status === 'fulfilled' && bundlesData.value.length > 0) {
              console.log('Loaded real bundles from Firebase:', bundlesData.value.length);
              setBundles(bundlesData.value);
            }

            if (projectsData.status === 'fulfilled') {
              console.log('Loaded real projects from Firebase:', projectsData.value.length);
              setProjects(projectsData.value);
            }

            if (reportsData.status === 'fulfilled') {
              console.log('Loaded real reports from Firebase:', reportsData.value.length);
              setReports(reportsData.value);
            }
          } else {
            console.log('Firebase is not healthy, using fallback data');
          }
        } catch (firebaseError) {
          console.error('Firebase data loading failed, using fallback data:', firebaseError);
        }

        setLoading(false);
        clearTimeout(timeoutId);
        console.log('Client dashboard data loading completed');

      } catch (error) {
        console.error('Error in client dashboard:', error);
        setLoading(false);
        clearTimeout(timeoutId);
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-white mb-2">Dashboard</h2>
          <p className="text-gray-300">Welcome back, alex 👋</p>
          <p className="text-gray-400">Here's what's happening with your projects today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-600 rounded-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Active Projects</p>
                <p className="text-2xl font-bold text-white">{projects.length}</p>
                <p className="text-sm text-gray-500">In Progress</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-600 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Website Traffic</p>
                <p className="text-2xl font-bold text-white">1,234</p>
                <p className="text-sm text-green-500">+12%</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-600 rounded-lg">
                <span className="text-2xl">🔍</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Top Keywords</p>
                <p className="text-2xl font-bold text-white">3</p>
                <p className="text-sm text-gray-500">Tracked</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-600 rounded-lg">
                <span className="text-2xl">📧</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Email Subscribers</p>
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-sm text-gray-500">24% Open Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Our Services</h3>
            <div className="space-y-4">
              {services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{service.icon}</span>
                    <div>
                      <h4 className="font-medium text-white">{service.name}</h4>
                      <p className="text-sm text-gray-400">{service.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-white">${service.price}</p>
                    <p className="text-sm text-gray-400">{service.monthly ? 'monthly' : 'one-time'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Service Packages</h3>
            <div className="space-y-4">
              {bundles.map((bundle) => (
                <div key={bundle.id} className={`p-4 rounded-lg ${bundle.popular ? 'bg-blue-600' : 'bg-gray-700'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{bundle.name}</h4>
                    {bundle.popular && <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">POPULAR</span>}
                  </div>
                  <p className="text-sm text-gray-300 mb-3">{bundle.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-300">
                      {bundle.features.map((feature, index) => (
                        <span key={index}>
                          {feature}
                          {index < bundle.features.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                    <p className="font-bold text-white">${bundle.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Section */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.length > 0 ? (
              reports.map((report) => (
                <div key={report.id} className="bg-gray-700 rounded-lg p-4">
                  <h4 className="font-medium text-white mb-2">{report.title}</h4>
                  <p className="text-sm text-gray-400 mb-2">{report.type}</p>
                  <p className="text-sm text-gray-500">{new Date(report.generatedAt).toLocaleDateString()}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-400">No reports available</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardClean;
