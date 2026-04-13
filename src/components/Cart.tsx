import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  MessageCircle, 
  User, 
  MapPin, 
  Truck, 
  ArrowLeft, 
  FileText, 
  Phone, 
  Plus, 
  Minus, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/utils";

export default function Cart() {
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity, isCartOpen, setIsCartOpen, subtotal, clearCart, addOrder } = useCart();
  const navigate = useNavigate();
  
  // Checkout Steps: 1 = Summary, 2 = Form
  const [step, setStep] = useState(1);
  
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
    if (!isFormValid) return;

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

    const message = `🛍️ ¡NUEVA ORDEN PARA POR AHÍ!
👤 Cliente: ${formData.name}
📱 WhatsApp: ${formData.phone}
📍 Ubicación: ${formData.city}
🚚 Entrega: ${formData.deliveryType}

DETALLE DEL PEDIDO:
${itemsList}

💰 TOTAL A PAGAR: ${formatPrice(subtotal)}
${formData.notes ? `📝 Notas: ${formData.notes}\n` : ""}
¿Podrían confirmarme disponibilidad?`;

    const encodedMessage = encodeURIComponent(message);
    const phoneNumber = "525551527473";
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");
    
    clearCart();
    setIsCartOpen(false);
    setStep(1);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setTimeout(() => setStep(1), 300); // Reset to step 1 after closing
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[300]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-[450px] bg-black text-white z-[301] shadow-2xl flex flex-col"
          >
            {/* HEADER */}
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-black">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-bold mb-1">Tu Carrito</span>
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-black italic tracking-tighter uppercase whitespace-nowrap">
                    {step === 1 ? "Revisar Productos" : "Datos de Entrega"}
                  </h2>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-3 hover:bg-white/5 rounded-full transition-colors border border-white/5"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* STEP INDICATOR */}
            <div className="flex bg-white/5 border-b border-white/5">
              <div className={`flex-1 py-1 transition-colors ${step === 1 ? "bg-luxury-cyan" : ""}`} />
              <div className={`flex-1 py-1 transition-colors ${step === 2 ? "bg-luxury-cyan" : ""}`} />
            </div>

            {/* CONTENT */}
            <div className="flex-grow overflow-y-auto custom-scrollbar relative">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  /* STEP 1: SUMMARY */
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-8 space-y-8"
                  >
                    {cart.length === 0 ? (
                      <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
                        <ShoppingBag className="w-16 h-16 text-white/5" />
                        <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 font-bold">
                          Tu carrito está vacío
                        </p>
                        <button
                          onClick={() => { closeCart(); navigate("/catalog"); }}
                          className="px-8 py-4 bg-luxury-cyan text-black text-[10px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-transform"
                        >
                          Ir al Catálogo
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {cart.map((item) => (
                          <div key={`${item.id}-${item.size}`} className="flex gap-5 bg-white/5 p-4 rounded-2xl border border-white/5 group">
                            <div className="w-16 aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0 bg-gray-900 border border-white/10 relative">
                              <img
                                src={item.frenteImage || item.reversaImage || item.image}
                                alt={item.name}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="flex-grow flex flex-col justify-between py-1">
                              <div>
                                <div className="flex justify-between items-start mb-1">
                                  <h3 className="text-[9px] font-black uppercase tracking-wider text-white">
                                    {item.name}
                                  </h3>
                                  <button
                                    onClick={() => removeFromCart(item.id, item.size)}
                                    className="p-2 -mr-2 text-white/20 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-[7px] bg-white/10 px-2 py-0.5 rounded text-white/60 font-bold uppercase tracking-widest">
                                    Talla: {item.size}
                                  </span>
                                </div>
                              </div>
                              
                              <div className="flex justify-between items-center mt-4">
                                <p className="text-xs font-light text-luxury-cyan">
                                  {formatPrice(item.price)}
                                </p>
                                
                                <div className="flex items-center gap-3 bg-black border border-white/10 rounded-lg p-1">
                                  <button 
                                    onClick={() => decreaseQuantity(item.id, item.size)}
                                    className="p-1 hover:text-luxury-cyan transition-colors"
                                    disabled={item.quantity <= 1}
                                  >
                                    <Minus className={`w-3 h-3 ${item.quantity <= 1 ? "opacity-20" : ""}`} />
                                  </button>
                                  <span className="text-[10px] font-bold w-4 text-center">{item.quantity}</span>
                                  <button 
                                    onClick={() => increaseQuantity(item.id, item.size)}
                                    className="p-1 hover:text-luxury-cyan transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ) : (
                  /* STEP 2: FORM */
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-6 sm:p-8 space-y-10"
                  >
                    <div className="bg-luxury-cyan/5 border border-luxury-cyan/10 p-4 rounded-2xl flex gap-3 items-start">
                      <ShieldCheck className="w-5 h-5 text-luxury-cyan flex-shrink-0 mt-0.5" />
                      <p className="text-[8px] uppercase tracking-widest text-luxury-cyan/80 leading-relaxed font-bold">
                        Tu información está segura. Usamos WhatsApp para agilizar la confirmación y el proceso de pago.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Name */}
                      <div className="space-y-2">
                        <label className="text-[7px] uppercase tracking-[0.3em] font-black text-white/30 ml-2">Nombre Completo</label>
                        <div className="relative">
                          <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="text"
                            placeholder="EJ: JUAN PÉREZ"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan focus:bg-white/10 transition-all placeholder:text-white/5"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <label className="text-[7px] uppercase tracking-[0.3em] font-black text-white/30 ml-2">WhatsApp</label>
                        <div className="relative">
                          <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="tel"
                            placeholder="TU NÚMERO A 10 DÍGITOS"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan focus:bg-white/10 transition-all placeholder:text-white/5"
                          />
                        </div>
                      </div>

                      {/* City */}
                      <div className="space-y-2">
                        <label className="text-[7px] uppercase tracking-[0.3em] font-black text-white/30 ml-2">Ciudad / Municipio</label>
                        <div className="relative">
                          <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                          <input
                            type="text"
                            placeholder="CIUDAD DE MÉXICO"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan focus:bg-white/10 transition-all placeholder:text-white/5"
                          />
                        </div>
                      </div>

                      {/* Delivery Type */}
                      <div className="space-y-2">
                        <label className="text-[7px] uppercase tracking-[0.3em] font-black text-white/30 ml-2">Tipo de Entrega</label>
                        <div className="relative">
                          <Truck className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                          <select
                            value={formData.deliveryType}
                            onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-10 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan focus:bg-white/10 transition-all appearance-none cursor-pointer"
                          >
                            <option value="Envío a domicilio" className="bg-black">Envío a domicilio</option>
                            <option value="Entrega personal" className="bg-black">Entrega personal</option>
                          </select>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <label className="text-[7px] uppercase tracking-[0.3em] font-black text-white/30 ml-2">Notas Especiales</label>
                        <div className="relative">
                          <FileText className="absolute left-5 top-5 w-4 h-4 text-white/20" />
                          <textarea
                            placeholder="INDICACIONES ADICIONALES..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows={3}
                            className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan focus:bg-white/10 transition-all placeholder:text-white/5 resize-none"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* FOOTER - ALWAYS VISIBLE */}
            {cart.length > 0 && (
              <div className="p-8 bg-black border-t border-white/10">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex flex-col">
                    <span className="text-[8px] uppercase tracking-[0.4em] text-white/30 font-bold">Total a pagar</span>
                    <span className="text-2xl font-light text-luxury-cyan tracking-tight">{formatPrice(subtotal)}</span>
                  </div>
                  {step === 1 && (
                    <span className="text-[7px] uppercase tracking-widest text-white/20 font-bold border border-white/5 px-3 py-1.5 rounded-full">
                      {cart.length} {cart.length === 1 ? "Producto" : "Productos"}
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {step === 1 ? (
                    <button
                      onClick={() => setStep(2)}
                      className="w-full py-5 bg-luxury-cyan text-black text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-white transition-all duration-500 flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(0,229,255,0.1)] group"
                    >
                      Continuar al Pago
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="w-full py-4 bg-white/5 border border-white/10 text-white text-[9px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Atrás
                      </button>
                      <button
                        onClick={handleWhatsAppCheckout}
                        disabled={!isFormValid}
                        className={`w-full py-4 px-6 text-black text-[9px] font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-500 flex items-center justify-center gap-2 ${
                          isFormValid 
                            ? "bg-luxury-cyan hover:bg-white shadow-[0_10px_30px_rgba(0,229,255,0.1)]" 
                            : "bg-white/5 text-white/10 cursor-not-allowed border border-white/5"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4" />
                        Pedir por WhatsApp
                      </button>
                    </div>
                  )}

                  {step === 1 && (
                    <button
                      onClick={closeCart}
                      className="w-full py-4 border border-white/5 text-white/20 text-[8px] font-bold uppercase tracking-[0.4em] rounded-xl hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      Seguir Explorando
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

