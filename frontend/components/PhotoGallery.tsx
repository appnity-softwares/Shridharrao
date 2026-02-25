import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Camera, X, ZoomIn, Calendar, MapPin, Search, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { PhotoItem } from '../types';
import { fetchPhotos, Photo } from '../services/api';
import { useQuery } from '@tanstack/react-query';

const categories = ['All', 'Events', 'Studio', 'Field', 'Coverage'];

// TILT COMPONENT FOR PARALLAX PERSPECTIVE
const TiltCard: React.FC<{ photo: PhotoItem; onClick: () => void; idx: number; span?: string }> = ({ photo, onClick, idx, span }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const springConfig = { damping: 20, stiffness: 300 };
  const smoothRotateX = useSpring(rotateX, springConfig);
  const smoothRotateY = useSpring(rotateY, springConfig);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.8 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX: smoothRotateX, rotateY: smoothRotateY, perspective: 1000 }}
      className={`${span || 'col-span-1'} relative group cursor-pointer overflow-hidden rounded-[40px] shadow-[0_20px_50px_-15px_rgba(0,0,0,0.06)] bg-white border border-slate-50 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] transition-all duration-700 h-full`}
      onClick={onClick}
    >
      {/* Archival Stamp Badge */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <div className="px-3 py-1 bg-primary backdrop-blur-md rounded-lg border border-slate-800 shadow-xl opacity-0 group-hover:opacity-100 transition-all transform -translate-x-2 group-hover:translate-x-0 duration-500">
          <span className="text-[8px] font-black text-white tracking-widest uppercase">{photo.dispatchId}</span>
        </div>
      </div>

      <img
        src={photo.imageUrl}
        alt={photo.title}
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.5s] ease-out"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 lg:p-12 text-left">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-[1px] bg-accent"></div>
          <span className="text-accent font-black uppercase text-[10px] tracking-[0.4em]">{photo.category}</span>
        </div>
        <div className="font-heading text-2xl lg:text-3xl font-bold !text-white mb-4 leading-tight drop-shadow-sm">
          {photo.title}
        </div>
        <div className="flex items-center justify-between text-white/90 text-[9px] font-black uppercase tracking-[0.2em] pt-4 border-t border-white/20">
          <span className="flex items-center gap-2 drop-shadow-sm"><MapPin size={10} className="text-accent" /> {photo.location}</span>
          <span className="!text-white drop-shadow-sm">{photo.date}</span>
        </div>
        <div className="absolute top-8 right-8 bg-accent p-4 rounded-2xl shadow-2xl hover:scale-110 transition-transform cursor-pointer">
          <ZoomIn size={20} className="text-white" />
        </div>
      </div>
    </motion.div>
  );
};

