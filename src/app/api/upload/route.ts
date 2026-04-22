import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dboftqmhk',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    console.log('DEBUG: Image upload API called');
    
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' }, { status: 400 });
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
    }
    
    // Convert file to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    // Create unique filename for Cloudinary
    const timestamp = Date.now();
    const filename = `facility-${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
    
    let imageUrl = '';
    let uploadMethod = '';
    
    try {
      // Try to upload to Cloudinary first
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            public_id: filename,
            folder: 'facilities',
            format: file.type.split('/')[1], // Get format from file type
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        ).end(buffer);
      });
      
      imageUrl = (result as any).secure_url;
      uploadMethod = 'Cloudinary';
      console.log('DEBUG: Image uploaded to Cloudinary successfully:', imageUrl);
      
    } catch (cloudinaryError) {
      console.warn('Cloudinary upload failed, falling back to local storage:', cloudinaryError.message);
      
      // Fallback to local storage
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'facilities');
        
        // Ensure upload directory exists
        await mkdir(uploadDir, { recursive: true });
        
        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);
        
        imageUrl = `/uploads/facilities/${filename}`;
        uploadMethod = 'Local';
        console.log('DEBUG: Image uploaded locally:', imageUrl);
      } catch (localError) {
        console.error('Local storage also failed:', localError);
        throw new Error('Both Cloudinary and local storage failed');
      }
    }
    
    return NextResponse.json({ 
      message: `Image uploaded successfully via ${uploadMethod}`,
      imageUrl: imageUrl,
      uploadMethod: uploadMethod
    });
    
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
