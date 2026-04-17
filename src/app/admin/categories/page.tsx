'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { categoryStorage, Category } from '@/utils/categoryStorage';
import { toast } from 'sonner';

const AdminCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: Category | null }>({ open: false, editing: null });
  const [form, setForm] = useState({ name: '', image: '', description: '' });

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await categoryStorage.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  const openEdit = (category: Category) => {
    setForm({ 
      name: category.name, 
      image: category.image || '', 
      description: category.description || '' 
    });
    setModal({ open: true, editing: category });
  };

  const openNew = () => {
    setForm({ name: '', image: '', description: '' });
    setModal({ open: true, editing: null });
  };

  const save = async () => {
    try {
      if (modal.editing) {
        await categoryStorage.updateCategory(modal.editing._id, { ...form });
        const updatedCategories = await categoryStorage.getCategories();
        setCategories(updatedCategories);
        toast.success('Category updated');
      } else {
        await categoryStorage.addCategory({ ...form, isActive: true, addedDate: new Date().toISOString() });
        const updatedCategories = await categoryStorage.getCategories();
        setCategories(updatedCategories);
        toast.success('Category added');
      }
      
      setModal({ open: false, editing: null });
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error('Failed to save category');
    }
  };

  const deleteItem = async (id: string) => {
    try {
      await categoryStorage.deleteCategory(id);
      const updatedCategories = await categoryStorage.getCategories();
      setCategories(updatedCategories);
      toast.success('Category deleted');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold gradient-text">Manage Course Categories</h1>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }} 
          onClick={openNew} 
          className="gradient-primary-bg text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
        >
          <Plus size={16} /> Add Category
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category, i) => (
          <motion.div
            key={category._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel rounded-xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                {category.image ? (
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-8 h-8 rounded object-cover"
                  />
                ) : (
                  <ImageIcon size={16} className="text-primary" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  category.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {category.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{category.description}</p>
            
            <div className="flex gap-2">
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => openEdit(category)} 
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Edit size={16} />
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }} 
                onClick={() => deleteItem(category._id)} 
                className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors"
              >
                <Trash2 size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
        
        {categories.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <ImageIcon size={24} className="text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No categories added yet.</p>
            <p className="text-sm text-muted-foreground mt-1">Click "Add Category" to create your first course category.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/95 backdrop-blur-sm"
            onClick={() => setModal({ open: false, editing: null })}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0, rotateX: 15 }} 
              animate={{ scale: 1, opacity: 1, rotateX: 0 }} 
              exit={{ scale: 0.8, opacity: 0, rotateX: 15 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()} 
              className="relative bg-background/95 backdrop-blur-xl rounded-2xl p-6 max-w-md w-full border border-border/50 shadow-2xl"
            >
              {/* Decorative gradient border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 -z-10" />
              <div className="absolute inset-[1px] rounded-3xl bg-background -z-10" />
              
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 400 }}
                    className="w-10 h-10 rounded-xl gradient-primary-bg flex items-center justify-center shadow-lg"
                  >
                    <ImageIcon size={18} className="text-primary-foreground" />
                  </motion.div>
                  <div>
                    <h2 className="text-xl font-display font-bold gradient-text">
                      {modal.editing ? 'Edit Category' : 'Add Category'}
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      {modal.editing ? 'Update category information' : 'Create a new course category'}
                    </p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }} 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setModal({ open: false, editing: null })} 
                  className="w-8 h-8 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-all"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-medium text-foreground">Category Name</label>
                  <input 
                    placeholder="Enter category name" 
                    value={form.name} 
                    onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} 
                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50" 
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-medium text-foreground">Image URL</label>
                  <input 
                    placeholder="Enter image URL (optional)" 
                    value={form.image} 
                    onChange={e => setForm(prev => ({ ...prev, image: e.target.value }))} 
                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/50" 
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2"
                >
                  <label className="text-xs font-medium text-foreground">Description</label>
                  <textarea 
                    placeholder="Enter category description..." 
                    rows={3} 
                    value={form.description} 
                    onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} 
                    className="w-full px-3 py-2 rounded-lg bg-muted/50 border border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-muted-foreground/50" 
                  />
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-2 pt-3"
                >
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setModal({ open: false, editing: null })}
                    className="flex-1 px-4 py-2 rounded-lg bg-muted/50 hover:bg-muted text-foreground font-medium transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                    onClick={save} 
                    className="flex-1 gradient-primary-bg text-primary-foreground py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    {modal.editing ? 'Update Category' : 'Add Category'}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCategories;
