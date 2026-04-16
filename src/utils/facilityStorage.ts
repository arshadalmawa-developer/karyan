// Facility storage utility using localStorage - similar to galleryStorage
export interface Facility {
  id: number;
  title: string;
  description: string;
  icon?: string;
  imageUrl?: string;
  addedDate: string;
}

export const facilityStorage = {
  // Get all facilities from localStorage
  getFacilities(): Facility[] {
    if (typeof window === 'undefined') return [];
    
    try {
      const stored = localStorage.getItem('facilities');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading facilities from localStorage:', error);
    }
    
    // Return empty array - no default facilities
    return [];
  },

  // Add a new facility
  addFacility(facility: Omit<Facility, 'id' | 'addedDate'>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const facilities = this.getFacilities();
      const newFacility: Facility = {
        ...facility,
        id: facilities.length > 0 ? Math.max(...facilities.map(f => f.id)) + 1 : 1,
        addedDate: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
      };
      
      facilities.unshift(newFacility); // Add to beginning of array
      localStorage.setItem('facilities', JSON.stringify(facilities));
    } catch (error) {
      console.error('Error saving facility to localStorage:', error);
      throw error;
    }
  },

  // Delete a facility
  deleteFacility(id: number): void {
    if (typeof window === 'undefined') return;
    
    try {
      const facilities = this.getFacilities();
      const filteredFacilities = facilities.filter(f => f.id !== id);
      localStorage.setItem('facilities', JSON.stringify(filteredFacilities));
    } catch (error) {
      console.error('Error deleting facility from localStorage:', error);
      throw error;
    }
  },

  // Update a facility
  updateFacility(id: number, updates: Partial<Facility>): void {
    if (typeof window === 'undefined') return;
    
    try {
      const facilities = this.getFacilities();
      const index = facilities.findIndex(f => f.id === id);
      if (index !== -1) {
        facilities[index] = { ...facilities[index], ...updates };
        localStorage.setItem('facilities', JSON.stringify(facilities));
      }
    } catch (error) {
      console.error('Error updating facility in localStorage:', error);
      throw error;
    }
  }
};
