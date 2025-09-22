# Delish - Google Maps List Paywall SaaS

A lightweight SaaS that lets creators put a paywall in front of their Google Maps List.

## Quick Start

1. **Environment Setup**
   Create a `.env.local` file with the following variables:

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/delish"

   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   STRIPE_CONNECT_CLIENT_ID=ca_...

   # Email
   RESEND_API_KEY=re_...

   # Google Maps (for Hosted Mirror)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...

   # JWT
   JWT_SECRET=your-jwt-secret-key

   # App
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Database Setup**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Features

- **Creator Dashboard**: Manage lists, view analytics, handle payouts
- **Public Landing Pages**: Beautiful list previews with checkout
- **Stripe Integration**: Secure payments with Connect for creator payouts
- **Unlock System**: JWT-based access tokens for purchased content
- **Email Notifications**: Transactional emails for purchases and access
- **Hosted Mirror**: Optional embedded maps for better user experience

## Tech Stack

- **Frontend**: Next.js 14, React Server Components, Tailwind CSS, shadcn/ui
- **Authentication**: Clerk
- **Payments**: Stripe Checkout + Connect
- **Database**: PostgreSQL with Prisma ORM
- **Email**: Resend
- **Maps**: Google Maps Platform
