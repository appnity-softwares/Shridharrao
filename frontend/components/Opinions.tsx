import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Quote, Heart, ArrowRight, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const opinions = [
    {
        id: 'op-1',
        title: "The Ethics of Digital Silence",
        excerpt: "In a world that shouts, silence is often the most profound statement. Exploring the moral weight of what we choose not to voice.",
        date: "Jan 18, 2026",
        sentiment: "Inquisitive",
        image: "https://picsum.photos/id/201/800/600"
    },
    {
        id: 'op-2',
        title: "Everyday Integrity: Beyond the Ledger",
        excerpt: "Integrity is not a corporate policy; it is a series of silent choices made at 3 AM. A personal reflection on modern virtue.",
        date: "Jan 5, 2026",
        sentiment: "Reflective",
        image: "https://picsum.photos/id/202/800/600"
    },
    {
        id: 'op-3',
        title: "Compassion as a Journalistic Tool",
        excerpt: "Can an objective reporter still be a compassionate human? Redefining the boundaries of empathy in conflict zones.",
        date: "Dec 22, 2025",
        sentiment: "Empathetic",
        image: "https://picsum.photos/id/203/800/600"
    },
    {
        id: 'op-4',
        title: "The Subtle Art of Cultural Respect",
        excerpt: "Reporting on heritage requires more than a camera; it requires a willingness to listen to the whispers of history.",
        date: "Dec 10, 2025",
        sentiment: "Cultural",
        image: "https://picsum.photos/id/204/800/600"
    }
];

const Opinions: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FBFBFB] pt-[150px] pb-32">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center max-w-4xl mx-auto mb-32"
                >
                    <div className="inline-flex items-center gap-3 px-6 py-2 bg-white rounded-full shadow-sm mb-10 border border-slate-50">
                        <MessageSquare className="text-accent" size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Personal Perspectives</span>
                    </div>
                    <h1 className="font-heading text-6xl md:text-8xl font-black text-primary leading-tight mb-10">
                        Opinions & <span className="gold-gradient">Ethics.</span>
                    </h1>
                    <p className="text-2xl text-slate-500 font-medium leading-relaxed italic max-w-3xl mx-auto">
                        "Personal takes on everyday ethics, the morality of information, and the silent virtues that define our human experience."
                    </p>
                </motion.div>

                {/* Opinion Grid - Masonry style feel */}
                <div className="columns-1 md:columns-2 gap-12 space-y-12">
                    {opinions.map((op, i) => (
                        <motion.div
                            key={op.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="break-inside-avoid bg-white p-12 rounded-[50px] premium-card group relative"
                        >
                            <Quote className="absolute -top-6 -right-6 text-accent/10" size={100} />

                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-3">
                                    <span className="w-2 h-2 bg-accent rounded-full"></span>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{op.sentiment}</span>
                                </div>
                                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">{op.date}</span>
                            </div>

                            <h3 className="font-heading text-4xl font-black text-primary mb-8 group-hover:text-accent transition-colors leading-[1.1]">
                                {op.title}
                            </h3>

                            <p className="text-lg text-slate-500 font-medium leading-relaxed mb-10 italic">
                                "{op.excerpt}"
                            </p>

                            <div className="flex items-center justify-between pt-10 border-t border-slate-50">
                                <Link to={`/journal/${op.id}`} className="flex items-center gap-3 text-xs font-black uppercase text-primary transition-all group-hover:gap-5">
                                    Enter Perspective <ArrowRight size={16} className="text-accent" />
                                </Link>
                                <Heart className="text-slate-100 hover:text-secondary transition-colors cursor-pointer" size={20} />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Suggestion CTA */}
                <div className="mt-32 p-20 bg-primary rounded-[80px] text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-[100px]"></div>
                    <h2 className="font-heading text-5xl font-black mb-8">Have an Ethical Dilemma?</h2>
                    <p className="max-w-xl mx-auto text-slate-400 text-lg mb-12">I often explore reader-submitted ethical questions in my monthly columns. Share your thoughts privately.</p>
                    <button className="px-12 py-5 bg-white text-primary rounded-2xl font-black shadow-2xl hover:scale-105 transition-transform">Start a Dialogue</button>
                </div>
            </div>
        </div>
    );
};

export default Opinions;
