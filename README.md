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
- [VS Code](https://code.visualstudio.com/) *(recommended editor)*

## Running in VS Code

This is the easiest way to get the project running. The repository ships with a ready-made `.vscode/` folder that handles everything for you.

### Step 1 — Install the prerequisites

| Tool | Download | Notes |
|------|----------|-------|
| **Node.js v18+** | https://nodejs.org | Choose the LTS installer |
| **MongoDB Community** | https://www.mongodb.com/try/download/community | Or use [MongoDB Atlas](https://www.mongodb.com/atlas) (free cloud tier) |
| **VS Code** | https://code.visualstudio.com | Any recent version works |

### Step 2 — Open the project in VS Code

```
File → Open Folder → select the Social-Media-Application folder
```

Or from a terminal:

```bash
code Social-Media-Application
```

### Step 3 — Install recommended extensions

VS Code will show a pop-up: **"Do you want to install the recommended extensions?"** — click **Install All**.

If the pop-up doesn't appear, open it manually:
1. Press `Ctrl+Shift+X` (Extensions panel)
2. Type `@recommended` in the search box
3. Install everything listed

Key extensions installed this way:
- **ESLint** & **Prettier** — code quality / formatting
- **MongoDB for VS Code** — browse your database inside VS Code
- **Thunder Client** — test API endpoints without leaving VS Code
- **ES7+ React Snippets** — React shorthand snippets
- **DotENV** — syntax highlighting for `.env` files

### Step 4 — Configure the backend environment

```bash
# In the VS Code integrated terminal (Ctrl+` to open it)
cd backend
cp .env.example .env
```

Then open `backend/.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/socialmedia   # local MongoDB
# MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/socialmedia  # Atlas
JWT_SECRET=replace_this_with_a_long_random_string
```

> **MongoDB Atlas (free cloud DB):** create a free cluster at https://www.mongodb.com/atlas, click **Connect → Drivers**, copy the connection string, and paste it as `MONGO_URI`.

### Step 5 — Install dependencies

Open two terminals in VS Code (`Ctrl+Shift+\``) or run both commands one after the other:

```bash
# Terminal 1 — backend
cd backend && npm install

# Terminal 2 — frontend
cd frontend && npm install
```

### Step 6 — Start the app

**Option A — One-click (recommended)**

1. Press `Ctrl+Shift+P` → type **Tasks: Run Task** → select **Start Full Stack**

This starts both the backend (`http://localhost:5000`) and the frontend (`http://localhost:5173`) in parallel inside VS Code's integrated terminal.

**Option B — Separate terminals**

```bash
# Terminal 1 — backend (auto-restarts on file changes)
cd backend && npm run dev

# Terminal 2 — frontend (hot-reload)
cd frontend && npm run dev
```

### Step 7 — Open the app

Navigate to **http://localhost:5173** in your browser. You should see the SocialApp login screen.

---

### Debugging in VS Code

The `.vscode/launch.json` includes pre-built debug configurations:

| Config | What it does |
|--------|--------------|
| **Debug Backend** | Starts `nodemon` with the Node.js debugger attached — set breakpoints in any backend file |
| **Debug Frontend in Chrome** | Launches Chrome with source maps pointing to your React source files |
| **Full Stack (Backend + Frontend)** | Starts both servers and opens Chrome in one click |

To use them:
1. Press `F5` (or go to **Run → Start Debugging**)
2. Select a configuration from the dropdown at the top of the **Run & Debug** panel (`Ctrl+Shift+D`)
3. Set breakpoints by clicking in the gutter (left of line numbers) in any `.js` / `.jsx` file

---

## Setup & Installation (command-line)

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
