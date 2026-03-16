# Social Media Application

A full-stack **MERN** (MongoDB, Express, React, Node.js) social media application with features including user authentication, posts, comments, likes, and follow/unfollow functionality.

## Features

- 🔐 **Authentication** – Register & login with JWT-based sessions
- 👤 **User Profiles** – View and edit profile (name, bio, avatar URL)
- 📝 **Posts** – Create, view, and delete text or image posts
- ❤️ **Likes** – Like and unlike posts
- 💬 **Comments** – Add and delete comments on posts
- 👥 **Follow / Unfollow** – Follow other users; home feed shows followed-user posts
- 🔍 **Search** – Search for users by username or name

## Tech Stack

| Layer     | Technology                      |
|-----------|----------------------------------|
| Frontend  | React 19, React Router 6, Axios |
| Backend   | Node.js, Express.js             |
| Database  | MongoDB + Mongoose              |
| Auth      | JWT + bcryptjs                  |
| Styling   | Plain CSS (no external UI lib)  |

## Project Structure

```
├── backend/              # Express REST API
│   ├── config/           # Database connection
│   ├── middleware/        # JWT auth middleware
│   ├── models/           # Mongoose models (User, Post)
│   ├── routes/           # API route handlers
│   └── server.js         # Entry point
│
└── frontend/             # React SPA
    └── src/
        ├── api/          # Axios API layer
        ├── components/   # Reusable components (Navbar, Post, CreatePost)
        ├── context/      # React Context (AuthContext)
        └── pages/        # Page components (Home, Login, Register, Profile)
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env          # Edit MONGO_URI and JWT_SECRET
npm run dev                   # Starts on http://localhost:5000
```

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env          # Set REACT_APP_API_URL if needed
npm start                     # Starts on http://localhost:3000
```

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## API Endpoints

### Auth
| Method | Endpoint              | Description        |
|--------|-----------------------|--------------------|
| POST   | `/api/auth/register`  | Register new user  |
| POST   | `/api/auth/login`     | Login user         |

### Users *(protected)*
| Method | Endpoint                  | Description               |
|--------|---------------------------|---------------------------|
| GET    | `/api/users/:id`          | Get user profile          |
| PUT    | `/api/users/profile`      | Update own profile        |
| POST   | `/api/users/:id/follow`   | Follow / unfollow a user  |
| GET    | `/api/users/search/:q`    | Search users              |

### Posts *(protected)*
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| GET    | `/api/posts/feed`                 | Get home feed            |
| GET    | `/api/posts/user/:userId`         | Get user's posts         |
| POST   | `/api/posts`                      | Create a post            |
| DELETE | `/api/posts/:id`                  | Delete a post            |
| POST   | `/api/posts/:id/like`             | Like / unlike a post     |
| POST   | `/api/posts/:id/comment`          | Add a comment            |
| DELETE | `/api/posts/:id/comment/:cId`     | Delete a comment         |
