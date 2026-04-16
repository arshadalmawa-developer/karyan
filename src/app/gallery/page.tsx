'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { FloatingActions } from '@/components/FloatingActions';
import { galleryStorage } from '@/utils/galleryStorage';

const colors = [
  'from-primary/30 to-secondary/30',
  'from-secondary/30 to-primary/30',
  'from-primary/20 to-accent/20',
];

const GalleryPage = () => {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [filter, setFilter] = useState('All');
  const [galleryImages, setGalleryImages] = useState<any[]>([]);

  useEffect(() => {
    // Load gallery images from storage
    const loadGalleryImages = async () => {
      if (typeof window !== 'undefined') {
        try {
          const images = await galleryStorage.getGalleryImages();
          setGalleryImages(images);
        } catch (error) {
          console.error('Failed to load gallery images:', error);
        }
      }
    };
    
    loadGalleryImages();
  }, []);

  useEffect(() => {
    // Listen for storage changes to refresh gallery
    const handleStorageChange = async () => {
      try {
        const images = await galleryStorage.getGalleryImages();
        setGalleryImages(images);
      } catch (error) {
        console.error('Failed to refresh gallery images:', error);
      }
    };

    // Custom event for MongoDB updates
    if (typeof window !== 'undefined') {
      window.addEventListener('mongodb-gallery-update', handleStorageChange);
      return () => window.removeEventListener('mongodb-gallery-update', handleStorageChange);
    }
  }, []);

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
                    className={`relative rounded-2xl overflow-hidden cursor-pointer group aspect-square ${img.imageUrl ? '' : `bg-gradient-to-br ${colors[i % 3]}`}`}
                  >
                    {img.imageUrl ? (
                      <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-foreground/60 font-display font-bold text-lg">{img.title}</span>
                      </div>
                    )}
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
            {/* X button on the overlay background */}
            <button 
              onClick={() => setLightbox(null)} 
              className="absolute top-4 right-4 p-3 rounded-full bg-background/80 text-foreground hover:bg-background transition-colors z-50"
              title="Close"
            >
              <X size={24} />
            </button>
            
            <motion.div
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="glass-panel rounded-3xl p-8 max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={`aspect-video rounded-2xl ${galleryImages.find(g => g.id === lightbox)?.imageUrl ? '' : `bg-gradient-to-br ${colors[lightbox % 3]}`} flex items-center justify-center mb-4`}>
                {galleryImages.find(g => g.id === lightbox)?.imageUrl ? (
                  <img src={galleryImages.find(g => g.id === lightbox)?.imageUrl} alt={galleryImages.find(g => g.id === lightbox)?.title} className="w-full h-full object-cover rounded-2xl" />
                ) : (
                  <span className="text-foreground/60 font-display font-bold text-xl">
                    {galleryImages.find(g => g.id === lightbox)?.title}
                  </span>
                )}
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
