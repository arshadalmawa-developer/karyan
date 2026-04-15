'use client';

import { motion } from 'framer-motion';
import { Users, BookOpen, Building2, MessageSquare, TrendingUp, GraduationCap } from 'lucide-react';
import { AdminLayout } from '@/components/AdminLayout';
import { courses, facilities, testimonials, enquiries } from '@/data/mockData';

const dashCards = [
  { label: 'Total Students', value: '500+', icon: Users, change: '+12%' },
  { label: 'Courses', value: courses.length.toString(), icon: BookOpen, change: '+2' },
  { label: 'Facilities', value: facilities.length.toString(), icon: Building2, change: '' },
  { label: 'Testimonials', value: testimonials.length.toString(), icon: GraduationCap, change: '+1' },
  { label: 'Enquiries', value: enquiries.length.toString(), icon: MessageSquare, change: '+5' },
  { label: 'Growth', value: '24%', icon: TrendingUp, change: '+3%' },
];

const AdminDashboard = () => (
  <AdminLayout>
    <div className="mb-6">
      <h1 className="text-2xl font-display font-bold gradient-text">Dashboard Overview</h1>
      <p className="text-sm text-muted-foreground">Welcome to Karyon College Admin Panel</p>
    </div>

    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {dashCards.map((c, i) => (
        <motion.div
          key={c.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          whileHover={{ y: -3, scale: 1.02 }}
          className="glass-panel rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl gradient-primary-bg flex items-center justify-center">
              <c.icon size={20} className="text-primary-foreground" />
            </div>
            {c.change && <span className="text-xs text-secondary font-medium">{c.change}</span>}
          </div>
          <p className="text-2xl font-display font-bold">{c.value}</p>
          <p className="text-xs text-muted-foreground">{c.label}</p>
        </motion.div>
      ))}
    </div>

    {/* Recent Enquiries */}
    <div className="glass-panel rounded-2xl p-6">
      <h3 className="font-display font-bold mb-4">Recent Enquiries</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
              <th className="text-left py-2 text-muted-foreground font-medium hidden md:table-cell">Email</th>
              <th className="text-left py-2 text-muted-foreground font-medium hidden sm:table-cell">Date</th>
              <th className="text-left py-2 text-muted-foreground font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map(e => (
              <tr key={e.id} className="border-b border-border/50 hover:bg-muted/50 transition-colors">
                <td className="py-3 font-medium">{e.name}</td>
                <td className="py-3 text-muted-foreground hidden md:table-cell">{e.email}</td>
                <td className="py-3 text-muted-foreground hidden sm:table-cell">{e.date}</td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    e.status === 'New' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
                  }`}>
                    {e.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
);

export default AdminDashboard;
