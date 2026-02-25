import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Calendar, Trophy, Star, Medal, Search, Filter } from 'lucide-react';
import type { Award as AwardType } from '../types';

const awards: AwardType[] = [
  {
    id: '1',
    title: 'National Excellence in Broadcast Journalism',
    organization: 'Indian Media Association',
    year: '2024',
    description: 'Recognized for outstanding contribution to Indian journalism and commitment to unbiased reporting.',
    icon: '🏆'
  },
  {
    id: '2',
    title: 'Best News Channel - Regional',
    organization: 'South Asian Media Awards',
    year: '2024',
    description: 'Awarded for excellence in regional news coverage and innovative storytelling.',
    icon: '🥇'
  },
  {
    id: '3',
    title: 'Rashtriya Gaurav Award',
    organization: 'National Leadership Foundation',
    year: '2023',
    description: 'Honored for exceptional service to the nation through impactful journalism.',
    icon: '⭐'
  },
  {
    id: '4',
    title: 'Best Documentary Series',
    organization: 'International Documentary Association',
    year: '2023',
    description: 'For the acclaimed documentary series "India Unveiled" exploring rural India.',
    icon: '🎬'
  },
  {
    id: '5',
    title: 'Journalist of the Year',
    organization: 'Press Club of India',
    year: '2023',
    description: 'Shridhar Rao honored as Journalist of the Year for fearless reporting.',
    icon: '📰'
  },
  {
    id: '6',
    title: 'Excellence in Investigative Reporting',
    organization: 'Investigative Journalism Foundation',
    year: '2022',
    description: 'For groundbreaking investigation on corporate malpractice in the healthcare sector.',
    icon: '🔍'
  },
  {
    id: '7',
    title: 'Best Digital Media Innovation',
    organization: 'Digital Media Awards Asia',
    year: '2022',
    description: 'Recognized for innovative digital platform and mobile app launch.',
    icon: '📱'
  },
  {
    id: '8',
    title: 'Social Impact Media Award',
    organization: 'Social Media for Change',
    year: '2022',
    description: 'For the "Mitaan Health" campaign reaching millions with health awareness.',
    icon: '💚'
  },
  {
    id: '9',
    title: 'Best Talk Show',
    organization: 'Indian Television Academy',
    year: '2021',
    description: '"In Conversation With" awarded Best Talk Show for insightful celebrity interviews.',
    icon: '🎙️'
  },
  {
    id: '10',
    title: 'Courage in Journalism Award',
    organization: 'International Press Institute',
    year: '2021',
    description: 'Honored for reporting from challenging situations during the pandemic.',
    icon: '💪'
  },
  {
    id: '11',
    title: 'Best Regional News Portal',
    organization: '互联网媒体大奖',
    year: '2021',
    description: 'Mitaan India website recognized for comprehensive regional coverage.',
    icon: '🌐'
  },
  {
    id: '12',
    title: 'Lifetime Achievement Nomination',
    organization: 'Global Journalism Council',
    year: '2020',
    description: 'Nominated among top 50 journalists globally for lifetime achievement.',
    icon: '🎖️'
  }
];

const years = ['All', '2024', '2023', '2022', '2021', '2020'];

