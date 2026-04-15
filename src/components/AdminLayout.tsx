'use client';

import { useState, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, Image, Building2, GraduationCap,
  MessageSquare, Quote, FileText, Menu, X, Sun, Moon, ArrowLeft,
} from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import logo from '@/assets/logo.png';

const sidebarLinks = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'Courses', path: '/admin/courses', icon: BookOpen },
  { label: 'Gallery', path: '/admin/gallery', icon: Image },
  { label: 'Facilities', path: '/admin/facilities', icon: Building2 },
  { label: 'Admissions', path: '/admin/admissions', icon: GraduationCap },
  { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
  { label: 'Testimonials', path: '/admin/testimonials', icon: Quote },
  { label: 'Content', path: '/admin/content', icon: FileText },
];

export const AdminLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { isDark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-border bg-card fixed inset-y-0 left-0 z-30">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <img src={logo.src} alt="Logo" className="w-8 h-8 rounded-full" />
          <span className="font-display font-bold text-sm gradient-text">Admin Panel</span>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {sidebarLinks.map(link => (
            <Link
              key={link.path}
              href={link.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                pathname === link.path
                  ? 'gradient-primary-bg text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <link.icon size={18} />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-border">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} /> Back to Website
          </Link>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-foreground/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 w-64 bg-card border-r border-border z-50 lg:hidden flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <span className="font-display font-bold text-sm gradient-text">Admin Panel</span>
                <button onClick={() => setSidebarOpen(false)} className="p-1"><X size={18} /></button>
              </div>
              <nav className="flex-1 p-3 space-y-1">
                {sidebarLinks.map(link => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      pathname === link.path
                        ? 'gradient-primary-bg text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="p-4 border-t border-border">
                <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                  <ArrowLeft size={16} /> Back to Website
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-20 glass-panel border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-muted">
              <Menu size={20} />
            </button>
            <h2 className="font-display font-semibold text-sm">
              {sidebarLinks.find(l => l.path === pathname)?.label || 'Admin'}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-muted transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="w-8 h-8 rounded-full gradient-primary-bg flex items-center justify-center text-primary-foreground text-xs font-bold">A</div>
          </div>
        </header>
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 md:p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
