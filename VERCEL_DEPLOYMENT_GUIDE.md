# 🚀 Vercel Deployment Guide - HomePro Platform

This guide explains how to deploy both the **Frontend** and **Backend** to Vercel with **0 errors**.

---

## 🌟 Two Ways to Deploy

You can choose either of the following two deployment methods:

| Method | Recommendation | Description |
| :--- | :--- | :--- |
| **Method 1 (Recommended)** | ⭐️⭐️⭐️⭐️⭐️ | Deploy **Frontend** and **Backend** as two separate projects in Vercel. Easiest to maintain, independent scaling, separate logs. |
| **Method 2 (Unified)** | ⭐️⭐️⭐️⭐️ | Deploy the entire repository as **one single project** using the root `vercel.json`. Everything lives on one domain. |

---

## 🛠️ Method 1: Two Separate Projects (Recommended)

### Step 1: Deploy the Backend API
1. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **"Add New..."** ➔ **"Project"**.
2. Select your GitHub repository (`HomePro`).
3. Under **Project Settings**:
   - **Project Name:** `homepro-backend` (or your preferred name)
   - **Framework Preset:** `Other`
   - **Root Directory:** Click **Edit** and select **`backend`**.
4. In **Environment Variables**, add the following:
   | Key | Value | Example |
   | :--- | :--- | :--- |
   | `MONGO_URI` | Your MongoDB connection string | `mongodb+srv://...` |
   | `JWT_SECRET` | A secure random string | `supersecretkey_12345` |
   | `JWT_EXPIRES_IN` | `30d` | `30d` |
   | `FRONTEND_URL` | Your frontend Vercel URL (add after frontend deploys) | `https://homepro-frontend.vercel.app` |
   | `SMTP_HOST` | SMTP server host | `smtp.gmail.com` |
   | `SMTP_PORT` | SMTP port | `587` |
   | `SMTP_USER` | Gmail address | `your_email@gmail.com` |
   | `SMTP_PASS` | 16-character Google App Password | `xxxx xxxx xxxx xxxx` |
   | `SMTP_FROM` | Sender Name & Email | `HomePro <noreply@yourdomain.com>` |
5. Click **"Deploy"**.
6. Once deployed, copy your Backend URL (e.g. `https://homepro-backend.vercel.app`).

---

### Step 2: Deploy the Frontend
1. In Vercel Dashboard, click **"Add New..."** ➔ **"Project"** again.
2. Select the same GitHub repository.
3. Under **Project Settings**:
   - **Project Name:** `homepro-frontend`
   - **Framework Preset:** **Vite** (will be auto-detected)
   - **Root Directory:** Click **Edit** and select **`frontend`**.
4. In **Environment Variables**, add:
   | Key | Value |
   | :--- | :--- |
   | `VITE_API_URL` | Your deployed backend URL from Step 1 (e.g. `https://homepro-backend.vercel.app`) |
5. Click **"Deploy"**.
6. Once deployed, copy your Frontend URL and update the `FRONTEND_URL` in the backend project's settings!

---

## 📦 Method 2: Single Fullstack Project (Root Deployment)

If you prefer deploying the entire app under a single Vercel domain:
1. In Vercel Dashboard, import the repository.
2. Leave **Root Directory** as **`./` (Root)**.
3. The root `vercel.json` will automatically build:
   - `frontend` with `@vercel/static-build` (Vite)
   - `backend/api/index.ts` with `@vercel/node` (Express Serverless API)
4. Add your Backend environment variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`
5. Click **"Deploy"**.
6. All `/api/*` routes are handled by the backend function, and all page routes (`/`, `/services`, `/auth/*`, `/dashboard/*`) are handled by Vite!

---

## ✅ Pre-Deployment Checklist (Already Verified)

- [x] `frontend/vercel.json` configured with SPA rewrites (`/index.html`) to prevent 404 on page refresh.
- [x] `backend/vercel.json` configured with serverless function routing.
- [x] Root `vercel.json` and `package.json` created for monorepo compatibility.
- [x] Frontend `npx tsc -b` passes with **0 errors**.
- [x] Frontend `npx vite build` generates clean production bundle in `< 2s`.
- [x] Backend `npx tsc --noEmit` passes with **0 errors**.
- [x] MongoDB connection pooling optimized for serverless instances.
- [x] CORS configured to accept production domains.
