'use client';

import { motion } from 'framer-motion';
import { useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight, GraduationCap, BookOpen, Stethoscope, Award, ChevronDown, Quote } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { AnimatedCounter } from '@/components/AnimatedCounter';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { LoadingScreen } from '@/components/LoadingScreen';
import { FloatingActions } from '@/components/FloatingActions';
import { stats, courses, facilities, testimonials, collegeInfo } from '@/data/mockData';
import heroBg from '@/assets/hero-bg.jpg';

const HomePage = () => {
  const [loading, setLoading] = useState(() => {
    // Only show loading screen on first visit
    if (typeof window !== 'undefined') {
      return !sessionStorage.getItem('app-loaded');
    }
    return true;
  });
  const handleFinish = useCallback(() => {
    setLoading(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('app-loaded', 'true');
    }
  }, []);
  const heroRef = useRef(null);

  if (loading) {
    return <LoadingScreen onFinish={handleFinish} />;
  }

  return (
    <PageLayout>
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg.src} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-background/80 dark:bg-background/90" />
          <div className="absolute inset-0 mesh-bg" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 glass-panel px-4 py-2 rounded-full mb-6"
            >
              <GraduationCap size={16} className="text-primary" />
              <span className="text-sm font-medium">Established {collegeInfo.established}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-display font-extrabold leading-tight mb-6"
            >
              <span className="gradient-text">Karyon College</span>
              <br />
              <span className="text-foreground">Of Paramedical Science</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl"
            >
              {collegeInfo.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link href="/courses" className="inline-flex items-center gap-2 gradient-primary-bg text-primary-foreground px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Explore Courses <ArrowRight size={18} />
              </Link>
              <Link href="/admissions" className="inline-flex items-center gap-2 glass-panel px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors">
                Apply Now
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown size={24} className="text-muted-foreground" />
        </motion.div>

        {/* Floating elements */}
        <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 4, delay: 0.5 }} className="absolute top-1/4 right-[10%] glass-panel p-4 rounded-2xl hidden lg:flex items-center gap-3 z-10">
          <Stethoscope className="text-primary" size={24} />
          <div><p className="font-semibold text-sm">8+ Courses</p><p className="text-xs text-muted-foreground">Paramedical Programs</p></div>
        </motion.div>
        <motion.div animate={{ y: [0, -12, 0] }} transition={{ repeat: Infinity, duration: 3.5, delay: 1 }} className="absolute bottom-1/4 right-[20%] glass-panel p-4 rounded-2xl hidden lg:flex items-center gap-3 z-10">
          <Award className="text-secondary" size={24} />
          <div><p className="font-semibold text-sm">500+ Students</p><p className="text-xs text-muted-foreground">Enrolled</p></div>
        </motion.div>
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, i) => (
              <ScrollReveal key={course.id} delay={i * 0.1}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="glass-panel rounded-2xl p-6 h-full cursor-pointer group"
                >
                  <div className="w-12 h-12 rounded-xl gradient-primary-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen size={22} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{course.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Duration: {course.duration}</span>
                    <span>Seats: {course.seats}</span>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/courses" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
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
            {facilities.slice(0, 3).map((f, i) => (
              <ScrollReveal key={f.id} delay={i * 0.15} direction="scale">
                <motion.div
                  whileHover={{ y: -8 }}
                  className="glass-panel rounded-2xl p-8 text-center group"
                >
                  <div className="w-16 h-16 rounded-2xl gradient-primary-bg flex items-center justify-center mx-auto mb-4 group-hover:rotate-6 transition-transform">
                    <GraduationCap size={28} className="text-primary-foreground" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.description}</p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Student Testimonials" subtitle="Hear from our successful graduates" />
          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.1} direction={i % 2 === 0 ? 'left' : 'right'}>
                <motion.div whileHover={{ scale: 1.02 }} className="glass-panel rounded-2xl p-6 relative">
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
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

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
      <FloatingActions />
    </PageLayout>
  );
};

export default HomePage;
