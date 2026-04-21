import { NextRequest, NextResponse } from 'next/server';

import connectDB from '@/lib/mongodb';

import Course from '@/models/Course';



export async function GET(request: NextRequest) {

  try {

    console.log('DEBUG: GET /api/courses called');

    await connectDB();

    

    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');

    

    console.log('DEBUG: Category filter:', category);

    

    let filter = {};

    if (category) {

      filter = { category };

    }

    

    console.log('DEBUG: MongoDB filter:', filter);

    

    const courses = await Course.find(filter).sort({ createdAt: -1 });

    console.log('DEBUG: Courses fetched from MongoDB:', courses.length, 'courses');

    

    return NextResponse.json(courses);

  } catch (error) {

    console.error('Error fetching courses:', error);

    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });

  }

}



export async function POST(request: NextRequest) {

  try {

    console.log('DEBUG: POST /api/courses called');

    await connectDB();

    const body = await request.json();

    

    console.log('DEBUG: Request body received:', body);

    

    // Validate required fields

    const { name, description, duration, seats, category } = body;

    

    if (!name || !description || !duration || !category) {

      console.log('DEBUG: Missing required fields:', { name, description, duration, category });

      return NextResponse.json({ error: 'Missing required fields: name, description, duration, category' }, { status: 400 });

    }

    

    

    const courseData = {

      name: name.trim(),

      description: description.trim(),

      duration: duration.trim(),

      seats: parseInt(seats) || 0,

      category,

      icon: 'BookOpen'

    };

    

    console.log('DEBUG: Course data to be saved:', courseData);

    console.log('DEBUG: Saving to courses collection only');

    

    const course = await Course.create(courseData);

    console.log('DEBUG: Course saved successfully:', course);

    

    return NextResponse.json(course, { status: 201 });

  } catch (error) {

    console.error('Error creating course:', error);

    return NextResponse.json({ error: 'Failed to create course' }, { status: 500 });

  }

}



export async function PUT(request: NextRequest) {

  try {

    console.log('DEBUG: PUT /api/courses called');

    await connectDB();

    const body = await request.json();

    const { id, ...updateData } = body;

    

    console.log('DEBUG: Update data received:', { id, updateData });

    

    

    if (updateData.seats !== undefined) {

      updateData.seats = parseInt(updateData.seats) || 0;

    }

    

    console.log('DEBUG: Final update data:', updateData);

    

    const course = await Course.findByIdAndUpdate(id, updateData, { new: true });

    if (!course) {

      console.log('DEBUG: Course not found for ID:', id);

      return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    }

    

    console.log('DEBUG: Course updated successfully:', course);

    return NextResponse.json(course);

  } catch (error) {

    console.error('Error updating course:', error);

    return NextResponse.json({ error: 'Failed to update course' }, { status: 500 });

  }

}



export async function DELETE(request: NextRequest) {

  try {

    console.log('DEBUG: DELETE /api/courses called');

    await connectDB();

    const { searchParams } = new URL(request.url);

    const id = searchParams.get('id');

    

    console.log('DEBUG: Deleting course with ID:', id);

    

    if (!id) {

      return NextResponse.json({ error: 'Course ID is required' }, { status: 400 });

    }

    

    const course = await Course.findByIdAndDelete(id);

    if (!course) {

      console.log('DEBUG: Course not found for deletion, ID:', id);

      return NextResponse.json({ error: 'Course not found' }, { status: 404 });

    }

    

    console.log('DEBUG: Course deleted successfully:', course);

    return NextResponse.json({ message: 'Course deleted successfully' });

  } catch (error) {

    console.error('Error deleting course:', error);

    return NextResponse.json({ error: 'Failed to delete course' }, { status: 500 });

  }

}

