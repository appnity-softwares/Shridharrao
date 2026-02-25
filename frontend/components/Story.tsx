import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { articles } from '../data/articles';

const Story: React.FC = () => {
  const storyArticles = articles.filter(a => a.category === 'Inspiration' || a.category === 'Culture' || a.category === 'Society' || a.category === 'Education');

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white font-sans pt-28 pb-20"> {/* Dark mode for Stories to make images pop */}
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="mb-16">
          <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-500">
            Stories of <span className="text-[#C5A059]">India</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl font-serif">
            Uncovering the hidden gems, cultural heritage, and inspiring journeys from the heart of the nation.
          </p>
        </div>

        {/* Mosaic Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[300px]">
          {storyArticles.map((story, idx) => (
            <Link
              key={story.id}
              to={`/article/${story.id}`}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${idx === 0 || idx === 3 ? 'md:col-span-2' : ''}`}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="w-full h-full"
              >
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

                <div className="absolute top-4 left-4">
                  <span className="bg-white/10 backdrop-blur border border-white/20 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                    {story.category}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                  <div className="mb-2 w-10 h-1 bg-[#C5A059] rounded-full"></div>
                  <h2 className="font-heading text-2xl font-bold leading-tight mb-2">
                    {story.title}
                  </h2>
                  <p className="text-slate-300 text-sm line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {story.excerpt}
                  </p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Story;
