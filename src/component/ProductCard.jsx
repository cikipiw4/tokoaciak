import React, { useState, useEffect } from 'react';
import { db } from "../services/firebase"; 
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp, 
  doc, 
  deleteDoc 
} from "firebase/firestore";

// Kategori tetap yang akan selalu muncul di web pembeli dan input admin
const LIST_KATEGORI = ["Semua", "Makanan", "Minuman", "Cemilan", "Kebutuhan Rumah"];

function ProductCard({ onAdd, isAdmin }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Semua"); // Default memilih "Semua"
  const [searchTerm, setSearchTerm] = useState(""); // State untuk kolom pencarian
  
  // Default input admin otomatis memilih kategori pertama selain "Semua" (yaitu "Makanan")
  const [newProduct, setNewProduct] = useState({ nama: '', harga: '', kategori: 'Makanan' });
  const [selectedFile, setSelectedFile] = useState(null);

  // Ambil data dari Firestore secara Real-time
  useEffect(() => {
    const q = query(collection(db, "produk"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs
        .map(doc => {
          const data = doc.data();
          if (!data.createdAt) return null; 
          
          // ANTISIPASI PRODUK LAMA: Jika di Firestore belum ada field 'kategori',
          // kita beri fallback otomatis ke nilai "Umum" agar data tidak kosong/error.
          return { 
            id: doc.id, 
            ...data,
            kategori: data.kategori || "Umum" 
          };
        })
        .filter(item => item !== null);

      setProducts(items);
    }, (error) => {
      console.error("Firestore error:", error);
    });

    return () => unsubscribe();
  }, []);

  // Fungsi Hapus Produk
  const handleDelete = async (productId, productName) => {
    const confirmDelete = window.confirm(`Hapus "${productName}" dari daftar stok?`);
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "produk", productId));
      } catch (err) {
        alert("Gagal menghapus: " + err.message);
      }
    }
  };

  // Fungsi Upload Image ke Cloudinary
  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tokoaciak"); 

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dhdi60xub/image/upload", 
      { method: "POST", body: formData }
    );

    if (!response.ok) throw new Error("Gagal upload gambar");
    const data = await response.json();
    return data.secure_url; 
  };

  // Fungsi Simpan Produk Baru (Oleh Admin)
  const handleSave = async () => {
    if (!newProduct.nama || !newProduct.harga || !newProduct.kategori || !selectedFile) {
      alert("Lengkapi Nama, Harga, Kategori, dan Foto Barang!");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(selectedFile);
      
      // Simpan data lengkap ke Firestore
      await addDoc(collection(db, "produk"), {
        nama: newProduct.nama,
        harga: Number(newProduct.harga),
        kategori: newProduct.kategori, // Menyimpan string kategori baru ke DB
        image: imageUrl,
        createdAt: serverTimestamp()
      });

      setNewProduct({ nama: '', harga: '', kategori: 'Makanan' });
      setSelectedFile(null);
      setShowForm(false);
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  // LOGIKA FILTER GANDA: Menyaring berdasarkan kategori yang ditekan pembeli DAN teks pencarian
  const filteredProducts = products.filter(product => {
    // Jika tombol "Semua" aktif, loloskan semua barang. 
    // Jika tombol lain aktif, pastikan kategori produk cocok.
    const matchesCategory = selectedCategory === "Semua" || product.kategori === selectedCategory;
    
    // Menyaring teks pencarian (diubah ke huruf kecil agar tidak sensitif kapital)
    const matchesSearch = product.nama.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="px-1">
      
      {/* 1. BAR PENCARIAN DENGAN IKON */}
      <div className="mb-3">
        <div className="input-group shadow-sm rounded-pill overflow-hidden border">
          <span className="input-group-text bg-white border-0 pe-0 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input 
            type="text" 
            className="form-control border-0 ps-2 py-2 small fs-6" 
            placeholder="Cari produk di sini..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button 
              className="btn bg-white border-0 text-muted" 
              onClick={() => setSearchTerm("")}
              type="button"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 2. TOMBOL/TAB FILTER KATEGORI (Selalu memunculkan LIST_KATEGORI lengkap di web pembeli) */}
      <div className="d-flex gap-2 overflow-x-auto pb-3 mb-3" style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}>
        {LIST_KATEGORI.map((kat) => (
          <button
            key={kat}
            className={`btn btn-sm rounded-pill px-3 fw-bold text-nowrap ${
              selectedCategory === kat ? 'btn-primary' : 'btn-light text-muted'
            }`}
            onClick={() => setSelectedCategory(kat)} // Jika ditekan, langsung menyaring produk
          >
            {kat}
          </button>
        ))}
      </div>

      {/* 3. GRID UTAMA PRODUK */}
      <div className="row g-3">
        {/* FORM TAMBAH BARANG (KHUSUS MODE ADMIN) */}
        {isAdmin && (
          <div className="col-6 col-md-3">
            {!showForm ? (
              <div 
                className="card border-0 shadow-sm rounded-4 h-100 d-flex align-items-center justify-content-center text-muted text-center"
                style={{ border: '2px dashed #0d6efd', cursor: 'pointer', minHeight: '220px', backgroundColor: '#f8faff' }}
                onClick={() => setShowForm(true)}
              >
                <div className="p-3">
                  <i className="bi bi-plus-circle fs-1 text-primary"></i>
                  <p className="fw-bold small mt-2">Tambah Stok</p>
                </div>
              </div>
            ) : (
              <div className="card border-0 shadow-sm rounded-4 h-100 p-3 bg-white">
                <input type="text" className="form-control form-control-sm mb-2" placeholder="Nama Barang" 
                  value={newProduct.nama} onChange={e => setNewProduct({...newProduct, nama: e.target.value})} />
                
                <input type="number" className="form-control form-control-sm mb-2" placeholder="Harga" 
                  value={newProduct.harga} onChange={e => setNewProduct({...newProduct, harga: e.target.value})} />
                
                {/* Pilihan kategori untuk Admin saat input barang baru */}
                <select 
                  className="form-select form-select-sm mb-2"
                  value={newProduct.kategori}
                  onChange={e => setNewProduct({...newProduct, kategori: e.target.value})}
                >
                  {/* Membuang opsi "Semua" agar admin tidak mendaftarkan barang bermerek "Semua" */}
                  {LIST_KATEGORI.filter(k => k !== "Semua").map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>

                <input type="file" className="form-control form-control-sm mb-3" accept="image/*"
                  onChange={(e) => setSelectedFile(e.target.files[0])} />
                
                <div className="d-flex gap-2">
                  <button className="btn btn-primary btn-sm w-100 rounded-pill fw-bold" onClick={handleSave} disabled={uploading}>
                    {uploading ? "..." : "Simpan"}
                  </button>
                  <button className="btn btn-light btn-sm rounded-circle" onClick={() => setShowForm(false)}>✕</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* RENDERING KARTU PRODUK HASIL FILTER */}
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <div className="col-6 col-md-3" key={item.id}>
              <div className="card border-0 shadow-sm rounded-4 h-100 p-3 text-center position-relative d-flex flex-column justify-content-between">
                <div>
                  {isAdmin && (
                    <button 
                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                      onClick={() => handleDelete(item.id, item.nama)}
                      style={{ width: '30px', height: '30px', padding: '0', zIndex: 10 }}
                    >
                      <i className="bi bi-trash-fill" style={{ fontSize: '0.8rem' }}></i>
                    </button>
                  )}

                  <img src={item.image} alt={item.nama} style={{ height: '120px', objectFit: 'contain' }} className="mb-2" />
                  
                  {/* Label Kategori Kecil di atas nama produk */}
                  <div className="text-start mb-1">
                    <span className="badge bg-secondary-subtle text-secondary rounded-pill" style={{ fontSize: '0.65rem' }}>
                      {item.kategori}
                    </span>
                  </div>

                  <h6 className="small fw-bold mb-1 text-truncate text-start">{item.nama}</h6>
                  <p className="text-primary fw-bold small mb-2 text-start">Rp {Number(item.harga).toLocaleString('id-ID')}</p>
                </div>

                <button className="btn btn-outline-primary btn-sm w-100 rounded-pill mt-2" onClick={() => onAdd(item)}>
                  + Keranjang
                </button>
              </div>
            </div>
          ))
        ) : (
          /* Tampilan fallback jika kategori kosong atau tidak ada hasil pencarian kata */
          <div className="col-12 text-center my-5 text-muted">
            <i className="bi bi-box-seam fs-2"></i>
            <p className="mt-2 small fw-bold">Belum ada barang di kategori ini</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;