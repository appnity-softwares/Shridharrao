import React, { useState, useEffect } from 'react';
import { adminApi, Article, Headline, Photo, TimelineItem, GlobalAnchor, Advertisement, DonationConfig, fetchArticles, fetchHeadlines, fetchPhotos, fetchImpacts, fetchGlobalEvents, fetchTimeline, fetchArchiveBooks, fetchGlobalAnchors, fetchAds, fetchDonationConfig } from '../../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    Plus, Trash2, Edit, X, LayoutDashboard, Type, Image as ImageIcon,
    Zap, Globe, Lock, MessageCircle, Upload, CheckCircle, AlertTriangle, History, BookOpen, Quote, Archive, Newspaper, User, Mail, Award, Heart,
    ChevronUp, ChevronDown, Image
} from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

// Toast Notification
const Toast = ({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className={`fixed bottom-8 right-8 z-[100] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 font-bold text-white ${type === 'success' ? 'bg-slate-900 border border-slate-800' : 'bg-accent text-slate-900'}`}
        >
            {type === 'success' ? <CheckCircle className="text-accent" size={20} /> : <AlertTriangle size={20} />}
            {message}
        </motion.div>
    );
};

// Confirmation Modal
const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-white rounded-[40px] p-12 max-w-md w-full shadow-2xl border border-slate-100"
                    >
                        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mb-8 mx-auto">
                            <AlertTriangle className="text-red-500" size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 text-center mb-4 tracking-tight">{title}</h3>
                        <p className="text-slate-500 text-center mb-10 font-medium leading-relaxed italic">"{message}"</p>
                        <div className="flex gap-4">
                            <button
                                onClick={onCancel}
                                className="flex-1 py-4 bg-slate-50 text-slate-400 font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-100 transition-all"
                            >
                                ABORT
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 py-4 bg-red-500 text-white font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-red-600 transition-all shadow-lg"
                            >
                                DELETE RECORD
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

