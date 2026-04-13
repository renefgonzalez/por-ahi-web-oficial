import React, { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function WhatsAppButton() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show when scrolling up or at the top
      if (currentScrollY < 10 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        // Hide when scrolling down after some threshold
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hola, me gustaría saber más sobre los diseños de Por Ahí...");
    const phoneNumber = "525551527473";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none"
        >
          {/* Tooltip/Label */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl mr-2"
          >
            <p className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] text-luxury-cyan">
              ¿Dudas? Pregúntanos
            </p>
          </motion.div>

          {/* Button */}
          <button
            onClick={handleWhatsAppClick}
            className="pointer-events-auto w-14 h-14 bg-black border border-white/10 rounded-full flex items-center justify-center text-white hover:bg-luxury-cyan hover:text-black hover:border-luxury-cyan transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.5)] group overflow-hidden"
          >
            <div className="relative z-10">
              <MessageCircle className="w-6 h-6 transition-transform group-hover:scale-110" />
            </div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-luxury-cyan/20 opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
