import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import Navbar from '../components/Navbar';
import CreatePost from '../components/CreatePost';
import Post from '../components/Post';
import UserCard from '../components/UserCard';
import { FaMapMarkerAlt, FaCity } from 'react-icons/fa';
import './Home.css';

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = useCallback(async () => {
    try {
      const { data } = await API.get('/posts/timeline');
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const { data } = await API.get('/users/search/users?q=a');
        const filtered = data.filter((u) => u._id !== user?._id);
        setSuggestions(filtered.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchSuggestions();
  }, [user]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (postId) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  const handlePostUpdated = (updatedPost) => {
    setPosts((prev) => prev.map((p) => (p._id === updatedPost._id ? updatedPost : p)));
  };

  return (
    <>
      <Navbar />
      <div className="home-layout">
        {/* Left Sidebar */}
        <aside className="sidebar sidebar-left">
          <div className="profile-card">
            <Link to={`/profile/${user?._id}`}>
              <div className="profile-card-avatar">
                {user?.profilePicture ? (
                  <img src={user.profilePicture} alt={user.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.username?.[0]?.toUpperCase()}
                  </div>
                )}
              </div>
              <h3>{user?.username}</h3>
            </Link>
            {user?.bio && <p className="profile-bio">{user.bio}</p>}
            <div className="profile-location">
              {user?.city && (
                <span><FaCity /> {user.city}</span>
              )}
              {user?.from && (
                <span><FaMapMarkerAlt /> {user.from}</span>
              )}
            </div>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-num">{user?.followers?.length ?? 0}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-num">{user?.following?.length ?? 0}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Feed */}
        <main className="feed">
          <CreatePost onPostCreated={handlePostCreated} />
          {loading ? (
            <div className="loading-spinner">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="empty-feed">
              <p>No posts yet. Follow people or create your first post!</p>
            </div>
          ) : (
            posts.map((post) => (
              <Post
                key={post._id}
                post={post}
                onDelete={handlePostDeleted}
                onUpdate={handlePostUpdated}
              />
            ))
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="sidebar sidebar-right">
          <div className="suggestions-card">
            <h4>People You May Know</h4>
            {suggestions.length === 0 ? (
              <p className="no-suggestions">No suggestions at the moment.</p>
            ) : (
              suggestions.map((suggestedUser) => (
                <UserCard key={suggestedUser._id} user={suggestedUser} />
              ))
            )}
          </div>
        </aside>
      </div>
    </>
  );
}
