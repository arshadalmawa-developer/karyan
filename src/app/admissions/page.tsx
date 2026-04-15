'use client';

import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { PageLayout } from '@/components/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { FloatingActions } from '@/components/FloatingActions';
import { admissionSteps } from '@/data/mockData';

const AdmissionsPage = () => (
  <PageLayout>
    <section className="py-20 mesh-bg">
      <div className="container mx-auto px-4">
        <SectionHeading title="Admissions" subtitle="Join our growing community of future healthcare professionals" />

        {/* Steps */}
        <div className="max-w-3xl mx-auto mb-16">
          {admissionSteps.map((s, i) => (
            <ScrollReveal key={s.step} delay={i * 0.1}>
              <motion.div
                whileHover={{ x: 8 }}
                className="flex gap-4 mb-6 glass-panel rounded-2xl p-5 group"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl gradient-primary-bg flex items-center justify-center text-primary-foreground font-bold font-display group-hover:scale-110 transition-transform">
                  {s.step}
                </div>
                <div>
                  <h3 className="font-display font-bold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.description}</p>
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>

        {/* Eligibility */}
        <ScrollReveal>
          <div className="glass-panel rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
            <h3 className="font-display font-bold text-2xl gradient-text mb-6">Eligibility Criteria</h3>
            <div className="space-y-3">
              {[
                "Passed 10+2 with Physics, Chemistry, and Biology",
                "Minimum 50% aggregate marks (45% for reserved categories)",
                "Valid entrance exam score (if applicable)",
                "Age: 17 years or above at the time of admission",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3"
                >
                  <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 gradient-primary-bg text-primary-foreground px-8 py-3 rounded-xl font-semibold mt-8 hover:opacity-90 transition-opacity"
            >
              Apply Now <ArrowRight size={18} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
    <FloatingActions />
  </PageLayout>
);

export default AdmissionsPage;
