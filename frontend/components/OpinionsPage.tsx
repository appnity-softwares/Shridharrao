import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowRight,
    TrendingUp,
    Clock,
    User,
    MessageSquare,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchArticles, fetchRecentArticles, fetchAds } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import AdBanner from './AdBanner';
import AdSidebar from './AdSidebar';
import AdModal from './AdModal';

const OpinionsPage: React.FC = () => {
    const { language, t } = useLanguage();

    const { data: articles = [], isLoading: isLoadingArticles } = useQuery({
        queryKey: ['articles', 'Opinion', language],
        queryFn: () => fetchArticles('Opinion', language)
    });

    const { data: recentArticles = [], isLoading: isLoadingRecent } = useQuery({
        queryKey: ['recentArticles', 5, language],
        queryFn: () => fetchRecentArticles(5, language)
    });

    const { data: ads = [] } = useQuery({
        queryKey: ['ads'],
        queryFn: fetchAds
    });

    const bannerAd = ads.find(ad => ad.type === 'banner' && ad.isActive);
    const sidebarAds = ads.filter(ad => ad.type === 'sidebar' && ad.isActive);

    const loading = isLoadingArticles || isLoadingRecent;

    if (loading) return <div className="min-h-screen bg-white flex items-center justify-center">Loading...</div>;

    const topStory = articles[0];
    if (!topStory && articles.length === 0) return <div className="min-h-screen bg-white flex items-center justify-center">No opinions found.</div>;

    return (
        <div className="min-h-screen bg-white font-body">
            {bannerAd && <AdBanner ad={bannerAd} />}
            <AdModal ads={ads} />
            <header className="pt-32 md:pt-48 pb-20 md:pb-32 relative overflow-hidden bg-white border-b border-slate-50">
                <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-50 rounded-full mb-8 md:mb-10 border border-slate-100">
                            <Clock className="text-accent" size={14} />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">{t('updated')} Jan 2026</span>
                        </div>
                        <h1 className="font-heading text-6xl md:text-9xl font-black text-primary leading-[0.85] mb-8 lg:mb-12 tracking-tighter">
                            The <span className="text-accent">{t('opinions')}.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-700 font-medium leading-relaxed max-w-3xl mx-auto italic">
                            {t('opinions_desc')}
                        </p>
                    </motion.div>
                </div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-32 pointer-events-none hidden lg:block"></div>
            </header>

            <main className="container mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20 mb-24 md:mb-40">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-8 group"
                    >
                        <Link to={`/journal/${topStory.id}`} data-cursor="read">
                            <div className="relative aspect-[16/9] overflow-hidden rounded-[40px] md:rounded-[60px] shadow-2xl bg-white group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] transition-all duration-1000">
                                <img
                                    src={topStory.image}
                                    alt={topStory.title}
                                    className="w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                            </div>
                            <div className="mt-8 md:mt-12 max-w-3xl">
                                <div className="flex items-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-accent mb-6 lg:mb-8">
                                    <span className="px-3 md:px-4 py-1.5 md:py-2 bg-accent/10 rounded-full">Featured Opinion</span>
                                    <span>•</span>
                                    <span className="text-slate-400">{topStory.readTime} Read</span>
                                </div>
                                <h2 className="font-heading text-4xl md:text-6xl font-black text-primary leading-[1.1] mb-6 md:mb-8 transition-colors duration-500 tracking-tighter group-hover:text-accent border-l-8 border-accent pl-8 md:pl-12">
                                    {topStory.title}
                                </h2>
                                <p className="text-lg md:text-2xl text-slate-700 font-medium leading-relaxed mb-8 md:mb-10 line-clamp-2 italic">
                                    "{topStory.excerpt}"
                                </p>
                                <div className="flex items-center gap-4 text-primary font-black uppercase text-[9px] md:text-[10px] tracking-widest pb-2 transition-all group-hover:gap-8 border-b-2 border-transparent hover:border-accent w-fit">
                                    Read Full Opinion <ArrowRight size={18} className="text-accent" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-4"
                    >
                        <div className="p-8 md:p-12 bg-[#FBFBFF] rounded-[40px] md:rounded-[60px] border border-slate-50 h-full">
                            <div className="flex items-center justify-between mb-10 md:mb-12">
                                <h3 className="font-heading text-2xl md:text-3xl font-black text-primary flex items-center gap-3">
                                    Pulse <TrendingUp size={24} className="text-accent" />
                                </h3>
                            </div>
                            <div className="space-y-10 lg:space-y-12">
                                {Array.isArray(recentArticles) && recentArticles.filter(a => a.id !== topStory.id).slice(0, 4).map((item, idx) => (
                                    <Link key={item.id} to={`/journal/${item.id}`} className="block group" data-cursor="read">
                                        <div className="flex gap-5 md:gap-6 items-start">
                                            <span className="text-4xl md:text-5xl font-black text-slate-100 group-hover:text-accent/30 transition-colors leading-[0.8]">{(idx + 1).toString().padStart(2, '0')}</span>
                                            <div className="flex-1 border-b border-slate-100 pb-6 lg:pb-8 group-last:border-0">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-[7px] font-black uppercase tracking-widest text-accent bg-accent/10 px-2 py-0.5 rounded-full">{item.category}</span>
                                                </div>
                                                <h4 className="text-base md:text-lg font-bold text-primary leading-snug mb-2 group-hover:text-accent transition-colors line-clamp-2">
                                                    {item.title}
                                                </h4>
                                                <span className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">{item.date}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16">
                    <AnimatePresence mode="popLayout">
                        {Array.isArray(articles) && articles.map((art, idx) => (
                            <motion.div
                                key={art.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05, duration: 0.6 }}
                            >
                                <Link to={`/journal/${art.id}`} className="group block h-full">
                                    <div className="relative aspect-[1.1/1] rounded-[40px] lg:rounded-[50px] overflow-hidden mb-8 lg:mb-10 shadow-lg bg-white">
                                        <img
                                            src={art.image}
                                            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                                            alt={art.title}
                                        />
                                        <div className="absolute bottom-6 right-6">
                                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-[8px] font-black uppercase text-primary tracking-widest">
                                                {art.category}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="px-2">
                                        <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-accent mb-3 lg:mb-4 block">Ref No. {idx + 204}</span>
                                        <h3 className="text-2xl lg:text-3xl font-black text-primary leading-tight mb-4 lg:mb-6 transition-colors group-hover:text-accent">
                                            {art.title}
                                        </h3>
                                        <p className="text-sm lg:text-base text-slate-700 font-medium leading-relaxed line-clamp-3 mb-8 italic">
                                            "{art.excerpt}"
                                        </p>
                                        <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                                                    <User size={14} />
                                                </div>
                                                <span className="text-[9px] font-black uppercase text-primary tracking-widest">{art.author}</span>
                                            </div>
                                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{art.date}</span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                        {sidebarAds.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="hidden lg:block h-full"
                            >
                                <AdSidebar ad={sidebarAds[0]} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    className="mt-32 lg:mt-48 text-center"
                >
                    <div className="w-[1px] h-16 lg:h-24 bg-slate-100 mx-auto mb-10 lg:mb-12"></div>
                    <MessageSquare className="mx-auto text-slate-200 mb-6 lg:mb-8 w-8 h-8 lg:w-10 lg:h-10" />
                    <h3 className="font-heading text-3xl md:text-4xl font-black text-primary mb-10 lg:mb-12 italic tracking-tight">Have a perspective?</h3>
                    <Link to="/contact" className="px-10 py-5 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-accent transition-all inline-block">
                        Share Your Opinion
                    </Link>
                </motion.div>
            </main>
        </div>
    );
};

export default OpinionsPage;
