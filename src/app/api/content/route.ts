import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Content from '../../../../models/Content.js';

export async function GET() {
  try {
    console.log('DEBUG: GET /api/content called');
    await connectDB();
    
    // Find the content document or create default one
    let content = await Content.findOne({});
    if (!content) {
      console.log('DEBUG: No content found, creating default');
      content = await Content.create({});
    }
    
    console.log('DEBUG: Content fetched:', content);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log('DEBUG: PUT /api/content called');
    await connectDB();
    const body = await request.json();
    
    console.log('DEBUG: Request body received:', body);
    
    // Validate required fields
    const { name, phone, email, address, description, mission, vision } = body;
    
    if (!name || !phone || !email || !address || !description) {
      console.log('DEBUG: Missing required fields:', { name, phone, email, address, description });
      return NextResponse.json({ error: 'Missing required fields: name, phone, email, address, description' }, { status: 400 });
    }
    
    // Find existing content or create new one
    let content = await Content.findOne({});
    if (!content) {
      console.log('DEBUG: Creating new content document');
      content = new Content();
    }
    
    // Update fields
    content.name = name.trim();
    content.phone = phone.trim();
    content.email = email.trim();
    content.address = address.trim();
    content.description = description.trim();
    if (mission) content.mission = mission.trim();
    if (vision) content.vision = vision.trim();
    
    console.log('DEBUG: Content to be saved:', content);
    
    const updatedContent = await content.save();
    console.log('DEBUG: Content saved successfully:', updatedContent);
    
    return NextResponse.json(updatedContent);
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ error: 'Failed to update content', details: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // For simplicity, use PUT for both create and update
  return PUT(request);
}
