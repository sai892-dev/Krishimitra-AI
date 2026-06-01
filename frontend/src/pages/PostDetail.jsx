import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import { Calendar, User, Edit, Trash2 } from 'lucide-react';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await api.post(`/posts/${id}/comments`, { content: commentText });
      setPost({ ...post, comments: [res.data, ...post.comments] });
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await api.delete(`/posts/${id}`);
        navigate('/');
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!post) return <div className="container mt-4">Loading...</div>;

  const isAuthor = user && user.id === post.authorId;

  return (
    <div className="container">
      <div className="post-detail-header mt-4">
        <h1 className="page-title" style={{ marginBottom: '10px' }}>{post.title}</h1>
        
        <div className="flex justify-between align-center">
          <div className="card-meta" style={{ marginBottom: 0 }}>
            <span className="flex align-center gap-2">
              <User size={16} /> {post.author.name}
            </span>
            <span className="flex align-center gap-2">
              <Calendar size={16} /> {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          {isAuthor && (
            <div className="flex gap-2">
              <Link to={`/edit-post/${post.id}`} className="btn btn-secondary btn-sm">
                <Edit size={14} /> Edit
              </Link>
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="post-content">
        {post.content}
      </div>

      <div className="comments-section">
        <h3>Comments ({post.comments?.length || 0})</h3>
        
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mt-3 mb-4">
            <div className="form-group">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary btn-sm">Post Comment</button>
          </form>
        ) : (
          <div className="alert alert-danger mt-3 mb-4">
            <Link to="/login">Log in</Link> to leave a comment.
          </div>
        )}

        <div className="comments-list">
          {post.comments?.map(comment => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <span className="comment-author">{comment.author.name}</span>
                <span className="comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="comment-body">
                {comment.content}
              </div>
            </div>
          ))}
          {(!post.comments || post.comments.length === 0) && (
            <p>No comments yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
