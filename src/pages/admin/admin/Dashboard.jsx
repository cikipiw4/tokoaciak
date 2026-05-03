import React from 'react';
import ProductCard from '../../../componant/productCard';

function Dashboard({ onAdd }) {
  return (
    <div className="container-fluid py-4">
      {/* Banner Biru Pesta Sembako Murah - UI TETAP SAMA */}
      <div className="card border-0 rounded-4 mb-4 text-white bg-blue-gradient shadow-sm">
        <div className="card-body p-4">
          <h1 className="fw-bold mb-1 text-white">Pesta Sembako Murah!</h1>
          <p className="mb-3 fs-5 opacity-90">Beli 3 gratis ongkir keliling kampung.</p>
          <div className="badge bg-white text-primary px-3 py-2 fs-6 shadow-sm">
            KODE: <span className="fw-bold">ACIAKHEMAT</span>
          </div>
        </div>
      </div>

      {/* Kirim fungsi onAdd ke ProductCard agar tombol di sana bisa berfungsi */}
      <ProductCard onAdd={onAdd} />
    </div>
  );
}

export default Dashboard;