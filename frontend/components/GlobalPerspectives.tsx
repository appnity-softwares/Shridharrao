import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Globe, MapPin, ArrowUpRight, ShieldCheck, ArrowRight } from 'lucide-react';
import { fetchGlobalEvents, GlobalEvent } from '../services/api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const GlobalPerspectives: React.FC = () => {
    const { t } = useLanguage();
    const [perspectives, setPerspectives] = useState<GlobalEvent[]>([]);

    useEffect(() => {
        fetchGlobalEvents().then(setPerspectives).catch(console.error);
    }, []);
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const xBackground = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <section ref={containerRef} className="flex items-center bg-white py-32 relative overflow-hidden font-body">
            {/* Background Branding - "GLOBAL" */}
            <motion.div
                style={{ x: xBackground }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.03]"
            >
                <h1 className="text-[35vw] font-black uppercase tracking-tighter leading-none font-heading whitespace-nowrap text-primary">
                    GLOBAL
                </h1>
            </motion.div>

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-32 items-center">

                    {/* Left Column: Narrative */}
                    <div className="lg:w-[45%] reveal active">
                        <div className="flex items-center gap-3 mb-8">
                            <Globe size={18} className="text-secondary" />
                            <span className="text-secondary font-black tracking-[0.4em] uppercase text-[10px]">{t('the_world_desk')}</span>
                        </div>
                        <h2 className="font-heading text-6xl md:text-8xl lg:text-[10rem] font-black text-primary mb-10 leading-[0.8] tracking-tighter">
                            {t('without_borders').split('.')[0]} <br />
                            <span className="text-accent">{t('without_borders').split('.')[1] || 'Borders.'}</span>
                        </h2>
                        <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed italic mb-12 max-w-xl">
                            "Integrity is a universal language. I advocate for it in every newsroom, from local districts to global summits."
                        </p>
                        <Link to="/travels" className="inline-flex px-12 py-6 bg-slate-900 text-white rounded-[20px] items-center justify-center gap-6 hover:bg-accent hover:text-slate-900 transition-all group font-black uppercase text-[10px] tracking-widest shadow-2xl">
                            {t('itinerary')} <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} />
                        </Link>
                    </div>

                    {/* Right Column: Event Grid */}
                    <div className="lg:w-[55%] w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                            {Array.isArray(perspectives) && perspectives.map((p, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-white p-10 lg:p-12 rounded-[40px] lg:rounded-[50px] border border-slate-50 group cursor-default shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_100px_rgba(0,0,0,0.08)] transition-all duration-700 relative overflow-hidden"
                                >
                                    <div className="flex justify-between items-start mb-8 relative z-10">
                                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-500">
                                            <MapPin size={24} />
                                        </div>
                                        <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest opacity-60">
                                            {p.date || 'SUMMER 2025'}
                                        </span>
                                    </div>
                                    <h3 className="font-heading text-2xl lg:text-3xl font-black text-slate-900 mb-4 leading-tight group-hover:text-accent transition-colors relative z-10">
                                        {p.title}
                                    </h3>
                                    <p className="text-slate-500 font-medium text-base mb-8 italic line-clamp-2 group-hover:text-slate-800 transition-colors relative z-10">
                                        "{p.desc}"
                                    </p>
                                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-accent opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0 relative z-10">
                                        <ShieldCheck size={14} /> Strategic Diplomacy
                                    </div>

                                    {/* Subtle hover background decoration */}
                                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-700"></div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default GlobalPerspectives;
