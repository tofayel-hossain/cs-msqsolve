import React, { useState, useEffect } from 'react';
import { 
  Shield, Key, FileText, CheckCircle2, AlertCircle, Play, 
  Plus, Trash2, Code, Sparkles, List, User, LogOut, Check, Edit3,
  TrendingUp, Users, Settings, Calendar, RefreshCw, Lock, Globe
} from 'lucide-react';

const SAMPLE_TEMPLATE = [
  {
    "question": "Which HTML tag is used to define an internal style sheet?\n```html\n<style>\n  body { background-color: linen; }\n</style>\n```",
    "option_a": "<css>",
    "option_b": "<style>",
    "option_c": "<script>",
    "option_d": "<stylesheet>",
    "correct": "b",
    "explanation": "The <style> element is used to define internal CSS styling in HTML document."
  },
  {
    "question": "What does CSS stand for?",
    "option_a": "Colorful Style Sheets",
    "option_b": "Computer Style Sheets",
    "option_c": "Cascading Style Sheets",
    "option_d": "Creative Style Sheets",
    "correct": "c",
    "explanation": "CSS stands for Cascading Style Sheets. It determines layouts and designs on web pages."
  }
];

const RAW_PARSE_HELP = `1. What is HTML?
a) A programming language
b) A markup language
c) A database
d) An operating system
Answer: b
Explanation: HTML stands for HyperText Markup Language.

2. What does CSS stand for?
A. Creative Style Sheets
B. Cascading Style Sheets
C. Computer Style Sheets
D. Colorful Style Sheets
Correct: B
Explanation: CSS determines layouts and designs on web pages.`;

