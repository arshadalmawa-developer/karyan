import mongoose from 'mongoose';

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: String,
    required: true,
    trim: true
  },
  seats: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['BSC', 'BCOM', 'BMLT', 'DMLT', 'UPCOMING'],
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.models.Course || mongoose.model('Course', CourseSchema);
