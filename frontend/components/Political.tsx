import React from 'react';
import { motion } from 'framer-motion';
import { Landmark, ArrowRight, Calendar, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const Political: React.FC = () => {
  const politicalArticles = articles.filter(a => a.category === 'Political' || a.category === 'National' || a.category === 'Governance');

  return (
    <div className="min-h-screen bg-[#F5F5F5] font-sans pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-[#CC0000] font-bold text-sm tracking-[0.2em] uppercase mb-2 block">Governance & Policy</span>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#003366] mb-6">Political News</h1>
          <div className="w-24 h-1.5 bg-[#CC0000] mx-auto rounded-full"></div>
          <p className="max-w-2xl mx-auto mt-6 text-slate-600 font-serif-body text-lg">
            Stay updated with the latest assembly sessions, policy decisions, and administrative reforms shaping our state and nation.
          </p>
        </div>

        {/* Filters (Optional enhancement visually) */}
        <div className="flex justify-center gap-4 mb-12">
          {['All', 'Assembly', 'Policy', 'Elections'].map((filter) => (
            <button key={filter} className={`px-4 py-2 rounded-full text-sm font-bold border transition-colors ${filter === 'All' ? 'bg-[#003366] text-white border-[#003366]' : 'bg-white text-slate-600 border-slate-300 hover:border-[#003366] hover:text-[#003366]'}`}>
              {filter}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {politicalArticles.map((article, idx) => (
            <Link key={article.id} to={`/journal/${article.id}`}>
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow border border-slate-100 flex flex-col h-full group"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 bg-[#CC0000] text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm tracking-wider shadow-sm">
                    {article.category}
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase mb-3">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {article.date}</span>
                    <span className="flex items-center gap-1"><User size={12} /> {article.author}</span>
                  </div>
                  <h2 className="font-heading text-xl font-bold text-slate-800 mb-3 group-hover:text-[#003366] transition-colors leading-tight">
                    {article.title}
                  </h2>
                  <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-[#CC0000] font-bold text-xs uppercase tracking-wider gap-2 group-hover:gap-3 transition-all">
                    Read Full Article <ArrowRight size={14} />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>

        {/* Load More (Visual only) */}
        <div className="text-center mt-16">
          <button className="px-8 py-3 border-2 border-[#003366] text-[#003366] font-bold rounded hover:bg-[#003366] hover:text-white transition-colors uppercase tracking-wider text-sm">
            Load More Archives
          </button>
        </div>
      </div>
    </div>
  );
};

export default Political;
