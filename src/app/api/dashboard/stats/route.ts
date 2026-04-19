import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Course from '@/models/Course';
import Facility from '@/models/Facility';
import Enquiry from '@/models/Enquiry';
import Testimonial from '@/models/Testimonial';

export async function GET() {
  try {
    await connectDB();
    
    // Get counts from all collections
    const courses = await Course.countDocuments({});
    const facilities = await Facility.countDocuments({});
    const enquiries = await Enquiry.countDocuments({});
    const testimonials = await Testimonial.countDocuments({});
    
    // Debug logging
    console.log('Dashboard stats:', { courses, facilities, enquiries, testimonials });
    
    return NextResponse.json({
      courses,
      facilities,
      enquiries,
      testimonials
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { 
        courses: 0,
        facilities: 0,
        enquiries: 0,
        testimonials: 0
      }, 
      { status: 500 }
    );
  }
}
