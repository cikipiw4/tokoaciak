import React, { useState, useEffect } from 'react';
import { db } from "../../../services/firebase";
import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";
import ProductCard from "../../../component/ProductCard";

function Dashboard({ isAdmin, onAdd }) {
  const [bannerUrl, setBannerUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  // Ambil data banner terbaru dari Firebase
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "banner_promo"), (docSnap) => {
      if (docSnap.exists()) {
        setBannerUrl(docSnap.data().url);
      }
    });
    return () => unsub();
  }, []);

  // Fungsi upload banner baru ke Cloudinary (mirip upload produk)
  const handleBannerChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tokoaciak"); // Sesuai preset kamu

    try {
      const resp = await fetch("https://api.cloudinary.com/v1_1/dhdi60xub/image/upload", {
        method: "POST",
        body: formData
      });
      const data = await resp.json();
      
      // Simpan URL banner baru ke Firebase
      await setDoc(doc(db, "settings", "banner_promo"), {
        url: data.secure_url
      });
      alert("Banner Promo Berhasil Diganti!");
    } catch (error) {
      alert("Gagal ganti banner: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container-fluid pb-5">
      {/* SECTION BANNER */}
      <div className="position-relative mb-4 mt-3">
        <div className="rounded-4 shadow-sm overflow-hidden bg-light" style={{ minHeight: '150px' }}>
          {bannerUrl ? (
            <img src={bannerUrl} alt="Promo Toko Aciak" className="w-100 img-fluid" style={{ objectFit: 'cover', maxHeight: '300px' }} />
          ) : (
            <div className="p-5 text-center text-muted">Belum ada banner promo.</div>
          )}
        </div>

        {/* Tombol Edit Banner (Hanya muncul jika isAdmin true) */}
        {isAdmin && (
          <div className="position-absolute bottom-0 end-0 m-3">
            <label className="btn btn-dark btn-sm rounded-pill shadow">
              <i className="bi bi-pencil-square me-2"></i>
              {uploading ? "Mengupload..." : "Ganti Promo"}
              <input type="file" hidden onChange={handleBannerChange} disabled={uploading} />
            </label>
          </div>
        )}
      </div>

      <h5 className="fw-bold mb-3">Produk Pilihan</h5>
      <ProductCard onAdd={onAdd} isAdmin={isAdmin} />
    </div>
  );
}

export default Dashboard;