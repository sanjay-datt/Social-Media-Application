import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';
import { FaImage } from 'react-icons/fa';
import './CreatePost.css';

export default function CreatePost({ onPostCreated }) {
  const { user } = useAuth();
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!desc.trim() && !img.trim()) return;
    setLoading(true);
    try {
      const { data } = await API.post('/posts', { desc: desc.trim(), img: img.trim() });
      onPostCreated(data);
      setDesc('');
      setImg('');
      setShowImageInput(false);
      toast.success('Post created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-card">
      <div className="create-post-top">
        <div className="create-avatar">
          {user?.profilePicture ? (
            <img src={user.profilePicture} alt={user.username} />
          ) : (
            <div className="create-avatar-placeholder">{user?.username?.[0]?.toUpperCase()}</div>
          )}
        </div>
        <textarea
          placeholder={`What's on your mind, ${user?.username}?`}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          rows={3}
          maxLength={500}
        />
      </div>

      {showImageInput && (
        <div className="create-post-image-input">
          <input
            type="url"
            placeholder="Paste image URL here..."
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
        </div>
      )}

      <div className="create-post-actions">
        <button
          type="button"
          className="add-image-btn"
          onClick={() => setShowImageInput((v) => !v)}
        >
          <FaImage /> {showImageInput ? 'Remove Image' : 'Add Image URL'}
        </button>
        <button
          className="post-submit-btn"
          onClick={handleSubmit}
          disabled={loading || (!desc.trim() && !img.trim())}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </div>
    </div>
  );
}
