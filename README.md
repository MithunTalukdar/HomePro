# 🏡 HomePro - Premium Home Service Platform

HomePro is a comprehensive, modern, and premium home service and electrician booking platform. It connects customers with top-rated professionals for services like electrical repairs, plumbing, HVAC, cleaning, and more.

## ✨ Features

- **For Customers:** 
  - Browse a wide variety of home services.
  - Seamless booking and scheduling flow.
  - Secure authentication and profile management.
  - Track booking statuses in real-time.
- **For Technicians:** 
  - Dedicated dashboard to view, accept, and manage active jobs.
  - Performance tracking and earnings overview.
- **Admin Panel:**
  - Complete control over services, users, technicians, and bookings.
  - Review and coupon management.
- **Premium UI/UX:** 
  - Modern dark-themed design with smooth glassmorphism effects.
  - Fully responsive and interactive interface.

## 🛠️ Technology Stack

- **Frontend:** React, TypeScript, Vite, React Router, Framer Motion, Lucide Icons, CSS (Custom Design System).
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT Authentication.
- **Payments:** Razorpay Integration.

## 📁 Project Structure

```
project-root/
├── frontend/          # React + Vite SPA
│   ├── src/           # Components, pages, hooks, context, services
│   ├── public/        # Static assets (favicon, images, videos)
│   ├── package.json
│   ├── vite.config.ts
│   ├── vercel.json    # SPA rewrites (React Router)
│   └── .env.example
├── backend/           # Express + MongoDB API
│   ├── src/
│   │   ├── config/        # DB connection
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── socket/
│   │   └── utils/
│   ├── api/index.ts   # Vercel serverless entry
│   ├── package.json
│   ├── vercel.json    # API rewrites
│   └── .env.example
├── README.md
└── .gitignore
```

## 🚀 Getting Started

### 1. Setup the Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill MONGO_URI, JWT_SECRET, SMTP_*, FRONTEND_URL
npm run dev            # ts-node-dev on http://localhost:5000
# Production: npm run build && npm start
```

Required `backend/.env` (see `backend/.env.example`):
```
PORT=5000
MONGO_URI=mongodb+srv://...
JWT_SECRET=
JWT_EXPIRES_IN=30d
FRONTEND_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
```

### 2. Setup the Frontend

```bash
cd frontend
npm install
cp .env.example .env   # set VITE_API_URL
npm run dev            # vite on http://localhost:5173 (proxies /api to :5000)
npm run build          # production build to frontend/dist
```

`frontend/.env`:
```
VITE_API_URL=http://localhost:5000          # local
# VITE_API_URL=https://your-backend.vercel.app  # production
```

### 3. Vercel Deployment

Deploy as **two separate Vercel projects**:

| Project | Root Directory | Framework | Build Command | Output |
|---------|---------------|-----------|---------------|--------|
| frontend | `frontend` | Vite | `npm run build` | `dist` |
| backend  | `backend`  | Other | `echo 'no build'` (serverless) | - |

- Set `VITE_API_URL` in frontend Vercel env to backend URL.
- Set `FRONTEND_URL`/`CLIENT_URL` + all `MONGO_*`/`JWT_*`/`SMTP_*` in backend Vercel env.

The frontend will be running at `http://localhost:5173`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check issues page if you want to contribute.

## 📄 License

This project is licensed under the MIT License.
