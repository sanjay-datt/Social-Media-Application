import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import * as api from '../api';
import './Home.css';

const Home = () => {
  const { userInfo } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFeed = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.getFeed();
      setPosts(data);
    } catch (err) {
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed();
  }, [loadFeed]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await api.likePost(postId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, likes: data.likes } : p
        )
      );
    } catch {}
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Delete this post?')) return;
    try {
      await api.deletePost(postId);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch {}
  };

  const handleComment = async (postId, text) => {
    try {
      const { data: newComment } = await api.addComment(postId, text);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, comments: [...p.comments, newComment] } : p
        )
      );
    } catch {}
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await api.deleteComment(postId, commentId);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? { ...p, comments: p.comments.filter((c) => c._id !== commentId) }
            : p
        )
      );
    } catch {}
  };

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-main">
          <CreatePost onPostCreated={handlePostCreated} />

          {loading && (
            <div className="feed-loading">
              <div className="spinner" />
              <p>Loading feed...</p>
            </div>
          )}

          {error && <div className="feed-error">{error}</div>}

          {!loading && !error && posts.length === 0 && (
            <div className="feed-empty">
              <div className="feed-empty-icon">🌐</div>
              <h3>Your feed is empty</h3>
              <p>Follow some users or create your first post to get started!</p>
            </div>
          )}

          {posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              onComment={handleComment}
              onDeleteComment={handleDeleteComment}
            />
          ))}
        </div>

        <div className="home-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-profile">
              <div className="sidebar-avatar">
                {userInfo?.profilePicture ? (
                  <img src={userInfo.profilePicture} alt={userInfo.username} />
                ) : (
                  <span>{userInfo?.username?.[0]?.toUpperCase()}</span>
                )}
              </div>
              <div>
                <div className="sidebar-username">@{userInfo?.username}</div>
                {userInfo?.fullName && (
                  <div className="sidebar-fullname">{userInfo.fullName}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
