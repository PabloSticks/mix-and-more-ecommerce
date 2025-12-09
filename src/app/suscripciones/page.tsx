"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FaCheck, FaTruck, FaBoxOpen, FaLeaf } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SuscripcionesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (planName: string, price: number, image: string) => {
    if (!session) {
      router.push("/auth/login?callbackUrl=/suscripciones");
      return;
    }

    setLoading(planName);

    // Creamos un "producto virtual" para el checkout
    const item = {
      id: 9999, // ID especial para suscripciones
      name: `Suscripción Mensual: ${planName}`,
      price: price,
      quantity: 1,
      image: image, 
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [item] }),
      });
      const data = await res.json();
      if(data.url) window.location.href = data.url;
    } catch (e) {
      alert("Error al procesar. Intenta nuevamente.");
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
            <span className="text-amber-600 font-bold uppercase tracking-wider text-sm">Snack as a Service</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-2 mb-6">
                Tu Energía, <span className="text-amber-700">Automática</span>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                Elige tu caja ideal y recíbela cada mes. Sin contratos forzosos, cancela cuando quieras.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* PLAN 1: STARTER */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col hover:-translate-y-2 transition duration-300">
                <div className="mb-4 bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-gray-600">
                    <FaLeaf />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Mix Starter</h3>
                <p className="text-gray-500 mt-2 text-sm">Ideal para probar o consumo personal.</p>
                <div className="my-6">
                    <span className="text-4xl font-extrabold text-gray-900">$12.990</span>
                    <span className="text-gray-400">/mes</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex gap-3 text-sm text-gray-600"><FaCheck className="text-green-500 mt-1"/> 1kg de Mix Energía</li>
                    <li className="flex gap-3 text-sm text-gray-600"><FaCheck className="text-green-500 mt-1"/> Envío a Domicilio</li>
                    <li className="flex gap-3 text-sm text-gray-600"><FaCheck className="text-green-500 mt-1"/> Sin permanencia</li>
                </ul>
                <button 
                    onClick={() => handleSubscribe("Starter", 12990, "/imagenes/mix.jpg")}
                    disabled={!!loading}
                    className="w-full py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition"
                >
                    {loading === "Starter" ? "Procesando..." : "Elegir Starter"}
                </button>
            </div>

            {/* PLAN 2: PRO (DESTACADO) */}
            <div className="bg-amber-900 rounded-3xl p-8 shadow-2xl border border-amber-800 flex flex-col transform md:-translate-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-400 text-amber-900 text-xs font-bold px-4 py-2 rounded-bl-xl">
                    MÁS VENDIDO
                </div>
                <div className="mb-4 bg-amber-800 w-12 h-12 rounded-full flex items-center justify-center text-yellow-400">
                    <FaBoxOpen />
                </div>
                <h3 className="text-2xl font-bold text-white">Mix Pro Family</h3>
                <p className="text-amber-200 mt-2 text-sm">Para familias o deportistas.</p>
                <div className="my-6">
                    <span className="text-4xl font-extrabold text-white">$24.990</span>
                    <span className="text-amber-200">/mes</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow text-amber-50">
                    <li className="flex gap-3 text-sm"><FaCheck className="text-yellow-400 mt-1"/> <strong>2kg</strong> de Frutos Secos a elección</li>
                    <li className="flex gap-3 text-sm"><FaCheck className="text-yellow-400 mt-1"/> 500g de Granola Artesanal</li>
                    <li className="flex gap-3 text-sm"><FaCheck className="text-yellow-400 mt-1"/> Envío Prioritario Gratis</li>
                    <li className="flex gap-3 text-sm"><FaCheck className="text-yellow-400 mt-1"/> Regalo sorpresa mensual</li>
                </ul>
                <button 
                    onClick={() => handleSubscribe("Pro Family", 24990, "/imagenes/mix2.jpg")}
                    disabled={!!loading}
                    className="w-full py-4 bg-yellow-400 text-amber-900 font-bold rounded-xl hover:bg-yellow-300 transition shadow-lg"
                >
                    {loading === "Pro Family" ? "Procesando..." : "Suscribirme Ahora"}
                </button>
            </div>

            {/* PLAN 3: KETO */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 flex flex-col hover:-translate-y-2 transition duration-300">
                <div className="mb-4 bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center text-gray-600">
                    <FaLeaf />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Solo Semillas</h3>
                <p className="text-gray-500 mt-2 text-sm">100% Keto y Vegano.</p>
                <div className="my-6">
                    <span className="text-4xl font-extrabold text-gray-900">$9.990</span>
                    <span className="text-gray-400">/mes</span>
                </div>
                <ul className="space-y-4 mb-8 flex-grow">
                    <li className="flex gap-3 text-sm text-gray-600"><FaCheck className="text-green-500 mt-1"/> 1kg de Semillas (Chía/Linaza)</li>
                    <li className="flex gap-3 text-sm text-gray-600"><FaCheck className="text-green-500 mt-1"/> Recetario Keto Digital</li>
                    <li className="flex gap-3 text-sm text-gray-600"><FaCheck className="text-green-500 mt-1"/> Envío normal</li>
                </ul>
                <button 
                    onClick={() => handleSubscribe("Semillas", 9990, "/imagenes/chia_semillas.jpg")}
                    disabled={!!loading}
                    className="w-full py-4 border-2 border-gray-900 text-gray-900 font-bold rounded-xl hover:bg-gray-900 hover:text-white transition"
                >
                    {loading === "Semillas" ? "Procesando..." : "Elegir Semillas"}
                </button>
            </div>

        </div>

        <div className="mt-20 text-center">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-6 py-3 rounded-full text-sm font-medium">
                <FaTruck /> Primer envío: 24-48hrs hábiles. Siguientes envíos: Día 1 de cada mes.
            </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}