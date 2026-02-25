import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Book, ArrowUpRight } from 'lucide-react';
import { fetchArchiveBooks, ArchiveBook } from '../services/api';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const ReadingRoom: React.FC = () => {
    const { t } = useLanguage();
    const [books, setBooks] = useState<ArchiveBook[]>([]);

    useEffect(() => {
        fetchArchiveBooks().then(setBooks).catch(console.error);
    }, []);

    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const xBackground = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

    return (
        <section id="archive-section" ref={containerRef} className="bg-white py-32 md:py-48 relative overflow-hidden font-body">
            {/* Background Branding - "ARCHIVE" */}
            <motion.div
                style={{ x: xBackground }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.03]"
            >
                <h1 className="text-[30vw] font-black uppercase tracking-tighter leading-none font-heading whitespace-nowrap text-primary">
                    ARCHIVE
                </h1>
            </motion.div>

            <div className="container mx-auto px-6 md:px-12 lg:px-24 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-32">
                    <div className="reveal active flex-1">
                        <div className="flex items-center gap-4 mb-8">
                            <Book className="text-secondary w-5 h-5" />
                            <span className="text-secondary font-black tracking-[0.4em] uppercase text-[10px]">{t('intellectual_focus')}</span>
                        </div>
                        <h2 className="font-heading text-6xl md:text-8xl lg:text-[10rem] font-black text-primary leading-[0.8] tracking-tighter">
                            {t('the_intellectual_archive').split('.')[0]} <br />
                            <span className="text-accent">{t('the_intellectual_archive').split('.')[1] || 'Archive.'}</span>
                        </h2>
                    </div>

                    <div className="lg:max-w-md lg:pt-48 reveal active">
                        <p className="text-xl md:text-2xl text-slate-400 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-10">
                            "A scholar's desk is a portal. These are the texts that inform my editorial rigor."
                        </p>
                    </div>
                </div>

                {/* Grid Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
                    {books.map((book, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative cursor-pointer"
                        >
                            <Link to={`/reflection/${book.id}`} className="absolute inset-0 z-10" aria-label={`Read reflection for ${book.title}`} />

                            {/* Book Image */}
                            <div className="aspect-[3/4] rounded-[40px] overflow-hidden mb-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 group-hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.2)] group-hover:-translate-y-4">
                                <img
                                    src={book.image}
                                    className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                    alt={book.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </div>

                            {/* Book Info */}
                            <div className="space-y-3 px-2">
                                <h3 className="text-2xl font-black text-primary tracking-tight leading-tight group-hover:text-accent transition-colors">
                                    {book.title}
                                </h3>
                                <span className="text-[10px] font-black tracking-[0.3em] text-slate-400 block uppercase">
                                    {book.author}
                                </span>
                            </div>

                            {/* Action Link */}
                            <div className="mt-10 px-2">
                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-900 uppercase tracking-widest transition-all group-hover:gap-6 border-b-2 border-transparent group-hover:border-accent pb-2 w-fit relative z-20">
                                    {t('read_reflection')} <ArrowUpRight className="w-4 h-4 text-accent" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-32 text-center"
                >
                    <Link to="/intellectual-archive" className="inline-flex items-center gap-4 px-12 py-6 bg-slate-900 border border-slate-800 text-white rounded-3xl text-[12px] font-black uppercase tracking-[0.3em] shadow-2xl hover:bg-accent hover:text-slate-900 transition-all group">
                        {t('enter_library')} <ArrowUpRight className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};

export default ReadingRoom;
