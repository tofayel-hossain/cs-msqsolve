import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Clock, Calendar, ArrowRight, User } from 'lucide-react';

export default function Blogs() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

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

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    (post.subject && post.subject.toLowerCase().includes(search.toLowerCase())) ||
    (post.category && post.category.toLowerCase().includes(search.toLowerCase()))
  );

  // Generate a fake blog post excerpt based on category/subject
  const getPostExcerpt = (post) => {
    return `Master the core concepts of ${post.subject || post.title} with this comprehensive collection of ${post.mcq_count} multiple-choice questions. This blog post features clear breakdowns, highlighted correct answers, and thorough explanations, designed to help students, developers, and candidates ace their upcoming ${post.board || 'W3C'} exams.`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'June 23, 2026';
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      
      {/* Blog Feed Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '12px' }}>
          MCQ Solutions & Study Blogs
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Read detailed subject analyses, study correct answers with context, and take practice assessments.
        </p>
      </div>

      {/* Search Input */}
      <div className="search-container" style={{ maxWidth: '600px', margin: '0 auto 40px' }}>
        <div className="search-input-box">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Search blogs by title, subject code..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          Loading blog articles...
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>📝</div>
          <h3 style={{ marginBottom: '8px' }}>No articles match your search</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            We couldn't find any blogs matching "{search}". Try another topic!
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', maxWidth: '800px', margin: '0 auto' }}>
          {filteredPosts.map((post) => (
            <article 
              key={post.id} 
              className="card blog-post-card" 
              style={{ 
                padding: '32px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '16px',
                transition: 'transform 0.2s, border-color 0.2s'
              }}
            >
              {/* Blog Meta Header */}
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span className="exam-badge active" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  {post.category}
                </span>
                {post.subject_code && (
                  <span style={{ fontFamily: 'var(--font-mono)' }}>Code: {post.subject_code}</span>
                )}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={12} />
                  {formatDate(post.created_at)}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <User size={12} />
                  By {post.author || 'Admin'}
                </span>
              </div>

              {/* Title */}
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', margin: 0 }}>
                <Link to={`/exam/${post.slug}`} style={{ color: 'var(--text-white)', textDecoration: 'none' }}>
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.95rem', margin: 0 }}>
                {getPostExcerpt(post)}
              </p>

              {/* Footer row */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderTop: '1px solid var(--border)', 
                paddingTop: '20px',
                marginTop: '10px',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>Questions: <b>{post.mcq_count}</b></span>
                  <span>•</span>
                  <span>Board: <b>{post.board}</b></span>
                  <span>•</span>
                  <span>Year: <b>{post.year}</b></span>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link 
                    to={`/exam/${post.slug}`} 
                    className="nav-link" 
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '6px', 
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: 'var(--primary)'
                    }}
                  >
                    Read & Study Solutions
                    <ArrowRight size={14} />
                  </Link>
                  <Link 
                    to={`/exam/${post.slug}?practice=true`} 
                    className="btn btn-primary btn-sm"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    Take Practice Quiz
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
