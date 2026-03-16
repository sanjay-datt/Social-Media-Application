import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Auth
export const register = (data) => api.post('/auth/register', data);
export const login = (data) => api.post('/auth/login', data);

// Users
export const getUserProfile = (id) => api.get(`/users/${id}`);
export const updateProfile = (data) => api.put('/users/profile', data);
export const followUser = (id) => api.post(`/users/${id}/follow`);
export const searchUsers = (query) => api.get(`/users/search/${query}`);

// Posts
export const getFeed = () => api.get('/posts/feed');
export const getUserPosts = (userId) => api.get(`/posts/user/${userId}`);
export const getPost = (id) => api.get(`/posts/${id}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (id, data) => api.put(`/posts/${id}`, data);
export const deletePost = (id) => api.delete(`/posts/${id}`);
export const likePost = (id) => api.post(`/posts/${id}/like`);
export const addComment = (id, text) => api.post(`/posts/${id}/comment`, { text });
export const deleteComment = (postId, commentId) =>
  api.delete(`/posts/${postId}/comment/${commentId}`);

export default api;
