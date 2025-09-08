// Script to initialize Firebase with existing products and bundles
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq",
  authDomain: "jegodigital.firebaseapp.com",
  projectId: "jegodigital",
  storageBucket: "jegodigital.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789",
  measurementId: "G-ABCDEF1234"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize products
const products = [
  { name: 'Website Design', category: 'One-time', price: 990, status: 'ACTIVE', description: 'Professional 5-page website design with modern UI/UX' },
  { name: 'Website Redesign', category: 'One-time', price: 490, status: 'ACTIVE', description: 'Optimize and redesign existing website for better performance' },
  { name: 'Local SEO Setup', category: 'One-time', price: 600, status: 'ACTIVE', description: 'Complete local SEO optimization for Google My Business and local search' },
  { name: 'Google Maps Setup', category: 'One-time', price: 280, status: 'ACTIVE', description: 'Google My Business profile optimization and local listing management' },
  { name: 'Email Marketing Setup', category: 'One-time', price: 420, status: 'ACTIVE', description: 'Email automation setup and campaign configuration' },
  { name: 'Analytics Setup', category: 'One-time', price: 180, status: 'ACTIVE', description: 'Google Analytics 4 and Google Search Console setup' },
  { name: 'Email Campaigns', category: 'Monthly', price: 300, status: 'ACTIVE', description: 'Monthly email marketing campaign management and optimization' },
  { name: 'Hosting & Maintenance', category: 'Monthly', price: 69, status: 'ACTIVE', description: 'Website hosting, security updates, and technical maintenance' },
  { name: 'Advanced SEO', category: 'Monthly', price: 300, status: 'ACTIVE', description: 'Ongoing SEO optimization, keyword research, and content strategy' },
  { name: 'Custom Reports', category: 'Monthly', price: 150, status: 'ACTIVE', description: 'Monthly performance reports and analytics insights' }
];

// Initialize bundles
const bundles = [
  {
    name: 'Starter Presence',
    price: 1200,
    description: 'Website (5 pages) + Google Maps setup + Analytics',
    features: ['5-page website', 'Google Maps optimization', 'Analytics setup', '2-week delivery'],
    status: 'ACTIVE'
  },
  {
    name: 'Growth Bundle',
    price: 1800,
    description: 'Website (5 pages) + Local SEO + Maps + Email Setup',
    features: ['5-page website', 'Local SEO optimization', 'Google Maps setup', 'Email marketing setup', '3-week delivery'],
    popular: true,
    status: 'ACTIVE'
  },
  {
    name: 'Business Booster',
    price: 2500,
    monthly: 400,
    description: 'Website + SEO + Maps + Email Setup + 1 campaign/month + Hosting & Reports',
    features: ['Complete website', 'Full SEO package', 'Email automation', 'Monthly campaigns', 'Hosting & maintenance', 'Monthly reports'],
    status: 'ACTIVE'
  }
];

// Initialize team members
const teamMembers = [
  {
    name: 'Alex Jego',
    email: 'jegoalexdigital@gmail.com',
    role: 'ADMIN',
    status: 'ACTIVE',
    avatar: 'A'
  }
];

async function initializeData() {
  try {
    console.log('Initializing Firebase data...');
    
    // Add products
    for (const product of products) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: new Date().toISOString()
      });
      console.log(`Added product: ${product.name}`);
    }
    
    // Add bundles
    for (const bundle of bundles) {
      await addDoc(collection(db, 'bundles'), {
        ...bundle,
        createdAt: new Date().toISOString()
      });
      console.log(`Added bundle: ${bundle.name}`);
    }
    
    // Add team members
    for (const member of teamMembers) {
      await addDoc(collection(db, 'team_members'), {
        ...member,
        createdAt: new Date().toISOString()
      });
      console.log(`Added team member: ${member.name}`);
    }
    
    console.log('Firebase initialization complete!');
  } catch (error) {
    console.error('Error initializing Firebase data:', error);
  }
}

// Run initialization
initializeData();


