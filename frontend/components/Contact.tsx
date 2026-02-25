import React, { useState } from 'react';
import { Mail, Send, MessageSquare, Globe, ArrowRight, Twitter, Linkedin, Instagram } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitContactMessage } from '../services/api';
import { useMutation } from '@tanstack/react-query';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', category: 'Editorial Project Inquiry', message: '' });

  const mutation = useMutation({
    mutationFn: submitContactMessage,
    onSuccess: () => {
      // Form state is handled by mutation.isSuccess
    },
    onError: (error) => {
      console.error("Submission failed", error);
      alert("Failed to send message. Please try again.");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <div className="bg-white flex items-center justify-center py-20 overflow-hidden relative font-body">
      {/* Editorial Decorative Pulse */}
      <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[120px] translate-x-1/2 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-24 items-start">

          {/* 1. EDITORIAL SIDEBAR */}
          <div className="lg:w-[40%] reveal active">
            <div className="space-y-12">
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <MessageSquare className="text-accent" size={24} />
                  <span className="text-accent font-black tracking-[0.4em] uppercase text-[10px]">Communication Hub</span>
                </div>
                <h1 className="font-heading text-6xl md:text-8xl font-bold text-primary leading-[0.9] mb-10 tracking-tighter">
                  Open for <br />
                  <span className="gold-gradient">Dialogue.</span>
                </h1>
                <p className="text-xl text-slate-400 font-medium leading-relaxed italic border-l-[1.5px] border-slate-100 pl-8 mb-16">
                  "The most critical part of investigative journalism happens in the silence where we listen. Reach out for dispatches, collaborations, or inquiries."
                </p>
              </div>

              {/* Direct Channels */}
              <div className="space-y-10">
                {[
                  { icon: <Mail className="text-primary" size={20} />, label: "Intellectual Desk", val: "desk@shridharrao.com" },
                  { icon: <Globe className="text-primary" size={20} />, label: "Speaking & Media", val: "media@mitaanindia.com" }
                ].map((item, idx) => (
                  <div key={idx} className="group cursor-pointer">
                    <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-300 block mb-2">{item.label}</span>
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 rounded-xl group-hover:bg-accent group-hover:text-white transition-all duration-500">{item.icon}</div>
                      <span className="text-lg font-bold text-primary transition-colors group-hover:text-accent">{item.val}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Channels */}
              <div className="pt-12 border-t border-slate-50 flex items-center gap-8">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-300">Social Nodes:</span>
                <div className="flex gap-6">
                  {[Twitter, Linkedin, Instagram].map((Icon, i) => (
                    <a key={i} href="#" className="text-slate-200 hover:text-accent transition-colors">
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 2. THE INQUIRY TERMINAL (FORM) */}
          <div className="lg:w-[60%] w-full reveal active">
            <div className="bg-[#FCFCFC] p-10 md:p-20 rounded-[60px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-50 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {mutation.isSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-20"
                  >
                    <div className="w-24 h-24 bg-primary text-white rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-2xl rotate-12">
                      <Send size={40} />
                    </div>
                    <h3 className="font-heading text-4xl font-bold text-primary mb-6 tracking-tighter">Transmission Successful.</h3>
                    <p className="text-xl text-slate-400 font-medium italic mb-12">"Your dispatch has been queued for verification. <br /> Expect a response within 48 editorial hours."</p>
                    <button
                      onClick={() => mutation.reset()}
                      className="px-10 py-4 border-2 border-slate-100 rounded-2xl text-accent font-black uppercase text-[10px] tracking-widest hover:border-accent transition-all"
                    >
                      New Transmission
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    onSubmit={handleSubmit}
                    className="space-y-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-6">Source Identification</label>
                        <input required type="text" className="w-full px-8 py-5 bg-white rounded-3xl border border-slate-100 outline-none focus:ring-1 focus:ring-accent font-bold text-primary shadow-sm text-sm" placeholder="Full Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-6">Secure Digital Reach</label>
                        <input required type="email" className="w-full px-8 py-5 bg-white rounded-3xl border border-slate-100 outline-none focus:ring-1 focus:ring-accent font-bold text-primary shadow-sm text-sm" placeholder="Email Address" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-6">Dispatch Category</label>
                      <div className="relative">
                        <select className="w-full px-8 py-5 bg-white rounded-3xl border border-slate-100 outline-none focus:ring-1 focus:ring-accent font-bold text-primary shadow-sm appearance-none cursor-pointer text-sm" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                          <option value="Editorial Project Inquiry">Editorial Project Inquiry</option>
                          <option value="Global Speaking Hub">Global Speaking Hub</option>
                          <option value="Confidential Lead / Ground Intel">Confidential Lead / Ground Intel</option>
                          <option value="Collaboration & Advisory">Collaboration & Advisory</option>
                        </select>
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                          <ArrowRight size={16} className="rotate-90" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 ml-6">The Narrative</label>
                      <textarea required rows={5} className="w-full px-8 py-6 bg-white rounded-[40px] border border-slate-100 outline-none focus:ring-1 focus:ring-accent font-bold text-primary shadow-sm resize-none text-sm placeholder:italic" placeholder="Construct your message here..." value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
                    </div>

                    <div className="pt-6">
                      <button
                        disabled={mutation.isPending}
                        className="w-full py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.4em] text-[11px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.2)] hover:bg-accent transition-all disabled:opacity-50 group flex items-center justify-center gap-6"
                      >
                        {mutation.isPending ? 'SECURELY INKING...' : 'SEND SECURE DISPATCH'}
                        <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                      </button>
                    </div>

                    <p className="text-center text-[9px] font-black text-slate-200 uppercase tracking-widest">
                      End-to-End Encrypted Inquiry Interface v2.6
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Contact;
