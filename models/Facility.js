import mongoose from 'mongoose';

const facilitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  image: {
    type: String,
    required: false,
    trim: true
  },
  description: {
    type: String,
    required: false,
    trim: true
  },
  icon: {
    type: String,
    required: false,
    trim: true,
    default: 'GraduationCap'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  addedDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Check if the model already exists to prevent overwrite error
const Facility = mongoose.models.Facility || mongoose.model('Facility', facilitySchema);

export default Facility;
