import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Admin user schema
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String },
  otpExpiry: { type: Date }
});

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export async function POST(request: NextRequest) {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/karyon-college');
    
    const { email, otp } = await request.json();

    // Find admin user in database
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return NextResponse.json({
        success: false,
        message: 'Invalid email or OTP'
      }, { status: 401 });
    }

    // Check if OTP exists and is valid
    if (!admin.otp || admin.otp !== otp) {
      return NextResponse.json({
        success: false,
        message: 'Invalid OTP'
      }, { status: 401 });
    }

    // Check if OTP has expired
    if (!admin.otpExpiry || new Date() > admin.otpExpiry) {
      return NextResponse.json({
        success: false,
        message: 'OTP has expired'
      }, { status: 401 });
    }

    // Clear OTP and expiry fields
    await Admin.updateOne(
      { _id: admin._id },
      { $unset: { otp: 1, otpExpiry: 1 } }
    );

    // Generate JWT token
    const token = jwt.sign(
      { email: admin.email, id: admin._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        email: admin.email,
        id: admin._id
      }
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Server error'
    }, { status: 500 });
  }
}
