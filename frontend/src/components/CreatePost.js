import React, { useState } from 'react';
import * as api from '../api';
import './CreatePost.css';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !imageUrl.trim()) {
      setError('Please add some content or an image URL');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await api.createPost({
        content: content.trim(),
        image: imageUrl.trim(),
      });
      setContent('');
      setImageUrl('');
      setShowImageInput(false);
      onPostCreated(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post">
      <form onSubmit={handleSubmit}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="create-post-textarea"
          rows={3}
          maxLength={2000}
        />

        {showImageInput && (
          <input
            type="url"
            placeholder="Paste image URL here..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="image-url-input"
          />
        )}

        {error && <p className="create-post-error">{error}</p>}

        <div className="create-post-footer">
          <button
            type="button"
            className={`add-image-btn ${showImageInput ? 'active' : ''}`}
            onClick={() => setShowImageInput(!showImageInput)}
          >
            🖼️ {showImageInput ? 'Remove Image' : 'Add Image'}
          </button>
          <div className="char-count">
            {content.length}/2000
          </div>
          <button
            type="submit"
            disabled={loading || (!content.trim() && !imageUrl.trim())}
            className="post-submit-btn"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
