'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Users, X } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { FloatingActions } from '@/components/FloatingActions';
import { courseStorage } from '@/utils/courseStorage';

const CoursesPage = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await courseStorage.getCourses();
        setCourses(coursesData);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCourses();
  }, []);

  return (
    <PageLayout>
      <section className="py-20 mesh-bg">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Courses" subtitle="Comprehensive paramedical programs designed for successful healthcare careers" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              // Loading state
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="glass-panel rounded-2xl p-6 h-full">
                  <div className="animate-pulse">
                    <div className="w-12 h-12 rounded-xl bg-muted mb-4"></div>
                    <div className="h-6 bg-muted rounded mb-2"></div>
                    <div className="h-4 bg-muted rounded mb-4"></div>
                    <div className="flex gap-4">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : courses.length > 0 ? (
              courses.map((course, i) => (
              <ScrollReveal key={course._id} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.04, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() => setSelected(course)}
                  className="glass-panel rounded-2xl p-6 cursor-pointer group h-full"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary-bg flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <BookOpen size={22} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2 group-hover:text-primary transition-colors">{course.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
                    <span className="flex items-center gap-1"><Users size={12} />{course.seats} Seats</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))) : (
              // Empty state
              <div className="col-span-full text-center py-12">
                <div className="w-16 h-16 rounded-xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
                  <BookOpen size={24} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No Courses Available</h3>
                <p className="text-muted-foreground">No courses have been added yet. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Course Detail Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-panel rounded-3xl p-8 max-w-lg w-full relative"
            >
              <button onClick={() => setSelected(null)} className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors">
                <X size={20} />
              </button>
              <div className="w-16 h-16 rounded-2xl gradient-primary-bg flex items-center justify-center mb-6">
                <BookOpen size={28} className="text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-display font-bold mb-3">{selected.name}</h2>
              <p className="text-muted-foreground mb-6">{selected.description}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-panel rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-bold gradient-text">{selected.duration}</p>
                </div>
                <div className="glass-panel rounded-xl p-4 text-center">
                  <p className="text-xs text-muted-foreground">Available Seats</p>
                  <p className="font-bold gradient-text">{selected.seats}</p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-full mt-6 gradient-primary-bg text-primary-foreground py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity"
              >
                Apply for this Course
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <FloatingActions />
    </PageLayout>
  );
};

export default CoursesPage;
