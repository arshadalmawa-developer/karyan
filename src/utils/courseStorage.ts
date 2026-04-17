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
  category: 'B.SC' | 'B.COM';
}

class CourseStorage {
  private readonly API_BASE = '/api/courses';

  async getCourses(): Promise<Course[]> {
    if (typeof window === 'undefined') return [];
    
    try {
      const response = await fetch(this.API_BASE);
      if (!response.ok) throw new Error('Failed to fetch courses');
      const courses = await response.json();
      
      // Convert MongoDB courses to frontend format
      return courses.map((course: any) => ({
        ...course,
        id: course._id || course.id,
        addedDate: course.addedDate || new Date(course.createdAt).toLocaleDateString()
      }));
    } catch (error) {
      console.error('Error loading courses:', error);
      return [];
    }
  }

  async addCourse(course: Omit<Course, 'id' | 'addedDate' | '_id' | 'createdAt' | 'updatedAt'>): Promise<Course> {
    try {
      const response = await fetch(this.API_BASE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      });
      
      if (!response.ok) throw new Error('Failed to add course');
      const newCourse = await response.json();
      
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
      const response = await fetch(`${this.API_BASE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });
      
      if (!response.ok) throw new Error('Failed to update course');
      const updatedCourse = await response.json();
      
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
      const response = await fetch(`${this.API_BASE}?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete course');
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