export default function Admin() {
  // Sticky Auth state
  const [adminKey, setAdminKey] = useState(() => localStorage.getItem('mcqsolve_admin_key') || '');
  const [isAuthorized, setIsAuthorized] = useState(() => !!localStorage.getItem('mcqsolve_admin_key'));
  
  // Primary Tabs: 'creator' | 'analytics' | 'metadata'
  const [primaryTab, setPrimaryTab] = useState('creator');

  // Header state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('web-development');
  const [subject, setSubject] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [board, setBoard] = useState('General');
  const [year, setYear] = useState('2026');
  
  // Sticky Author Name
  const [author, setAuthor] = useState(() => localStorage.getItem('mcqsolve_admin_author') || 'Admin');
  
  // Questions State
  const [questions, setQuestions] = useState(SAMPLE_TEMPLATE);
  
  // Compiler Tabs: 'parser' | 'builder' | 'json'
  const [activeTab, setActiveTab] = useState('parser');
  
  // Raw Input for Parser tab
  const [rawText, setRawText] = useState(RAW_PARSE_HELP);
  
  // JSON Input for JSON tab
  const [jsonText, setJsonText] = useState(JSON.stringify(SAMPLE_TEMPLATE, null, 2));
  
  // Alerts
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Analytics states
  const [analyticsData, setAnalyticsData] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [analyticsRange, setAnalyticsRange] = useState('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  // Password reset state
  const [editingUserId, setEditingUserId] = useState(null);
  const [newPasswordVal, setNewPasswordVal] = useState('');
  const [pwdError, setPwdError] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');

  // SEO Metadata states
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [headScript, setHeadScript] = useState('');
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState('');
  const [metaSuccess, setMetaSuccess] = useState('');

  // Fetch Metadata Settings on mount
  const loadMetadataSettings = async () => {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setMetaTitle(data.settings.meta_title || '');
          setMetaDescription(data.settings.meta_description || '');
          setMetaKeywords(data.settings.meta_keywords || '');
          setHeadScript(data.settings.head_script || '');
        }
      }
    } catch (e) {
      console.error("Failed to load settings", e);
    }
  };

  // Fetch Analytics from API
  const loadAnalytics = async () => {
    if (!adminKey) return;
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      let url = `/api/analytics/dashboard?range=${analyticsRange}`;
      if (analyticsRange === 'custom') {
        url += `&startDate=${customStart}&endDate=${customEnd}`;
      }
      const res = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${adminKey}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch analytics data');
      }
      setAnalyticsData(data);
    } catch (e) {
      setAnalyticsError(e.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  // Sync questions with JSON text field whenever questions array changes
  useEffect(() => {
    setJsonText(JSON.stringify(questions, null, 2));
  }, [questions]);

  // Trigger metadata load on mount
  useEffect(() => {
    loadMetadataSettings();
  }, []);

  // Trigger analytics load when tab changes or range changes
  useEffect(() => {
    if (isAuthorized && primaryTab === 'analytics') {
      loadAnalytics();
    }
  }, [isAuthorized, primaryTab, analyticsRange]);

  // Persist author name to localStorage
  const handleAuthorChange = (e) => {
    const val = e.target.value;
    setAuthor(val);
    localStorage.setItem('mcqsolve_admin_author', val);
  };

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!adminKey.trim()) {
      setError('Please enter your admin secret key.');
      return;
    }
    localStorage.setItem('mcqsolve_admin_key', adminKey.trim());
    setIsAuthorized(true);
    setError('');
  };

  const handleDeauthorize = () => {
    localStorage.removeItem('mcqsolve_admin_key');
    setIsAuthorized(false);
    setAdminKey('');
    setSuccess('Logged out of Admin Control Center.');
  };

  // Smart Parser Algorithm
  const parseRawQuestions = (text) => {
    if (!text.trim()) return [];
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const parsed = [];
    let current = null;
    
    for (let line of lines) {
      // 1. Check if line starts a new question (e.g. "1. What is HTML?" or "1) What is..." or "Q1. What is...")
      const qMatch = line.match(/^(?:q)?(?:uestion)?\s*(\d+)[\.\)\:\s\]\-]+(.*)/i);
      if (qMatch) {
        if (current) {
          parsed.push(current);
        }
        current = {
          question: qMatch[2].trim(),
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct: 'a',
          explanation: ''
        };
        continue;
      }
      
      if (!current) continue;
      
      // 2. Check if line is an option (e.g. "a) Hypertext", "A. Hypertext", "(a) Hypertext", "[A] Hypertext")
      const optMatch = line.match(/^[\(\[]?([a-d])[\)\]\.\:\s\-]+(.*)/i);
      if (optMatch) {
        const optLetter = optMatch[1].toLowerCase();
        current[`option_${optLetter}`] = optMatch[2].trim();
        continue;
      }
      
      // 3. Check if line is correct answer (e.g. "Answer: a" or "Ans: B" or "Correct: C" or "Correct Answer: d")
      const ansMatch = line.match(/^(?:correct\s+)?(?:ans|answer|correct\s+option|correct\s+answer)[\s\:\-\=]+([a-d])/i);
      if (ansMatch) {
        current.correct = ansMatch[1].toLowerCase();
        continue;
      }
      
      // 4. Check if line is explanation (e.g. "Explanation: ..." or "Explain: ...")
      const expMatch = line.match(/^(?:explanation|explain|note|exp)[\s\:\-\=]+(.*)/i);
      if (expMatch) {
        current.explanation = expMatch[1].trim();
        continue;
      }
      
      // 5. Otherwise, append to existing fields
      if (current.option_d) {
        // If we already have option d, append to explanation
        current.explanation = (current.explanation ? current.explanation + '\n' : '') + line;
      } else if (!current.option_a) {
        // If we don't have option a yet, it's multi-line question text
        current.question = current.question + '\n' + line;
      } else {
        // It's a multi-line option
        if (current.option_c) current.option_c += '\n' + line;
        else if (current.option_b) current.option_b += '\n' + line;
        else if (current.option_a) current.option_a += '\n' + line;
      }
    }
    
    if (current) {
      parsed.push(current);
    }
    
    return parsed;
  };

  const handleCompileRawText = () => {
    setError('');
    setSuccess('');
    try {
      const parsed = parseRawQuestions(rawText);
      if (parsed.length === 0) {
        setError('Could not parse any questions. Please check the formatting guide.');
        return;
      }
      setQuestions(parsed);
      setSuccess(`Successfully parsed ${parsed.length} questions! Click on 'Visual Editor' to review them.`);
      setActiveTab('builder');
    } catch (err) {
      setError(`Failed to compile text: ${err.message}`);
    }
  };

  const handleCompileJson = () => {
    setError('');
    setSuccess('');
    try {
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        setError('JSON must be a list (Array) of questions.');
        return;
      }
      setQuestions(parsed);
      setSuccess('Successfully compiled JSON data!');
      setActiveTab('builder');
    } catch (err) {
      setError(`JSON Parse Error: ${err.message}`);
    }
  };

  // Question Builder Controls
  const handleUpdateQuestionField = (index, field, value) => {
    const updated = [...questions];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setQuestions(updated);
  };

  const handleDeleteQuestion = (index) => {
    const updated = questions.filter((_, i) => i !== index);
    setQuestions(updated);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: 'New Question Text',
        option_a: '',
        option_b: '',
        option_c: '',
        option_d: '',
        correct: 'a',
        explanation: ''
      }
    ]);
  };

  // Submit Handler
  const handlePublish = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !slug) {
      setError('Please fill in Title and Slug.');
      return;
    }

    if (questions.length === 0) {
      setError('Please add or compile at least one question.');
      return;
    }

    // Double-check validation for each question
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        setError(`Question ${i + 1} has empty question text.`);
        return;
      }
      if (!q.option_a.trim() || !q.option_b.trim()) {
        setError(`Question ${i + 1} requires at least Option A and Option B.`);
        return;
      }
    }

    setLoading(true);

    const databaseQuestions = [];
    const correctAnswersList = [];
    const explanationsList = [];

    questions.forEach((q) => {
      databaseQuestions.push({
        q: q.question,
        a: q.option_a,
        b: q.option_b,
        c: q.option_c || "",
        d: q.option_d || ""
      });

      correctAnswersList.push(q.correct.toLowerCase().trim());
      explanationsList.push(q.explanation || "");
    });

    const payload = {
      title,
      slug: slug.trim().toLowerCase(),
      category,
      subject,
      subject_code: subjectCode,
      board,
      year: parseInt(year) || 2026,
      mcq_count: databaseQuestions.length,
      questions: databaseQuestions,
      answers: { ka: correctAnswersList },
      explanations: explanationsList,
      status: 'published',
      author: author.trim()
    };

    try {
      const res = await fetch('/api/posts/create', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(data.message || 'MCQ set published successfully!');
        // Clear forms on success
        setTitle('');
        setSlug('');
        setSubject('');
        setSubjectCode('');
        setQuestions([]);
        setRawText('');
      } else {
        setError(data.error || 'Failed to publish MCQ set.');
      }
    } catch (e) {
      setError('An error occurred during submission. Verify your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (userId) => {
    if (!newPasswordVal || newPasswordVal.length < 6) {
      setPwdError('Password must be at least 6 characters.');
      return;
    }
    setPwdError('');
    setPwdSuccess('');
    try {
      const res = await fetch('/api/analytics/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({ userId, newPassword: newPasswordVal })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }
      setPwdSuccess('Password updated successfully!');
      setNewPasswordVal('');
      loadAnalytics();
      setTimeout(() => {
        setEditingUserId(null);
        setPwdSuccess('');
      }, 1500);
    } catch (e) {
      setPwdError(e.message);
    }
  };

  const handleSaveMetadata = async (e) => {
    e.preventDefault();
    setMetaError('');
    setMetaSuccess('');
    setMetaLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminKey}`
        },
        body: JSON.stringify({
          meta_title: metaTitle,
          meta_description: metaDescription,
          meta_keywords: metaKeywords,
          head_script: headScript
        })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }
      setMetaSuccess('Site SEO Metadata updated successfully! Title and meta tags will update instantly.');
      document.title = metaTitle;
    } catch (e) {
      setMetaError(e.message);
    } finally {
      setMetaLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 180px)' }}>
        <div className="card" style={{ maxWidth: '400px', width: '100%', padding: '36px', textAlign: 'center' }}>
          <div className="card-icon-box" style={{ margin: '0 auto 20px', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444' }}>
            <Shield size={24} />
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: '12px', fontSize: '1.5rem' }}>Admin Control Center</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
            Enter your Cloudflare Admin Key to build or edit MCQ question sheets.
          </p>

          {error && (
            <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', textAlign: 'left' }}>
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleAuthorize}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Admin Secret Key</label>
              <div style={{ position: 'relative' }}>
                <Key size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="password" 
                  className="form-control" 
                  placeholder="mcqsolve_admin_secret_key"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  style={{ paddingLeft: '44px' }}
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-block" style={{ height: '48px' }}>
              Verify Authorization
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      
      {/* Header section with logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Sparkles size={28} color="var(--primary)" />
            Admin Control Center
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            Manage exam sheets, analyze website traffic, control user accounts, and update search engine optimization (SEO) configurations.
          </p>
        </div>
        <button 
          onClick={handleDeauthorize} 
          className="btn btn-secondary" 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '10px 16px', fontSize: '0.85rem' }}
        >
          <LogOut size={14} />
          Lock Center
        </button>
      </div>

      {error && (
        <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Primary Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        background: 'rgba(255,255,255,0.01)', 
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)',
        padding: '6px',
        gap: '8px',
        marginBottom: '32px'
      }}>
        <button
          type="button"
          onClick={() => setPrimaryTab('creator')}
          style={{
            flex: 1,
            background: primaryTab === 'creator' ? 'var(--primary)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            color: primaryTab === 'creator' ? 'var(--text-white)' : 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <FileText size={16} />
          Exam Sheets Creator
        </button>
        <button
          type="button"
          onClick={() => setPrimaryTab('analytics')}
          style={{
            flex: 1,
            background: primaryTab === 'analytics' ? 'var(--primary)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            color: primaryTab === 'analytics' ? 'var(--text-white)' : 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <TrendingUp size={16} />
          Website Analytics & Users
        </button>
        <button
          type="button"
          onClick={() => setPrimaryTab('metadata')}
          style={{
            flex: 1,
            background: primaryTab === 'metadata' ? 'var(--primary)' : 'transparent',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '12px',
            color: primaryTab === 'metadata' ? 'var(--text-white)' : 'var(--text-secondary)',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s ease'
          }}
        >
          <Globe size={16} />
          Global SEO Metadata
        </button>
      </div>

      {/* Tab 1: EXAM SHEETS CREATOR */}
      {primaryTab === 'creator' && (
        <form onSubmit={handlePublish} style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px', alignItems: 'start' }}>
          
          {/* Left Side: Header Fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div className="card" style={{ padding: '28px' }}>
              <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
                <FileText size={18} color="var(--primary)" />
                Metadata Settings
              </h3>

              <div className="form-group">
                <label className="form-label">Exam Post Title</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. HTML5 & CSS3 Essentials Practice 2026"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    // Auto generate slug
                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">URL Slug</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. html-css-essentials-2026"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select 
                    className="form-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ appearance: 'none', background: 'var(--bg-input)' }}
                  >
                    <option value="web-development">Web Dev (HTML/CSS)</option>
                    <option value="job-exam">Job Exams</option>
                    <option value="medical">Medical Admission</option>
                    <option value="academic">Academic (SSC/HSC)</option>
                    <option value="general-knowledge">General Knowledge</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Posted By (Author)</label>
                  <div style={{ position: 'relative' }}>
                    <User size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input 
                      type="text" 
                      className="form-control" 
                      placeholder="Admin"
                      value={author}
                      onChange={handleAuthorChange}
                      style={{ paddingLeft: '34px' }}
                    />
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Subject Name (Optional)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="e.g. HTML Programming"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Subject Code (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. 101"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Exam Board (Optional)</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="e.g. Dhaka Board"
                    value={board}
                    onChange={(e) => setBoard(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Exam/Posting Year</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block" 
              style={{ height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner" style={{ width: '18px', height: '18px' }} />
                  Compiling & Uploading D1...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Compile & Publish MCQ Exam Sheet
                </>
              )}
            </button>
            
          </div>

          {/* Right Side: Compiler Workspace */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            
            {/* Tab Header bar */}
            <div style={{ 
              display: 'flex', 
              background: 'rgba(255,255,255,0.02)', 
              borderBottom: '1px solid var(--border)',
              padding: '10px 16px 0 16px',
              gap: '8px'
            }}>
              <button 
                type="button"
                onClick={() => setActiveTab('parser')}
                className={`tab-btn ${activeTab === 'parser' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'parser' ? 'var(--bg-card)' : 'transparent',
                  border: '1px solid ' + (activeTab === 'parser' ? 'var(--border)' : 'transparent'),
                  borderBottomColor: activeTab === 'parser' ? 'transparent' : 'var(--border)',
                  padding: '10px 18px',
                  color: activeTab === 'parser' ? 'var(--text-white)' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '-1px'
                }}
              >
                <Sparkles size={14} />
                Smart Parser
              </button>
              
              <button 
                type="button"
                onClick={() => setActiveTab('builder')}
                className={`tab-btn ${activeTab === 'builder' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'builder' ? 'var(--bg-card)' : 'transparent',
                  border: '1px solid ' + (activeTab === 'builder' ? 'var(--border)' : 'transparent'),
                  borderBottomColor: activeTab === 'builder' ? 'transparent' : 'var(--border)',
                  padding: '10px 18px',
                  color: activeTab === 'builder' ? 'var(--text-white)' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '-1px'
                }}
              >
                <List size={14} />
                Visual Editor ({questions.length})
              </button>

              <button 
                type="button"
                onClick={() => setActiveTab('json')}
                className={`tab-btn ${activeTab === 'json' ? 'active' : ''}`}
                style={{
                  background: activeTab === 'json' ? 'var(--bg-card)' : 'transparent',
                  border: '1px solid ' + (activeTab === 'json' ? 'var(--border)' : 'transparent'),
                  borderBottomColor: activeTab === 'json' ? 'transparent' : 'var(--border)',
                  padding: '10px 18px',
                  color: activeTab === 'json' ? 'var(--text-white)' : 'var(--text-secondary)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  borderTopLeftRadius: '6px',
                  borderTopRightRadius: '6px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '-1px'
                }}
              >
                <Code size={14} />
                Developer JSON
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              
              {/* Tab 1: SMART TEXT PARSER */}
              {activeTab === 'parser' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.05)', border: '1px dashed rgba(139, 92, 246, 0.3)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <h4 style={{ margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '6px', color: '#A78BFA', fontSize: '0.9rem' }}>
                      <Sparkles size={14} />
                      Copy-Paste Smart Compiler
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                      Paste questions in a plain text layout. The parser will automatically extract the question stem, alternative options, correct key, and the study explanation block.
                    </p>
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '0.8rem' }}>Paste Raw Questions Block</label>
                    <textarea 
                      className="form-control" 
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', minHeight: '380px', resize: 'vertical', lineHeight: '1.4' }}
                      value={rawText}
                      onChange={(e) => setRawText(e.target.value)}
                      placeholder="1. Question text goes here..."
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={handleCompileRawText} 
                    className="btn btn-primary"
                    style={{ height: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Play size={14} />
                    Compile & Open Visual Editor
                  </button>
                </div>
              )}

              {/* Tab 2: VISUAL EDITOR */}
              {activeTab === 'builder' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Total Questions Compiled: <strong style={{ color: 'var(--text-white)' }}>{questions.length}</strong>
                    </span>
                    <button 
                      type="button"
                      onClick={handleAddQuestion}
                      className="btn btn-success btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', fontSize: '0.8rem' }}
                    >
                      <Plus size={14} />
                      Add Question
                    </button>
                  </div>

                  {questions.length === 0 ? (
                    <div style={{ padding: '40px 20px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
                        No questions compiled yet. Write or paste a set of questions to begin.
                      </p>
                      <button 
                        type="button"
                        onClick={() => setActiveTab('parser')}
                        className="btn btn-secondary btn-sm"
                      >
                        Use Smart Parser
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxHeight: '520px', overflowY: 'auto', paddingRight: '6px' }}>
                      {questions.map((q, idx) => (
                        <div key={idx} className="card" style={{ padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span className="exam-badge active" style={{ fontSize: '0.7rem' }}>Question {idx + 1}</span>
                            <button 
                              type="button" 
                              onClick={() => handleDeleteQuestion(idx)} 
                              style={{ background: 'transparent', border: 'none', color: '#EF4444', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                              title="Delete question"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {/* Question Text */}
                          <div className="form-group">
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Question Stem</label>
                            <textarea 
                              className="form-control" 
                              rows={2} 
                              style={{ fontSize: '0.85rem' }}
                              value={q.question}
                              onChange={(e) => handleUpdateQuestionField(idx, 'question', e.target.value)}
                            />
                          </div>

                          {/* Options A & B */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.7rem' }}>Option A</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                style={{ fontSize: '0.8rem', height: '36px' }}
                                value={q.option_a}
                                onChange={(e) => handleUpdateQuestionField(idx, 'option_a', e.target.value)}
                              />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.7rem' }}>Option B</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                style={{ fontSize: '0.8rem', height: '36px' }}
                                value={q.option_b}
                                onChange={(e) => handleUpdateQuestionField(idx, 'option_b', e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Options C & D */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.7rem' }}>Option C (Optional)</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                style={{ fontSize: '0.8rem', height: '36px' }}
                                value={q.option_c}
                                onChange={(e) => handleUpdateQuestionField(idx, 'option_c', e.target.value)}
                              />
                            </div>
                            <div className="form-group" style={{ margin: 0 }}>
                              <label className="form-label" style={{ fontSize: '0.7rem' }}>Option D (Optional)</label>
                              <input 
                                type="text" 
                                className="form-control" 
                                style={{ fontSize: '0.8rem', height: '36px' }}
                                value={q.option_d}
                                onChange={(e) => handleUpdateQuestionField(idx, 'option_d', e.target.value)}
                              />
                            </div>
                          </div>

                          {/* Correct Option Selector */}
                          <div className="form-group" style={{ marginBottom: '12px' }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Correct Answer Key</label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {['a', 'b', 'c', 'd'].map(opt => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleUpdateQuestionField(idx, 'correct', opt)}
                                  style={{
                                    flex: 1,
                                    height: '36px',
                                    borderRadius: 'var(--radius-sm)',
                                    border: '1px solid ' + (q.correct === opt ? 'var(--primary)' : 'var(--border)'),
                                    background: q.correct === opt ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-input)',
                                    color: q.correct === opt ? 'var(--primary-light)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: '0.8rem',
                                    textTransform: 'uppercase'
                                  }}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Explanation */}
                          <div className="form-group" style={{ margin: 0 }}>
                            <label className="form-label" style={{ fontSize: '0.75rem' }}>Study Solution Explanation</label>
                            <textarea 
                              className="form-control" 
                              rows={2} 
                              style={{ fontSize: '0.8rem' }}
                              value={q.explanation}
                              onChange={(e) => handleUpdateQuestionField(idx, 'explanation', e.target.value)}
                              placeholder="Add study guidelines or explanation here..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: DEVELOPER JSON EDITOR */}
              {activeTab === 'json' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Advanced direct JSON developer view. Changes made in the other tabs update this JSON automatically. You can also paste fully formed JSON lists here and compile.
                    </p>
                  </div>

                  <div className="form-group">
                    <textarea 
                      className="form-control" 
                      style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', minHeight: '380px', resize: 'vertical', lineHeight: '1.4' }}
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                    />
                  </div>

                  <button 
                    type="button" 
                    onClick={handleCompileJson} 
                    className="btn btn-secondary"
                    style={{ height: '44px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Code size={14} />
                    Validate & Save JSON compiler
                  </button>
                </div>
              )}

            </div>
          </div>
        </form>
      )}

      {/* Tab 2: WEBSITE ANALYTICS */}
      {primaryTab === 'analytics' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          {/* Traffic Range Selector & Refresh */}
          <div className="card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Calendar size={18} color="var(--primary)" />
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Traffic Range:</span>
              <div style={{ display: 'flex', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '2px' }}>
                {['1d', '3d', '7d', 'custom'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setAnalyticsRange(r)}
                    style={{
                      background: analyticsRange === r ? 'var(--primary)' : 'transparent',
                      border: 'none',
                      padding: '6px 12px',
                      color: '#white',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer'
                    }}
                  >
                    {r === '1d' ? '24 Hours' : r === '3d' ? '3 Days' : r === '7d' ? '7 Days' : 'Custom'}
                  </button>
                ))}
              </div>
            </div>

            {analyticsRange === 'custom' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="date"
                  className="form-control"
                  style={{ height: '34px', fontSize: '0.8rem', padding: '0 8px', width: '130px' }}
                  value={customStart}
                  onChange={(e) => setCustomStart(e.target.value)}
                />
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>to</span>
                <input
                  type="date"
                  className="form-control"
                  style={{ height: '34px', fontSize: '0.8rem', padding: '0 8px', width: '130px' }}
                  value={customEnd}
                  onChange={(e) => setCustomEnd(e.target.value)}
                />
                <button
                  type="button"
                  onClick={loadAnalytics}
                  className="btn btn-primary"
                  style={{ height: '34px', padding: '0 14px', fontSize: '0.8rem' }}
                >
                  Apply
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={loadAnalytics}
              className="btn btn-secondary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', height: '34px', padding: '0 14px', fontSize: '0.8rem' }}
            >
              <RefreshCw size={14} className={analyticsLoading ? 'spin' : ''} />
              Refresh
            </button>
          </div>

          {analyticsError && (
            <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={18} />
              <span>{analyticsError}</span>
            </div>
          )}

          {analyticsLoading ? (
            <div className="card" style={{ padding: '80px', textAlign: 'center' }}>
              <div className="spinner" style={{ margin: '0 auto 16px auto', width: '32px', height: '32px' }}></div>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Gathering website analytics data...</p>
            </div>
          ) : analyticsData ? (
            <>
              {/* Metric Cards Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'rgba(139, 92, 246, 0.1)', padding: '16px', borderRadius: '50%', color: 'var(--primary-light)' }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Registered</span>
                    <h2 style={{ fontSize: '2rem', margin: '4px 0 0 0', fontWeight: 700 }}>{analyticsData.totalUsers}</h2>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '16px', borderRadius: '50%', color: '#10B981' }}>
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Users (Practice)</span>
                    <h2 style={{ fontSize: '2rem', margin: '4px 0 0 0', fontWeight: 700 }}>{analyticsData.activeUsers}</h2>
                  </div>
                </div>

                <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '16px', borderRadius: '50%', color: '#3B82F6' }}>
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Visits (Range)</span>
                    <h2 style={{ fontSize: '2rem', margin: '4px 0 0 0', fontWeight: 700 }}>{analyticsData.totalViews}</h2>
                  </div>
                </div>
              </div>

              {/* Traffic Timeline & Top Paths Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px', alignItems: 'start' }}>
                
                {/* Visual Chart Card */}
                <div className="card" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <TrendingUp size={16} color="var(--primary)" />
                    Traffic History Timeline
                  </h3>
                  {analyticsData.trafficData.length === 0 ? (
                    <div style={{ height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      No visit data logged in this range.
                    </div>
                  ) : (
                    <div>
                      {/* CSS-based Bar Chart */}
                      <div style={{ display: 'flex', alignItems: 'flex-end', height: '220px', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '16px' }}>
                        {analyticsData.trafficData.map((d, index) => {
                          const maxCount = Math.max(...analyticsData.trafficData.map(t => t.count), 1);
                          const pct = (d.count / maxCount) * 100;
                          
                          // Format display label
                          let label = d.time_bucket;
                          if (d.time_bucket.includes(' ')) {
                            // Extract hour: e.g. "2026-06-23 14:00:00" -> "14:00"
                            label = d.time_bucket.split(' ')[1].substring(0, 5);
                          } else {
                            // Format date: e.g. "2026-06-23" -> "Jun 23"
                            try {
                              label = new Date(d.time_bucket).toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
                            } catch (e) {
                              label = d.time_bucket;
                            }
                          }
                          
                          return (
                            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                              <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                                <div 
                                  className="chart-bar"
                                  title={`${d.count} views on ${d.time_bucket}`}
                                  style={{
                                    width: '80%',
                                    maxWidth: '30px',
                                    height: `${pct}%`,
                                    background: 'linear-gradient(to top, var(--primary), var(--primary-light))',
                                    borderRadius: '3px 3px 0 0',
                                    transition: 'height 0.3s ease',
                                    cursor: 'pointer',
                                    position: 'relative'
                                  }}
                                >
                                  {/* Tooltip on hover */}
                                  <div className="chart-tooltip" style={{
                                    position: 'absolute',
                                    bottom: '100%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    padding: '4px 8px',
                                    borderRadius: 'var(--radius-sm)',
                                    fontSize: '0.7rem',
                                    fontWeight: 'bold',
                                    color: 'var(--text-white)',
                                    whiteSpace: 'nowrap',
                                    pointerEvents: 'none',
                                    opacity: 0,
                                    transition: 'opacity 0.2s',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                    zIndex: 10
                                  }}>
                                    {d.count} views
                                  </div>
                                </div>
                              </div>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%', textAlign: 'center' }}>{label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Top Visited Pages Card */}
                <div className="card" style={{ padding: '28px' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Globe size={16} color="var(--primary)" />
                    Top Visited Paths
                  </h3>
                  {analyticsData.topPaths.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '20px' }}>No pages tracked yet.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {analyticsData.topPaths.map((p, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                          <span 
                            style={{ fontSize: '0.8rem', color: 'var(--text-white)', fontFamily: 'var(--font-mono)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '170px' }} 
                            title={p.path}
                          >
                            {p.path}
                          </span>
                          <span className="exam-badge active" style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px' }}>
                            {p.count} hits
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* User Accounts Management Card */}
              <div className="card" style={{ padding: '28px' }}>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="var(--primary)" />
                  Registered User Accounts
                </h3>
                
                {analyticsData.usersList.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No user accounts found.</p>
                ) : (
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '800px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                          <th style={{ padding: '12px 16px' }}>Email Address</th>
                          <th style={{ padding: '12px 16px' }}>Registration Date</th>
                          <th style={{ padding: '12px 16px' }}>Password Hash (Bcrypt)</th>
                          <th style={{ padding: '12px 16px', textAlign: 'center' }}>Practice Sessions</th>
                          <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analyticsData.usersList.map((user) => (
                          <React.Fragment key={user.id}>
                            <tr style={{ borderBottom: '1px solid var(--border)', fontSize: '0.85rem' }}>
                              <td style={{ padding: '16px' }}>
                                <span style={{ fontWeight: 600, color: 'var(--text-white)' }}>{user.email}</span>
                              </td>
                              <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>
                                {new Date(user.created_at).toLocaleDateString(undefined, {year: 'numeric', month: 'short', day: 'numeric'})}
                              </td>
                              <td style={{ padding: '16px' }}>
                                <code style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', padding: '4px 8px', borderRadius: '4px' }}>
                                  {user.password_hash.substring(0, 18)}...
                                </code>
                              </td>
                              <td style={{ padding: '16px', textAlign: 'center' }}>
                                <span className="exam-badge" style={{ fontSize: '0.75rem', background: user.total_tests > 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255,255,255,0.05)', color: user.total_tests > 0 ? '#10B981' : 'var(--text-muted)' }}>
                                  {user.total_tests} taken
                                </span>
                              </td>
                              <td style={{ padding: '16px', textAlign: 'right' }}>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingUserId(editingUserId === user.id ? null : user.id);
                                    setNewPasswordVal('');
                                    setPwdError('');
                                    setPwdSuccess('');
                                  }}
                                  className="btn btn-secondary btn-sm"
                                  style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Lock size={12} />
                                  Reset Password
                                </button>
                              </td>
                            </tr>
                            
                            {/* Inline Password Edit Form */}
                            {editingUserId === user.id && (
                              <tr>
                                <td colSpan="5" style={{ padding: '16px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid var(--border)' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary-light)' }}>
                                      Set new password for {user.email}:
                                    </span>
                                    
                                    <div style={{ display: 'flex', gap: '8px', width: '300px' }}>
                                      <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Min 6 characters"
                                        style={{ height: '36px', fontSize: '0.8rem' }}
                                        value={newPasswordVal}
                                        onChange={(e) => setNewPasswordVal(e.target.value)}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleChangePassword(user.id)}
                                        className="btn btn-primary btn-sm"
                                        style={{ height: '36px', whiteSpace: 'nowrap' }}
                                      >
                                        Update
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setEditingUserId(null)}
                                        className="btn btn-secondary btn-sm"
                                        style={{ height: '36px' }}
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                  
                                  {pwdError && (
                                    <div style={{ color: 'var(--error)', fontSize: '0.75rem', marginTop: '8px', textAlign: 'right' }}>
                                      {pwdError}
                                    </div>
                                  )}
                                  {pwdSuccess && (
                                    <div style={{ color: '#10B981', fontSize: '0.75rem', marginTop: '8px', textAlign: 'right' }}>
                                      {pwdSuccess}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              No analytics data could be retrieved.
            </div>
          )}
        </div>
      )}

      {/* Tab 3: SITE SEO METADATA */}
      {primaryTab === 'metadata' && (
        <form onSubmit={handleSaveMetadata} className="card" style={{ padding: '32px', maxWidth: '640px', margin: '0 auto' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Globe size={18} color="var(--primary)" />
            Global Site Search Engine Optimization (SEO) Settings
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: '1.5' }}>
            Customize the meta elements dynamically. Updates here take effect instantly across all pages for search indexing bots and social media link crawler views.
          </p>

          {metaError && (
            <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <AlertCircle size={18} />
              <span>{metaError}</span>
            </div>
          )}

          {metaSuccess && (
            <div className="success-message" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
              <CheckCircle2 size={18} />
              <span>{metaSuccess}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Default Browser Tab Title (Site Title)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. MCQSolve Global | Interactive Practice & Solutions"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Search Engine Description (Meta Description)</span>
              <span style={{ fontSize: '0.75rem', color: metaDescription.length > 160 ? 'var(--error)' : 'var(--text-muted)' }}>
                {metaDescription.length} / 160 characters (recommended)
              </span>
            </label>
            <textarea 
              className="form-control" 
              rows={4}
              placeholder="e.g. Solve HTML, CSS, coding, academic, medical, and job MCQs. Built for Cloudflare Pages."
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">SEO Target Keywords (Meta Keywords, comma separated)</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. mcq, practice, study, quiz, learn"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Custom Header Scripts & HTML Injection (inserted in &lt;head&gt;)</label>
            <textarea 
              className="form-control" 
              rows={4}
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}
              placeholder="e.g. &lt;script src='https://www.googletagmanager.com/gtag/js?id=UA-XXXX'&gt;&lt;/script&gt;"
              value={headScript}
              onChange={(e) => setHeadScript(e.target.value)}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
              Add Google Analytics, tracking pixels, global styles, or third-party widgets.
            </span>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            disabled={metaLoading}
          >
            {metaLoading ? 'Saving Settings...' : 'Save Site Settings'}
          </button>
        </form>
      )}
    </div>
  );
}
