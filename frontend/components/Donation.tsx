
import React from 'react';
import { motion } from 'framer-motion';
import { QrCode, CreditCard } from 'lucide-react';

const Donation: React.FC = () => {
  return (
    <div className="container mx-auto px-4 md:px-8 py-20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-[#003366] mb-4">Support Independent Journalism</h2>
          <div className="w-24 h-1.5 bg-[#CC0000] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-slate-600 font-serif-body leading-relaxed">
            <p>
              Mitaan India is committed to fearless, independent journalism. We rely on the support of our readers to continue our work. Your contribution, no matter how small, helps us hold power to account and bring untold stories to light.
            </p>
            <p>
              You can support us through a secure online payment or by scanning the QR code with your favorite payment app.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg text-center"
          >
            <h3 className="font-heading text-2xl font-bold text-[#003366] mb-6">Donate Now</h3>
            <div className="flex justify-center mb-6">
              <QrCode className="w-48 h-48 text-slate-800" />
            </div>
            <p className="text-sm text-slate-500 mb-6">Scan the code to donate securely.</p>
            <button className="bg-[#003366] text-white font-bold py-3 px-8 rounded-full hover:bg-[#CC0000] transition-colors flex items-center justify-center mx-auto">
              <CreditCard className="mr-2" />
              Or Pay Online
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Donation;
