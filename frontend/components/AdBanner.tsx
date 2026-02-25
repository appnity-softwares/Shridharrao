import React from 'react';
import { motion } from 'framer-motion';
import { Advertisement } from '../services/api';
import { ExternalLink } from 'lucide-react';

interface AdBannerProps {
    ad: Advertisement;
}

const AdBanner: React.FC<AdBannerProps> = ({ ad }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-slate-50 border-b border-slate-100 overflow-hidden group py-2"
        >
            <div className="container mx-auto px-6 md:px-12">
                <a
                    href={ad.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-4">
                        <span className="px-2 py-0.5 bg-accent text-white rounded text-[7px] font-black uppercase tracking-widest">
                            AD
                        </span>
                        <p className="text-[10px] md:text-sm font-bold text-slate-600 group-hover:text-accent transition-colors truncate">
                            {ad.title}
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-accent font-black uppercase text-[8px] tracking-widest whitespace-nowrap">
                        Learn More <ExternalLink size={12} />
                    </div>
                </a>
            </div>
        </motion.div>
    );
};

export default AdBanner;