const PhotoGallery: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: photos = [], isLoading: loading } = useQuery({
    queryKey: ['photos'],
    queryFn: async () => {
      const data = await fetchPhotos();
      return data as unknown as PhotoItem[];
    }
  });

  const filteredPhotos = useMemo(() => {
    return photos
      .filter(p => activeCategory === 'All' || p.category === activeCategory)
      .filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [activeCategory, searchTerm, photos]);

  const currentIndex = useMemo(() => {
    return selectedPhoto ? filteredPhotos.findIndex(p => p.id === selectedPhoto.id) : -1;
  }, [selectedPhoto, filteredPhotos]);

  const handleNext = () => {
    if (currentIndex === -1) return;
    const nextIdx = (currentIndex + 1) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[nextIdx]);
  };

  const handlePrev = () => {
    if (currentIndex === -1) return;
    const prevIdx = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    setSelectedPhoto(filteredPhotos[prevIdx]);
  };

  const suggestions = useMemo(() => {
    if (!selectedPhoto) return [];
    return photos
      .filter(p => p.id !== selectedPhoto.id && p.category === selectedPhoto.category)
      .slice(0, 3);
  }, [selectedPhoto]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (selectedPhoto) {
        if (e.key === 'ArrowRight') handleNext();
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'Escape') setSelectedPhoto(null);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [selectedPhoto, currentIndex]);

  const getBentoSpan = (idx: number) => {
    const patterns = [
      "lg:col-span-2 lg:row-span-2", // Item 1: Large square
      "lg:col-span-1 lg:row-span-1", // Item 2: Small
      "lg:col-span-1 lg:row-span-2", // Item 3: Vertical tall
      "lg:col-span-1 lg:row-span-1", // Item 4: Small
      "lg:col-span-2 lg:row-span-1", // Item 5: Horizontal wide
      "lg:col-span-1 lg:row-span-1", // Item 6: Small
    ];
    return patterns[idx % patterns.length];
  }

  return (
    <div className="min-h-screen bg-white pt-40 pb-32 font-body overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">

        {/* Header Section */}
        <section className="mb-24 flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div className="reveal active text-left">
            <div className="flex items-center gap-4 mb-8">
              <Camera className="text-accent" size={24} />
              <span className="text-accent font-black tracking-[0.4em] uppercase text-[10px]">Visual Transmissions</span>
            </div>
            <h1 className="font-heading text-6xl md:text-8xl font-bold text-primary leading-[0.9] tracking-tighter">
              Perspective <br />
              <span className="gold-gradient italic text-[1.2em]">Captured.</span>
            </h1>
          </div>

          <div className="md:max-w-xs reveal active text-left">
            <p className="text-lg text-slate-400 font-medium leading-relaxed italic border-l-[1.5px] border-slate-100 pl-8">
              "A documentation of field investigations, studio reflections, and the moments between the narratives."
            </p>
          </div>
        </section>

        {/* Filter Bar */}
        <div className="mb-20 flex flex-col lg:flex-row items-center justify-between gap-10 border-b border-slate-50 pb-10 reveal active">
          <div className="flex flex-wrap gap-3 items-center">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${activeCategory === c
                  ? 'bg-primary text-white shadow-xl'
                  : 'bg-slate-50 text-slate-400 hover:text-primary'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="relative group w-full lg:w-96 text-left">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-accent transition-colors" size={16} />
            <input
              type="text"
              placeholder="Query Archives..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#FCFCFC] border border-slate-100 outline-none font-bold text-sm text-primary shadow-sm focus:ring-1 focus:ring-accent transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* HIGH-END BENTO GRID */}
        {loading ? (
          <div className="flex h-96 items-center justify-center">
            <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] lg:auto-rows-[350px] gap-8">
            {Array.isArray(filteredPhotos) && filteredPhotos.map((photo, idx) => (
              <TiltCard
                key={photo.id}
                photo={photo}
                idx={idx}
                span={getBentoSpan(idx)}
                onClick={() => setSelectedPhoto(photo)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] bg-white/98 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 lg:p-20 overflow-y-auto"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="relative max-w-7xl w-full flex flex-col lg:flex-row gap-16 lg:gap-20 items-stretch bg-white lg:min-h-[80vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="fixed top-8 right-8 p-4 lg:p-6 bg-slate-50 text-primary rounded-2xl hover:bg-primary hover:text-white transition-all z-20"
                onClick={() => setSelectedPhoto(null)}
              >
                <X size={24} />
              </button>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="fixed left-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 bg-white/50 border border-slate-100 backdrop-blur-xl text-primary rounded-full hover:bg-primary hover:text-white transition-all z-20 shadow-xl"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={handleNext}
                className="fixed right-8 top-1/2 -translate-y-1/2 flex items-center justify-center w-16 h-16 bg-white/50 border border-slate-100 backdrop-blur-xl text-primary rounded-full hover:bg-primary hover:text-white transition-all z-20 shadow-xl"
              >
                <ChevronRight size={32} />
              </button>

              <div className="w-full lg:w-[60%] flex items-center justify-center">
                <motion.div
                  key={selectedPhoto.id}
                  initial={{ scale: 0.95, opacity: 0, x: 20 }}
                  animate={{ scale: 1, opacity: 1, x: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="relative w-full aspect-video lg:aspect-auto lg:h-[70vh] p-4 md:p-6 bg-slate-50 rounded-[4rem] flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={selectedPhoto.imageUrl}
                    className="max-w-full max-h-full rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] grayscale-[0.2] hover:grayscale-0 transition-all duration-1000 object-contain"
                    alt={selectedPhoto.title}
                  />

                  {/* Visual Stamp in Modal */}
                  <div className="absolute bottom-12 left-12 hidden lg:block">
                    <div className="flex flex-col gap-1 px-5 py-3 bg-white/40 backdrop-blur-xl border border-white/20 rounded-2xl text-left">
                      <span className="text-[9px] font-black text-primary tracking-[0.4em] uppercase">Archive Verified</span>
                      <span className="text-[11px] font-mono font-bold text-accent">{selectedPhoto.dispatchId}</span>
                    </div>
                  </div>
                </motion.div>
              </div>

              <div className="w-full lg:w-[40%] flex flex-col justify-between py-10 lg:py-6 overflow-y-auto">
                <div className="space-y-10 text-left">
                  <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-50 rounded-full w-fit">
                    <span className="text-[10px] font-black uppercase tracking-widest text-accent">Journal Archive • {selectedPhoto.category}</span>
                  </div>

                  <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary leading-tight tracking-tighter">
                    {selectedPhoto.title}
                  </h2>

                  <div className="border-l-[1.5px] border-slate-100 pl-8 space-y-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Field Notes:</span>
                    <p className="text-base text-slate-600 font-mono leading-relaxed bg-slate-50/30 p-5 rounded-xl">
                      {selectedPhoto.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-50">
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest block flex items-center gap-2"><MapPin size={10} /> Deployment</span>
                      <span className="text-sm font-black text-primary tracking-tight block">{selectedPhoto.location}</span>
                    </div>
                    <div className="space-y-2">
                      <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest block flex items-center gap-2"><Calendar size={10} /> Dated Archive</span>
                      <span className="text-sm font-black text-primary tracking-tight block">{selectedPhoto.date}</span>
                    </div>
                  </div>
                </div>

                {/* SUGGESTON SECTION */}
                <div className="mt-20 lg:mt-16 pt-10 border-t border-slate-100 text-left">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-8 flex items-center gap-3">
                    <ZoomIn size={14} /> Similar Investigations
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {suggestions.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPhoto(p)}
                        className="group cursor-pointer space-y-3"
                      >
                        <div className="aspect-square rounded-2xl overflow-hidden bg-slate-50 shadow-sm border border-slate-100 relative">
                          <img
                            src={p.imageUrl}
                            className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                            alt={p.title}
                          />
                          <div className="absolute inset-0 bg-accent/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h5 className="text-[10px] font-black text-primary leading-tight truncate px-1 group-hover:text-accent transition-colors">{p.title}</h5>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PhotoGallery;
