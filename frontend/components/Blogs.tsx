import React from 'react';
import { motion } from 'framer-motion';
import { Mic, ArrowRight, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const Blogs: React.FC = () => {
  const blogArticles = articles.filter(a => a.category === 'Blog' || a.category === 'Opinion'); // Adjust categories if needed

  return (
    <div className="min-h-screen bg-[#F0F4F8] font-sans pt-28 pb-20">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#003366] rounded-full text-white mb-6 shadow-lg shadow-blue-900/20">
            <Mic size={32} />
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-[#003366] mb-4">Shridhar Rao's Blog</h1>
          <p className="text-slate-700 text-lg">Personal thoughts, daily musings, and unfiltered opinions from the desk.</p>
        </div>

        {/* Blog List */}
        <div className="space-y-12">
          {blogArticles.map((article, idx) => (
            <Link key={article.id} to={`/journal/${article.id}`} className="block group">
              <motion.article
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 md:p-10 rounded-2xl shadow-sm hover:shadow-xl transition-all border border-slate-100 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-2 h-full bg-[#CC0000] opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 text-sm text-slate-500 font-bold uppercase mb-4">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {article.date}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-[#CC0000]">{article.readTime}</span>
                    </div>
                    <h2 className="font-heading text-2xl md:text-3xl font-bold text-slate-800 mb-4 group-hover:text-[#003366] transition-colors leading-tight">
                      {article.title}
                    </h2>
                    <p className="text-slate-600 font-serif-body text-lg leading-relaxed mb-6">
                      {article.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-2 text-[#003366] font-bold uppercase text-xs tracking-wider border-b-2 border-transparent group-hover:border-[#003366] transition-all pb-1">
                      Continue Reading <ArrowRight size={14} />
                    </span>
                  </div>

                  {/* Optional small thumb for blog functionality if image exists */}
                  <div className="w-full md:w-40 aspect-square rounded-lg overflow-hidden shrink-0 bg-slate-100">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                </div>
              </motion.article>
            </Link>
          ))}
        </div>

        {/* Newsletter box for blogs specifically */}
        <div className="mt-20 bg-[#003366] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#CC0000] rounded-full blur-[100px] opacity-30 translate-x-1/2 -translate-y-1/2"></div>
          <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4 relative z-10">Never Miss an Update</h3>
          <p className="text-white font-medium mb-8 max-w-lg mx-auto relative z-10">Subscribe to get the latest blog posts directly in your inbox. No spam, just thoughts.</p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto relative z-10">
            <input type="email" placeholder="Email address" className="flex-1 px-6 py-3 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:border-[#CC0000] text-white placeholder:text-slate-400" />
            <button className="px-8 py-3 bg-[#CC0000] hover:bg-[#ff0000] text-white font-bold rounded-full transition-colors shadow-lg shadow-red-900/30">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
