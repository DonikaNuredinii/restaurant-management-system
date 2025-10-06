import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import FirmPrint from "./FirmPrint";

const FirmDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [firm, setFirm] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formOrder, setFormOrder] = useState({
    date: "",
    persons: "",
    price: "",
  });

  const [formPayment, setFormPayment] = useState({
    date: "",
    amount: "",
    method: "",
  });

  const [editingOrder, setEditingOrder] = useState(null);
  const [editingPayment, setEditingPayment] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState({ type: null, id: null });

  useEffect(() => {
    fetchFirmDetails();
  }, [id]);

  const fetchFirmDetails = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/firms/${id}`);
      setFirm(res.data);
      setOrders(res.data.orders || []);
      setPayments(res.data.payments || []);
    } catch (error) {
      console.error("Gabim gjatë ngarkimit të firmës:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    const content = document.getElementById("print-section").innerHTML;
    printWindow.document.write(`
    <html>
      <head>
        <title>Raport Financiar – ${firm?.name}</title>
        <style>
          body { font-family: Arial; margin: 30px; }
          table, th, td { border: 1px solid #ccc; border-collapse: collapse; }
          th, td { padding: 6px; text-align: center; }
          h1, h2, h3 { color: #333; }
        </style>
      </head>
      <body>${content}</body>
    </html>
  `);
    printWindow.document.close();
    printWindow.print();
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!formOrder.date || !formOrder.persons || !formOrder.price)
      return alert("Plotëso të gjitha fushat!");

    try {
      await axios.post(`http://127.0.0.1:8000/api/firms/${id}/orders`, {
        date: formOrder.date,
        persons: formOrder.persons,
        price_per_person: formOrder.price,
      });

      setFormOrder({ date: "", persons: "", price: "" });
      fetchFirmDetails();
    } catch (err) {
      console.error("Gabim gjatë shtimit të porosisë:", err);
      alert("Gabim gjatë shtimit të porosisë. Kontrollo fushat!");
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!formPayment.date || !formPayment.amount || !formPayment.method)
      return alert("Plotëso të gjitha fushat e pagesës!");

    try {
      await axios.post(`http://127.0.0.1:8000/api/firms/${id}/payments`, {
        date: formPayment.date,
        amount: formPayment.amount,
        method: formPayment.method,
      });

      setFormPayment({ date: "", amount: "", method: "" });
      fetchFirmDetails();
    } catch (err) {
      console.error("Gabim gjatë shtimit të pagesës:", err);
      alert("Gabim gjatë shtimit të pagesës. Kontrollo fushat!");
    }
  };

  const handleDeleteClick = (type, id) => {
    setConfirmDelete({ type, id });
  };

  const confirmDeleteAction = async () => {
    try {
      if (confirmDelete.type === "order") {
        await axios.delete(
          `http://127.0.0.1:8000/api/orders/${confirmDelete.id}`
        );
      } else if (confirmDelete.type === "payment") {
        await axios.delete(
          `http://127.0.0.1:8000/api/payments/${confirmDelete.id}`
        );
      }
      fetchFirmDetails();
    } catch (err) {
      alert("Gabim gjatë fshirjes!");
    } finally {
      setConfirmDelete({ type: null, id: null });
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://127.0.0.1:8000/api/orders/${editingOrder.id}`, {
        date: editingOrder.date,
        persons: editingOrder.persons,
        price_per_person: editingOrder.price_per_person,
      });
      setEditingOrder(null);
      fetchFirmDetails();
    } catch (err) {
      alert("Gabim gjatë përditësimit të porosisë!");
    }
  };

  // ✏️ Update Payment
  const handleUpdatePayment = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://127.0.0.1:8000/api/payments/${editingPayment.id}`,
        {
          date: editingPayment.date,
          amount: editingPayment.amount,
          method: editingPayment.method,
        }
      );
      setEditingPayment(null);
      fetchFirmDetails();
    } catch (err) {
      alert("Gabim gjatë përditësimit të pagesës!");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <span className="loading loading-spinner text-green-500"></span>
      </div>
    );

  const totalOrders = orders.reduce(
    (sum, o) => sum + Number(o.total_amount),
    0
  );
  const totalPayments = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const debt = totalOrders - totalPayments;

  const monthNames = [
    "Janar",
    "Shkurt",
    "Mars",
    "Prill",
    "Maj",
    "Qershor",
    "Korrik",
    "Gusht",
    "Shtator",
    "Tetor",
    "Nëntor",
    "Dhjetor",
  ];

  const groupedOrders = orders.reduce((groups, order) => {
    const dateObj = new Date(order.date);
    const key = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(order);
    return groups;
  }, {});

  const groupedPayments = payments.reduce((groups, payment) => {
    const dateObj = new Date(payment.date);
    const key = `${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
    if (!groups[key]) groups[key] = [];
    groups[key].push(payment);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-md mx-auto scroll-smooth">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/")}
          className="bg-white border border-gray-200 shadow-sm px-4 py-2 rounded-full text-gray-600 text-sm active:scale-95 transition"
        >
          ← Kthehu
        </button>
        <button
          onClick={() =>
            document
              .getElementById("payments-section")
              .scrollIntoView({ behavior: "smooth" })
          }
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm shadow-sm active:scale-95 transition"
        >
          💰 Shto Pagesë
        </button>
      </div>

      <h1 className="text-center text-2xl font-semibold text-gray-800 mb-1">
        📋 {firm?.name}
      </h1>
      <p className="text-center text-gray-500 text-sm mb-5">
        📞 {firm?.phone} • 📍 {firm?.address}
      </p>
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="text-green-600 mr-2">➕</span> Shto Porosi të Re
        </h2>

        <form onSubmit={handleSubmitOrder} className="space-y-3">
          <div className="relative">
            <input
              type="date"
              id="order-date"
              value={formOrder.date}
              onChange={(e) =>
                setFormOrder({ ...formOrder, date: e.target.value })
              }
              className="w-full border border-gray-200 rounded-lg py-2 px-3 text-gray-700 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
            />
            <span
              className="absolute right-3 top-2.5 text-green-500 cursor-pointer"
              onClick={() =>
                document.getElementById("order-date").showPicker?.()
              }
            >
              📅
            </span>
          </div>

          <input
            type="number"
            placeholder="Nr. Personave"
            value={formOrder.persons}
            onChange={(e) =>
              setFormOrder({ ...formOrder, persons: e.target.value })
            }
            className="w-full border border-gray-200 rounded-lg py-2 px-3 text-gray-700 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
          />

          <input
            type="number"
            placeholder="Çmimi (€)"
            value={formOrder.price}
            onChange={(e) =>
              setFormOrder({ ...formOrder, price: e.target.value })
            }
            className="w-full border border-gray-200 rounded-lg py-2 px-3 text-gray-700 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium active:scale-95 transition shadow-md"
          >
            ➕ Shto Porosi
          </button>
        </form>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2 text-purple-500">📆</span> Porositë sipas muajit
        </h3>

        {Object.entries(groupedOrders)
          .sort((a, b) => new Date(b[1][0].date) - new Date(a[1][0].date))
          .map(([month, monthOrders]) => {
            const totalMonth = monthOrders.reduce(
              (sum, o) => sum + Number(o.total_amount),
              0
            );
            return (
              <div key={month} className="mb-6">
                <h4 className="text-md font-semibold text-green-600 mb-2 border-b border-gray-200 pb-1">
                  📅 {month}
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-green-50 text-gray-700">
                        <th className="p-2 text-left">Data</th>
                        <th className="p-2 text-center">Nr</th>
                        <th className="p-2 text-center">Çmimi</th>
                        <th className="p-2 text-center">Totali</th>
                        <th className="p-2 text-center">Veprime</th>
                      </tr>
                    </thead>
                    <tbody>
                      {monthOrders.map((o) => (
                        <tr
                          key={o.id}
                          className="border-b hover:bg-green-50 text-gray-700"
                        >
                          <td className="p-2">{o.date}</td>
                          <td className="p-2 text-center">{o.persons}</td>
                          <td className="p-2 text-center">
                            {o.price_per_person}
                          </td>
                          <td className="p-2 text-center font-semibold text-gray-800">
                            {o.total_amount}
                          </td>
                          <td className="p-2 text-center">
                            <div className="flex justify-center items-center gap-2">
                              <button
                                onClick={() => setEditingOrder(o)}
                                className="bg-yellow-400 hover:bg-yellow-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm active:scale-95 transition"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDeleteClick("order", o.id)}
                                className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm active:scale-95 transition"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="text-right mt-2 text-sm text-gray-600 font-medium">
                  Totali i {month.toLowerCase()}:{" "}
                  <span className="text-green-600 font-semibold">
                    {totalMonth.toFixed(2)} €
                  </span>
                </div>
              </div>
            );
          })}

        {orders.length === 0 && (
          <p className="text-center py-4 text-gray-400 italic">
            Nuk ka porosi.
          </p>
        )}

        <div className="text-right mt-4 font-semibold text-gray-700 text-sm">
          Totali i Porosive:{" "}
          <span className="text-green-600 font-bold">
            {totalOrders.toFixed(2)} €
          </span>
        </div>
      </div>
      <div id="payments-section" className="bg-white rounded-2xl shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
          <span className="mr-2 text-green-500">💳</span> Pagesat sipas muajit
        </h3>
        <div className="bg-white rounded-xl p-5 shadow-sm mb-5 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
            <span className="text-green-600 mr-2">💸</span> Shto Pagesë të Re
          </h2>

          <form onSubmit={handleSubmitPayment} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Data e Pagesës
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="payment-date"
                  value={formPayment.date}
                  onChange={(e) =>
                    setFormPayment({ ...formPayment, date: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
                />
                <span
                  className="absolute right-3 top-2.5 text-black cursor-pointer"
                  onClick={() =>
                    document.getElementById("payment-date").showPicker?.()
                  }
                >
                  📅
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Shuma (€)
              </label>
              <input
                type="number"
                placeholder="Shuma (€)"
                value={formPayment.amount}
                onChange={(e) =>
                  setFormPayment({ ...formPayment, amount: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Metoda e Pagesës
              </label>
              <select
                value={formPayment.method}
                onChange={(e) =>
                  setFormPayment({ ...formPayment, method: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:ring-2 focus:ring-green-400 focus:outline-none cursor-pointer"
              >
                <option value="">Zgjedh metodën</option>
                <option value="Cash">💵 Cash</option>
                <option value="Bankë">🏦 Bankë</option>
                <option value="Kartelë">💳 Kartelë</option>
                <option value="Transfer">📱 Transfer</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium shadow-md active:scale-95 transition"
            >
              ➕ Shto Pagesë
            </button>
          </form>
        </div>

        {Object.entries(groupedPayments)
          .sort((a, b) => new Date(b[1][0].date) - new Date(a[1][0].date))
          .map(([month, monthPayments]) => (
            <div key={month} className="mb-6">
              <h4 className="text-md font-semibold text-green-600 mb-2 border-b border-gray-200 pb-1">
                💰 {month}
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-green-50 text-gray-700">
                      <th className="p-2 text-left">Data</th>
                      <th className="p-2 text-center">Shuma</th>
                      <th className="p-2 text-center">Metoda</th>
                      <th className="p-2 text-center">Veprime</th>
                    </tr>
                  </thead>
                  <tbody>
                    {monthPayments.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b hover:bg-green-50 text-gray-700"
                      >
                        <td className="p-2">{p.date}</td>
                        <td className="p-2 text-center">{p.amount}</td>
                        <td className="p-2 text-center">{p.method}</td>
                        <td className="p-2 text-center">
                          <div className="flex justify-center items-center gap-2">
                            <button
                              onClick={() => setEditingPayment(p)}
                              className="bg-yellow-400 hover:bg-yellow-500 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm active:scale-95 transition"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteClick("payment", p.id)}
                              className="bg-red-500 hover:bg-red-600 text-white w-8 h-8 flex items-center justify-center rounded-full shadow-sm active:scale-95 transition"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

        <div className="text-center mt-6">
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full shadow-md active:scale-95 transition"
          >
            🖨️ Printo Raportin
          </button>
        </div>

        <div id="print-section" style={{ display: "none" }}>
          <FirmPrint
            firm={firm}
            groupedOrders={groupedOrders}
            groupedPayments={groupedPayments}
            totalOrders={totalOrders}
            totalPayments={totalPayments}
            debt={debt}
          />
        </div>

        <div className="text-right mt-4 font-semibold text-gray-700 text-sm">
          Totali i Pagesave:{" "}
          <span className="text-green-600 font-bold">
            {totalPayments.toFixed(2)} €
          </span>
          <br />
          Borxhi aktual:{" "}
          <span
            className={`font-bold ${
              debt > 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {debt.toFixed(2)} €
          </span>
        </div>
      </div>
      {editingOrder && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative">
            <button
              onClick={() => setEditingOrder(null)}
              className="absolute top-2 right-3 text-gray-500 text-xl hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Ndrysho Porosi
            </h3>

            <form onSubmit={handleUpdateOrder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={editingOrder.date}
                    onChange={(e) =>
                      setEditingOrder({ ...editingOrder, date: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <span className="absolute right-3 top-2.5 text-black">
                    📅
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Nr. Personave
                </label>
                <input
                  type="number"
                  placeholder="Nr. personave"
                  value={editingOrder.persons}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      persons: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Çmimi për person (€)
                </label>
                <input
                  type="number"
                  placeholder="Çmimi për person (€)"
                  value={editingOrder.price_per_person}
                  onChange={(e) =>
                    setEditingOrder({
                      ...editingOrder,
                      price_per_person: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium shadow-md active:scale-95 transition">
                Ruaj Ndryshimet
              </button>
            </form>
          </div>
        </div>
      )}
      {editingPayment && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative">
            <button
              onClick={() => setEditingPayment(null)}
              className="absolute top-2 right-3 text-gray-500 text-xl hover:text-gray-700"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4 text-gray-800 text-center">
              Ndrysho Pagesë
            </h3>

            <form onSubmit={handleUpdatePayment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Data
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={editingPayment.date}
                    onChange={(e) =>
                      setEditingPayment({
                        ...editingPayment,
                        date: e.target.value,
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                  <span className="absolute right-3 top-2.5 text-black">
                    📅
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Shuma (€)
                </label>
                <input
                  type="number"
                  placeholder="Shuma (€)"
                  value={editingPayment.amount}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      amount: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">
                  Metoda e Pagesës
                </label>
                <select
                  value={editingPayment.method}
                  onChange={(e) =>
                    setEditingPayment({
                      ...editingPayment,
                      method: e.target.value,
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
                >
                  <option value="">Zgjedh metodën</option>
                  <option value="Cash">💵 Cash</option>
                  <option value="Bankë">🏦 Bankë</option>
                </select>
              </div>

              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium shadow-md active:scale-95 transition">
                Ruaj Ndryshimet
              </button>
            </form>
          </div>
        </div>
      )}
      {confirmDelete.id && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative">
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-3">
              A je e sigurt?
            </h3>
            <p className="text-gray-600 text-center mb-5 text-sm">
              Dëshiron ta fshish këtë{" "}
              {confirmDelete.type === "order" ? "porosi" : "pagesë"}?
            </p>

            <div className="flex justify-between gap-3">
              <button
                onClick={confirmDeleteAction}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-medium transition"
              >
                Po, fshij
              </button>
              <button
                onClick={() => setConfirmDelete({ type: null, id: null })}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg font-medium transition"
              >
                Anulo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirmDetails;
