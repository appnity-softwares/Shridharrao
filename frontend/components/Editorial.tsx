import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, ArrowRight, Share2, Bookmark } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const Editorial: React.FC = () => {
  const editorialArticles = articles.filter(a => a.category === 'Editorial' || a.category === 'Analysis' || a.category === 'Opinion');

  return (
    <div className="min-h-screen bg-[#FFFFF0] font-serif pt-28 pb-20"> {/* Slightly off-white for paper feel */}
      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-20 border-b-4 border-double border-[#003366] pb-8">
          <span className="text-[#C5A059] font-sans font-bold text-xs tracking-[0.3em] uppercase mb-4 block">Perspective & Insight</span>
          <h1 className="font-heading text-5xl md:text-6xl font-bold text-[#003366] mb-4">Editorial</h1>
          <p className="font-serif italic text-xl text-slate-600">
            "The pen is mightier than the sword."
          </p>
        </div>

        <div className="space-y-16">
          {editorialArticles.map((article, idx) => (
            <Link key={article.id} to={`/journal/${article.id}`} className="block group">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col md:flex-row gap-8 items-start"
              >
                <div className="w-full md:w-1/3 aspect-[3/4] relative overflow-hidden rounded shadow-md">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur p-3 border-t border-[#C5A059]">
                    <p className="text-[#003366] font-sans text-xs font-bold uppercase tracking-wider text-center">Authored by {article.author}</p>
                  </div>
                </div>

                <div className="flex-1 py-4">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 border border-[#003366] text-[#003366] text-[10px] font-sans font-bold uppercase tracking-widest rounded-full">{article.category}</span>
                    <span className="text-slate-400 text-xs font-sans font-bold uppercase">{article.date}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-6 leading-tight group-hover:text-[#CC0000] transition-colors font-serif">
                    {article.title}
                  </h2>
                  <p className="text-stone-600 text-lg leading-relaxed italic border-l-4 border-[#C5A059] pl-6 mb-6">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-6 border-t border-stone-200">
                    <span className="text-[#003366] font-sans font-bold text-xs uppercase flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read Full Opinion <ArrowRight size={14} />
                    </span>
                    <div className="flex gap-4 text-stone-400">
                      <Share2 size={18} className="hover:text-[#003366]" />
                      <Bookmark size={18} className="hover:text-[#003366]" />
                    </div>
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editorial;
