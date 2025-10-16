# **Auth App Portfolio** 📲

A full-stack authentication application built with React (frontend) and Node.js/Express (backend). This project demonstrates modern authentication flows, user profile management, and secure API integration using JWT, cookies, and email confirmation.

---

## **Features** ✨

- User registration with email confirmation
- Login and logout with JWT authentication
- Secure refresh token flow (httpOnly cookies)
- Profile management (change name, email, password)
- Email change with confirmation
- Protected routes and role-based access
- Responsive UI with Tailwind CSS & DaisyUI
- Error handling and user feedback

---

## **Technologies Used** 🛠️

- **Frontend:** React, TypeScript, Tailwind CSS, DaisyUI, Axios
- **Backend:** Node.js, Express, Sequelize, PostgreSQL
- **Authentication:** JWT (access & refresh tokens), httpOnly cookies
- **Email:** Nodemailer (for confirmation and notifications)

---

## **Preview** 🎉

- **[Live Demo](https://auth-app-portfolio.onrender.com)**

---

## **Getting Started** 🚀

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Victoriia-Melnyk/auth_app_portfolio
   cd auth_app_portfolio
   ```
2. **Install dependencies:**
   ```sh
   cd client && npm install
   cd ../server && npm install
   ```
3. **Configure environment variables (if needed):**
   - Copy `.env.example` (if exists) or create `.env` files in both `client/` and `server/`.
   - Set your database, JWT secrets, email credentials, etc.
4. **Run database migrations/setup:**
   ```sh
   cd server
   node setup.js
   ```
5. **Start the development servers:**

   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm start`

   After running this command, the project will automatically open in your default browser.
