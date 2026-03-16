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

> **Not sure where to get these values?** See [Getting Your Environment Variables](#getting-your-environment-variables) below for step-by-step instructions for both local MongoDB and free MongoDB Atlas, plus how to generate a secure JWT secret.

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

## Getting Your Environment Variables

Before you can start the backend you need two values: a **MongoDB connection string** (`MONGO_URI`) and a **JWT secret** (`JWT_SECRET`). Here is exactly where each one comes from.

---

### MONGO_URI

You have two options — pick whichever suits you:

#### Option A — Local MongoDB (no account needed)

1. Download and install [MongoDB Community Server](https://www.mongodb.com/try/download/community).
2. Start the MongoDB service:
   - **Windows:** it starts automatically as a Windows Service after install, or run `net start MongoDB` in an admin terminal.
   - **macOS (Homebrew):** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`
3. Use this connection string as-is — no changes needed:
   ```env
   MONGO_URI=mongodb://localhost:27017/socialmedia
   ```
   MongoDB will create the `socialmedia` database automatically the first time data is written.

#### Option B — MongoDB Atlas (free cloud database, recommended for beginners)

No local install required. The free tier (M0) is permanently free.

1. Go to **https://www.mongodb.com/atlas** and sign up (free).
2. Click **"Build a Database"** → choose **M0 Free** → pick any cloud region → click **"Create"**.
3. **Create a database user:**
   - In the left menu go to **Security → Database Access**.
   - Click **"Add New Database User"**.
   - Choose **Password** authentication, enter a username and a strong password, set the role to **"Atlas admin"**, and click **"Add User"**.
   - ⚠️ Remember this username and password — you will need them in the connection string.
4. **Allow your IP address:**
   - Go to **Security → Network Access**.
   - Click **"Add IP Address"** → click **"Allow Access From Anywhere"** (adds `0.0.0.0/0`) → **Confirm**.
   - *(For a production app you would restrict this to specific IPs, but for local development "anywhere" is fine.)*
5. **Copy your connection string:**
   - Go to **Deployments → Database**.
   - Click **"Connect"** on your cluster → choose **"Drivers"**.
   - Select **Driver: Node.js**, copy the connection string. It looks like:
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
6. **Edit the string** — replace `<username>` and `<password>` with the database user credentials from step 3, and add the database name (`socialmedia`) before the `?`:
   ```env
   MONGO_URI=mongodb+srv://john:mypassword@cluster0.xxxxx.mongodb.net/socialmedia?retryWrites=true&w=majority
   ```

---

### JWT_SECRET

This is **not** a password you create on any website. It is simply a long random string that only your server knows. It is used to sign authentication tokens so they can't be forged.

**Generate one now** by running this single command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

It will print something like:

```
a3f8c2e1b47d9f0a6e5c3d2b1a8f7e4c6d5b3a2e1f0c9d8b7a6e5f4d3c2b1a0...
```

Copy the entire output and paste it as `JWT_SECRET` in your `.env` file.

> **Rules:**
> - Use at least 32 characters (the command above gives you 128 hex characters — more than enough).
> - Keep it private — never share it or commit it to Git.
> - If you change it, all existing login sessions will be invalidated (users will need to log in again).

---

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
