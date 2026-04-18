import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['BSC', 'BCOM', 'BMLT', 'DMLT', 'Upcoming'],
    default: 'BSC'
  },
  seats: {
    type: Number,
    default: null
  },
  icon: {
    type: String,
    default: 'BookOpen'
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Course', courseSchema);
