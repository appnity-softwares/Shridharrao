import axios from 'axios';

const API_URL = 'http://localhost:8080';

// API Instance
const api = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Required for cookies (refresh tokens)
});

// Request Interceptor for Admin Token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor for Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const { data } = await axios.post(`${API_URL}/admin/refresh`, {}, { withCredentials: true });
                localStorage.setItem('adminToken', data.token);
                originalRequest.headers['Authorization'] = `Bearer ${data.token}`;
                return api(originalRequest);
            } catch (err) {
                // Refresh failed, redirect to login or clear auth
                localStorage.removeItem('adminToken');
            }
        }
        return Promise.reject(error);
    }
);

// --- Interfaces ---
export interface Headline {
    id: string;
    title: string;
    time: string;
}

export interface Photo {
    id: string;
    title: string;
    category: string;
    imageUrl: string;
    date: string;
    location: string;
    description: string;
    dispatchId: string;
}

export interface ImpactStat {
    id: string;
    title: string;
    desc: string;
    icon: string;
    stats: string;
    color: string;
    ref: string;
    link: string;
}

export interface GlobalEvent {
    id: string;
    location: string;
    title: string;
    desc: string;
    date: string;
}

export interface Article {
    id: string;
    category: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    readTime: string;
    image: string;
    content: string;
    sidenote?: string;
    language: string;
}

export interface TimelineItem {
    id: string;
    year: string;
    title: string;
    event: string;
    refId: string;
    image: string;
}

export interface AboutConfig {
    id: string;
    title: string;
    subtitle: string;
    quote: string;
    image: string;
    badge: string;
    stat1Label: string;
    stat1Value: string;
    stat2Label: string;
    stat2Value: string;
    stat3Label: string;
    stat3Value: string;
    stat4Label: string;
    stat4Value: string;
    impactSectionLink: string;
    globalAnchorsLink: string;
    globalAnchorsText: string;
}

export interface Perspective {
    id?: string;
    articleId: string;
    name: string;
    email: string;
    content: string;
    date?: string;
}

export interface ContactMessage {
    id: number;
    name: string;
    email: string;
    category: string;
    message: string;
    date: string;
}

export interface ArchiveBook {
    id: string;
    title: string;
    author: string;
    image: string;
    reflection: string;
}

export interface GlobalAnchor {
    id: string;
    name: string;
    icon: string;
    link: string;
}

export interface Advertisement {
    id: string;
    title: string;
    imageUrl: string;
    linkUrl: string;
    type: 'banner' | 'sidebar' | 'popup';
    isActive: boolean;
    position?: string;
}

export interface DonationConfig {
    id: string;
    qrCodeUrl: string;
    upiId: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    ifscCode: string;
    swiftCode?: string;
    message: string;
}

// --- Public API ---
export const fetchArticles = async (category?: string, lang?: string) => {
    const { data } = await api.get<Article[]>('/articles', { params: { category, lang } });
    return data;
};

export const fetchArticleById = async (id: string) => {
    const { data } = await api.get<Article>(`/articles/${id}`);
    return data;
};

export const fetchRecentArticles = async (limit: number = 5, lang?: string) => {
    const { data } = await api.get<Article[]>('/articles', { params: { lang } });
    return data.slice(0, limit);
};

export const fetchHeadlines = async () => {
    const { data } = await api.get<Headline[]>('/headlines');
    return data;
};

export const fetchPhotos = async () => {
    const { data } = await api.get<Photo[]>('/photos');
    return data;
};

export const fetchImpacts = async () => {
    const { data } = await api.get<ImpactStat[]>('/impacts');
    return data;
};

export const fetchGlobalEvents = async () => {
    const { data } = await api.get<GlobalEvent[]>('/global_events');
    return data;
};

export const fetchTimeline = async () => {
    const { data } = await api.get<TimelineItem[]>('/timeline');
    return data;
};

export const fetchAboutConfig = async () => {
    const { data } = await api.get<AboutConfig>('/about_config');
    return data;
};

export const submitPerspective = async (payload: Perspective) => {
    const { data } = await api.post('/perspectives', payload);
    return data;
};

export const fetchArchiveBooks = async () => {
    const { data } = await api.get<ArchiveBook[]>('/archive_books');
    return data;
};

export const fetchArchiveBookById = async (id: string) => {
    const { data } = await api.get<ArchiveBook>(`/archive_books/${id}`);
    return data;
};

export const fetchGlobalAnchors = async () => {
    const { data } = await api.get<GlobalAnchor[]>('/global_anchors');
    return data;
};

