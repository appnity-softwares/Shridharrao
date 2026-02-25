import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tv, Radio, MessageSquare, Share2, Eye, ThumbsUp, Users, Send } from 'lucide-react';
import NewsTicker from './NewsTicker';

const channels = [
    {
        id: 'sansad-tv',
        name: 'Sansad TV',
        url: 'https://www.youtube.com/embed/live_stream?channel=UCD9kF0_xTwjB6_a0N8ZQQqQ', // Sansad TV (general/RS)
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sansad_TV_Logo.svg/1200px-Sansad_TV_Logo.svg.png',
        description: 'Live proceedings from the Parliament of India.',
        category: 'Governance'
    },
    {
        id: 'dd-news',
        name: 'DD News',
        url: 'https://www.youtube.com/embed/live_stream?channel=UC55-z90-00', // DD News
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/DD_News_logo.svg/1200px-DD_News_logo.svg.png',
        description: 'India\'s public service broadcaster 24x7 news.',
        category: 'National'
    },
    {
        id: 'ndtv',
        name: 'NDTV India',
        url: 'https://www.youtube.com/embed/live_stream?channel=UCZFMm199-6j8Up9W1i6J3Gg', // NDTV India
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/NDTV_India_logo.svg/1200px-NDTV_India_logo.svg.png',
        description: 'Latest hindi news and updates.',
        category: 'News'
    },
    {
        id: 'air',
        name: 'All India Radio',
        url: 'https://www.youtube.com/embed/live_stream?channel=UC88bO5i9rC39H9J7W_12G3g', // AIR News
        logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/All_India_Radio_logo.svg',
        description: 'Voice of the nation.',
        category: 'Radio'
    }
];

const LiveChat: React.FC = () => {
    const [messages, setMessages] = useState([
        { user: 'Amit Kumar', text: 'Great initiative by the government! 👍', color: 'text-blue-600' },
        { user: 'Priya Singh', text: 'Waiting for the PM\'s speech.', color: 'text-purple-600' },
        { user: 'Rahul वर्मा', text: 'Jai Hind! 🇮🇳', color: 'text-orange-600' },
    ]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            const newMsgs = [
                { user: 'User ' + Math.floor(Math.random() * 1000), text: 'Viksit Bharat!', color: 'text-slate-600' },
                { user: 'Citizen_IND', text: 'Watching live from Raipur.', color: 'text-green-600' },
                { user: 'MediaWatch', text: 'Updates coming in fast.', color: 'text-red-500' }
            ];
            const randomMsg = newMsgs[Math.floor(Math.random() * newMsgs.length)];
            setMessages(prev => [...prev.slice(-15), randomMsg]);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        setMessages(prev => [...prev.slice(-15), { user: 'You', text: input, color: 'text-[#003366] font-bold' }]);
        setInput('');
    };

    return (
        <div className="bg-white border rounded-lg h-[400px] flex flex-col">
            <div className="p-3 border-b bg-slate-50 flex items-center justify-between">
                <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                    <MessageSquare size={16} /> Live Chat
                </span>
                <span className="text-xs text-slate-400 bg-white px-2 py-1 rounded border">Top Chat</span>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scroll-smooth">
                <AnimatePresence>
                    {messages.map((msg, idx) => (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={idx}
                            className="text-sm"
                        >
                            <span className={`font-bold mr-2 ${msg.color}`}>{msg.user}:</span>
                            <span className="text-slate-700">{msg.text}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            <form onSubmit={handleSend} className="p-3 border-t bg-slate-50 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Say something..."
                    className="flex-1 text-sm px-3 py-2 rounded border focus:outline-none focus:border-[#003366]"
                />
                <button type="submit" className="p-2 bg-[#003366] text-white rounded hover:bg-[#002244]">
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};

const LiveTVPage: React.FC = () => {
    const [activeChannel, setActiveChannel] = useState(channels[0]);

    return (
        <div className="min-h-screen bg-[#111] font-sans pb-12 pt-24 text-slate-200">
            {/* Breaking News Ticker (Custom for Live Page) */}
            <div className="bg-[#CC0000] text-white py-1 px-4 text-sm font-bold tracking-wider flex items-center gap-4 fixed top-[80px] w-full z-30 shadow-md">
                <span className="bg-white text-[#CC0000] px-2 py-0.5 rounded text-xs animate-pulse">LIVE</span>
                <div className="overflow-hidden whitespace-nowrap flex-1">
                    <span className="inline-block animate-marquee">
                        BREAKING: Parliament Summer Session Begins • PM to address the nation at 8 PM • Sensex up by 500 points • New Education Policy implementation in final stage.
                    </span>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Video Area */}
                <div className="lg:col-span-2">
                    <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-[0_0_40px_rgba(204,0,0,0.2)] border border-slate-800">
                        <iframe
                            src={`${activeChannel.url}?autoplay=1&mute=1`}
                            title={activeChannel.name}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        ></iframe>
                        <div className="absolute top-4 left-4 flex gap-2">
                            <span className="bg-[#CC0000] text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-1">
                                <Radio size={12} className="animate-pulse" /> LIVE
                            </span>
                            <span className="bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1 rounded flex items-center gap-1">
                                <Users size={12} /> 12.5K Watching
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{activeChannel.name} • LIVE Broadcast</h1>
                            <p className="text-slate-400 text-sm md:text-base">{activeChannel.description}</p>
                        </div>
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-bold transition-colors">
                                <ThumbsUp size={16} /> Like
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-bold transition-colors">
                                <Share2 size={16} /> Share
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Live Chat */}
                    <LiveChat />

                    {/* Channel List */}
                    <div className="bg-[#1a1a1a] rounded-lg p-4 border border-slate-800">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <Tv size={18} /> Switch Channel
                        </h3>
                        <div className="space-y-3">
                            {channels.map(channel => (
                                <motion.div
                                    key={channel.id}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setActiveChannel(channel)}
                                    className={`p-3 rounded cursor-pointer flex items-center gap-4 transition-colors ${activeChannel.id === channel.id ? 'bg-[#003366] border border-blue-500' : 'bg-slate-900 hover:bg-slate-800 border border-transparent'}`}
                                >
                                    <div className="w-16 h-10 bg-black rounded flex items-center justify-center overflow-hidden shrink-0">
                                        {/* Fallback for logo if image fails, or just text */}
                                        <div className="font-bold text-[10px] text-slate-500">{channel.name}</div>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`text-sm font-bold ${activeChannel.id === channel.id ? 'text-white' : 'text-slate-300'}`}>
                                            {channel.name}
                                        </h4>
                                        <span className="text-[10px] text-slate-500 uppercase font-bold">{channel.category}</span>
                                    </div>
                                    {activeChannel.id === channel.id && (
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LiveTVPage;
