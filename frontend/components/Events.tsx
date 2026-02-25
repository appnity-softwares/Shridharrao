
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const events = [
  {
    date: 'Feb 10, 2026',
    title: 'Live from Delhi',
    location: 'New Delhi, India',
    description: 'An exclusive live performance and interactive session.',
  },
  {
    date: 'Mar 15, 2026',
    title: 'Town Hall Meeting',
    location: 'Mumbai, India',
    description: 'A public forum to discuss pressing issues with local leaders.',
  },
  {
    date: 'Apr 22, 2026',
    title: 'Journalism Workshop',
    location: 'Online Event',
    description: 'A workshop for aspiring journalists on ethics and investigative reporting.',
  },
];

const Events: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#003366] mb-4">Upcoming Events</h2>
          <div className="w-24 h-1.5 bg-[#CC0000] mx-auto rounded-full"></div>
        </div>

        <div className="space-y-8">
          {events.map((event, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-6"
            >
              <div className="text-center w-24">
                <div className="text-3xl font-bold text-[#CC0000]">{event.date.split(' ')[1].replace(',', '')}</div>
                <div className="text-sm uppercase tracking-wider text-slate-500">{event.date.split(' ')[0]} {event.date.split(' ')[2]}</div>
              </div>
              <div className="flex-grow">
                <h3 className="font-heading text-xl font-bold text-[#003366] mb-2">{event.title}</h3>
                <div className="flex items-center text-slate-500 text-sm mb-3">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{event.location}</span>
                </div>
                <p className="text-slate-600 font-serif-body leading-relaxed mb-4">{event.description}</p>
                <a href="#" className="font-bold text-[#003366] hover:text-[#CC0000] transition-colors flex items-center">
                  Learn More <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
