import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../../../services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

function Pengaturan() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login Berhasil!");
      navigate('/admin-rekap'); 
    } catch (error) {
      alert("Email atau Password salah!");
    }
  };

  return (
    <div className="container-fluid py-4 text-center">
      <div className="card border-0 shadow-sm p-5 rounded-4 bg-white">
        <h2 className="fw-bold text-blue mb-3" onClick={() => setShowLogin(!showLogin)} style={{cursor: 'pointer'}}>
          TOKO ACIAK
        </h2>
        <p className="text-muted italic small">Sembako Murah, Pengantaran Cepat</p>
        <hr />
        
        {!showLogin ? (
          <div className="text-secondary py-3">
            <p>Melayani pemesanan sembako secara daring untuk wilayah sekitar.</p>
            <p>Sistem pembayaran <strong>Cash on Delivery (COD)</strong>.</p>
          </div>
        ) : (
          <div className="mt-4 p-4 border rounded-4 bg-light mx-auto" style={{maxWidth: '350px'}}>
            <h5 className="fw-bold mb-3 small text-uppercase">Admin Login</h5>
            <form onSubmit={handleLogin}>
              <input type="email" className="form-control mb-2" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
              <input type="password" className="form-control mb-3" placeholder="Password" onChange={e => setPassword(e.target.value)} required />
              <button type="submit" className="btn-blue w-100">MASUK</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default Pengaturan;