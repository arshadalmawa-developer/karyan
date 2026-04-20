'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Send } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { ScrollReveal } from '@/components/ScrollReveal';
import { SectionHeading } from '@/components/SectionHeading';
import { FloatingActions } from '@/components/FloatingActions';
import MapSection from '@/components/MapSection';
import { contentStorage } from '@/utils/contentStorage';
import { toast } from 'sonner';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [content, setContent] = useState({
    phone: '',
    email: '',
    address: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load content from MongoDB
    const loadContent = async () => {
      try {
        const contentData = await contentStorage.getContent();
        setContent({
          phone: contentData.phone || '',
          email: contentData.email || '',
          address: contentData.address || ''
        });
      } catch (error) {
        console.error('Error loading content:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadContent();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...form, source: 'contact' }),
      });

      if (response.ok) {
        toast.success('Message sent successfully! We will contact you soon.');
        setForm({ name: '', email: '', phone: '', message: '' });
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to send message');
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading contact information...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <section className="py-12 mesh-bg">
        <div className="container mx-auto px-4">
          <SectionHeading title="Contact Us" subtitle="Get in touch with us for any queries or information" />

          <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Info */}
            <div className="space-y-6">
              {[
                { icon: Phone, label: "Phone", value: content.phone, href: `tel:${content.phone}` },
                { icon: Mail, label: "Email", value: content.email, href: `mailto:${content.email}` },
                { icon: MapPin, label: "Address", value: content.address },
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
                      onChange={(e) => setForm(prev => ({ ...prev, [f.name]: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-colors"
                    />
                  ))}
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm(prev => ({ ...prev, message: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition-colors resize-none"
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

      {/* Google Maps Section */}
      <section className="py-16 mesh-bg">
        <div className="mx-auto max-w-6xl px-4">
          <ScrollReveal delay={0.3} direction="up">
            <MapSection 
              location="KARYON GROUP OF INSTITUTION, Chandan Nagar, Pune, Maharashtra"
              coordinates="22.0621138,78.9374201"
              height="h-[450px]"
              className="w-full rounded-xl overflow-hidden shadow-lg"
            />
          </ScrollReveal>
        </div>
      </section>

      <FloatingActions />
    </PageLayout>
  );
};

export default ContactPage;
