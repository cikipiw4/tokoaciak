import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../../services/firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

function Pengaturan() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Pantau status login secara otomatis di halaman ini
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fungsi Masuk (Login)
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Berhasil! Mode Admin Aktif.");
      setShowLoginForm(false);
      navigate('/'); // Kembali ke Dashboard untuk lihat fitur tambah produk
    } catch (error) {
      alert("Email atau Password salah!");
    }
  };

  // Fungsi Keluar (Logout)
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Berhasil keluar. Anda kembali menjadi pengunjung biasa.");
      navigate('/'); 
    } catch (error) {
      alert("Gagal logout: " + error.message);
    }
  };

  return (
    <div className="container-fluid py-4 text-center">
      <div className="card border-0 shadow-sm p-5 rounded-4 bg-white mx-auto" style={{maxWidth: '500px'}}>
        <h2 className="fw-bold text-blue mb-3" onClick={() => setShowLoginForm(!showLoginForm)} style={{cursor: 'pointer'}}>
          TOKO ACIAK
        </h2>
        <p className="text-muted italic small">Sembako Murah, Pengantaran Cepat</p>
        <hr />
        
        {/* TAMPILAN JIKA SUDAH LOGIN (PANEL ADMIN) */}
        {isLoggedIn ? (
          <div className="py-4">
            <div className="badge bg-success-light text-success px-3 py-2 rounded-pill mb-3">
              <i className="bi bi-check-circle-fill me-2"></i>
              Mode Admin Aktif
            </div>
            <h5 className="fw-bold mb-4">Halo Admin Aciak!</h5>
            <p className="small text-muted mb-4">Anda sekarang bisa menambah produk dan melihat rekap pesanan pelanggan.</p>
            
            <div className="d-grid gap-2">
              <button onClick={() => navigate('/admin-rekap')} className="btn btn-blue py-2 fw-bold">
                Lihat Rekap Pesanan
              </button>
              <button onClick={handleLogout} className="btn btn-outline-danger py-2 fw-bold">
                Keluar dari Mode Admin
              </button>
            </div>
          </div>
        ) : (
          /* TAMPILAN JIKA BELUM LOGIN (INFO TOKO / FORM LOGIN) */
          <div>
            {!showLoginForm ? (
              <div className="text-secondary py-3">
                <p>Melayani pemesanan sembako secara daring untuk wilayah sekitar.</p>
                <p>Sistem pembayaran <strong>Cash on Delivery (COD)</strong>.</p>
                <button 
                  className="btn btn-light btn-sm mt-3 text-muted" 
                  onClick={() => setShowLoginForm(true)}
                >
                  Admin Login
                </button>
              </div>
            ) : (
              <div className="mt-2 p-4 border-0 rounded-4 bg-light shadow-inner">
                <h5 className="fw-bold mb-3 small text-uppercase text-primary">Login Petugas</h5>
                <form onSubmit={handleLogin}>
                  <input 
                    type="email" 
                    className="form-control mb-2 border-0 shadow-sm" 
                    placeholder="Email Admin" 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                  />
                  <input 
                    type="password" 
                    className="form-control mb-3 border-0 shadow-sm" 
                    placeholder="Password" 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                  <button type="submit" className="btn btn-primary w-100 fw-bold py-2 shadow-sm">
                    MASUK SEKARANG
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-link btn-sm w-100 mt-2 text-decoration-none text-muted"
                    onClick={() => setShowLoginForm(false)}
                  >
                    Batal
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Pengaturan;