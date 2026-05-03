import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Wajib import Link dan useLocation

function Sidebar() {
  const location = useLocation(); // Mendeteksi halaman mana yang sedang dibuka

  return (
    <aside className="sidebar shadow">
      <div className="p-4 border-bottom text-center">
        <h5 className="fw-bold text-blue m-0">MENU UTAMA</h5>
      </div>
      <div className="mt-3">
        {/* Navigasi ke Dashboard */}
        <Link 
          to="/" 
          className={`menu-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <i className="bi bi-grid-1x2"></i> Dashboard
        </Link>

        {/* Navigasi ke Produk Toko (ProductCard) */}
        <Link 
          to="/products" 
          className={`menu-item ${location.pathname === '/products' ? 'active' : ''}`}
        >
          <i className="bi bi-box-seam"></i> Produk Toko
        </Link>

        {/* Ganti Nama di Sini */}
        <Link 
          to="/cart" 
          className={`menu-item ${location.pathname === '/cart' ? 'active' : ''}`}
        >
          <i className="bi bi-cart"></i> Keranjang
        </Link>
       <Link 
          to="/about" 
          className={`menu-item ${location.pathname === '/about' ? 'active' : ''}`}
        >
          <i className="bi bi-info-circle"></i> About
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;