import { Instagram, Facebook, Lock } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* TOP: LOGO */}
        <div className="flex justify-start mb-20">
          <Link to="/" className="flex flex-col items-start leading-[0.75] group font-logo">
            <span className="text-5xl font-black text-white group-hover:text-luxury-cyan transition-colors">POR</span>
            <span className="text-5xl font-black text-white group-hover:text-luxury-cyan transition-colors">AHÍ...</span>
          </Link>
        </div>

        {/* GRID: INFO, CONTACT, SOCIAL */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-24">
          {/* Info Column */}
          <div className="space-y-6">
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">Info</h5>
            <ul className="space-y-4 text-sm font-light text-white/70">
              <li><Link to="/info#nosotros" className="hover:text-luxury-cyan transition-colors">Sobre Nosotros</Link></li>
              <li><Link to="/info#tallas" className="hover:text-luxury-cyan transition-colors">Guía de Tallas</Link></li>
              <li><Link to="/info#envios" className="hover:text-luxury-cyan transition-colors">Envíos</Link></li>
              <li><Link to="/info#devoluciones" className="hover:text-luxury-cyan transition-colors">Devoluciones</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div className="space-y-6">
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">Contacto</h5>
            <ul className="space-y-4 text-sm font-light text-white/70">
              <li>
                <a href="mailto:por.ahi.clothes@gmail.com" className="hover:text-luxury-cyan transition-colors">
                  por.ahi.clothes@gmail.com
                </a>
              </li>
              <li>55 5152 7473</li>
              <li>CDMX, México</li>
            </ul>
          </div>

          {/* Social Column */}
          <div className="space-y-6">
            <h5 className="text-[10px] uppercase tracking-[0.4em] font-bold text-white/40">Redes Sociales</h5>
            <div className="flex gap-6">
              <a 
                href="https://www.instagram.com/por_ahi_clothes?igsh=MXZveGd6bHdhNG8waw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/5 rounded-full hover:bg-luxury-cyan hover:text-black transition-all"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/share/1DzbUL7zHF/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-3 bg-white/5 rounded-full hover:bg-white hover:text-black transition-all"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM: COPYRIGHT & ADMIN */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 pb-8">
          <p className="text-[10px] text-white/30 tracking-normal leading-relaxed text-center md:text-left max-w-xs md:max-w-none">
            © 2024 POR AHÍ... ALL RIGHTS RESERVED. LUXURY STREETWEAR BRAND.
          </p>
          
          <div className="flex items-center gap-8 text-[9px] uppercase tracking-[0.3em] text-white/20">
            <Link to="#" className="hover:text-white transition-colors">Términos</Link>
            <Link to="#" className="hover:text-white transition-colors">Privacidad</Link>
            <Link to="/admin" className="hover:text-white transition-colors">
              <Lock className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
