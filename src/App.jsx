import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './componant/Sidebar';
import Navbar from './componant/navbar';
import Dashboard from './pages/admin/admin/dashboard';
import ProductCard from './componant/productcard';
import About from './pages/admin/admin/pengaturan'; 
import Keranjang from './pages/admin/client/keranjang'; 
import './App.css';

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State Keranjang dengan LocalStorage
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('toko_aciak_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('toko_aciak_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

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
        <Sidebar cartCount={cart.length} />
        <main className="main-content">
          <Navbar 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
            cartCount={cart.length} 
          />
          <div className="content-body container-fluid py-4">
            <Routes>
              <Route path="/" element={<Dashboard onAdd={addToCart} />} />
              <Route path="/products" element={<ProductCard onAdd={addToCart} />} />
              <Route path="/cart" element={<Keranjang cart={cart} setCart={setCart} isAdmin={false} />} />
              <Route path="/about" element={<About />} />
              <Route path="/admin-rekap" element={<Keranjang cart={cart} setCart={setCart} isAdmin={true} />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;