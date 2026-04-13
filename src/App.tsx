import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Info from "./pages/Info";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
import Cart from "./components/Cart";
import AddToCartModal from "./components/AddToCartModal";
import { CartProvider } from "./context/CartContext";
import { ProductProvider } from "./context/ProductContext";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-center" expand={false} richColors theme="dark" />
          <Navbar />
          <ErrorBoundary>
            <Cart />
          </ErrorBoundary>
          <AddToCartModal />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/info" element={<Info />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}
