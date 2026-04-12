import React, { useState } from "react";
import { ShoppingBag, Search, Menu, X, ChevronRight, Lock } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";

export default function Navbar() {
  const { setIsCartOpen, totalItems } = useCart();
  const { categories, searchQuery, setSearchQuery } = useProducts();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const currentCategory = searchParams.get("category");

  const handleCategoryClick = (cat: string) => {
    setIsMenuOpen(false);
    navigate(`/catalog?category=${cat}`);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (window.location.pathname !== "/catalog") {
      navigate("/catalog");
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-black border-b border-white/5">
        <div className="flex-1">
          <Link to="/" className="flex flex-col items-start leading-[0.75] group font-logo">
            <span className="text-2xl font-black text-white group-hover:text-luxury-cyan transition-colors">POR</span>
            <span className="text-2xl font-black text-white group-hover:text-luxury-cyan transition-colors">AHÍ...</span>
          </Link>
        </div>

        <div className="hidden md:flex flex-1 justify-center items-center gap-12 text-[10px] uppercase tracking-[0.4em] font-semibold text-white/70">
          {categories.map((cat) => {
            const isActive = currentCategory?.toUpperCase() === cat.toUpperCase();
            return (
              <Link 
                key={cat} 
                to={`/catalog?category=${cat}`} 
                className={`relative transition-colors py-1 ${isActive ? 'text-white' : 'hover:text-white'}`}
              >
                {cat}
                {isActive && (
                  <motion.div 
                    layoutId="activeCategory"
                    className="absolute -bottom-1 left-0 right-0 h-[2px] bg-luxury-cyan"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          {categories.length === 0 && (
            <Link to="/catalog" className="hover:text-white transition-colors">Catálogo</Link>
          )}
        </div>

        <div className="flex-1 flex justify-end items-center gap-8 text-white">
          <div className="relative flex items-center">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="BUSCAR..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="bg-transparent border-b border-white/20 text-[10px] uppercase tracking-widest py-1 px-2 w-full focus:outline-none focus:border-luxury-cyan transition-colors"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <Search 
              className={`w-5 h-5 cursor-pointer hover:text-luxury-cyan transition-colors ${isSearchOpen ? 'text-luxury-cyan' : ''}`} 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            />
          </div>
          <div 
            onClick={() => setIsCartOpen(true)}
            className="relative cursor-pointer group"
          >
            <ShoppingBag className="w-5 h-5 group-hover:text-luxury-cyan transition-colors" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-luxury-cyan text-black text-[8px] font-black w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_10px_rgba(0,229,255,0.5)]">
                {totalItems}
              </span>
            )}
          </div>
          <Menu 
            className="md:hidden w-6 h-6 cursor-pointer hover:text-luxury-cyan transition-colors" 
            onClick={() => setIsMenuOpen(true)}
          />
        </div>
      </nav>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* OVERLAY */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
            />

            {/* DRAWER */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-black border-r border-white/10 z-[61] p-8 sm:p-12 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12 sm:mb-20">
                <h2 className="text-xl font-black italic tracking-tighter">MENÚ</h2>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
                >
                  <X className="w-6 h-6 text-luxury-cyan" />
                </button>
              </div>

              <div className="flex-grow space-y-10">
                <p className="text-[10px] uppercase tracking-[0.5em] text-white/20 font-bold mb-4">Categorías</p>
                <div className="space-y-6">
                  {categories.map((cat) => {
                    const isActive = currentCategory?.toUpperCase() === cat.toUpperCase();
                    return (
                      <button
                        key={cat}
                        onClick={() => handleCategoryClick(cat)}
                        className="w-full flex items-center justify-between group"
                      >
                        <span className={`text-2xl font-black italic uppercase tracking-tighter transition-colors ${isActive ? 'text-luxury-cyan' : 'group-hover:text-luxury-cyan'}`}>
                          {cat}
                        </span>
                        <ChevronRight className={`w-5 h-5 transition-colors ${isActive ? 'text-luxury-cyan' : 'text-white/10 group-hover:text-luxury-cyan'}`} />
                      </button>
                    );
                  })}
                  
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      navigate("/catalog");
                    }}
                    className="w-full flex items-center justify-between group"
                  >
                    <span className="text-3xl font-black italic uppercase tracking-tighter group-hover:text-luxury-cyan transition-colors">
                      Catálogo
                    </span>
                    <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-luxury-cyan transition-colors" />
                  </button>
                </div>
              </div>

              <div className="pt-12 border-t border-white/5 space-y-6">
                <Link 
                  to="/admin" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-white/40 hover:text-luxury-cyan transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                    <Lock className="w-4 h-4" />
                  </div>
                  Panel de Control
                </Link>
                <p className="text-[8px] uppercase tracking-[0.4em] text-white/10">
                  © 2024 POR AHÍ • LUXURY STREETWEAR
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

