'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { courses as initialCourses } from '@/data/mockData';
import { toast } from 'sonner';

const AdminCourses = () => {
  const [items, setItems] = useState(initialCourses);
  const [modal, setModal] = useState<{ open: boolean; editing: typeof initialCourses[0] | null }>({ open: false, editing: null });
  const [form, setForm] = useState({ name: '', duration: '', seats: '', description: '' });

  const openEdit = (c: typeof initialCourses[0]) => {
    setForm({ name: c.name, duration: c.duration, seats: c.seats.toString(), description: c.description });
    setModal({ open: true, editing: c });
  };

  const openNew = () => {
    setForm({ name: '', duration: '', seats: '', description: '' });
    setModal({ open: true, editing: null });
  };

  const save = () => {
    if (modal.editing) {
      setItems(prev => prev.map(i => i.id === modal.editing!.id ? { ...i, ...form, seats: parseInt(form.seats) } : i));
      toast.success('Course updated');
    } else {
      setItems(prev => [...prev, { id: Date.now(), ...form, seats: parseInt(form.seats), icon: 'BookOpen' }]);
      toast.success('Course added');
    }
    setModal({ open: false, editing: null });
  };

  const remove = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Course deleted');
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold gradient-text">Manage Courses</h1>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={openNew} className="gradient-primary-bg text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Course
        </motion.button>
      </div>

      <div className="grid gap-4">
        {items.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">{c.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{c.description}</p>
                <div className="flex gap-4 mt-3 text-xs text-muted-foreground">
                  <span>Duration: {c.duration}</span>
                  <span>Seats: {c.seats}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEdit(c)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Edit size={16} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => remove(c.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50" onClick={() => setModal({ open: false, editing: null })}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={(e) => e.stopPropagation()} className="glass-panel rounded-3xl p-8 max-w-lg w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold">{modal.editing ? 'Edit Course' : 'Add Course'}</h2>
                <button onClick={() => setModal({ open: false, editing: null })} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input placeholder="Course Name" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                <input placeholder="Duration" value={form.duration} onChange={e => setForm(prev => ({ ...prev, duration: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                <input placeholder="Seats" type="number" value={form.seats} onChange={e => setForm(prev => ({ ...prev, seats: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={save} className="w-full gradient-primary-bg text-primary-foreground py-3 rounded-xl font-semibold">
                  {modal.editing ? 'Update' : 'Add'} Course
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminCourses;
