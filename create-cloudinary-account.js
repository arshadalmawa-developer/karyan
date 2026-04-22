console.log(`
=== Cloudinary Setup Guide ===

The provided credentials are not working. Here's how to fix this:

STEP 1: Create a Cloudinary Account
1. Go to: https://cloudinary.com/users/register
2. Fill out the registration form
3. Verify your email

STEP 2: Get Your Credentials
1. After login, go to Dashboard
2. You'll see:
   - Cloud name (e.g., "abc123xyz")
   - API Key (e.g., "123456789012345")
   - API Secret (click to reveal)

STEP 3: Update Your .env File
Replace the current credentials with your new ones:

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

STEP 4: Test the Integration
The system will automatically start using Cloudinary once valid credentials are provided.

Current Status:
- Upload API is ready for Cloudinary
- Fallback to local storage is working
- Frontend is ready to display Cloudinary URLs

Alternative: If you have existing Cloudinary credentials, please double-check:
1. Cloud name spelling
2. API key is correct
3. API secret is correct (no extra spaces)
4. Account is active and not suspended
`);
