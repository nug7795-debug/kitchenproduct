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
- Only verified transactions update order status.
