import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Mic, MicOff } from 'lucide-react';
import { Cake } from './components/Cake';
import { FloatingBalloons } from './components/FloatingBalloons';
import { Fireworks } from './components/Fireworks';
import { BlowDetector } from './utils/microphone';


const WISHES = [
  "Happy Birthday! 🎂",
  "Have the best day! ✨",
  "So happy for you! 💖",
  "!Happy Birthday! 🎂
 "May your day be filled with smiles,          laughter,and everything you love.🥳",
  "Stay awesome! 😎",
  "Enjoy your day! 🍰",
  "Make a wish! 🌟",
  "Allah bless u",
  "You glow differently! ✨",
 
];

interface FloatingWish {
    id: number;
    text: string;
    x: number;
    y: number;
    rotation: number;
}

function App() {
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [isCelebrationActive, setIsCelebrationActive] = useState(false); // New state for the 20s show
  const [showFireworks, setShowFireworks] = useState(false);
  const [micAllowed, setMicAllowed] = useState<boolean | null>(null);
  const [floatingWishes, setFloatingWishes] = useState<FloatingWish[]>([]);
  const commentSoundSrc = `${import.meta.env.BASE_URL}assets/instagram.mp3`;
  
  const blowDetector = useRef(new BlowDetector());
  const containerRef = useRef<HTMLDivElement>(null);
  const commentSoundRef = useRef<HTMLAudioElement | null>(null);
  const nextWishIndexRef = useRef(0);
  const getNextWishText = () => {
    const text = WISHES[nextWishIndexRef.current];
    nextWishIndexRef.current = (nextWishIndexRef.current + 1) % WISHES.length;
    return text;
  };

  // Initialize Microphone & Audio
  useEffect(() => {
    const initMic = async () => {
      try {
        await blowDetector.current.start(() => {
          handleAction();
        });
        setMicAllowed(true);
      } catch (e) {
        setMicAllowed(false);
      }
    };
    initMic();
    commentSoundRef.current = new Audio(commentSoundSrc);
    commentSoundRef.current.preload = 'auto';
    

    return () => {
      blowDetector.current.stop();
    };
  }, [commentSoundSrc]);

  // Main interaction handler
  const handleAction = () => {
    setIsCandleBlown(prev => {
        if (prev) return prev; // Already blown
        
        setIsCelebrationActive(true); // Start the show
        setShowFireworks(true);
        
        // Stop the celebration (balloons/fireworks) after 24 seconds
        setTimeout(() => {
            setIsCelebrationActive(false);
            setShowFireworks(false);
        }, 24000);
        
        return true;
    });
  };

  const handleCakeClick = (e: React.MouseEvent) => {
    if (!isCandleBlown) {
        // If not blown, click acts as blow
        handleAction();
    } else if (!isCelebrationActive) {
        // Allow multiple wishes simultaneously after celebration
        // Only allow wishes AFTER the 20s celebration is over
        
        // Calculate position AROUND the cake
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        // Random angle 
        const angle = Math.random() * Math.PI * 2;
        // Radius between 160px and 280px (Around the cake)
        const radius = 180 + Math.random() * 100; 
        
        let x = centerX + Math.cos(angle) * radius;
        let y = centerY + Math.sin(angle) * radius;

        // Clamp to screen edges so it doesn't go off-screen
        const padding = 120; 
        x = Math.max(padding, Math.min(window.innerWidth - padding, x));
        y = Math.max(padding, Math.min(window.innerHeight - padding, y));
        
        const newWish: FloatingWish = {
            id: Date.now(),
            text: getNextWishText(),
            x, 
            y,
            rotation: (Math.random() - 0.5) * 10
        };

        setFloatingWishes(prev => [...prev, newWish]);
        
        // Play Pop Sound
        if (commentSoundRef.current) {
            commentSoundRef.current.currentTime = 0;
            commentSoundRef.current.play().catch(() => {});
        }

        // Remove this specific wish after 4 seconds
        setTimeout(() => {
            setFloatingWishes(prev => prev.filter(w => w.id !== newWish.id));
        }, 4000);
    }
  };

  // Cursor sparkles effect
  useEffect(() => {
    if(!isCandleBlown) return;

    const handleMouseMove = (e: MouseEvent) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'fixed w-3 h-3 bg-yellow-300 rounded-full pointer-events-none z-50 mix-blend-screen';
        sparkle.style.left = `${e.clientX}px`;
        sparkle.style.top = `${e.clientY}px`;
        sparkle.style.boxShadow = '0 0 10px rgba(253, 224, 71, 0.8)'; // Glow effect
        
        const xDrift = (Math.random() - 0.5) * 60;
        const yDrift = 30 + Math.random() * 30;

        const animation = sparkle.animate([
            { transform: 'scale(1) translate(0,0)', opacity: 1 },
            { transform: `scale(0) translate(${xDrift}px, ${yDrift}px)`, opacity: 0 }
        ], { duration: 600, easing: 'ease-out' });
        
        animation.onfinish = () => sparkle.remove();
        document.body.appendChild(sparkle);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isCandleBlown]);

  return (
    <div 
        ref={containerRef}
        className="min-h-screen bg-black text-white overflow-hidden relative selection:bg-rose-500/30"
    >

      {/* Dynamic Background */}
      <div className={`absolute inset-0 transition-opacity duration-2000 pointer-events-none ${isCandleBlown ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-black"></div>
      </div>

      {/* Balloons: Only generate new ones during celebration, but let existing ones float away */}
      {isCandleBlown && <FloatingBalloons generating={isCelebrationActive} />}

      {/* Fireworks: Background layer */}
      {showFireworks && <div className="absolute inset-0 z-0 pointer-events-none"><Fireworks /></div>}

      {/* Main UI Container */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 pointer-events-none"
        layout
      >
        {/* Header */}
        <header className={`absolute top-10 md:top-20 text-center w-full z-10 pointer-events-auto transition-all duration-1000 ${isCandleBlown ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <motion.div>
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-6">
                    <Sparkles className="w-3 h-3 text-yellow-300 mr-2" />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70">Let's Celebrate</span>
                </div>
            </motion.div>
            
            <h1 className="font-script text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-br from-white via-rose-100 to-indigo-100 drop-shadow-[0_4px_10px_rgba(255,255,255,0.3)] pb-2 px-4 leading-tight">
      Happy Birthday, 💐BASRIYA💐(BASHU)!
            </h1>
        </header>

        {/* Main Interaction Area (Cake) */}
        <div className="flex-1 flex flex-col items-center justify-center w-full pointer-events-auto">
            <Cake 
                isCandleBlown={isCandleBlown} 
                onInteract={handleCakeClick}
                micPermissionDenied={micAllowed === false}
            />
            {/* Hint for after celebration */}
            <div className={`mt-12 transition-opacity duration-1000 ${!isCelebrationActive && isCandleBlown ? "opacity-60" : "opacity-0"}`}>
                 <p className="text-white/50 text-sm tracking-widest uppercase font-light animate-pulse">Click the cake for a surprise</p>
            </div>
        </div>

        {/* Footer Actions */}
        <footer className={`absolute bottom-10 md:bottom-20 w-full flex flex-col items-center space-y-6 pointer-events-auto transition-opacity duration-1000 ${isCandleBlown ? 'opacity-100' : 'opacity-0'}`}>
            <div className="text-center">
                <p className="font-serif italic text-white/40 text-sm md:text-base">
                    "Made just for you ❤️"
                </p>
                {/* Debug / Mic Status */}
                <div className="mt-2 text-white/10 flex justify-center">
                    {micAllowed ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
                </div>
            </div>
        </footer>
      </motion.div>

      {/* Render Floating Wishes (Instagram Style Bubbles) */}
      <AnimatePresence>
        {floatingWishes.map((wish) => {
            const isTopHalf = wish.y < window.innerHeight / 2;
            
            return (
            <motion.div
                key={wish.id}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="fixed pointer-events-none z-50"
                style={{ left: wish.x, top: wish.y }}
            >
                <div className="relative group -translate-x-1/2 -translate-y-1/2">
                    {/* Bubble */}
                    <div className="relative bg-white text-gray-900 px-5 py-3 rounded-2xl shadow-xl max-w-[220px] flex items-center justify-center">
                        <p className="text-base font-medium font-sans whitespace-nowrap">
                            {wish.text}
                        </p>
                        
                        {/* Tail pointing roughly towards center (if top half, tail bottom, else tail top) */}
                        <div className={`absolute w-3 h-3 bg-white rotate-45 left-1/2 -translate-x-1/2 ${
                            isTopHalf ? '-bottom-1.5' : '-top-1.5'
                        }`}></div>
                    </div>
                </div>
            </motion.div>
        )})}
      </AnimatePresence>
    </div>
  );
}

export default App;
