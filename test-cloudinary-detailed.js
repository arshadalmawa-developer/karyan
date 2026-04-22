const { v2: cloudinary } = require('cloudinary');
require('dotenv').config({ path: '.env' });

async function testCloudinaryDetailed() {
  console.log('=== Detailed Cloudinary Test ===');
  console.log('Environment variables:');
  console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY);
  console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);
  console.log('API Secret length:', process.env.CLOUDINARY_API_SECRET?.length);
  
  // Test different cloud name formats
  const cloudNames = [
    'karyon',
    'karyon-college',
    'karyoncollege',
    'karyon-sparkle',
    'karyonsparkle'
  ];
  
  for (const cloudName of cloudNames) {
    console.log(`\n--- Testing cloud name: ${cloudName} ---`);
    
    try {
      cloudinary.config({
        cloud_name: cloudName,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true
      });
      
      // Test with a simple ping
      const result = await cloudinary.api.ping();
      console.log(`SUCCESS: ${cloudName} works!`);
      console.log('Ping result:', result);
      
      // Test upload with a simple image
      const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
      const uploadResult = await cloudinary.uploader.upload(testImage, {
        public_id: `test-${Date.now()}`,
        folder: 'test-facilities'
      });
      
      console.log('Upload test successful:', uploadResult.secure_url);
      
      // Clean up
      await cloudinary.uploader.destroy(uploadResult.public_id);
      console.log('Test image cleaned up');
      
      console.log(`\n*** SOLUTION: Use cloud name "${cloudName}" ***`);
      console.log(`Update your .env file to: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${cloudName}`);
      break;
      
    } catch (error) {
      console.log(`FAILED: ${cloudName} - ${error.message}`);
    }
  }
}

testCloudinaryDetailed().catch(console.error);
