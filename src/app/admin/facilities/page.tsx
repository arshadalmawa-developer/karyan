'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { facilities as initial } from '@/data/mockData';
import { toast } from 'sonner';

const AdminFacilities = () => {
  const [items, setItems] = useState(initial);
  const [modal, setModal] = useState<{ open: boolean; editing: typeof initial[0] | null }>({ open: false, editing: null });
  const [form, setForm] = useState({ title: '', description: '' });

  const openEdit = (f: typeof initial[0]) => {
    setForm({ title: f.title, description: f.description });
    setModal({ open: true, editing: f });
  };

  const save = () => {
    if (modal.editing) {
      setItems(prev => prev.map(i => i.id === modal.editing!.id ? { ...i, ...form } : i));
      toast.success('Facility updated');
    } else {
      setItems(prev => [...prev, { id: Date.now(), ...form, image: 'new', icon: 'Building2' }]);
      toast.success('Facility added');
    }
    setModal({ open: false, editing: null });
  };

  const remove = (id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
    toast.success('Facility deleted');
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold gradient-text">Manage Facilities</h1>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => { setForm({ title: '', description: '' }); setModal({ open: true, editing: null }); }} className="gradient-primary-bg text-primary-foreground px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2">
          <Plus size={16} /> Add Facility
        </motion.button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {items.map((f, i) => (
          <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-panel rounded-2xl p-5 flex justify-between items-start">
            <div>
              <h3 className="font-display font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{f.description}</p>
            </div>
            <div className="flex gap-2">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => openEdit(f)} className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Edit size={16} />
              </motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => remove(f.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive transition-colors">
                <Trash2 size={16} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modal.open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50" onClick={() => setModal({ open: false, editing: null })}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} onClick={(e) => e.stopPropagation()} className="glass-panel rounded-3xl p-8 max-w-md w-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-display font-bold">{modal.editing ? 'Edit Facility' : 'Add Facility'}</h2>
                <button onClick={() => setModal({ open: false, editing: null })} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <input placeholder="Facility Title" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" />
                <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors resize-none" />
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={save} className="w-full gradient-primary-bg text-primary-foreground py-3 rounded-xl font-semibold">
                  {modal.editing ? 'Update' : 'Add'} Facility
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminFacilities;
