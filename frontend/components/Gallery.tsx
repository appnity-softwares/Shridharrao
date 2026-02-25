import React from 'react';
import { motion } from 'framer-motion';
import { Play, Calendar, Video, ArrowRight } from 'lucide-react';
import MagneticWrapper from './MagneticWrapper';

const videos = [
  {
    title: "Ground Zero Report: Infrastructure Metamorphosis",
    category: "Politics",
    date: "Dec 12, 2025",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92af1ab?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Exclusive: Policy Shifts with the Finance Minister",
    category: "Exclusive",
    date: "Dec 10, 2025",
    image: "https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=2070&auto=format&fit=crop"
  },
  {
    title: "Digital Ethics: Reporting in the age of AI",
    category: "Media",
    date: "Dec 08, 2025",
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop"
  }
];

const Gallery: React.FC = () => {
  return (
    <div className="py-40 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <Video className="text-secondary" size={32} />
              <span className="text-secondary font-black tracking-[0.4em] uppercase text-xs">Visual Broadcasts</span>
            </div>
            <h2 className="font-heading text-6xl md:text-8xl font-black text-primary leading-[0.9]">
              Broadcast <br />
              <span className="gold-gradient">Exclusives.</span>
            </h2>
          </div>
          <MagneticWrapper>
            <button
              data-cursor="view"
              className="px-10 py-4 bg-slate-50 text-primary font-black uppercase text-[10px] tracking-widest rounded-2xl flex items-center gap-3 hover:bg-primary hover:text-white transition-all group"
            >
              Access Media Vault <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
            </button>
          </MagneticWrapper>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {videos.map((video, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col group cursor-pointer"
              data-cursor="view"
            >
              <div className="relative aspect-video overflow-hidden rounded-[40px] shadow-2xl bg-slate-100 mb-8">
                <img src={video.image} alt={video.title} className="w-full h-full object-cover grayscale-[0.3] transition-all duration-1000 group-hover:scale-110 group-hover:grayscale-0" />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-all duration-500">
                    <Play size={24} fill="white" />
                  </div>
                </div>
                <div className="absolute top-8 left-8">
                  <span className="px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-white text-[9px] font-black uppercase tracking-widest border border-white/20">
                    {video.category}
                  </span>
                </div>
              </div>
              <div className="px-4">
                <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                  <Calendar size={14} className="text-accent" />
                  {video.date}
                </div>
                <h3 className="text-2xl font-black text-primary group-hover:text-accent transition-colors leading-tight">
                  {video.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
