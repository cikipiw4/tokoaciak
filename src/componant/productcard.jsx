import React, { useState } from 'react';

// Data produk tetap di sini agar mudah dikelola
export const initialProducts = [
  { id: 1, nama: 'Beras Ramos 5kg', harga: 65000, stok: 12, img: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400' },
  { id: 2, nama: 'Minyak Goreng 2L', harga: 34000, stok: 5, img: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400' },
  { id: 3, nama: 'Gula Pasir 1kg', harga: 16000, stok: 45, img: 'https://images.unsplash.com/photo-1581441363689-1f3c3c414635?w=400' },
  { id: 4, nama: 'Kopi Bubuk 200g', harga: 12000, stok: 20, img: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400' },
  { id: 5, nama: 'Sabun Mandi Cair', harga: 18000, stok: 15, img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400' },
  { id: 6, nama: 'Susu Kental Manis', harga: 15000, stok: 30, img: 'https://images.unsplash.com/photo-1550583724-125581f75633?w=400' },
];

// Tambahkan prop onAdd di sini agar bisa menerima fungsi dari App.jsx
function ProductCard({ showSearch = true, onAdd }) {
  const [search, setSearch] = useState("");
  const categories = ['Semua', 'Sembako', 'Dapur', 'Minuman', 'Mandi', 'Camilan'];

  const filtered = initialProducts.filter(p => p.nama.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      {/* Search Bar & Kategori Belanja */}
      {showSearch && (
        <>
          <div className="search-box d-flex mb-4 shadow-sm">
            <input 
              type="text" className="form-control border-0 py-3 ps-4 shadow-none" 
              placeholder="Mau belanja apa hari ini di Toko Aciak?" 
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn-blue m-1 px-4">Cari</button>
          </div>

          <div className="d-flex gap-2 mb-4 overflow-auto pb-2">
            {categories.map((cat, i) => (
              <button key={cat} className={`btn btn-sm rounded-pill px-4 py-2 shadow-sm ${i === 0 ? 'btn-blue' : 'btn-light bg-white border'}`}>
                {cat}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Grid Produk */}
      <div className="row row-cols-2 row-cols-md-4 row-cols-lg-6 g-3">
        {filtered.map(p => (
          <div className="col" key={p.id}>
            <div className="card h-100 hover-card bg-white p-2 border-0 shadow-sm">
              <img src={p.img} className="card-img-top rounded-3" style={{ height: '140px', objectFit: 'cover' }} alt={p.nama} />
              <div className="card-body px-1 py-2">
                <h6 className="text-truncate fw-bold mb-1" style={{fontSize: '0.85rem'}}>{p.nama}</h6>
                <p className="text-danger fw-bold mb-2">Rp {p.harga.toLocaleString('id-ID')}</p>
                <div className="d-flex justify-content-between align-items-center">
                  <small className="text-muted" style={{fontSize: '0.7rem'}}>{p.stok} Tersedia</small>
                  {/* Tombol dikasih onClick untuk menjalankan fungsi onAdd */}
                  <button 
                    className="btn btn-sm btn-blue rounded-circle py-0 px-2"
                    onClick={() => onAdd && onAdd(p)}
                  >
                    <i className="bi bi-cart-plus"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ProductCard;