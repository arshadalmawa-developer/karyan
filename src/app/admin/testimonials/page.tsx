'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Star } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { testimonials as initial } from '@/data/mockData';
import { toast } from 'sonner';

const AdminTestimonials = () => {
  const [items, setItems] = useState<any[]>([]);
  const [modal, setModal] = useState<{ open: boolean; editing: any | null }>({ open: false, editing: null });
  const [form, setForm] = useState({ name: '', course: '', year: '', text: '', image: '', rating: 5 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const testimonialsData = await response.json();
          setItems(testimonialsData);
        } else {
          toast.error('Failed to fetch testimonials');
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        toast.error('Failed to fetch testimonials');
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  const openEdit = (t: any) => {
    setForm({ 
      name: t.name, 
      course: t.course, 
      year: t.year, 
      text: t.text,
      image: t.image || '',
      rating: t.rating || 5
    });
    setModal({ open: true, editing: t });
  };

  const save = async () => {
    try {
      if (modal.editing) {
        const response = await fetch('/api/testimonials', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: modal.editing._id, ...form }),
        });
        if (response.ok) {
          setItems(prev => prev.map(i => i._id === modal.editing._id ? { ...i, ...form, avatar: form.name.split(' ').map(w => w[0]).join('') } : i));
          toast.success('Updated');
        } else {
          toast.error('Failed to update testimonial');
        }
      } else {
        const response = await fetch('/api/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, avatar: form.name.split(' ').map(w => w[0]).join('') }),
        });
        if (response.ok) {
          setItems(prev => [...prev, { _id: Date.now(), ...form, avatar: form.name.split(' ').map(w => w[0]).join('') }]);
          toast.success('Added');
        } else {
          toast.error('Failed to add testimonial');
        }
      }
      setModal({ open: false, editing: null });
      setForm({ name: '', course: '', year: '', text: '', image: '', rating: 5 });
    } catch (error) {
      console.error('Error saving testimonial:', error);
      toast.error('Failed to save testimonial');
    }
  };

  const remove = async (id: string) => {
    try {
      const response = await fetch(`/api/testimonials?id=${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setItems(prev => prev.filter(i => i._id !== id));
        toast.success('Deleted');
      } else {
        toast.error('Failed to delete testimonial');
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      toast.error('Failed to delete testimonial');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold gradient-text">Manage Testimonials</h1>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setForm({ name: '', course: '', year: '', text: '', image: '', rating: 5 }); setModal({ open: true, editing: null }); }} className="gradient-primary-bg text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((t, i) => (
          <motion.div key={t._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel rounded-2xl p-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  {t.image ? (
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full gradient-primary-bg flex items-center justify-center text-primary-foreground font-bold text-sm">{t.avatar || t.name.split(' ').map(w => w[0]).join('')}</div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.course} · {t.year}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={12}
                        className={star <= (t.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-muted"><Edit size={14} /></button>
                <button onClick={() => remove(t._id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground italic">"{t.text}"</p>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {modal.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50" onClick={() => setModal({ open: false, editing: null })}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()} className="glass-panel rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold">{modal.editing ? 'Edit' : 'Add'} Testimonial</h3>
                <button onClick={() => setModal({ open: false, editing: null })}><X size={18} /></button>
              </div>
              <div className="space-y-3">
                <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Student Name" className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm" />
                <div className="grid grid-cols-2 gap-3">
                  <input value={form.course} onChange={e => setForm(p => ({ ...p, course: e.target.value }))} placeholder="Course" className="px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm" />
                  <input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} placeholder="Year" className="px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm" />
                </div>
                <input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="Image URL (optional)" className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm" />
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Rating:</label>
                  <select value={form.rating} onChange={e => setForm(p => ({ ...p, rating: parseInt(e.target.value) }))} className="px-3 py-2 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm">
                    <option value={1}>1 Star</option>
                    <option value={2}>2 Stars</option>
                    <option value={3}>3 Stars</option>
                    <option value={4}>4 Stars</option>
                    <option value={5}>5 Stars</option>
                  </select>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        className={star <= form.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                </div>
                <textarea value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} placeholder="Testimonial" rows={3} className="w-full px-4 py-2.5 rounded-xl bg-muted border border-border focus:border-primary outline-none text-sm resize-none" />
                <button onClick={save} className="w-full gradient-primary-bg text-primary-foreground py-2.5 rounded-xl font-semibold text-sm">{modal.editing ? 'Update' : 'Add'}</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminTestimonials;
