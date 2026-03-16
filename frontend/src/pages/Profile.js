import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Post from '../components/Post';
import * as api from '../api';
import './Profile.css';

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { userInfo, updateUserInfo } = useAuth();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ fullName: '', bio: '', profilePicture: '' });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const isOwnProfile = userInfo?._id === id;

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, postsRes] = await Promise.all([
        api.getUserProfile(id),
        api.getUserPosts(id),
      ]);
      setProfile(profileRes.data);
      setPosts(postsRes.data);
      setIsFollowing(
        profileRes.data.followers.some((f) => {
          const fId = f._id || f;
          return fId === userInfo?._id || fId?.toString() === userInfo?._id;
        })
      );
      setEditForm({
        fullName: profileRes.data.fullName || '',
        bio: profileRes.data.bio || '',
        profilePicture: profileRes.data.profilePicture || '',
      });
    } catch {
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, userInfo?._id, navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      await api.followUser(id);
      setIsFollowing((prev) => !prev);
      setProfile((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((f) => (f._id || f) !== userInfo._id)
          : [...prev.followers, { _id: userInfo._id }],
      }));
    } catch {} finally {
      setFollowLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    try {
      const { data } = await api.updateProfile(editForm);
      setProfile((prev) => ({ ...prev, ...data }));
      updateUserInfo(data);
      setEditMode(false);
    } catch (err) {
      setEditError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setEditLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const { data } = await api.likePost(postId);
      setPosts((prev) =>
        prev.map((p) => (p._id === postId ? { ...p, likes: data.likes } : p))
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

  if (loading) {
    return (
      <div className="profile-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar">
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt={profile.username} />
              ) : (
                <span>{profile.username[0].toUpperCase()}</span>
              )}
            </div>
          </div>

          {!editMode ? (
            <div className="profile-info">
              <div className="profile-name-row">
                <h2>@{profile.username}</h2>
                {isOwnProfile ? (
                  <button
                    className="edit-profile-btn"
                    onClick={() => setEditMode(true)}
                  >
                    ✏️ Edit Profile
                  </button>
                ) : (
                  <button
                    className={`follow-btn ${isFollowing ? 'following' : ''}`}
                    onClick={handleFollow}
                    disabled={followLoading}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
                )}
              </div>
              {profile.fullName && (
                <p className="profile-fullname">{profile.fullName}</p>
              )}
              {profile.bio && <p className="profile-bio">{profile.bio}</p>}
              <div className="profile-stats">
                <div className="stat">
                  <span className="stat-value">{posts.length}</span>
                  <span className="stat-label">Posts</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{profile.followers.length}</span>
                  <span className="stat-label">Followers</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{profile.following.length}</span>
                  <span className="stat-label">Following</span>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleEditSubmit} className="edit-profile-form">
              <h3>Edit Profile</h3>
              {editError && <div className="edit-error">{editError}</div>}
              <div className="edit-form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                  maxLength={60}
                  className="edit-input"
                />
              </div>
              <div className="edit-form-group">
                <label>Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  maxLength={200}
                  rows={3}
                  className="edit-textarea"
                />
              </div>
              <div className="edit-form-group">
                <label>Profile Picture URL</label>
                <input
                  type="url"
                  value={editForm.profilePicture}
                  onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                  placeholder="https://example.com/photo.jpg"
                  className="edit-input"
                />
              </div>
              <div className="edit-actions">
                <button
                  type="button"
                  onClick={() => setEditMode(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button type="submit" disabled={editLoading} className="save-btn">
                  {editLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="profile-posts">
          <h3 className="posts-section-title">Posts</h3>
          {posts.length === 0 ? (
            <div className="no-posts">
              <span>📝</span>
              <p>No posts yet</p>
            </div>
          ) : (
            posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                onLike={handleLike}
                onDelete={handleDelete}
                onComment={handleComment}
                onDeleteComment={handleDeleteComment}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
