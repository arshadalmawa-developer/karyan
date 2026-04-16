import { ReactNode } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { ScrollProgress } from './ScrollProgress';

const PageLayout: React.FC<{ children: ReactNode }> = ({ children }) => (
  <>
    <ScrollProgress />
    <Navbar />
    <main className="min-h-screen pt-16">
      {children}
    </main>
    <Footer />
  </>
);

export default PageLayout;
