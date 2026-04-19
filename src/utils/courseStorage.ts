interface Course {
  _id?: string;
  id?: number;
  name: string;
  duration: string;
  seats?: number;
  description: string;
  icon?: string;
  addedDate?: string;
  createdAt?: string;
  updatedAt?: string;
  category: 'BSC' | 'BCOM' | 'BMLT' | 'DMLT' | 'UPCOMING';
}

class CourseStorage {
  private readonly API_BASE = '/api/courses';

  async getCourses(): Promise<Course[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      console.log('DEBUG: courseStorage.getCourses() called');
      const response = await fetch(this.API_BASE);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const courses = await response.json();
      
      console.log('DEBUG: Courses fetched from API:', courses.length, 'courses');
      console.log('DEBUG: Course data:', courses);
      
      // Convert MongoDB courses to frontend format
      const formattedCourses = courses.map((course: any) => ({
        ...course,
        id: course._id || course.id,
        addedDate: course.addedDate || new Date(course.createdAt).toLocaleDateString()
      }));
      
      console.log('DEBUG: Formatted courses:', formattedCourses);
      return formattedCourses;
    } catch (error) {
      console.error('Error loading courses:', error);
      return [];
    }
  }

  async addCourse(course: Omit<Course, 'id' | 'addedDate' | '_id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    try {
      console.log('DEBUG: courseStorage.addCourse() called with:', course);
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });
      
      console.log('DEBUG: API response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.log('DEBUG: API error response:', errorData);
        throw new Error(errorData.error || 'Failed to add course');
      }
      const newCourse = await response.json();
      
      console.log('DEBUG: New course created:', newCourse);
      
      return {
        ...newCourse,
        id: newCourse._id || newCourse.id,
        addedDate: newCourse.addedDate || new Date(newCourse.createdAt).toLocaleDateString()
      };
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  }

  async updateCourse(id: string | number, updates: Partial<Omit<Course, 'id' | 'addedDate' | '_id' | 'createdAt' | 'updatedAt'>>): Promise<Course | null> {
    try {
      console.log('DEBUG: courseStorage.updateCourse() called with:', { id, updates });
      const response = await fetch(`${this.API_BASE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      
      console.log('DEBUG: Update API response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.log('DEBUG: Update API error response:', errorData);
        throw new Error(errorData.error || 'Failed to update course');
      }
      const updatedCourse = await response.json();
      
      console.log('DEBUG: Course updated successfully:', updatedCourse);
      
      return {
        ...updatedCourse,
        id: updatedCourse._id || updatedCourse.id,
        addedDate: updatedCourse.addedDate || new Date(updatedCourse.createdAt).toLocaleDateString()
      };
    } catch (error) {
      console.error('Error updating course:', error);
      throw error;
    }
  }

  async deleteCourse(id: string | number): Promise<boolean> {
    try {
      console.log('DEBUG: courseStorage.deleteCourse() called with ID:', id);
      const response = await fetch(`${this.API_BASE}?id=${id}`, {
        method: 'DELETE',
      });
      
      console.log('DEBUG: Delete API response status:', response.status);
      if (!response.ok) {
        const errorData = await response.json();
        console.log('DEBUG: Delete API error response:', errorData);
        throw new Error(errorData.error || 'Failed to delete course');
      }
      console.log('DEBUG: Course deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  }

  async getCourse(id: string | number): Promise<Course | null> {
    try {
      const courses = await this.getCourses();
      return courses.find(c => (c.id === id || c._id === id)) || null;
    } catch (error) {
      console.error('Error getting course:', error);
      return null;
    }
  }
}

export const courseStorage = new CourseStorage();
