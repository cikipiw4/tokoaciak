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
} from "firebase/firestore"; // Ditambahkan doc dan deleteDoc

function ProductCard({ onAdd, isAdmin }) {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newProduct, setNewProduct] = useState({ nama: '', harga: '' });
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const q = query(collection(db, "produk"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Fungsi Hapus Produk dari Firebase
  const handleDelete = async (productId, productName) => {
    const confirmDelete = window.confirm(`Hapus "${productName}" dari daftar stok?`);
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "produk", productId));
        alert("Produk berhasil dihapus!");
      } catch (err) {
        alert("Gagal menghapus: " + err.message);
      }
    }
  };

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

  const handleSave = async () => {
    if (!newProduct.nama || !newProduct.harga || !selectedFile) {
      alert("Lengkapi Nama, Harga, dan Foto Barang!");
      return;
    }

    setUploading(true);
    try {
      const imageUrl = await uploadToCloudinary(selectedFile);
      await addDoc(collection(db, "produk"), {
        nama: newProduct.nama,
        harga: Number(newProduct.harga),
        image: imageUrl,
        createdAt: serverTimestamp()
      });

      setNewProduct({ nama: '', harga: '' });
      setSelectedFile(null);
      setShowForm(false);
      alert("Produk berhasil dipajang di Toko Aciak!");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="row g-3">
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

      {products.map((item) => (
        <div className="col-6 col-md-3" key={item.id}>
          <div className="card border-0 shadow-sm rounded-4 h-100 p-3 text-center position-relative">
            
            {/* TOMBOL HAPUS (Hanya muncul jika isAdmin true) */}
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
            <h6 className="small fw-bold mb-1 text-truncate">{item.nama}</h6>
            <p className="text-primary fw-bold small mb-2">Rp {item.harga.toLocaleString('id-ID')}</p>
            <button className="btn btn-outline-primary btn-sm w-100 rounded-pill" onClick={() => onAdd(item)}>
              + Keranjang
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductCard;