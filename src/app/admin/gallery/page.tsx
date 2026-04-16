'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { galleryStorage } from '@/utils/galleryStorage';
import { toast } from 'sonner';

const AdminGallery = () => {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', imageUrl: '' });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAddingImage, setIsAddingImage] = useState(false);

  useEffect(() => {
    // Load gallery images from storage
    const loadGalleryImages = async () => {
      if (typeof window !== 'undefined') {
        try {
          const images = await galleryStorage.getGalleryImages();
          setItems(images);
        } catch (error) {
          console.error('Failed to load gallery images:', error);
        }
      }
    };
    
    loadGalleryImages();
  }, []);

  useEffect(() => {
    // Listen for storage changes to refresh gallery
    const handleStorageChange = async () => {
      try {
        const images = await galleryStorage.getGalleryImages();
        setItems(images);
      } catch (error) {
        console.error('Failed to refresh gallery images:', error);
      }
    };

    // Custom event for MongoDB updates
    if (typeof window !== 'undefined') {
      window.addEventListener('mongodb-gallery-update', handleStorageChange);
      return () => window.removeEventListener('mongodb-gallery-update', handleStorageChange);
    }
  }, []);

  const add = async () => {
    if (!form.title || !form.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsAddingImage(true);
    
    try {
      await galleryStorage.addGalleryImage({
        title: form.title,
        category: form.category,
        imageUrl: form.imageUrl || undefined
      });
      
      // Reload images from storage
      const images = await galleryStorage.getGalleryImages();
      setItems(images);
      
      // Notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mongodb-gallery-update'));
      }

      toast.success('Image added successfully');
      setModal(false);
      setForm({ title: '', category: '', imageUrl: '' });
      setImagePreview('');
    } catch (error) {
      console.error('Error adding image:', error);
      if (error instanceof Error) {
        toast.error('Failed to add image: ' + error.message);
      } else {
        toast.error('Failed to add image. Please try again.');
      }
    } finally {
      setIsAddingImage(false);
    }
  };

  const remove = async (id: string) => {
    try {
      await galleryStorage.deleteGalleryImage(id);
      
      // Reload images from storage
      const images = await galleryStorage.getGalleryImages();
      setItems(images);
      
      // Notify other components
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('mongodb-gallery-update'));
      }

      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('Error deleting image:', error);
      toast.error('Failed to delete image');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          setImagePreview(result);
          setForm(prev => ({ ...prev, imageUrl: result }));
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please select a valid image file');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold gradient-text">Manage Gallery</h1>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setModal(true)} className="gradient-primary-bg text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Image
        </motion.button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((img, i) => (
          <motion.div key={img.id} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }} className="glass-panel rounded-2xl overflow-hidden group relative">
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
              {img.imageUrl ? (
                <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={32} className="text-foreground/40" />
              )}
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm truncate">{img.title}</p>
              <p className="text-xs text-muted-foreground">{img.category}</p>
              <p className="text-xs text-muted-foreground mt-1">{img.addedDate}</p>
            </div>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => remove(img.id)} className="absolute top-2 right-2 p-2 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </motion.button>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50" onClick={() => setModal(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={(e) => e.stopPropagation()} className="glass-panel rounded-3xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold">Add Image</h2>
                <button onClick={() => setModal(false)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input 
                  placeholder="Image Title" 
                  value={form.title} 
                  onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} 
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                />
                <input 
                  placeholder="Category" 
                  value={form.category} 
                  onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} 
                  className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" 
                />
                
                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium">Upload Image (Optional)</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-muted border border-border hover:border-primary transition-colors cursor-pointer"
                    >
                      <Upload size={16} className="mr-2" />
                      <span className="text-sm">Choose Image</span>
                    </label>
                  </div>
                  
                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-2">
                      <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />
                    </div>
                  )}
                </div>
                
                <motion.button 
                  whileHover={{ scale: isAddingImage ? 1 : 1.02 }} 
                  whileTap={{ scale: isAddingImage ? 1 : 0.98 }} 
                  onClick={add} 
                  disabled={isAddingImage}
                  className="w-full gradient-primary-bg text-primary-foreground py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isAddingImage ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing...
                    </span>
                  ) : (
                    'Add Image'
                  )}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminGallery;
