import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    default: 'Karyon College Of Paramedical Science'
  },
  phone: {
    type: String,
    required: true,
    trim: true,
    default: '8989115868'
  },
  email: {
    type: String,
    required: true,
    trim: true,
    default: 'karyoncwa07@gmail.com'
  },
  address: {
    type: String,
    required: true,
    trim: true,
    default: 'Hill side homes, Khajri Ring road, Near new RTO office, Manegaon, Dungariya, Chhindwara, 480001'
  },
  description: {
    type: String,
    required: true,
    trim: true,
    default: 'Karyon College Of Paramedical Science provides excellent facilities. The college offers multiple labs, a well-equipped library, and advanced practical training rooms that create a highly supportive and effective learning environment for students.'
  },
  mission: {
    type: String,
    required: true,
    trim: true,
    default: 'To produce competent paramedical professionals through quality education, hands-on training, and ethical values that contribute to healthcare sector.'
  },
  vision: {
    type: String,
    required: true,
    trim: true,
    default: 'To be a leading institution in paramedical education, recognized for academic excellence, innovative research, and community health services.'
  },
  established: {
    type: Number,
    default: 2020
  }
}, {
  timestamps: true
});

// Check if the model already exists to prevent overwrite error
const Content = mongoose.models.Content || mongoose.model('Content', contentSchema);

export default Content;
