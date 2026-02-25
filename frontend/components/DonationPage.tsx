import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Heart,
    QrCode,
    CreditCard,
    Building2,
    User,
    Hash,
    Globe,
    ArrowRight,
    Zap
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchDonationConfig } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const DonationPage: React.FC = () => {
    const { t } = useLanguage();
    const [showQR, setShowQR] = React.useState(false);
    const { data: config, isLoading } = useQuery({
        queryKey: ['donationConfig'],
        queryFn: fetchDonationConfig
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="w-12 h-12 border-2 border-accent/20 border-t-accent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!config) return null;

    return (
        <div className="min-h-screen bg-white font-body overflow-hidden">
            {/* Header Section */}
            <header className="pt-32 md:pt-48 pb-20 md:pb-32 relative">
                <div className="container mx-auto px-6 md:px-12 relative z-10 text-center max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <div className="inline-flex items-center gap-3 px-6 py-2 bg-slate-50 rounded-full mb-8 md:mb-10 border border-slate-100">
                            <Heart className="text-accent fill-accent" size={14} />
                            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-700">Support Independent Journalism</span>
                        </div>
                        <h1 className="font-heading text-6xl md:text-9xl font-black text-primary leading-[0.85] mb-8 lg:mb-12 tracking-tighter">
                            Fuel the <span className="text-accent">Truth.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-slate-600 font-bold leading-relaxed max-w-3xl mx-auto italic">
                            {config.message}
                        </p>
                    </motion.div>
                </div>
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-accent/5 -skew-x-12 translate-x-32 pointer-events-none hidden lg:block"></div>
                <div className="absolute bottom-0 left-0 w-1/4 h-64 bg-slate-50 rounded-tr-[100px] pointer-events-none -z-10"></div>
            </header>

            <main className="container mx-auto px-6 md:px-12 py-16 md:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-32 items-start">

                    {/* Left Side: QR Code & UPI */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-[#FBFBFF] rounded-[60px] p-12 md:p-16 border border-slate-50 shadow-2xl relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-12 text-accent/10">
                            <QrCode size={120} />
                        </div>

                        <div className="relative z-10">
                            <h3 className="font-heading text-3xl md:text-4xl font-black text-primary mb-8 flex items-center gap-4">
                                <Zap className="text-accent" /> Scan & Pay
                            </h3>

                            <div
                                onClick={() => setShowQR(!showQR)}
                                className="bg-white p-8 rounded-[40px] shadow-lg mb-12 inline-block border border-slate-100 group-hover:scale-[1.02] transition-all duration-700 cursor-pointer overflow-hidden relative"
                            >
                                <AnimatePresence mode="wait">
                                    {!showQR ? (
                                        <motion.div
                                            key="placeholder"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="w-[300px] aspect-square flex flex-col items-center justify-center bg-slate-50/50 rounded-[32px] border-2 border-dashed border-slate-200 group-hover:border-accent transition-colors"
                                        >
                                            <QrCode size={64} className="text-slate-300 mb-6 group-hover:text-accent transition-colors" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Click to Reveal QR Code</span>
                                        </motion.div>
                                    ) : (
                                        <motion.img
                                            key="qr"
                                            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                                            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                                            src={config.qrCodeUrl}
                                            alt="Donation QR Code"
                                            className="w-full max-w-[300px] aspect-square object-contain"
                                        />
                                    )}
                                </AnimatePresence>

                                {!showQR && (
                                    <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent pointer-events-none"></div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Pay via any UPI App</p>
                                <div className="flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                            <Hash size={18} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase text-slate-400 block tracking-widest">UPI ID</span>
                                            <span className="font-bold text-primary text-xl break-all">{config.upiId}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(config.upiId);
                                            alert("UPI ID copied!");
                                        }}
                                        className="px-4 py-2 bg-slate-50 hover:bg-primary hover:text-white rounded-full text-[10px] font-black uppercase transition-all tracking-widest"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Side: Bank Details */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="space-y-12"
                    >
                        <div className="max-w-xl">
                            <h3 className="font-heading text-3xl md:text-4xl font-black text-primary mb-12 flex items-center gap-4">
                                <CreditCard className="text-accent" /> Bank Transfer
                            </h3>

                            <div className="space-y-10">
                                <DetailItem icon={<Building2 />} label="Bank Name" value={config.bankName} />
                                <DetailItem icon={<User />} label="Account Name" value={config.accountName} />
                                <DetailItem icon={<Hash />} label="Account Number" value={config.accountNumber} />
                                <DetailItem icon={<Globe />} label="IFSC Code" value={config.ifscCode} />
                                {config.swiftCode && (
                                    <DetailItem icon={<Globe />} label="SWIFT Code" value={config.swiftCode} />
                                )}
                            </div>
                        </div>

                        <div className="pt-16 border-t border-slate-100">
                            <div className="p-8 bg-primary rounded-[3rem] text-white flex items-center justify-between group cursor-pointer hover:bg-accent transition-colors shadow-2xl">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center">
                                        <Heart size={20} />
                                    </div>
                                    <p className="font-black uppercase tracking-widest text-xs">Direct Support</p>
                                </div>
                                <ArrowRight className="group-hover:translate-x-3 transition-transform" />
                            </div>
                            <p className="mt-8 text-slate-400 text-sm italic leading-relaxed">
                                * All contributions are used to fund field travels, investigative equipment, and archival preservation. We believe in complete transparency of funds.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Bottom Section */}
            <section className="py-32 bg-slate-50 mt-32 relative overflow-hidden">
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h2 className="font-heading text-4xl md:text-6xl font-black text-primary mb-8 tracking-tighter">Your contribution matters.</h2>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-16 italic">
                        "Journalism is what somebody somewhere wants to suppress; all the rest is advertising."
                    </p>
                    <div className="w-px h-24 bg-accent mx-auto"></div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
            </section>
        </div>
    );
};

const DetailItem: React.FC<{ icon: React.ReactNode, label: string, value: string }> = ({ icon, label, value }) => (
    <div className="flex gap-6 items-start">
        <div className="mt-1 w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-accent transition-colors">
            {icon}
        </div>
        <div className="flex-1 pb-8 border-b border-slate-50">
            <span className="text-[10px] font-black uppercase text-slate-300 block tracking-[0.3em] mb-2">{label}</span>
            <span className="text-2xl md:text-3xl font-black text-primary tracking-tight">{value}</span>
        </div>
    </div>
);

export default DonationPage;
