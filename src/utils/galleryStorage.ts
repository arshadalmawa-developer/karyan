// Gallery storage utility using MongoDB API with image compression
export interface GalleryImage {
  _id?: string;
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
  addedDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export const galleryStorage = {
  // Compress image before storing
  compressImage(base64String: string, maxWidth = 800, maxHeight = 600, quality = 0.7): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64String;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to compressed base64
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
    });
  },

  // Get all gallery images from MongoDB
  async getGalleryImages(): Promise<GalleryImage[]> {
    try {
      const response = await fetch('/api/gallery');
      if (!response.ok) {
        throw new Error('Failed to fetch gallery images');
      }
      const galleryImages = await response.json();
      
      // Convert MongoDB _id to id for compatibility
      return galleryImages.map((image: any) => ({
        ...image,
        id: image._id,
        _id: image._id
      }));
    } catch (error) {
      console.error('Error fetching gallery images from MongoDB:', error);
      // Return default gallery images if API fails
      return [
        { id: "default1", title: "Campus Building", category: "Campus", addedDate: "2024-01-15" },
        { id: "default2", title: "Laboratory Session", category: "Labs", addedDate: "2024-01-14" },
        { id: "default3", title: "Library", category: "Library", addedDate: "2024-01-13" },
        { id: "default4", title: "Student Activities", category: "Events", addedDate: "2024-01-12" },
        { id: "default5", title: "Graduation Ceremony", category: "Events", addedDate: "2024-01-11" },
        { id: "default6", title: "Practical Training", category: "Labs", addedDate: "2024-01-10" },
        { id: "default7", title: "Seminar Hall", category: "Campus", addedDate: "2024-01-09" },
        { id: "default8", title: "Sports Day", category: "Events", addedDate: "2024-01-08" },
        { id: "default9", title: "Lab Equipment", category: "Labs", addedDate: "2024-01-07" },
      ];
    }
  },

  // Add a new gallery image with compression to MongoDB
  async addGalleryImage(image: Omit<GalleryImage, 'id' | 'addedDate' | '_id'>): Promise<void> {
    try {
      let compressedImageUrl = image.imageUrl;
      
      // Compress image if it's a base64 string
      if (image.imageUrl && image.imageUrl.startsWith('data:image')) {
        try {
          compressedImageUrl = await this.compressImage(image.imageUrl);
        } catch (compressError) {
          console.warn('Image compression failed, using original:', compressError);
        }
      }

      const newImage = {
        ...image,
        imageUrl: compressedImageUrl,
        addedDate: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
      };
      
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newImage),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save gallery image');
      }
    } catch (error) {
      console.error('Error saving gallery image to MongoDB:', error);
      throw error;
    }
  },

  // Delete a gallery image from MongoDB
  async deleteGalleryImage(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/gallery?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete gallery image');
      }
    } catch (error) {
      console.error('Error deleting gallery image from MongoDB:', error);
      throw error;
    }
  },

  // Update a gallery image in MongoDB
  async updateGalleryImage(id: string, updates: Partial<GalleryImage>): Promise<void> {
    try {
      const response = await fetch('/api/gallery', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update gallery image');
      }
    } catch (error) {
      console.error('Error updating gallery image in MongoDB:', error);
      throw error;
    }
  }
};
