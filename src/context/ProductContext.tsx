import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PRODUCTS as INITIAL_PRODUCTS } from "../constants";

export type SpecialLabel = "Ninguna" | "Nuevo Lanzamiento" | "Rebajas" | "Destacado";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string; // HOMBRE, MUJER, etc.
  type: string; // Sudadera, Playera, etc.
  theme: string; // Harry Potter, Marvel, etc.
  imageType: string; // SÓLO FRENTE, SÓLO REVERSA, FRENTE Y REVERSA
  frenteImage: string;
  reversaImage?: string;
  hasSizes: boolean;
  specialLabel?: SpecialLabel;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: number, product: Product) => void;
  deleteProduct: (id: number) => void;
  restoreProduct: (product: Product) => void;
  importProducts: (products: Product[]) => void;
  themes: string[];
  categories: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const APP_VERSION = "2.0"; // Increment version to trigger cleanup
    const savedVersion = localStorage.getItem("porahi_app_version");

    if (savedVersion !== APP_VERSION) {
      // One-time cleanup for the new update
      localStorage.removeItem("porahi_inventory");
      localStorage.removeItem("porahi_orders");
      localStorage.removeItem("porahi_deleted_orders");
      localStorage.setItem("porahi_app_version", APP_VERSION);
      return INITIAL_PRODUCTS;
    }

    const saved = localStorage.getItem("porahi_inventory");
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migrate old products to new property names
      return parsed.map((p: any) => ({
        ...p,
        imageType: p.imageType || (p.designLocation === "Solo Reversa" ? "SÓLO REVERSA" : p.designLocation === "Solo Frente" ? "SÓLO FRENTE" : p.designLocation === "Frente y Reversa" ? "FRENTE Y REVERSA" : "SÓLO FRENTE"),
        frenteImage: p.frenteImage || p.image || "",
        reversaImage: p.reversaImage || p.backImage || "",
        hasSizes: p.hasSizes !== undefined ? p.hasSizes : true,
        specialLabel: p.specialLabel || "Ninguna"
      }));
    }
    // Default initial products
    return INITIAL_PRODUCTS.map(p => ({ 
      ...p, 
      hasSizes: true,
      specialLabel: "Ninguna" as SpecialLabel
    }));
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    localStorage.setItem("porahi_inventory", JSON.stringify(products));
  }, [products]);

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct = {
      ...productData,
      id: Math.max(...products.map((p) => p.id), 0) + 1,
    };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: number, productData: Product) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...productData, id } : p))
    );
  };

  const deleteProduct = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const restoreProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const importProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
  };

  // Derived data
  const themes = Array.from(new Set(products.map((p) => p.theme.trim().toUpperCase()))).sort();
  const categories = Array.from(new Set(products.map((p) => p.category.trim().toUpperCase()))).sort();

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        importProducts,
        themes,
        categories,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
