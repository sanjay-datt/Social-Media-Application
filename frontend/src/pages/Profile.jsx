import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import Post from '../components/Post';
import toast from 'react-hot-toast';
import { FaMapMarkerAlt, FaCity, FaEdit, FaUserPlus, FaUserMinus } from 'react-icons/fa';
import './Profile.css';

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', city: '', from: '', profilePicture: '', coverPicture: '' });

  const isOwner = currentUser?._id === id;

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const [userRes, postsRes] = await Promise.all([
        API.get(`/users/${id}`),
        API.get(`/posts/user/${id}`),
      ]);
      setProfileUser(userRes.data);
      setPosts(postsRes.data);
      setIsFollowing(userRes.data.followers?.includes(currentUser?._id));
      setEditForm({
        bio: userRes.data.bio || '',
        city: userRes.data.city || '',
        from: userRes.data.from || '',
        profilePicture: userRes.data.profilePicture || '',
        coverPicture: userRes.data.coverPicture || '',
      });
    } catch (err) {
      toast.error('Failed to load profile');
      navigate('/');
    } finally {
      setLoading(false);
    }
  }, [id, currentUser?._id, navigate]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleFollow = async () => {
    setFollowLoading(true);
    try {
      await API.put(`/users/${id}/follow`);
      setIsFollowing((prev) => !prev);
      setProfileUser((prev) => ({
        ...prev,
        followers: isFollowing
          ? prev.followers.filter((fId) => fId !== currentUser._id)
          : [...prev.followers, currentUser._id],
      }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.put(`/users/${id}`, editForm);
      setProfileUser(data);
      updateUser(data);
      toast.success('Profile updated!');
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  const handlePostDeleted = (postId) => setPosts((prev) => prev.filter((p) => p._id !== postId));
  const handlePostUpdated = (updated) => setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  if (loading) return <><Navbar /><div className="loading-spinner" style={{ textAlign: 'center', padding: '80px' }}>Loading profile...</div></>;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-cover">
          {profileUser?.coverPicture ? (
            <img src={profileUser.coverPicture} alt="Cover" />
          ) : (
            <div className="cover-placeholder" />
          )}
        </div>

        <div className="profile-header-card">
          <div className="profile-avatar-wrap">
            {profileUser?.profilePicture ? (
              <img src={profileUser.profilePicture} alt={profileUser.username} className="profile-avatar" />
            ) : (
              <div className="profile-avatar avatar-placeholder">
                {profileUser?.username?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="profile-info">
            <h2>{profileUser?.username}</h2>
            {profileUser?.bio && <p className="profile-bio-text">{profileUser.bio}</p>}
            <div className="profile-meta">
              {profileUser?.city && <span><FaCity /> {profileUser.city}</span>}
              {profileUser?.from && <span><FaMapMarkerAlt /> From {profileUser.from}</span>}
            </div>
            <div className="profile-counts">
              <span><strong>{profileUser?.followers?.length ?? 0}</strong> Followers</span>
              <span><strong>{profileUser?.following?.length ?? 0}</strong> Following</span>
            </div>
          </div>
          <div className="profile-actions">
            {isOwner ? (
              <button className="btn-edit" onClick={() => setEditMode(true)}>
                <FaEdit /> Edit Profile
              </button>
            ) : (
              <button
                className={isFollowing ? 'btn-unfollow' : 'btn-follow'}
                onClick={handleFollow}
                disabled={followLoading}
              >
                {isFollowing ? <><FaUserMinus /> Unfollow</> : <><FaUserPlus /> Follow</>}
              </button>
            )}
          </div>
        </div>

        {editMode && (
          <div className="edit-modal-overlay" onClick={() => setEditMode(false)}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <h3>Edit Profile</h3>
              <form onSubmit={handleEditSubmit}>
                <label>Bio</label>
                <textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
                <label>City</label>
                <input
                  type="text"
                  value={editForm.city}
                  onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                  placeholder="City"
                />
                <label>From</label>
                <input
                  type="text"
                  value={editForm.from}
                  onChange={(e) => setEditForm({ ...editForm, from: e.target.value })}
                  placeholder="Hometown"
                />
                <label>Profile Picture URL</label>
                <input
                  type="url"
                  value={editForm.profilePicture}
                  onChange={(e) => setEditForm({ ...editForm, profilePicture: e.target.value })}
                  placeholder="https://..."
                />
                <label>Cover Picture URL</label>
                <input
                  type="url"
                  value={editForm.coverPicture}
                  onChange={(e) => setEditForm({ ...editForm, coverPicture: e.target.value })}
                  placeholder="https://..."
                />
                <div className="edit-modal-actions">
                  <button type="submit" className="btn-primary">Save Changes</button>
                  <button type="button" className="btn-cancel" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="profile-posts-section">
          <h3>Posts</h3>
          {posts.length === 0 ? (
            <div className="empty-feed">No posts yet.</div>
          ) : (
            <div className="profile-posts-grid">
              {posts.map((post) => (
                <Post key={post._id} post={post} onDelete={handlePostDeleted} onUpdate={handlePostUpdated} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
