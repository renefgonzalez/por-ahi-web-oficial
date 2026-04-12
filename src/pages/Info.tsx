import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "motion/react";
import Footer from "../components/Footer";

export default function Info() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace("#", ""));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-[100px]">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-24"
        >
          {/* NOSOTROS */}
          <section id="nosotros" className="space-y-6 scroll-mt-32">
            <h1 className="text-4xl font-black italic tracking-tighter uppercase">Nosotros<span className="text-luxury-cyan">.</span></h1>
            <p className="text-lg font-light text-white/70 leading-relaxed">
              Por Ahí... es el espacio donde el cine de culto, el arte y la moda se encuentran. 
              Respaldados por el estudio de personalización Imagine and Stamp, creamos piezas únicas con calidad de colección.
            </p>
          </section>

          {/* ENVIOS */}
          <section id="envios" className="space-y-6 scroll-mt-32">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Envíos<span className="text-luxury-cyan">.</span></h2>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10 space-y-4">
              <p className="text-sm text-white/70 leading-relaxed">
                Realizamos envíos a toda la CDMX y el resto de México vía mensajería.
              </p>
              <p className="text-sm font-bold text-luxury-cyan uppercase tracking-widest">
                El costo del envío se acuerda directamente por WhatsApp tras confirmar tu zona de entrega en CDMX o el resto de la República.
              </p>
            </div>
          </section>

          {/* GUIA DE TALLAS */}
          <section id="tallas" className="space-y-6 scroll-mt-32">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Guía de Tallas<span className="text-luxury-cyan">.</span></h2>
            
            {/* TALLAS MUJER */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-cyan">Tallas Mujer (Corte Silueta)</h3>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 overflow-hidden flex justify-center">
                <img 
                  src="/tallas-mujer.jpg" 
                  alt="Guía de tallas mujer" 
                  className="rounded-xl w-full max-w-lg object-contain bg-white/10"
                />
              </div>
            </div>

            {/* TALLAS UNISEX/HOMBRE */}
            <div className="space-y-4 mt-8">
              <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">Tallas Hombre / Unisex</h3>
              <div className="bg-white/5 p-4 rounded-3xl border border-white/10 overflow-hidden flex justify-center">
                <img 
                  src="/tallas-hombre.jpg" 
                  alt="Guía de tallas hombre" 
                  className="rounded-xl w-full max-w-lg object-contain bg-white/10"
                />
              </div>
            </div>
            
            <p className="text-[10px] text-white/30 uppercase tracking-widest italic pt-2">
              * Las medidas pueden variar +/- 1cm a 2.5cm por el proceso de confección, revisa la tolerancia (TOL+-).
            </p>
          </section>

          {/* DEVOLUCIONES */}
          <section id="devoluciones" className="space-y-6 scroll-mt-32">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Devoluciones<span className="text-luxury-cyan">.</span></h2>
            <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <p className="text-sm text-white/70 leading-relaxed">
                Al ser piezas de edición especial o personalizadas, solo aplicamos cambios por defectos de fabricación. 
                Cada prenda es revisada minuciosamente antes de ser enviada para garantizar la calidad de Imagine and Stamp.
              </p>
            </div>
          </section>

          {/* FAQ EXTRA */}
          <section className="space-y-8">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase">Cuidado de la Prenda<span className="text-luxury-cyan">.</span></h2>
            <div className="grid gap-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-cyan mb-2">¿Lavado?</h3>
                <p className="text-xs text-white/60 leading-relaxed">Recomendamos lavar la prenda al revés para proteger el diseño y evitar el uso de secadora.</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                <h3 className="text-sm font-bold uppercase tracking-widest text-luxury-cyan mb-2">¿Personalizados?</h3>
                <p className="text-xs text-white/60 leading-relaxed">¡Sí! A través de Imagine and Stamp podemos crear tu idea. Contáctanos por WhatsApp para cotizar.</p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
