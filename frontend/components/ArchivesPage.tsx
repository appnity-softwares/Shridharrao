import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    ArrowUpRight,
    Library,
    Book,
    Tag,
    Clock,
    User
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchArticles, Article } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';

const ArchivesPage: React.FC = () => {
    const { language, t } = useLanguage();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    const { data: articles = [], isLoading } = useQuery({
        queryKey: ['articles', 'Archive', language],
        queryFn: () => fetchArticles(undefined, language)
    });

    const filteredArticles = articles.filter(art => {
        const matchesSearch = art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            art.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = activeFilter === 'All' || art.category === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const categories = ['All', ...new Set(articles.map(a => a.category))];

    if (isLoading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading Archive...</div>;

    return (
        <div className="min-h-screen bg-[#FBFBFF] font-body selection:bg-accent selection:text-slate-900">
            {/* Elegant Header */}
            <header className="pt-40 pb-24 bg-white border-b border-slate-100 relative overflow-hidden">
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-6">
                                <Library className="text-accent" size={24} />
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">System Repository</span>
                            </div>
                            <h1 className="font-heading text-6xl md:text-8xl font-black text-slate-900 leading-[0.9] mb-8 tracking-tighter">
                                <span className="text-accent">{t('archives')}.</span>
                            </h1>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed italic max-w-2xl">
                                {t('archives_desc')}
                            </p>
                        </div>
                        <div className="text-right hidden lg:block">
                            <div className="text-5xl font-black text-slate-100 tracking-tighter leading-none mb-2">{articles.length}</div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total Managed Records</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Filter Bar */}
            <section className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 py-6">
                <div className="container mx-auto px-6 md:px-12">
                    <div className="flex flex-col lg:flex-row gap-8 items-center justify-between">
                        {/* Search */}
                        <div className="relative w-full lg:w-[400px]">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="text"
                                placeholder="Search the records..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-accent transition-all font-medium"
                            />
                        </div>

                        {/* Category Pills */}
                        <div className="flex gap-2 overflow-x-auto no-scrollbar w-full lg:w-auto pb-2 md:pb-0">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveFilter(cat)}
                                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${activeFilter === cat ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Archive Grid */}
            <main className="container mx-auto px-6 md:px-12 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    <AnimatePresence mode="popLayout">
                        {filteredArticles.map((art, idx) => (
                            <motion.div
                                key={art.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.5, delay: idx * 0.05 }}
                                className="group"
                            >
                                <Link to={`/journal/${art.id}`} className="block h-full bg-white rounded-[40px] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)] border border-slate-50 hover:border-accent hover:shadow-2xl transition-all duration-500">
                                    <div className="flex justify-between items-start mb-10">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-accent group-hover:text-slate-900 transition-colors">
                                            <Book size={24} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">{art.category}</div>
                                            <div className="text-[10px] font-mono text-slate-300 tracking-tighter">REF-{art.id.slice(-4).toUpperCase()}</div>
                                        </div>
                                    </div>

                                    <h3 className="text-2xl lg:text-3xl font-black text-slate-900 leading-tight mb-6 group-hover:text-accent transition-colors tracking-tight">
                                        {art.title}
                                    </h3>

                                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3 italic">
                                        "{art.excerpt}"
                                    </p>

                                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                <User size={14} />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{art.author}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                                            <Clock size={12} /> {art.date}
                                        </div>
                                    </div>

                                    <div className="absolute top-0 left-0 w-full h-1 bg-accent scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded-t-full duration-500"></div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredArticles.length === 0 && (
                    <div className="py-48 text-center bg-white rounded-[60px] border border-dashed border-slate-200">
                        <Search className="mx-auto text-slate-200 mb-8" size={60} />
                        <h3 className="text-2xl font-black text-slate-900 mb-4">No records found.</h3>
                        <p className="text-slate-400 font-medium">Try adjusting your search or filtering by a different category.</p>
                        <button onClick={() => { setSearchTerm(''); setActiveFilter('All'); }} className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Reset Archive</button>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ArchivesPage;
