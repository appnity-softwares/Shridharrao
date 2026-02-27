import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Mic2, Eye, Trophy, Quote, ArrowDown, Feather, Globe, Target, Award, PenTool, ExternalLink, ShieldCheck } from 'lucide-react';
import MagneticWrapper from './MagneticWrapper';
import { fetchTimeline, fetchAboutConfig, TimelineItem, AboutConfig } from '../services/api';

const stats = [
  { label: "Years Experience", value: "25+", icon: <Clock size={20} /> },
  { label: "Global Reports", value: "2k+", icon: <Mic2 size={20} /> },
  { label: "Readers reached", value: "10M+", icon: <Eye size={20} /> },
  { label: "Awards Won", value: "15+", icon: <Trophy size={20} /> },
];

const About: React.FC = () => {
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [config, setConfig] = useState<AboutConfig | null>(null);

  useEffect(() => {
    fetchTimeline().then(setTimeline).catch(console.error);
    fetchAboutConfig().then(setConfig).catch(console.error);
  }, []);

  return (
    <div className="bg-white min-h-screen font-body pt-32">
      {/* Editorial Profile Header */}
      <section className="container mx-auto px-6 md:px-12 py-20 lg:py-32 border-b border-slate-50">
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-32 items-center">
          {/* The Image - Clean & Architectural */}
          <div className="lg:w-2/5 w-full">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[3/4] rounded-[40px] overflow-hidden grayscale brightness-110 shadow-2xl"
            >
              <img
                src={config?.image || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop"}
                className="w-full h-full object-cover"
                alt="Shridhar Rao"
              />
            </motion.div>
          </div>

          {/* The Narrative - Elegant Typography */}
          <div className="lg:w-3/5 space-y-12">
            <div className="reveal active">
              <span className="text-accent font-black tracking-[0.4em] uppercase text-[11px] mb-8 block">{config?.badge || "Chief Editor & Strategist"}</span>
              <h1 className="font-heading text-6xl md:text-8xl font-bold text-primary leading-[0.9] mb-10 tracking-tighter">
                {config?.title ? config.title.split('<br />').map((line, i) => (
                  <React.Fragment key={i}>
                    {line} {i === 0 && <br />}
                  </React.Fragment>
                )) : <>Integrity is <br /><span className="gold-gradient">Non-Negotiable.</span></>}
              </h1>
              <p className="text-2xl text-slate-700 font-medium leading-relaxed italic max-w-2xl border-l-[1.5px] border-slate-100 pl-10">
                "{config?.quote || "For over two decades, I have focused on the silence between the noise. My work is dedicated to uncovering systemic truths and giving a platform to the unmentioned."}"
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-16 pt-12 border-t border-slate-50 reveal active">
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">{config?.stat1Label || "Years Experience"}</span>
                <span className="text-4xl font-black text-primary block">{config?.stat1Value || "25+"}</span>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">{config?.stat2Label || "Global Reports"}</span>
                <span className="text-4xl font-black text-primary block">{config?.stat2Value || "2k+"}</span>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">{config?.stat3Label || "Readers reached"}</span>
                <span className="text-4xl font-black text-primary block">{config?.stat3Value || "10M+"}</span>
              </div>
              <div className="space-y-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 block">{config?.stat4Label || "Awards Won"}</span>
                <span className="text-4xl font-black text-primary block">{config?.stat4Value || "15+"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Ethos Section */}
      <section className="py-32 lg:py-48 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center space-y-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Quote className="mx-auto text-accent/20 mb-12" size={60} />
              <h2 className="font-heading text-4xl md:text-5xl font-bold text-primary leading-tight italic">
                "Information is not just data—it is a catalyst for human dignity. A journalist's pen is a responsibility, not just a tool."
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pt-20 border-t border-slate-100">
              <div>
                <Target className="mx-auto text-accent mb-6" size={32} />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-4">Precision</h4>
                <p className="text-sm text-slate-500 italic leading-relaxed">Rigorous verification in an era of rapid misinformation.</p>
              </div>
              <div>
                <Globe className="mx-auto text-accent mb-6" size={32} />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-4">Empathy</h4>
                <p className="text-sm text-slate-500 italic leading-relaxed">Connecting global policy to regional ground-realities.</p>
              </div>
              <div>
                <Award className="mx-auto text-accent mb-6" size={32} />
                <h4 className="text-[11px] font-black uppercase tracking-widest text-primary mb-4">Courage</h4>
                <p className="text-sm text-slate-500 italic leading-relaxed">The internal strength to remain silent when it matters.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REFINED TIMELINE: THE JOURNALISTIC DEPLOYMENT */}
      <section className="py-40 bg-[#FAFAFA] border-y border-slate-50 relative overflow-hidden">
        {/* Background Decorative Year */}
        <div className="absolute top-0 right-0 opacity-[0.02] pointer-events-none select-none">
          <h1 className="text-[25vw] font-black font-heading leading-none -translate-y-20">JOURNEY</h1>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="mb-32">
            <div className="flex items-center gap-4 mb-8">
              <ShieldCheck className="text-accent" size={24} />
              <span className="text-accent font-black tracking-[0.4em] uppercase text-[10px]">The Historical Record</span>
            </div>
            <h2 className="font-heading text-6xl md:text-8xl font-black text-primary tracking-tighter leading-tight">
              Journalistic <br />
              <span className="gold-gradient italic">Journey.</span>
            </h2>
          </div>

          <div className="space-y-40">
            {Array.isArray(timeline) && timeline.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className={`flex flex-col lg:flex-row gap-16 items-center ${idx % 2 === 0 ? '' : 'lg:flex-row-reverse'}`}
              >
                {/* Visual Anchor */}
                <div className="lg:w-1/2 w-full relative group">
                  <div className="relative aspect-video rounded-[50px] overflow-hidden z-10 shadow-2xl transition-transform duration-700 group-hover:-translate-y-2">
                    <img
                      src={item.image}
                      className="w-full h-full object-cover grayscale transition-all duration-[1.5s] group-hover:grayscale-0 group-hover:scale-105"
                      alt={item.title}
                    />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Year Overlay - Brought to front for premium overlapping effect */}
                  <div className="absolute -bottom-16 -right-8 lg:-bottom-24 lg:-right-16 pointer-events-none select-none z-20 translate-y-4 lg:translate-y-8">
                    <h3 className="text-[14vw] font-black text-primary/10 group-hover:text-primary transition-all duration-700 uppercase font-heading leading-none">
                      {item.year}
                    </h3>
                  </div>
                </div>

                {/* Narrative Detail */}
                <div className="lg:w-1/2 w-full space-y-10 lg:px-20">
                  <div>
                    <span className="text-accent font-black tracking-[0.4em] uppercase text-[10px] mb-4 block">Archive Dispatch: {item.refId}</span>
                    <h3 className="text-4xl lg:text-6xl font-bold text-primary tracking-tighter leading-tight mb-8">{item.title}</h3>
                    <p className="text-2xl text-slate-500 font-medium italic leading-relaxed border-l-[1.5px] border-slate-100 pl-10">
                      "{item.event}"
                    </p>
                  </div>

                  <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-slate-300">
                      <Clock size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.year} Archive Unit</span>
                    </div>
                    <MagneticWrapper>
                      <button className="flex items-center gap-3 text-primary hover:text-accent transition-colors font-black uppercase text-[10px] tracking-widest group">
                        Access Full Data <ExternalLink size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </button>
                    </MagneticWrapper>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Professional Call to Action */}
      <section className="py-40 bg-white text-center">
        <div className="container mx-auto px-6 max-w-4xl space-y-16">
          <PenTool className="mx-auto text-accent" size={40} />
          <h2 className="font-heading text-5xl md:text-6xl font-bold text-primary leading-tight tracking-tighter italic">
            Seeking a deeper perspective <br /> on ethical journalism?
          </h2>
          <div className="w-16 h-1 bg-accent/20 mx-auto"></div>
          <div className="flex justify-center pt-8">
            <MagneticWrapper strength={15}>
              <button className="px-12 py-5 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl transition-all hover:bg-accent">
                Let's Discuss Integrity
              </button>
            </MagneticWrapper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
