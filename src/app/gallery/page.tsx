'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { FloatingActions } from '@/components/FloatingActions';
import { galleryImages } from '@/data/mockData';

const colors = [
  'from-primary/30 to-secondary/30',
  'from-secondary/30 to-primary/30',
  'from-primary/20 to-accent/20',
];

const GalleryPage = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(galleryImages.map(g => g.category)))];
  const filtered = filter === 'All' ? galleryImages : galleryImages.filter(g => g.category === filter);

  return (
    <PageLayout>
      <section className="py-20 mesh-bg">
        <div className="container mx-auto px-4">
          <SectionHeading title="Gallery" subtitle="Explore our campus life and facilities" />

          <div className="flex justify-center gap-2 mb-10 flex-wrap">
            {categories.map(c => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFilter(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === c ? 'gradient-primary-bg text-primary-foreground' : 'glass-panel text-muted-foreground hover:text-foreground'
                }`}
              >
                {c}
              </motion.button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((img, i) => (
                <ScrollReveal key={img.id} delay={i * 0.05}>
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ scale: 1.05, zIndex: 10 }}
                    onClick={() => setLightbox(img.id)}
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group aspect-square bg-gradient-to-br ${colors[i % 3]}`}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-foreground/60 font-display font-bold text-lg">{img.title}</span>
                    </div>
                    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors flex items-center justify-center">
                      <ZoomIn className="text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity" size={32} />
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-panel rounded-3xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors">
                <X size={20} />
              </button>
              <div className={`aspect-video rounded-2xl bg-gradient-to-br ${colors[lightbox % 3]} flex items-center justify-center mb-4`}>
                <span className="text-foreground/60 font-display font-bold text-xl">
                  {galleryImages.find(g => g.id === lightbox)?.title}
                </span>
              </div>
              <p className="font-display font-semibold">{galleryImages.find(g => g.id === lightbox)?.title}</p>
              <p className="text-sm text-muted-foreground">{galleryImages.find(g => g.id === lightbox)?.category}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <FloatingActions />
    </PageLayout>
  );
};

export default GalleryPage;
