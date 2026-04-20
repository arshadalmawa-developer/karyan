import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Facility from '../../../../models/Facility.js';

export async function GET() {
  try {
    console.log('DEBUG: GET /api/facilities called');
    await connectDB();
    const facilities = await Facility.find({}).sort({ createdAt: -1 });
    console.log('DEBUG: Facilities fetched from MongoDB:', facilities.length, 'facilities');
    console.log('DEBUG: Facilities data:', facilities);
    return NextResponse.json(facilities);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json({ error: 'Failed to fetch facilities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('DEBUG: POST /api/facilities called');
    await connectDB();
    const body = await request.json();
    
    console.log('DEBUG: Request body received:', body);
    
    // Validate required fields
    const { name, description } = body;
    
    if (!name || !description) {
      console.log('DEBUG: Missing required fields:', { name, description });
      return NextResponse.json({ error: 'Missing required fields: name and description' }, { status: 400 });
    }
    
    const facilityData = {
      name: name.trim(),
      description: description.trim(),
      image: body.image || '',
      icon: body.icon || 'GraduationCap',
      isActive: true
    };
    
    console.log('DEBUG: Facility data to be saved:', facilityData);
    console.log('DEBUG: Saving to facilities collection only');
    
    const facility = await Facility.create(facilityData);
    console.log('DEBUG: Facility saved successfully:', facility);
    
    return NextResponse.json(facility, { status: 201 });
  } catch (error) {
    console.error('Error creating facility:', error);
    return NextResponse.json({ error: 'Failed to create facility', details: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('DEBUG: PUT /api/facilities called');
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    console.log('DEBUG: Update data received:', { id, updateData });
    
    const facility = await Facility.findByIdAndUpdate(id, updateData, { new: true });
    if (!facility) {
      console.log('DEBUG: Facility not found for ID:', id);
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 });
    }
    
    console.log('DEBUG: Facility updated successfully:', facility);
    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error updating facility:', error);
    return NextResponse.json({ error: 'Failed to update facility' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('DEBUG: DELETE /api/facilities called');
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    console.log('DEBUG: Deleting facility with ID:', id);
    
    if (!id) {
      return NextResponse.json({ error: 'Facility ID is required' }, { status: 400 });
    }
    
    const facility = await Facility.findByIdAndDelete(id);
    if (!facility) {
      console.log('DEBUG: Facility not found for deletion, ID:', id);
      return NextResponse.json({ error: 'Facility not found' }, { status: 404 });
    }
    
    console.log('DEBUG: Facility deleted successfully:', facility);
    return NextResponse.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error('Error deleting facility:', error);
    return NextResponse.json({ error: 'Failed to delete facility' }, { status: 500 });
  }
}
