# Modern Full-Stack Blog Platform

A premium, dynamic blogging platform built with React, Node.js, Express, and PostgreSQL.

## Live Demo
🌍 **[View Live Website](https://blog-plat-form-two.vercel.app)**

## Features
- 🔐 **Secure Authentication**: Full JWT-based user registration and login flow.
- 📝 **Post Management (CRUD)**: Authenticated users can write, edit, and delete their own blog posts.
- 💬 **Interactive Comments**: Users can engage with content by leaving comments on posts.
- 🎨 **Dynamic Premium UI**: Custom dark-mode theme utilizing modern typography (`Inter`), subtle micro-animations, and glassmorphism elements, styled purely with Vanilla CSS.

## Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js & Express
- **Database**: PostgreSQL
- **ORM**: Prisma

## Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sai892-dev/blog-plat-form.git
   cd blog-plat-form
   ```

2. **Set up the Database & Backend:**
   Navigate into the `backend` folder, install dependencies, and configure your `.env` file:
   ```bash
   cd backend
   npm install
   # Ensure you have a PostgreSQL database running and update DATABASE_URL in .env
   npx prisma db push
   npm start
   ```

3. **Set up the Frontend:**
   In a new terminal, navigate to the `frontend` folder:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The site will be available at `http://localhost:5173`.
