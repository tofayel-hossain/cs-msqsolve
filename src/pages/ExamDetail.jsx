import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Clock, Award, HelpCircle, CheckCircle, XCircle, BookOpen, Lock, RefreshCw, Eye, Calendar, User, ArrowRight } from 'lucide-react';

export default function ExamDetail() {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const isPracticeRequested = searchParams.get('practice') === 'true';

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Practice states
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const timerRef = useRef(null);

  // Load MCQ detail
  useEffect(() => {
    loadDetail();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [slug, isPracticeRequested, user]);

  // Handle timer for practice mode
  useEffect(() => {
    if (isPracticeRequested && user && post && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeSpent(t => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [isPracticeRequested, user, post, submitted]);

  const loadDetail = async () => {
    setLoading(true);
    setError('');
    setSubmitted(false);
    setResults(null);
    setSelectedAnswers({});
    setTimeSpent(0);

    const mode = (isPracticeRequested && user) ? 'practice' : 'guest';
    
    try {
      const res = await fetch(`/api/posts/detail?slug=${slug}&mode=${mode}`);
      const data = await res.json();
      
      if (res.ok) {
        setPost(data);
      } else {
        setError(data.error || 'Failed to fetch exam detail.');
      }
    } catch (e) {
      setError('An error occurred while loading this exam.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qIndex, optionKey) => {
    if (submitted) return; // Prevent change after submit
    setSelectedAnswers(prev => ({
      ...prev,
      [qIndex]: optionKey
    }));
  };

  const handleSubmitPractice = async () => {
    const totalQuestions = post.questions.length;
    const answeredCount = Object.keys(selectedAnswers).length;
    
    if (answeredCount < totalQuestions) {
      const confirmSubmit = window.confirm(`You have only answered ${answeredCount} out of ${totalQuestions} questions. Are you sure you want to submit?`);
      if (!confirmSubmit) return;
    }

    try {
      const answersArray = [];
      for (let i = 0; i < totalQuestions; i++) {
        answersArray.push(selectedAnswers[i] || "");
      }

      const res = await fetch('/api/posts/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId: post.id,
          selectedAnswers: answersArray,
          timeSpent: timeSpent,
          set: 'ka'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setResults(data);
        setSubmitted(true);
      } else {
        alert(data.error || 'Failed to submit practice test.');
      }
    } catch (e) {
      alert('An error occurred during submission.');
    }
  };

  const handleResetPractice = () => {
    loadDetail();
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'June 23, 2026';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Render helper for code questions (HTML/CSS blocks)
  const renderQuestionText = (text) => {
    if (text.includes('```')) {
      const parts = text.split('```');
      return (
        <div>
          <span>{parts[0]}</span>
          {parts[1] && (
            <pre className="code-snippet">
              <code>{parts[1].trim()}</code>
            </pre>
          )}
          {parts[2] && <span>{parts[2]}</span>}
        </div>
      );
    }
    return <span>{text}</span>;
  };

  if (authLoading || loading) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading exam paper details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="error-message" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <XCircle size={18} />
          <span>{error}</span>
        </div>
        <div style={{ marginTop: '20px' }}>
          <Link to="/" className="btn btn-secondary">
            <ArrowLeft size={16} /> Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isPracticeMode = isPracticeRequested && user;
  const isGuestRequiredToLogin = isPracticeRequested && !user;

  // If the user requested practice but isn't logged in, show login prompt
  if (isGuestRequiredToLogin) {
    return (
      <div className="container" style={{ padding: '60px 24px', display: 'flex', justifyContent: 'center' }}>
        <div className="card" style={{ maxWidth: '480px', width: '100%', textAlign: 'center', padding: '40px' }}>
          <div className="card-icon-box" style={{ margin: '0 auto 20px', background: 'rgba(139, 92, 246, 0.1)', color: '#A78BFA' }}>
            <Lock size={22} />
          </div>
          <h2 style={{ marginBottom: '12px', fontSize: '1.5rem' }}>Practice Mode Locked</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.5' }}>
            Interactive Practice is restricted to real members. Register or log in with your Gmail to solve this exam, track your timer, and save your performance statistics.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Link to={`/login?redirect=/exam/${slug}?practice=true`} className="btn btn-primary">
              Login to Practice
            </Link>
            <Link to={`/exam/${slug}`} className="btn btn-secondary">
              <Eye size={16} /> View Answer Key (Guest)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px', paddingBottom: isPracticeMode && !submitted ? '100px' : '40px' }}>
      
      {/* Back Button */}
      <Link to="/blogs" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, paddingLeft: 0, marginBottom: '20px' }}>
        <ArrowLeft size={16} /> Back to Blogs
      </Link>

      {/* Blog Article Header */}
      <article style={{ maxWidth: '800px', margin: '0 auto' }}>
        <div className="exam-header-card" style={{ padding: '36px', marginBottom: '30px' }}>
          {/* Post Meta */}
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            <span className="exam-badge active" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
              {post.category}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} />
              {formatDate(post.created_at)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <User size={12} />
              By Admin
            </span>
            <span>•</span>
            <span>{post.questions.length} MCQ Questions</span>
          </div>

          <h1 style={{ fontSize: '2.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-white)', marginBottom: '16px', lineHeight: '1.3' }}>
            {post.title}
          </h1>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {post.subject_code && <span className="exam-badge">Subject Code: {post.subject_code}</span>}
            {post.subject && <span className="exam-badge">Subject: {post.subject}</span>}
            {post.board && <span className="exam-badge">Board: {post.board}</span>}
            <span className="exam-badge">Year: {post.year}</span>
          </div>

          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
            Welcome to the detailed study guide for the <b>{post.title}</b>. This blog post is curated by our academic experts to provide you with high-quality MCQ solutions. Study the answers and read the corresponding explanations below for efficient self-study, or switch to <b>Interactive Practice Mode</b> to challenge yourself.
          </p>
        </div>

        {/* Mode Toggle Banner */}
        <div className="card" style={{ 
          padding: '20px 24px', 
          marginBottom: '32px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          background: 'linear-gradient(rgba(139, 92, 246, 0.04), rgba(139, 92, 246, 0.01))',
          borderColor: 'var(--border)'
        }}>
          <div>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: 'var(--text-white)' }}>
              {isPracticeMode ? '📝 You are in Practice Mode' : '📖 You are in Study Mode'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              {isPracticeMode 
                ? 'Answers are hidden. Click options and hit Submit to grade.' 
                : 'Correct answers and detailed explanations are displayed instantly.'}
            </p>
          </div>
          <div>
            {isPracticeMode ? (
              <button 
                onClick={() => navigate(`/exam/${slug}`)} 
                className="btn btn-secondary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Eye size={14} />
                Switch to Study Mode
              </button>
            ) : (
              <button 
                onClick={() => navigate(`/exam/${slug}?practice=true`)} 
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Award size={14} />
                Switch to Practice Mode
              </button>
            )}
          </div>
        </div>

        {/* Practice Results Header */}
        {submitted && results && (
          <div className="card" style={{ 
            background: 'linear-gradient(rgba(16, 185, 129, 0.05), rgba(16, 185, 129, 0.02))', 
            borderColor: 'var(--success-border)', 
            padding: '30px', 
            marginBottom: '32px',
            textAlign: 'center'
          }}>
            <Award size={48} color="var(--success)" style={{ margin: '0 auto 16px' }} />
            <h2 style={{ color: 'var(--success)', fontSize: '1.8rem', marginBottom: '8px' }}>Test Completed!</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>Your practice test has been evaluated and recorded.</p>
            <div style={{ display: 'inline-flex', gap: '24px', background: 'var(--bg-input)', padding: '12px 32px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-white)' }}>{results.score} / {results.totalQuestions}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Final Score</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)' }}></div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-white)' }}>{Math.round((results.score / results.totalQuestions) * 100)}%</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Accuracy</div>
              </div>
              <div style={{ borderLeft: '1px solid var(--border)' }}></div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--text-white)' }}>{formatTime(timeSpent)}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Time Spent</div>
              </div>
            </div>
            <div style={{ marginTop: '24px' }}>
              <button onClick={handleResetPractice} className="btn btn-success" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                <RefreshCw size={16} /> Retake Test
              </button>
            </div>
          </div>
        )}

        {/* MCQ Sheet */}
        <div>
          {post.questions.map((q, qIdx) => {
            const userSel = selectedAnswers[qIdx] || "";
            
            // Get correct answer
            let correctAns = "";
            let explanationText = "";

            if (isPracticeMode) {
              if (submitted && results) {
                const graded = results.gradedResults.find(r => r.qIndex === qIdx);
                correctAns = graded?.correctAnswer || "";
                explanationText = results.explanations?.[qIdx] || "";
              }
            } else {
              const correctAnswers = post.answers || {};
              if (correctAnswers['ka']) {
                correctAns = correctAnswers['ka'][qIdx] || "";
              } else if (Array.isArray(correctAnswers)) {
                correctAns = correctAnswers[qIdx] || "";
              } else {
                correctAns = correctAnswers[qIdx] || "";
              }
              explanationText = post.explanations?.[qIdx] || "";
            }

            return (
              <div key={qIdx} className="mcq-question-card" style={{ padding: '28px', marginBottom: '24px' }}>
                <div className="question-text" style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <span className="exam-badge active" style={{ fontSize: '0.7rem', padding: '4px 8px', borderRadius: '4px', flexShrink: 0 }}>
                    Q {qIdx + 1}
                  </span>
                  <div style={{ flex: 1, fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-white)', lineHeight: '1.5' }}>
                    {renderQuestionText(q.q || q.question)}
                  </div>
                </div>

                <div className="options-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['a', 'b', 'c', 'd'].map((optKey) => {
                    const optText = q[optKey] || q[`option_${optKey}`];
                    if (!optText) return null;

                    let btnClass = "option-btn";
                    let isSelected = userSel === optKey;

                    if (isPracticeMode) {
                      if (submitted) {
                        const isCorrectChoice = optKey === correctAns;
                        const isIncorrectChoice = isSelected && !isCorrectChoice;
                        
                        if (isCorrectChoice) {
                          btnClass += " correct";
                        } else if (isIncorrectChoice) {
                          btnClass += " incorrect";
                        }
                      } else if (isSelected) {
                        btnClass += " selected";
                      }
                    } else {
                      // Study Mode: Highlight correct answer immediately
                      if (optKey === correctAns) {
                        btnClass += " correct";
                      }
                    }

                    return (
                      <button
                        key={optKey}
                        onClick={() => handleSelectOption(qIdx, optKey)}
                        className={btnClass}
                        disabled={submitted && isPracticeMode}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          width: '100%',
                          padding: '14px 20px',
                          borderRadius: 'var(--radius-md)',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-input)',
                          color: 'var(--text-secondary)',
                          cursor: (submitted && isPracticeMode) ? 'default' : 'pointer',
                          transition: 'all 0.2s',
                          textAlign: 'left',
                          gap: '12px'
                        }}
                      >
                        <div className="option-prefix" style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          background: 'rgba(255, 255, 255, 0.05)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          flexShrink: 0
                        }}>
                          {optKey.toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>{optText}</div>
                        
                        {/* Status Checkmarks for Study Mode & Graded Practice */}
                        {(!isPracticeMode && optKey === correctAns) && (
                          <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                        )}
                        {(isPracticeMode && submitted) && (
                          optKey === correctAns ? (
                            <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                          ) : (
                            isSelected && <XCircle size={16} color="var(--error)" style={{ flexShrink: 0 }} />
                          )
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Study explanations box */}
                {((!isPracticeMode) || (submitted && results)) && explanationText && (
                  <div className="explanation-card" style={{ 
                    marginTop: '20px', 
                    padding: '20px', 
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid rgba(139, 92, 246, 0.15)',
                    background: 'rgba(139, 92, 246, 0.03)'
                  }}>
                    <div className="explanation-title" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px', 
                      fontSize: '0.85rem', 
                      fontWeight: 700, 
                      color: '#A78BFA',
                      marginBottom: '8px'
                    }}>
                      <BookOpen size={14} />
                      Study Solution Explanation
                    </div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {explanationText}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </article>

      {/* Floating Submit Bar (Only in Practice Mode before submission) */}
      {isPracticeMode && !submitted && (
        <div className="practice-floating-bar">
          <div className="container floating-inner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-white)' }}>
                <Clock size={18} color="var(--primary)" />
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{formatTime(timeSpent)}</span>
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Answered: <b style={{ color: 'var(--text-white)' }}>{Object.keys(selectedAnswers).length}</b> / {post.questions.length}
              </div>
            </div>
            
            <button onClick={handleSubmitPractice} className="btn btn-primary" style={{ height: '44px', padding: '0 28px', borderRadius: 'var(--radius-full)' }}>
              Submit Practice Test
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
