# SocialApp — MERN Stack Social Media Application

A full-stack social media application built with **MongoDB**, **Express**, **React** (Vite), and **Node.js**.

## Features

- 🔐 JWT-based authentication (register / login)
- 📰 Timeline feed (own posts + posts from followed users)
- ❤️ Like / Unlike posts
- 💬 Comments on posts
- 👥 Follow / Unfollow users
- 🔍 Search users by username
- 👤 User profiles with cover photo, bio, city, hometown
- ✏️ Edit your own profile
- 🗑️ Delete your own posts and comments

## Project Structure

```
Social-Media-Application/
├── backend/               # Node.js / Express API
│   ├── config/db.js       # MongoDB connection
│   ├── middleware/auth.js  # JWT auth middleware
│   ├── models/            # Mongoose models (User, Post)
│   ├── routes/            # Express routes (auth, users, posts)
│   ├── uploads/           # Uploaded files (static)
│   ├── server.js          # Entry point
│   └── .env.example       # Environment variable template
└── frontend/              # React (Vite) app
    └── src/
        ├── api/axios.js        # Axios instance with auth interceptor
        ├── context/AuthContext.jsx
        ├── pages/              # Login, Register, Home, Profile
        └── components/         # Navbar, Post, CreatePost, UserCard
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local or Atlas)

## Setup & Installation

### 1. Clone the repository

```bash
git clone <repo-url>
cd Social-Media-Application
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

The backend runs on **http://localhost:5000**.

### 3. Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on **http://localhost:5173**.

## Environment Variables

Create `backend/.env` (copy from `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialmedia
JWT_SECRET=your_super_secret_jwt_key
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |

### Users
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/users/:id` | No | Get user profile |
| PUT | `/api/users/:id` | Yes | Update own profile |
| PUT | `/api/users/:id/follow` | Yes | Follow/unfollow user |
| GET | `/api/users/:id/followers` | No | Get followers list |
| GET | `/api/users/:id/following` | No | Get following list |
| GET | `/api/users/search/users?q=` | No | Search users |

### Posts
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/posts` | Yes | Create post |
| GET | `/api/posts/timeline` | Yes | Get timeline feed |
| GET | `/api/posts/user/:userId` | Yes | Get user's posts |
| GET | `/api/posts/:id` | Yes | Get single post |
| PUT | `/api/posts/:id` | Yes | Update post |
| DELETE | `/api/posts/:id` | Yes | Delete post |
| PUT | `/api/posts/:id/like` | Yes | Like/unlike post |
| POST | `/api/posts/:id/comment` | Yes | Add comment |
| DELETE | `/api/posts/:postId/comment/:commentId` | Yes | Delete comment |

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, CORS, dotenv, Multer

**Frontend:** React 18, Vite, React Router v6, Axios, React Hot Toast, React Icons
