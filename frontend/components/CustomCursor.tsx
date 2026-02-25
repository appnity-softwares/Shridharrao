import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 35, stiffness: 300 };
    const cursorXSpring = useSpring(cursorX, springConfig);
    const cursorYSpring = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        window.addEventListener('mousemove', moveCursor);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            id="custom-cursor"
            style={{
                translateX: cursorXSpring,
                translateY: cursorYSpring,
                left: -10,
                top: -10,
            }}
            animate={{
                width: 20,
                height: 20,
                backgroundColor: 'rgba(255, 255, 255, 0)',
                borderWidth: 1.5,
                borderColor: '#C5A059',
            }}
            className="flex items-center justify-center pointer-events-none fixed z-[9999]"
        />
    );
};

export default CustomCursor;