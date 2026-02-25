import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Youtube, Instagram, Linkedin, Mail, ArrowUp } from 'lucide-react';
import MagneticWrapper from './MagneticWrapper';
import { useLanguage } from '../context/LanguageContext';

const Footer: React.FC = () => {
  const { t } = useLanguage();
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  React.useEffect(() => {
    console.log("%cDesigned & Developed by Appnity Softwares Pvt. Ltd.", "color: #C5A059; font-size: 14px; font-weight: bold; background: #000; padding: 10px; border-radius: 4px;");
    console.log("%c🌐 https://appnity.co.in", "color: #fff; font-size: 12px; background: #333; padding: 5px; border-radius: 2px; margin-top: 5px;");
    // Hidden comment in DOM
    const comment = document.createComment(" Powered by Appnity Softwares Pvt. Ltd. | https://appnity.co.in ");
    document.body.appendChild(comment);
  }, []);

  return (
    <footer className="bg-white pt-48 pb-16 relative overflow-hidden font-body border-t border-slate-50">
      {/* 4. FOOTER PRESTIGE - Background Signature Branding */}
      <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none opacity-[0.02] translate-y-1/2">
        <h1 className="text-[25vw] font-black text-primary leading-none tracking-tighter whitespace-nowrap">
          Shridhar Rao
        </h1>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 mb-32">

          {/* Large Branding Sidebar */}
          <div className="lg:col-span-6 space-y-12">
            <Link to="/" className="flex flex-col group">
              <span className="font-heading text-6xl md:text-6xl font-bold text-primary leading-none tracking-tighter">
                SHRIDHAR <span className="gold-gradient italic">RAO</span>
              </span>
              <span className="text-[11px] tracking-[0.6em] font-black text-slate-500 uppercase mt-4 group-hover:text-accent transition-all">
                The Chronicles of Integrity
              </span>
            </Link>

            <p className="text-2xl text-slate-600 font-medium italic leading-relaxed max-w-xl border-l-[1.5px] border-slate-100 pl-10">
              "{t('footer_quote')}"
            </p>

            <div className="flex gap-10 pt-4">
              {[Twitter, Youtube, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="text-slate-500 hover:text-accent transition-all duration-500 transform hover:-translate-y-2">
                  <Icon size={28} />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Matrix */}
          <div className="lg:col-span-3 space-y-12">
            <div className="space-y-8">
              <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">The Archive</h4>
              <ul className="space-y-6 text-base font-bold text-slate-600">
                <li><Link to="/about" className="hover:text-accent transition-all hover:translate-x-2 inline-block">{t('biography')}</Link></li>
                <li><Link to="/journal" className="hover:text-accent transition-all hover:translate-x-2 inline-block">{t('editorials')}</Link></li>
                <li><Link to="/gallery" className="hover:text-accent transition-all hover:translate-x-2 inline-block">Visual Journals</Link></li>
                <li><Link to="/donate" className="hover:text-accent transition-all hover:translate-x-2 inline-block">{t('support')}</Link></li>
                <li><Link to="/contact" className="hover:text-accent transition-all hover:translate-x-2 inline-block">Direct Inquiries</Link></li>
              </ul>
            </div>
          </div>

          {/* Newsletter / Status */}
          <div className="lg:col-span-3 space-y-12">
            <div className="space-y-8">
              <h4 className="text-primary font-black uppercase tracking-[0.4em] text-[10px]">The Transmission</h4>
              <p className="text-base text-slate-600 font-medium italic leading-relaxed">Join the monthly dossier of overlooked narratives.</p>
              <div className="relative group">
                <input type="email" placeholder="Secure Email Address" className="w-full bg-slate-50 px-6 py-5 rounded-2xl focus:outline-none text-sm text-primary font-bold border border-transparent focus:border-accent transition-all placeholder:text-slate-200" />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-accent hover:rotate-12 transition-transform">
                  <Mail size={24} />
                </button>
              </div>
            </div>

            {/* Field Status Indicator */}
            <div className="pt-8 border-t border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-3 h-3 bg-accent rounded-full animate-ping absolute inset-0 opacity-40"></div>
                  <div className="w-3 h-3 bg-accent rounded-full relative"></div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary block">Field Status</span>
                  <span className="text-[11px] font-bold italic text-slate-500">Currently deployed in New Delhi</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Legal & Back to Top */}
        <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12 relative z-20">
          <div className="flex items-center gap-6">
            <div className="font-heading text-lg font-bold text-slate-600 select-none opacity-50">Verified Signature // Shridhar Rao</div>
            <div className="w-px h-6 bg-slate-100" />
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-600">
              © 2026 ARCHIVE INTEGRITY UNIT
            </p>
          </div>

          <div className="flex items-center gap-12">
            <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.3em] text-slate-500">
              <a href="#" className="hover:text-accent transition-colors">Privacy Protocol</a>
              <a href="#" className="hover:text-accent transition-colors">Legal Framework</a>
            </div>
            <MagneticWrapper strength={15}>
              <button onClick={scrollToTop} className="p-4 bg-primary text-white rounded-2xl hover:bg-accent transition-all shadow-xl">
                <ArrowUp size={20} />
              </button>
            </MagneticWrapper>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
