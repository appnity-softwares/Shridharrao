import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Book, ArrowLeft, Quote, Library, Calendar } from 'lucide-react';
import { fetchArchiveBookById, ArchiveBook } from '../services/api';

const ReflectionPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [book, setBook] = useState<ArchiveBook | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchArchiveBookById(id)
                .then(setBook)
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!book) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-black text-primary mb-4">Record Not Found</h1>
                <Link to="/" className="text-accent font-bold uppercase tracking-widest text-xs">Return to Library</Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-white font-body selection:bg-accent selection:text-slate-900">
            {/* Minimalist Header */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-8 flex justify-between items-center pointer-events-none">
                <Link to="/" className="pointer-events-auto p-4 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 text-primary hover:bg-primary hover:text-white transition-all group shadow-sm">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                </Link>
                <div className="pointer-events-auto px-6 py-3 bg-white/80 backdrop-blur-md rounded-full border border-slate-100 flex items-center gap-3 shadow-sm">
                    <Library size={14} className="text-accent" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Intellectual Archive</span>
                </div>
            </nav>

            <main className="container mx-auto px-6 pt-48 pb-32 max-w-7xl">
                <div className="flex flex-col lg:flex-row gap-20 lg:gap-32">

                    {/* Left: Book Profile */}
                    <div className="lg:w-1/3">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="sticky top-48"
                        >
                            <div className="aspect-[3/4] rounded-[40px] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] mb-12 transform -rotate-2 hover:rotate-0 transition-all duration-700">
                                <img src={book.image} className="w-full h-full object-cover" alt={book.title} />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent"></div>
                            </div>

                            <div className="space-y-8">
                                <div>
                                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-4 uppercase">
                                        {book.title}
                                    </h1>
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent">By {book.author}</span>
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Classification</span>
                                        <span className="text-xs font-bold text-slate-600">Philosophical Study</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</span>
                                        <span className="text-xs font-bold text-accent">Verified Text</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Reflection Context */}
                    <div className="lg:w-2/3">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="flex items-center gap-4 mb-12">
                                <Quote className="text-accent" size={32} />
                                <div className="h-[1px] flex-1 bg-slate-50"></div>
                            </div>

                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-16">
                                Primary Reflection & Analysis
                            </h2>

                            <article className="prose prose-2xl prose-slate max-w-none">
                                <p className="text-3xl md:text-4xl font-medium leading-[1.6] text-slate-800 italic font-body">
                                    "{book.reflection}"
                                </p>
                            </article>

                            <div className="mt-32 p-12 bg-slate-50 rounded-[40px] border border-slate-100">
                                <h4 className="font-heading text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Editorial Context</h4>
                                <p className="text-slate-500 font-medium leading-relaxed italic">
                                    This text serves as a cornerstone for my investigation into modern information architectures. The principles outlined by {book.author} inform my baseline for journalistic integrity and systemic observation.
                                </p>
                                <div className="mt-10 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <Calendar size={14} className="text-accent" /> Documented: Summer 2025
                                </div>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </main>

            {/* Footer Navigation */}
            <footer className="py-24 border-t border-slate-50">
                <div className="container mx-auto px-6 flex justify-center">
                    <Link to="/archives" className="group flex flex-col items-center gap-6">
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300 group-hover:text-accent transition-colors">Return to Central Repository</span>
                        <div className="w-16 h-16 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                            <Library size={24} />
                        </div>
                    </Link>
                </div>
            </footer>
        </div>
    );
};

export default ReflectionPage;
