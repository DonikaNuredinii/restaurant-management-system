import React, { useEffect, useState } from "react";
import axios from "axios";
import FirmModal from "../components/FirmModal.jsx";

const Dashboard = () => {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFirm, setSelectedFirm] = useState(null);

  const fetchFirms = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/firms");
      setFirms(res.data);
    } catch (err) {
      console.error("Gabim gjatë marrjes së firmave:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirms();
  }, []);

  const deleteFirm = async (id) => {
    if (window.confirm("A je e sigurt që dëshiron ta fshish këtë firmë?")) {
      await axios.delete(`http://127.0.0.1:8000/api/firms/${id}`);
      fetchFirms();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <span className="loading loading-spinner text-indigo-500"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <h1 className="text-2xl font-bold text-center text-indigo-600 mb-6">
        🍲 Gjelltore Naimi 2000
      </h1>

      <div className="flex justify-center mb-5">
        <button
          onClick={() => {
            setSelectedFirm(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-6 rounded-full shadow-md transition-all active:scale-95"
        >
          ➕ Shto Firmë
        </button>
      </div>

      <div className="space-y-3">
        {firms.map((firm, index) => (
          <div
            key={firm.id}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {firm.name}
                </h2>
                <p className="text-sm text-gray-500">
                  Totali:{" "}
                  <span className="text-indigo-600 font-medium">
                    {firm.total_orders?.toFixed(2) ?? "0.00"} €
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  Pagesat:{" "}
                  <span className="text-green-600 font-medium">
                    {firm.total_payments?.toFixed(2) ?? "0.00"} €
                  </span>
                </p>
                <p
                  className={`text-sm font-medium ${
                    firm.debt > 0 ? "text-red-500" : "text-green-600"
                  }`}
                >
                  Borxhi: {firm.debt.toFixed(2)} €
                </p>
              </div>

              <div className="flex flex-col items-end space-y-2">
                <button
                  onClick={() => (window.location.href = `/firm/${firm.id}`)}
                  className="bg-indigo-100 text-indigo-700 text-sm px-4 py-1 rounded-full font-medium"
                >
                  📋 Detajet
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedFirm(firm);
                      setIsModalOpen(true);
                    }}
                    className="bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded-full"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteFirm(firm.id)}
                    className="bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <FirmModal
          onClose={() => setIsModalOpen(false)}
          onSaved={fetchFirms}
          firm={selectedFirm}
        />
      )}
    </div>
  );
};

export default Dashboard;
