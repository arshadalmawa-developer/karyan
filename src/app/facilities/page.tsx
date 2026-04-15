'use client';

import { motion } from 'framer-motion';
import { FlaskConical, BookOpen, GraduationCap, Monitor, Presentation, Users } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { FloatingActions } from '@/components/FloatingActions';
import { facilities } from '@/data/mockData';

const iconMap: Record<string, React.ElementType> = {
  FlaskConical, BookOpen, GraduationCap, Monitor, Presentation, Users,
};

const FacilitiesPage = () => (
  <PageLayout>
    <section className="py-20 mesh-bg">
      <div className="container mx-auto px-4">
        <SectionHeading title="Our Facilities" subtitle="World-class infrastructure for an exceptional learning experience" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((f, i) => {
            const Icon = iconMap[f.icon] || GraduationCap;
            return (
              <ScrollReveal key={f.id} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="glass-panel rounded-2xl overflow-hidden group cursor-pointer h-full"
                >
                  <div className="h-48 gradient-primary-bg flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                      className="absolute w-40 h-40 border border-primary-foreground/10 rounded-full"
                    />
                    <Icon size={56} className="text-primary-foreground relative z-10 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-xl mb-2">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.description}</p>
                  </div>
                </motion.div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
    <FloatingActions />
  </PageLayout>
);

export default FacilitiesPage;
