'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/AdminLayout';
import { collegeInfo } from '@/data/mockData';
import { toast } from 'sonner';

const AdminContent = () => {
  const [content, setContent] = useState({
    name: collegeInfo.name,
    phone: collegeInfo.phone,
    email: collegeInfo.email,
    address: collegeInfo.address,
    description: collegeInfo.description,
    mission: collegeInfo.mission,
    vision: collegeInfo.vision,
  });

  const save = () => toast.success('Content updated successfully!');

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
