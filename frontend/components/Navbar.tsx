import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, Archive, PenTool, MessageSquare, BookOpen, Library } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import MagneticWrapper from './MagneticWrapper';
import { fetchHeadlines, searchAllQuery } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { Languages } from 'lucide-react';

interface NavbarProps {
  isScrolled: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: t('portfolio'), href: '/' },
    { name: t('biography'), href: '/about' },
    { name: t('itinerary'), href: '/travels' },
    {
      name: t('pensieve'),
      href: '/journal',
      type: 'mega',
      dropdown: [
        { name: t('editorials'), href: '/journal', icon: <PenTool size={18} />, desc: t('editorials_desc') },
        { name: t('opinions'), href: '/opinions', icon: <MessageSquare size={18} />, desc: t('opinions_desc') },
        { name: t('stories'), href: '/stories', icon: <BookOpen size={18} />, desc: t('stories_desc') },
        { name: t('archives'), href: '/archives', icon: <Archive size={18} />, desc: t('archives_desc') },
        { name: t('intellectual'), href: '/intellectual-archive', icon: <Library size={18} />, desc: t('intellectual_desc') },
      ],
    },
    { name: t('gallery'), href: '/gallery' },
    { name: t('contact'), href: '/contact' },
    { name: t('support'), href: '/donate' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return location.pathname === '/';
    return location.pathname.startsWith(href);
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch Headlines with TanStack
  const { data: headlines = [] } = useQuery({
    queryKey: ['headlines'],
    queryFn: fetchHeadlines
  });

  // Search Query with Debounce handled by TanStack Query
  const { data: searchResults = { articles: [], books: [] }, isFetching: isSearching } = useQuery({
    queryKey: ['search', searchQuery, language],
    queryFn: () => searchAllQuery(searchQuery, language),
    enabled: searchQuery.length > 2,
    staleTime: 1000 * 60 * 5 // Cache search results for 5 minutes
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-700 ${isScrolled
        ? 'py-4 bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-sm'
        : 'py-8 bg-transparent'
        }`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">

          {/* PERSONAL BRANDING */}
          <Link to="/" className="flex flex-col group relative">
            <span className={`font-heading text-2xl md:text-3xl font-black leading-none tracking-tighter uppercase transition-colors group-hover:text-accent ${location.pathname === '/travels' && !isScrolled ? 'text-white' : 'text-primary'
              }`}>
              SHRIDHAR <span className="text-accent group-hover:text-primary">RAO</span>
            </span>
            <span className="text-[8px] md:text-[9px] tracking-[0.5em] font-black text-slate-500 uppercase mt-2 transition-all group-hover:text-primary text-center">
              CHRONICLES OF INTEGRITY
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden xl:flex items-center gap-6">
            {navLinks.map((link) => (
              <div
                key={link.name}
                className="relative"
                onMouseEnter={() => (link.dropdown || link.type === 'mega') && setActiveDropdown(link.name)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <MagneticWrapper strength={20}>
                  <Link
                    to={link.href}
                    className={`px-3 py-2 text-[11px] font-black transition-all uppercase tracking-[0.25em] flex items-center gap-2 ${isActive(link.href)
                      ? (location.pathname === '/travels' && !isScrolled ? 'text-accent' : 'text-primary')
                      : (location.pathname === '/travels' && !isScrolled ? 'text-white/70 hover:text-white' : 'text-slate-600 hover:text-primary')
                      }`}
                  >
                    {link.name}
                    {(link.dropdown || link.type === 'mega') && (
                      <ChevronDown size={12} className={`text-slate-300 transition-transform duration-300 ${activeDropdown === link.name ? 'rotate-180 text-accent' : ''}`} />
                    )}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: isActive(link.href) ? 1 : 0 }}
                      className="absolute -bottom-1 left-3 right-3 h-0.5 bg-accent origin-left"
                    />
                  </Link>
                </MagneticWrapper>

                {/* Mega Menu */}
                <AnimatePresence>
                  {activeDropdown === link.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className={`absolute top-full left-1/2 -translate-x-1/2 bg-white rounded-3xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] border border-slate-50 overflow-hidden mt-4 ${link.type === 'mega' ? 'w-[560px]' : 'w-48'
                        }`}
                    >
                      <div className="p-8">
                        <div className="grid grid-cols-2 gap-8">
                          {link.dropdown?.map((item: any) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="flex items-start gap-4 group/item"
                            >
                              <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover/item:text-accent group-hover/item:bg-accent/5 transition-all">
                                {item.icon}
                              </div>
                              <div>
                                <h5 className="text-sm font-black text-primary mb-1">{item.name}</h5>
                                <p className="text-[10px] text-slate-600 font-bold leading-relaxed uppercase tracking-wider">{item.desc}</p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}

            <div className="h-4 w-[1px] bg-slate-200 mx-2"></div>

            <MagneticWrapper strength={15}>
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-slate-100 group"
              >
                <Languages size={14} className="text-accent group-hover:rotate-12 transition-transform" />
                <span className={`text-[10px] font-black uppercase tracking-widest ${location.pathname === '/travels' && !isScrolled ? 'text-white' : 'text-primary'
                  }`}>
                  {language === 'en' ? 'हिन्दी' : 'English'}
                </span>
              </button>
            </MagneticWrapper>

            <MagneticWrapper strength={15}>
              <button onClick={() => setIsSearchOpen(true)} className={`p-3 transition-all flex items-center gap-3 ${location.pathname === '/travels' && !isScrolled ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-primary'
                }`}>
                <Search size={18} />
                <span className={`text-[9px] font-black tracking-widest uppercase hidden lg:block border px-2 py-1 rounded-lg ${location.pathname === '/travels' && !isScrolled ? 'border-white/20 text-white/40' : 'border-slate-100 text-slate-200 group-hover:text-primary'
                  }`}>⌘ K</span>
              </button>
            </MagneticWrapper>
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setIsOpen(!isOpen)} className="xl:hidden p-3 bg-slate-50 text-primary rounded-2xl">
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 100 }}
              className="fixed inset-0 bg-white z-[150] flex flex-col p-12"
            >
              <div className="flex justify-between items-center mb-20">
                <span className="font-heading text-xl font-black italic uppercase">The Index</span>
                <button onClick={() => setIsOpen(false)} className="p-4 bg-slate-50 rounded-2xl"><X size={24} /></button>
              </div>
              <div className="flex flex-col gap-8">
                {navLinks.map(l => (
                  <Link key={l.name} to={l.href} onClick={() => setIsOpen(false)} className="text-4xl font-black text-primary hover:text-accent transition-colors">
                    {l.name}
                  </Link>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-4">
                  <BookOpen size={24} />
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase">Shridhar Rao Journal</span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest">© 2026</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* 3. FULL-SCREEN SEARCH TERMINAL */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[5000] search-backdrop flex flex-col items-center justify-center p-6 md:p-12 lg:p-24"
          >
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-12 right-12 p-4 bg-primary text-white rounded-2xl hover:bg-accent transition-all"
            >
              <X size={24} />
            </button>

            <div className="w-full max-w-4xl space-y-12">
              <div className="flex flex-col gap-4 text-center">
                <span className="text-accent font-black tracking-[0.5em] uppercase text-[10px]">{t('intellectual_archive_query')}</span>
                <h2 className="font-heading text-4xl lg:text-6xl font-black text-primary tracking-tighter italic">{t('search_title')}</h2>
              </div>

              <div className="relative group">
                <Search className={`absolute left-8 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-accent animate-pulse' : 'text-slate-200 group-hover:text-accent'}`} size={32} />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={t('search_placeholder')}
                  className="w-full px-20 py-10 bg-white shadow-2xl rounded-[40px] border border-slate-100 outline-none text-2xl font-black text-primary placeholder:text-slate-100 focus:ring-1 focus:ring-accent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 h-[400px] overflow-y-auto no-scrollbar">
                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Article Dispatches</h4>
                  <div className="space-y-4">
                    {searchResults.articles.length > 0 ? searchResults.articles.map(article => (
                      <Link key={article.id} to={`/journal/${article.id}`} onClick={() => setIsSearchOpen(false)} className="block p-4 bg-white rounded-2xl hover:border-accent border border-transparent transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[8px] font-black uppercase text-accent px-2 py-0.5 bg-accent/10 rounded-full">{article.category}</span>
                          <span className="text-[8px] font-bold text-slate-400">{article.date}</span>
                        </div>
                        <h5 className="font-bold text-primary group-hover:text-accent transition-colors">{article.title}</h5>
                      </Link>
                    )) : (
                      <div className="text-slate-400 text-sm italic py-4">
                        {searchQuery.length > 2 ? "No dispatches found in this sector." : "Enter query to begin transmission..."}
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-8 bg-slate-50/50 rounded-3xl border border-slate-50">
                  <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-6">Archive Intellectual Reflections</h4>
                  <div className="space-y-4">
                    {searchResults.books.length > 0 ? searchResults.books.map(book => (
                      <Link key={book.id} to={`/reflection/${book.id}`} onClick={() => setIsSearchOpen(false)} className="flex items-center gap-4 p-4 bg-white rounded-2xl hover:border-accent border border-transparent transition-all group">
                        <div className="w-12 h-16 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={book.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <h5 className="font-bold text-primary group-hover:text-accent transition-colors text-sm">{book.title}</h5>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{book.author}</p>
                        </div>
                      </Link>
                    )) : (
                      <div className="text-slate-400 text-sm italic py-4">
                        {searchQuery.length > 2 ? "No intellectual reflections found." : "Waiting for decryption..."}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-8">
                <p className="text-[10px] font-black text-slate-200 uppercase tracking-[0.4em]">Integrated Archive Search v4.2 • ⌘ K to Invoke</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;