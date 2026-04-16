// Enquiry storage utility using localStorage for proper data persistence
export interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  date: string;
  status: 'New' | 'Replied';
}

export const enquiryStorage = {
  // Get all enquiries from localStorage
  getEnquiries(): Enquiry[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('enquiries');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading enquiries from localStorage:', error);
    }
    
    // Return empty array - no default enquiries
    return [];
  },

  // Add a new enquiry
  addEnquiry(enquiry: Omit<Enquiry, 'id' | 'date' | 'status'>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const enquiries = this.getEnquiries();
      const newEnquiry: Enquiry = {
        ...enquiry,
        id: enquiries.length > 0 ? Math.max(...enquiries.map(e => e.id)) + 1 : 1,
        date: new Date().toISOString().split('T')[0], // Format: YYYY-MM-DD
        status: 'New'
      };
      
      enquiries.unshift(newEnquiry); // Add to beginning of array
      localStorage.setItem('enquiries', JSON.stringify(enquiries));
    } catch (error) {
      console.error('Error saving enquiry to localStorage:', error);
      throw error;
    }
  },

  // Update enquiry status
  updateEnquiryStatus(id: number, status: 'New' | 'Replied'): void {
    if (typeof window === 'undefined') return;
    
    try {
      const enquiries = this.getEnquiries();
      const index = enquiries.findIndex(e => e.id === id);
      if (index !== -1) {
        enquiries[index].status = status;
        localStorage.setItem('enquiries', JSON.stringify(enquiries));
      }
    } catch (error) {
      console.error('Error updating enquiry status:', error);
      throw error;
    }
  },

  // Delete an enquiry
  deleteEnquiry(id: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      const enquiries = this.getEnquiries();
      const filteredEnquiries = enquiries.filter(e => e.id !== id);
      localStorage.setItem('enquiries', JSON.stringify(filteredEnquiries));
    } catch (error) {
      console.error('Error deleting enquiry from localStorage:', error);
      throw error;
    }
  }
};
