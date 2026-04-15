'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/AdminLayout';
import { enquiries as initial } from '@/data/mockData';
import { toast } from 'sonner';

const AdminEnquiries = () => {
  const [items, setItems] = useState(initial);

  const toggleStatus = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'New' ? 'Replied' : 'New' } : i));
    toast.success('Status updated');
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-display font-bold gradient-text mb-6">Contact Enquiries</h1>
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left p-4 font-medium">Name</th>
                <th className="text-left p-4 font-medium hidden md:table-cell">Email</th>
                <th className="text-left p-4 font-medium hidden lg:table-cell">Message</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e, i) => (
                <motion.tr key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-4 font-medium">{e.name}</td>
                  <td className="p-4 text-muted-foreground hidden md:table-cell">{e.email}</td>
                  <td className="p-4 text-muted-foreground hidden lg:table-cell max-w-xs truncate">{e.message}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${e.status === 'New' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>{e.status}</span>
                  </td>
                  <td className="p-4">
                    <button onClick={() => toggleStatus(e.id)} className="text-xs font-medium text-primary hover:underline">
                      Mark {e.status === 'New' ? 'Replied' : 'New'}
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
