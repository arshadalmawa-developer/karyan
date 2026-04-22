const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/karyon-college';

async function migrateCourses() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Get the courses collection
    const db = mongoose.connection.db;
    const coursesCollection = db.collection('courses');

    // Find all courses without a category field
    const coursesWithoutCategory = await coursesCollection.find({ category: { $exists: false } }).toArray();
    
    console.log(`Found ${coursesWithoutCategory.length} courses without category`);

    if (coursesWithoutCategory.length > 0) {
      // Update each course to have a default category
      for (const course of coursesWithoutCategory) {
        // Determine category based on course name or other logic
        let category = 'BSC'; // default
        
        const courseName = course.name ? course.name.toLowerCase() : '';
        
        if (courseName.includes('bcom') || courseName.includes('commerce')) {
          category = 'BCOM';
        } else if (courseName.includes('bmlt') || courseName.includes('medical')) {
          category = 'BMLT';
        } else if (courseName.includes('dmlt') || courseName.includes('diploma')) {
          category = 'DMLT';
        } else if (courseName.includes('upcoming')) {
          category = 'UPCOMING';
        }

        await coursesCollection.updateOne(
          { _id: course._id },
          { $set: { category } }
        );
        
        console.log(`Updated course "${course.name}" with category "${category}"`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
  }
}

migrateCourses();
