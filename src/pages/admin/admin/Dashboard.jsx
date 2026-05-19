import React, { useState, useEffect } from 'react';
import { db } from "../../../services/firebase";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import ProductCard from "../../../component/ProductCard";

function Dashboard({ isAdmin, onAdd }) {
  const [promoText, setPromoText] = useState("Sembako murah, Pengantaran Cepat");
  const [bannerImg, setBannerImg] = useState("https://via.placeholder.com/400x300"); // State untuk gambar dinamis
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState("");
  const [uploading, setUploading] = useState(false); // State loading saat upload gambar

  // Ambil teks promo DAN gambar dari Firebase secara real-time
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "banner_promo"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.teks) setPromoText(data.teks);
        if (data.imageUrl) setBannerImg(data.imageUrl); // Ambil link gambar dari Firebase jika ada
      }
    });
    return () => unsub();
  }, []);

  // Fungsi upload gambar langsung ke Cloudinary
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Tidak ada file yang dipilih.");
      return;
    }

    // Validasi ukuran file (Maksimal 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar terlalu besar! Maksimal adalah 2MB.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "tokoaciak"); // Preset yang terbukti sukses di ProductCard
    formData.append("cloud_name", "dhdi60xub");     

    try {
      // Kirim data ke API Cloudinary milikmu
      const res = await fetch("https://api.cloudinary.com/v1_1/dhdi60xub/image/upload", {
        method: "POST",
        body: formData
      });
      
      const fileData = await res.json();
      
      if (res.ok && fileData.secure_url) {
        // Simpan URL gambar hasil upload Cloudinary ke Firebase (menggunakan merge agar teks tidak hilang)
        await setDoc(doc(db, "settings", "banner_promo"), {
          imageUrl: fileData.secure_url
        }, { merge: true });

        alert("Gambar banner berhasil diperbarui!");
      } else {
        console.error("Detail Error Cloudinary:", fileData);
        // Memunculkan alasan error spesifik dari Cloudinary ke Alert layar
        alert(`Cloudinary Menolak: ${fileData.error?.message || "Format file tidak didukung atau preset salah."}`);
      }
    } catch (error) {
      alert("Koneksi gagal atau terputus: " + error.message);
    } finally {
      setUploading(false);
      // Reset nilai input file agar bisa memilih gambar yang sama jika tadi gagal
      e.target.value = "";
    }
  };

  // Fungsi simpan teks baru dengan penambahan { merge: true } agar gambar tidak terhapus
  const handleSaveText = async () => {
    try {
      await setDoc(doc(db, "settings", "banner_promo"), {
        teks: newText
      }, { merge: true });
      setIsEditing(false);
      alert("Promo berhasil diperbarui!");
    } catch (error) {
      alert("Gagal: " + error.message);
    }
  };

  return (
    <div className="container-fluid pb-5">
      {/* SECTION BANNER BIRU (Sesuai Foto Toko Aciak) */}
      <div className="mb-4 mt-3">
        <div className="rounded-4 shadow-sm p-4 text-white position-relative overflow-hidden" 
             style={{ 
               background: 'linear-gradient(135deg, #002244 0%, #004488 60%, #0066cc 100%)', 
               minHeight: '280px'
             }}>
          
          <div className="row align-items-center">
            
            {/* KOLOM KIRI: Judul, Teks Dinamis Firebase, & Poin Fitur */}
            <div className="col-md-7 z-1">
              {/* Header Nama Toko dengan Ikon Keranjang */}
              <div className="d-flex align-items-center mb-3">
                <div className="bg-white text-primary rounded-circle p-2 me-3 d-inline-flex justify-content-center align-items-center" style={{ width: '45px', height: '45px' }}>
                  <i className="bi bi-cart-fill fs-5"></i>
                </div>
                <h1 className="fw-bold m-0 tracking-wide" style={{ letterSpacing: '1px' }}>TOKO ACIAK</h1>
              </div>
              
              {/* Box Putih 1: Diisi teks dinamis dari Firebase */}
              <div className="bg-white text-dark p-3 rounded-3 mb-2 shadow-sm d-flex align-items-center">
                <i className="bi bi-bag-check-fill text-primary fs-4 me-3"></i>
                {isEditing ? (
                  <div className="d-flex gap-2 w-100">
                    <input 
                      type="text" 
                      className="form-control form-control-sm" 
                      value={newText} 
                      onChange={(e) => setNewText(e.target.value)}
                      placeholder="Ketik promo baru..."
                    />
                    <button className="btn btn-success btn-sm" onClick={handleSaveText}>Simpan</button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setIsEditing(false)}>Batal</button>
                  </div>
                ) : (
                  <h6 className="fw-bold m-0">{promoText}</h6>
                )}
              </div>
              
              {/* Box Putih 2: Tambahan statis */}
              <div className="bg-white text-dark p-3 rounded-3 mb-4 shadow-sm d-flex align-items-center">
                <i className="bi bi-phone-vibrate-fill text-primary fs-4 me-3"></i>
                <h6 className="fw-bold m-0">Belanja Sembako Jadi Lebih Praktis</h6>
              </div>

              {/* Baris Mini Fitur di Bagian Bawah Banner */}
              <div className="row text-dark g-2 small text-center">
                <div className="col-6 col-sm-3">
                  <div className="bg-light p-2 rounded-2 shadow-sm fw-semibold"><i className="bi bi-box-seam text-primary me-1"></i> Sembako Lengkap</div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="bg-light p-2 rounded-2 shadow-sm fw-semibold"><i className="bi bi-tags text-primary me-1"></i> Harga Sahabat</div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="bg-light p-2 rounded-2 shadow-sm fw-semibold"><i className="bi bi-lightning-charge-fill text-primary me-1"></i> Lebih Praktis</div>
                </div>
                <div className="col-6 col-sm-3">
                  <div className="bg-light p-2 rounded-2 shadow-sm fw-semibold"><i className="bi bi-truck text-primary me-1"></i> Antar Cepat</div>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN: Gambar Dinamis dari Cloudinary */}
            <div className="col-md-5 text-center mt-4 mt-md-0 position-relative">
              <img 
                src={bannerImg} 
                alt="Sembako Toko Aciak" 
                className="img-fluid" 
                style={{ maxHeight: '250px', objectFit: 'contain' }}
              />
              
              {/* Tombol Unggah Gambar Baru (Hanya Muncul Jika Admin Mode Aktif) */}
              {isAdmin && (
                <div className="mt-3">
                  <label htmlFor="upload-banner-file" className="btn btn-sm btn-light border shadow-sm fw-semibold">
                    {uploading ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                        Mengunggah...
                      </span>
                    ) : (
                      <span><i className="bi bi-image me-1"></i> Ganti Gambar</span>
                    )}
                  </label>
                  <input 
                    type="file" 
                    id="upload-banner-file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }}
                    disabled={uploading}
                  />
                </div>
              )}
            </div>

          </div>

          {/* Tombol Edit Teks (Hanya Admin) - ditaruh dipojok banner */}
          {isAdmin && !isEditing && (
            <button 
              className="btn btn-sm btn-light position-absolute top-0 end-0 m-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center"
              onClick={() => {
                setIsEditing(true);
                setNewText(promoText);
              }}
              style={{ width: '35px', height: '35px' }}
            >
              <i className="bi bi-pencil-fill" style={{ fontSize: '0.9rem' }}></i>
            </button>
          )}

        </div>
      </div>

      {/* Bagian List Produk */}
      <h5 className="fw-bold mb-3 px-1">Produk Pilihan</h5>
      <ProductCard onAdd={onAdd} isAdmin={isAdmin} />
    </div>
  );
}

export default Dashboard;