# Cloudinary Setup Instructions

## Current Issue
The Cloudinary credentials are not working:
- Cloud Name: karyon
- API Key: 519921417822719
- Error: "Invalid cloud_name karyon"

## Solution Options

### Option 1: Create a New Cloudinary Account (Recommended)
1. Go to https://cloudinary.com/users/register
2. Sign up for a free account
3. Get your credentials from the dashboard
4. Update the .env file with new credentials

### Option 2: Fix Existing Credentials
1. Check if the cloud name should be different (e.g., karyon-college, karyoncollege)
2. Verify API key and secret are correct
3. Ensure the account is active

### Option 3: Use Temporary Working Credentials
For testing purposes, you can use these steps:

1. **Create Account:**
   ```
   Visit: https://cloudinary.com/users/register
   Email: your-email@example.com
   Password: create a strong password
   ```

2. **Get Credentials:**
   - After signup, go to Dashboard
   - Copy: Cloud name, API Key, API Secret

3. **Update .env:**
   ```env
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key  
   CLOUDINARY_API_SECRET=your-api-secret
   ```

## Current Status
- Upload API is working with local storage fallback
- Images are being uploaded to `/uploads/facilities/`
- MongoDB is storing local URLs correctly
- Frontend will display images from either Cloudinary or local URLs

## Next Steps
1. Set up proper Cloudinary credentials
2. Test Cloudinary upload
3. Verify images display correctly on frontend
