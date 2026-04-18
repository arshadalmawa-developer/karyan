'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Phone } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';
import logo from '@/assets/logo.png';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'About', path: '/about' },
  { label: 'Courses', path: '/courses' },
  { label: 'Facilities', path: '/facilities' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Admissions', path: '/admissions' },
  { label: 'Contact', path: '/contact' },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isDark, toggle } = useTheme();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="fixed top-0 left-0 right-0 z-40 glass-panel"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <img src={logo.src} alt="Logo" className="w-10 h-10 rounded-full" />
            <span className="font-display font-bold text-lg gradient-text hidden sm:block">Karyon College</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                  pathname === link.path
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
                {pathname === link.path && (
                  <div
                    className="absolute bottom-0 left-2 right-2 h-0.5 gradient-primary-bg rounded-full"
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-3 text-xs text-muted-foreground">
              <a href="tel:8989115868" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Phone size={14} /> 8989115868
              </a>
              <a href="tel:6262586862" className="flex items-center gap-1 hover:text-primary transition-colors">
                <Phone size={14} /> 6262586862
              </a>
            </div>
            <button onClick={toggle} className="p-2 rounded-lg hover:bg-muted transition-colors">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link href="/admin" className="hidden md:block text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity">
              Admin
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden overflow-hidden glass-panel border-t border-border"
          >
            <div className="p-4 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      pathname === link.path ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link href="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-medium text-primary">
                Admin Panel
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
