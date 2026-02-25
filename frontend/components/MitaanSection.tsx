import React from 'react';
import { motion } from 'framer-motion';
import { PenTool, Target, Globe, Users, ArrowRight, Shield, Award, Zap } from 'lucide-react';

const initiatives = [
  {
    title: "Mitaan Media Academy",
    desc: "A nonprofit initiative dedicated to training 5,000+ grassroots journalists in ethical reporting and digital storytelling.",
    icon: <Users className="w-8 h-8 text-white" />,
    stats: "5k+ Students",
    color: "bg-primary"
  },
  {
    title: "The Integrity Shield",
    desc: "A framework for fact-checking and editorial verification used by regional newsrooms to combat digital misinformation.",
    icon: <Shield className="w-8 h-8 text-white" />,
    stats: "85% Trust Index",
    color: "bg-accent"
  },
  {
    title: "Ground Zero Reports",
    desc: "Deep-dive investigative series focusing on the silent metamorphosis of rural India's socio-economic landscape.",
    icon: <Target className="w-8 h-8 text-white" />,
    stats: "200+ Reports",
    color: "bg-secondary"
  },
  {
    title: "Ethical AI in Media",
    desc: "Strategic advisory on implementing AI tools in newsrooms without compromising the human element of storytelling.",
    icon: <Zap className="w-8 h-8 text-white" />,
    stats: "Consulting",
    color: "bg-primary"
  }
];

const MitaanSection: React.FC = () => {
  return (
    <div className="py-40 bg-white relative overflow-hidden">
      {/* Background Stylized Text */}
      <div className="absolute top-20 right-[-5%] select-none pointer-events-none opacity-[0.03] whitespace-nowrap">
        <h2 className="text-[15vw] font-black uppercase tracking-tighter leading-none font-heading italic">
          STRATEGIC IMPACT
        </h2>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-accent font-black tracking-[0.4em] uppercase text-xs mb-8 block font-body">My Collaborative Work</span>
            <h2 className="font-heading text-6xl md:text-8xl font-black text-primary mb-12 leading-[0.9]">
              Beyond the <br />
              <span className="gold-gradient">Written Word.</span>
            </h2>
            <p className="text-2xl text-slate-500 font-medium leading-relaxed font-body max-w-2xl italic">
              "Journalism is the foundation, but impact is the goal. These are the strategic initiatives through which I drive systemic change."
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {initiatives.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative p-12 rounded-[60px] bg-slate-50 hover:bg-white border border-transparent hover:border-slate-100 transition-all duration-700 premium-card h-full flex flex-col"
            >
              <div className="flex justify-between items-start mb-10">
                <div className={`p-5 ${item.color} rounded-3xl shadow-2xl shadow-black/10 group-hover:rotate-6 transition-transform`}>
                  {item.icon}
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-accent block mb-1">Impact</span>
                  <span className="text-xl font-black text-primary">{item.stats}</span>
                </div>
              </div>

              <h3 className="text-3xl font-black text-primary mb-6">{item.title}</h3>
              <p className="text-slate-500 text-lg leading-relaxed font-medium mb-12 flex-1">
                {item.desc}
              </p>

              <div className="pt-8 border-t border-slate-100 flex items-center justify-between">
                <button className="flex items-center gap-3 font-black text-[10px] uppercase tracking-widest text-primary group-hover:text-accent transition-colors">
                  Case Study <ArrowRight size={14} />
                </button>
                <div className="w-1.5 h-1.5 bg-slate-200 rounded-full"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global recognition badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 flex flex-col md:flex-row items-center justify-center gap-12 text-center md:text-left grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
        >
          <div className="flex items-center gap-4">
            <Award className="text-primary" size={40} />
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-primary">Member</div>
              <div className="font-heading font-black">Global Editors Network</div>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-slate-200 hidden md:block"></div>
          <div className="flex items-center gap-4">
            <Globe className="text-primary" size={40} />
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-primary">Advisor</div>
              <div className="font-heading font-black">United Press Institute</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MitaanSection;
