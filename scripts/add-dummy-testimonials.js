const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/karyon-college';

// Import Testimonial model
const Testimonial = require('../models/Testimonial.js');

// Dummy testimonials data
const dummyTestimonials = [
  {
    name: "Rahul Kumar",
    course: "BCA - Bachelor of Computer Applications",
    year: "2 year",
    text: "The faculty here is excellent and very supportive. They always help us with our doubts and provide practical knowledge that helps in our careers.",
    rating: 5,
    avatar: "rahul",
    status: "Active"
  },
  {
    name: "Priya Sharma",
    course: "BCom - Bachelor of Commerce",
    year: "3 year",
    text: "Great learning environment with modern facilities. The commerce department provides excellent exposure to practical business scenarios.",
    rating: 4,
    avatar: "priya",
    status: "Active"
  },
  {
    name: "Amit Patel",
    course: "BSC - Bachelor of Science",
    year: "1 year",
    text: "The science labs are well-equipped and the professors are very knowledgeable. I especially appreciate the hands-on training sessions.",
    rating: 5,
    avatar: "amit",
    status: "Active"
  },
  {
    name: "Sneha Reddy",
    course: "BMLT - Bachelor of Medical Laboratory Technology",
    year: "2 year",
    text: "The medical laboratory training is comprehensive. The college provides excellent internship opportunities in reputed hospitals.",
    rating: 4,
    avatar: "sneha",
    status: "Active"
  },
  {
    name: "Vikram Singh",
    course: "DMLT - Diploma in Medical Laboratory Technology",
    year: "1 year",
    text: "Good practical training with modern equipment. The diploma program is well-structured and industry-relevant.",
    rating: 3,
    avatar: "vikram",
    status: "Active"
  },
  {
    name: "Neha Gupta",
    course: "BCA - Bachelor of Computer Applications",
    year: "3 year",
    text: "Excellent computer lab facilities and experienced faculty. The curriculum is updated regularly to match industry requirements.",
    rating: 5,
    avatar: "neha",
    status: "Active"
  },
  {
    name: "Rohit Verma",
    course: "BCom - Bachelor of Commerce",
    year: "2 year",
    text: "The commerce faculty provides real-world business insights. Regular guest lectures from industry experts are very helpful.",
    rating: 4,
    avatar: "rohit",
    status: "Active"
  },
  {
    name: "Anjali Mehta",
    course: "BSC - Bachelor of Science",
    year: "1 year",
    text: "Great research opportunities and supportive faculty. The science department encourages innovation and practical learning.",
    rating: 5,
    avatar: "anjali",
    status: "Active"
  },
  {
    name: "Karan Thakur",
    course: "BMLT - Bachelor of Medical Laboratory Technology",
    year: "3 year",
    text: "Excellent clinical training and hospital attachments. The college has tie-ups with major healthcare institutions.",
    rating: 4,
    avatar: "karan",
    status: "Active"
  }
];

async function addDummyTestimonials() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing testimonials (optional - remove if you want to keep existing)
    // await Testimonial.deleteMany({});
    // console.log('Cleared existing testimonials');

    console.log(`Adding ${dummyTestimonials.length} dummy testimonials...`);

    for (const testimonial of dummyTestimonials) {
      const newTestimonial = await Testimonial.create(testimonial);
      console.log(`Added testimonial for: ${testimonial.name} - ${testimonial.course}`);
    }

    console.log('Successfully added all dummy testimonials!');
    
    // Display added testimonials
    const allTestimonials = await Testimonial.find({}).sort({ createdAt: -1 });
    console.log('\nCurrent testimonials in database:');
    allTestimonials.forEach((t, index) => {
      console.log(`${index + 1}. ${t.name} (${t.course}) - ${t.rating} stars`);
    });

  } catch (error) {
    console.error('Error adding dummy testimonials:', error);
  } finally {
    await mongoose.disconnect();
  }
}

addDummyTestimonials();
