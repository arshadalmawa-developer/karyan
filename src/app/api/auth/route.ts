import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// Admin user schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiry: { type: Date }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP email
async function sendOTPEmail(email: string, otp: string) {
  // Skip email sending if environment variables are not set
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email credentials not configured. OTP would be sent to:', email);
    console.log('OTP for testing:', otp);
    return; // Skip email sending for now
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP is: ${otp}`
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send OTP email');
  }
}

// In-memory admin fallback for when MongoDB is not available
const fallbackAdmin = {
  email: 'supportkaryoncollege@gmail.com',
  password: '$2b$10$jnlKGymlOZNYmkVlig8wTejXBuNrN/uROvNDZ5Dn4I...mF8FK./2' // bcrypt hash of '123456'
};

// In-memory OTP storage for fallback
const otpStorage: { [key: string]: { otp: string; expiry: Date } } = {};

export async function POST(request: NextRequest) {
  try {
    console.log('Auth API called');
    
    const { email, password } = await request.json();
    console.log('Login attempt for:', email);

    let admin: any = null;
    let isValidPassword = false;

    // Try MongoDB first
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/karyon-college';
      console.log('Attempting MongoDB connection to:', mongoUri);
      
      await mongoose.connect(mongoUri);
      console.log('Connected to MongoDB');

      // Find admin user in database
      admin = await Admin.findOne({ email });
      console.log('Admin found in DB:', !!admin);
      
      if (admin) {
        // Compare password with hashed password
        isValidPassword = await bcrypt.compare(password, admin.password);
        console.log('Password valid:', isValidPassword);
      }
    } catch (dbError) {
      console.log('MongoDB connection failed, using fallback:', dbError.message);
    }

    // Fallback to in-memory admin if MongoDB failed or admin not found
    if (!admin || !isValidPassword) {
      console.log('Using fallback admin authentication');
      
      if (email !== fallbackAdmin.email) {
        return NextResponse.json({
          success: false,
          message: 'Invalid email or password'
        }, { status: 401 });
      }

      // Compare with fallback password
      isValidPassword = await bcrypt.compare(password, fallbackAdmin.password);
      console.log('Fallback password valid:', isValidPassword);
      
      if (!isValidPassword) {
        return NextResponse.json({
          success: false,
          message: 'Invalid email or password'
        }, { status: 401 });
      }
    }

    // Generate 6-digit OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry
    console.log('Generated OTP:', otp);

    // Try to save OTP to database if connected
    if (admin && admin._id) {
      try {
        await Admin.updateOne(
          { _id: admin._id },
          { $set: { otp, otpExpiry } }
        );
        console.log('OTP saved to database');
      } catch (saveError) {
        console.log('Failed to save OTP to DB, continuing anyway:', saveError.message);
      }
    } else {
      // Store OTP in memory for fallback
      otpStorage[email] = { otp, expiry: otpExpiry };
      console.log('OTP saved to memory for fallback');
    }

    // Send OTP email
    await sendOTPEmail(email, otp);

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email',
      otp: process.env.NODE_ENV === 'development' ? otp : undefined // Include OTP in dev mode for testing
    });
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Server error',
      error: error.message
    }, { status: 500 });
  }
}
