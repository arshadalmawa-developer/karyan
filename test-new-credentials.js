const { v2: cloudinary } = require('cloudinary');
require('dotenv').config({ path: '.env' });

async function testNewCredentials() {
  console.log('=== Testing New Cloudinary Credentials ===');
  console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY);
  console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);
  
  // Configure with the new cloud name
  cloudinary.config({
    cloud_name: 'dboftqmhk',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  
  try {
    // Test ping
    console.log('Testing Cloudinary ping...');
    const pingResult = await cloudinary.api.ping();
    console.log('SUCCESS: Cloudinary ping works!', pingResult);
    
    // Test upload with a simple image
    console.log('Testing image upload...');
    const testImage = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
    const uploadResult = await cloudinary.uploader.upload(testImage, {
      public_id: `test-facility-${Date.now()}`,
      folder: 'facilities'
    });
    
    console.log('SUCCESS: Upload test works!');
    console.log('Cloudinary URL:', uploadResult.secure_url);
    console.log('Public ID:', uploadResult.public_id);
    
    // Clean up
    await cloudinary.uploader.destroy(uploadResult.public_id);
    console.log('Test image cleaned up successfully');
    
    console.log('\n*** Cloudinary is working correctly! ***');
    
  } catch (error) {
    console.error('ERROR: Cloudinary test failed');
    console.error('Error details:', error.message);
  }
}

testNewCredentials();
