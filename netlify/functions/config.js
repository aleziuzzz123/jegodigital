// Configuration for Netlify Functions
const config = {
  // Resend API Configuration
  RESEND_API_KEY: process.env.RESEND_API_KEY || 're_XxpEwT6n_6qyakaD2JnV6AEamk2NHgz9d',
  
  // Admin Email
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'info@jegodigital.com',
  
  // Mercado Pago Configuration
  MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-663664955778628-090720-8127ab5c1f1b368fa001f81a411e35f9-1225593098',
  MERCADOPAGO_WEBHOOK_SECRET: process.env.MERCADOPAGO_WEBHOOK_SECRET || '563560070b6d74b4ed5bfc698babffc39583c75a19a8af843cae12f3f44797d2',
  
  // Firebase Configuration (for server-side operations)
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'jegodigital-2ed98',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY || '',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL || '',
  
  // Email Configuration
  FROM_EMAIL: 'Jegodigital <noreply@jegodigital.com>',
  ADMIN_FROM_EMAIL: 'Jegodigital <info@jegodigital.com>',
  
  // URLs
  DASHBOARD_URL: 'https://jegodigital.com/dashboard.html',
  WEBSITE_URL: 'https://jegodigital.com'
};

module.exports = { config };
