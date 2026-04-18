'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Phone, ArrowUp, X } from 'lucide-react';

export const FloatingActions = () => {
  const [open, setOpen] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <>
            <motion.a
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.1 }}
              href="tel:8989115868"
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground shadow-lg hover:scale-110 transition-transform"
            >
              <Phone size={20} />
            </motion.a>
            <motion.a
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ delay: 0.2 }}
              href="tel:6262586862"
              className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground shadow-lg hover:scale-110 transition-transform"
            >
              <Phone size={20} />
            </motion.a>
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              onClick={scrollToTop}
              className="w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <ArrowUp size={20} />
            </motion.button>
          </>
        )}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="w-14 h-14 rounded-full gradient-primary-bg text-primary-foreground flex items-center justify-center shadow-lg animate-pulse-glow"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </motion.button>
    </div>
  );
};
