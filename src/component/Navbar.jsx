import React from 'react';

function Navbar({ toggleSidebar }) {
  return (
    <header className="custom-nav shadow-sm">
      {/* Tombol Hamburger */}
      <button className="hamburger-btn" onClick={toggleSidebar}>
        <i className="bi bi-list"></i>
      </button>
      
      {/* Nama Toko */}
      <h4 className="fw-bold text-blue m-0">TOKO ACIAK</h4>
    </header>
  );
}

export default Navbar;