import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/posts', { title, content });
      navigate(`/post/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.msg || 'Error creating post');
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="page-title">Write a New Post</h1>
      
      <div className="card">
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter post title..."
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="form-control"
              rows="12"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your story..."
              required
            ></textarea>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn btn-primary">Publish Post</button>
            <button type="button" onClick={() => navigate('/')} className="btn btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
