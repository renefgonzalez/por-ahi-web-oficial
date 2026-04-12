import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ShoppingBag, Heart, Share2 } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../lib/utils";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";

export default function ProductDetail() {
  const { id } = useParams();
  const { products: inventory } = useProducts();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const product = inventory.find((p) => p.id === Number(id));
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold mb-4 uppercase tracking-widest">Producto no encontrado</h2>
        <Link to="/catalog" className="text-luxury-cyan border-b border-luxury-cyan/20 pb-1 uppercase text-xs tracking-widest">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  // Related Products Logic
  const relatedProducts = inventory
    .filter((p) => p.category === product.category && p.id !== product.id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3);

  const images = [product.frenteImage, product.reversaImage].filter((img) => img && img.trim() !== "") as string[];
  const sizes = ["S", "M", "L", "XL"];

  const handleAddToCart = () => {
    if (product.hasSizes && !selectedSize) {
      alert("Por favor, selecciona una talla antes de añadir al carrito.");
      return;
    }
    addToCart(product, product.hasSizes ? selectedSize! : "Única");
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-[80px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-8">
        {/* BREADCRUMBS / BACK BUTTON */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <Link 
            to="/catalog" 
            className="inline-flex items-center gap-3 px-8 py-4 sm:px-12 sm:py-5 bg-luxury-cyan border-2 border-luxury-cyan text-black text-[10px] sm:text-[12px] font-black uppercase tracking-[0.4em] rounded-full hover:bg-black hover:text-white transition-all duration-500 group shadow-[0_0_20px_rgba(0,229,255,0.2)]"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-2 transition-transform" />
            Volver al catálogo
          </Link>
        </div>

        {/* PRODUCT AREA */}
        <div className="bg-white rounded-[40px] overflow-hidden flex flex-col md:flex-row min-h-0 md:min-h-[500px] max-w-6xl mx-auto shadow-2xl mb-16">
          {/* LEFT COLUMN: GALLERY */}
          <div className="md:w-1/2 bg-gray-100 flex flex-col">
            <div className="relative flex-grow overflow-hidden group aspect-square md:aspect-auto min-h-[300px] md:min-h-[400px] lg:min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  src={images[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full max-h-[45vh] md:max-h-[500px] object-contain md:object-cover cursor-grab active:cursor-grabbing"
                  referrerPolicy="no-referrer"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    const swipeThreshold = 50;
                    if (info.offset.x > swipeThreshold && activeImageIndex > 0) {
                      setActiveImageIndex(activeImageIndex - 1);
                    } else if (info.offset.x < -swipeThreshold && activeImageIndex < images.length - 1) {
                      setActiveImageIndex(activeImageIndex + 1);
                    }
                  }}
                />
              </AnimatePresence>
              
              {/* Theme Badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="bg-black text-white text-[9px] font-bold uppercase tracking-[0.3em] px-3 py-1.5 rounded-full shadow-xl">
                  {product.theme}
                </span>
              </div>

              {/* Mobile Swipe Indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:hidden">
                  {images.map((_, idx) => (
                    <div 
                      key={idx} 
                      className={`w-1 h-1 rounded-full transition-all ${activeImageIndex === idx ? "bg-luxury-cyan w-3" : "bg-black/20"}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* THUMBNAILS */}
            {images.length > 1 && (
              <div className="p-4 bg-white flex justify-center gap-3 overflow-x-auto no-scrollbar border-t border-black/5">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                      activeImageIndex === index 
                        ? "border-luxury-cyan scale-105 shadow-md" 
                        : "border-transparent opacity-40 hover:opacity-100"
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${product.name} thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: INFO */}
          <div className="md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col text-black">
            <div className="mb-auto">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-[9px] uppercase tracking-[0.4em] text-black/40 font-bold mb-1">
                    {product.category} / {product.type}
                  </p>
                  <h1 className="text-3xl lg:text-4xl font-black italic tracking-tighter uppercase leading-none">
                    {product.name}
                  </h1>
                </div>
                <div className="flex gap-2">
                  <button className="p-2.5 rounded-full border border-black/5 hover:bg-black hover:text-white transition-all">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="p-2.5 rounded-full border border-black/5 hover:bg-black hover:text-white transition-all">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-2xl lg:text-3xl font-light mb-6">{formatPrice(product.price)}</p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-3">Descripción</h3>
                  <p className="text-xs lg:text-sm text-black/60 leading-relaxed max-w-md">
                    {product.description}
                  </p>
                </div>

                {/* SIZE SELECTOR */}
                <div>
                  <h3 className="text-[9px] uppercase tracking-[0.3em] font-bold mb-3">
                    {product.hasSizes ? "Seleccionar Talla" : "Talla"}
                  </h3>
                  {product.hasSizes ? (
                    <div className="flex gap-2">
                      {sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`w-11 h-11 lg:w-12 lg:h-12 border flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
                            selectedSize === size
                              ? "bg-luxury-cyan border-luxury-cyan text-black"
                              : "border-black/10 hover:border-black text-black/40 hover:text-black"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="inline-block px-6 py-3 bg-black/5 border border-black/10 rounded-xl">
                      <p className="text-[10px] font-black italic uppercase tracking-[0.3em] text-black">Talla Única</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-10">
              <button 
                onClick={handleAddToCart}
                className="w-full py-4 lg:py-5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-xl hover:bg-luxury-cyan hover:text-black transition-all duration-500 flex items-center justify-center gap-3 group"
              >
                <ShoppingBag className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                Añadir al carrito
              </button>
              <p className="text-[8px] text-center text-black/30 mt-4 uppercase tracking-widest">
                Envío gratuito en pedidos superiores a $300 • Devoluciones en 30 días
              </p>
            </div>
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="max-w-6xl mx-auto mt-24">
            <h3 className="text-sm font-black italic uppercase tracking-tighter mb-10 text-center">También te puede gustar...</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <div 
                  key={p.id} 
                  className="bg-white/5 rounded-[20px] p-4 cursor-pointer hover:bg-white/10 transition-all"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <img src={p.frenteImage} alt={p.name} className="w-full aspect-square object-cover rounded-xl mb-4" referrerPolicy="no-referrer" />
                  <h4 className="text-[10px] font-bold uppercase tracking-wider">{p.name}</h4>
                  <p className="text-xs text-luxury-cyan mt-1">{formatPrice(p.price)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}


