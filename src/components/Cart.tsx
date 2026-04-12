import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingBag, Trash2, MessageCircle, User, MapPin, Truck, ArrowLeft, CreditCard, FileText, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/utils";

export default function Cart() {
  const { cart, removeFromCart, isCartOpen, setIsCartOpen, subtotal, clearCart, addOrder } = useCart();
  const navigate = useNavigate();
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    deliveryType: "Envío a domicilio",
    notes: ""
  });

  const isFormValid = formData.name.trim() !== "" && formData.phone.trim() !== "" && formData.city.trim() !== "";

  const handleWhatsAppCheckout = () => {
    if (!isFormValid) {
      alert("Por favor, completa tu nombre, teléfono y ciudad para continuar.");
      return;
    }

    // Save order to history
    addOrder({
      name: formData.name,
      phone: formData.phone,
      city: formData.city,
      deliveryType: formData.deliveryType,
      notes: formData.notes,
      items: [...cart],
      total: subtotal
    });

    const itemsList = cart
      .map((item) => `• ${item.quantity}x ${item.name} (Talla: ${item.size}) - ${formatPrice(item.price)}`)
      .join("\n");

    const message = `🛍️ ¡NUEVA ORDEN PARA POR AHÍ! (vía Imagine and Stamp)
👤 Cliente: ${formData.name}
📱 WhatsApp: ${formData.phone}
📍 Ubicación: ${formData.city}
🚚 Entrega: ${formData.deliveryType}

DETALLE DEL PEDIDO:
${itemsList}

💰 TOTAL A PAGAR: ${formatPrice(subtotal)}
${formData.notes ? `📝 Notas: ${formData.notes}\n` : ""}
¿Podrían confirmarme disponibilidad para proceder con el pago? ¡Gracias!`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "525551527473";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    
    // Clear cart after checkout
    clearCart();
    setIsCartOpen(false);
  };

  const handleContinueShopping = () => {
    setIsCartOpen(false);
    navigate("/catalog");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* OVERLAY */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleContinueShopping}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* DRAWER */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-black text-white z-[101] shadow-2xl flex flex-col"
          >
            {/* HEADER */}
            <div className="p-8 border-b border-white/10 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <ShoppingBag className="w-5 h-5 text-luxury-cyan" />
                <h2 className="text-xs font-bold uppercase tracking-[0.4em]">Tu Carrito</h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* CONTENT */}
            <div className="flex-grow overflow-y-auto p-8 space-y-10 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <ShoppingBag className="w-12 h-12 text-white/10" />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">
                    Tu carrito está vacío
                  </p>
                  <button
                    onClick={handleContinueShopping}
                    className="text-luxury-cyan text-[10px] uppercase tracking-widest border-b border-luxury-cyan/20 pb-1"
                  >
                    SEGUIR COMPRANDO
                  </button>
                </div>
              ) : (
                <>
                  {/* ITEMS LIST */}
                  <div className="space-y-4">
                    <h3 className="text-[8px] uppercase tracking-[0.3em] text-white/40 font-bold">Productos</h3>
                    {cart.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex gap-3 group">
                        <div className="w-10 aspect-[4/5] bg-white/5 rounded-lg overflow-hidden flex-shrink-0 border border-dashed border-white/10 flex items-center justify-center relative">
                          {/* Fallback Icon (Always behind) */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 z-0">
                            <ShoppingBag className="w-2.5 h-2.5 text-white/10" />
                            <span className="text-[5px] text-white/20 font-bold uppercase tracking-widest">N/A</span>
                          </div>
                          
                          {item.frenteImage || item.reversaImage || item.image ? (
                            <img
                              src={item.frenteImage || item.reversaImage || item.image}
                              alt={item.name}
                              className="absolute inset-0 w-full h-full object-cover z-10"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.opacity = '0';
                              }}
                            />
                          ) : null}
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-[8px] font-bold uppercase tracking-wider line-clamp-1">
                                {item.name}
                              </h3>
                              <button
                                onClick={() => removeFromCart(item.id, item.size)}
                                className="text-white/20 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                            <p className="text-[7px] text-white/40 uppercase tracking-widest">
                              Talla: {item.size} • Cantidad: {item.quantity}
                            </p>
                          </div>
                          <p className="text-[10px] font-light text-luxury-cyan">
                            {formatPrice(item.price)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CONTACT FORM */}
                  <div className="space-y-6 pt-6 border-t border-white/10">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">Datos de Entrega</h3>
                    
                    <div className="space-y-4">
                      {/* Name */}
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="text"
                          placeholder="NOMBRE COMPLETO"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[9px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors placeholder:text-white/10"
                        />
                      </div>

                      {/* Phone */}
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="tel"
                          placeholder="TELÉFONO DE WHATSAPP"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[9px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors placeholder:text-white/10"
                        />
                      </div>

                      {/* City */}
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="text"
                          placeholder="CIUDAD / ALCALDÍA"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[9px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors placeholder:text-white/10"
                        />
                      </div>

                      {/* Delivery Type */}
                      <div className="relative">
                        <Truck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <select
                          value={formData.deliveryType}
                          onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                          className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[9px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors appearance-none cursor-pointer"
                        >
                          <option value="Envío a domicilio" className="bg-black">Envío a domicilio</option>
                          <option value="Entrega personal" className="bg-black">Entrega personal</option>
                        </select>
                      </div>

                      {/* Notes */}
                      <div className="relative">
                        <FileText className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                        <textarea
                          placeholder="NOTAS ADICIONALES (OPCIONAL)"
                          value={formData.notes}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                          rows={2}
                          className="w-full bg-transparent border border-white/10 rounded-xl py-3 pl-12 pr-4 text-[9px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors placeholder:text-white/10 resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            {cart.length > 0 && (
              <div className="p-5 bg-white/5 border-t border-white/10 space-y-2.5">
                <div className="flex justify-between items-center">
                  <p className="text-[8px] uppercase tracking-[0.4em] text-white/40 font-bold">
                    Subtotal
                  </p>
                  <p className="text-base font-light tracking-tight">{formatPrice(subtotal)}</p>
                </div>
                
                <div className="space-y-2">
                  <button
                    onClick={handleWhatsAppCheckout}
                    disabled={!isFormValid}
                    className={`w-full py-3 px-6 text-black text-[8px] font-bold uppercase tracking-[0.3em] rounded-lg transition-all duration-500 flex items-center justify-center gap-2 ${
                      isFormValid 
                        ? "bg-luxury-cyan hover:bg-white shadow-[0_0_10px_rgba(0,229,255,0.1)]" 
                        : "bg-white/10 text-white/20 cursor-not-allowed"
                    }`}
                  >
                    <MessageCircle className="w-3 h-3" />
                    Finalizar pedido por WhatsApp
                  </button>

                  <button
                    onClick={handleContinueShopping}
                    className="w-full py-3 bg-black border border-luxury-cyan/20 text-white text-[8px] font-bold uppercase tracking-[0.4em] rounded-lg hover:bg-luxury-cyan hover:text-black transition-all duration-500 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-3 h-3" />
                    🛒 SEGUIR COMPRANDO
                  </button>
                </div>

                {!isFormValid && (
                  <p className="text-[5.5px] text-center text-luxury-cyan/40 uppercase tracking-widest animate-pulse">
                    Nombre, teléfono y ciudad requeridos
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

