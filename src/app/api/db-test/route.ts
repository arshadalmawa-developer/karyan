import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('MongoDB connection test starting...');
    await connectDB();
    console.log('MongoDB Connected Successfully');
    return NextResponse.json({ message: 'MongoDB Connected Successfully' });
  } catch (error) {
    console.error('MongoDB Connection Failed:', error);
    return NextResponse.json({ 
      error: 'MongoDB Connection Failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
