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

  // Helper function to get courses by category
  const getCoursesByCategory = (category: string) => {
    return courses.filter(course => course.category === category);
  };

  const categories = [
    { id: 'BSC', title: 'BSC - Bachelor of Science', color: 'bg-blue-100 text-blue-800' },
    { id: 'BCOM', title: 'BCOM - Bachelor of Commerce', color: 'bg-green-100 text-green-800' },
    { id: 'BMLT', title: 'BMLT - Bachelor of Medical Laboratory Technology', color: 'bg-purple-100 text-purple-800' },
    { id: 'DMLT', title: 'DMLT - Diploma in Medical Laboratory Technology', color: 'bg-orange-100 text-orange-800' },
    { id: 'UPCOMING', title: 'UPCOMING COURSES', color: 'bg-gray-100 text-gray-800' }
  ];

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
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
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
              ))}
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map(category => {
                const categoryCourses = getCoursesByCategory(category.id);
                return (
                  <div key={category.id} className="glass-panel rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-display font-bold">{category.title}</h2>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                        {categoryCourses.length} {categoryCourses.length === 1 ? 'Course' : 'Courses'}
                      </span>
                    </div>

                    {categoryCourses.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categoryCourses.map((course, i) => (
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
                              <p className="text-sm text-foreground mb-4">{course.description}</p>
                              <div className="flex items-center gap-4 text-xs text-foreground">
                                <span className="flex items-center gap-1"><Clock size={12} />{course.duration}</span>
                                <span className="flex items-center gap-1"><Users size={12} />{course.seats} Seats</span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${category.color}`}>
                                  {course.category}
                                </span>
                              </div>
                            </motion.div>
                          </ScrollReveal>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No courses available in this category</p>
                        <p className="text-sm text-muted-foreground mt-1">Check back later for new {category.title.split(' - ')[0]} courses.</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Course Details Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
              className="glass-panel rounded-2xl p-8 max-w-2xl w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-display font-bold">{selected.name}</h3>
                <button onClick={() => setSelected(null)}>
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="w-full h-48 rounded-xl overflow-hidden mb-4">
                  <img 
                    src={selected.image || '/placeholder-course.jpg'} 
                    alt={selected.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-foreground">{selected.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>{selected.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span>{selected.seats} Seats Available</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <FloatingActions />
    </PageLayout>
  );
};

export default CoursesPage;
