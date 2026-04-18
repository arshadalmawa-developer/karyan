import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { collegeInfo } from '@/data/mockData';

export const Footer = () => (
  <footer className="bg-card border-t border-border">
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-display font-bold text-lg gradient-text mb-3">Karyon College</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{collegeInfo.description.slice(0, 120)}...</p>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Quick Links</h4>
          <div className="space-y-2">
            {['About', 'Courses', 'Facilities', 'Admissions', 'Contact'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{l}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Courses</h4>
          <div className="space-y-2">
            {['BSC', 'BCOM', 'BMLT', 'DMLT'].map(c => (
              <Link key={c} href="/courses" className="block text-sm text-muted-foreground hover:text-primary transition-colors">{c}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold mb-3">Contact</h4>
          <div className="space-y-3">
            <a href="tel:8989115868" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone size={14} /> 8989115868
            </a>
            <a href="tel:6262586862" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Phone size={14} /> 6262586862
            </a>
            <a href={`mailto:${collegeInfo.email}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail size={14} /> {collegeInfo.email}
            </a>
            <p className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin size={14} className="mt-0.5 shrink-0" /> {collegeInfo.address}
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Karyon College Of Paramedical Science. All rights reserved.
      </div>
    </div>
  </footer>
);
