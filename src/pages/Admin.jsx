import React, { useState } from 'react';
import { Shield, Key, FileText, CheckCircle2, AlertCircle, Play } from 'lucide-react';

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

export default function Admin() {
  const [adminKey, setAdminKey] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  // Post states
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('web-development');
  const [subject, setSubject] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [board, setBoard] = useState('General');
  const [year, setYear] = useState('2026');
  
  // JSON Questions Input
  const [questionsJson, setQuestionsJson] = useState(JSON.stringify(SAMPLE_TEMPLATE, null, 2));
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthorize = (e) => {
    e.preventDefault();
    if (!adminKey) {
      setError('Please enter your admin secret key.');
      return;
    }
    // Locally save authorization state
    setIsAuthorized(true);
    setError('');
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!title || !slug || !questionsJson) {
      setError('Please fill in Title, Slug, and paste the Questions JSON.');
      return;
    }

    let parsedQuestions = [];
    try {
      parsedQuestions = JSON.parse(questionsJson);
      if (!Array.isArray(parsedQuestions)) {
        throw new Error("JSON must be a list of questions.");
      }
    } catch (e) {
      setError(`Invalid Questions JSON format: ${e.message}`);
      return;
    }

    setLoading(true);

    // Structure raw questions JSON into the database payload format:
    // questions: [ { q: "...", a: "...", b: "...", c: "...", d: "..." } ]
    // answers: { ka: [ "a", "b", ... ] }
    // explanations: [ "...", "..." ]
    const databaseQuestions = [];
    const correctAnswersList = [];
    const explanationsList = [];

    parsedQuestions.forEach((q, index) => {
      const questionText = q.question || q.q || "";
      const optA = q.option_a || q.a || "";
      const optB = q.option_b || q.b || "";
      const optC = q.option_c || q.c || "";
      const optD = q.option_d || q.d || "";
      const correctAns = q.correct || q.answer || "a";
      const explanationText = q.explanation || q.exp || "";

      databaseQuestions.push({
        q: questionText,
        a: optA,
        b: optB,
        c: optC,
        d: optD
      });

      correctAnswersList.push(correctAns.toLowerCase().trim());
      explanationsList.push(explanationText);
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
      status: 'published'
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
        // Clear fields on success
        setTitle('');
        setSlug('');
        setSubject('');
        setSubjectCode('');
      } else {
        setError(data.error || 'Failed to publish MCQ set.');
      }
    } catch (e) {
      setError('An error occurred during submission. Verify your backend is running.');
    } finally {
      setLoading(false);
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
      <h1 className="gradient-text" style={{ fontSize: '2rem', marginBottom: '12px' }}>
        Create MCQ Question Paper
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
        Create premium, search-optimized MCQ lists with an automated JSON import compiler.
      </p>

      {error && (
        <div className="error-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="success-message" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handlePublish} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', alignItems: 'start' }}>
        
        {/* Left Side: Header Fields */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <FileText size={18} color="var(--primary)" />
            Header Information
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
              <label className="form-label">Subject Code (Optional)</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. 101"
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Subject (Optional)</label>
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
              <label className="form-label">Board / Organizer</label>
              <input 
                type="text" 
                className="form-control" 
                placeholder="e.g. Dhaka, GCSE, General"
                value={board}
                onChange={(e) => setBoard(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Exam Year</label>
              <input 
                type="number" 
                className="form-control" 
                placeholder="2026"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Paste JSON */}
        <div className="card" style={{ padding: '28px' }}>
          <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Play size={18} color="var(--primary)" />
            Questions JSON Parser
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Write or paste questions array. Markdown code blocks are supported in questions.
          </p>

          <div className="form-group">
            <textarea 
              className="form-control" 
              style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', minHeight: '320px', resize: 'vertical', lineHeight: '1.4' }}
              value={questionsJson}
              onChange={(e) => setQuestionsJson(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block" 
            style={{ height: '48px', marginTop: '16px' }}
            disabled={loading}
          >
            {loading ? 'Publishing MCQ set...' : 'Publish MCQ Question Set'}
          </button>
        </div>
      </form>
    </div>
  );
}
