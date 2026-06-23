import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const validateInputs = () => {
    if (!email || !password) {
      setError('Please fill in all fields.');
      return false;
    }
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail.endsWith('@gmail.com')) {
      setError('A valid Gmail address (@gmail.com) is required.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateInputs()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        const res = await signup(email, password);
        setSuccess(res.message || 'Account created successfully! Please log in.');
        setIsLogin(true);
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 180px)', padding: '40px 24px' }}>
      <div className="card auth-wrapper" style={{ width: '100%', maxWidth: '420px', padding: '36px' }}>
        
        {/* Toggle tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '30px' }}>
          <button 
            type="button" 
            onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}
            style={{ 
              flex: 1, 
              paddingBottom: '14px', 
              fontWeight: 700, 
              color: isLogin ? 'var(--text-white)' : 'var(--text-muted)',
              borderBottom: isLogin ? '2px solid var(--primary)' : 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem'
            }}
          >
            Log In
          </button>
          <button 
            type="button" 
            onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}
            style={{ 
              flex: 1, 
              paddingBottom: '14px', 
              fontWeight: 700, 
              color: !isLogin ? 'var(--text-white)' : 'var(--text-muted)',
              borderBottom: !isLogin ? '2px solid var(--primary)' : 'none',
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem'
            }}
          >
            Sign Up
          </button>
        </div>

        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '10px', fontSize: '1.5rem', textAlign: 'center' }}>
          {isLogin ? 'Welcome Back!' : 'Start Learning!'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '24px', textAlign: 'center' }}>
          {isLogin ? 'Log in with your Gmail to start practicing.' : 'Create a free account to track your practice score.'}
        </p>

        {error && (
          <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="success-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Gmail Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                id="email"
                type="email" 
                className="form-control" 
                placeholder="username@gmail.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
            {!isLogin && <small className="form-text">Must be a valid Gmail account (@gmail.com).</small>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                id="password"
                type="password" 
                className="form-control" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '44px' }}
                disabled={loading}
              />
            </div>
            {!isLogin && <small className="form-text">Must be at least 6 characters.</small>}
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  id="confirmPassword"
                  type="password" 
                  className="form-control" 
                  placeholder="••••••••" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                  disabled={loading}
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            style={{ marginTop: '10px', height: '48px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (
              isLogin ? (
                <>
                  <LogIn size={18} />
                  Log In
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
