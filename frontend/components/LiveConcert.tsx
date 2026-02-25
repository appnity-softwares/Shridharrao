
import React from 'react';
import { motion } from 'framer-motion';
import { Youtube, Calendar, Ticket } from 'lucide-react';

const LiveConcert: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#003366] mb-4">Live Concerts</h2>
          <div className="w-24 h-1.5 bg-[#CC0000] mx-auto rounded-full"></div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="aspect-w-16 aspect-h-9 mb-6">
              <iframe
                className="w-full h-full rounded-lg"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="text-center">
              <h3 className="font-heading text-2xl font-bold text-[#003366] mb-2">Shridhar Rao: Live from Delhi</h3>
              <p className="text-slate-500 font-serif-body mb-4">
                Join us for an exclusive live performance and interactive session with Shridhar Rao.
              </p>
              <div className="flex justify-center items-center space-x-6 text-slate-600 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-[#CC0000]" />
                  <span>February 10, 2026</span>
                </div>
                <div className="flex items-center">
                  <Ticket className="w-5 h-5 mr-2 text-[#CC0000]" />
                  <span>Tickets Available Now</span>
                </div>
              </div>
              <button className="bg-[#003366] text-white font-bold py-3 px-8 rounded-full hover:bg-[#CC0000] transition-colors flex items-center justify-center mx-auto">
                <Youtube className="mr-2" />
                Watch Live
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LiveConcert;
