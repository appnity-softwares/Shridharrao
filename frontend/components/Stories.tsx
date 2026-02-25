import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Camera, MapPin, User, ArrowRight, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';

const stories = [
    {
        id: 'st-1',
        title: "The Silk Weaver of Kashi",
        excerpt: "Behind every loom is a story of three generations. A ground report on the resilience of traditional craftsmanship in a digital age.",
        location: "Varanasi, India",
        date: "Jan 2, 2026",
        topic: "Human Interest",
        image: "https://picsum.photos/id/301/1000/600"
    },
    {
        id: 'st-2',
        title: "Whispers of the Thar Desert",
        excerpt: "Life beyond the dunes. Mapping the survival and song of the nomadic communities in Rajasthan's harshest climates.",
        location: "Jaisalmer, India",
        date: "Dec 20, 2025",
        topic: "Culture",
        image: "https://picsum.photos/id/302/1000/600"
    },
    {
        id: 'st-3',
        title: "Education in Exile",
        excerpt: "How mobile libraries are bringing the world to children in the most remote displacement camps.",
        location: "Bastar, India",
        date: "Dec 5, 2025",
        topic: "Education",
        image: "https://picsum.photos/id/304/1000/600"
    }
];

const Stories: React.FC = () => {
    return (
        <div className="min-h-screen bg-white pt-[150px] pb-32">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="max-w-4xl mb-32"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <BookOpen className="text-secondary" size={32} />
                        <span className="text-secondary font-black tracking-[0.4em] uppercase text-xs">Stories</span>
                    </div>
                    <h1 className="font-heading text-6xl md:text-8xl font-black text-primary leading-tight mb-8">
                        The Human <br />
                        <span className="gold-gradient">Element.</span>
                    </h1>
                    <p className="text-2xl text-slate-500 font-medium leading-relaxed max-w-2xl font-body">
                        "Ground reports, human interest narratives, and the tales of resilience that define the spirit of modern India."
                    </p>
                </motion.div>

                {/* Stories - Large Visual Cards */}
                <div className="space-y-40">
                    {stories.map((st, i) => (
                        <motion.div
                            key={st.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-16 lg:gap-32 items-center`}
                        >
                            <div className="lg:w-3/5 group relative">
                                <div className="aspect-[4/3] rounded-[80px] overflow-hidden shadow-2xl relative">
                                    <img src={st.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent"></div>

                                    {/* Location Badge */}
                                    <div className="absolute top-10 left-10 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white flex items-center gap-3">
                                        <MapPin size={18} className="text-accent" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">{st.location}</span>
                                    </div>
                                </div>

                                {/* Decorative Visual Element */}
                                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/10 rounded-full blur-[80px] -z-10"></div>
                            </div>

                            <div className="lg:w-2/5">
                                <div className="flex items-center gap-3 mb-8">
                                    <Sun className="text-accent" size={20} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{st.topic}</span>
                                </div>

                                <h2 className="font-heading text-5xl md:text-6xl font-black text-primary leading-tight mb-8 group-hover:text-accent transition-colors">
                                    {st.title}
                                </h2>

                                <p className="text-xl text-slate-500 leading-relaxed mb-12 font-medium">
                                    {st.excerpt}
                                </p>

                                <Link to={`/journal/${st.id}`} className="inline-flex items-center gap-4 text-xs font-black uppercase text-primary transition-all hover:gap-8 group">
                                    Explore Full Report <ArrowRight size={20} className="text-accent transition-transform group-hover:scale-125" />
                                </Link>

                                <div className="mt-12 flex items-center gap-8 border-t border-slate-50 pt-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><User size={14} /></div>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary">S.D. Rao</span>
                                    </div>
                                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Released: {st.date}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Stories;
