import React from 'react';
import { motion } from 'framer-motion';
import { Advertisement } from '../services/api';
import { ExternalLink, X } from 'lucide-react';

interface AdSidebarProps {
    ad: Advertisement;
    onClose?: () => void;
}

const AdSidebar: React.FC<AdSidebarProps> = ({ ad, onClose }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative group rounded-[2rem] overflow-hidden shadow-xl border border-slate-50 aspect-[4/5] bg-white"
        >
            <a href={ad.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full relative">
                <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
                    <p className="text-white font-black uppercase text-[10px] tracking-widest mb-2 flex items-center gap-2">
                        Sponsored <ExternalLink size={10} />
                    </p>
                    <h4 className="text-white text-lg font-bold leading-tight">{ad.title}</h4>
                </div>
            </a>
            {onClose && (
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors"
                >
                    <X size={14} />
                </button>
            )}
            <div className="absolute top-4 left-4">
                <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-md text-[8px] font-black uppercase text-primary tracking-widest shadow-sm">
                    AD
                </span>
            </div>
        </motion.div>
    );
};

export default AdSidebar;
