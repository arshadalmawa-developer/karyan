'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, BookOpen, GraduationCap, Monitor, Presentation, Users, X } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { FloatingActions } from '@/components/FloatingActions';
import { facilityStorage } from '@/utils/facilityStorage';

const iconMap: Record<string, React.ElementType> = {
  FlaskConical, BookOpen, GraduationCap, Monitor, Presentation, Users,
};

const FacilitiesPage = () => {
  const [facilitiesData, setFacilitiesData] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    // Load facilities from MongoDB
    const loadFacilities = async () => {
      try {
        const facilities = await facilityStorage.getFacilities();
        setFacilitiesData(facilities);
      } catch (error) {
        console.error('Error loading facilities:', error);
        setFacilitiesData([]);
      }
    };
    
    loadFacilities();
  }, []);

  const viewFacility = (facility: any) => {
    setSelectedFacility(facility);
    setModal(true);
  };

  return (
  <PageLayout>
    <section className="py-20 mesh-bg">
      <div className="container mx-auto px-4">
        <SectionHeading title="Our Facilities" subtitle="World-class infrastructure for an exceptional learning experience" />
        <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-300 ${modal ? 'blur-sm' : ''}`}>
          {facilitiesData.map((f, i) => {
            const Icon = iconMap[f.icon] || GraduationCap;
            return (
              <ScrollReveal key={f.id} delay={i * 0.12}>
                  <motion.div
                    whileHover={{ y: -10, scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`glass-panel rounded-2xl overflow-hidden group cursor-pointer h-full ${modal ? 'opacity-50' : ''}`}
                    onClick={() => viewFacility(f)}
                  >
                  <div className="h-48 rounded-2xl overflow-hidden flex items-center justify-center relative">
                    {f.image ? (
                      <img 
                        src={f.image} 
                        alt={f.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full gradient-primary-bg flex items-center justify-center relative overflow-hidden">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                          className="absolute w-40 h-40 border border-primary-foreground/10 rounded-full"
                        />
                        <Icon size={56} className="text-primary-foreground relative z-10 group-hover:scale-110 transition-transform" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl mb-2">{f.name}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
    
    {/* Facility Details Modal */}
    <AnimatePresence>
      {modal && selectedFacility && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80"
          onClick={() => setModal(false)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()}
            className="glass-panel rounded-3xl p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold">Facility Details</h2>
              <button 
                onClick={() => setModal(false)} 
                className="p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedFacility.name}</h3>
                <p className="text-muted-foreground">{selectedFacility.description}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Added Date</h4>
                <p className="font-semibold">{selectedFacility.addedDate}</p>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setModal(false)}
                className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <FloatingActions />
  </PageLayout>
  );
};

export default FacilitiesPage;
