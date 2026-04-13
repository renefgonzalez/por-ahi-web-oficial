import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { INITIAL_DELETED_ORDERS } from "../constants";

export interface CartItem {
  id: number;
  name: string;
  price: string;
  image: string;
  frenteImage?: string;
  reversaImage?: string;
  size: string;
  quantity: number;
}

export type OrderStatus = "Pendiente" | "En Preparación" | "Listo" | "Enviado" | "Entregado";
export type PaymentMethod = "Transferencia" | "Tarjeta" | "Efectivo";

export interface OrderNote {
  id: string;
  text: string;
  date: string;
}

export interface Order {
  id: string;
  name: string;
  phone: string;
  city: string;
  deliveryType: string;
  items: CartItem[];
  total: number;
  date: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  notes: OrderNote[];
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, size: string) => void;
  removeFromCart: (id: number, size: string) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  orders: Order[];
  deletedOrders: Order[];
  addOrder: (orderData: Omit<Order, "id" | "date" | "status" | "notes" | "paymentMethod"> & { notes?: string, paymentMethod?: PaymentMethod }) => void;
  updateOrder: (id: string, updates: Partial<Order>) => void;
  addOrderNote: (orderId: string, noteText: string) => void;
  trashOrder: (id: string) => void;
  restoreOrder: (id: string) => void;
  deleteOrderPermanently: (id: string) => void;
  importOrders: (orders: Order[], deletedOrders: Order[]) => void;
  increaseQuantity: (id: number, size: string) => void;
  decreaseQuantity: (id: number, size: string) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (isOpen: boolean) => void;
  lastAddedItem: CartItem | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [lastAddedItem, setLastAddedItem] = useState<CartItem | null>(null);
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("porahi_orders");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((o: any) => ({
        ...o,
        status: o.status || "Pendiente",
        paymentMethod: o.paymentMethod || "Transferencia",
        notes: Array.isArray(o.notes) ? o.notes : (o.notes ? [{ id: Math.random().toString(36).substr(2, 9), text: o.notes, date: new Date().toISOString() }] : [])
      }));
    }
    return [];
  });

  const [deletedOrders, setDeletedOrders] = useState<Order[]>(() => {
    const APP_VERSION = "2.0";
    const savedVersion = localStorage.getItem("porahi_app_version");

    if (savedVersion !== APP_VERSION) {
      // Cleanup is handled in ProductContext, but we ensure defaults here
      return INITIAL_DELETED_ORDERS as Order[];
    }

    const saved = localStorage.getItem("porahi_deleted_orders");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((o: any) => ({
        ...o,
        notes: Array.isArray(o.notes) ? o.notes : (o.notes ? [{ id: Math.random().toString(36).substr(2, 9), text: o.notes, date: new Date().toISOString() }] : [])
      }));
    }
    return [];
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem("porahi_orders", JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem("porahi_deleted_orders", JSON.stringify(deletedOrders));
  }, [deletedOrders]);

  const addToCart = (product: any, size: string) => {
    // Console log para debugging como solicitó el usuario
    console.log("Añadiendo al carrito:", product);

    setCart((prevCart) => {
      // Nos aseguramos de que el ID sea numérico si viene de Supabase
      const productId = Number(product.id);
      const existingItem = prevCart.find(
        (item) => item.id === productId && item.size === size
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      // Limpiamos el precio: si es string "$450" -> 450, si es número se mantiene
      const rawPrice = product.price;
      const cleanPrice = typeof rawPrice === 'string' 
        ? rawPrice.replace(/[^0-9.]/g, '') 
        : rawPrice;

      const newItem: CartItem = {
        id: productId,
        name: product.name || "Producto sin nombre",
        price: String(cleanPrice),
        image: product.image || product.frenteImage || product.reversaImage || "",
        frenteImage: product.frenteImage,
        reversaImage: product.reversaImage,
        size: size,
        quantity: 1,
      };

      setLastAddedItem(newItem);
      setIsAddModalOpen(true);
      
      return [
        ...prevCart,
        newItem,
      ];
    });
    // setIsCartOpen(true); // Don't open the whole cart yet, show the modal instead
  };

  const increaseQuantity = (id: number, size: string) => {
    setCart((prev) => 
      prev.map((item) => 
        item.id === id && item.size === size 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      )
    );
  };

  const decreaseQuantity = (id: number, size: string) => {
    setCart((prev) => 
      prev.map((item) => 
        item.id === id && item.size === size && item.quantity > 1 
          ? { ...item, quantity: item.quantity - 1 } 
          : item
      )
    );
  };

  const removeFromCart = (id: number, size: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.id === id && item.size === size))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addOrder = (orderData: Omit<Order, "id" | "date" | "status" | "notes" | "paymentMethod"> & { notes?: string, paymentMethod?: PaymentMethod }) => {
    const { notes: initialNote, paymentMethod: initialPaymentMethod, ...rest } = orderData;
    const newOrder: Order = {
      ...rest,
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      status: "Pendiente",
      paymentMethod: initialPaymentMethod || "Transferencia",
      notes: initialNote ? [{
        id: Math.random().toString(36).substr(2, 9),
        text: initialNote,
        date: new Date().toISOString()
      }] : []
    };
    setOrders((prev) => [newOrder, ...prev]);
  };

  const updateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
    setDeletedOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updates } : o)));
  };

  const addOrderNote = (orderId: string, noteText: string) => {
    const newNote: OrderNote = {
      id: Math.random().toString(36).substr(2, 9),
      text: noteText,
      date: new Date().toISOString()
    };
    
    const updateNotes = (prev: Order[]) => prev.map(o => 
      o.id === orderId ? { ...o, notes: [newNote, ...o.notes] } : o
    );

    setOrders(updateNotes);
    setDeletedOrders(updateNotes);
  };

  const trashOrder = (id: string) => {
    const orderToTrash = orders.find((o) => o.id === id);
    if (orderToTrash) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setDeletedOrders((prev) => [orderToTrash, ...prev]);
    }
  };

  const restoreOrder = (id: string) => {
    const orderToRestore = deletedOrders.find((o) => o.id === id);
    if (orderToRestore) {
      setDeletedOrders((prev) => prev.filter((o) => o.id !== id));
      setOrders((prev) => [orderToRestore, ...prev]);
    }
  };

  const deleteOrderPermanently = (id: string) => {
    setDeletedOrders((prev) => prev.filter((o) => o.id !== id));
  };

  const importOrders = (newOrders: Order[], newDeletedOrders: Order[]) => {
    setOrders(newOrders);
    setDeletedOrders(newDeletedOrders);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const subtotal = cart.reduce((sum, item) => {
    // Tratamos el precio con precaución
    const priceStr = String(item.price || "0").replace(/[^0-9.]/g, "");
    const priceNum = parseFloat(priceStr) || 0;
    return sum + priceNum * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        isCartOpen,
        setIsCartOpen,
        clearCart,
        totalItems,
        subtotal,
        orders,
        deletedOrders,
        addOrder,
        updateOrder,
        addOrderNote,
        trashOrder,
        restoreOrder,
        deleteOrderPermanently,
        importOrders,
        increaseQuantity,
        decreaseQuantity,
        isAddModalOpen,
        setIsAddModalOpen,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
