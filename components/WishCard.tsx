import React from 'react';
import { motion } from 'framer-motion';

const WISHES = [
  "May your day be filled with endless joy and cake! 🍰",
  "Another year older, another year wiser! (Maybe?) 😉",
  "Wishing you sunshine, smiles, and laughter! ☀️",
  "May all your dreams come true this year! ✨",
  "You're not aging, you're leveling up! 🎮",
  "Eat the cake, buy the shoes, take the trip! ✈️",
  "Hoping your birthday is as awesome as you are! 🌟",
  "Cheers to you and another trip around the sun! 🥂"
];

interface WishCardProps {
  onClose: () => void;
}

export const WishCard: React.FC<WishCardProps> = ({ onClose }) => {
  const randomWish = WISHES[Math.floor(Math.random() * WISHES.length)];

  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
      animate={{ scale: 1, opacity: 1, rotate: 0 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        className="bg-gradient-to-br from-violet-600 to-indigo-600 p-[2px] rounded-2xl shadow-[0_0_50px_rgba(139,92,246,0.5)] max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
        whileHover={{ scale: 1.02 }}
      >
        <div className="bg-slate-900 rounded-2xl p-8 text-center border border-white/10 relative overflow-hidden">
            {/* Background shimmer */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            
            <h3 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 mb-4">
                A Wish For You
            </h3>
            <p className="text-lg text-white/90 leading-relaxed font-medium">
                {randomWish}
            </p>
            <div className="mt-6">
                <button 
                    onClick={onClose}
                    className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm font-semibold transition-colors border border-white/10"
                >
                    Keep it! ❤️
                </button>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};