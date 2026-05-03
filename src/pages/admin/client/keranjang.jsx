import React, { useState, useEffect } from 'react';
import { db } from "../../../services/firebase"; 
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from "firebase/firestore";

function Keranjang({ cart, setCart, isAdmin = false }) {
  const [customerInfo, setCustomerInfo] = useState({ nama: '', telepon: '', alamat: '' });
  const [adminOrders, setAdminOrders] = useState([]); 
  const totalPrice = cart.reduce((total, item) => total + item.harga, 0);

  // Ambil data untuk Admin
  useEffect(() => {
    if (isAdmin) {
      const q = query(collection(db, "pesanan"), orderBy("timestamp", "desc"));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setAdminOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }
  }, [isAdmin]);

  // Fungsi Hapus Satu Barang
  const hapusBarang = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  // Fungsi Kirim ke Firebase & WhatsApp
  const handleCheckout = async () => {
    if (!customerInfo.nama || !customerInfo.telepon || !customerInfo.alamat) {
      alert("Tolong isi nama, WA, dan alamat dulu ya!");
      return;
    }

    try {
      await addDoc(collection(db, "pesanan"), {
        ...customerInfo,
        items: cart,
        total: totalPrice,
        timestamp: serverTimestamp()
      });

      const daftarBarang = cart.map(item => `- ${item.nama}`).join('%0A');
      const waUrl = `https://wa.me/628123456789?text=Pesanan Baru Toko Aciak!%0A%0ANama: ${customerInfo.nama}%0AAlamat: ${customerInfo.alamat}%0A%0AItems:%0A${daftarBarang}%0A%0ATotal: Rp ${totalPrice.toLocaleString('id-ID')}`;
      
      window.open(waUrl, '_blank');
      setCart([]);
      alert("Pesanan sukses terkirim!");
    } catch (e) {
      alert("Gagal koneksi ke database");
    }
  };

  if (isAdmin) {
    return (
      <div className="container-fluid py-4">
        <h3 className="fw-bold text-blue mb-4">Rekap Pesanan Masuk</h3>
        <div className="row g-3">
          {adminOrders.map(order => (
            <div className="col-md-6 col-lg-4" key={order.id}>
              <div className="card border-0 shadow-sm rounded-4 p-3 border-start border-4 border-primary">
                <div className="d-flex justify-content-between">
                   <h6 className="fw-bold">{order.nama}</h6>
                   <span className="badge bg-light text-primary small">Baru</span>
                </div>
                <div className="bg-light p-2 rounded-3 my-2 small">{order.alamat}</div>
                <div className="small text-muted mb-3">
                   {order.items?.map((it, i) => <div key={i}>• {it.nama}</div>)}
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                   <span className="fw-bold text-blue">Rp {order.total?.toLocaleString('id-ID')}</span>
                   <a href={`https://wa.me/${order.telepon}`} className="btn btn-sm btn-success rounded-pill px-3">Chat WA</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h3 className="fw-bold text-blue mb-4">Keranjang Belanja</h3>
      {cart.length === 0 ? (
        <div className="card border-0 shadow-sm p-5 text-center rounded-4">
          <p className="m-0 text-muted">Belum ada barang dipilih. Yuk belanja!</p>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-3">
              <h6 className="fw-bold text-muted mb-3 small text-uppercase">Daftar Belanja</h6>
              {cart.map((item, index) => (
                <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-3">
                  <div>
                    <span className="fw-bold d-block">{item.nama}</span>
                    <span className="text-blue small">Rp {item.harga.toLocaleString('id-ID')}</span>
                  </div>
                  <button className="btn btn-link text-danger p-0" onClick={() => hapusBarang(index)}>
                    Batalkan
                  </button>
                </div>
              ))}
              <div className="mt-3 text-end fw-bold fs-5 text-blue">
                Total: Rp {totalPrice.toLocaleString('id-ID')}
              </div>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white">
              <h6 className="fw-bold text-muted mb-3 small text-uppercase">Data Antaran</h6>
              <input type="text" className="form-control mb-2" placeholder="Nama Anda" onChange={e => setCustomerInfo({...customerInfo, nama: e.target.value})} />
              <input type="number" className="form-control mb-2" placeholder="Nomor WhatsApp" onChange={e => setCustomerInfo({...customerInfo, telepon: e.target.value})} />
              <textarea className="form-control mb-3" placeholder="Alamat Lengkap & Patokan Rumah" rows="3" onChange={e => setCustomerInfo({...customerInfo, alamat: e.target.value})}></textarea>
              <button className="btn-blue w-100 py-3 fw-bold shadow-sm" onClick={handleCheckout}>
                PESAN SEKARANG (COD)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Keranjang;