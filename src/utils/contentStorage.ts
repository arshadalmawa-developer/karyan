// Content storage utility using MongoDB API
export interface Content {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  description: string;
  mission?: string;
  vision?: string;
  established?: number;
  createdAt?: string;
  updatedAt?: string;
}

export const contentStorage = {
  // Get all content from MongoDB API
  async getContent(): Promise<Content> {
    try {
      console.log('DEBUG: contentStorage.getContent() called');
      const response = await fetch('/api/content');
      console.log('DEBUG: API response status:', response.status);
      if (!response.ok) {
        throw new Error('Failed to fetch content');
      }
      const content = await response.json();
      console.log('DEBUG: Content fetched from API:', content);
      return content;
    } catch (error) {
      console.error('Error fetching content:', error);
      // Return default content as fallback
      return {
        _id: '',
        name: 'Karyon College Of Paramedical Science',
        phone: '8989115868',
        email: 'karyoncwa07@gmail.com',
        address: 'Hill side homes, Khajri Ring road, Near new RTO office, Manegaon, Dungariya, Chhindwara, 480001',
        description: 'Karyon College Of Paramedical Science provides excellent facilities. The college offers multiple labs, a well-equipped library, and advanced practical training rooms that create a highly supportive and effective learning environment for students.',
        mission: 'To produce competent paramedical professionals through quality education, hands-on training, and ethical values that contribute to healthcare sector.',
        vision: 'To be a leading institution in paramedical education, recognized for academic excellence, innovative research, and community health services.',
        established: 2020
      };
    }
  },

  // Update content
  async updateContent(content: Partial<Content>): Promise<Content> {
    try {
      console.log('DEBUG: contentStorage.updateContent() called with:', content);
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(content),
      });

      console.log('DEBUG: Update content API response status:', response.status);
      if (!response.ok) {
        const error = await response.json();
        console.log('DEBUG: Update content API error response:', error);
        throw new Error(error.error || 'Failed to update content');
      }

      const updatedContent = await response.json();
      console.log('DEBUG: Content updated successfully:', updatedContent);
      return updatedContent;
    } catch (error) {
      console.error('Error updating content:', error);
      throw error;
    }
  }
};
