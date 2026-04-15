'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, X } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { galleryImages as initial } from '@/data/mockData';
import { toast } from 'sonner';

const AdminGallery = () => {
  const [items, setItems] = useState(initial);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', category: '' });

  const add = () => {
    setItems(prev => [...prev, { id: Date.now(), title: form.title, category: form.category }]);
    toast.success('Image added');
    setModal(false);
    setForm({ title: '', category: '' });
  };

  const remove = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Image deleted');
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
            <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <span className="text-foreground/60 font-display font-bold text-sm">{img.title}</span>
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm truncate">{img.title}</p>
              <p className="text-xs text-muted-foreground">{img.category}</p>
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
                <input placeholder="Image Title" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                <input placeholder="Category" value={form.category} onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={add} className="w-full gradient-primary-bg text-primary-foreground py-3 rounded-xl font-semibold">
                  Add Image
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
