import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Post.css';

const Post = ({ post, onLike, onDelete, onComment, onDeleteComment }) => {
  const { userInfo } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isLiked = post.likes.includes(userInfo?._id);
  const isOwner = post.user?._id === userInfo?._id || post.user === userInfo?._id;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await onComment(post._id, commentText.trim());
      setCommentText('');
    } finally {
      setSubmitting(false);
    }
  };

  const avatar = post.user?.profilePicture;
  const username = post.user?.username || 'Unknown';
  const userId = post.user?._id || post.user;

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${userId}`} className="post-user-link">
          <div className="post-avatar">
            {avatar ? (
              <img src={avatar} alt={username} />
            ) : (
              <span>{username[0]?.toUpperCase()}</span>
            )}
          </div>
          <div className="post-user-info">
            <span className="post-username">@{username}</span>
            {post.user?.fullName && (
              <span className="post-fullname">{post.user.fullName}</span>
            )}
          </div>
        </Link>
        <div className="post-meta">
          <span className="post-time">{formatDate(post.createdAt)}</span>
          {isOwner && (
            <button
              className="post-delete-btn"
              onClick={() => onDelete(post._id)}
              title="Delete post"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      {post.content && <p className="post-content">{post.content}</p>}

      {post.image && (
        <div className="post-image-container">
          <img src={post.image} alt="Post" className="post-image" />
        </div>
      )}

      <div className="post-actions">
        <button
          className={`action-btn like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post._id)}
        >
          {isLiked ? '❤️' : '🤍'} {post.likes.length}
        </button>
        <button
          className="action-btn comment-btn"
          onClick={() => setShowComments(!showComments)}
        >
          💬 {post.comments.length}
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {post.comments.length > 0 && (
            <div className="comments-list">
              {post.comments.map((comment) => {
                const commentUserId = comment.user?._id || comment.user;
                const isCommentOwner =
                  commentUserId === userInfo?._id ||
                  post.user?._id === userInfo?._id;
                return (
                  <div key={comment._id} className="comment">
                    <Link
                      to={`/profile/${commentUserId}`}
                      className="comment-user-link"
                    >
                      <div className="comment-avatar">
                        {comment.user?.profilePicture ? (
                          <img
                            src={comment.user.profilePicture}
                            alt={comment.user?.username}
                          />
                        ) : (
                          <span>
                            {(comment.user?.username || 'U')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="comment-username">
                        @{comment.user?.username || 'user'}
                      </span>
                    </Link>
                    <span className="comment-text">{comment.text}</span>
                    {isCommentOwner && (
                      <button
                        className="comment-delete-btn"
                        onClick={() => onDeleteComment(post._id, comment._id)}
                        title="Delete comment"
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="comment-input"
              maxLength={500}
            />
            <button
              type="submit"
              disabled={submitting || !commentText.trim()}
              className="comment-submit-btn"
            >
              Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Post;
