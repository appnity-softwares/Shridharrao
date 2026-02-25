import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        // Navbar
        portfolio: 'Home',
        biography: 'About',
        itinerary: 'Travels',
        pensieve: 'Journal',
        gallery: 'Photos',
        contact: 'Contact',
        support: 'Donate',
        editorials: 'Deep Analysis',
        opinions: 'My Views',
        stories: 'True Stories',
        archives: 'Past Work',
        intellectual: 'Books',
        footer_quote: 'Every story has a soul. My quest is to find it, understand it, and share it with the world.',
        editorials_desc: 'Deep-dive analysis on national shifts',
        opinions_desc: 'Personal takes on everyday ethics',
        stories_desc: 'The human element of journalism',
        archives_desc: 'A collection of past reporting',
        intellectual_desc: 'Reflections on foundational texts',

        // Hero
        seek_the: 'Find the',
        unmentioned: 'Truth.',
        independent_dispatch: 'Official Journal',
        hero_quote: '"Finding beauty in truth, and clarity in words."',

        // Sections
        impact_narrative: 'Our Results',
        beyond_the_word: 'Real Change.',
        the_world_desk: 'Global Stories',
        without_borders: 'Across Borders.',
        intellectual_focus: 'Deep Reading',
        the_intellectual_archive: 'Book Library.',

        // Buttons
        read_more: 'Read More',
        read_reflection: 'Read Story',
        enter_library: 'Open Library',
        back_to_pensieve: 'Back to Journal',
        submit: 'Send',

        // UI
        updated: 'Updated',
        deep_dive: 'Analysis',
        featured: 'New',
        search_placeholder: 'Search articles, news, or reports...',
        intellectual_archive_query: 'Library Search',
        search_title: '"Finding what you need..."',
    },
    hi: {
        // Navbar
        portfolio: 'मुख्य पृष्ठ',
        biography: 'मेरे बारे में',
        itinerary: 'मेरी यात्राएँ',
        pensieve: 'लेख',
        gallery: 'तस्वीरें',
        contact: 'संपर्क करें',
        support: 'सहयोग करें',
        editorials: 'गहरा विश्लेषण',
        opinions: 'मेरी राय',
        stories: 'सच्ची कहानियाँ',
        archives: 'पुराना काम',
        intellectual: 'किताबें',
        footer_quote: 'हर कहानी की एक आत्मा होती है। मेरी खोज उसे खोजने, समझने और दुनिया के साथ साझा करने की है।',
        editorials_desc: 'राष्ट्रीय बदलावों पर गहरा विश्लेषण',
        opinions_desc: 'रोजमर्रा की नैतिकता पर व्यक्तिगत विचार',
        stories_desc: 'पत्रकारिता का मानवीय तत्व',
        archives_desc: 'पिछली रिपोर्टिंग का संग्रह',
        intellectual_desc: 'मौलिक ग्रंथों पर विचार',

        // Hero
        seek_the: 'सच्चाई',
        unmentioned: 'खोजें।',
        independent_dispatch: 'आधिकारिक पत्रिका',
        hero_quote: '"सच्चाई में सुंदरता और शब्दों में स्पष्टता ढूंढना।"',

        // Sections
        impact_narrative: 'हमारे परिणाम',
        beyond_the_word: 'असली बदलाव।',
        the_world_desk: 'विश्व की कहानियाँ',
        without_borders: 'सरहदों के पार।',
        intellectual_focus: 'गहन अध्ययन',
        the_intellectual_archive: 'पुस्तकालय।',

        // Buttons
        read_more: 'और पढ़ें',
        read_reflection: 'कहानी पढ़ें',
        enter_library: 'लाइब्रेरी खोलें',
        back_to_pensieve: 'लेखों पर वापस जाएं',
        submit: 'भेजें',

        // UI
        updated: 'अपडेट किया गया',
        deep_dive: 'विश्लेषण',
        featured: 'नया',
        search_placeholder: 'लेख, समाचार या रिपोर्ट खोजें...',
        intellectual_archive_query: 'लाइब्रेरी खोज',
        search_title: '"जो आपको चाहिए उसे ढूंढ रहे हैं..."',
    }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
