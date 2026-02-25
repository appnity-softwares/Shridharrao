import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Library,
    Book,
    ArrowUpRight,
    Search,
    BookOpen,
    Quote,
    Bookmark,
    Layers
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchArchiveBooks, ArchiveBook } from '../services/api';

const IntellectualArchivePage: React.FC = () => {
    const [books, setBooks] = useState<ArchiveBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const loadBooks = async () => {
            try {
                const data = await fetchArchiveBooks();
                setBooks(data);
            } catch (error) {
                console.error("Failed to load intellectual archive", error);
            } finally {
                setLoading(false);
            }
        };
        loadBooks();
    }, []);

    const filteredBooks = Array.isArray(books) ? books.filter(book =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    if (loading) return (
        <div className="min-h-screen bg-[#FBFBFF] flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
                <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Opening the Vault...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFF] font-body selection:bg-accent selection:text-slate-900">
            {/* Cinematic Header */}
            <header className="pt-48 pb-32 relative overflow-hidden bg-white border-b border-slate-100">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 -skew-x-12 translate-x-1/2"></div>
                <div className="container mx-auto px-6 md:px-12 relative z-10">
                    <div className="max-w-4xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center gap-4 mb-8"
                        >
                            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                                <Library size={24} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">The Private Library</span>
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="font-heading text-7xl md:text-[9rem] font-black text-slate-900 leading-[0.8] mb-12 tracking-tighter"
                        >
                            Intellectual <span className="text-accent italic">Library.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-2xl text-slate-500 font-medium leading-relaxed italic max-w-2xl border-l-4 border-accent pl-8 py-2"
                        >
                            "Curated texts that form the bedrock of my investigations. Every text here is a pillar of my perspective on systemic integrity."
                        </motion.p>
                    </div>
                </div>
            </header>

            {/* Controlled Search Bar */}
            <section className="sticky top-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100/50">
                <div className="container mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="relative w-full md:w-1/2 group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-accent transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Query titles, authors, or concepts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-16 pr-8 py-5 bg-slate-50/50 border border-slate-100 rounded-[24px] outline-none focus:bg-white focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all text-lg font-medium"
                        />
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Total Records</span>
                            <span className="text-2xl font-black text-slate-900">{books.length}</span>
                        </div>
                        <div className="h-10 w-[1px] bg-slate-100"></div>
                        <Layers className="text-accent" size={24} />
                    </div>
                </div>
            </section>

            {/* Library Grid */}
            <main className="container mx-auto px-6 md:px-12 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
                    <AnimatePresence mode="popLayout">
                        {filteredBooks.map((book, idx) => (
                            <motion.div
                                key={book.id}
                                layout
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.7, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="group relative flex flex-col lg:flex-row gap-10 items-start bg-white p-10 rounded-[48px] border border-slate-50 hover:border-accent/30 hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 cursor-pointer"
                            >
                                <Link to={`/reflection/${book.id}`} className="absolute inset-0 z-10" aria-label={`Read reflection for ${book.title}`} />

                                {/* Book Cover Visual */}
                                <div className="w-full lg:w-48 shrink-0 relative">
                                    <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl group-hover:-translate-y-4 group-hover:rotate-3 transition-all duration-700">
                                        <img src={book.image} className="w-full h-full object-cover" alt={book.title} />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </div>
                                    <div className="absolute -bottom-4 right-4 w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-accent border border-slate-50 z-10 group-hover:scale-110 transition-transform">
                                        <Bookmark size={20} />
                                    </div>
                                </div>

                                {/* Book Content */}
                                <div className="flex-1 flex flex-col pt-4">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="px-3 py-1 bg-slate-50 rounded-lg text-[8px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-accent group-hover:text-slate-900 transition-colors">Verified Text</div>
                                        <div className="text-[10px] font-mono text-slate-200 uppercase tracking-widest">ID: {book.id}</div>
                                    </div>

                                    <h3 className="text-3xl lg:text-4xl font-black text-slate-900 leading-[1] mb-4 tracking-tighter uppercase group-hover:text-accent transition-colors">
                                        {book.title}
                                    </h3>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-8">By {book.author}</p>

                                    <p className="text-slate-500 font-medium leading-relaxed italic mb-10 line-clamp-3">
                                        "{book.reflection}"
                                    </p>

                                    <div className="mt-auto flex items-center gap-6">
                                        <div className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest group-hover:bg-accent group-hover:text-slate-900 transition-all flex items-center gap-3 relative z-20">
                                            READ REFLECTION <ArrowUpRight size={14} />
                                        </div>
                                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-300 flex items-center gap-2">
                                            <BookOpen size={14} /> 24m Read
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredBooks.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-48 text-center"
                    >
                        <Quote className="mx-auto text-slate-100 mb-10" size={80} />
                        <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">No intellectual records found.</h3>
                        <p className="text-slate-400 font-medium italic">"The library is quiet... try searching for something else."</p>
                        <button onClick={() => setSearchTerm('')} className="mt-10 px-10 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-accent transition-all">Clear Search</button>
                    </motion.div>
                )}
            </main>

            {/* Footer Sign-off */}
            <section className="py-48 bg-white text-center border-t border-slate-100">
                <div className="container mx-auto px-6">
                    <Book className="mx-auto text-accent mb-10" size={60} />
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-12 tracking-tighter uppercase leading-[0.9]">
                        Looking for something <br /> in the deeper archives?
                    </h2>
                    <Link to="/archives" className="inline-flex items-center gap-4 px-12 py-6 bg-slate-50 rounded-3xl text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 hover:bg-slate-900 hover:text-white transition-all shadow-sm">
                        Access Full System Repository <ArrowUpRight size={18} />
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default IntellectualArchivePage;
