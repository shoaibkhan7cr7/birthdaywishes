import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wind } from 'lucide-react';

interface CakeProps {
  isCandleBlown: boolean;
  onInteract: (e: React.MouseEvent) => void;
  micPermissionDenied: boolean;
}

export const Cake: React.FC<CakeProps> = ({ isCandleBlown, onInteract, micPermissionDenied }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [smoke, setSmoke] = useState(false);

  useEffect(() => {
    if (isCandleBlown) {
      setSmoke(true);
      if (audioRef.current) {
        audioRef.current.play();

        // Stop the song after 24 seconds with a fade-out
        setTimeout(() => {
          if (audioRef.current) {
            let volume = audioRef.current.volume;
            const fadeOutInterval = setInterval(() => {
              if (volume > 0.1) {
                volume -= 0.1;
                if(audioRef.current) audioRef.current.volume = volume;
              } else {
                if(audioRef.current) {
                  audioRef.current.pause();
                  audioRef.current.currentTime = 0;
                }
                clearInterval(fadeOutInterval);
              }
            }, 200);
          }
        }, 22000); // Start fade out 2 seconds before the 24s mark
      }
    }
  }, [isCandleBlown]);

  return (
    <>
      <audio ref={audioRef} src="/assets/happy-birthday-314197.mp3" />
    <div className="relative flex flex-col items-center justify-center mt-4 transition-transform duration-1000">
      
      {/* Interaction Hint: Cinematic Style */}
      <AnimatePresence>
        {!isCandleBlown && (
          <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute -top-32 md:-top-48 text-center z-20 w-full pointer-events-none"
          >
            {/* Main Title */}
            <h2 className="font-serif text-5xl md:text-7xl text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)] tracking-wide">
              Make a Wish
            </h2>
            
            {/* Subtitle / Action */}
            <div className="flex items-center justify-center gap-3 mt-4 opacity-80">
                <div className="h-[1px] w-8 md:w-16 bg-gradient-to-r from-transparent to-blue-200"></div>
                <p className="font-sans text-blue-100 text-sm md:text-lg tracking-[0.2em] uppercase font-light drop-shadow-lg flex items-center gap-2">
                   {micPermissionDenied ? (
                     <>Click to blow <span className="animate-bounce">👆</span></>
                   ) : (
                     <>Blow the candle <Wind className="w-4 h-4 animate-pulse" /></>
                   )}
                </p>
                <div className="h-[1px] w-8 md:w-16 bg-gradient-to-l from-transparent to-blue-200"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative cursor-pointer group transition-transform duration-500 ease-in-out" onClick={onInteract}>
        {/* SVG CAKE */}
        <svg width="320" height="360" viewBox="0 0 320 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          
          {/* Cake Body Group: Dimmed when candle is lit */}
          <g style={{ opacity: isCandleBlown ? 1 : 0.2, transition: 'opacity 1.5s ease-in-out' }}>
              {/* Plate */}
              <ellipse cx="160" cy="330" rx="140" ry="25" fill="#E2E8F0" />
              <ellipse cx="160" cy="328" rx="120" ry="18" fill="#F8FAFC" />
              
              {/* Bottom Tier Shadow */}
              <ellipse cx="160" cy="310" rx="100" ry="20" fill="#000000" fillOpacity="0.2" />

              {/* Bottom Tier Body */}
              <path d="M60 220 C60 200 260 200 260 220 V 300 C260 320 60 320 60 300 Z" fill="url(#cakeGradient)" />
              <path d="M60 220 C60 240 260 240 260 220 C260 200 60 200 60 220" fill="#FFCFE3" /> {/* Top of bottom tier */}
              
              {/* Bottom Tier Icing Drips */}
              <path d="M60 220 C60 235 70 245 80 235 C90 225 100 245 110 235 C120 225 130 250 140 235 C150 220 160 245 170 235 C180 225 190 250 200 235 C210 220 220 245 230 235 C240 225 250 240 260 220" stroke="#FFF0F5" strokeWidth="8" strokeLinecap="round" fill="none" />

              {/* Top Tier Shadow */}
              <ellipse cx="160" cy="220" rx="75" ry="15" fill="#000000" fillOpacity="0.1" />

              {/* Top Tier Body */}
              <path d="M85 150 C85 130 235 130 235 150 V 210 C235 230 85 230 85 210 Z" fill="url(#cakeGradient)" />
              <path d="M85 150 C85 165 235 165 235 150 C235 135 85 135 85 150" fill="#FFCFE3" /> {/* Top of top tier */}

              {/* Top Tier Icing Drips */}
              <path d="M85 150 C85 160 95 170 105 160 C115 150 125 175 135 160 C145 145 155 170 165 160 C175 150 185 175 195 160 C205 145 215 165 225 160 C230 157 235 150 235 150" stroke="#FFF0F5" strokeWidth="6" strokeLinecap="round" fill="none" />

              {/* Decorations / Sprinkles */}
              <circle cx="100" cy="270" r="3" fill="#F472B6" />
              <circle cx="130" cy="280" r="3" fill="#60A5FA" />
              <circle cx="180" cy="260" r="3" fill="#FBBF24" />
              <circle cx="220" cy="290" r="3" fill="#34D399" />
              <circle cx="120" cy="180" r="2" fill="#F472B6" />
              <circle cx="200" cy="190" r="2" fill="#60A5FA" />
              
              {/* Candle Stick (Dimmed with the cake) */}
              <rect x="156" y="80" width="8" height="70" rx="2" fill="url(#candleGradient)" />
              <path d="M156 85 L164 82" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <path d="M156 95 L164 92" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <path d="M156 105 L164 102" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
              <path d="M156 115 L164 112" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          </g>

          {/* Wick - Always visible */}
          <line x1="160" y1="80" x2="160" y2="75" stroke="#475569" strokeWidth="2" opacity={isCandleBlown ? 1 : 0.5} />

          {/* Flame & Smoke */}
          <defs>
            <linearGradient id="cakeGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FBCFE8" /> {/* Pink 200 */}
              <stop offset="100%" stopColor="#F472B6" /> {/* Pink 400 */}
            </linearGradient>
            <linearGradient id="candleGradient" x1="0" y1="0" x2="1" y2="0">
               <stop offset="0%" stopColor="#60A5FA" />
               <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
            <filter id="flameBlur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="2" />
            </filter>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
               <feGaussianBlur stdDeviation="10" result="coloredBlur"/>
               <feMerge>
                   <feMergeNode in="coloredBlur"/>
                   <feMergeNode in="SourceGraphic"/>
               </feMerge>
            </filter>
            
            {/* Continuous Smoke Animation Styles */}
            <style>
              {`
                @keyframes continuousSmoke {
                  0% { transform: translateY(0) scale(1); opacity: 0.6; }
                  50% { transform: translateY(-15px) scale(1.1); opacity: 0.3; }
                  100% { transform: translateY(0) scale(1); opacity: 0.6; }
                }
                .continuous-smoke {
                  animation: continuousSmoke 3s ease-in-out infinite;
                }
              `}
            </style>
          </defs>

          {/* Animated Flame - Only visible when NOT blown */}
          {!isCandleBlown && (
            <g className="flame-anim origin-[160px_75px]">
               {/* Outer Glow - Extra bright in dark mode */}
               <ellipse cx="160" cy="55" rx="15" ry="25" fill="#F59E0B" filter="url(#flameBlur)" opacity="0.4" />
               <ellipse cx="160" cy="55" rx="10" ry="18" fill="#F59E0B" filter="url(#flameBlur)" opacity="0.6" />
               {/* Inner Flame */}
               <path d="M160 75 C155 75 152 65 152 55 C152 40 160 30 160 30 C160 30 168 40 168 55 C168 65 165 75 160 75 Z" fill="#FCD34D" filter="url(#glow)" />
               {/* Core */}
               <path d="M160 73 C158 73 157 68 157 65 C157 60 160 55 160 55 C160 55 163 60 163 65 C163 68 162 73 160 73 Z" fill="#FFFFFF" />
            </g>
          )}

          {/* Persistent Smoke Animation */}
          {smoke && (
             <g className="continuous-smoke origin-[160px_75px]">
                 <path d="M160 70 Q150 60 160 50 T160 30" stroke="#CBD5E1" strokeWidth="2" fill="none" />
                 <path d="M162 72 Q172 62 162 52 T162 32" stroke="#94A3B8" strokeWidth="1.5" fill="none" opacity="0.8" />
             </g>
          )}
        </svg>

        {/* Ambient Light Reflection on Table */}
        {!isCandleBlown && (
          <div className="absolute top-[280px] left-1/2 -translate-x-1/2 w-64 h-24 bg-orange-500/10 blur-[50px] rounded-full animate-pulse z-[-1]" />
        )}
      </div>
    </div>
    </>
  );
};