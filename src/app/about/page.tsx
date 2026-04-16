'use client';

import PageLayout from '@/components/PageLayout';
import { FloatingActions } from '@/components/FloatingActions';
import { SectionHeading } from '@/components/SectionHeading';
import { ScrollReveal } from '@/components/ScrollReveal';
import { GraduationCap, Award, Users, BookOpen } from 'lucide-react';
import { collegeInfo } from '@/data/mockData';

const AboutPage = () => {
  return (
    <PageLayout>
      <div className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="About Us" subtitle="Learn about Karyon College of Paramedical Science" />
          
          <ScrollReveal>
            <div className="max-w-4xl mx-auto">
              <div className="glass-panel rounded-2xl p-8 mb-12">
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground mb-6">
                  {collegeInfo.description}
                </p>
                <p className="text-muted-foreground">
                  We are committed to providing quality education in paramedical sciences, 
                  equipping students with the knowledge and skills needed to excel in their careers.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {[
                  { icon: GraduationCap, title: "Expert Faculty", description: "Experienced educators dedicated to your success" },
                  { icon: Award, title: "Certified Programs", description: "Recognized qualifications and certifications" },
                  { icon: Users, title: "Small Classes", description: "Personalized attention for every student" },
                  { icon: BookOpen, title: "Comprehensive Curriculum", description: "Up-to-date course materials and methods" }
                ].map((feature, i) => (
                  <ScrollReveal key={feature.title} delay={i * 0.1}>
                    <div className="glass-panel rounded-2xl p-6 text-center">
                      <div className="w-12 h-12 rounded-xl gradient-primary-bg flex items-center justify-center mx-auto mb-4">
                        <feature.icon size={24} className="text-primary-foreground" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>

              <div className="glass-panel rounded-2xl p-8">
                <h2 className="text-2xl font-bold mb-4">Our History</h2>
                <p className="text-muted-foreground mb-4">
                  Established in {collegeInfo.established}, Karyon College has been a leader in 
                  paramedical education for over two decades.
                </p>
                <p className="text-muted-foreground">
                  We have successfully trained hundreds of students who are now working in 
                  prestigious healthcare institutions across the country.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
      <FloatingActions />
    </PageLayout>
  );
};

export default AboutPage;
