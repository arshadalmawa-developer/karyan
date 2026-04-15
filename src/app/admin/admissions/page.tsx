'use client';

import { motion } from 'framer-motion';
import { AdminLayout } from '@/components/AdminLayout';
import { admissionSteps } from '@/data/mockData';

const AdminAdmissions = () => (
  <AdminLayout>
    <h1 className="text-2xl font-display font-bold gradient-text mb-6">Manage Admissions</h1>
    <div className="glass-panel rounded-2xl p-6 mb-6">
      <h3 className="font-display font-bold mb-4">Admission Steps</h3>
      <div className="space-y-3">
        {admissionSteps.map((s, i) => (
          <motion.div key={s.step} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted transition-colors">
            <div className="w-8 h-8 rounded-lg gradient-primary-bg flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">{s.step}</div>
            <div>
              <p className="font-semibold text-sm">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="font-display font-bold mb-4">Admission Statistics</h3>
      <div className="grid grid-cols-3 gap-4">
        {[{ label: 'Applications', value: '120' }, { label: 'Accepted', value: '85' }, { label: 'Pending', value: '35' }].map(s => (
          <div key={s.label} className="text-center p-4 rounded-xl bg-muted">
            <p className="text-2xl font-display font-bold gradient-text">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </AdminLayout>
);

export default AdminAdmissions;
