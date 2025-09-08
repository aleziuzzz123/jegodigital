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

const ClientDashboardMinimal: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('ClientDashboardMinimal: Starting minimal dashboard load...');
    
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
    setLoading(false);
    
    console.log('ClientDashboardMinimal: Fallback data set, dashboard ready');
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

        {/* Status Message */}
        <div className="bg-green-900 border border-green-700 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-green-400 mr-2">✅</span>
            <span className="text-green-200">Minimal dashboard loaded successfully - no Firebase calls made</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardMinimal;
