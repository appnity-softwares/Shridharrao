import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Users, ArrowRight } from 'lucide-react';

const stats = [
    { value: "25+", label: "YEARS OF RIGOR", detail: "Investigative Journalism" },
    { value: "2k+", label: "FIELD REPORTS", detail: "Global Dispatch" },
    { value: "15+", label: "PRESTIGE AWARDS", detail: "National Excellence" },
];

const ImpactVertical: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const xMoveHero = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const xMoveStats = useTransform(scrollYProgress, [0, 1], [0, 50]);

    return (
        <section ref={containerRef} className="relative py-20 lg:py-24 bg-white overflow-hidden border-b border-slate-50">
            {/* Architectural Grid Lines */}
            <div className="absolute inset-x-0 top-0 h-px bg-slate-100" />
            <div className="absolute inset-x-0 bottom-0 h-px bg-slate-100" />
            <div className="absolute left-1/4 top-0 w-px h-full bg-slate-50 hidden lg:block" />
            <div className="absolute left-3/4 top-0 w-px h-full bg-slate-50 hidden lg:block" />

            <div className="container mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-24 lg:gap-32">

                    {/* The "Data Monument" Branding */}
                    <div className="lg:w-1/2 relative">
                        <motion.div style={{ x: xMoveHero }} className="reveal active">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-[2px] bg-accent"></div>
                                <span className="text-accent font-black tracking-[0.4em] uppercase text-[10px]">The Impact Archive</span>
                            </div>
                            <h2 className="font-heading text-7xl md:text-9xl font-bold text-primary leading-[0.8] tracking-tighter mb-12">
                                Structural <br />
                                <span className="gold-gradient italic">Integrity.</span>
                            </h2>
                            <p className="text-2xl text-slate-400 font-medium leading-relaxed italic border-l-[1.5px] border-slate-100 pl-10 max-w-sm">
                                "A story is not a fleeting moment—it is a foundation for public accountability."
                            </p>
                        </motion.div>

                        {/* Large Overlapping "25" Background */}
                        <div className="absolute -top-20 -right-20 pointer-events-none select-none opacity-[0.03] z-0 hidden lg:block">
                            <h1 className="text-[30vw] font-black text-primary leading-none">25</h1>
                        </div>
                    </div>

                    {/* The Stats Monument */}
                    <div className="lg:w-1/2 grid grid-cols-1 gap-16 lg:gap-24 relative">
                        {stats.map((stat, idx) => (
                            <motion.div
                                key={idx}
                                style={{ x: idx % 2 === 0 ? xMoveStats : useTransform(scrollYProgress, [0, 1], [0, -50]) }}
                                className="group reveal active"
                            >
                                <div className="flex flex-col md:flex-row items-baseline gap-6 md:gap-12 pb-12 border-b border-slate-100 group-hover:border-accent transition-colors duration-700">
                                    <span className="text-7xl lg:text-9xl font-black text-primary group-hover:text-accent transition-colors tracking-tighter">
                                        {stat.value}
                                    </span>
                                    <div className="space-y-2">
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent">
                                            {stat.label}
                                        </h4>
                                        <p className="text-2xl font-bold text-slate-300 italic tracking-tight">
                                            {stat.detail}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ImpactVertical;
