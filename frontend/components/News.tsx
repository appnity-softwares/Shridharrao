import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Calendar, User, ArrowRight, Clock, Tag } from 'lucide-react';
import type { NewsItem } from '../types';

const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Mitaan India Launches Revolutionary Digital Initiative for Grassroots Reporting',
    excerpt: 'In a landmark move to empower local journalists, Mitaan India Media announces a comprehensive digital training program covering 100 districts across India.',
    category: 'Media',
    thumbnail: 'https://picsum.photos/id/1/800/500',
    date: '2024-12-15',
    author: 'Shridhar Rao',
    featured: true
  },
  {
    id: '2',
    title: 'Shridhar Rao Receives Prestigious National Excellence Award in Broadcast Journalism',
    excerpt: 'The award recognizes outstanding contribution to Indian journalism and commitment to unbiased reporting over the past 15 years.',
    category: 'Awards',
    thumbnail: 'https://picsum.photos/id/20/800/500',
    date: '2024-12-12',
    author: 'Shridhar Rao',
    featured: true
  },
  {
    id: '3',
    title: 'Mitaan India Expands Coverage to 5 New States in Central India',
    excerpt: 'The expansion marks a significant milestone in our mission to bring authentic regional stories to the national spotlight.',
    category: 'Expansion',
    thumbnail: 'https://picsum.photos/id/3/800/500',
    date: '2024-12-10',
    author: 'Bureau Chief'
  },
  {
    id: '4',
    title: 'Exclusive Interview: Shridhar Rao Speaks on the Future of Indian Media',
    excerpt: 'In this candid conversation, we discuss the challenges facing Indian journalism and the path forward for responsible reporting.',
    category: 'Interview',
    thumbnail: 'https://picsum.photos/id/4/800/500',
    date: '2024-12-08',
    author: 'Editorial Team'
  },
  {
    id: '5',
    title: 'Mitaan Media Academy Announces New Batch for Aspiring Journalists',
    excerpt: 'Applications are now open for the 2025 cohort of the Mitaan Media Academy, offering comprehensive training in broadcast journalism.',
    category: 'Education',
    thumbnail: 'https://picsum.photos/id/5/800/500',
    date: '2024-12-05',
    author: 'Academy Desk'
  },
  {
    id: '6',
    title: 'Ground Report: The Changing Landscape of Rural Electrification',
    excerpt: 'Our team travels to remote villages to document the real impact of government initiatives on ground level.',
    category: 'Ground Report',
    thumbnail: 'https://picsum.photos/id/6/800/500',
    date: '2024-12-03',
    author: 'Field Team'
  },
  {
    id: '7',
    title: 'Budget 2025: Mitaan India\'s Comprehensive Coverage and Analysis',
    excerpt: 'Our expert panel breaks down the union budget implications for common citizens and key sectors.',
    category: 'Politics',
    thumbnail: 'https://picsum.photos/id/7/800/500',
    date: '2024-12-01',
    author: 'Economics Desk'
  },
  {
    id: '8',
    title: 'Technology Special: How AI is Transforming Indian Newsrooms',
    excerpt: 'Exploring the intersection of artificial intelligence and traditional journalism practices.',
    category: 'Technology',
    thumbnail: 'https://picsum.photos/id/8/800/500',
    date: '2024-11-28',
    author: 'Tech Desk'
  },
  {
    id: '9',
    title: 'Health Campaign: Mitaan India\'s Initiative for Rural Wellness',
    excerpt: 'A comprehensive health awareness campaign reaching over 10 lakh citizens across 3 states.',
    category: 'Social Initiative',
    thumbnail: 'https://picsum.photos/id/9/800/500',
    date: '2024-11-25',
    author: 'Social Desk'
  }
];

const categories = ['All', 'Media', 'Awards', 'Expansion', 'Interview', 'Politics', 'Technology', 'Ground Report'];

const News: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = newsItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredNews = newsItems.filter(n => n.featured);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-[#003366] py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="diagonal" patternUnits="userSpaceOnUse" width="10" height="10">
              <path d="M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2" stroke="white" strokeWidth="1" />
            </pattern>
            <rect fill="url(#diagonal)" width="100%" height="100%" />
          </svg>
        </div>
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-block px-4 py-1.5 bg-[#CC0000]/20 text-[#CC0000] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
              Latest Updates
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
              News & <span className="text-[#C5A059]">Updates</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg font-serif-body leading-relaxed">
              Stay informed with the latest developments from Mitaan India Media and breaking stories from across the nation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured News */}
      {featuredNews.length > 0 && (
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredNews.map((news, idx) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[16/9] overflow-hidden rounded-2xl mb-6">
                    <img
                      src={news.thumbnail}
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-[#CC0000] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
                      Featured
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <div className="flex items-center gap-4 text-xs mb-3 text-slate-300">
                        <span className="flex items-center gap-1"><Calendar size={14} /> {news.date}</span>
                        <span className="flex items-center gap-1"><User size={14} /> {news.author}</span>
                      </div>
                      <h3 className="font-heading text-2xl font-bold leading-tight group-hover:text-[#CC0000] transition-colors">
                        {news.title}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Search and Filter */}
      <section className="py-12 bg-white sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat
                    ? 'bg-[#003366] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Search news..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:border-[#003366] transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* News Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((news, idx) => (
              <motion.article
                key={news.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={news.thumbnail}
                    alt={news.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 bg-[#003366] text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest">
                    {news.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-4 text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {news.date}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> 5 min read</span>
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#003366] mb-3 group-hover:text-[#CC0000] transition-colors line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {news.excerpt}
                  </p>
                  <button className="flex items-center gap-2 text-[#CC0000] font-bold text-sm hover:gap-3 transition-all">
                    Read More <ArrowRight size={16} />
                  </button>
                </div>
              </motion.article>
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="text-center py-20">
              <Tag size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold text-slate-400 mb-2">No news found</h3>
              <p className="text-slate-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-[#003366]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-slate-300 mb-8 font-serif-body">
              Subscribe to our newsletter and get the latest news delivered directly to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-[#C5A059] transition-colors"
              />
              <button className="px-8 py-4 bg-[#CC0000] text-white font-bold rounded-lg hover:bg-[#990000] transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default News;

