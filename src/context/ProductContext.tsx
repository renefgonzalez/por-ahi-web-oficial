import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { PRODUCTS } from "../constants";

export type SpecialLabel = "Ninguna" | "Nuevo Lanzamiento" | "Rebajas" | "Destacado";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category: string; 
  type: string; 
  theme: string; 
  imageType: string; 
  frenteImage: string;
  reversaImage?: string;
  hasSizes: boolean;
  specialLabel?: SpecialLabel;
  created_at?: string;
}

interface ProductContextType {
  products: Product[];
  isLoading: boolean;
  addProduct: (product: Omit<Product, "id">) => Promise<Product | null>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  restoreProduct: (product: Product) => Promise<void>;
  importProducts: (products: Product[]) => Promise<void>;
  themes: string[];
  categories: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  refreshProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      
      if (!data || data.length === 0) {
        setProducts(PRODUCTS as unknown as Product[]);
      } else {
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(PRODUCTS as unknown as Product[]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    // Set up real-time subscription
    const subscription = supabase
      .channel('products_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, () => {
        fetchProducts();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const addProduct = async (productData: Omit<Product, "id">) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding product:', error);
      return null;
    }
  };

  const updateProduct = async (id: number, productData: Partial<Product>) => {
    try {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const restoreProduct = async (product: Product) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, created_at, ...dataToInsert } = product as any;
    await addProduct(dataToInsert);
  };

  const importProducts = async (newProducts: Product[]) => {
    try {
      // Basic implementation for bulk import
      const { error } = await supabase
        .from('products')
        .insert(newProducts.map(({ id, ...rest }) => rest)); // strip existing IDs

      if (error) throw error;
    } catch (error) {
      console.error('Error importing products:', error);
    }
  };

  // Derived data
  const themes = Array.from(new Set(products.map((p) => p.theme?.trim().toUpperCase() || ''))).filter(Boolean).sort();
  const categories = Array.from(new Set(products.map((p) => p.type?.trim().toUpperCase() || p.category?.trim().toUpperCase() || ''))).filter(Boolean).sort();

  return (
    <ProductContext.Provider
      value={{
        products,
        isLoading,
        addProduct,
        updateProduct,
        deleteProduct,
        restoreProduct,
        importProducts,
        themes,
        categories,
        searchQuery,
        setSearchQuery,
        refreshProducts: fetchProducts,
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
