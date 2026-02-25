import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MapPin,
    Calendar,
    ArrowDown,
    Link as LinkIcon,
    History,
    Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchTimeline, TimelineItem } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const ItineraryPage: React.FC = () => {
    const { t } = useLanguage();
    const [events, setEvents] = useState<TimelineItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchTimeline();
                setEvents(data);
            } catch (error) {
                console.error("Failed to load itinerary", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#FBFBFF] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Loading Journey...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFF] font-body selection:bg-accent selection:text-slate-900">
            {/* Immersive Hero */}
            <header className="h-[90vh] relative flex items-center justify-center overflow-hidden bg-slate-900">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900 z-10"></div>
                    <img
                        src="https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2000&auto=format&fit=crop"
                        className="w-full h-full object-cover scale-110 opacity-60"
                        alt="Hero"
                    />
                </div>

                <div className="container mx-auto px-6 relative z-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-accent/10 backdrop-blur-md rounded-full mb-8 border border-accent/20">
                            <Sparkles className="text-accent" size={14} />
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">Tracing the Path</span>
                        </div>
                        <h1 className="font-heading text-7xl md:text-[10rem] font-black text-white leading-[0.8] mb-8 tracking-tighter">
                            The <span className="text-accent italic">{t('itinerary')}.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-300 font-medium leading-relaxed max-w-2xl mx-auto italic mb-12">
                            "A chronological exploration of milestones, expeditions, and the evolution of a perspective."
                        </p>
                        <motion.button
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
                            className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
                        >
                            <ArrowDown size={24} />
                        </motion.button>
                    </motion.div>
                </div>
            </header>

            {/* Timeline Stream */}
            <main className="container mx-auto px-6 py-32 relative">
                {/* Vertical Central Line */}
                <div className="absolute left-1/2 top-48 bottom-48 w-[1px] bg-slate-200 hidden md:block"></div>

                <div className="space-y-48 md:space-y-80 relative">
                    {events.map((event, idx) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-10%" }}
                            className={`flex flex-col ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24`}
                        >
                            {/* Visual Asset */}
                            <div className="w-full md:w-1/2 relative group">
                                <div className="absolute -inset-4 bg-accent/10 rounded-[40px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="relative aspect-[4/5] md:aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl border border-white">
                                    <img
                                        src={event.image || `https://source.unsplash.com/800x600/?journal,history,${idx}`}
                                        alt={event.title}
                                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                                    <div className="absolute bottom-8 left-8 flex items-center gap-4">
                                        <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center text-slate-900 font-black">
                                            {event.year.slice(-2)}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">ID RECORD</div>
                                            <div className="text-white font-mono text-xs">{event.refId}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Narrative Content */}
                            <div className="w-full md:w-1/2 flex flex-col justify-center">
                                <div className="flex items-center gap-4 mb-4">
                                    <span className="text-6xl md:text-8xl font-black text-slate-100 leading-none tracking-tighter">{event.year}</span>
                                    <div className="h-[2px] flex-1 bg-slate-100 md:hidden"></div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8 tracking-tight leading-tight uppercase">
                                    {event.title}
                                </h2>
                                <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-10 italic border-l-4 border-accent pl-8 py-2">
                                    "{event.event}"
                                </p>

                                <div className="flex items-center gap-8">
                                    {event.refId && (
                                        <Link to={`/journal/${event.refId}`} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-900 hover:text-accent transition-all group">
                                            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all">
                                                <LinkIcon size={16} />
                                            </div>
                                            Read Dispatch
                                        </Link>
                                    )}
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <MapPin size={16} /> Verified Entry
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </main>

            {/* Closing */}
            <section className="py-48 bg-slate-900 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-32 bg-accent/20"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <History className="mx-auto text-accent/20 mb-12" size={80} />
                    <h3 className="text-4xl md:text-6xl font-black text-white mb-12 tracking-tighter">The journey continues.</h3>
                    <Link to="/contact" className="px-12 py-6 bg-accent text-slate-900 rounded-2xl font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl hover:bg-white transition-all scale-100 hover:scale-105 inline-block">
                        Join the Mission
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default ItineraryPage;
