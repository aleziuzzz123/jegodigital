import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Updated for deployment

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Jego Digital Services</h1>
        <p>AI-Powered Digital Solutions</p>
      </header>
      <main className="app-main">
        <div className="welcome-section">
          <h2>Welcome to Jego Digital</h2>
          <p>Your trusted partner for digital transformation and AI-powered solutions.</p>
        </div>
        <div className="features-section">
          <div className="feature-card">
            <h3>AI Integration</h3>
            <p>Leverage the power of artificial intelligence for your business needs.</p>
          </div>
          <div className="feature-card">
            <h3>Digital Services</h3>
            <p>Comprehensive digital solutions tailored to your requirements.</p>
          </div>
          <div className="feature-card">
            <h3>Modern Development</h3>
            <p>Built with cutting-edge technologies and best practices.</p>
          </div>
        </div>
      </main>
      <footer className="app-footer">
        <p>&copy; 2025 Jego Digital. All rights reserved.</p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);