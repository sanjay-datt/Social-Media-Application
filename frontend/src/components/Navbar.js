import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import './Navbar.css';

const Navbar = () => {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length >= 2) {
      try {
        const { data } = await api.searchUsers(q.trim());
        setSearchResults(data);
        setShowSearch(true);
      } catch {
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const handleUserClick = (userId) => {
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
    navigate(`/profile/${userId}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <span className="brand-icon">📱</span>
          <span className="brand-name">SocialApp</span>
        </Link>
      </div>

      {userInfo && (
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            className="search-input"
          />
          {showSearch && searchResults.length > 0 && (
            <div className="search-dropdown">
              {searchResults.map((user) => (
                <div
                  key={user._id}
                  className="search-result-item"
                  onMouseDown={() => handleUserClick(user._id)}
                >
                  <div className="search-avatar">
                    {user.profilePicture ? (
                      <img src={user.profilePicture} alt={user.username} />
                    ) : (
                      <span>{user.username[0].toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <div className="search-username">@{user.username}</div>
                    {user.fullName && <div className="search-fullname">{user.fullName}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="navbar-links">
        {userInfo ? (
          <>
            <Link to="/" className="nav-link">🏠 Home</Link>
            <Link to={`/profile/${userInfo._id}`} className="nav-link">
              👤 Profile
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="nav-btn">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
