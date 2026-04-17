// Facility storage utility using MongoDB API
export interface Facility {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  addedDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export const facilityStorage = {
  // Get all facilities from MongoDB API
  async getFacilities(): Promise<Facility[]> {
    try {
      const response = await fetch('/api/facilities');
      if (!response.ok) {
        throw new Error('Failed to fetch facilities');
      }
      const facilities = await response.json();
      return facilities;
    } catch (error) {
      console.error('Error fetching facilities:', error);
      return [];
    }
  },

  // Add a new facility
  async addFacility(facility: Omit<Facility, '_id' | 'createdAt' | 'updatedAt'>): Promise<Facility> {
    try {
      const response = await fetch('/api/facilities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(facility),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add facility');
      }

      const newFacility = await response.json();
      return newFacility;
    } catch (error) {
      console.error('Error adding facility:', error);
      throw error;
    }
  },

  // Update a facility
  async updateFacility(id: string, updates: Partial<Facility>): Promise<Facility> {
    try {
      const response = await fetch('/api/facilities', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update facility');
      }

      const updatedFacility = await response.json();
      return updatedFacility;
    } catch (error) {
      console.error('Error updating facility:', error);
      throw error;
    }
  },

  // Delete a facility
  async deleteFacility(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/facilities?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete facility');
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      throw error;
    }
  }
};
