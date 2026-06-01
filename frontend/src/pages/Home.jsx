import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';
import { MessageSquare, Calendar } from 'lucide-react';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await api.get('/posts');
        setPosts(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchPosts();
  }, []);

  if (loading) return <div className="container mt-4">Loading...</div>;

  return (
    <div className="container">
      <h1 className="page-title mt-4">Latest Insights</h1>
      
      {posts.length === 0 ? (
        <p>No posts available. Be the first to write one!</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {posts.map(post => (
            <div key={post.id} className="card">
              <h2 className="card-title">
                <Link to={`/post/${post.id}`}>{post.title}</Link>
              </h2>
              <div className="card-meta">
                <span>By {post.author.name}</span>
                <span className="flex align-center gap-2">
                  <Calendar size={14} /> 
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className="flex align-center gap-2">
                  <MessageSquare size={14} /> 
                  {post._count?.comments || 0}
                </span>
              </div>
              <p className="card-excerpt">
                {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
              </p>
              <div className="mt-3">
                <Link to={`/post/${post.id}`} className="btn btn-secondary btn-sm">Read More</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
