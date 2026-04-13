import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, CheckCircle2 } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/utils";

export default function AddToCartModal() {
  const { isAddModalOpen, setIsAddModalOpen, lastAddedItem, setIsCartOpen } = useCart();
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(4000); // 4 seconds

  const duration = 4000;

  useEffect(() => {
    if (isAddModalOpen && !isPaused) {
      const step = 10; // ms
      startTimeRef.current = Date.now();
      
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current;
        const newRemaining = remainingTimeRef.current - elapsed;
        
        if (newRemaining <= 0) {
          clearInterval(timerRef.current!);
          setIsAddModalOpen(false);
          remainingTimeRef.current = duration;
          setProgress(100);
        } else {
          setProgress((newRemaining / duration) * 100);
        }
      }, step);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAddModalOpen, isPaused, setIsAddModalOpen]);

  // Reset logic when modal opens
  useEffect(() => {
    if (isAddModalOpen) {
      setProgress(100);
      remainingTimeRef.current = duration;
      setIsPaused(false);
    }
  }, [isAddModalOpen, lastAddedItem]);

  const handleMouseEnter = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      const elapsed = Date.now() - startTimeRef.current;
      remainingTimeRef.current -= elapsed;
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  if (!lastAddedItem) return null;

  return (
    <AnimatePresence>
      {isAddModalOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl pointer-events-auto relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              {/* Header */}
              <div className="bg-luxury-cyan p-6 flex items-center justify-between text-black">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6" />
                  <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">¡Añadido con éxito!</h2>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="hover:rotate-90 transition-transform"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 text-black">
                <div className="flex gap-4 mb-8">
                  <div className="w-24 aspect-[4/5] bg-gray-100 rounded-2xl overflow-hidden border border-black/5 shadow-inner flex-shrink-0">
                    <img 
                      src={lastAddedItem.frenteImage || lastAddedItem.reversaImage || lastAddedItem.image} 
                      alt={lastAddedItem.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <h3 className="text-sm font-black italic uppercase tracking-tighter mb-1 leading-tight">
                      {lastAddedItem.name}
                    </h3>
                    <p className="text-[9px] uppercase tracking-widest text-black/40 mb-3 font-bold">
                      Talla: {lastAddedItem.size}
                    </p>
                    <p className="text-xl font-light text-black">
                      {formatPrice(lastAddedItem.price)}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsCartOpen(true);
                    }}
                    className="w-full py-4 bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-luxury-cyan hover:text-black transition-all duration-300 flex items-center justify-center gap-3"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Ver mi Carrito
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(false)}
                    className="w-full py-4 bg-transparent border border-black/10 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-xl hover:bg-black/5 transition-all duration-300"
                  >
                    Seguir Comprando
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
                <motion.div 
                  className="h-full bg-luxury-cyan"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
