'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, BookOpen, Stethoscope, Award, ChevronDown, Quote, X, Mail, User, MessageSquare } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { LoadingScreen } from '@/components/LoadingScreen';
import { FloatingActions } from '@/components/FloatingActions';
import { stats, facilities, collegeInfo } from '@/data/mockData';
import { courseStorage } from '@/utils/courseStorage';
import { enquiryStorage } from '@/utils/enquiryStorage';
import { facilityStorage } from '@/utils/facilityStorage';
import heroBg from '@/assets/hero-bg.jpg';

// Helper function to organize courses into categories
const organizeCourses = (courses: any[]) => {
  const bscCourses = courses.filter(course => course.category === 'BSC').slice(0, 4);
  const bcomCourses = courses.filter(course => course.category === 'BCOM').slice(0, 3);
  const bmltCourses = courses.filter(course => course.category === 'BMLT').slice(0, 3);
  const dmltCourses = courses.filter(course => course.category === 'DMLT').slice(0, 3);
  const upcomingCourses = courses.filter(course => course.category === 'Upcoming').slice(0, 3);

  return [
    {
      id: 'bsc',
      name: "BSC Programs",
      description: "Bachelor of Science programs",
      icon: "GraduationCap",
      courses: bscCourses
    },
    {
      id: 'bcom',
      name: "BCOM Programs", 
      description: "Bachelor of Commerce programs",
      icon: "Briefcase",
      courses: bcomCourses
    },
    {
      id: 'bmlt',
      name: "BMLT Programs",
      description: "Bachelor of Medical Laboratory Technology programs",
      icon: "Stethoscope",
      courses: bmltCourses
    },
    {
      id: 'dmlt',
      name: "DMLT Programs",
      description: "Diploma in Medical Laboratory Technology programs",
      icon: "Award",
      courses: dmltCourses
    },
    {
      id: 'upcoming',
      name: "Upcoming Programs",
      description: "Future programs launching soon",
      icon: "TrendingUp",
      courses: upcomingCourses
    }
  ];
};

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [facilitiesData, setFacilitiesData] = useState<any[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<any | null>(null);
  const [facilityModal, setFacilityModal] = useState(false);
  const [coursesData, setCoursesData] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const heroRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    // Only show loading screen on first visit
    const hasLoaded = sessionStorage.getItem('app-loaded');
    if (hasLoaded) {
      setLoading(false);
    }

    // Fetch testimonials from API
    const fetchTestimonials = async () => {
      try {
        const response = await fetch('/api/testimonials');
        if (response.ok) {
          const testimonialsData = await response.json();
          setTestimonials(testimonialsData);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
      }
    };

    fetchTestimonials();
  }, []);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const coursesData = await courseStorage.getCourses();
        setCoursesData(coursesData);
      } catch (error) {
        console.error('Error loading courses:', error);
      }
    };
    
    if (mounted) {
      loadCourses();
    }
  }, [mounted]);

  useEffect(() => {
    // Show popup after a short delay if not already shown
    if (mounted && !loading) {
      const popupShown = sessionStorage.getItem('popup-shown');
      if (!popupShown) {
        setTimeout(() => {
          setShowPopup(true);
        }, 2000); // Show after 2 seconds
      }
    }
  }, [mounted, loading]);

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
    
    if (mounted) {
      loadFacilities();
    }
  }, [mounted]);

  const viewFacility = (facility: any) => {
    setSelectedFacility(facility);
    setFacilityModal(true);
  };

  
  const handleFinish = useCallback(() => {
    setLoading(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('app-loaded', 'true');
    }
  }, []);

  const handlePopupClose = useCallback(() => {
    setShowPopup(false);
    sessionStorage.setItem('popup-shown', 'true');
  }, []);

  const handleFormSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Submit enquiry to API
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message || 'Quick enquiry from homepage popup',
          source: 'popup'
        }),
      });

      if (response.ok) {
        console.log('Enquiry submitted:', formData);
        setShowPopup(false);
        sessionStorage.setItem('popup-shown', 'true');
        setFormData({ name: '', email: '', message: '' });
        // Show success message
        alert('Enquiry submitted successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit enquiry. Please try again.');
      }
    } catch (error) {
      console.error('Failed to submit enquiry:', error);
      alert('Failed to submit enquiry. Please try again.');
    }
  }, [formData]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  // Don't render anything until mounted to prevent hydration mismatch
  if (!mounted) {
    return null;
  }

  if (loading) {
    return <LoadingScreen onFinish={handleFinish} />;
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="fixed inset-0 bg-center bg-cover bg-no-repeat -z-10" style={{ backgroundImage: `url(${heroBg.src})`, filter: 'brightness(1.3)' }}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 mesh-bg" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-6 shadow-lg"
            >
              <GraduationCap size={16} className="text-primary" />
              <span className="text-sm font-medium text-white">Established {collegeInfo.established}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold leading-tight mb-6 drop-shadow-lg"
            >
              <span className="gradient-text">Karyon College</span>
              <br />
              <span className="text-white">Of Paramedical Science</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-white mb-8 max-w-xl drop-shadow"
            >
              {collegeInfo.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/courses" className="inline-flex items-center gap-2 gradient-primary-bg text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg">
                Explore Courses <ArrowRight size={18} />
              </Link>
              <Link href="/admissions" className="inline-flex items-center gap-2 glass-panel px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg">
                Apply Now
              </Link>
            </motion.div>
          </div>
        </div>

        
                      </section>

      {/* Stats */}
      <section className="py-16 mesh-bg">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map((s, i) => (
              <AnimatedCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Courses" subtitle="Explore our comprehensive range of paramedical programs" />
          <div className="grid md:grid-cols-2 gap-6">
            {organizeCourses(coursesData).map((category, i) => (
              <ScrollReveal key={category.id} delay={i * 0.1}>
                <Link href="/courses">
                  <motion.div
                    whileHover={{ scale: 1.03, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="glass-panel rounded-2xl p-6 h-full cursor-pointer group"
                  >
                    <div className="w-12 h-12 rounded-xl gradient-primary-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      {category.icon === "GraduationCap" ? <GraduationCap size={22} className="text-primary-foreground" /> : <Award size={22} className="text-primary-foreground" />}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-display font-bold text-lg">{category.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.id === 'bsc' ? 'bg-blue-100 text-blue-800' :
                        category.id === 'bcom' ? 'bg-green-100 text-green-800' :
                        category.id === 'bmlt' ? 'bg-purple-100 text-purple-800' :
                        category.id === 'dmlt' ? 'bg-orange-100 text-orange-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {category.id === 'bsc' ? 'BSC' :
                         category.id === 'bcom' ? 'BCOM' :
                         category.id === 'bmlt' ? 'BMLT' :
                         category.id === 'dmlt' ? 'DMLT' :
                         'Upcoming'}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{category.courses.length} Programs Available</span>
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/courses" className="inline-flex items-center gap-2 text-white font-semibold hover:gap-3 transition-all">
              View All Courses <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Facilities Preview */}
      <section className="py-20 mesh-bg">
        <div className="container mx-auto px-4">
          <SectionHeading title="Our Facilities" subtitle="State-of-the-art infrastructure for quality education" />
          <div className="grid md:grid-cols-3 gap-6">
            {facilitiesData.slice(0, 3).map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 0.15} direction="scale">
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass-panel rounded-2xl p-8 text-center group cursor-pointer"
                  onClick={() => viewFacility(f)}
                >
                  <div className="w-16 h-16 rounded-2xl gradient-primary-bg flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform">
                    <GraduationCap size={28} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
            {facilitiesData.length === 0 && (
              <div className="col-span-full text-center py-12">
                <p className="text-white">No facilities added yet. Please check back later.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 overflow-hidden">
        <div className="container mx-auto px-4">
          <SectionHeading title="Student Testimonials" subtitle="Hear from our successful graduates" />
          
          {/* Auto-swiping carousel */}
          <div className="relative">
            <div className="flex gap-6 animate-scroll">
              {/* First set of testimonials */}
              {testimonials.map((t, i) => (
                <div key={`first-${t.id}`} className="min-w-[400px] md:min-w-[500px]">
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    className="glass-panel rounded-2xl p-6 relative h-full"
                  >
                    <Quote size={32} className="text-primary/20 absolute top-4 right-4" />
                    <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary-bg flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.course} - {t.year}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
              {/* Duplicate set for seamless looping */}
              {testimonials.map((t, i) => (
                <div key={`second-${t.id}`} className="min-w-[400px] md:min-w-[500px]">
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    className="glass-panel rounded-2xl p-6 relative h-full"
                  >
                    <Quote size={32} className="text-primary/20 absolute top-4 right-4" />
                    <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full gradient-primary-bg flex items-center justify-center text-primary-foreground font-bold text-sm">
                        {t.avatar}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.course} - {t.year}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Facility Details Modal */}
      <AnimatePresence>
        {facilityModal && selectedFacility && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/80"
            onClick={() => setFacilityModal(false)}
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
                  onClick={() => setFacilityModal(false)} 
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{selectedFacility.title}</h3>
                  <p className="text-muted-foreground">{selectedFacility.description}</p>
                </div>
              
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Added Date</h4>
                  <p className="font-semibold">{selectedFacility.addedDate}</p>
                </div>
              </div>
              
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setFacilityModal(false)}
                  className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="gradient-primary-bg rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -top-20 -right-20 w-60 h-60 border border-primary-foreground/10 rounded-full"
              />
              <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-4">
                Ready to Start Your Journey?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
                Join Karyon College and build a rewarding career in paramedical science.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/admissions" className="bg-primary-foreground text-primary px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                  Apply Now
                </Link>
                <a href="tel:8460401798" className="border border-primary-foreground/30 text-primary-foreground px-8 py-3 rounded-xl font-semibold hover:bg-primary-foreground/10 transition-colors">
                  Call: 8460401798
                </a>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
      
      {/* Enquiry Popup */}
      {showPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-background rounded-2xl p-6 max-w-md w-full shadow-2xl border"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold font-display">Quick Enquiry</h3>
              <button
                onClick={handlePopupClose}
                className="p-1 rounded-lg hover:bg-muted transition-colors"
              >
                <X size={20} className="text-muted-foreground" />
              </button>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Get in touch with us for more information about our courses and admission process.
            </p>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  <User size={16} className="inline mr-1" />
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  <Mail size={16} className="inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900 placeholder-gray-400 bg-white"
                  placeholder="Enter your email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  <MessageSquare size={16} className="inline mr-1" />
                  Message (Optional)
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none text-gray-900 placeholder-gray-400 bg-white"
                  placeholder="Tell us about your interests or any specific questions..."
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 gradient-primary-bg text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Submit Enquiry
                </button>
                <button
                  type="button"
                  onClick={handlePopupClose}
                  className="flex-1 border border-border px-4 py-2 rounded-lg font-semibold hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      
      <FloatingActions />
    </PageLayout>
  );
};

export default HomePage;
