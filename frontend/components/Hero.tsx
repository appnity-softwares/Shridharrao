import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Quote, BookOpen, Feather, PenTool, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagneticWrapper from './MagneticWrapper';
import { fetchArticles, Article } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const { t, language } = useLanguage();
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null);

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const articles = await fetchArticles('Editorial', language);
        if (articles.length > 0) {
          setFeaturedArticle(articles[0]);
        }
      } catch (error) {
        console.error("Failed to fetch hero article", error);
      }
    };
    loadFeatured();
  }, [language]);

  // Subtle Parallax
  const textY = useTransform(scrollY, [0, 500], [0, -40]);
  const opacityValue = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div ref={containerRef} className="relative min-h-screen py-12 lg:h-screen lg:py-0 flex items-center bg-white overflow-hidden">
      {/* Background Branding */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none z-0 opacity-[0.015]">
        <h1 className="text-[35vw] font-black tracking-tighter leading-none font-heading whitespace-nowrap">
          INTEGRITY
        </h1>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24 relative">

          {/* Left Column: Typography */}
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-[55%] text-left z-10 relative"
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-12 h-[2.5px] bg-accent"></div>
              <span className="text-accent text-[10px] lg:text-[11px] font-black tracking-[0.5em] uppercase">
                {t('independent_dispatch')}
              </span>
            </div>

            <h1 className="font-heading text-5xl md:text-7xl lg:text-[8rem] font-black text-primary leading-[0.8] mb-8 lg:mb-10 tracking-tighter">
              {t('seek_the')} <br />
              <span className="gold-gradient">{t('unmentioned')}</span>
            </h1>

            <div className="max-w-xl mb-10 lg:mb-12 relative bg-slate-50/40 p-8 lg:p-10 rounded-[30px] lg:rounded-[40px] border border-slate-50">
              <Quote className="absolute -left-4 -top-4 lg:-left-6 lg:-top-6 text-accent opacity-20 w-10 h-10 lg:w-16 lg:h-16" />
              <p className="text-xl lg:text-2xl text-slate-700 font-black italic leading-tight relative z-10">
                {t('hero_quote')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <MagneticWrapper>
                <Link
                  to="/journal"
                  className="w-full sm:w-auto px-10 lg:px-12 py-4 lg:py-5 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl flex items-center justify-center gap-4 transition-all hover:bg-accent"
                >
                  {t('pensieve')} <BookOpen size={18} />
                </Link>
              </MagneticWrapper>

              <MagneticWrapper>
                <Link
                  to="/about"
                  className="w-full sm:w-auto px-10 lg:px-12 py-4 lg:py-5 border-2 border-slate-100 text-primary rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-4 transition-all hover:border-black"
                >
                  {t('biography')} <Feather size={18} />
                </Link>
              </MagneticWrapper>
            </div>
          </motion.div>

          {/* Right Column: Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:w-[40%] relative z-10 flex-shrink-0 w-full max-w-[500px] lg:max-w-none"
          >
            <Link to={featuredArticle ? `/journal/${featuredArticle.id}` : "#"} className="block">
              <div
                className="relative p-10 lg:p-16 glass-card rounded-[60px] lg:rounded-[80px] border border-slate-100 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden group"
              >
                <div className="relative z-10">
                  <div className="mb-10 lg:mb-12 flex justify-between items-start">
                    <div className="p-4 lg:p-5 bg-primary rounded-2xl lg:rounded-3xl text-white">
                      <PenTool className="w-7 h-7 lg:w-8 lg:h-8" />
                    </div>
                    <span className="px-3 lg:px-4 py-1 lg:py-1.5 bg-accent/10 text-accent text-[8px] lg:text-[9px] font-black uppercase tracking-widest rounded-full">New Transmission</span>
                  </div>

                  <h3 className="font-heading text-4xl lg:text-5xl font-black text-primary leading-tight mb-6 lg:mb-8 group-hover:text-accent transition-colors duration-500 line-clamp-3 border-l-8 border-accent pl-8">
                    {featuredArticle ? featuredArticle.title : "The Ethics of Digital Silence."}
                  </h3>

                  <p className="text-lg lg:text-xl text-slate-700 font-medium leading-relaxed mb-8 lg:mb-10 italic line-clamp-3">
                    {featuredArticle ? `"${featuredArticle.excerpt}"` : '"Choosing when to remain silent is the ultimate editorial rigor."'}
                  </p>

                  <div className="flex items-center gap-4 text-primary font-black uppercase text-[9px] lg:text-[10px] tracking-[0.3em] group-hover:gap-8 transition-all">
                    Read Dispatch <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 text-accent" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Floating Signature Mockup - FIXED POSITIONING */}
            <div className="absolute -bottom-6 right-10 lg:-bottom-8 lg:right-16 p-6 lg:p-8 bg-white shadow-2xl rounded-[25px] lg:rounded-[30px] border border-slate-50 z-20 hidden lg:block transform translate-y-1/2">
              <div className="font-heading text-xl lg:text-2xl text-slate-500 select-none">Shridhar Rao</div>
              <div className="text-[9px] lg:text-[10px] font-black uppercase tracking-widest text-accent mt-1">Verified Signature</div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Scroll Cue */}
      <motion.div
        style={{ opacity: opacityValue }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 lg:gap-4 text-slate-200"
      >
        <div className="w-[1.5px] h-12 lg:h-20 bg-gradient-to-b from-slate-200 to-transparent"></div>
        <ChevronDown className="w-5 h-5 lg:w-6 lg:h-6 animate-bounce" />
      </motion.div>
    </div>
  );
};

export default Hero;
