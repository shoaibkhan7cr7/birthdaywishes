import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = [
  { hex: 'rgba(239, 68, 68, 0.9)', tail: '#b91c1c' }, // Red
  { hex: 'rgba(59, 130, 246, 0.9)', tail: '#1d4ed8' }, // Blue
  { hex: 'rgba(34, 197, 94, 0.9)', tail: '#15803d' }, // Green
  { hex: 'rgba(234, 179, 8, 0.9)', tail: '#a16207' }, // Yellow
  { hex: 'rgba(168, 85, 247, 0.9)', tail: '#7e22ce' }, // Purple
  { hex: 'rgba(236, 72, 153, 0.9)', tail: '#be185d' }, // Pink
];

interface Balloon {
  id: number;
  x: number; // 0 to 100vw
  scale: number;
  colorIdx: number;
  speed: number;
  sway: number;
  delay: number;
}

export const FloatingBalloons: React.FC<{ generating: boolean }> = ({ generating }) => {
  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const [balloons, setBalloons] = useState<Balloon[]>([]);

  useEffect(() => {
    // Only generate balloons if generating is true
    if (!generating) return;

    // Generate a wider spread of balloons with more staggered start times
    const createBalloon = (idOffset: number, delayOverride?: number) => ({
      id: Date.now() + idOffset,
      x: Math.random() * 100, // Full width 0-100%
      scale: 0.8 + Math.random() * 0.4,
      colorIdx: Math.floor(Math.random() * COLORS.length),
      speed: 12 + Math.random() * 8, // 12-20s duration
      sway: 50 + Math.random() * 100, // Larger sway
      delay: delayOverride ?? Math.random() * 8 // Spread start times 0-8s
    });

    // Initial batch
    const initial = Array.from({ length: 25 }).map((_, i) => createBalloon(i));
    setBalloons(initial);

    // Continuous trickle
    const interval = setInterval(() => {
      setBalloons(prev => {
        if (prev.length > 30) return prev;
        return [...prev, createBalloon(Math.random(), 0)];
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [generating]);

  const popBalloon = (id: number) => {
    if (popSoundRef.current) {
      popSoundRef.current.currentTime = 0;
      popSoundRef.current.play().catch(() => {});
    }
    setBalloons(prev => prev.filter(b => b.id !== id));
  };

  return (
    <>
      <audio ref={popSoundRef} src="/assets/bubble_pop.mp3" preload="auto" />
      {/* pointer-events-none on container ensures clicks pass through to the cake underneath */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none z-[20] overflow-hidden">
        <AnimatePresence>
          {balloons.map((b) => (
            <BalloonItem key={b.id} data={b} onPop={() => popBalloon(b.id)} />
          ))}
        </AnimatePresence>
      </div>
    </>
  );
};

const BalloonItem: React.FC<{ data: Balloon; onPop: () => void }> = ({ data, onPop }) => {
  const color = COLORS[data.colorIdx];

  return (
    <motion.div
      initial={{ y: '110vh', opacity: 0 }}
      animate={{ 
        y: '-120vh', 
        opacity: 1,
        x: [0, data.sway, 0, -data.sway, 0] // Relative sway from left position
      }}
      exit={{ scale: 2, opacity: 0, transition: { duration: 0.1 } }}
      transition={{
        y: { 
          duration: data.speed, 
          ease: "linear", 
          delay: data.delay 
        },
        x: {
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        },
        opacity: { duration: 0.5, delay: data.delay }
      }}
      // pointer-events-auto re-enables clicking on the balloons themselves
      className="absolute top-0 cursor-pointer pointer-events-auto"
      style={{ left: `${data.x}%` }} // Absolute horizontal position
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onPop();
      }}
    >
      <div 
        style={{ transform: `scale(${data.scale})` }}
        className="relative group w-32 h-40 flex justify-center hover:brightness-110 active:scale-95 transition-all"
      >
        {/* Expanded Click Area */}
        <div className="absolute inset-0 scale-150 rounded-full z-10" />

        <svg width="100%" height="100%" viewBox="0 0 100 120" fill="none" className="drop-shadow-2xl">
           {/* Wobbly String */}
           <motion.path 
              d="M50 100 Q 50 110 50 120" 
              stroke="rgba(255,255,255,0.7)" 
              strokeWidth="1.5"
              fill="none"
              animate={{ d: ["M50 100 Q 45 110 50 120", "M50 100 Q 55 110 50 120", "M50 100 Q 45 110 50 120"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
           />

           {/* Balloon Shape */}
           <path d="M50 100 L46 104 L54 104 Z" fill={color.tail} />
           <ellipse cx="50" cy="48" rx="38" ry="48" fill={color.hex} />
           
           {/* Highlights for glossiness */}
           <ellipse cx="30" cy="30" rx="10" ry="18" transform="rotate(-30 30 30)" fill="white" fillOpacity="0.3" filter="blur(2px)" />
           <circle cx="25" cy="20" r="3" fill="white" fillOpacity="0.8" />
           
           {/* Inner rim light */}
           <ellipse cx="50" cy="48" rx="36" ry="46" stroke="white" strokeOpacity="0.1" strokeWidth="2" fill="none" />
        </svg>
      </div>
    </motion.div>
  );
};