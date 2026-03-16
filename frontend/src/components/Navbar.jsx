import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { FaSearch, FaSignOutAlt } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }
    try {
      const { data } = await API.get(`/users/search/users?q=${encodeURIComponent(val)}`);
      setResults(data);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectUser = (userId) => {
    setQuery('');
    setResults([]);
    setShowResults(false);
    navigate(`/profile/${userId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">SocialApp</Link>
      </div>

      <div className="navbar-center">
        <div className="search-wrap">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={handleSearch}
            onFocus={() => results.length > 0 && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          {showResults && results.length > 0 && (
            <div className="search-dropdown">
              {results.map((u) => (
                <div
                  key={u._id}
                  className="search-result-item"
                  onMouseDown={() => handleSelectUser(u._id)}
                >
                  <div className="search-avatar">
                    {u.profilePicture ? (
                      <img src={u.profilePicture} alt={u.username} />
                    ) : (
                      <div className="search-avatar-placeholder">{u.username?.[0]?.toUpperCase()}</div>
                    )}
                  </div>
                  <span>{u.username}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="navbar-right">
        <Link to={`/profile/${user?._id}`} className="navbar-user">
          <div className="navbar-avatar">
            {user?.profilePicture ? (
              <img src={user.profilePicture} alt={user.username} />
            ) : (
              <div className="navbar-avatar-placeholder">{user?.username?.[0]?.toUpperCase()}</div>
            )}
          </div>
          <span className="navbar-username">{user?.username}</span>
        </Link>
        <button className="logout-btn" onClick={handleLogout} title="Logout">
          <FaSignOutAlt />
        </button>
      </div>
    </nav>
  );
}
