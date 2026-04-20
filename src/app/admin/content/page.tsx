'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/AdminLayout';
import { contentStorage } from '@/utils/contentStorage';
import { toast } from 'sonner';

const AdminContent = () => {
  const [content, setContent] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    description: '',
    mission: '',
    vision: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load content from MongoDB
    const loadContent = async () => {
      try {
        const contentData = await contentStorage.getContent();
        setContent({
          name: contentData.name || '',
          phone: contentData.phone || '',
          email: contentData.email || '',
          address: contentData.address || '',
          description: contentData.description || '',
          mission: contentData.mission || '',
          vision: contentData.vision || '',
        });
      } catch (error) {
        console.error('Error loading content:', error);
        toast.error('Failed to load content');
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  const save = async () => {
    try {
      await contentStorage.updateContent(content);
      toast.success('Content updated successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error('Failed to save content');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading content...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-display font-bold gradient-text mb-6">Manage Website Content</h1>
      <div className="glass-panel rounded-2xl p-6 max-w-2xl">
        <div className="space-y-4">
          {Object.entries(content).map(([key, val]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              {val.length > 80 ? (
                <textarea value={val} onChange={e => setContent(p => ({ ...p, [key]: e.target.value }))} rows={3} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm resize-none" />
              ) : (
                <input value={val} onChange={e => setContent(p => ({ ...p, [key]: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm" />
              )}
            </div>
          ))}
          <motion.button whileTap={{ scale: 0.98 }} onClick={save} className="gradient-primary-bg text-primary-foreground px-6 py-2.5 rounded-xl font-semibold text-sm">
            Save Changes
          </motion.button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
