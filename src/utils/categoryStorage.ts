export interface Category {
  _id: string;
  name: string;
  image?: string;
  description?: string;
  isActive: boolean;
  addedDate: string;
  createdAt?: string;
  updatedAt?: string;
}

export const categoryStorage = {
  async getCategories(): Promise<Category[]> {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categories = await response.json();
      return categories;
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },

  async addCategory(category: Omit<Category, '_id' | 'createdAt' | 'updatedAt'>): Promise<Category> {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add category');
      }

      const newCategory = await response.json();
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, ...updates }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update category');
      }

      const updatedCategory = await response.json();
      return updatedCategory;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  async deleteCategory(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  }
};
