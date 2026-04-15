'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { testimonials as initial } from '@/data/mockData';
import { toast } from 'sonner';

const AdminTestimonials = () => {
  const [items, setItems] = useState(initial);
  const [modal, setModal] = useState<{ open: boolean; editing: typeof initial[0] | null }>({ open: false, editing: null });
  const [form, setForm] = useState({ name: '', course: '', year: '', text: '' });

  const openEdit = (t: typeof initial[0]) => {
    setForm({ name: t.name, course: t.course, year: t.year, text: t.text });
    setModal({ open: true, editing: t });
  };

  const save = () => {
    if (modal.editing) {
      setItems(prev => prev.map(i => i.id === modal.editing!.id ? { ...i, ...form, avatar: form.name.split(' ').map(w => w[0]).join('') } : i));
      toast.success('Updated');
    } else {
      setItems(prev => [...prev, { id: Date.now(), ...form, avatar: form.name.split(' ').map(w => w[0]).join('') }]);
      toast.success('Added');
    }
    setModal({ open: false, editing: null });
  };

  const remove = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Deleted');
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold gradient-text">Manage Testimonials</h1>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setForm({ name: '', course: '', year: '', text: '' }); setModal({ open: true, editing: null }); }} className="gradient-primary-bg text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((t, i) => (
          <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel rounded-2xl p-5">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full gradient-primary-bg flex items-center justify-center text-primary-foreground font-bold text-sm">{t.avatar}</div>
                <div>
                  <p className="font-semibold text-sm">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.course} · {t.year}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(t)} className="p-2 rounded-lg hover:bg-muted"><Edit size={14} /></button>
                <button onClick={() => remove(t.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 size={14} /></button>
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
