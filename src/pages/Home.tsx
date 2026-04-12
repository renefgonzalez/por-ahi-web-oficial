import { motion } from "motion/react";
import { ShoppingBag, Search, Menu, Lock, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { formatPrice } from "../lib/utils";
import Footer from "../components/Footer";

export default function Home() {
  const navigate = useNavigate();
  const { products } = useProducts();
  
  // Force selection of specific featured products (IDs: 1, 3, 5, 11)
  const featuredIds = [1, 3, 5, 11];
  const featuredProducts = products.filter(p => featuredIds.includes(p.id))
    .sort((a, b) => featuredIds.indexOf(a.id) - featuredIds.indexOf(b.id));

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* HERO SECTION */}
      <section className="relative h-[80vh] flex items-center justify-center mt-[80px]">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1974&auto=format&fit=crop"
            alt="Oversize Black Hoodie Urban"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          {/* 50% Black Overlay */}
          <div className="absolute inset-0 bg-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-4xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h2 className="text-4xl md:text-7xl font-serif italic font-light tracking-tight mb-12 leading-tight">
              REDEFINIENDO LA <br />
              VANGUARDIA TÉCNICA <br />
              <span className="not-italic font-sans font-light text-white/60 text-2xl md:text-4xl tracking-[0.2em] uppercase">desde 2024</span>
            </h2>
            
            <Link to="/catalog">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: "#00B8CC" }}
                whileTap={{ scale: 0.98 }}
                className="px-12 py-5 bg-luxury-cyan text-black font-bold text-xs tracking-[0.3em] uppercase rounded-full shadow-xl"
              >
                EXPLORA NOVEDADES
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT SECTION */}
      <section className="py-24 px-8 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h3 className="text-xs uppercase tracking-[0.5em] text-white/40">Selección Destacada</h3>
            <Link to="/catalog" className="text-[10px] uppercase tracking-[0.2em] border-b border-white/20 pb-1 hover:border-luxury-cyan transition-colors">Ver Todo</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10">
            {featuredProducts.map((product) => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -10 }}
                className={`bg-white rounded-[20px] overflow-hidden group cursor-pointer border-2 ${
                  product.specialLabel === "Destacado" ? "border-luxury-cyan shadow-[0_0_30px_rgba(0,229,255,0.2)]" : "border-transparent"
                }`}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <div className="aspect-[4/5] relative overflow-hidden">
                  {product.specialLabel && product.specialLabel !== "Ninguna" && (
                    <div className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest shadow-lg ${
                      product.specialLabel === "Rebajas" ? "bg-red-500 text-white" : "bg-luxury-cyan text-black"
                    }`}>
                      {product.specialLabel}
                    </div>
                  )}
                  <img 
                    src={product.frenteImage || product.reversaImage} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="p-8 text-black">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-2 line-clamp-1">{product.name}</h4>
                  <p className="text-lg font-light">{formatPrice(product.price)}</p>
                  <button className="mt-6 w-full py-3 border border-black/10 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-black hover:text-white transition-colors">
                    VER DETALLE
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}


