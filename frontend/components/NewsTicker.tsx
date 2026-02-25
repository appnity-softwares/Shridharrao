import React, { useState, useEffect } from 'react';
import { Twitter, Youtube, Instagram, Radio } from 'lucide-react';
import { fetchHeadlines, Headline } from '../services/api';

const NewsTicker: React.FC = () => {
  const [headlines, setHeadlines] = useState<string[]>([
    "Mitaan India launches new digital initiative for grassroots reporting",
    "Shridhar Rao receives National Excellence Award in Broadcast Journalism",
    "Mitaan India expands coverage to 5 new states across Central India",
    "Exclusive Interview: Shridhar Rao speaks with leading political analysts",
    "Mitaan Media Academy announces new batch for aspiring journalists"
  ]);

  useEffect(() => {
    const loadHeadlines = async () => {
      try {
        const data = await fetchHeadlines();
        if (data.length > 0) {
          setHeadlines(data.map(h => h.title));
        }
      } catch (error) {
        console.error("Failed to load headlines for ticker", error);
      }
    };
    loadHeadlines();
  }, []);

  return (
    <div className="w-full bg-dark-blue/80 backdrop-blur-md text-white py-2 overflow-hidden flex items-center border-b border-white/5 z-[60] relative">
      <div className="bg-secondary px-6 font-black text-[10px] uppercase tracking-[0.2em] absolute left-0 z-10 h-full flex items-center gap-2">
        <Radio size={14} className="animate-pulse" />
        Breaking
      </div>
      <div className="flex-1 overflow-hidden whitespace-nowrap ml-36">
        <div className="inline-block animate-ticker">
          {[...headlines, ...headlines].map((headline, idx) => (
            <span key={idx} className="mx-8 text-xs font-bold tracking-wide uppercase text-slate-300">
              <span className="text-accent mr-3">//</span> {headline}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-6 px-8 bg-dark-blue/80 backdrop-blur-md z-10 border-l border-white/5">
        <a href="#" className="text-slate-400 hover:text-accent transition-all hover:scale-110"><Twitter size={16} /></a>
        <a href="#" className="text-slate-400 hover:text-accent transition-all hover:scale-110"><Youtube size={16} /></a>
        <a href="#" className="text-slate-400 hover:text-accent transition-all hover:scale-110"><Instagram size={16} /></a>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          display: inline-block;
          animation: ticker 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default NewsTicker;
