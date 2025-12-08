"use client";

import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { useCartStore } from "@/src/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaTrash, FaMinus, FaPlus, FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function CarritoPage() {
  // Hooks de Zustand
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const handleCheckout = async () => {
    if (!session) {
      router.push("/auth/login?callbackUrl=/carrito");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url; // Nos lleva a Mercado Pago
      } else {
        alert("Error al crear la preferencia de pago");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  if (!mounted) return null; // Evita parpadeos

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-3xl font-extrabold text-amber-900 mb-8">Tu Carrito 🛒</h1>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
            <p className="text-gray-500 text-xl mb-6">Tu carrito está vacío</p>
            <Link href="/productos" className="px-8 py-3 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition">
              Ir a comprar
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Lista de Items */}
            <div className="lg:w-2/3 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg bg-gray-100" />
                  
                  <div className="flex-grow">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-amber-700 font-bold">${item.price.toLocaleString('es-CL')}</p>
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 hover:bg-white rounded-md transition"><FaMinus size={12}/></button>
                    <span className="font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 hover:bg-white rounded-md transition"><FaPlus size={12}/></button>
                  </div>

                  <button onClick={() => removeItem(item.id)} className="p-3 text-red-400 hover:text-red-600 transition">
                    <FaTrash />
                  </button>
                </div>
              ))}
              
              <button onClick={clearCart} className="text-sm text-red-500 underline pl-2">
                Vaciar carrito
              </button>
            </div>

            {/* Resumen de Pago */}
            <div className="lg:w-1/3">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Resumen</h2>
                
                <div className="space-y-3 mb-6 border-b border-gray-100 pb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${getTotal().toLocaleString('es-CL')}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío</span>
                    <span className="text-green-600">Gratis</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold text-gray-900 mb-8">
                   <span>Total</span>                   <span>${getTotal().toLocaleString('es-CL')}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full py-4 bg-amber-800 text-white rounded-xl font-bold text-lg hover:bg-amber-900 transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                   {loading ? "Procesando..." : "Proceder al Pago"} <FaArrowRight />
                </button>
              </div>
            </div>

          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}