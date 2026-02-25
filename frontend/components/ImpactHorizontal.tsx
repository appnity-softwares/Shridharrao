import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, Shield, Target, Zap, ArrowRight, Award, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchImpacts, fetchAboutConfig, fetchGlobalAnchors } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const ImpactHorizontal: React.FC = () => {
    const { t } = useLanguage();

    const { data: initiatives = [] } = useQuery({
        queryKey: ['impacts'],
        queryFn: fetchImpacts
    });

    const { data: globalAnchors = [] } = useQuery({
        queryKey: ['globalAnchors'],
        queryFn: fetchGlobalAnchors
    });

    const { data: aboutConfig } = useQuery({
        queryKey: ['aboutConfig'],
        queryFn: fetchAboutConfig
    });

    const getIcon = (name: string, className: string = "text-current") => {
        const props = { size: 32, className };
        switch (name) {
            case 'Users': return <Users {...props} />;
            case 'Shield': return <Shield {...props} />;
            case 'Target': return <Target {...props} />;
            case 'Zap': return <Zap {...props} />;
            case 'Award': return <Award {...props} />;
            case 'Globe': return <Globe {...props} />;
            default: return <Users {...props} />;
        }
    }
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Horizontal scroll calculation
    const x = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-70%"]);

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-white">
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <motion.div
                    style={{ x }}
                    className="flex gap-20 px-[10vw] items-center"
                >

                    {/* Billboard - The "Beyond the Word" Hero */}
                    <div className="w-[500px] flex-shrink-0">
                        <div className="reveal active">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-[2px] bg-accent"></div>
                                <span className="text-accent font-black tracking-[0.4em] uppercase text-[10px]">{t('impact_narrative')}</span>
                            </div>
                            <h2 className="font-heading text-7xl md:text-8xl lg:text-9xl font-black text-primary leading-[0.8] mb-8 tracking-tighter">
                                {t('beyond_the_word').split('.')[0]} <br />
                                the <span className="gold-gradient italic">{t('beyond_the_word').split('.')[1] || 'Word.'}</span>
                            </h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed italic max-w-sm border-l-2 border-slate-100 pl-6 mb-10">
                                "The ultimate metric of a story is the systemic change it leaves behind."
                            </p>
                            {aboutConfig?.impactSectionLink && (
                                <a
                                    href={aboutConfig.impactSectionLink && !aboutConfig.impactSectionLink.startsWith('http') && !aboutConfig.impactSectionLink.startsWith('/') ? `https://${aboutConfig.impactSectionLink}` : aboutConfig.impactSectionLink}
                                    target="_blank"
                                    className="inline-flex items-center gap-4 px-10 py-5 bg-white border border-slate-100 rounded-2xl shadow-xl text-[10px] font-black uppercase tracking-widest text-slate-900 hover:bg-accent hover:border-accent transition-all group"
                                >
                                    Explore Full Impact <ArrowRight className="text-accent group-hover:translate-x-2 transition-transform" size={16} />
                                </a>
                            )}
                        </div>
                    </div>

                    {initiatives.map((item, idx) => (
                        <div
                            key={idx}
                            className="w-[450px] lg:w-[550px] h-[550px] lg:h-[650px] flex-shrink-0 p-12 lg:p-16 rounded-[60px] lg:rounded-[80px] bg-[#FAFAFA] border border-slate-50 premium-card flex flex-col justify-between group relative overflow-hidden shrink-0 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)]"
                        >
                            {/* Card Link Overlay */}
                            {item.link && (
                                item.link.startsWith('/') ? (
                                    <Link to={item.link} className="absolute inset-0 z-20" />
                                ) : (
                                    <a href={item.link.startsWith('http') ? item.link : `https://${item.link}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-20" />
                                )
                            )}

                            <div className="absolute top-10 right-10 text-[10px] font-black text-slate-200 tracking-[0.5em]">{item.ref}</div>

                            <div className="relative z-10">
                                <div className={`p-6 ${item.color} rounded-[2.5rem] w-fit mb-12 shadow-2xl transition-transform group-hover:rotate-12`}>
                                    {getIcon(item.icon, "text-white")}
                                </div>
                                <h3 className="text-4xl lg:text-5xl font-black text-primary mb-6 tracking-tighter group-hover:text-accent transition-colors leading-none">{item.title}</h3>
                                <p className="text-xl lg:text-2xl text-slate-500 font-medium leading-relaxed italic line-clamp-4">
                                    "{item.desc}"
                                </p>
                            </div>

                            <div className="flex justify-between items-end border-t border-slate-100 pt-10">
                                <div>
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-accent block mb-3">Strategic Metric</span>
                                    <span className="text-3xl lg:text-4xl font-black text-primary">{item.stats}</span>
                                </div>
                                <div className="p-4 bg-white rounded-full shadow-lg text-slate-200 group-hover:text-accent group-hover:translate-x-2 transition-all cursor-pointer flex items-center justify-center relative z-30">
                                    <ArrowRight className="w-6 h-6" />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Final CTA / Affiliations */}
                    <div className="w-[500px] lg:w-[650px] flex-shrink-0 flex flex-col justify-center gap-10 bg-[#FAFAFA] p-16 lg:p-24 rounded-[60px] lg:rounded-[80px] border border-slate-50 relative overflow-hidden h-[550px] lg:h-[650px]">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl opacity-50" />

                        <div>
                            <span className="text-accent font-black tracking-[0.5em] uppercase text-[11px] mb-8 block">Global Anchors</span>
                            <h3 className="text-5xl lg:text-7xl font-black text-primary leading-[0.8] mb-6 tracking-tighter italic">Strategic Alliances.</h3>
                        </div>

                        <div className="space-y-8">
                            {globalAnchors.slice(0, 2).map((aff, i) => (
                                <a
                                    key={i}
                                    href={aff.link && !aff.link.startsWith('http') && !aff.link.startsWith('/') ? `https://${aff.link}` : (aff.link || "#")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-10 group/item cursor-pointer transition-all hover:translate-x-4"
                                >
                                    <div className="p-6 bg-white rounded-[2rem] shadow-2xl text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
                                        {getIcon(aff.icon)}
                                    </div>
                                    <h4 className="font-heading text-3xl font-black tracking-tight">{aff.name}</h4>
                                </a>
                            ))}
                        </div>

                        <div className="pt-10 border-t border-slate-100">
                            <a
                                href={aboutConfig?.globalAnchorsLink && !aboutConfig.globalAnchorsLink.startsWith('http') && !aboutConfig.globalAnchorsLink.startsWith('/') ? `https://${aboutConfig.globalAnchorsLink}` : (aboutConfig?.globalAnchorsLink || "#")}
                                className="flex items-center gap-6 text-[12px] font-black uppercase text-primary tracking-[0.4em] group hover:gap-10 transition-all"
                            >
                                {aboutConfig?.globalAnchorsText || 'Full History'} <ArrowRight className="text-accent w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator Dot */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-4">
                <div className="flex gap-2">
                    {[0, 1, 2, 3, 4].map(dot => (
                        <motion.div
                            key={dot}
                            className="w-1.5 h-1.5 rounded-full bg-slate-200"
                            style={{
                                backgroundColor: useTransform(scrollYProgress, [dot / 5, (dot + 1) / 5], ["#e2e8f0", "#C5A059"])
                            }}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ImpactHorizontal;
