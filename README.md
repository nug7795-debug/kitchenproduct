# KitchenProduct - Premium E-commerce Platform

A modern, multi-device e-commerce platform inspired by Flipkart, built with Next.js, Node.js, and Supabase.

## Project Structure

- `/client`: Customer-facing website (Next.js)
- `/admin`: Admin management dashboard (Next.js)
- `/server`: Backend API server (Node.js/Express)

## Features

- **Responsive Design**: Mobile, tablet, and desktop optimized.
- **Premium Aesthetics**: Modern glassmorphism, smooth animations, and clean layouts.
- **Secure Payments**: UPI payment system with mandatory server-side verification to prevent fraud.
- **Supabase Backend**: Real-time database, authentication, and storage.
- **Admin Dashboard**: Comprehensive management of products, categories, and orders.

## Getting Started

### 1. Prerequisites
- Node.js installed
- Supabase account and project keys

### 2. Backend Setup
```bash
cd server
npm install
# Update .env with your Supabase keys
npm start
```

### 3. Client Setup
```bash
cd client
npm install
# Update .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

### 4. Admin Setup
```bash
cd admin
npm install
# Update .env.local with NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
npm run dev
```

## Security Note (Payment Server)
The payment verification logic is implemented in `server/controllers/paymentController.js`. It ensures that:
- Payment success is NEVER trusted from the frontend.
- Transaction amount is verified against the order amount.
- Duplicate transaction IDs are rejected.

## Deployment

This project is configured for automatic deployment.

### 1. Frontend (Client & Admin) - Vercel
- Connect your GitHub repository to [Vercel](https://vercel.com).
- Create two separate projects on Vercel:
  - **Client**: Set the "Root Directory" to `client`.
  - **Admin**: Set the "Root Directory" to `admin`.
- Vercel will automatically detect the `vercel.json` files and handle deployments on every push to `main`.

### 2. Backend (Server) - Railway
- Connect your repository to [Railway](https://railway.app).
- Railway will detect the `server/railway.json` and deploy the backend automatically.

### 3. GitHub Actions
A `.github/workflows/deploy.yml` file is provided to validate builds on every push. To enable full deployment via GitHub Actions, add the following secrets to your GitHub repository settings:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID_CLIENT`
- `VERCEL_PROJECT_ID_ADMIN`
- `RAILWAY_TOKEN`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
