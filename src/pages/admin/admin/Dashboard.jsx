import React, { useState, useEffect } from 'react';
import { db } from "../../../services/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import ProductCard from "../../../component/ProductCard";

function Dashboard({ isAdmin, onAdd }) {
  const [promoText, setPromoText] = useState("Sembako murah, Pengantaran Cepat");
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState("");

  // Ambil teks promo dari Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "banner_promo"), (docSnap) => {
      if (docSnap.exists()) {
        setPromoText(docSnap.data().teks);
      }
    });
    return () => unsub();
  }, []);

  // Fungsi simpan teks baru
  const handleSaveText = async () => {
    try {
      await setDoc(doc(db, "settings", "banner_promo"), {
        teks: newText
      });
      setIsEditing(false);
      alert("Promo berhasil diperbarui!");
    } catch (error) {
      alert("Gagal: " + error.message);
    }
  };

  return (
    <div className="container-fluid pb-5">
      {/* SECTION BANNER BIRU */}
      <div className="mb-4 mt-3">
        <div className="rounded-4 shadow-sm p-4 text-white text-center position-relative" 
             style={{ 
               background: 'linear-gradient(45deg, #0d6efd, #0099ff)', 
               minHeight: '120px',
               display: 'flex',
               flexDirection: 'column',
               justifyContent: 'center',
               alignItems: 'center'
             }}>
          
          <h2 className="fw-bold mb-1">TOKO ACIAK</h2>
          
          {isEditing ? (
            <div className="d-flex gap-2 mt-2">
              <input 
                type="text" 
                className="form-control form-control-sm" 
                value={newText} 
                onChange={(e) => setNewText(e.target.value)}
                placeholder="Ketik promo baru..."
              />
              <button className="btn btn-success btn-sm" onClick={handleSaveText}>Simpan</button>
              <button className="btn btn-light btn-sm" onClick={() => setIsEditing(false)}>Batal</button>
            </div>
          ) : (
            <p className="lead mb-0" style={{ fontSize: '1.1rem' }}>{promoText}</p>
          )}

          {/* Tombol Edit Teks (Hanya Admin) */}
          {isAdmin && !isEditing && (
            <button 
              className="btn btn-sm btn-light position-absolute bottom-0 end-0 m-2 rounded-circle shadow-sm"
              onClick={() => {
                setIsEditing(true);
                setNewText(promoText);
              }}
              style={{ width: '30px', height: '30px', padding: '0' }}
            >
              <i className="bi bi-pencil-fill" style={{ fontSize: '0.8rem' }}></i>
            </button>
          )}
        </div>
      </div>

      <h5 className="fw-bold mb-3 px-1">Produk Pilihan</h5>
      <ProductCard onAdd={onAdd} isAdmin={isAdmin} />
    </div>
  );
}

export default Dashboard;