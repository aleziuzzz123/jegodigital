// Configuration for Netlify Functions
const config = {
  // Resend API Configuration
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  
  // Admin Email
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'info@jegodigital.com',
  
  // Mercado Pago Configuration
  MERCADOPAGO_ACCESS_TOKEN: process.env.MERCADOPAGO_ACCESS_TOKEN,
  MERCADOPAGO_WEBHOOK_SECRET: process.env.MERCADOPAGO_WEBHOOK_SECRET,
  
  // Firebase Configuration (for server-side operations)
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID || 'jegodigital-2ed98',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  
  // Email Configuration
  FROM_EMAIL: 'Jegodigital <noreply@jegodigital.com>',
  ADMIN_FROM_EMAIL: 'Jegodigital <info@jegodigital.com>',
  
  // URLs
  DASHBOARD_URL: 'https://jegodigital.com/dashboard.html',
  WEBSITE_URL: 'https://jegodigital.com'
};

module.exports = { config };
