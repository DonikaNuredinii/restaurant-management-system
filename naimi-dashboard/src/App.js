import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [firms, setFirms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/firms")
      .then((res) => {
        setFirms(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gabim gjatë marrjes së firmave:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-ring loading-lg text-blue-600"></span>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
        Gjelltore Naimi 2000 - Dashboard
      </h1>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
        <table className="table w-full">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th>#</th>
              <th>Emri i Firmës</th>
              <th>Totali Porosive (€)</th>
              <th>Totali Pagesave (€)</th>
              <th>Borxhi (€)</th>
            </tr>
          </thead>
          <tbody>
            {firms.map((firm, index) => (
              <tr key={firm.id} className="hover:bg-blue-50">
                <td>{index + 1}</td>
                <td className="font-medium">{firm.name}</td>
                <td>{firm.total_orders?.toFixed(2) ?? "0.00"}</td>
                <td>{firm.total_payments?.toFixed(2) ?? "0.00"}</td>
                <td
                  className={
                    firm.debt > 0
                      ? "text-red-600 font-semibold"
                      : "text-green-600 font-semibold"
                  }
                >
                  {firm.debt.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
