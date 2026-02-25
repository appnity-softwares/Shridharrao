import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'framer-motion';
import {
    ArrowLeft,
    Calendar,
    User,
    Clock,
    Share2,
    PenTool,
    Maximize2,
    Minimize2,
    Quote,
    ArrowRight,
    MessageCircle,
    Bookmark,
    ChevronDown
} from 'lucide-react';
import { fetchArticleById, fetchArticles, fetchAds, Article, submitPerspective } from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import AdBanner from './AdBanner';
import AdSidebar from './AdSidebar';
import AdModal from './AdModal';

const BlockRenderer: React.FC<{ content: string }> = ({ content }) => {
    try {
        if (!content || content.trim() === '') return null;
        const blocks = JSON.parse(content);
        if (!Array.isArray(blocks)) throw new Error("Not an array");

        return (
            <div className="space-y-20 md:space-y-32">
                {blocks.map((block: any, idx: number) => (
                    <div key={idx} className="block-segment">
                        {block.type === 'text' ? (
                            <div
                                className="article-body-text prose prose-2xl max-w-none text-slate-700 font-medium leading-[2]"
                                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(block.value) }}
                            />
                        ) : (
                            <div className="my-16 md:my-32 relative group">
                                <div className="absolute -inset-4 bg-accent/5 rounded-[4rem] scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-1000 -z-10" />
                                <img
                                    src={block.value}
                                    alt=""
                                    className="w-full rounded-[40px] md:rounded-[80px] shadow-2xl transition-all duration-1000 group-hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)]"
                                />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        );
    } catch (e) {
        return (
            <div
                className="article-body-content space-y-16"
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }}
            />
        );
    }
};

const ArticleDetail: React.FC = () => {
    const { t } = useLanguage();
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<Article | null>(null);
    const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showPerspectiveModal, setShowPerspectiveModal] = useState(false);
    const [perspectiveForm, setPerspectiveForm] = useState({ name: '', email: '', content: '' });
    const containerRef = useRef<HTMLDivElement>(null);

    const { scrollYProgress } = useScroll();

    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const imageY = useTransform(scrollYProgress, [0, 0.4], [0, 200]);
    const imageScale = useTransform(scrollYProgress, [0, 0.4], [1, 1.15]);

    useEffect(() => {
        const load = async () => {
            if (!id) return;
            try {
                const [art, allArts] = await Promise.all([
                    fetchArticleById(id),
                    fetchArticles()
                ]);
                setArticle(art);
                setRelatedArticles(allArts.filter(a => a.id !== id).slice(0, 3));
            } catch (e) {
                console.error("Failed to load article", e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [id]);

    const { data: ads = [] } = useQuery({
        queryKey: ['ads'],
        queryFn: fetchAds
    });

    const bannerAd = ads.find(ad => ad.type === 'banner' && ad.isActive);
    const sidebarAds = ads.filter(ad => ad.type === 'sidebar' && ad.isActive);

    const handleSubmitPerspective = async () => {
        if (!article || !perspectiveForm.content) return;
        try {
            await submitPerspective({
                articleId: article.id,
                ...perspectiveForm
            });
            setShowPerspectiveModal(false);
            setPerspectiveForm({ name: '', email: '', content: '' });
            alert("Your perspective has been submitted for editorial review.");
        } catch (e) {
            alert("Submission failed. Please try again.");
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-white">Loading...</div>;

    if (!article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center">
                    <h2 className="font-heading text-5xl font-black text-primary mb-8">Dispatch Null.</h2>
                    <Link to="/journal" className="inline-flex items-center gap-4 text-accent font-black uppercase text-xs tracking-widest border-b-2 border-accent pb-2">
                        {t('back_to_pensieve')} <ArrowLeft size={16} />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className={`min-h-screen transition-all duration-1000 ${isFocusMode ? 'reading-mode' : 'bg-white'}`}>
            {!isFocusMode && bannerAd && <AdBanner ad={bannerAd} />}
            {!isFocusMode && <AdModal ads={ads} />}

            {/* Premium "Bookmark" Progress Indicator */}
            <div className="fixed top-0 right-12 z-[3000] hidden lg:block">
                <motion.div
                    style={{ scaleY }}
                    className="w-1.5 h-64 bg-accent origin-top rounded-b-full shadow-2xl"
                />
                <div className="mt-4 flex flex-col items-center gap-2">
                    <span className="text-[8px] font-black text-accent uppercase tracking-widest vertical-text">Reading</span>
                    <ChevronDown size={10} className="text-accent animate-bounce" />
                </div>
            </div>

            <AnimatePresence>
                {!isFocusMode && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative pt-[140px] overflow-hidden"
                    >
                        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
                            <div className="flex flex-col gap-12 mb-24">
                                <Link to="/journal" className="group flex items-center gap-4 text-slate-400 hover:text-primary transition-colors font-black uppercase text-[11px] tracking-[0.4em]">
                                    <ArrowLeft size={18} className="group-hover:-translate-x-3 transition-transform" /> {t('back_to_pensieve')}
                                </Link>

                                <div className="max-w-5xl">
                                    <div className="flex items-center gap-8 mb-12">
                                        <span className="px-6 py-2.5 bg-primary text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-xl">
                                            {article.category}
                                        </span>
                                        <div className="flex items-center gap-3 text-slate-300 font-black uppercase text-[10px] tracking-widest">
                                            <Calendar size={16} /> {article.date}
                                        </div>
                                        <div className="w-[1px] h-4 bg-slate-100"></div>
                                        <div className="flex items-center gap-3 text-slate-300 font-black uppercase text-[10px] tracking-widest">
                                            <Clock size={16} /> {article.readTime}
                                        </div>
                                    </div>

                                    <h1 className="font-heading text-7xl md:text-8xl lg:text-9xl font-black text-primary leading-[0.9] mb-16 tracking-tighter border-l-8 border-accent pl-8 md:pl-16">
                                        {article.title}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-16 pt-16 border-t border-slate-50">
                                        <div className="flex items-center gap-6">
                                            <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center text-accent shadow-sm">
                                                <User size={28} />
                                            </div>
                                            <div>
                                                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-[0.3em] leading-none mb-2">Author & Reporter</span>
                                                <span className="font-black text-primary uppercase text-lg tracking-tight">{article.author}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <div
                                                onClick={() => {
                                                    if (navigator.share) {
                                                        navigator.share({
                                                            title: article.title,
                                                            text: article.excerpt,
                                                            url: window.location.href,
                                                        }).catch(console.error);
                                                    } else {
                                                        navigator.clipboard.writeText(window.location.href);
                                                        alert("Link copied to clipboard!");
                                                    }
                                                }}
                                                className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-primary hover:text-white transition-all cursor-pointer"
                                            >
                                                <Share2 size={18} />
                                            </div>
                                            {/* Bookmark button removed as requested */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative aspect-[21/9] rounded-[80px] overflow-hidden shadow-[0_60px_100px_-20px_rgba(0,0,0,0.15)] mb-32 group">
                                <motion.img
                                    style={{ y: imageY, scale: imageScale }}
                                    src={article.image}
                                    className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-grayscale duration-1000"
                                    alt={article.title}
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-primary/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`relative z-10 ${isFocusMode ? 'pt-40 pb-40 min-h-screen flex items-center' : ''}`}>

                {/* Focus Mode Toggle */}
                <div className={`fixed bottom-12 right-12 z-[2000] transition-all duration-700 ${isFocusMode ? 'scale-110' : 'hover:scale-105'}`}>
                    <button
                        onClick={() => setIsFocusMode(!isFocusMode)}
                        className="p-8 bg-primary text-white rounded-[2.5rem] shadow-[0_30px_60px_-10px_rgba(0,0,0,0.3)] transition-all flex items-center gap-4 group"
                    >
                        {isFocusMode ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
                        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 text-[10px] font-black uppercase tracking-[0.3em] whitespace-nowrap">
                            {isFocusMode ? 'Exit Focus Mode' : 'Enter Focus Mode'}
                        </span>
                    </button>
                </div>

                <div className={`container mx-auto px-6 md:px-12 ${isFocusMode ? 'max-w-3xl' : 'max-w-7xl'}`}>
                    <div className="flex flex-col lg:flex-row gap-32">

                        <motion.div
                            layout
                            className={`${isFocusMode ? 'w-full' : 'lg:w-2/3'} relative`}
                        >
                            <div className={`${isFocusMode ? 'reading-mode-content prose prose-2xl' : 'prose prose-2xl text-slate-700 font-medium leading-[2] max-w-none'}`}>

                                {/* Intro with Drop Cap */}
                                <div className="mb-24 relative">
                                    <Quote className="absolute -left-16 -top-16 text-accent opacity-10" size={160} />
                                    <p className={`relative z-10 font-heading drop-cap font-black text-primary leading-[1.2] mb-12 border-l-8 border-accent pl-12 ${isFocusMode ? 'text-5xl' : 'text-4xl'}`}>
                                        {article.excerpt}
                                    </p>

                                    {/* Integrated Sidenote - Fixed position to avoid overlap */}
                                    {article.sidenote && (
                                        <div className="mt-8 p-8 bg-slate-50 border-l-4 border-slate-200 rounded-2xl italic text-sm text-slate-400 font-medium max-w-lg">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block mb-2">Editor's Note</span>
                                            {article.sidenote}
                                        </div>
                                    )}
                                </div>

                                {article.category === 'Story' || (article.content && article.content.trim().startsWith('[')) ? (
                                    <BlockRenderer content={article.content} />
                                ) : (
                                    <div className="article-body-content space-y-16" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(article.content) }}>
                                        {/* Content injected here */}
                                    </div>
                                )}
                            </div>

                            {!isFocusMode && (
                                <section className="mt-48 pt-24 border-t border-slate-100">
                                    <h3 className="font-heading text-4xl font-black text-primary mb-16">The Ongoing Dialogue</h3>
                                    <div
                                        onClick={() => setShowPerspectiveModal(true)}
                                        className="p-12 bg-primary text-white rounded-[4rem] flex flex-col md:flex-row items-center justify-between gap-12 group cursor-pointer hover:bg-accent transition-colors shadow-2xl"
                                    >
                                        <div className="flex items-center gap-10">
                                            <div className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl text-white">
                                                <MessageCircle size={32} />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-black uppercase tracking-tight">Submit Perspective.</p>
                                                <p className="text-white/40 text-xs font-black tracking-widest uppercase mt-2">Open for editorial comment</p>
                                            </div>
                                        </div>
                                        <ArrowRight className="group-hover:translate-x-6 transition-transform" size={48} />
                                    </div>
                                </section>
                            )}
                        </motion.div>

                        {!isFocusMode && (
                            <motion.aside
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                className="lg:w-1/3"
                            >
                                <div className="sticky top-48 space-y-24">
                                    <div className="p-12 bg-white rounded-[4rem] border border-slate-100 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-all" />
                                        <h4 className="text-[11px] font-black uppercase tracking-[0.5em] text-accent mb-12 flex items-center gap-3">
                                            <PenTool size={14} /> Critical Context
                                        </h4>
                                        <div className="space-y-12">
                                            {relatedArticles.map((ref) => (
                                                <Link key={ref.id} to={`/journal/${ref.id}`} className="block group/link">
                                                    <div className="flex items-start gap-4 mb-3">
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-300 block bg-slate-50 px-3 py-1 rounded-full">{ref.category}</span>
                                                    </div>
                                                    <h5 className="text-xl font-black text-primary leading-tight group-hover/link:text-accent transition-colors">
                                                        {ref.title}
                                                    </h5>
                                                    <ArrowRight size={14} className="mt-4 text-slate-100 group-hover/link:text-accent group-hover/link:translate-x-2 transition-all" />
                                                </Link>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="text-center py-16 px-12 border-2 border-dashed border-slate-100 rounded-[5rem]">
                                        <PenTool className="mx-auto text-slate-100 mb-8" size={40} />
                                        <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-300 leading-relaxed italic">"Transmission Complete. <br /> Integrity Verified."</p>
                                    </div>

                                    {sidebarAds.length > 0 && (
                                        <div className="pt-12">
                                            <AdSidebar ad={sidebarAds[0]} />
                                        </div>
                                    )}
                                </div>
                            </motion.aside>
                        )}
                    </div>
                </div>
            </div>

            {/* Submit Perspective Modal */}
            <AnimatePresence>
                {showPerspectiveModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[5000] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 50, scale: 0.95 }}
                            animate={{ y: 0, scale: 1 }}
                            exit={{ y: 50, scale: 0.95 }}
                            className="bg-white rounded-[3rem] p-12 w-full max-w-2xl shadow-2xl relative overflow-hidden"
                        >
                            <button onClick={() => setShowPerspectiveModal(false)} className="absolute top-8 right-8 p-4 hover:bg-slate-50 rounded-full transition-colors">
                                <Minimize2 size={20} className="text-slate-400" />
                            </button>

                            <h2 className="font-heading text-4xl font-black text-primary mb-2">Your Perspective.</h2>
                            <p className="text-slate-400 font-medium mb-8">Contribute to the editorial discourse.</p>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-6">
                                    <input
                                        placeholder="Name"
                                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-accent font-bold"
                                        value={perspectiveForm.name}
                                        onChange={e => setPerspectiveForm({ ...perspectiveForm, name: e.target.value })}
                                    />
                                    <input
                                        placeholder="Email (Private)"
                                        className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-accent font-bold"
                                        value={perspectiveForm.email}
                                        onChange={e => setPerspectiveForm({ ...perspectiveForm, email: e.target.value })}
                                    />
                                </div>
                                <textarea
                                    placeholder="Your thoughtful commentary..."
                                    className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-accent font-medium h-48"
                                    value={perspectiveForm.content}
                                    onChange={e => setPerspectiveForm({ ...perspectiveForm, content: e.target.value })}
                                ></textarea>
                                <button
                                    onClick={handleSubmitPerspective}
                                    className="w-full py-5 bg-accent text-slate-900 font-black uppercase tracking-widest rounded-xl hover:translate-y-1 transition-transform shadow-lg"
                                >
                                    Transmit to Editorial Board
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {isFocusMode && (
                <style>{`
                    nav, footer { opacity: 0; pointer-events: none; transform: translateY(-30px); transition: all 1s; }
                    body { overflow: hidden; }
                    .reading-mode-content p { margin-bottom: 3rem; }
                    .vertical-text { writing-mode: vertical-rl; }
                `}</style>
            )}
        </div>
    );
};

export default ArticleDetail;
