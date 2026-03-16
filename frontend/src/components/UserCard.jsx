import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FaUserPlus, FaUserMinus } from 'react-icons/fa';
import './UserCard.css';

export default function UserCard({ user: cardUser }) {
  const { user: currentUser } = useAuth();
  const [following, setFollowing] = useState(
    cardUser.followers?.includes(currentUser?._id) ?? false
  );
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (cardUser._id === currentUser?._id) return;
    setLoading(true);
    try {
      await API.put(`/users/${cardUser._id}/follow`);
      setFollowing((prev) => !prev);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Action failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-card">
      <Link to={`/profile/${cardUser._id}`} className="user-card-info">
        <div className="user-card-avatar">
          {cardUser.profilePicture ? (
            <img src={cardUser.profilePicture} alt={cardUser.username} />
          ) : (
            <div className="user-card-avatar-placeholder">
              {cardUser.username?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <span className="user-card-name">{cardUser.username}</span>
      </Link>
      {cardUser._id !== currentUser?._id && (
        <button
          className={`user-card-follow-btn ${following ? 'following' : ''}`}
          onClick={handleFollow}
          disabled={loading}
        >
          {following ? <FaUserMinus /> : <FaUserPlus />}
        </button>
      )}
    </div>
  );
}
