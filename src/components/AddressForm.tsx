"use client";

import { useState } from "react";
import { FaSave } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

export default function AddressForm({ initialAddress, initialPhone }: { initialAddress: string, initialPhone: string }) {
  const [address, setAddress] = useState(initialAddress);
  const [phone, setPhone] = useState(initialPhone);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
        const res = await fetch("/api/user/update", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ address, phone }),
        });
        
        if (res.ok) {
            toast.success("Datos guardados correctamente");
        } else {
            toast.error("Error al guardar");
        }
    } catch (e) {
        toast.error("Error de conexión");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
        <Toaster position="bottom-center" />
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Dirección Completa</label>
            <input 
                type="text" 
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Av. Providencia 1234, Depto 501"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
        </div>
        <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Teléfono</label>
            <input 
                type="text" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+56 9 1234 5678"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-amber-500"
            />
        </div>
        <button 
            onClick={handleSave}
            disabled={loading}
            className="w-full mt-2 bg-gray-900 text-white text-sm font-bold py-2 rounded-lg hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
            {loading ? "Guardando..." : <><FaSave /> Guardar Cambios</>}
        </button>
    </div>
  );
}