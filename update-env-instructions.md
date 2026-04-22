# Update .env File Instructions

## Please update your .env file with the correct cloud name:

**Current (incorrect):**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=karyon
```

**Change to:**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dboftqmhk
```

**Keep the other credentials as they are:**
```
CLOUDINARY_API_KEY=519921417822719
CLOUDINARY_API_SECRET=Q34M1DmfrBuWzV89JT26OLW4LAo
```

## After updating the .env file:
1. Restart the development server (stop and start again)
2. The upload API will now use Cloudinary instead of local storage
3. Images will be uploaded to: https://res.cloudinary.com/dboftqmhk/image/upload/...
4. MongoDB will store Cloudinary URLs instead of local paths

## Test:
1. Go to admin facilities page
2. Upload a new facility image
3. Check that the image URL in MongoDB is a Cloudinary URL
4. Verify the image displays correctly on the frontend
