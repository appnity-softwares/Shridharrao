import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, ArrowRight, Share2, Bookmark, Clock, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const editorials = [
    {
        id: 'ed-1',
        title: "National Shifts: The Quiet Metamorphosis of Policy",
        excerpt: "An in-depth look at how subtle changes in legislative language are reshaping the national landscape beyond the headlines.",
        date: "Jan 12, 2026",
        readTime: "12 min",
        image: "https://picsum.photos/id/101/800/600"
    },
    {
        id: 'ed-2',
        title: "The Geopolitics of Regional Connectivity",
        excerpt: "Exploring the strategic significance of infrastructure projects in Central India and their impact on global trade routes.",
        date: "Dec 28, 2025",
        readTime: "15 min",
        image: "https://picsum.photos/id/102/800/600"
    },
    {
        id: 'ed-3',
        title: "Economic Integrity in the Digital Era",
        excerpt: "A deep dive into the evolution of fiscal accountability in the age of decentralized finance and blockchain transparency.",
        date: "Dec 15, 2025",
        readTime: "10 min",
        image: "https://picsum.photos/id/103/800/600"
    }
];

const Editorials: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-[150px] pb-32">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mb-24"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <PenTool className="text-accent" size={32} />
                        <span className="text-accent font-black tracking-[0.4em] uppercase text-xs">Category</span>
                    </div>
                    <h1 className="font-heading text-6xl md:text-8xl font-black text-primary leading-tight mb-10">
                        National <span className="gold-gradient">Editorials.</span>
                    </h1>
                    <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-3xl italic">
                        "Deep-dive analysis on national shifts, policy metamorphoses, and the silent undercurrents of Indian governance."
                    </p>
                </motion.div>

                {/* Featured Editorial */}
                <section className="mb-40">
                    <Link to={`/journal/${editorials[0].id}`}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="group relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
                        >
                            <div className="aspect-video overflow-hidden rounded-[60px] shadow-2xl relative">
                                <img src={editorials[0].image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors"></div>
                            </div>
                            <div>
                                <div className="flex items-center gap-4 text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6">
                                    <span className="text-accent">Spotlight</span>
                                    <span>•</span>
                                    <span>{editorials[0].date}</span>
                                </div>
                                <h2 className="font-heading text-4xl md:text-6xl font-black text-primary leading-tight mb-8 group-hover:text-accent transition-colors">
                                    {editorials[0].title}
                                </h2>
                                <p className="text-xl text-slate-500 leading-relaxed mb-10">
                                    {editorials[0].excerpt}
                                </p>
                                <div className="flex items-center gap-6">
                                    <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">Read Essay</button>
                                    <Share2 className="text-slate-300 hover:text-accent transition-colors cursor-pointer" size={24} />
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </section>

                {/* List Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {editorials.slice(1).map((ed, i) => (
                        <motion.div
                            key={ed.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="premium-card p-12 rounded-[60px] flex flex-col group h-full"
                        >
                            <div className="flex justify-between items-start mb-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent">{ed.date}</span>
                                <Bookmark className="text-slate-100 hover:text-accent transition-colors cursor-pointer" size={20} />
                            </div>
                            <h3 className="font-heading text-3xl font-black text-primary mb-6 group-hover:text-accent transition-colors flex-1">
                                {ed.title}
                            </h3>
                            <p className="text-slate-500 font-medium leading-relaxed mb-10 line-clamp-3">
                                {ed.excerpt}
                            </p>
                            <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                                        <User size={18} />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">S. D. Rao</span>
                                </div>
                                <Link to={`/journal/${ed.id}`} className="flex items-center gap-2 text-[10px] font-black uppercase text-primary group-hover:gap-4 transition-all">
                                    Read Analytical Deep-dive <ArrowRight size={14} className="text-accent" />
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Editorials;
