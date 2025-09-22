import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize for Netlify deployment
  images: {
    domains: ['images.unsplash.com', 'maps.googleapis.com'],
  },
  // External packages for server components
  serverExternalPackages: ['@prisma/client'],
  // Environment variables that should be available in the browser
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  }
};

export default nextConfig;
