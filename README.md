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

## 🚀 Getting Started

Follow these steps to run the project locally.

### 1. Setup the Backend

Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with your MongoDB URI and JWT configurations:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
```

Start the backend development server:
```bash
npm run dev
```

### 2. Setup the Frontend

Open a new terminal window in the root directory of the project and install dependencies:
```bash
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The frontend will be running at `http://localhost:5173`.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome. Feel free to check issues page if you want to contribute.

## 📄 License

This project is licensed under the MIT License.
