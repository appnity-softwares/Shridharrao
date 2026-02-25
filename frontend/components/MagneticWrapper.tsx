import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface MagneticWrapperProps {
    children: React.ReactNode;
    strength?: number;
}

const MagneticWrapper: React.FC<MagneticWrapperProps> = ({ children, strength = 40 }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!ref.current) return;
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) / (width / 2);
        const y = (clientY - (top + height / 2)) / (height / 2);
        setPosition({ x: x * strength, y: y * strength });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className="magnetic-wrap"
        >
            {children}
        </motion.div>
    );
};

export default MagneticWrapper;
