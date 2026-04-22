const { v2: cloudinary } = require('cloudinary');
require('dotenv').config({ path: '.env' });

async function testCloudinaryAuth() {
  console.log('Testing Cloudinary authentication...');
  console.log('Environment variables:');
  console.log('Cloud Name:', process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
  console.log('API Key:', process.env.CLOUDINARY_API_KEY);
  console.log('API Secret exists:', !!process.env.CLOUDINARY_API_SECRET);
  
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });
  
  try {
    // Test with a simple API call
    const result = await cloudinary.api.resources({ max_results: 1 });
    console.log('SUCCESS: Cloudinary authentication works!');
    console.log('Resources found:', result.resources.length);
  } catch (error) {
    console.error('ERROR: Cloudinary authentication failed');
    console.error('Error details:', error.message);
    
    // Try to test if the cloud name exists by trying different formats
    console.log('\nTrying alternative cloud name formats...');
    
    const alternatives = [
      'karyon',
      'karyon-college', 
      'karyoncollege',
      'karyon-sparkle'
    ];
    
    for (const altCloudName of alternatives) {
      try {
        cloudinary.config({
          cloud_name: altCloudName,
          api_key: process.env.CLOUDINARY_API_KEY,
          api_secret: process.env.CLOUDINARY_API_SECRET,
          secure: true
        });
        
        await cloudinary.api.resources({ max_results: 1 });
        console.log(`SUCCESS: Cloud name "${altCloudName}" works!`);
        console.log(`Please update your .env file to use: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=${altCloudName}`);
        break;
      } catch (altError) {
        console.log(`Failed with cloud name "${altCloudName}": ${altError.message}`);
      }
    }
  }
}

testCloudinaryAuth();
