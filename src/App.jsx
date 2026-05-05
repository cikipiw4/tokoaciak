import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from "./services/firebase"; // Pastikan path benar
import { onAuthStateChanged } from "firebase/auth";

import Sidebar from './component/Sidebar';
import Navbar from './component/Navbar';
import ProductCard from './component/ProductCard';
import Dashboard from './pages/admin/admin/Dashboard';
import Pengaturan from './pages/admin/admin/Pengaturan';
import Keranjang from './pages/admin/client/Keranjang';

import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false); // Default: Bukan Admin
  
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('toko_aciak_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Pantau status Login secara Real-time
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAdmin(true); // Jika login, aktifkan fitur admin
      } else {
        setIsAdmin(false); // Jika logout, sembunyikan fitur admin
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('toko_aciak_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => [...prevCart, product]);
    alert(`${product.nama} masuk keranjang!`);
  };

  if (loading) return (
    <div className="loading-screen text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <h5 className="mt-3 fw-bold text-blue">TOKO ACIAK</h5>
    </div>
  );

  return (
    <Router>
      <div className={`dashboard-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="overlay" onClick={() => setIsSidebarOpen(false)}></div>
        <Sidebar cartCount={cart.length} isAdmin={isAdmin} />
        <main className="main-content">
          <Navbar 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            cartCount={cart.length} 
          />
          <div className="content-body container-fluid py-4">
            <Routes>
              {/* Kirim status isAdmin ke Dashboard & ProductCard */}
              <Route path="/" element={<Dashboard onAdd={addToCart} isAdmin={isAdmin} />} />
              <Route path="/products" element={<ProductCard onAdd={addToCart} isAdmin={isAdmin} />} />
              <Route path="/cart" element={<Keranjang cart={cart} setCart={setCart} isAdmin={false} />} />
              <Route path="/about" element={<Pengaturan />} />
              <Route path="/admin-rekap" element={<Keranjang cart={cart} setCart={setCart} isAdmin={isAdmin} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;