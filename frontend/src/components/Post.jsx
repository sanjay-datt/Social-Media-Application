import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FaHeart, FaRegHeart, FaRegComment, FaTrash, FaPaperPlane } from 'react-icons/fa';
import './Post.css';

const timeAgo = (dateStr) => {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function Post({ post, onDelete, onUpdate }) {
  const { user } = useAuth();
  const [likes, setLikes] = useState(post.likes || []);
  const [comments, setComments] = useState(post.comments || []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  const isLiked = likes.includes(user?._id);
  const isOwner = post.userId?._id === user?._id || post.userId === user?._id;

  const handleLike = async () => {
    try {
      const { data } = await API.put(`/posts/${post._id}/like`);
      setLikes(data.likes);
    } catch (err) {
      toast.error('Failed to update like');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await API.delete(`/posts/${post._id}`);
      onDelete(post._id);
      toast.success('Post deleted');
    } catch (err) {
      toast.error('Failed to delete post');
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const { data } = await API.post(`/posts/${post._id}/comment`, { text: commentText.trim() });
      setComments(data);
      setCommentText('');
    } catch (err) {
      toast.error('Failed to add comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/posts/${post._id}/comment/${commentId}`);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      toast.error('Failed to delete comment');
    }
  };

  const authorId = post.userId?._id || post.userId;
  const authorName = post.userId?.username || 'Unknown';
  const authorPic = post.userId?.profilePicture;

  return (
    <div className="post-card">
      <div className="post-header">
        <Link to={`/profile/${authorId}`} className="post-author-link">
          <div className="post-avatar">
            {authorPic ? (
              <img src={authorPic} alt={authorName} />
            ) : (
              <div className="post-avatar-placeholder">{authorName?.[0]?.toUpperCase()}</div>
            )}
          </div>
          <div>
            <span className="post-author-name">{authorName}</span>
            <span className="post-time">{timeAgo(post.createdAt)}</span>
          </div>
        </Link>
        {isOwner && (
          <button className="post-delete-btn" onClick={handleDelete} title="Delete post">
            <FaTrash />
          </button>
        )}
      </div>

      {post.desc && <p className="post-desc">{post.desc}</p>}
      {post.img && (
        <div className="post-image">
          <img src={post.img} alt="Post" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
      )}

      <div className="post-stats">
        <span>{likes.length} {likes.length === 1 ? 'like' : 'likes'}</span>
        <span
          className="comment-toggle-text"
          onClick={() => setShowComments((v) => !v)}
        >
          {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
        </span>
      </div>

      <div className="post-actions">
        <button className={`action-btn ${isLiked ? 'liked' : ''}`} onClick={handleLike}>
          {isLiked ? <FaHeart /> : <FaRegHeart />} Like
        </button>
        <button className="action-btn" onClick={() => setShowComments((v) => !v)}>
          <FaRegComment /> Comment
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          {comments.map((comment) => {
            const cAuthorId = comment.userId?._id || comment.userId;
            const cAuthorName = comment.userId?.username || 'Unknown';
            const cAuthorPic = comment.userId?.profilePicture;
            const isCommentOwner = cAuthorId === user?._id || cAuthorId?.toString() === user?._id;
            return (
              <div key={comment._id} className="comment">
                <div className="comment-avatar">
                  {cAuthorPic ? (
                    <img src={cAuthorPic} alt={cAuthorName} />
                  ) : (
                    <div className="comment-avatar-placeholder">{cAuthorName?.[0]?.toUpperCase()}</div>
                  )}
                </div>
                <div className="comment-body">
                  <Link to={`/profile/${cAuthorId}`} className="comment-author">{cAuthorName}</Link>
                  <p className="comment-text">{comment.text}</p>
                </div>
                {(isCommentOwner || isOwner) && (
                  <button className="comment-delete-btn" onClick={() => handleDeleteComment(comment._id)}>
                    <FaTrash />
                  </button>
                )}
              </div>
            );
          })}

          <form className="add-comment-form" onSubmit={handleComment}>
            <div className="comment-input-avatar">
              {user?.profilePicture ? (
                <img src={user.profilePicture} alt={user.username} />
              ) : (
                <div className="comment-avatar-placeholder">{user?.username?.[0]?.toUpperCase()}</div>
              )}
            </div>
            <input
              type="text"
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <button type="submit" disabled={commentLoading || !commentText.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
