// src/components/FirmModal.jsx
import React, { useState } from "react";
import axios from "axios";

const FirmModal = ({ onClose, onSaved, firm }) => {
  const [formData, setFormData] = useState({
    name: firm?.name || "",
    phone: firm?.phone || "",
    address: firm?.address || "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (firm) {
      await axios.put(`http://127.0.0.1:8000/api/firms/${firm.id}`, formData);
    } else {
      await axios.post("http://127.0.0.1:8000/api/firms", formData);
    }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-center text-blue-600">
          {firm ? "✏️ Edit Firmë" : "➕ Shto Firmë të Re"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Emri i Firmës"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="input input-bordered w-full"
            required
          />
          <input
            type="text"
            placeholder="Telefoni"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="input input-bordered w-full"
          />
          <input
            type="text"
            placeholder="Adresa"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="input input-bordered w-full"
          />
          <div className="flex justify-end space-x-2 mt-4">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Anulo
            </button>
            <button type="submit" className="btn btn-primary">
              Ruaj
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FirmModal;