// Image Upload Component
const ImageUploader = ({ value, onChange }: { value: string, onChange: (url: string) => void }) => {
    const [uploading, setUploading] = useState(false);

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;
        setUploading(true);
        try {
            const res = await adminApi.uploadFile(e.target.files[0]);
            onChange(res.url);
        } catch (error) {
            console.error("Upload failed", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="w-full">
            <div className="flex gap-4 items-center">
                <input
                    type="text"
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="Image URL or Upload -->"
                    className="flex-1 p-4 bg-slate-50 rounded-xl border border-slate-200 outline-none focus:border-accent transition-all"
                />
                <label className="cursor-pointer bg-slate-200 hover:bg-slate-300 transition-colors p-4 rounded-xl flex items-center justify-center relative overflow-hidden">
                    {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-800"></div> : <Upload size={20} className="text-slate-700" />}
                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                </label>
            </div>
            {value && (
                <div className="mt-4 relative h-32 w-full rounded-xl overflow-hidden border border-slate-100 bg-slate-50 group">
                    <img src={value} alt="Preview" className="h-full w-full object-contain object-left" />
                    <button onClick={() => onChange('')} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={14} /></button>
                </div>
            )}
        </div>
    );
};

const quillModules = {
    toolbar: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub' }, { 'script': 'super' }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        [{ 'indent': '-1' }, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
    ]
};

// Story Block Editor Component
const StoryBlockEditor = ({ content, onChange }: { content: string, onChange: (content: string) => void }) => {
    const blocks = React.useMemo(() => {
        try {
            if (!content || content.trim() === '') return [{ id: '1', type: 'text', value: '' }];
            const parsed = JSON.parse(content);
            return Array.isArray(parsed) ? parsed : [{ id: '1', type: 'text', value: content }];
        } catch (e) {
            return [{ id: '1', type: 'text', value: content }];
        }
    }, [content]);

    const handleBlocksChange = (newBlocks: any[]) => {
        onChange(JSON.stringify(newBlocks));
    };

    const addTextBlock = () => {
        const newBlocks = [...blocks, { id: Math.random().toString(), type: 'text', value: '' }];
        handleBlocksChange(newBlocks);
    };

    const addImageBlock = () => {
        const newBlocks = [...blocks, { id: Math.random().toString(), type: 'image', value: '' }];
        handleBlocksChange(newBlocks);
    };

    const removeBlock = (id: string) => {
        const newBlocks = blocks.filter((b: any) => b.id !== id);
        handleBlocksChange(newBlocks);
    };

    const updateBlock = (id: string, value: string) => {
        const newBlocks = blocks.map((b: any) => b.id === id ? { ...b, value } : b);
        handleBlocksChange(newBlocks);
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        handleBlocksChange(newBlocks);
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-1">Content <span className="text-red-500">*</span></label>
                <div className="w-full bg-white rounded-[16px] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="space-y-0">
                        {blocks.map((block: any, idx: number) => (
                            <div key={block.id} className="relative group border-b border-slate-50 last:border-b-0">
                                <div className="absolute right-4 top-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all z-20">
                                    <button onClick={() => moveBlock(idx, 'up')} disabled={idx === 0} className="w-8 h-8 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-accent disabled:opacity-30"><ChevronUp size={14} /></button>
                                    <button onClick={() => moveBlock(idx, 'down')} disabled={idx === blocks.length - 1} className="w-8 h-8 bg-white shadow-md border border-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-accent disabled:opacity-30"><ChevronDown size={14} /></button>
                                    <button onClick={() => removeBlock(block.id)} className="w-8 h-8 bg-red-500 shadow-md border border-white rounded-full flex items-center justify-center text-white hover:bg-red-600"><Trash2 size={14} /></button>
                                </div>

                                {block.type === 'text' ? (
                                    <div className="prose-editor">
                                        <ReactQuill
                                            theme="snow"
                                            value={block.value}
                                            onChange={(val) => updateBlock(block.id, val)}
                                            modules={quillModules}
                                            placeholder="Write your story content here..."
                                            className="premium-quill"
                                        />
                                    </div>
                                ) : (
                                    <div className="p-8 bg-slate-50/50">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2 bg-accent/10 rounded-lg text-accent"><ImageIcon size={14} /></div>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Image Asset Block</span>
                                        </div>
                                        <ImageUploader value={block.value} onChange={(url) => updateBlock(block.id, url)} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex gap-4">
                        <button
                            onClick={addTextBlock}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-accent hover:text-accent transition-all"
                        >
                            <Plus size={14} /> Add Text Segment
                        </button>
                        <button
                            onClick={addImageBlock}
                            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-accent hover:text-accent transition-all"
                        >
                            <ImageIcon size={14} /> Add Image Fragment
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .premium-quill .ql-toolbar.ql-snow { 
                    border: none !important; 
                    border-bottom: 1px solid #f1f5f9 !important;
                    background: #ffffff !important; 
                    padding: 12px 20px !important;
                }
                .premium-quill .ql-container.ql-snow { 
                    border: none !important; 
                    background: transparent !important;
                    font-family: 'Outfit', sans-serif !important;
                }
                .premium-quill .ql-editor { 
                    min-height: 150px; 
                    padding: 30px 40px !important; 
                    font-size: 18px;
                    line-height: 1.8;
                    color: #1a1a1a;
                }
                .premium-quill .ql-toolbar .ql-stroke { stroke: #64748b; }
                .premium-quill .ql-toolbar .ql-fill { fill: #64748b; }
                .premium-quill .ql-toolbar .ql-picker { color: #64748b; }
            `}</style>
        </div>
    );
}

// Simple Auth Component
const AdminLogin: React.FC<{ onLogin: (token: string) => void }> = ({ onLogin }) => {
    const [user, setUser] = useState('admin');
    const [pass, setPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!user || !pass) return;
        setLoading(true);
        setError('');
        try {
            const res = await adminApi.login(user, pass);
            onLogin(res.token);
        } catch (err) {
            setError('ACCESS DENIED: INVALID CREDENTIALS');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-body">
            <div className="p-12 bg-slate-800 rounded-3xl border border-slate-700 w-[450px] text-center shadow-2xl">
                <div className="w-20 h-20 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-accent/20">
                    <Lock className={loading ? "text-accent animate-pulse" : "text-accent"} size={32} />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tighter">Mitaan<span className="text-accent">OS</span></h2>
                <p className="text-slate-400 mb-8 font-medium">Terminal Access Authorization Required</p>
                <div className="space-y-4 mb-6">
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            value={user}
                            onChange={e => setUser(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="Username"
                            className="w-full bg-slate-900 border border-slate-700 p-5 pl-12 rounded-2xl focus:border-accent outline-none font-medium text-lg"
                        />
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="password"
                            value={pass}
                            onChange={e => setPass(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                            placeholder="Security Code"
                            className="w-full bg-slate-900 border border-slate-700 p-5 pl-12 rounded-2xl focus:border-accent outline-none font-mono text-xl tracking-[0.2em]"
                        />
                    </div>
                </div>

                {error && (
                    <div className="mb-6 py-2 px-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-[10px] font-black uppercase tracking-widest">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-5 bg-accent text-slate-900 font-black uppercase tracking-[0.2em] rounded-2xl hover:opacity-90 transition-all shadow-xl active:scale-[0.98] disabled:opacity-50"
                >
                    {loading ? 'AUTHENTICATING...' : 'INITIALIZE CONSOLE'}
                </button>
            </div>
        </div>
    );
};

type AdminView = 'editorials' | 'opinions' | 'stories' | 'archives' | 'headlines' | 'photos' | 'impacts' | 'events' | 'timeline' | 'abouthero' | 'perspectives' | 'contact_messages' | 'archivebooks' | 'anchors' | 'ads' | 'donations';

const AdminLayout: React.FC = () => {
    const queryClient = useQueryClient();
    const [view, setView] = useState<AdminView>('editorials');
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: string | null }>({ isOpen: false, id: null });

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToast({ message, type });
    };

    // Use TanStack Query for all views
    const { data: items = [], isLoading } = useQuery({
        queryKey: ['admin', view],
        queryFn: async () => {
            switch (view) {
                case 'editorials': return fetchArticles('Editorial');
                case 'opinions': return fetchArticles('Opinion');
                case 'stories': return fetchArticles('Story');
                case 'archives': return fetchArticles('Archive');
                case 'headlines': return fetchHeadlines();
                case 'photos': return fetchPhotos();
                case 'impacts': return fetchImpacts();
                case 'events': return fetchGlobalEvents();
                case 'timeline': return fetchTimeline();
                case 'perspectives': return adminApi.fetchPerspectives();
                case 'contact_messages': return adminApi.fetchContactMessages();
                case 'archivebooks': return fetchArchiveBooks();
                case 'anchors': return fetchGlobalAnchors();
                case 'ads': return fetchAds();
                case 'donations': return [await fetchDonationConfig()];
                case 'abouthero': return [await adminApi.fetchAboutConfig()];
                default: return [];
            }
        },
        retry: 1
    });

    // --- Data Forms ---
    const [articleForm, setArticleForm] = useState<Partial<Article>>({ category: 'Editorial', title: '', excerpt: '', author: 'Shridhar Rao', content: '', date: new Date().toLocaleDateString(), sidenote: '', readTime: '', language: 'en' });
    const [headlineForm, setHeadlineForm] = useState<Partial<Headline>>({ title: '', time: 'Now' });
    const [photoForm, setPhotoForm] = useState<Partial<Photo>>({ title: '', category: 'Field', imageUrl: '', date: '', location: '', description: '', dispatchId: '' });
    const [impactForm, setImpactForm] = useState<any>({ title: '', desc: '', icon: 'Users', stats: '', color: 'bg-primary', ref: '', link: '' });
    const [eventForm, setEventForm] = useState<any>({ title: '', location: '', desc: '', date: '' });
    const [timelineForm, setTimelineForm] = useState<Partial<TimelineItem>>({ year: '', title: '', event: '', image: '', refId: '' });
    const [aboutForm, setAboutForm] = useState<any>({});
    const [bookForm, setBookForm] = useState<any>({ title: '', author: '', image: '', reflection: '' });
    const [anchorForm, setAnchorForm] = useState<Partial<GlobalAnchor>>({ name: '', icon: 'Award', link: '' });
    const [adForm, setAdForm] = useState<Partial<Advertisement>>({ title: '', imageUrl: '', linkUrl: '', type: 'banner', isActive: true, position: 'right' });
    const [donationForm, setDonationForm] = useState<Partial<DonationConfig>>({});

    // Handle initial load of configs
    useEffect(() => {
        if (view === 'abouthero' && items.length > 0) {
            setAboutForm(items[0]);
        }
        if (view === 'donations' && items.length > 0) {
            setDonationForm(items[0] as DonationConfig);
        }
    }, [view, items]);

    // Mutations
    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            switch (view) {
                case 'editorials':
                case 'opinions':
                case 'stories':
                case 'archives': return adminApi.deleteArticle(id);
                case 'headlines': return adminApi.deleteHeadline(id);
                case 'photos': return adminApi.deletePhoto(id);
                case 'impacts': return adminApi.deleteImpact(id);
                case 'events': return adminApi.deleteGlobalEvent(id);
                case 'timeline': return adminApi.deleteTimelineItem(id);
                case 'archivebooks': return adminApi.deleteArchiveBook(id);
                case 'anchors': return adminApi.deleteGlobalAnchor(id);
                case 'contact_messages': return adminApi.deleteContactMessage(id);
                case 'perspectives': return adminApi.deletePerspective(id);
                case 'ads': return adminApi.deleteAd(id);
                default: throw new Error("Delete not handled");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', view] });
            showToast('Record purged from database.');
        },
        onError: (err) => showToast('Purge failed: Access Denied', 'error')
    });

    const createMutation = useMutation({
        mutationFn: async ({ type, data }: { type: AdminView, data: any }) => {
            if (editingId) {
                switch (type) {
                    case 'editorials':
                    case 'opinions':
                    case 'stories':
                    case 'archives': return adminApi.updateArticle(editingId, data);
                    case 'headlines': return adminApi.updateHeadline(editingId, data);
                    case 'photos': return adminApi.updatePhoto(editingId, data);
                    case 'impacts': return adminApi.updateImpact(editingId, data);
                    case 'events': return adminApi.updateGlobalEvent(editingId, data);
                    case 'timeline': return adminApi.updateTimelineItem(editingId, data);
                    case 'abouthero': return adminApi.updateAboutConfig(data);
                    case 'archivebooks': return adminApi.updateArchiveBook(editingId, data);
                    case 'anchors': return adminApi.updateGlobalAnchor(editingId, data);
                    case 'ads': return adminApi.updateAd(editingId, data);
                    case 'donations': return adminApi.updateDonationConfig(data);
                }
            } else {
                switch (type) {
                    case 'editorials':
                    case 'opinions':
                    case 'stories':
                    case 'archives':
                        const category = type === 'editorials' ? 'Editorial' : type === 'opinions' ? 'Opinion' : type === 'stories' ? 'Story' : 'Archive';
                        return adminApi.createArticle({ ...data, category });
                    case 'headlines': return adminApi.createHeadline(data);
                    case 'photos': return adminApi.createPhoto(data);
                    case 'impacts': return adminApi.createImpact(data);
                    case 'events': return adminApi.createGlobalEvent(data);
                    case 'timeline': return adminApi.createTimelineItem(data);
                    case 'abouthero': return adminApi.updateAboutConfig(data);
                    case 'archivebooks': return adminApi.createArchiveBook(data);
                    case 'anchors': return adminApi.createGlobalAnchor(data);
                    case 'ads': return adminApi.createAd(data);
                    case 'donations': return adminApi.updateDonationConfig(data);
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', view] });
            showToast(editingId ? 'Revision Committed' : 'Record Distributed');
            setShowForm(false);
            setEditingId(null);
        },
        onError: (err) => showToast('Operation failed: Access Denied', 'error')
    });

    const handleEdit = (item: any) => {
        setEditingId(item.id);
        setShowForm(true);
        switch (view) {
            case 'editorials':
            case 'opinions':
            case 'stories':
            case 'archives':
                setArticleForm(item); break;
            case 'headlines': setHeadlineForm(item); break;
            case 'photos': setPhotoForm(item); break;
            case 'impacts': setImpactForm(item); break;
            case 'events': setEventForm(item); break;
            case 'timeline': setTimelineForm(item); break;
            case 'abouthero': setAboutForm(item); break;
            case 'archivebooks': setBookForm(item); break;
            case 'anchors': setAnchorForm(item); break;
            case 'ads': setAdForm(item); break;
            case 'donations': setDonationForm(item); break;
        }
    };

    const confirmDelete = () => {
        if (deleteModal.id) deleteMutation.mutate(deleteModal.id);
        setDeleteModal({ isOpen: false, id: null });
    };

    const SidebarItem = ({ id, icon, label }: { id: AdminView, icon: React.ReactNode, label: string }) => (
        <button
            onClick={() => { setView(id); setShowForm(false); setEditingId(null); }}
            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 ${view === id ? 'bg-accent text-slate-900 font-bold shadow-lg scale-[1.02]' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
        >
            {icon}
            <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
        </button>
    );

    return (
        <div className="min-h-screen bg-[#FBFBFF] flex font-body selection:bg-accent selection:text-slate-900">
            <AnimatePresence>
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            </AnimatePresence>

            <ConfirmModal
                isOpen={deleteModal.isOpen}
                title="Verify Erasure"
                message="Are you sure you want to permanently delete this record from the database? This action is irreversible."
                onConfirm={confirmDelete}
                onCancel={() => setDeleteModal({ isOpen: false, id: null })}
            />

            {/* Sidebar */}
            <div className="w-20 lg:w-72 bg-slate-900 text-white p-6 fixed h-full z-50 flex flex-col transition-all border-r border-slate-800">
                <div className="mb-12 flex items-center gap-3 px-4">
                    <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center">
                        <LayoutDashboard className="text-slate-900" size={24} />
                    </div>
                    <div className="hidden lg:block">
                        <div className="font-heading font-black text-xl tracking-tighter">Mitaan<span className="text-accent">OS</span></div>
                        <div className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Admin Console v1.0</div>
                    </div>
                </div>

                <div className="space-y-8 flex-1 overflow-y-auto no-scrollbar">
                    <div>
                        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4 px-4">Pensieve</div>
                        <div className="space-y-1">
                            <SidebarItem id="editorials" icon={<BookOpen size={20} />} label="Editorials" />
                            <SidebarItem id="opinions" icon={<Quote size={20} />} label="Opinions" />
                            <SidebarItem id="stories" icon={<Newspaper size={20} />} label="Stories" />
                            <SidebarItem id="archives" icon={<Archive size={20} />} label="Archives" />
                        </div>
                    </div>

                    <div>
                        <div className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4 px-4">System</div>
                        <div className="space-y-1">
                            <SidebarItem id="headlines" icon={<Type size={20} />} label="Headlines" />
                            <SidebarItem id="timeline" icon={<History size={20} />} label="Journey" />
                            <SidebarItem id="photos" icon={<Image size={20} />} label="Gallery" />
                            <SidebarItem id="impacts" icon={<Zap size={20} />} label="Impacts" />
                            <SidebarItem id="events" icon={<Globe size={20} />} label="Global Desk" />
                            <SidebarItem id="abouthero" icon={<User size={20} />} label="About Hero" />
                            <SidebarItem id="perspectives" icon={<MessageCircle size={20} />} label="Perspectives" />
                            <SidebarItem id="contact_messages" icon={<Mail size={20} />} label="Inquiries" />
                            <SidebarItem id="archivebooks" icon={<Archive size={20} />} label="Intellectual" />
                            <SidebarItem id="anchors" icon={<Award size={20} />} label="Global Anchors" />
                            <SidebarItem id="ads" icon={<Zap size={20} />} label="Advertisements" />
                            <SidebarItem id="donations" icon={<Heart size={20} />} label="Donations" />
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800">
                    <button onClick={async () => {
                        try { await adminApi.logout(); } catch (e) { console.error(e); }
                        localStorage.removeItem('adminToken');
                        window.location.reload();
                    }} className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                        <span className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em]">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 ml-20 lg:ml-72 p-8 lg:p-16 overflow-x-hidden">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live Management</span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 tracking-tighter capitalize">{view}</h1>
                    </div>
                    {!showForm && view !== 'perspectives' && view !== 'contact_messages' && (
                        <button
                            onClick={() => { setShowForm(true); setEditingId(null); }}
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-2xl hover:bg-accent hover:text-slate-900 transition-all active:scale-[0.95] flex items-center gap-3"
                        >
                            <Plus size={18} /> New Entry
                        </button>
                    )}
                </header>

                <div className="bg-white rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 min-h-[60vh]">
                    {showForm ? (
                        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
                            <div className="flex justify-between items-center mb-12">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter">{editingId ? 'Modify' : 'Initialize'} {view.slice(0, -1)}</h2>
                                    <p className="text-slate-400 font-medium">Capture details for the database records.</p>
                                </div>
                                <button onClick={() => { setShowForm(false); setEditingId(null); }} className="w-12 h-12 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-all"><X size={24} /></button>
                            </div>

                            {/* ARTICLE EDITOR */}
                            {(view === 'editorials' || view === 'opinions' || view === 'stories' || view === 'archives') && (
                                <div className="space-y-8 max-w-4xl">
                                    <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold text-2xl outline-none focus:border-accent" placeholder="Manifesto Title" value={articleForm.title} onChange={e => setArticleForm({ ...articleForm, title: e.target.value })} />
                                    <div className="grid grid-cols-3 gap-8">
                                        <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 outline-none focus:border-accent font-bold" placeholder="Author" value={articleForm.author} onChange={e => setArticleForm({ ...articleForm, author: e.target.value })} />
                                        <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 outline-none focus:border-accent font-bold" placeholder="Read Time" value={articleForm.readTime} onChange={e => setArticleForm({ ...articleForm, readTime: e.target.value })} />
                                        <select className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 outline-none focus:border-accent font-bold" value={articleForm.language} onChange={e => setArticleForm({ ...articleForm, language: e.target.value })}>
                                            <option value="en">English</option>
                                            <option value="hi">Hindi</option>
                                        </select>
                                    </div>
                                    <ImageUploader value={articleForm.image || ''} onChange={url => setArticleForm({ ...articleForm, image: url })} />
                                    <textarea className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 h-32" placeholder="Excerpt" value={articleForm.excerpt} onChange={e => setArticleForm({ ...articleForm, excerpt: e.target.value })}></textarea>

                                    {view === 'stories' ? (
                                        <StoryBlockEditor content={articleForm.content || ''} onChange={val => setArticleForm({ ...articleForm, content: val })} />
                                    ) : (
                                        <textarea className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 h-96 font-mono" placeholder="Content (HTML)" value={articleForm.content} onChange={e => setArticleForm({ ...articleForm, content: e.target.value })}></textarea>
                                    )}
                                    <button onClick={() => createMutation.mutate({ type: view, data: articleForm })} className="w-full py-6 bg-slate-900 text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] hover:bg-accent hover:text-slate-900 transition-all">
                                        {editingId ? 'COMMIT CHANGES' : 'PUBLISH RECORD'}
                                    </button>
                                </div>
                            )}

                            {/* HEADLINE EDITOR */}
                            {view === 'headlines' && (
                                <div className="space-y-8 max-w-xl mx-auto">
                                    <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" placeholder="Headline Ticker" value={headlineForm.title} onChange={e => setHeadlineForm({ ...headlineForm, title: e.target.value })} />
                                    <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" placeholder="Time Latency" value={headlineForm.time} onChange={e => setHeadlineForm({ ...headlineForm, time: e.target.value })} />
                                    <button onClick={() => createMutation.mutate({ type: 'headlines', data: headlineForm })} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-[20px] hover:bg-accent hover:text-slate-900 transition-all">
                                        {editingId ? 'COMMIT HEADLINE' : 'BROADCAST LIVE'}
                                    </button>
                                </div>
                            )}

                            {/* PHOTO GALLERY EDITOR */}
                            {view === 'photos' && (
                                <div className="space-y-8 max-w-4xl">
                                    <div className="grid grid-cols-2 gap-8">
                                        <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Photo Title" value={photoForm.title} onChange={e => setPhotoForm({ ...photoForm, title: e.target.value })} />
                                        <select className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 outline-none font-bold" value={photoForm.category} onChange={e => setPhotoForm({ ...photoForm, category: e.target.value })}>
                                            <option>Field</option><option>Events</option><option>Studio</option><option>Coverage</option>
                                        </select>
                                    </div>
                                    <ImageUploader value={photoForm.imageUrl || ''} onChange={url => setPhotoForm({ ...photoForm, imageUrl: url })} />
                                    <textarea className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 h-24" placeholder="Description" value={photoForm.description} onChange={e => setPhotoForm({ ...photoForm, description: e.target.value })}></textarea>
                                    <button onClick={() => createMutation.mutate({ type: 'photos', data: photoForm })} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-[24px] hover:bg-accent hover:text-slate-900 transition-all">
                                        {editingId ? 'UPDATE ASSET' : 'DEPLOY ASSET'}
                                    </button>
                                </div>
                            )}

                            {/* TIMELINE EDITOR */}
                            {view === 'timeline' && (
                                <div className="space-y-8 max-w-3xl">
                                    <div className="grid grid-cols-4 gap-6">
                                        <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-black text-xl" placeholder="Year" value={timelineForm.year} onChange={e => setTimelineForm({ ...timelineForm, year: e.target.value })} />
                                        <input className="col-span-3 w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold text-xl" placeholder="Milestone Title" value={timelineForm.title} onChange={e => setTimelineForm({ ...timelineForm, title: e.target.value })} />
                                    </div>
                                    <ImageUploader value={timelineForm.image || ''} onChange={url => setTimelineForm({ ...timelineForm, image: url })} />
                                    <textarea className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 h-32" placeholder="Event Narrative" value={timelineForm.event} onChange={e => setTimelineForm({ ...timelineForm, event: e.target.value })}></textarea>
                                    <button onClick={() => createMutation.mutate({ type: 'timeline', data: timelineForm })} className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] rounded-[24px] hover:bg-accent hover:text-slate-900 transition-all">
                                        {editingId ? 'UPDATE MILESTONE' : 'PUBLISH MILESTONE'}
                                    </button>
                                </div>
                            )}

                            {/* IMPACT EDITOR */}
                            {view === 'impacts' && (
                                <div className="space-y-8 max-w-xl mx-auto">
                                    <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Stat Title" value={impactForm.title} onChange={e => setImpactForm({ ...impactForm, title: e.target.value })} />
                                    <textarea className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 h-24" placeholder="Description" value={impactForm.desc} onChange={e => setImpactForm({ ...impactForm, desc: e.target.value })}></textarea>
                                    <div className="grid grid-cols-2 gap-6">
                                        <select className="p-6 bg-slate-50 rounded-[20px] border border-slate-100" value={impactForm.icon} onChange={e => setImpactForm({ ...impactForm, icon: e.target.value })}>
                                            <option value="Users">Users Icon</option><option value="Shield">Shield Icon</option><option value="Target">Target Icon</option><option value="Zap">Zap Icon</option>
                                        </select>
                                        <input className="p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-black text-xl" placeholder="5k+" value={impactForm.stats} onChange={e => setImpactForm({ ...impactForm, stats: e.target.value })} />
                                    </div>
                                    <button onClick={() => createMutation.mutate({ type: 'impacts', data: impactForm })} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-[24px] hover:bg-accent hover:text-slate-900 transition-all">
                                        {editingId ? 'COMMIT STAT' : 'LOG IMPACT STAT'}
                                    </button>
                                </div>
                            )}

                            {/* ABOUT HERO EDITOR */}
                            {view === 'abouthero' && (
                                <div className="space-y-8 max-w-2xl mx-auto">
                                    <ImageUploader value={aboutForm.image || ''} onChange={url => setAboutForm({ ...aboutForm, image: url })} />
                                    <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Badge" value={aboutForm.badge} onChange={e => setAboutForm({ ...aboutForm, badge: e.target.value })} />
                                    <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Title" value={aboutForm.title} onChange={e => setAboutForm({ ...aboutForm, title: e.target.value })} />
                                    <textarea className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 h-32" placeholder="Quote" value={aboutForm.quote} onChange={e => setAboutForm({ ...aboutForm, quote: e.target.value })}></textarea>

                                    <div className="grid grid-cols-2 gap-6">
                                        <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Impact Link" value={aboutForm.impactSectionLink || ''} onChange={e => setAboutForm({ ...aboutForm, impactSectionLink: e.target.value })} />
                                        <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Anchors Link" value={aboutForm.globalAnchorsLink || ''} onChange={e => setAboutForm({ ...aboutForm, globalAnchorsLink: e.target.value })} />
                                        <input className="col-span-2 w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Anchors Button Text (e.g. Full History)" value={aboutForm.globalAnchorsText || ''} onChange={e => setAboutForm({ ...aboutForm, globalAnchorsText: e.target.value })} />
                                    </div>
                                    <button onClick={() => createMutation.mutate({ type: 'abouthero', data: aboutForm })} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-[24px] hover:bg-accent hover:text-slate-900 transition-all">
                                        SAVE SYSTEM CONFIGURATION
                                    </button>
                                </div>
                            )}

                            {/* ARCHIVE BOOK EDITOR */}
                            {view === 'archivebooks' && (
                                <div className="space-y-8 max-w-xl mx-auto">
                                    <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold text-xl" placeholder="Book Title" value={bookForm.title} onChange={e => setBookForm({ ...bookForm, title: e.target.value })} />
                                    <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" placeholder="Author" value={bookForm.author} onChange={e => setBookForm({ ...bookForm, author: e.target.value })} />
                                    <ImageUploader value={bookForm.image || ''} onChange={url => setBookForm({ ...bookForm, image: url })} />
                                    <textarea className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 h-32" placeholder="Reflection" value={bookForm.reflection} onChange={e => setBookForm({ ...bookForm, reflection: e.target.value })}></textarea>
                                    <button onClick={() => createMutation.mutate({ type: 'archivebooks', data: bookForm })} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-[24px] hover:bg-accent hover:text-slate-900 transition-all">
                                        {editingId ? 'COMMIT RECORD' : 'ARCHIVE TEXT'}
                                    </button>
                                </div>
                            )}

                            {/* GLOBAL ANCHOR EDITOR */}
                            {view === 'anchors' && (
                                <div className="space-y-8 max-w-xl mx-auto">
                                    <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Anchor Name" value={anchorForm.name} onChange={e => setAnchorForm({ ...anchorForm, name: e.target.value })} />
                                    <select className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" value={anchorForm.icon} onChange={e => setAnchorForm({ ...anchorForm, icon: e.target.value })}>
                                        <option value="Award">Award Icon</option><option value="Globe">Globe Icon</option><option value="Shield">Shield Icon</option><option value="Zap">Zap Icon</option><option value="Users">Users Icon</option>
                                    </select>
                                    <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Link" value={anchorForm.link} onChange={e => setAnchorForm({ ...anchorForm, link: e.target.value })} />
                                    <button onClick={() => createMutation.mutate({ type: 'anchors', data: anchorForm })} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-[24px] hover:bg-accent hover:text-slate-900 transition-all">
                                        {editingId ? 'UPDATE ANCHOR' : 'ADD ANCHOR'}
                                    </button>
                                </div>
                            )}

                            {/* ADVERTISEMENT EDITOR */}
                            {view === 'ads' && (
                                <div className="space-y-8 max-w-2xl mx-auto">
                                    <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Ad Title" value={adForm.title} onChange={e => setAdForm({ ...adForm, title: e.target.value })} />
                                    <div className="grid grid-cols-2 gap-6">
                                        <select className="p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" value={adForm.type} onChange={e => setAdForm({ ...adForm, type: e.target.value as any })}>
                                            <option value="banner">Banner</option>
                                            <option value="sidebar">Sidebar</option>
                                            <option value="popup">Popup</option>
                                        </select>
                                        {adForm.type === 'sidebar' && (
                                            <select className="p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" value={adForm.position} onChange={e => setAdForm({ ...adForm, position: e.target.value })}>
                                                <option value="left">Left Side</option>
                                                <option value="right">Right Side</option>
                                            </select>
                                        )}
                                        <div className="flex items-center gap-4 px-6 bg-slate-50 rounded-[20px] border border-slate-100">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active</span>
                                            <input type="checkbox" checked={adForm.isActive} onChange={e => setAdForm({ ...adForm, isActive: e.target.checked })} className="w-6 h-6 accent-accent" />
                                        </div>
                                    </div>
                                    <ImageUploader value={adForm.imageUrl || ''} onChange={url => setAdForm({ ...adForm, imageUrl: url })} />
                                    <input className="w-full p-6 bg-slate-50 rounded-[24px] border border-slate-100 font-bold" placeholder="Link URL" value={adForm.linkUrl} onChange={e => setAdForm({ ...adForm, linkUrl: e.target.value })} />
                                    <button onClick={() => createMutation.mutate({ type: 'ads', data: adForm })} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-[24px] hover:bg-accent hover:text-slate-900 transition-all">
                                        {editingId ? 'COMMIT AD' : 'DEPLOY AD'}
                                    </button>
                                </div>
                            )}

                            {/* DONATION EDITOR */}
                            {view === 'donations' && (
                                <div className="space-y-8 max-w-3xl mx-auto">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">QR CODE IMAGE</label>
                                            <ImageUploader value={donationForm.qrCodeUrl || ''} onChange={url => setDonationForm({ ...donationForm, qrCodeUrl: url })} />
                                        </div>
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">UPI ID</label>
                                                <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" placeholder="yourname@upi" value={donationForm.upiId || ''} onChange={e => setDonationForm({ ...donationForm, upiId: e.target.value })} />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">DONATION MESSAGE</label>
                                                <textarea className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 h-32 font-medium" placeholder="Your message to donors..." value={donationForm.message || ''} onChange={e => setDonationForm({ ...donationForm, message: e.target.value })}></textarea>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8 border-t border-slate-100">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">BANK NAME</label>
                                            <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" placeholder="HDFC Bank" value={donationForm.bankName || ''} onChange={e => setDonationForm({ ...donationForm, bankName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">ACCOUNT NAME</label>
                                            <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" placeholder="Shridhar Rao" value={donationForm.accountName || ''} onChange={e => setDonationForm({ ...donationForm, accountName: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">ACCOUNT NUMBER</label>
                                            <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" placeholder="1234567890" value={donationForm.accountNumber || ''} onChange={e => setDonationForm({ ...donationForm, accountNumber: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">IFSC CODE</label>
                                            <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" placeholder="HDFC0001234" value={donationForm.ifscCode || ''} onChange={e => setDonationForm({ ...donationForm, ifscCode: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">SWIFT CODE (OPTIONAL)</label>
                                            <input className="w-full p-6 bg-slate-50 rounded-[20px] border border-slate-100 font-bold" placeholder="HDFCBINBB" value={donationForm.swiftCode || ''} onChange={e => setDonationForm({ ...donationForm, swiftCode: e.target.value })} />
                                        </div>
                                    </div>

                                    <button onClick={() => createMutation.mutate({ type: 'donations', data: donationForm })} className="w-full py-6 bg-slate-900 text-white font-black uppercase text-[10px] tracking-widest rounded-[24px] hover:bg-accent hover:text-slate-900 transition-all">
                                        SAVE DONATION CONFIGURATION
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <div className="animate-fade-in no-scrollbar">
                            <div className="max-w-6xl mx-auto">
                                <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Database Stream</div>
                                    <div className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">{items.length} Records Found</div>
                                </div>

                                {isLoading ? (
                                    <div className="py-32 text-center animate-pulse">
                                        <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing with Archive...</p>
                                    </div>
                                ) : items.length === 0 ? (
                                    <div className="py-32 text-center">
                                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                                            <Archive className="text-slate-200" size={40} />
                                        </div>
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">The pensieve is empty.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-6">
                                        {items.map((item: any, idx: number) => (
                                            <motion.div
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                key={item.id || idx}
                                                className="flex items-center justify-between p-8 bg-[#FBFBFF] rounded-[32px] border border-slate-50 hover:border-accent hover:bg-white transition-all shadow-sm hover:shadow-xl group"
                                            >
                                                <div className="flex items-center gap-8 flex-1">
                                                    {(item.image || item.imageUrl || item.photo) && (
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
                                                            <img src={item.image || item.imageUrl || item.photo} className="w-full h-full object-cover" alt="" />
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-accent px-2 py-1 bg-accent/10 rounded-full">
                                                                {item.category || view}
                                                            </span>
                                                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-300">REF-{item.id?.toString().slice(-4).toUpperCase() || idx}</span>
                                                        </div>
                                                        <h3 className="font-bold text-slate-900 text-xl tracking-tight mb-2 group-hover:text-accent transition-colors">{item.title || item.name || item.location || "Untitled Record"}</h3>
                                                        <div className="flex gap-6 text-[10px] font-bold text-slate-400">
                                                            {item.email && <span className="flex items-center gap-2 font-mono">{item.email}</span>}
                                                            {item.date && <span className="uppercase tracking-widest">{item.date}</span>}
                                                            {item.author && <span className="uppercase tracking-widest text-slate-500">{item.author}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-all">
                                                    {view !== 'contact_messages' && view !== 'perspectives' && view !== 'abouthero' && (
                                                        <button onClick={() => handleEdit(item)} className="p-3 bg-white text-slate-400 hover:text-accent rounded-xl border border-slate-100 shadow-sm transition-all"><Edit size={18} /></button>
                                                    )}
                                                    <button onClick={() => setDeleteModal({ isOpen: true, id: item.id })} className="p-3 bg-white text-slate-400 hover:text-red-500 rounded-xl border border-slate-100 shadow-sm transition-all"><Trash2 size={18} /></button>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const AdminPage: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const verify = async () => {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                setInitializing(false);
                return;
            }

            try {
                await adminApi.verifySession();
                setIsLoggedIn(true);
            } catch (err) {
                console.error("Session verification failed", err);
                localStorage.removeItem('adminToken');
            } finally {
                setInitializing(false);
            }
        };

        verify();
    }, []);

    const handleLogin = (token: string) => {
        setIsLoggedIn(true);
        localStorage.setItem('adminToken', token);
    };

    if (initializing) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!isLoggedIn) return <AdminLogin onLogin={handleLogin} />;
    return <AdminLayout />;
};
