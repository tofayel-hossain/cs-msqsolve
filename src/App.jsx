import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blogs from './pages/Blogs';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExamDetail from './pages/ExamDetail';
import Admin from './pages/Admin';

export default function App() {
  return (
    <AuthProvider>
      <Router>
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
      </Router>
    </AuthProvider>
  );
}
