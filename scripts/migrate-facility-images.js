const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/karyon-college';

async function migrateFacilityImages() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the facilities collection
    const db = mongoose.connection.db;
    const facilitiesCollection = db.collection('facilities');

    // Find all facilities with local image paths
    const facilitiesWithLocalImages = await facilitiesCollection.find({ 
      image: { $regex: '^/uploads/' } 
    }).toArray();
    
    console.log(`Found ${facilitiesWithLocalImages.length} facilities with local image paths`);

    if (facilitiesWithLocalImages.length > 0) {
      // For now, we'll just clear the local image paths
      // Admins will need to re-upload images to Cloudinary
      for (const facility of facilitiesWithLocalImages) {
        await facilitiesCollection.updateOne(
          { _id: facility._id },
          { $set: { image: '' } }
        );
        
        console.log(`Cleared local image path for facility "${facility.name}"`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateFacilityImages();
