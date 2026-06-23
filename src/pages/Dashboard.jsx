import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Award, Clock, FileText, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';

export default function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [history, setHistory] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    } else if (user) {
      fetchHistory();
    }
  }, [user, loading, navigate]);

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/practice/history');
      const data = await res.json();
      if (res.ok) {
        setHistory(data.history || []);
      } else {
        setError(data.error || 'Failed to fetch history.');
      }
    } catch (e) {
      setError('An error occurred while loading dashboard.');
    } finally {
      setFetching(false);
    }
  };

  if (loading || fetching) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  // Calculate statistics
  const totalTests = history.length;
  const avgScore = totalTests > 0 
    ? Math.round((history.reduce((sum, h) => sum + (h.score / h.total_questions), 0) / totalTests) * 100) 
    : 0;
  
  const totalCorrect = history.reduce((sum, h) => sum + h.score, 0);
  const totalSolved = history.reduce((sum, h) => sum + h.total_questions, 0);

  const formatTime = (secs) => {
    if (!secs) return '0s';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return m > 0 ? `${m}m ${s}s` : `${secs}s`;
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      
      {/* Welcome & Title */}
      <div className="dashboard-title-row">
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '8px' }}>
            Practice Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back, <b style={{ color: 'var(--text-white)' }}>{user?.email}</b>! Track your progress and learn.
          </p>
        </div>
      </div>

      {error && (
        <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
        gap: '20px', 
        marginBottom: '40px' 
      }}>
        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="card-icon-box" style={{ margin: 0, background: 'rgba(139, 92, 246, 0.1)', color: '#A78BFA' }}>
            <FileText size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-white)', lineHeight: 1.2 }}>{totalTests}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tests Attempted</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="card-icon-box" style={{ margin: 0, background: 'rgba(16, 185, 129, 0.1)', color: '#34D399' }}>
            <Award size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-white)', lineHeight: 1.2 }}>{avgScore}%</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Average Score</div>
          </div>
        </div>

        <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div className="card-icon-box" style={{ margin: 0, background: 'rgba(59, 130, 246, 0.1)', color: '#60A5FA' }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-white)', lineHeight: 1.2 }}>{totalCorrect} / {totalSolved}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Correct Answers</div>
          </div>
        </div>
      </div>

      {/* History Table */}
      <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: '20px' }}>
        Practice History
      </h2>
      
      {totalTests === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📝</div>
          <h3 style={{ marginBottom: '8px' }}>No practice tests taken yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Get started by browsing the home page and picking a topic to test your knowledge!
          </p>
          <Link to="/" className="btn btn-primary">Browse MCQs</Link>
        </div>
      ) : (
        <div className="history-table-box">
          <table className="history-table">
            <thead>
              <tr>
                <th>Exam Title</th>
                <th>Category</th>
                <th>Date Taken</th>
                <th>Score</th>
                <th>Time Spent</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => {
                const scorePercent = Math.round((h.score / h.total_questions) * 100);
                const scoreClass = scorePercent >= 70 ? 'high' : 'low';
                
                return (
                  <tr key={h.id}>
                    <td style={{ fontWeight: 700 }}>
                      <Link to={`/exam/${h.post_slug}`} style={{ color: 'var(--text-white)' }}>
                        {h.post_title}
                      </Link>
                    </td>
                    <td>
                      <span className="exam-badge" style={{ textTransform: 'uppercase' }}>
                        {h.post_category}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                      {formatDate(h.created_at)}
                    </td>
                    <td>
                      <span className={`score-badge ${scoreClass}`}>
                        {h.score} / {h.total_questions} ({scorePercent}%)
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, borderBottom: 'none', padding: '16px 0' }}>
                      <Clock size={14} color="var(--text-muted)" />
                      {formatTime(h.time_spent)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <Link 
                        to={`/exam/${h.post_slug}`} 
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '6px 10px', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      >
                        Retake
                        <ChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
