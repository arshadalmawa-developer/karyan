'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { PageLayout } from '@/components/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { FloatingActions } from '@/components/FloatingActions';
import { collegeInfo } from '@/data/mockData';
import { toast } from 'sonner';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! We will contact you soon.');
    setForm({ name: '', email: '', phone: '', message: '' });
  };

  return (
    <PageLayout>
      <section className="py-20 mesh-bg">
        <div className="container mx-auto px-4">
          <SectionHeading title="Contact Us" subtitle="Get in touch with us for any queries or information" />

          <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Info */}
            <div className="space-y-6">
              {[
                { icon: Phone, label: "Phone", value: collegeInfo.phone, href: `tel:${collegeInfo.phone}` },
                { icon: Mail, label: "Email", value: collegeInfo.email, href: `mailto:${collegeInfo.email}` },
                { icon: MapPin, label: "Address", value: collegeInfo.address },
              ].map((c, i) => (
                <ScrollReveal key={c.label} delay={i * 0.1} direction="left">
                  <motion.div whileHover={{ x: 5 }} className="glass-panel rounded-2xl p-6 flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-primary-bg flex items-center justify-center shrink-0">
                      <c.icon size={22} className="text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{c.label}</p>
                      {c.href ? (
                        <a href={c.href} className="font-semibold hover:text-primary transition-colors">{c.value}</a>
                      ) : (
                        <p className="font-semibold">{c.value}</p>
                      )}
                    </div>
                  </motion.div>
                </ScrollReveal>
              ))}

              {/* Map Placeholder */}
              <ScrollReveal delay={0.3} direction="left">
                <div className="glass-panel rounded-2xl p-2 aspect-video flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                  <div className="text-center">
                    <MapPin size={40} className="text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Google Map Placeholder</p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Form */}
            <ScrollReveal direction="right">
              <form onSubmit={handleSubmit} className="glass-panel rounded-2xl p-8">
                <h3 className="font-display font-bold text-xl mb-6 gradient-text">Send us a Message</h3>
                <div className="space-y-4">
                  {[
                    { name: 'name', type: 'text', placeholder: 'Your Name', required: true },
                    { name: 'email', type: 'email', placeholder: 'Your Email', required: true },
                    { name: 'phone', type: 'tel', placeholder: 'Phone Number', required: false },
                  ].map(f => (
                    <input
                      key={f.name}
                      type={f.type}
                      placeholder={f.placeholder}
                      required={f.required}
                      value={form[f.name as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm"
                    />
                  ))}
                  <textarea
                    placeholder="Your Message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors text-sm resize-none"
                  />
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full gradient-primary-bg text-primary-foreground py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
                  >
                    <Send size={18} /> Send Message
                  </motion.button>
                </div>
              </form>
            </ScrollReveal>
          </div>
        </div>
      </section>
      <FloatingActions />
    </PageLayout>
  );
};

export default ContactPage;
