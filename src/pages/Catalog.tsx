import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShoppingBag, Search, Menu, ChevronDown, Lock, ChevronLeft, X } from "lucide-react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../lib/utils";
import Footer from "../components/Footer";

export default function Catalog() {
  const { products: inventory, themes, categories: productCategories, searchQuery, setSearchQuery } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCategory = searchParams.get("category") || "ALL";

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedTheme, setSelectedTheme] = useState("ALL");
  const [sortBy, setSortBy] = useState("NEWEST");

  // Dynamic filter options
  const THEMES = [
    { label: "Todas las colecciones", value: "ALL" },
    ...themes.map(theme => ({ label: theme, value: theme }))
  ];

  const SORT_OPTIONS = [
    { label: "Novedades", value: "NEWEST" },
    { label: "Precio: Menor a Mayor", value: "PRICE_LOW" },
    { label: "Precio: Mayor a Menor", value: "PRICE_HIGH" },
  ];

  // Sync state with URL parameter if it changes (e.g. clicking navbar links while on catalog)
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const filteredProducts = inventory.filter((product) => {
    const searchLower = searchQuery.toLowerCase().trim();
    const nameMatch = product.name.toLowerCase().includes(searchLower);
    const categoryMatchSearch = product.category.toLowerCase().includes(searchLower);
    const descriptionMatch = product.description.toLowerCase().includes(searchLower);
    const themeMatchSearch = product.theme.toLowerCase().includes(searchLower);
    
    const matchesSearch = !searchQuery || nameMatch || categoryMatchSearch || descriptionMatch || themeMatchSearch;

    const categoryMatch = selectedCategory === "ALL" 
      || (selectedCategory === "REBAJAS_FILTER" ? product.specialLabel === "Rebajas" : product.category.toUpperCase().trim() === selectedCategory.toUpperCase().trim());
    const themeMatch = selectedTheme === "ALL" || product.theme.toUpperCase().trim() === selectedTheme.toUpperCase().trim();
    
    return matchesSearch && categoryMatch && themeMatch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "PRICE_LOW") return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === "PRICE_HIGH") return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === "NEWEST") return b.id - a.id;
    return 0;
  });

  const getDynamicTitle = () => {
    const catLabel = selectedCategory === "ALL" ? "Todas las categorías" : selectedCategory;
    const themeLabel = selectedTheme === "ALL" ? "Todas las colecciones" : selectedTheme;
    
    return `Viendo: ${catLabel} > ${themeLabel}`;
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* MAIN CONTENT */}
      <main className="pt-[140px] pb-24 px-8 max-w-7xl mx-auto">
        {/* BACK BUTTON */}
        <div className="flex justify-center mb-16">
          <Link 
            to="/" 
            className="inline-flex items-center gap-4 px-12 py-5 bg-luxury-cyan border-2 border-luxury-cyan text-black text-[12px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-black hover:text-white transition-all duration-500 group shadow-[0_0_30px_rgba(0,229,255,0.3)]"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-2 transition-transform" />
            Volver al Inicio
          </Link>
        </div>

        {/* DYNAMIC TITLE */}
        <div className="mb-8">
          <motion.h2 
            key={getDynamicTitle()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold"
          >
            {getDynamicTitle()}
          </motion.h2>
        </div>

        {/* QUICK FILTERS (THEMES) */}
        <div className="mb-12 flex flex-wrap gap-6 border-b border-white/5 pb-4">
          <button
            onClick={() => { setSelectedTheme("ALL"); }}
            className={`relative px-2 py-2 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
              selectedTheme === "ALL" 
                ? "text-white" 
                : "text-white/40 hover:text-white"
            }`}
          >
            TODOS
            {selectedTheme === "ALL" && (
              <motion.div 
                layoutId="activeTheme"
                className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-luxury-cyan"
              />
            )}
          </button>
          {themes.map(theme => (
            <button
              key={theme}
              onClick={() => { setSelectedTheme(theme); }}
              className={`relative px-2 py-2 text-[9px] font-bold uppercase tracking-widest transition-all duration-300 ${
                selectedTheme === theme 
                  ? "text-white" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              {theme}
              {selectedTheme === theme && (
                <motion.div 
                  layoutId="activeTheme"
                  className="absolute -bottom-[17px] left-0 right-0 h-[2px] bg-luxury-cyan"
                />
              )}
            </button>
          ))}
        </div>

        {/* FILTER BAR (SORT ONLY) */}
        <div className="mb-16 flex flex-wrap gap-4 items-center justify-between">
          <div className="flex items-center gap-4">
            {selectedCategory !== "ALL" && (
              <div className="px-4 py-2 bg-luxury-cyan/10 border border-luxury-cyan/20 rounded-lg flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-luxury-cyan">{selectedCategory}</span>
                <button 
                  onClick={() => { setSelectedCategory("ALL"); setSearchParams({}); }}
                  className="text-luxury-cyan hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="relative group min-w-[200px]">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-black text-white border border-white/10 px-6 py-4 rounded-xl text-[10px] uppercase tracking-[0.2em] font-bold appearance-none cursor-pointer hover:border-white/30 transition-all focus:outline-none focus:border-luxury-cyan"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-black py-4">
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none group-hover:text-white transition-colors" />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-10">
          <AnimatePresence mode="popLayout">
            {sortedProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-[20px] overflow-hidden group flex flex-col cursor-pointer"
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  {product.specialLabel && product.specialLabel !== "Ninguna" && (
                    <div className={`absolute top-2 left-2 md:top-4 md:left-4 z-10 px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-widest shadow-lg ${
                      product.specialLabel === "Rebajas" ? "bg-red-500 text-white" : "bg-luxury-cyan text-black"
                    }`}>
                      {product.specialLabel}
                    </div>
                  )}
                  <img
                    src={product.imageType === "SÓLO REVERSA" && !product.frenteImage ? product.reversaImage : product.frenteImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  {product.imageType === "SÓLO REVERSA" && (
                    <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 z-10 px-2 py-0.5 md:px-3 md:py-1 bg-black/80 backdrop-blur-md border border-white/10 rounded-full text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-white/80">
                      Diseño en espalda
                    </div>
                  )}
                </div>
                <div className="p-3 md:p-6 text-black flex flex-col flex-grow">
                  <div className="mb-3 md:mb-4">
                    <h4 className="text-[9px] md:text-xs font-bold uppercase tracking-wider mb-1 line-clamp-1">{product.name}</h4>
                    <p className="text-[8px] md:text-[10px] text-black/40 uppercase tracking-widest">{product.theme}</p>
                  </div>
                  <div className="mt-auto flex flex-col gap-3 md:gap-4">
                    <p className="text-sm md:text-lg font-light">{formatPrice(product.price)}</p>
                    <button className="w-full py-2 md:py-3 bg-black text-white rounded-xl text-[8px] md:text-[10px] uppercase tracking-widest font-bold hover:bg-luxury-cyan hover:text-black transition-all duration-300">
                      VER DETALLE
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
              <Search className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-black italic tracking-tighter mb-4 uppercase">Sin resultados</h3>
            <p className="text-white/40 uppercase tracking-[0.2em] text-[10px] leading-relaxed mb-10">
              No encontramos diseños con ese nombre, ¡pero podemos personalizarlos para ti!
            </p>
            <div className="flex flex-col gap-4">
              <a 
                href="https://wa.me/525630300021?text=Hola!%20No%20encontré%20el%20diseño%20que%20buscaba,%20¿pueden%20hacer%20uno%20personalizado?"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-luxury-cyan text-black rounded-xl text-[10px] uppercase tracking-widest font-black hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,229,255,0.2)]"
              >
                Personalizar en WhatsApp
              </a>
              <button 
                onClick={() => { 
                  setSelectedCategory("ALL"); 
                  setSelectedTheme("ALL"); 
                  setSearchQuery("");
                  setSearchParams({});
                }}
                className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white transition-colors"
              >
                Limpiar todos los filtros
              </button>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER (Consistent with Home) */}
      <Footer />
    </div>
  );
}

