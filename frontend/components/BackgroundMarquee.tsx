import React from 'react';

const BackgroundMarquee: React.FC = () => {
    const content = "DIGITAL ETHICS • BASTAR GOVERNANCE • FISCAL TRANSPARENCY • RURAL RESILIENCE • SYSTEMIC INTEGRITY • ";

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] opacity-[0.02] flex items-center select-none">
            <div className="pulse-marquee">
                <span>{content}{content}{content}{content}</span>
                <span>{content}{content}{content}{content}</span>
            </div>
        </div>
    );
};

export default BackgroundMarquee;
