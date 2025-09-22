# Delish - Netlify Deployment Guide

## Prerequisites

1. **GitHub Repository**: Your code should be pushed to GitHub
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Database**: Set up a PostgreSQL database (recommend Neon, Supabase, or PlanetScale)
4. **External Services**: Set up accounts for Clerk, Stripe, and Resend

## Environment Variables

Set these in your Netlify dashboard under Site Settings > Environment Variables:

```
# Database
DATABASE_URL="postgresql://username:password@host:port/database"

# JWT Secret (generate a random string)
JWT_SECRET="your-jwt-secret-key-here"

# Stripe
STRIPE_SECRET_KEY="sk_live_your_stripe_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"

# Resend (for email)
RESEND_API_KEY="re_your_resend_api_key_here"

# App URL (update this to your Netlify domain)
NEXT_PUBLIC_APP_URL="https://your-app-name.netlify.app"

# Clerk (for authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_your_clerk_publishable_key_here"
CLERK_SECRET_KEY="sk_live_your_clerk_secret_key_here"
```

## Deployment Steps

### 1. Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "New site from Git"
3. Choose "GitHub" and authorize Netlify
4. Select your `amellin794/delish` repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18

### 2. Configure Environment Variables

1. In your Netlify dashboard, go to Site Settings > Environment Variables
2. Add all the environment variables listed above
3. Make sure to use production keys for Stripe and Clerk

### 3. Database Setup

1. Set up a PostgreSQL database (recommend [Neon](https://neon.tech))
2. Get your connection string
3. Add it as `DATABASE_URL` in Netlify environment variables
4. Run database migrations after deployment

### 4. External Services Configuration

#### Clerk Authentication
1. Create a new application in [Clerk Dashboard](https://dashboard.clerk.com)
2. Configure allowed origins to include your Netlify domain
3. Add the keys to Netlify environment variables

#### Stripe Payments
1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your live API keys
3. Set up webhooks pointing to `https://your-app.netlify.app/api/webhooks/stripe`
4. Add keys to Netlify environment variables

#### Resend Email
1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Add to Netlify environment variables

### 5. Deploy

1. Click "Deploy site" in Netlify
2. Wait for the build to complete
3. Your site will be available at `https://your-app-name.netlify.app`

### 6. Post-Deployment

1. **Database Migrations**: Run `npx prisma migrate deploy` in Netlify's build command
2. **Test Authentication**: Verify Clerk sign-in/sign-up works
3. **Test Payments**: Verify Stripe checkout works
4. **Test Email**: Verify email delivery works

## Build Configuration

The project includes:
- `netlify.toml` - Netlify-specific configuration
- `next.config.ts` - Next.js configuration optimized for Netlify
- Proper redirects and headers for Next.js routing

## Troubleshooting

### Common Issues

1. **Build Fails**: Check Node version is 18
2. **API Routes Not Working**: Ensure environment variables are set
3. **Database Connection**: Verify DATABASE_URL is correct
4. **Authentication Issues**: Check Clerk configuration and allowed origins

### Support

- Check Netlify build logs for detailed error messages
- Verify all environment variables are set correctly
- Test locally with production environment variables

## Custom Domain (Optional)

1. In Netlify dashboard, go to Domain Settings
2. Add your custom domain
3. Update `NEXT_PUBLIC_APP_URL` environment variable
4. Update Clerk and Stripe allowed origins
