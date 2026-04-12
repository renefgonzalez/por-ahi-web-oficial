import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Edit, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Image as ImageIcon,
  LayoutGrid,
  Tag,
  FileText,
  Lock,
  ChevronRight,
  RotateCcw,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Download,
  Upload,
  Copy
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../lib/utils";
import { useProducts, Product, SpecialLabel } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const { 
    orders, 
    deletedOrders, 
    updateOrder, 
    addOrderNote,
    trashOrder, 
    restoreOrder, 
    deleteOrderPermanently,
    importOrders 
  } = useCart();
  const { products: inventory, addProduct, updateProduct, deleteProduct, restoreProduct, importProducts } = useProducts();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"inventory" | "orders">("inventory");
  const [orderSubTab, setOrderSubTab] = useState<"PENDIENTES" | "ENTREGADOS">("PENDIENTES");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  
  // Note Inputs State
  const [noteInputs, setNoteInputs] = useState<{[key: string]: string}>({});
  
  // Edit State
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Undo State
  const [lastDeleted, setLastDeleted] = useState<Product | null>(null);
  const [showUndo, setShowUndo] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "HOMBRE",
    type: "Sudaderas",
    theme: "Harry Potter",
    imageType: "SÓLO FRENTE",
    frenteImage: "",
    reversaImage: "",
    hasSizes: true,
    specialLabel: "Ninguna" as SpecialLabel
  });

  const handleExport = () => {
    const backupData = {
      inventory,
      orders,
      deletedOrders
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `porahi_respaldo_total_${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleCopyToClipboard = () => {
    const backupData = {
      inventory,
      orders,
      deletedOrders
    };
    const dataStr = JSON.stringify(backupData, null, 2);
    navigator.clipboard.writeText(dataStr).then(() => {
      alert("¡Respaldo copiado al portapapeles! Pégalo en el chat con el asistente para que pueda actualizar el código permanentemente.");
    }).catch(() => {
      alert("Error al copiar al portapapeles. Intenta usar el botón de Exportar.");
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const json = JSON.parse(content);
        
        // Robust validation
        const isValidProduct = (p: any) => 
          p && typeof p.id === 'number' && typeof p.name === 'string' && typeof p.price === 'string';

        // Check if it's the new total backup format or the old inventory-only format
        if (json.inventory && Array.isArray(json.inventory)) {
          if (json.inventory.every(isValidProduct)) {
            if (confirm("¿Estás seguro de que quieres importar este respaldo total? Esto reemplazará todo el inventario y pedidos actuales.")) {
              importProducts(json.inventory);
              if (json.orders) importOrders(json.orders, json.deletedOrders || []);
              alert("Respaldo total restaurado con éxito.");
            }
          } else {
            alert("El archivo contiene productos con formato inválido.");
          }
        } else if (Array.isArray(json)) {
          if (json.every(isValidProduct)) {
            if (confirm("Este parece ser un respaldo antiguo (solo inventario). ¿Quieres importarlo? Reemplazará el inventario actual.")) {
              importProducts(json);
              alert("Inventario restaurado con éxito.");
            }
          } else {
            alert("El archivo contiene productos con formato inválido.");
          }
        } else {
          alert("El archivo no tiene el formato correcto.");
        }
      } catch (err) {
        alert("Error al leer el archivo de respaldo. Asegúrate de que sea un JSON válido.");
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = "";
  };

  const handleFreezeCatalog = () => {
    const productsContent = `export const PRODUCTS = ${JSON.stringify(inventory, null, 2)};`;
    const dataUri = 'data:text/typescript;charset=utf-8,'+ encodeURIComponent(productsContent);
    
    const exportFileDefaultName = `constants_congelado_${new Date().toISOString().split('T')[0]}.ts`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    alert("¡Catálogo congelado! Puedes usar este archivo para reemplazar 'src/constants.ts' y hacer que estos productos sean los predeterminados en la versión pública.");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "PorAhi2024") {
      setIsAuthenticated(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleAddOrUpdateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId !== null) {
      // Update existing
      updateProduct(editingId, { 
        ...newProduct, 
        id: editingId,
      } as Product);
      setEditingId(null);
    } else {
      // Add new
      addProduct({
        ...newProduct,
      } as Omit<Product, "id">);
    }

    // Reset form
    setNewProduct({
      name: "",
      description: "",
      price: "",
      category: "HOMBRE",
      type: "Sudaderas",
      theme: "Harry Potter",
      imageType: "SÓLO FRENTE",
      frenteImage: "",
      reversaImage: "",
      hasSizes: true,
      specialLabel: "Ninguna"
    });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setNewProduct({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      type: product.type || "Sudaderas",
      theme: product.theme,
      imageType: product.imageType || "SÓLO FRENTE",
      frenteImage: product.frenteImage,
      reversaImage: product.reversaImage || "",
      hasSizes: product.hasSizes !== undefined ? product.hasSizes : true,
      specialLabel: product.specialLabel || "Ninguna"
    });
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id: number) => {
    const productToDelete = inventory.find(p => p.id === id);
    if (productToDelete) {
      setLastDeleted(productToDelete);
      deleteProduct(id);
      setShowUndo(true);
      
      // Hide undo after 5 seconds
      setTimeout(() => {
        setShowUndo(false);
      }, 5000);
    }
  };

  const handleUndo = () => {
    if (lastDeleted) {
      restoreProduct(lastDeleted);
      setLastDeleted(null);
      setShowUndo(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white/5 border border-luxury-cyan/20 p-12 rounded-[40px] text-center"
        >
          <div className="w-16 h-16 bg-luxury-cyan/10 rounded-full flex items-center justify-center mx-auto mb-8">
            <Lock className="w-6 h-6 text-luxury-cyan" />
          </div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-2">Acceso Restringido</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/40 mb-10">Ingresa la contraseña maestra</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password"
              placeholder="CONTRASEÑA"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-black border ${loginError ? 'border-red-500' : 'border-white/10'} rounded-2xl py-5 px-6 text-center text-xs tracking-[0.5em] focus:outline-none focus:border-luxury-cyan transition-all`}
            />
            {loginError && <p className="text-[9px] text-red-500 uppercase tracking-widest">Contraseña incorrecta</p>}
            <button 
              type="submit"
              className="w-full py-5 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-2xl hover:bg-luxury-cyan transition-all duration-500"
            >
              Entrar al Panel
            </button>
            <button 
              type="button"
              onClick={() => navigate("/")}
              className="text-[9px] uppercase tracking-widest text-white/20 hover:text-white transition-colors"
            >
              Volver a la tienda
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans pt-[100px] pb-24 px-8">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter uppercase mb-2">
              Admin Center<span className="text-luxury-cyan">.</span>
            </h1>
            <div className="flex gap-6 mt-6">
              <button 
                onClick={() => setActiveTab("inventory")}
                className={`text-[10px] uppercase tracking-[0.4em] font-bold pb-2 border-b-2 transition-all ${activeTab === "inventory" ? "border-luxury-cyan text-white" : "border-transparent text-white/20 hover:text-white/40"}`}
              >
                Inventario
              </button>
              <button 
                onClick={() => setActiveTab("orders")}
                className={`text-[10px] uppercase tracking-[0.4em] font-bold pb-2 border-b-2 transition-all ${activeTab === "orders" ? "border-luxury-cyan text-white" : "border-transparent text-white/20 hover:text-white/40"}`}
              >
                Seguimiento de Pedidos
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleCopyToClipboard}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              title="Copiar Respaldo para el Asistente"
            >
              <Copy className="w-4 h-4" />
              Copiar JSON
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              title="Exportar Respaldo JSON"
            >
              <Download className="w-4 h-4" />
              Exportar Respaldo JSON
            </button>

            <button
              onClick={handleFreezeCatalog}
              className="flex items-center gap-2 px-6 py-3 bg-luxury-cyan/10 border border-luxury-cyan/20 rounded-xl text-[9px] font-bold uppercase tracking-widest text-luxury-cyan hover:bg-luxury-cyan hover:text-black transition-all"
              title="Congelar Catálogo para Código"
            >
              <Lock className="w-4 h-4" />
              Congelar Código
            </button>
            
            <label className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer">
              <Upload className="w-4 h-4" />
              Importar
              <input 
                type="file" 
                accept=".json" 
                onChange={handleImport} 
                className="hidden" 
              />
            </label>

            <button 
              onClick={() => setIsAuthenticated(false)}
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-[9px] uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {activeTab === "inventory" ? (
          <>
            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
              <div className="bg-white/5 border border-luxury-cyan/20 p-8 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                  <Package className="w-5 h-5 text-luxury-cyan/40" />
                  <span className="text-[10px] uppercase tracking-widest text-luxury-cyan/20 font-bold">Total</span>
                </div>
                <p className="text-3xl font-light mb-1">{inventory.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Productos en tienda</p>
              </div>
              <div className="bg-white/5 border border-luxury-cyan/20 p-8 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                  <TrendingUp className="w-5 h-5 text-luxury-cyan/40" />
                  <span className="text-[10px] uppercase tracking-widest text-luxury-cyan/20 font-bold">Ventas</span>
                </div>
                <p className="text-3xl font-light mb-1">{orders.length}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Pedidos históricos</p>
              </div>
              <div className="bg-white/5 border border-luxury-cyan/20 p-8 rounded-3xl">
                <div className="flex justify-between items-start mb-4">
                  <DollarSign className="w-5 h-5 text-luxury-cyan/40" />
                  <span className="text-[10px] uppercase tracking-widest text-luxury-cyan/20 font-bold">Ingresos</span>
                </div>
                <p className="text-3xl font-light mb-1">{formatPrice(orders.reduce((acc, curr) => acc + curr.total, 0))}</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40">Total acumulado</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* INVENTORY LIST */}
              <div className="lg:col-span-2 space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-white/60">Inventario Actual</h2>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] text-white/20 uppercase tracking-widest">{inventory.length} Items</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <AnimatePresence mode="popLayout">
                    {inventory.map((product) => (
                      <motion.div 
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-6 group hover:border-luxury-cyan/40 transition-colors"
                      >
                        <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden flex-shrink-0">
                          <img 
                            src={product.imageType === "SÓLO REVERSA" ? product.reversaImage : product.frenteImage} 
                            alt={product.name} 
                            className="w-full h-full object-cover" 
                            referrerPolicy="no-referrer" 
                          />
                        </div>
                        <div className="flex-grow">
                          <h4 className="text-[10px] font-bold uppercase tracking-wider mb-1">{product.name}</h4>
                          <p className="text-[9px] text-white/40 uppercase tracking-widest">{product.category} • {product.type} • {product.theme}</p>
                        </div>
                        <div className="text-right px-4">
                          <p className="text-sm font-light text-luxury-cyan">{formatPrice(product.price)}</p>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest">En Stock</p>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="p-3 bg-white/5 rounded-xl hover:bg-white hover:text-black transition-all"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-3 bg-white/5 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* ADD/EDIT PRODUCT FORM */}
              <div className="space-y-8">
                <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-white/60">
                  {editingId !== null ? "Editar Diseño" : "Añadir Nuevo Diseño"}
                </h2>
                
                <form onSubmit={handleAddOrUpdateProduct} className="bg-white/5 border border-luxury-cyan/30 p-8 rounded-[32px] space-y-6 sticky top-32">
                  <div className="space-y-4">
                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        placeholder="NOMBRE DEL PRODUCTO"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors"
                        required
                      />
                    </div>

                    <div className="relative">
                      <FileText className="absolute left-4 top-4 w-4 h-4 text-white/20" />
                      <textarea
                        placeholder="DESCRIPCIÓN"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        rows={3}
                        className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors resize-none"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="text"
                          placeholder="PRECIO (EJ: $450)"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors"
                          required
                        />
                      </div>
                      <div className="relative">
                        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="text"
                          placeholder="CATEGORÍA (HOMBRE/MUJER)"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({...newProduct, category: e.target.value.toUpperCase()})}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="relative">
                        <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="text"
                          placeholder="TIPO (SUDADERA/PLAYERA)"
                          value={newProduct.type}
                          onChange={(e) => setNewProduct({...newProduct, type: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors"
                          required
                        />
                      </div>
                      <div className="relative">
                        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                        <input
                          type="text"
                          placeholder="COLECCIÓN"
                          value={newProduct.theme}
                          onChange={(e) => setNewProduct({...newProduct, theme: e.target.value})}
                          className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors"
                          required
                        />
                      </div>
                    </div>

                    <div className="relative">
                      <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <select
                        value={newProduct.imageType}
                        onChange={(e) => setNewProduct({...newProduct, imageType: e.target.value})}
                        className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors appearance-none"
                      >
                        <option value="SÓLO FRENTE">SÓLO FRENTE</option>
                        <option value="SÓLO REVERSA">SÓLO REVERSA</option>
                        <option value="FRENTE Y REVERSA">FRENTE Y REVERSA</option>
                      </select>
                    </div>

                    <div className="relative">
                      <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <select
                        value={newProduct.hasSizes ? "true" : "false"}
                        onChange={(e) => setNewProduct({...newProduct, hasSizes: e.target.value === "true"})}
                        className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors appearance-none"
                      >
                        <option value="true">¿Requiere Tallas? SÍ</option>
                        <option value="false">¿Requiere Tallas? NO (Talla Única)</option>
                      </select>
                    </div>

                    <div className="relative">
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <select
                        value={newProduct.specialLabel}
                        onChange={(e) => setNewProduct({...newProduct, specialLabel: e.target.value as SpecialLabel})}
                        className="w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors appearance-none"
                      >
                        <option value="Ninguna">Etiqueta Especial: Ninguna</option>
                        <option value="Nuevo Lanzamiento">Nuevo Lanzamiento</option>
                        <option value="Rebajas">Rebajas</option>
                        <option value="Destacado">Destacado</option>
                      </select>
                    </div>

                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="url"
                        placeholder={newProduct.imageType === "SÓLO REVERSA" ? "URL DE LA IMAGEN (FRENTE - OPCIONAL)" : "URL DE LA IMAGEN (FRENTE)"}
                        value={newProduct.frenteImage}
                        onChange={(e) => setNewProduct({...newProduct, frenteImage: e.target.value})}
                        className={`w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors ${newProduct.imageType === "SÓLO REVERSA" ? "opacity-60" : ""}`}
                        required={newProduct.imageType !== "SÓLO REVERSA"}
                      />
                    </div>

                    <div className="relative">
                      <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="url"
                        placeholder={newProduct.imageType === "SÓLO FRENTE" ? "URL IMAGEN REVERSA (DESACTIVADO)" : "URL IMAGEN REVERSA"}
                        value={newProduct.reversaImage}
                        onChange={(e) => setNewProduct({...newProduct, reversaImage: e.target.value})}
                        disabled={newProduct.imageType === "SÓLO FRENTE"}
                        className={`w-full bg-black border border-white/10 rounded-xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-colors ${newProduct.imageType === "SÓLO FRENTE" ? "opacity-30 cursor-not-allowed" : ""}`}
                        required={newProduct.imageType !== "SÓLO FRENTE"}
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {editingId !== null && (
                      <button 
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setNewProduct({
                            name: "",
                            description: "",
                            price: "",
                            category: "HOMBRE",
                            type: "Sudaderas",
                            theme: "Harry Potter",
                            imageType: "SÓLO FRENTE",
                            frenteImage: "",
                            reversaImage: "",
                            hasSizes: true,
                            specialLabel: "Ninguna"
                          });
                        }}
                        className="w-1/3 py-6 bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.4em] rounded-2xl hover:bg-white/10 transition-all"
                      >
                        Cancelar
                      </button>
                    )}
                    <button 
                      type="submit"
                      className={`${editingId !== null ? "w-2/3" : "w-full"} py-6 bg-white text-black text-[10px] font-bold uppercase tracking-[0.4em] rounded-2xl hover:bg-luxury-cyan transition-all duration-500 flex items-center justify-center gap-4 shadow-[0_0_20px_rgba(0,229,255,0.1)]`}
                    >
                      {editingId !== null ? <CheckCircle2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                      {editingId !== null ? "Guardar Cambios" : "Publicar Producto"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        ) : (
          /* ORDERS HISTORY TAB */
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex gap-4">
                <button 
                  onClick={() => setOrderSubTab("PENDIENTES")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all border ${
                    orderSubTab === "PENDIENTES" 
                      ? "bg-luxury-cyan/10 border-luxury-cyan text-luxury-cyan" 
                      : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  Pendientes ({orders.filter(o => ["Pendiente", "En Preparación", "Listo", "Enviado"].includes(o.status)).length})
                </button>
                <button 
                  onClick={() => setOrderSubTab("ENTREGADOS")}
                  className={`flex items-center gap-3 px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all border ${
                    orderSubTab === "ENTREGADOS" 
                      ? "bg-luxury-cyan/10 border-luxury-cyan text-luxury-cyan" 
                      : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                  }`}
                >
                  Entregados ({orders.filter(o => o.status === "Entregado").length})
                </button>
              </div>

              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-luxury-cyan transition-colors" />
                <input 
                  type="text"
                  placeholder="BUSCAR POR NOMBRE O TELÉFONO..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-[10px] uppercase tracking-widest focus:outline-none focus:border-luxury-cyan transition-all"
                />
              </div>
            </div>

            {orders.length === 0 ? (
              <div className="bg-white/5 border border-white/10 rounded-[40px] p-20 text-center">
                <Clock className="w-12 h-12 text-white/10 mx-auto mb-6" />
                <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">No hay pedidos registrados</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {[...orders]
                  .filter(order => {
                    const matchesTab = orderSubTab === "PENDIENTES" 
                      ? ["Pendiente", "En Preparación", "Listo", "Enviado"].includes(order.status)
                      : order.status === "Entregado";
                    
                    const query = searchQuery.toLowerCase();
                    const matchesSearch = order.name.toLowerCase().includes(query) || 
                                        (order.phone && order.phone.includes(query));
                    
                    return matchesTab && matchesSearch;
                  })
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((order) => (
                    <motion.div 
                      key={order.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:border-luxury-cyan/30 transition-all group"
                    >
                      <div className="flex flex-col lg:flex-row justify-between gap-8">
                        <div className="flex-grow space-y-6">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                order.status === "Entregado" ? "bg-green-500/20 text-green-500" :
                                order.status === "Enviado" ? "bg-blue-500/20 text-blue-500" :
                                order.status === "Listo" ? "bg-luxury-cyan/20 text-luxury-cyan" :
                                order.status === "En Preparación" ? "bg-orange-500/20 text-orange-500" :
                                "bg-yellow-500/20 text-yellow-500"
                              }`}>
                                <CheckCircle2 className="w-6 h-6" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bold uppercase tracking-tighter">{order.name}</h3>
                                <p className="text-[10px] text-white/40 uppercase tracking-widest">{order.phone} • {order.city} • {order.deliveryType}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <select 
                                value={order.status}
                                onChange={(e) => updateOrder(order.id, { status: e.target.value as any })}
                                className={`text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full border border-white/10 bg-black focus:outline-none transition-colors ${
                                  order.status === "Entregado" ? "text-green-500 border-green-500/20" :
                                  order.status === "Enviado" ? "text-blue-500 border-blue-500/20" :
                                  order.status === "Listo" ? "text-luxury-cyan border-luxury-cyan/20" :
                                  order.status === "En Preparación" ? "text-orange-500 border-orange-500/20" :
                                  "text-yellow-500 border-yellow-500/20"
                                }`}
                              >
                                <option value="Pendiente">Pendiente</option>
                                <option value="En Preparación">En Preparación</option>
                                <option value="Listo">Listo</option>
                                <option value="Enviado">Enviado</option>
                                <option value="Entregado">Entregado</option>
                              </select>
                            
                            <button 
                              onClick={() => trashOrder(order.id)}
                              className="p-2 bg-white/5 rounded-lg hover:bg-red-500/20 hover:text-red-500 transition-all"
                              title="Mover a Papelera"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-4">
                            <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold">Detalles del Pedido</p>
                            <div className="space-y-2">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-[10px] text-white/60 uppercase tracking-widest bg-white/5 p-3 rounded-xl">
                                  <span>{item.name} ({item.size}) x{item.quantity}</span>
                                  <span className="text-luxury-cyan">{formatPrice(item.price)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div className="space-y-4">
                              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold">Gestión de Pago</p>
                              <div className="flex gap-2">
                                {["Transferencia", "Tarjeta", "Efectivo"].map((method) => (
                                  <button
                                    key={method}
                                    onClick={() => updateOrder(order.id, { paymentMethod: method as any })}
                                    className={`px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase tracking-widest border transition-all ${
                                      order.paymentMethod === method 
                                        ? "bg-luxury-cyan/20 border-luxury-cyan text-luxury-cyan" 
                                        : "bg-white/5 border-white/10 text-white/40 hover:text-white"
                                    }`}
                                  >
                                    {method}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className="space-y-4">
                              <p className="text-[9px] uppercase tracking-[0.3em] text-white/20 font-bold">Bitácora de Eventos</p>
                              <div className="space-y-4">
                                <div className="flex gap-2">
                                  <input 
                                    type="text"
                                    value={noteInputs[order.id] || ""}
                                    onChange={(e) => setNoteInputs(prev => ({ ...prev, [order.id]: e.target.value }))}
                                    placeholder="Añadir nota de seguimiento..."
                                    className="flex-grow bg-black border border-white/10 rounded-xl px-4 py-3 text-[10px] uppercase tracking-widest text-white/60 focus:outline-none focus:border-luxury-cyan/40"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && noteInputs[order.id]) {
                                        addOrderNote(order.id, noteInputs[order.id]);
                                        setNoteInputs(prev => ({ ...prev, [order.id]: "" }));
                                      }
                                    }}
                                  />
                                  <button 
                                    onClick={() => {
                                      if (noteInputs[order.id]) {
                                        addOrderNote(order.id, noteInputs[order.id]);
                                        setNoteInputs(prev => ({ ...prev, [order.id]: "" }));
                                      }
                                    }}
                                    className="px-4 py-3 bg-luxury-cyan/20 border border-luxury-cyan/40 text-luxury-cyan rounded-xl text-[8px] font-bold uppercase tracking-widest hover:bg-luxury-cyan hover:text-black transition-all"
                                  >
                                    Añadir
                                  </button>
                                </div>

                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                  {order.notes.length === 0 ? (
                                    <p className="text-[8px] uppercase tracking-widest text-white/10 italic">Sin eventos registrados</p>
                                  ) : (
                                    order.notes.map((note) => (
                                      <div key={note.id} className="bg-white/5 border border-white/5 p-3 rounded-xl">
                                        <p className="text-[9px] text-white/80 uppercase tracking-widest leading-relaxed">
                                          <span className="text-luxury-cyan/60 font-bold mr-2">
                                            [{new Date(note.date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })} {new Date(note.date).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })}]
                                          </span>
                                          {note.text}
                                        </p>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="lg:w-48 text-right flex flex-col justify-between items-end border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-8">
                        <div>
                          <p className="text-3xl font-light text-luxury-cyan">${order.total}</p>
                          <p className="text-[9px] text-white/20 uppercase tracking-widest">Total Pagado</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-white/20 uppercase tracking-widest">
                            {new Date(order.date).toLocaleDateString()}
                          </p>
                          <p className="text-[9px] text-white/10 uppercase tracking-widest">
                            {new Date(order.date).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* TRASH SECTION */}
            {deletedOrders.length > 0 && (
              <div className="mt-24 pt-24 border-t border-white/5 space-y-8">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Trash2 className="w-5 h-5 text-red-500/40" />
                    <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-red-500/40">Papelera de Pedidos</h2>
                  </div>
                  <span className="text-[10px] text-red-500/20 uppercase tracking-widest">{deletedOrders.length} Eliminados</span>
                </div>

                <div className="grid grid-cols-1 gap-4 opacity-50 hover:opacity-100 transition-opacity">
                  {deletedOrders.map((order) => (
                    <div key={order.id} className="bg-white/5 border border-white/5 p-6 rounded-2xl flex items-center justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-white/5 rounded-full flex items-center justify-center">
                          <XCircle className="w-4 h-4 text-white/20" />
                        </div>
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-wider">{order.name}</h4>
                          <p className="text-[8px] text-white/20 uppercase tracking-widest">${order.total} • {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => restoreOrder(order.id)}
                          className="px-4 py-2 bg-white/5 rounded-lg text-[8px] font-bold uppercase tracking-widest hover:bg-luxury-cyan hover:text-black transition-all"
                        >
                          Restaurar
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm("¿Borrar permanentemente este pedido? Esta acción no se puede deshacer.")) {
                              deleteOrderPermanently(order.id);
                            }
                          }}
                          className="px-4 py-2 bg-white/5 rounded-lg text-[8px] font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                        >
                          Borrar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* UNDO NOTIFICATION */}
      <AnimatePresence>
        {showUndo && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="bg-white text-black px-8 py-4 rounded-full flex items-center gap-6 shadow-2xl">
              <p className="text-[10px] font-bold uppercase tracking-widest">Producto eliminado</p>
              <button 
                onClick={handleUndo}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-luxury-cyan hover:scale-105 transition-transform"
              >
                <RotateCcw className="w-4 h-4" />
                Deshacer
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