export const submitContactMessage = async (data: Partial<ContactMessage>): Promise<ContactMessage> => {
    const res = await api.post('/contact_messages', data);
    return res.data;
};

export const searchAllQuery = async (q: string, lang?: string) => {
    const { data } = await api.get<{ articles: Article[], books: ArchiveBook[] }>('/search', { params: { q, lang } });
    return data;
};

export const fetchAds = async () => {
    const { data } = await api.get<Advertisement[]>('/ads');
    return data;
};

export const fetchDonationConfig = async () => {
    const { data } = await api.get<DonationConfig>('/donation_config');
    return data;
};

// --- Admin API ---
export const adminApi = {
    login: (username: string, password: string) => api.post('/admin/login', { username, password }).then(res => res.data),
    logout: () => api.post('/admin/logout').then(res => res.data),
    verifySession: () => api.get('/admin/verify').then(res => res.data),

    createArticle: (data: Partial<Article>) => api.post('/articles', data).then(res => res.data),
    updateArticle: (id: string, data: Partial<Article>) => api.put(`/articles/${id}`, data).then(res => res.data),
    deleteArticle: (id: string) => api.delete(`/articles/${id}`).then(res => res.data),

    createHeadline: (data: Partial<Headline>) => api.post('/headlines', data).then(res => res.data),
    updateHeadline: (id: string, data: Partial<Headline>) => api.put(`/headlines/${id}`, data).then(res => res.data),
    deleteHeadline: (id: string) => api.delete(`/headlines/${id}`).then(res => res.data),

    createPhoto: (data: Partial<Photo>) => api.post('/photos', data).then(res => res.data),
    updatePhoto: (id: string, data: Partial<Photo>) => api.put(`/photos/${id}`, data).then(res => res.data),
    deletePhoto: (id: string) => api.delete(`/photos/${id}`).then(res => res.data),

    createImpact: (data: any) => api.post('/impacts', data).then(res => res.data),
    updateImpact: (id: string, data: any) => api.put(`/impacts/${id}`, data).then(res => res.data),
    deleteImpact: (id: string) => api.delete(`/impacts/${id}`).then(res => res.data),

    createGlobalEvent: (data: any) => api.post('/global_events', data).then(res => res.data),
    updateGlobalEvent: (id: string, data: any) => api.put(`/global_events/${id}`, data).then(res => res.data),
    deleteGlobalEvent: (id: string) => api.delete(`/global_events/${id}`).then(res => res.data),

    createTimelineItem: (data: any) => api.post('/timeline', data).then(res => res.data),
    updateTimelineItem: (id: string, data: any) => api.put(`/timeline/${id}`, data).then(res => res.data),
    deleteTimelineItem: (id: string) => api.delete(`/timeline/${id}`).then(res => res.data),

    fetchPerspectives: (): Promise<Perspective[]> => api.get('/perspectives').then(res => res.data),
    deletePerspective: (id: string) => api.delete(`/perspectives/${id}`).then(res => res.data),

    fetchContactMessages: (): Promise<ContactMessage[]> => api.get('/contact_messages').then(res => res.data),
    deleteContactMessage: (id: string) => api.delete(`/contact_messages/${id}`).then(res => res.data),

    fetchAboutConfig: () => fetchAboutConfig(),
    updateAboutConfig: (data: AboutConfig) => api.put('/about_config', data).then(res => res.data),

    createArchiveBook: (data: Partial<ArchiveBook>) => api.post('/archive_books', data).then(res => res.data),
    updateArchiveBook: (id: string, data: Partial<ArchiveBook>) => api.put(`/archive_books/${id}`, data).then(res => res.data),
    deleteArchiveBook: (id: string) => api.delete(`/archive_books/${id}`).then(res => res.data),

    createGlobalAnchor: (data: Partial<GlobalAnchor>) => api.post('/global_anchors', data).then(res => res.data),
    updateGlobalAnchor: (id: string, data: Partial<GlobalAnchor>) => api.put(`/global_anchors/${id}`, data).then(res => res.data),
    deleteGlobalAnchor: (id: string) => api.delete(`/global_anchors/${id}`).then(res => res.data),

    uploadFile: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        const { data } = await api.post('/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return data;
    },

    createAd: (data: Partial<Advertisement>) => api.post('/ads', data).then(res => res.data),
    updateAd: (id: string, data: Partial<Advertisement>) => api.put(`/ads/${id}`, data).then(res => res.data),
    deleteAd: (id: string) => api.delete(`/ads/${id}`).then(res => res.data),

    updateDonationConfig: (data: DonationConfig) => api.put('/donation_config', data).then(res => res.data)
};
