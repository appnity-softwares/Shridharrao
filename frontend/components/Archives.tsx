import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, Search, Filter, Calendar, FileText, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const categories = ["All", "Editorials", "Opinions", "Ground Reports", "Investigations", "Personal"];

const archiveItems = [
    { id: 'ar-1', title: "The Decadal Review: A Governance Retrospective", year: "2024", cat: "Editorials", snippet: "Summarizing 10 years of policy shifts and their real-world outcomes." },
    { id: 'ar-2', title: "Silent Corridors: The Infrastructure Investigation", year: "2023", cat: "Investigations", snippet: "Exposing the delays in regional railway connectivity projects." },
    { id: 'ar-3', title: "Notes from the Heartland (Vol 4)", year: "2022", cat: "Personal", snippet: "A collection of journal entries from 3,000 miles of travel." },
    { id: 'ar-4', title: "The Bastar Dialects: A Cultural Map", year: "2021", cat: "Ground Reports", snippet: "Documenting linguistics and oral traditions in Chattisgarh." },
    { id: 'ar-5', title: "The Water Ledger: Urban Crisis Report", year: "2020", cat: "Investigations", snippet: "An award-winning investigation into city water management systems." },
    { id: 'ar-6', title: "Journalism in the Era of 4G", year: "2019", cat: "Opinions", snippet: "Reflections on speed vs. accuracy in digital reporting." },
];

const Archives: React.FC = () => {
    const [filter, setFilter] = useState("All");

    const filteredItems = filter === "All" ? archiveItems : archiveItems.filter(item => item.cat === filter);

    return (
        <div className="min-h-screen bg-white pt-[150px] pb-32">
            <div className="container mx-auto px-6 md:px-12">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mb-24"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <Archive className="text-primary" size={32} />
                        <span className="text-primary font-black tracking-[0.4em] uppercase text-xs">Library</span>
                    </div>
                    <h1 className="font-heading text-6xl md:text-8xl font-black text-primary leading-tight mb-8">
                        The Historical <br />
                        <span className="gold-gradient">Archive.</span>
                    </h1>
                    <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-2xl font-body">
                        "A comprehensive collection of past reporting, investigations, and literary contributions spanning over 25 years of journalism."
                    </p>
                </motion.div>

                {/* Filter Bar */}
                <div className="mb-20 flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-50 pb-10">
                    <div className="flex flex-wrap gap-4 items-center">
                        <Filter size={16} className="text-slate-300 mr-2" />
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setFilter(c)}
                                className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === c ? 'bg-primary text-white shadow-xl' : 'text-slate-400 hover:text-primary'
                                    }`}
                            >
                                {c}
                            </button>
                        ))}
                    </div>

                    <div className="relative group w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-hover:text-accent transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search Archive..."
                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-accent outline-none font-bold text-sm text-primary"
                        />
                    </div>
                </div>

                {/* Archive List */}
                <div className="space-y-6">
                    {filteredItems.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                            className="group flex flex-col md:flex-row items-start md:items-center gap-8 p-10 hover:bg-slate-50 rounded-[40px] transition-all border border-transparent hover:border-slate-100"
                        >
                            <div className="flex flex-col items-center">
                                <div className="text-2xl font-black text-primary leading-none">{item.year}</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-accent mt-2">{item.cat}</div>
                            </div>

                            <div className="h-8 w-[1px] bg-slate-100 hidden md:block"></div>

                            <div className="flex-1">
                                <h3 className="font-heading text-2xl font-black text-primary mb-2 group-hover:text-accent transition-colors leading-tight">
                                    {item.title}
                                </h3>
                                <p className="text-slate-400 text-sm font-medium line-clamp-1">{item.snippet}</p>
                            </div>

                            <div className="flex items-center gap-6">
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-primary transition-colors">Access File</span>
                                <div className="p-4 bg-white rounded-full shadow-sm text-slate-200 group-hover:bg-primary group-hover:text-white transition-all transform group-hover:rotate-12">
                                    <FileText size={20} />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredItems.length === 0 && (
                    <div className="py-32 text-center">
                        <div className="p-6 bg-slate-50 inline-block rounded-full mb-6">
                            <Archive size={40} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">No entries found for this category</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Archives;
