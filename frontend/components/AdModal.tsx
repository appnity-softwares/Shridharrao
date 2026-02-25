import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Advertisement } from '../services/api';
import { X, ExternalLink } from 'lucide-react';

interface AdModalProps {
    ads: Advertisement[];
}

const AdModal: React.FC<AdModalProps> = ({ ads }) => {
    const [currentAd, setCurrentAd] = useState<Advertisement | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (ads.length > 0) {
            const popupAds = ads.filter(ad => ad.type === 'popup' && ad.isActive);
            if (popupAds.length > 0) {
                // Show a random popup ad after 5 seconds
                const timer = setTimeout(() => {
                    const randomAd = popupAds[Math.floor(Math.random() * popupAds.length)];
                    setCurrentAd(randomAd);
                    setIsOpen(true);
                }, 5000);
                return () => clearTimeout(timer);
            }
        }
    }, [ads]);

    if (!currentAd) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[6000] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        className="bg-white rounded-[40px] overflow-hidden max-w-lg w-full shadow-2xl relative"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 z-10 p-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors shadow-lg"
                        >
                            <X size={20} />
                        </button>

                        <div className="relative aspect-video">
                            <img
                                src={currentAd.imageUrl}
                                alt={currentAd.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute top-6 left-6">
                                <span className="px-3 py-1 bg-accent text-white rounded-md text-[9px] font-black uppercase tracking-widest shadow-lg">
                                    Sponsored
                                </span>
                            </div>
                        </div>

                        <div className="p-10 text-center">
                            <h3 className="font-heading text-2xl md:text-3xl font-black text-primary mb-6 leading-tight">
                                {currentAd.title}
                            </h3>
                            <a
                                href={currentAd.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-4 px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:bg-accent transition-all group"
                            >
                                Learn More <ExternalLink size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AdModal;
