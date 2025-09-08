import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import PaymentComponent from './PaymentComponent';
import { simpleAuthService } from './services/simpleAuthService';

function App() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordError, setForgotPasswordError] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    phone: ''
  });
  const [signupError, setSignupError] = useState('');
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState<string | null>(null);

  // Language content
  const content = {
    en: {
      nav: {
        home: 'Home',
        services: 'Services',
        packages: 'Packages',
        portfolio: 'Portfolio',
        about: 'About',
        contact: 'Contact',
        login: 'Login',
        bookCall: 'Book a Call'
      },
      hero: {
        headline: 'Websites, SEO & Email That Actually Convert',
        subheadline: 'Jegodigital builds sleek websites, optimizes your Google presence, and automates your marketing so your business grows effortlessly.',
        cta1: 'Choose a Package',
        cta2: 'Book a Free Call'
      },
      pricing: {
        title: 'Choose Your Growth Package',
        subtitle: 'All-inclusive packages designed to get your business found and growing online',
        starter: {
          name: 'Starter Presence',
          price: '$1,200',
          period: 'one-time',
          features: ['Website (up to 5 pages)', 'Google Maps setup', 'Analytics setup']
        },
        growth: {
          name: 'Growth Bundle',
          price: '$1,800',
          period: 'one-time',
          popular: 'Most Popular',
          features: ['Website (up to 5 pages)', 'Local SEO (on-page)', 'Google Maps setup', 'Email marketing setup']
        },
        business: {
          name: 'Business Booster',
          price: '$2,500',
          period: 'setup + $400/mo',
          value: 'Best Value',
          features: ['Website + SEO + Maps', 'Email setup + 1 campaign per month', 'Hosting & maintenance', 'Monthly performance report']
        }
      }
    },
    es: {
      nav: {
        home: 'Inicio',
        services: 'Servicios',
        packages: 'Paquetes',
        portfolio: 'Portafolio',
        about: 'Acerca',
        contact: 'Contacto',
        login: 'Iniciar Sesión',
        bookCall: 'Reservar Llamada'
      },
      hero: {
        headline: 'Sitios Web, SEO y Email Que Realmente Convierten',
        subheadline: 'Jegodigital construye sitios web elegantes, optimiza tu presencia en Google y automatiza tu marketing para que tu negocio crezca sin esfuerzo.',
        cta1: 'Elegir Paquete',
        cta2: 'Reservar Llamada Gratuita'
      },
      pricing: {
        title: 'Elige Tu Paquete de Crecimiento',
        subtitle: 'Paquetes todo incluido diseñados para hacer que tu negocio sea encontrado y crezca en línea',
        starter: {
          name: 'Presencia Básica',
          price: '$1,200',
          period: 'pago único',
          features: ['Sitio web (hasta 5 páginas)', 'Configuración Google Maps', 'Configuración Analytics']
        },
        growth: {
          name: 'Paquete Crecimiento',
          price: '$1,800',
          period: 'pago único',
          popular: 'Más Popular',
          features: ['Sitio web (hasta 5 páginas)', 'SEO Local (en página)', 'Configuración Google Maps', 'Configuración email marketing']
        },
        business: {
          name: 'Impulsor Empresarial',
          price: '$2,500',
          period: 'configuración + $400/mes',
          value: 'Mejor Valor',
          features: ['Sitio web + SEO + Maps', 'Configuración email + 1 campaña por mes', 'Hosting y mantenimiento', 'Reporte mensual de rendimiento']
        }
      }
    }
  };

  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    setShowLanguageDropdown(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setGoogleError(null);
    
    try {
      const userProfile = await simpleAuthService.signInWithGoogle();
      
      // Store user data in sessionStorage for dashboard
      sessionStorage.setItem('jegodigital_current_user', JSON.stringify(userProfile));
      
      // Close modal and redirect to dashboard
      setShowLoginModal(false);
      window.location.href = '/dashboard.html';
      
    } catch (error: any) {
      console.error('Google sign-in error:', error);
      setGoogleError(error.message || 'Error signing in with Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showLanguageDropdown && !(event.target as Element).closest('.language-selector')) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showLanguageDropdown]);

  const services = [
    { id: 'website-design', name: 'Website Design', description: '5 pages', price: 990, icon: '🌐' },
    { id: 'website-redesign', name: 'Website Redesign', description: 'Optimization', price: 490, icon: '🔄' },
    { id: 'local-seo', name: 'Local SEO Setup', description: 'On-page optimization', price: 600, icon: '📈' },
    { id: 'google-maps', name: 'Google Maps Setup', description: 'Business Profile', price: 280, icon: '📍' },
    { id: 'email-marketing', name: 'Email Marketing Setup', description: 'Automation & campaigns', price: 420, icon: '📧' },
    { id: 'analytics', name: 'Analytics Setup', description: 'GA4 + GSC', price: 180, icon: '📊' },
    { id: 'email-campaigns', name: 'Email Campaigns', description: 'Monthly management', price: 300, icon: '⚡', monthly: true },
    { id: 'hosting', name: 'Hosting & Maintenance', description: 'Monthly support', price: 69, icon: '🛠️', monthly: true },
    { id: 'advanced-seo', name: 'Advanced SEO', description: 'Monthly optimization', price: 300, icon: '🚀', monthly: true },
    { id: 'custom-reports', name: 'Custom Reports', description: 'Monthly analytics', price: 150, icon: '📋', monthly: true }
  ];

  const toggleService = (serviceId: string) => {
    const newSelected = new Set(selectedServices);
    if (newSelected.has(serviceId)) {
      newSelected.delete(serviceId);
    } else {
      newSelected.add(serviceId);
    }
    setSelectedServices(newSelected);
  };

  const getTotalPrice = () => {
    return services
      .filter(service => selectedServices.has(service.id))
      .reduce((total, service) => total + service.price, 0);
  };

  const getOneTimeTotal = () => {
    return services
      .filter(service => selectedServices.has(service.id) && !service.monthly)
      .reduce((total, service) => total + service.price, 0);
  };

  const getMonthlyTotal = () => {
    return services
      .filter(service => selectedServices.has(service.id) && service.monthly)
      .reduce((total, service) => total + service.price, 0);
  };

  const toggleFaq = (faqId: string) => {
    setActiveFaq(activeFaq === faqId ? null : faqId);
  };

  const handleContactSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    alert('Thank you for your message! We\'ll get back to you within 24 hours.');
  };

  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError('');
    
    // Check demo users first (for testing only)
    if (loginEmail === 'client@demo.com' && loginPassword === 'client123') {
      // Redirect to dashboard with demo client
      window.location.href = '/dashboard.html?user=client';
    } else if (loginEmail === 'jegoalexdigital@gmail.com' && loginPassword === 'admin123') {
      // Redirect to dashboard with admin
      window.location.href = '/dashboard.html?user=admin';
    } else if (loginEmail === 'staff@demo.com' && loginPassword === 'staff123') {
      // Redirect to dashboard with demo staff
      window.location.href = '/dashboard.html?user=staff';
    } else {
      // Use Firebase Auth for real users
      try {
        const userProfile = await simpleAuthService.signIn(loginEmail, loginPassword);
        
        // Store current user in sessionStorage for dashboard access
        sessionStorage.setItem('jegodigital_current_user', JSON.stringify(userProfile));
        
        setShowLoginModal(false);
        setLoginEmail('');
        setLoginPassword('');
        
        // Redirect to dashboard
        window.location.href = '/dashboard.html';
      } catch (error: any) {
        setLoginError(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    setLoginError('');
    setLoginEmail('');
    setLoginPassword('');
  };

  const handleSignUpClick = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSignupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError('Passwords do not match');
      return;
    }
    
    if (signupData.password.length < 6) {
      setSignupError('Password must be at least 6 characters');
      return;
    }
    
    if (!signupData.name || !signupData.email) {
      setSignupError('Please fill in all required fields');
      return;
    }
    
    try {
      // Create user with Firebase Auth
      const userProfile = await simpleAuthService.signUp(signupData.email, signupData.password, {
        name: signupData.name,
        company: signupData.company,
        phone: signupData.phone,
        role: 'client'
      });
      
      console.log('New user created:', userProfile);
      
      // Show success message
      setSignupSuccess(true);
      setSignupError('');
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setSignupData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          company: '',
          phone: ''
        });
        setSignupSuccess(false);
        setShowSignupModal(false);
      }, 3000);
    } catch (error: any) {
      setSignupError(error.message || 'Signup failed. Please try again.');
    }
  };

  const handleSignupInputChange = (field: string, value: string) => {
    setSignupData(prev => ({
      ...prev,
      [field]: value
    }));
    setSignupError(''); // Clear error when user starts typing
    setSignupSuccess(false); // Clear success message when user starts typing
  };

  const handleCloseSignupModal = () => {
    setShowSignupModal(false);
    setSignupError('');
    setSignupSuccess(false);
    setSignupData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      company: '',
      phone: ''
    });
  };

  const handleForgotPasswordClick = () => {
    setShowLoginModal(false);
    setShowForgotPasswordModal(true);
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setForgotPasswordError('');
    
    if (!forgotPasswordEmail) {
      setForgotPasswordError('Please enter your email address');
      return;
    }
    
    try {
      await simpleAuthService.resetPassword(forgotPasswordEmail);
      
      setForgotPasswordSuccess(true);
      setForgotPasswordError('');
      
      // Reset form after 3 seconds and close modal
      setTimeout(() => {
        setForgotPasswordEmail('');
        setForgotPasswordSuccess(false);
        setShowForgotPasswordModal(false);
      }, 3000);
    } catch (error: any) {
      setForgotPasswordError(error.message || 'Failed to send reset email. Please try again.');
    }
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setForgotPasswordError('');
    setForgotPasswordSuccess(false);
    setForgotPasswordEmail('');
  };

  return (
    <div className="app">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <h2>Jegodigital</h2>
          </div>
          <div className="nav-links">
            <a href="#services">{content[currentLanguage].nav.services}</a>
            <a href="#pricing">{content[currentLanguage].nav.packages}</a>
            <a href="#portfolio">{content[currentLanguage].nav.portfolio}</a>
            <a href="#about">{content[currentLanguage].nav.about}</a>
            <a href="#contact">{content[currentLanguage].nav.contact}</a>
          </div>
          <div className="nav-cta">
            <div className="language-selector">
              <button 
                className="language-btn" 
                onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
              >
                {currentLanguage.toUpperCase()}
                <span className="language-arrow">▼</span>
              </button>
              {showLanguageDropdown && (
                <div className="language-dropdown">
                  <button 
                    className={`language-option ${currentLanguage === 'en' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('en')}
                  >
                    English
                  </button>
                  <button 
                    className={`language-option ${currentLanguage === 'es' ? 'active' : ''}`}
                    onClick={() => handleLanguageChange('es')}
                  >
                    Español
                  </button>
                </div>
              )}
            </div>
            <button onClick={handleLoginClick} className="btn btn-outline">{content[currentLanguage].nav.login}</button>
            <button className="btn-secondary">{content[currentLanguage].nav.bookCall}</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">
              {content[currentLanguage].hero.headline}
            </h1>
            <p className="hero-subtitle">
              {content[currentLanguage].hero.subheadline}
            </p>
            <div className="hero-cta">
              <button className="btn-primary">{content[currentLanguage].hero.cta1}</button>
              <button className="btn-secondary">{content[currentLanguage].hero.cta2}</button>
            </div>
          </div>
          <div className="hero-visual">
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="mockup-content">
                <div className="mockup-chart"></div>
                <div className="mockup-stats">
                  <div className="stat-item">
                    <div className="stat-number">+250%</div>
                    <div className="stat-label">Traffic</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">+180%</div>
                    <div className="stat-label">Leads</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">+320%</div>
                    <div className="stat-label">Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Services */}
      <section className="our-services">
        <div className="container">
          <div className="section-header">
            <h2>Our Services</h2>
            <p>Complete digital solutions to grow your business</p>
          </div>
          <div className="services-overview">
            <div className="service-category">
              <h3>Web Development</h3>
              <div className="service-list">
                <div className="service-item">
                  <div className="service-icon">🌐</div>
                  <div className="service-info">
                    <h4>Website Design</h4>
                    <p>Custom 5-page websites with modern design and mobile optimization</p>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-icon">🔄</div>
                  <div className="service-info">
                    <h4>Website Redesign</h4>
                    <p>Transform your existing site with modern design and improved performance</p>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-icon">🛠️</div>
                  <div className="service-info">
                    <h4>Hosting & Maintenance</h4>
                    <p>Reliable hosting with monthly maintenance and security updates</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="service-category">
              <h3>SEO & Marketing</h3>
              <div className="service-list">
                <div className="service-item">
                  <div className="service-icon">📈</div>
                  <div className="service-info">
                    <h4>Local SEO Setup</h4>
                    <p>On-page optimization to help you rank higher in local search results</p>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-icon">📍</div>
                  <div className="service-info">
                    <h4>Google Maps Setup</h4>
                    <p>Optimize your Google Business Profile for maximum local visibility</p>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-icon">🚀</div>
                  <div className="service-info">
                    <h4>Advanced SEO</h4>
                    <p>Ongoing monthly SEO optimization to maintain and improve rankings</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="service-category">
              <h3>Email Marketing</h3>
              <div className="service-list">
                <div className="service-item">
                  <div className="service-icon">📧</div>
                  <div className="service-info">
                    <h4>Email Marketing Setup</h4>
                    <p>Complete email automation and campaign setup for your business</p>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-icon">⚡</div>
                  <div className="service-info">
                    <h4>Email Campaign Management</h4>
                    <p>Monthly email campaign creation and management to engage customers</p>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-icon">📊</div>
                  <div className="service-info">
                    <h4>Email Analytics & Optimization</h4>
                    <p>Track performance and optimize email campaigns for better results</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="service-category">
              <h3>Analytics & Reporting</h3>
              <div className="service-list">
                <div className="service-item">
                  <div className="service-icon">📊</div>
                  <div className="service-info">
                    <h4>Analytics Setup</h4>
                    <p>Google Analytics 4 and Search Console setup for tracking performance</p>
                  </div>
                </div>
                <div className="service-item">
                  <div className="service-icon">📋</div>
                  <div className="service-info">
                    <h4>Custom Reports</h4>
                    <p>Monthly detailed reports on your website and marketing performance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section id="pricing" className="pricing">
        <div className="container">
          <div className="section-header">
            <h2>Choose Your Growth Package</h2>
            <p>All packages include premium design and mobile optimization</p>
          </div>
          <div className="pricing-grid">
            <div className="pricing-card">
              <div className="card-header">
                <h3>Starter Presence</h3>
                <div className="price">$1,200</div>
                <div className="price-note">one-time</div>
              </div>
              <ul className="features">
                <li>Website (up to 5 pages)</li>
                <li>Google Maps setup</li>
                <li>Analytics setup</li>
              </ul>
              <PaymentComponent
                amount={1200}
                description="Starter Presence Package - Website + Maps + Analytics"
                buttonText="Pagar $1,200"
                className="pricing-payment"
              />
            </div>
            
            <div className="pricing-card popular">
              <div className="popular-badge">Most Popular</div>
              <div className="card-header">
                <h3>Growth Bundle</h3>
                <div className="price">$1,800</div>
                <div className="price-note">one-time</div>
              </div>
              <ul className="features">
                <li>Website (up to 5 pages)</li>
                <li>Local SEO (on-page)</li>
                <li>Google Maps setup</li>
                <li>Email marketing setup</li>
              </ul>
              <PaymentComponent
                amount={1800}
                description="Growth Bundle Package - Complete Digital Solution"
                buttonText="Pagar $1,800"
                className="pricing-payment"
              />
            </div>
            
            <div className="pricing-card">
              <div className="card-header">
                <h3>Business Booster</h3>
                <div className="price">$2,500</div>
                <div className="price-note">setup + $400/mo</div>
                <div className="best-value">Best Value</div>
              </div>
              <ul className="features">
                <li>Website + SEO + Maps</li>
                <li>Email setup + 1 campaign per month</li>
                <li>Hosting & maintenance</li>
                <li>Monthly performance report</li>
              </ul>
              <PaymentComponent
                amount={2500}
                description="Business Booster Package - Premium Digital Solution"
                buttonText="Pagar $2,500"
                className="pricing-payment"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Individual Services */}
      <section id="services" className="services">
        <div className="container">
          <div className="section-header">
            <h2>Build Your Own Package</h2>
            <p>Toggle any services you need and see your custom package total</p>
          </div>
          
          <div className="package-builder">
            <div className="services-selection">
              <div className="services-grid">
                {services.map((service) => (
                  <div 
                    key={service.id}
                    className={`service-card ${selectedServices.has(service.id) ? 'selected' : ''}`}
                    onClick={() => toggleService(service.id)}
                  >
                    <div className="service-toggle">
                      <div className="toggle-switch">
                        <div className="toggle-slider"></div>
                      </div>
                    </div>
                    <div className="service-content">
                      <div className="service-icon">{service.icon}</div>
                      <h3>{service.name}</h3>
                      <p>{service.description}</p>
                      <div className="service-price">
                        ${service.price.toLocaleString()}
                        {service.monthly && <span>/mo</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="package-summary">
              <div className="summary-card">
                <h3>Your Custom Package</h3>
                <div className="summary-content">
                  {selectedServices.size === 0 ? (
                    <div className="empty-state">
                      <div className="empty-icon">🎯</div>
                      <p>Select services to build your package</p>
                    </div>
                  ) : (
                    <>
                      <div className="selected-services">
                        {services
                          .filter(service => selectedServices.has(service.id))
                          .map(service => (
                            <div key={service.id} className="selected-service">
                              <span className="service-name">{service.name}</span>
                              <span className="service-price">
                                ${service.price.toLocaleString()}
                                {service.monthly && '/mo'}
                              </span>
                            </div>
                          ))}
                      </div>
                      
                      <div className="price-breakdown">
                        {getOneTimeTotal() > 0 && (
                          <div className="price-line">
                            <span>One-time setup</span>
                            <span>${getOneTimeTotal().toLocaleString()}</span>
                          </div>
                        )}
                        {getMonthlyTotal() > 0 && (
                          <div className="price-line">
                            <span>Monthly services</span>
                            <span>${getMonthlyTotal().toLocaleString()}/mo</span>
                          </div>
                        )}
                        <div className="total-line">
                          <span>Total</span>
                          <span>
                            {getOneTimeTotal() > 0 && `$${getOneTimeTotal().toLocaleString()}`}
                            {getOneTimeTotal() > 0 && getMonthlyTotal() > 0 && ' + '}
                            {getMonthlyTotal() > 0 && `$${getMonthlyTotal().toLocaleString()}/mo`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="package-actions">
                        <button className="btn-get-quote">
                          Get Custom Quote
                        </button>
                        {getOneTimeTotal() > 0 && (
                          <PaymentComponent
                            amount={getOneTimeTotal()}
                            description={`Custom Package - ${Array.from(selectedServices).join(', ')}`}
                            buttonText={`Pagar $${getOneTimeTotal().toLocaleString()}`}
                            className="package-payment"
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="portfolio">
        <div className="container">
          <div className="section-header">
            <h2>Trusted by Local Businesses</h2>
            <p>Real results from real clients</p>
          </div>
          
          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-badge">
              <div className="badge-icon">🏆</div>
              <div className="badge-text">
                <strong>50+</strong>
                <span>Websites Built</span>
              </div>
            </div>
            <div className="trust-badge">
              <div className="badge-icon">📈</div>
              <div className="badge-text">
                <strong>250%</strong>
                <span>Avg. Lead Increase</span>
              </div>
            </div>
            <div className="trust-badge">
              <div className="badge-icon">⭐</div>
              <div className="badge-text">
                <strong>100%</strong>
                <span>Client Satisfaction</span>
              </div>
            </div>
            <div className="trust-badge">
              <div className="badge-icon">🚀</div>
              <div className="badge-text">
                <strong>2-3</strong>
                <span>Weeks Delivery</span>
              </div>
            </div>
          </div>
          <div className="portfolio-grid">
            <div className="portfolio-card">
              <div className="portfolio-image restaurant"></div>
              <div className="portfolio-content">
                <h3>Restaurant</h3>
                <p>Increased traffic by 250% in 3 months</p>
              </div>
            </div>
            
            <div className="portfolio-card">
              <div className="portfolio-image gym"></div>
              <div className="portfolio-content">
                <h3>Gym</h3>
                <p>Doubled membership signups in 2 months</p>
              </div>
            </div>
            
            <div className="portfolio-card">
              <div className="portfolio-image clinic"></div>
              <div className="portfolio-content">
                <h3>Clinic</h3>
                <p>Fully booked appointments within 6 weeks</p>
              </div>
            </div>
            
            <div className="portfolio-card">
              <div className="portfolio-image realestate"></div>
              <div className="portfolio-content">
                <h3>Real Estate</h3>
                <p>300% increase in qualified leads</p>
              </div>
            </div>
            
            <div className="portfolio-card">
              <div className="portfolio-image salon"></div>
              <div className="portfolio-content">
                <h3>Salon</h3>
                <p>Bookings doubled in 2 months</p>
              </div>
            </div>
            
            <div className="portfolio-card">
              <div className="portfolio-image retail"></div>
              <div className="portfolio-content">
                <h3>Local Retail</h3>
                <p>Online sales up 400% in 4 months</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Our Clients Say</h2>
            <p>Real feedback from real business owners</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Jegodigital transformed our online presence. Bookings doubled in 2 months."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">M</div>
                <div className="author-info">
                  <div className="author-name">Maria</div>
                  <div className="author-title">Spa Owner</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Professional, fast, sleek. Highly recommend for any local business."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">D</div>
                <div className="author-info">
                  <div className="author-name">David</div>
                  <div className="author-title">Restaurant Owner</div>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Our clinic is fully booked thanks to SEO & Maps setup."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">L</div>
                <div className="author-info">
                  <div className="author-name">Dr. López</div>
                  <div className="author-title">Clinic Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section id="contact" className="contact">
        <div className="container">
          <div className="section-header">
            <h2>Get Your Free Consultation</h2>
            <p>Ready to transform your digital presence? Let's discuss your project.</p>
          </div>
          <div className="contact-content">
            <div className="contact-info">
              <h3>Why Choose Jegodigital?</h3>
              <div className="contact-features">
                <div className="contact-feature">
                  <div className="feature-icon">🚀</div>
                  <div className="feature-content">
                    <h4>Fast Delivery</h4>
                    <p>Your website ready in 2-3 weeks</p>
                  </div>
                </div>
                <div className="contact-feature">
                  <div className="feature-icon">💎</div>
                  <div className="feature-content">
                    <h4>Premium Quality</h4>
                    <p>Modern, professional designs that convert</p>
                  </div>
                </div>
                <div className="contact-feature">
                  <div className="feature-icon">📈</div>
                  <div className="feature-content">
                    <h4>Proven Results</h4>
                    <p>Average 250% increase in leads</p>
                  </div>
                </div>
                <div className="contact-feature">
                  <div className="feature-icon">🛠️</div>
                  <div className="feature-content">
                    <h4>Ongoing Support</h4>
                    <p>Monthly maintenance and updates</p>
                  </div>
                </div>
              </div>
              <div className="contact-details">
                <div className="contact-item">
                  <strong>📧 Email:</strong> hello@jegodigital.com
                </div>
                <div className="contact-item">
                  <strong>📱 Phone:</strong> +52 998 123 4567
                </div>
                <div className="contact-item">
                  <strong>📍 Location:</strong> Cancún, México
                </div>
              </div>
            </div>
            <div className="contact-form-container">
              <form className="contact-form" onSubmit={handleContactSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input type="text" id="name" name="name" required />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input type="email" id="email" name="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input type="tel" id="phone" name="phone" />
                </div>
                <div className="form-group">
                  <label htmlFor="business">Business Name</label>
                  <input type="text" id="business" name="business" />
                </div>
                <div className="form-group">
                  <label htmlFor="service">Service Interested In</label>
                  <select id="service" name="service">
                    <option value="">Select a service</option>
                    <option value="starter">Starter Presence Package</option>
                    <option value="growth">Growth Bundle Package</option>
                    <option value="booster">Business Booster Package</option>
                    <option value="custom">Custom Package</option>
                    <option value="consultation">Free Consultation</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="budget">Budget Range</label>
                  <select id="budget" name="budget">
                    <option value="">Select budget range</option>
                    <option value="1000-2000">$1,000 - $2,000</option>
                    <option value="2000-3000">$2,000 - $3,000</option>
                    <option value="3000-5000">$3,000 - $5,000</option>
                    <option value="5000+">$5,000+</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Project Details *</label>
                  <textarea id="message" name="message" rows="4" placeholder="Tell us about your project, goals, and timeline..." required></textarea>
                </div>
                <button type="submit" className="btn-primary">Send Message</button>
                <p className="form-note">We'll respond within 24 hours with a detailed proposal.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>About Jegodigital</h2>
              <p className="about-intro">
                We're a digital agency specializing in helping local businesses establish a strong online presence that actually converts visitors into customers.
              </p>
              <div className="about-stats">
                <div className="stat">
                  <div className="stat-number">50+</div>
                  <div className="stat-label">Websites Built</div>
                </div>
                <div className="stat">
                  <div className="stat-number">250%</div>
                  <div className="stat-label">Avg. Lead Increase</div>
                </div>
                <div className="stat">
                  <div className="stat-number">3+</div>
                  <div className="stat-label">Years Experience</div>
                </div>
                <div className="stat">
                  <div className="stat-number">100%</div>
                  <div className="stat-label">Client Satisfaction</div>
                </div>
              </div>
              <div className="about-features">
                <h3>Why We're Different</h3>
                <ul>
                  <li>🎯 <strong>Results-Focused:</strong> We don't just build websites, we build conversion machines</li>
                  <li>⚡ <strong>Fast Turnaround:</strong> Your website ready in 2-3 weeks, not months</li>
                  <li>🛠️ <strong>Ongoing Support:</strong> We're here for the long term, not just the launch</li>
                  <li>📊 <strong>Data-Driven:</strong> Every decision backed by analytics and testing</li>
                  <li>💰 <strong>Transparent Pricing:</strong> No hidden fees or surprise costs</li>
                </ul>
              </div>
            </div>
            <div className="about-visual">
              <div className="about-image">
                <div className="image-placeholder">
                  <div className="placeholder-content">
                    <div className="placeholder-icon">👨‍💻</div>
                    <p>Professional Team</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Our proven 4-step process to get your business online and growing</p>
          </div>
          <div className="process-steps">
            <div className="process-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Discovery Call</h3>
                <p>We discuss your business goals, target audience, and project requirements in a free 30-minute consultation.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Strategy & Design</h3>
                <p>We create a custom strategy and design mockups tailored to your brand and business objectives.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Development & Launch</h3>
                <p>We build your website, set up analytics, and optimize everything for search engines and conversions.</p>
              </div>
            </div>
            <div className="process-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <h3>Growth & Support</h3>
                <p>We provide ongoing maintenance, updates, and marketing support to keep your business growing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
            <p>Everything you need to know about our services</p>
          </div>
          <div className="faq-content">
            <div className={`faq-item ${activeFaq === 'timeline' ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq('timeline')}>
                <h3>How long does it take to build a website?</h3>
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>Most websites are completed within 2-3 weeks. Complex projects may take up to 4 weeks. We provide a detailed timeline during our initial consultation.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFaq === 'support' ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq('support')}>
                <h3>Do you provide ongoing support after launch?</h3>
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>Yes! We offer monthly maintenance packages starting at $69/month that include hosting, security updates, backups, and minor content changes.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFaq === 'updates' ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq('updates')}>
                <h3>Can I update my website myself?</h3>
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>Absolutely! We build all websites with user-friendly content management systems so you can easily update text, images, and content yourself.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFaq === 'seo' ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq('seo')}>
                <h3>What's included in the SEO setup?</h3>
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>Our SEO setup includes Google My Business optimization, local SEO, on-page optimization, Google Analytics setup, and basic keyword research.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFaq === 'international' ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq('international')}>
                <h3>Do you work with businesses outside of Mexico?</h3>
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>Yes! While we're based in Cancún, we work with businesses worldwide. All our communication is in English and we're available in multiple time zones.</p>
              </div>
            </div>
            <div className={`faq-item ${activeFaq === 'payment' ? 'active' : ''}`}>
              <div className="faq-question" onClick={() => toggleFaq('payment')}>
                <h3>What payment methods do you accept?</h3>
                <span className="faq-icon">+</span>
              </div>
              <div className="faq-answer">
                <p>We accept all major credit cards, bank transfers, and PayPal through our secure Mercado Pago payment system. Payment plans are available for larger projects.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Look Premium & Get Found Locally?</h2>
            <div className="cta-buttons">
              <button className="btn-primary">Choose a Package</button>
              <button className="btn-secondary">Book a Free Call</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <h3>Jegodigital</h3>
              <p>Websites, SEO & Email That Actually Convert</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Services</h4>
                <a href="#services">Website Design</a>
                <a href="#services">SEO</a>
                <a href="#services">Email Marketing</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <a href="#pricing">Packages</a>
                <a href="#portfolio">Portfolio</a>
                <a href="/dashboard.html">Login</a>
                <a href="#contact">Contact</a>
              </div>
              <div className="footer-column">
                <h4>Contact</h4>
                <p>hello@jegodigital.com</p>
                <p>+52 998 123 4567</p>
                <p>Cancún, MX</p>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Jegodigital. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="login-modal-overlay" onClick={handleCloseModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="login-modal-header">
              <div className="login-modal-icon">✨</div>
              <h2>Welcome Back</h2>
              <button className="login-modal-close" onClick={handleCloseModal}>×</button>
            </div>
            <p className="login-modal-subtitle">Enter your credentials to access your account.</p>
            
            <form className="login-modal-form" onSubmit={handleLoginSubmit}>
              {loginError && (
                <div className="login-modal-error">
                  {loginError}
                </div>
              )}
              
              <div className="login-modal-input-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
              
              <div className="login-modal-input-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="login-modal-btn">
                Login
              </button>
            </form>
            
            <div className="login-modal-divider">
              <span>or</span>
            </div>
            
            <button 
              className="login-modal-google-btn"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            
            {googleError && (
              <div className="login-modal-error">
                {googleError}
              </div>
            )}
            
            <div className="login-modal-footer">
              <a href="#" onClick={handleForgotPasswordClick} className="login-modal-link">Forgot password?</a>
              <a href="#" onClick={handleSignUpClick} className="login-modal-link">Don't have an account?</a>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignupModal && (
        <div className="login-modal-overlay" onClick={handleCloseSignupModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="login-modal-header">
              <div className="login-modal-icon">✨</div>
              <h2>Create Account</h2>
              <button className="login-modal-close" onClick={handleCloseSignupModal}>×</button>
            </div>
            <p className="login-modal-subtitle">Fill in your details to get started</p>
            
            <form className="login-modal-form" onSubmit={handleSignupSubmit}>
              {signupError && (
                <div className="login-modal-error">
                  {signupError}
                </div>
              )}
              
              {signupSuccess && (
                <div className="login-modal-success">
                  <div className="success-icon">✅</div>
                  <div className="success-text">
                    <strong>Account created successfully!</strong>
                    <p>You can now login with your credentials.</p>
                  </div>
                </div>
              )}
              
              <div className="login-modal-input-group">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={signupData.name}
                  onChange={(e) => handleSignupInputChange('name', e.target.value)}
                  required
                />
              </div>
              
              <div className="login-modal-input-group">
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={signupData.email}
                  onChange={(e) => handleSignupInputChange('email', e.target.value)}
                  required
                />
              </div>
              
              <div className="login-modal-input-group">
                <input
                  type="text"
                  placeholder="Company Name"
                  value={signupData.company}
                  onChange={(e) => handleSignupInputChange('company', e.target.value)}
                />
              </div>
              
              <div className="login-modal-input-group">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={signupData.phone}
                  onChange={(e) => handleSignupInputChange('phone', e.target.value)}
                />
              </div>
              
              <div className="login-modal-input-group">
                <input
                  type="password"
                  placeholder="Password *"
                  value={signupData.password}
                  onChange={(e) => handleSignupInputChange('password', e.target.value)}
                  required
                />
              </div>
              
              <div className="login-modal-input-group">
                <input
                  type="password"
                  placeholder="Confirm Password *"
                  value={signupData.confirmPassword}
                  onChange={(e) => handleSignupInputChange('confirmPassword', e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="login-modal-btn">
                Create Account
              </button>
            </form>
            
            <div className="login-modal-divider">
              <span>or</span>
            </div>
            
            <button 
              className="login-modal-google-btn"
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
            >
              {googleLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <svg className="google-icon" viewBox="0 0 24 24" width="20" height="20">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </button>
            
            {googleError && (
              <div className="login-modal-error">
                {googleError}
              </div>
            )}
            
            <div className="login-modal-footer">
              <span className="login-modal-text">Already have an account?</span>
              <a href="#" onClick={() => { setShowSignupModal(false); setShowLoginModal(true); }} className="login-modal-link">
                Sign In
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="login-modal-overlay" onClick={handleCloseForgotPasswordModal}>
          <div className="login-modal" onClick={(e) => e.stopPropagation()}>
            <div className="login-modal-header">
              <div className="login-modal-icon">🔑</div>
              <h2>Reset Password</h2>
              <button className="login-modal-close" onClick={handleCloseForgotPasswordModal}>×</button>
            </div>
            <p className="login-modal-subtitle">Enter your email address to receive a password reset code</p>
            
            <form className="login-modal-form" onSubmit={handleForgotPasswordSubmit}>
              {forgotPasswordError && (
                <div className="login-modal-error">
                  {forgotPasswordError}
                </div>
              )}
              
              {forgotPasswordSuccess && (
                <div className="login-modal-success">
                  <div className="success-icon">✅</div>
                  <div className="success-text">
                    <strong>Reset email sent!</strong>
                    <p>Check your email for the password reset link.</p>
                  </div>
                </div>
              )}
              
              <div className="login-modal-input-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="login-modal-btn">
                Send Reset Code
              </button>
            </form>
            
            <div className="login-modal-footer">
              <span className="login-modal-text">Remember your password?</span>
              <a href="#" onClick={() => { setShowForgotPasswordModal(false); setShowLoginModal(true); }} className="login-modal-link">
                Back to Login
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add error handling for React app mounting
try {
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    throw new Error('Root element not found');
  }
  
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
  
  console.log('React app mounted successfully');
} catch (error) {
  console.error('Error mounting React app:', error);
  
  // Fallback: Show basic content if React fails
  const rootElement = document.getElementById('root');
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>Jegodigital</h1>
        <p>Website is loading...</p>
        <p>If this message persists, please refresh the page.</p>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #4f46e6; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
  }
}