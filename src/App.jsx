import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExamDetail from './pages/ExamDetail';
import Admin from './pages/Admin';

function AppContent() {
  const location = useLocation();

  // 1. Log visits in background whenever path changes
  useEffect(() => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname + location.search })
    }).catch(() => {});
  }, [location.pathname, location.search]);

  // 2. Fetch and apply site-wide SEO metadata
  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          const { settings } = data;
          if (settings) {
            // Update Title
            if (settings.meta_title) {
              document.title = settings.meta_title;
            }
            
            // Update Meta Description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.setAttribute('name', 'description');
              document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', settings.meta_description || '');

            // Update Meta Keywords
            let metaKey = document.querySelector('meta[name="keywords"]');
            if (!metaKey) {
              metaKey = document.createElement('meta');
              metaKey.setAttribute('name', 'keywords');
              document.head.appendChild(metaKey);
            }
            metaKey.setAttribute('content', settings.meta_keywords || '');

            // Dynamically inject custom head script/HTML tags
            if (settings.head_script) {
              // Clean up previous dynamically added elements
              document.querySelectorAll('.custom-head-element').forEach(el => el.remove());

              // Parse HTML string to document fragment (automatically marks scripts executable)
              const fragment = document.createRange().createContextualFragment(settings.head_script);
              
              // Add a helper class to element nodes for future cleanups
              Array.from(fragment.childNodes).forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  node.classList.add('custom-head-element');
                }
              });

              document.head.appendChild(fragment);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchMetadata();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Main Navigation */}
      <Navbar />

      {/* Main Page Layout */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/exam/:slug" element={<ExamDetail />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={
            <div className="container" style={{ padding: '80px 24px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>404</h1>
              <h3 style={{ marginBottom: '24px' }}>Page Not Found</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
                The page you are looking for does not exist or has been moved.
              </p>
              <a href="/" className="btn btn-primary">Go to Home</a>
            </div>
          } />
        </Routes>
      </main>

      {/* Premium Footer */}
      <footer className="footer">
        <div className="container">
          <p style={{ marginBottom: '8px' }}>
            &copy; {new Date().getFullYear()} MCQSolve Global. All rights reserved.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Solve HTML, CSS, coding, academic, medical, and job MCQs. Built for Cloudflare Pages.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
