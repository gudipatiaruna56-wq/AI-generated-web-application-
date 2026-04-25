import { motion } from 'motion/react';

interface GlitchTextProps {
  text: string;
  className?: string;
  intensity?: 'low' | 'high';
}

export default function GlitchText({ text, className = "", intensity = 'low' }: GlitchTextProps) {
  return (
    <div className={`relative inline-block ${className}`}>
      <span className="relative z-10">{text}</span>
      <motion.span
        animate={intensity === 'high' ? {
          x: [-2, 2, -1, 3, 0],
          opacity: [0.5, 0.2, 0.8, 0.3, 0.5],
        } : {}}
        transition={{ repeat: Infinity, duration: 0.1 }}
        className="absolute inset-0 z-0 text-neon-magenta opacity-50"
      >
        {text}
      </motion.span>
      <motion.span
        animate={intensity === 'high' ? {
          x: [2, -2, 3, -1, 0],
          opacity: [0.5, 0.8, 0.2, 0.7, 0.5],
        } : {}}
        transition={{ repeat: Infinity, duration: 0.15 }}
        className="absolute inset-0 z-0 text-neon-cyan opacity-50"
      >
        {text}
      </motion.span>
    </div>
  );
}
