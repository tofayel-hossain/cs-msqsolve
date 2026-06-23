import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Code, Shield, HeartPulse, GraduationCap, Globe, BookOpen, Clock, ChevronRight, Award } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', name: 'All Categories', icon: BookOpen, desc: 'View all practice sets' },
  { id: 'web-development', name: 'Web Dev (HTML/CSS)', icon: Code, desc: 'HTML, CSS, JavaScript programming exams' },
  { id: 'job-exam', name: 'Job Exams', icon: Shield, desc: 'Government, banking, and professional certifications' },
  { id: 'medical', name: 'Medical Admission', icon: HeartPulse, desc: 'MCAT, USMLE, and dental biology exams' },
  { id: 'academic', name: 'Academic (SSC/HSC)', icon: GraduationCap, desc: 'School, college and board curriculum MCQs' },
  { id: 'general-knowledge', name: 'General Knowledge', icon: Globe, desc: 'International affairs, science and histories' }
];

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (res.ok) {
        setPosts(data.posts || []);
      }
    } catch (e) {
      console.error("Error fetching posts:", e);
    } finally {
      setLoading(false);
    }
  };

  // Filter posts based on search query & category
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) ||
      (post.subject && post.subject.toLowerCase().includes(search.toLowerCase())) ||
      (post.category && post.category.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory = activeCategory === 'all' || 
      post.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      {/* Hero Header */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <Award size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
            GLOBAL MCQ PRACTICE PORTAL
          </div>
          <h1>
            Crack Any Exam With <br />
            <span className="gradient-text">Interactive MCQ Solutions</span>
          </h1>
          <p>
            Study, practice, and test your knowledge. Normal users see answer sheets instantly. Log in with your Gmail to take real interactive practice tests!
          </p>
        </div>
      </section>

      {/* Global Search Bar */}
      <div className="container">
        <div className="search-container">
          <div className="search-input-box">
            <Search className="search-icon" size={20} />
            <input 
              type="text" 
              className="search-input" 
              placeholder="Search by topic, subject code, category (e.g. HTML, SSC, Job)..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Category Pill Filters */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'center', 
          flexWrap: 'wrap', 
          marginBottom: '40px' 
        }}>
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`exam-badge ${isActive ? 'active' : ''}`}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '6px', 
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-full)',
                  cursor: 'pointer'
                }}
              >
                <Icon size={14} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Display Content Grid */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: '24px' }}>
          Available Solution Sets
        </h2>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
            Loading exams...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔍</div>
            <h3 style={{ marginBottom: '8px' }}>No MCQ sets found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              We couldn't find any practice sheets matching "{search}". Try searching for another category or check back later!
            </p>
          </div>
        ) : (
          <div className="mcq-grid">
            {filteredPosts.map((post) => {
              // Find matching category details for icon
              const catDetails = CATEGORIES.find(c => c.id === post.category) || CATEGORIES[0];
              const Icon = catDetails.icon;

              return (
                <div key={post.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div className="card-icon-box" style={{ margin: 0, color: 'var(--primary)' }}>
                        <Icon size={20} />
                      </div>
                      <span className="exam-badge" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                        {post.category}
                      </span>
                    </div>

                    <h3 className="card-title" style={{ fontSize: '1.15rem', color: 'var(--text-white)' }}>
                      {post.title}
                    </h3>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', margin: '12px 0 20px' }}>
                      {post.subject_code && <span className="exam-badge" style={{ fontSize: '0.65rem' }}>Code: {post.subject_code}</span>}
                      {post.board && <span className="exam-badge" style={{ fontSize: '0.65rem' }}>{post.board}</span>}
                      <span className="exam-badge" style={{ fontSize: '0.65rem' }}>{post.year}</span>
                    </div>
                  </div>

                  <div>
                    <div className="card-footer" style={{ marginBottom: '18px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BookOpen size={12} />
                        {post.mcq_count} Questions
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} />
                        {post.year} Board
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Link 
                        to={`/exam/${post.slug}`} 
                        className="btn btn-secondary btn-sm"
                        style={{ flex: 1 }}
                      >
                        Answer Key
                      </Link>
                      <Link 
                        to={`/exam/${post.slug}?practice=true`} 
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1 }}
                      >
                        Practice Mode
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
