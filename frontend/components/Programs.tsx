import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Calendar, Tv, Mic2, Users, FileText, Monitor } from 'lucide-react';
import type { Program } from '../types';

const programs: Program[] = [
  {
    id: '1',
    title: 'Mitaan Prime Time',
    description: 'The flagship news analysis program bringing you the most important stories of the day with in-depth reporting and expert panel discussions.',
    host: 'Shridhar Rao',
    schedule: 'Mon-Fri, 8:00 PM',
    thumbnail: 'https://picsum.photos/id/100/800/500',
    duration: '60 min',
    type: 'news'
  },
  {
    id: '2',
    title: 'The Big Debate',
    description: 'A heated discussion on controversial political and social issues featuring diverse perspectives from across the spectrum.',
    host: 'Shridhar Rao',
    schedule: 'Saturdays, 9:00 PM',
    thumbnail: 'https://picsum.photos/id/101/800/500',
    duration: '90 min',
    type: 'debate'
  },
  {
    id: '3',
    title: 'In Conversation With',
    description: 'Exclusive one-on-one interviews with influential personalities from politics, business, entertainment, and sports.',
    host: 'Shridhar Rao',
    schedule: 'Sundays, 7:00 PM',
    thumbnail: 'https://picsum.photos/id/102/800/500',
    duration: '45 min',
    type: 'interview'
  },
  {
    id: '4',
    title: 'India Unveiled',
    description: 'Documentary series exploring the hidden gems, traditions, and stories that make India truly incredible.',
    host: 'Various Hosts',
    schedule: 'Every Thursday, 8:00 PM',
    thumbnail: 'https://picsum.photos/id/103/800/500',
    duration: '50 min',
    type: 'documentary'
  },
  {
    id: '5',
    title: 'Mann Ki Baat - Edition',
    description: 'An interactive talk show where common citizens share their stories, concerns, and suggestions directly with the host.',
    host: 'Shridhar Rao',
    schedule: 'Wednesdays, 7:30 PM',
    thumbnail: 'https://picsum.photos/id/104/800/500',
    duration: '55 min',
    type: 'talk-show'
  },
  {
    id: '6',
    title: 'Budget Beat',
    description: 'Comprehensive coverage and expert analysis of the union budget and its impact on the common man.',
    host: 'Economic Desk',
    schedule: 'Budget Day, 5:00 PM',
    thumbnail: 'https://picsum.photos/id/105/800/500',
    duration: '120 min',
    type: 'news'
  },
  {
    id: '7',
    title: 'Election Special: Demokracy Live',
    description: 'Extensive coverage of general and state elections with real-time results, exit polls, and expert predictions.',
    host: 'Shridhar Rao',
    schedule: 'Election Days',
    thumbnail: 'https://picsum.photos/id/106/800/500',
    duration: 'Live Coverage',
    type: 'news'
  },
  {
    id: '8',
    title: 'Health Ki Baat',
    description: 'Health awareness program featuring expert doctors, medical breakthroughs, and wellness tips for a healthier India.',
    host: 'Medical Panel',
    schedule: 'Tuesdays, 6:00 PM',
    thumbnail: 'https://picsum.photos/id/107/800/500',
    duration: '40 min',
    type: 'talk-show'
  }
];

const typeIcons: Record<string, React.ReactNode> = {
  news: <Tv size={20} />,
  debate: <Users size={20} />,
  interview: <Mic2 size={20} />,
  documentary: <Monitor size={20} />,
  'talk-show': <FileText size={20} />
};

const typeColors: Record<string, string> = {
  news: 'bg-blue-100 text-blue-700',
  debate: 'bg-red-100 text-red-700',
  interview: 'bg-purple-100 text-purple-700',
  documentary: 'bg-green-100 text-green-700',
  'talk-show': 'bg-amber-100 text-amber-700'
};

const Programs: React.FC = () => {
  const [activeType, setActiveType] = useState('All');

  const types = ['All', ...new Set(programs.map(p => p.type))];

  const filteredPrograms = activeType === 'All'
    ? programs
    : programs.filter(p => p.type === activeType);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#003366] to-[#002244] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
            <rect fill="url(#dots)" width="100%" height="100%" />
          </svg>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#CC0000]/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-20 w-40 h-40 bg-[#C5A059]/20 rounded-full blur-2xl"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#CC0000]/20 text-[#CC0000] text-xs font-bold rounded-full mb-6 tracking-widest uppercase">
              <Tv size={14} /> Shows & Programs
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-[#C5A059]">Programs</span>
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg font-serif-body leading-relaxed">
              Award-winning shows that inform, educate, and inspire. From hard-hitting news to insightful documentaries, we bring you content that matters.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Weekly Shows', value: '12+' },
              { label: 'Hours of Content', value: '50+' },
              { label: 'Weekly Viewers', value: '2Cr+' },
              { label: 'Years on Air', value: '15+' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold text-[#003366] mb-2">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Type Filter */}
      <section className="py-12 bg-white sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {types.map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(type)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold capitalize transition-all flex items-center gap-2 ${activeType === type
                  ? 'bg-[#003366] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {type !== 'All' && typeIcons[type]}
                {type}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {filteredPrograms.map((program, idx) => (
              <motion.article
                key={program.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Thumbnail */}
                  <div className="md:w-2/5 relative aspect-[4/3] md:aspect-auto overflow-hidden">
                    <img
                      src={program.thumbnail}
                      alt={program.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#CC0000] rounded-full flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-300">
                        <Play size={28} fill="currentColor" />
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-widest ${typeColors[program.type]}`}>
                        {program.type}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:w-3/5 p-8 flex flex-col justify-center">
                    <h3 className="font-heading text-2xl font-bold text-[#003366] mb-3 group-hover:text-[#CC0000] transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6">
                      {program.description}
                    </p>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3 text-slate-600">
                        <Users size={16} className="text-[#CC0000]" />
                        <span className="font-semibold">{program.host}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Calendar size={16} className="text-[#CC0000]" />
                        <span>{program.schedule}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Clock size={16} className="text-[#CC0000]" />
                        <span>{program.duration}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Watch Live CTA */}
      <section className="py-20 bg-gradient-to-r from-[#CC0000] to-[#990000]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Watch Live on Mitaan India
              </h2>
              <p className="text-white/80 max-w-lg">
                Stream all our programs live on our website, mobile app, or connected TV devices.
              </p>
            </div>
            <button className="flex items-center gap-3 px-8 py-4 bg-white text-[#003366] font-bold rounded-full hover:scale-105 transition-transform shadow-xl">
              <Play size={20} fill="currentColor" />
              Watch Live Now
            </button>
          </div>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-heading text-3xl font-bold text-[#003366] mb-4">Coming Soon</h2>
              <div className="w-24 h-1.5 bg-[#CC0000] mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Mitaan Kids', desc: 'Educational entertainment for children' },
                { title: 'Business Central', desc: 'Market analysis and business news' },
                { title: 'Sports Arena', desc: 'Comprehensive sports coverage' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-center"
                >
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Tv size={24} className="text-slate-400" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-[#003366] mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Programs;

