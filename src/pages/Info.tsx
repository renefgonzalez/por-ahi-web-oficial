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
            <div className="overflow-hidden rounded-3xl border border-white/10">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white/10">
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold border-b border-white/5">Talla</th>
                    <th className="p-4 text-[10px] uppercase tracking-widest font-bold border-b border-white/5">Medidas (Ancho x Largo)</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-light text-white/60">
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-luxury-cyan">S</td>
                    <td className="p-4">45 x 68 cm</td>
                  </tr>
                  <tr className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-luxury-cyan">M</td>
                    <td className="p-4">50 x 70 cm</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-bold text-luxury-cyan">L</td>
                    <td className="p-4">55 x 72 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[10px] text-white/30 uppercase tracking-widest italic">
              * Las medidas pueden variar +/- 1cm por el proceso de confección.
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