const Awards: React.FC = () => {
  const [activeYear, setActiveYear] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredAwards = awards.filter(award => {
    const matchesYear = activeYear === 'All' || award.year === activeYear;
    return matchesYear;
  });

  const totalAwards = awards.length;
  const latestYear = Math.max(...awards.map(a => parseInt(a.year)));

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#003366] via-[#002244] to-[#001122] py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="star" patternUnits="userSpaceOnUse" width="50" height="50">
              <path d="M25,1 L28,18 L45,18 L30,28 L35,45 L25,35 L15,45 L20,28 L5,18 L22,18 Z" fill="white" />
            </pattern>
            <rect fill="url(#star)" width="100%" height="100%" />
          </svg>
        </div>
        {/* Decorative Elements */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#C5A059]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-[#CC0000]/10 rounded-full blur-3xl"></div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <Trophy size={32} className="text-[#C5A059]" />
              <span className="px-4 py-1.5 bg-[#C5A059]/20 text-[#C5A059] text-xs font-bold rounded-full tracking-widest uppercase">
                Recognition & Achievements
              </span>
              <Trophy size={32} className="text-[#C5A059]" />
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-white mb-6">
              Our <span className="text-[#C5A059]">Awards</span> & Recognition
            </h1>
            <p className="text-slate-300 max-w-2xl mx-auto text-lg font-serif-body leading-relaxed">
              Celebrating excellence in journalism and commitment to truth, honored by prestigious institutions across the globe.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { icon: <Award size={28} />, label: 'Total Awards', value: totalAwards.toString() },
              { icon: <Calendar size={28} />, label: 'Years Active', value: '15+' },
              { icon: <Star size={28} />, label: 'Latest Award', value: latestYear.toString() },
              { icon: <Medal size={28} />, label: 'Categories', value: '12' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-[#003366]/5 rounded-full mx-auto mb-4 text-[#003366]">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-[#003366] mb-2">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-12 bg-white sticky top-16 z-30 shadow-sm">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-wrap justify-center gap-3">
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${activeYear === year
                    ? 'bg-[#003366] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {year === 'All' ? 'All Years' : year}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-slate-200 transform -translate-x-1/2 hidden md:block"></div>

            <div className="space-y-12">
              {filteredAwards.map((award, idx) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className={`flex flex-col md:flex-row gap-8 items-start md:items-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''
                    }`}
                >
                  {/* Content */}
                  <div className="flex-1 md:w-5/12">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-300 ml-0 md:ml-12">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl">{award.icon}</div>
                        <div>
                          <span className="text-[10px] font-bold text-[#CC0000] uppercase tracking-widest mb-2 block">
                            {award.year}
                          </span>
                          <h3 className="font-heading text-xl font-bold text-[#003366] mb-2">
                            {award.title}
                          </h3>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                            {award.organization}
                          </p>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {award.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Point */}
                  <div className="hidden md:flex items-center justify-center w-8 h-8 bg-[#003366] rounded-full border-4 border-white shadow-lg z-10 mx-auto">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>

                  {/* Empty Space for Balance */}
                  <div className="flex-1 md:w-5/12 hidden md:block"></div>
                </motion.div>
              ))}
            </div>
          </div>

          {filteredAwards.length === 0 && (
            <div className="text-center py-20">
              <Award size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold text-slate-400 mb-2">No awards found</h3>
              <p className="text-slate-500">Try selecting a different year</p>
            </div>
          )}
        </div>
      </section>

      {/* Certifications & Affiliations */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-3xl font-bold text-[#003366] mb-4">
              Affiliations & Memberships
            </h2>
            <div className="w-24 h-1.5 bg-[#CC0000] mx-auto rounded-full mb-12"></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { name: 'News Broadcasters Association', desc: 'Member' },
                { name: 'Indian Media Association', desc: 'Life Member' },
                { name: 'Press Club of India', desc: 'Associate Member' },
                { name: 'International Press Institute', desc: 'Global Member' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-6 bg-slate-50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-[#003366]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award size={20} className="text-[#003366]" />
                  </div>
                  <h4 className="font-bold text-[#003366] mb-1">{item.name}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nominations CTA */}
      <section className="py-20 bg-gradient-to-r from-[#C5A059] to-[#B8933F]">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Trophy size={48} className="text-white mx-auto mb-6" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Nominate Us
            </h2>
            <p className="text-white/80 mb-8 font-serif-body">
              Know of an award or recognition we should be considered for? We'd love to hear from you.
            </p>
            <button className="px-8 py-4 bg-white text-[#003366] font-bold rounded-lg hover:bg-slate-100 transition-colors">
              Submit Nomination
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Awards;

