import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import BackgroundMarquee from './components/BackgroundMarquee';
import { LanguageProvider } from './context/LanguageContext';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Lazy load
const Hero = lazy(() => import('./components/Hero'));
const About = lazy(() => import('./components/About'));
const ImpactHorizontal = lazy(() => import('./components/ImpactHorizontal'));
const ImpactVertical = lazy(() => import('./components/ImpactVertical'));
const GlobalPerspectives = lazy(() => import('./components/GlobalPerspectives'));
const ReadingRoom = lazy(() => import('./components/ReadingRoom'));
const EditorialsPage = lazy(() => import('./components/EditorialsPage'));
const ArticleDetail = lazy(() => import('./components/ArticleDetail'));
const PhotoGallery = lazy(() => import('./components/PhotoGallery'));
const Contact = lazy(() => import('./components/Contact'));
const OpinionsPage = lazy(() => import('./components/OpinionsPage'));
const StoriesPage = lazy(() => import('./components/StoriesPage'));
const ArchivesPage = lazy(() => import('./components/ArchivesPage'));
const ItineraryPage = lazy(() => import('./components/ItineraryPage'));
const DonationPage = lazy(() => import('./components/DonationPage'));
import { AdminPage } from './components/admin/AdminPage';

const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
};

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Scroll Reveal Observer
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    const revealedElements = document.querySelectorAll('.reveal');
    revealedElements.forEach(el => observer.observe(el));

    return () => {
      revealedElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);
};

const HomePage: React.FC = () => {
  useScrollReveal();
  return (
    <main className="flex flex-col bg-white">
      <Hero />
      <ImpactHorizontal />
      <ImpactVertical />
      <div className="bg-white">
        <GlobalPerspectives />
        <ReadingRoom />
        <Contact />
      </div>
    </main>
  );
};

const ReflectionPage = lazy(() => import('./components/ReflectionPage'));
const IntellectualArchivePage = lazy(() => import('./components/IntellectualArchivePage'));

const App: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <ScrollToTop />
          <CustomCursor />
          <BackgroundMarquee />
          <div className="flex flex-col min-h-screen bg-white">
            <ConditionalNavbar isScrolled={isScrolled} />

            <Suspense fallback={
              <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
              </div>
            }>
              <AnimatePresence mode="wait">
                <Routes>
                  <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
                  <Route path="/about" element={<PageTransition><About /></PageTransition>} />
                  <Route path="/journal" element={<PageTransition><EditorialsPage /></PageTransition>} />
                  <Route path="/gallery" element={<PageTransition><PhotoGallery /></PageTransition>} />
                  <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
                  <Route path="/opinions" element={<PageTransition><OpinionsPage /></PageTransition>} />
                  <Route path="/stories" element={<PageTransition><StoriesPage /></PageTransition>} />
                  <Route path="/archives" element={<PageTransition><ArchivesPage /></PageTransition>} />
                  <Route path="/travels" element={<PageTransition><ItineraryPage /></PageTransition>} />
                  <Route path="/journal/:id" element={<PageTransition><ArticleDetail /></PageTransition>} />
                  <Route path="/reflection/:id" element={<ReflectionPage />} />
                  <Route path="/intellectual-archive" element={<PageTransition><IntellectualArchivePage /></PageTransition>} />
                  <Route path="/donate" element={<PageTransition><DonationPage /></PageTransition>} />
                  <Route path="/admin" element={<AdminPage />} />
                  <Route path="*" element={<PageTransition><HomePage /></PageTransition>} />
                </Routes>
              </AnimatePresence>
            </Suspense>

            <ConditionalFooter />
          </div>
        </Router>
      </LanguageProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

const ConditionalNavbar: React.FC<{ isScrolled: boolean }> = ({ isScrolled }) => {
  const { pathname } = useLocation();
  if (pathname === '/admin') return null;
  return <Navbar isScrolled={isScrolled} />;
};

const ConditionalFooter: React.FC = () => {
  const { pathname } = useLocation();
  if (pathname === '/admin') return null;
  return <Footer />;
};

export default App;
