"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { FaGoogle, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false); // Switch Login/Registro
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        // --- LÓGICA DE REGISTRO ---
        const res = await fetch("/api/register", {
          method: "POST",
          body: JSON.stringify(formData),
          headers: { "Content-Type": "application/json" }
        });

        if (res.ok) {
          // Si se crea bien, iniciamos sesión automáticamente
          await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            callbackUrl: "/productos" // Redirigir al catálogo
          });
        } else {
          const data = await res.json();
          setError(data.error || "Error al registrarse");
          setLoading(false);
        }
      } else {
        // --- LÓGICA DE LOGIN ---
        const res = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (res?.error) {
          setError("Email o contraseña incorrectos.");
          setLoading(false);
        } else {
          router.push("/productos"); // Redirigir al éxito
          router.refresh();
        }
      }
    } catch (error) {
      setError("Ocurrió un error inesperado.");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          
          {/* Encabezado */}
          <div className="bg-amber-800 p-8 text-center">
            <h1 className="text-2xl font-bold text-white mb-2">
              {isRegister ? "Únete a MixAndMore" : "Bienvenido de nuevo"}
            </h1>
            <p className="text-amber-100 text-sm">
              {isRegister ? "Crea tu cuenta y empieza a recibir salud." : "Ingresa para gestionar tus pedidos."}
            </p>
          </div>

          <div className="p-8">
            
            {/* Botón Google */}
            <button
              onClick={() => signIn("google", { callbackUrl: "/productos" })}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-50 transition duration-300 mb-6 shadow-sm"
            >
              <FaGoogle className="text-red-500" />
              Continuar con Google
            </button>

            <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-gray-400 text-sm">O usa tu email</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Mensaje de Error */}
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 text-center border border-red-100">
                {error}
              </div>
            )}

            {/* Formulario */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {isRegister && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaUser />
                  </div>
                  <input 
                    type="text" name="name" placeholder="Tu Nombre" required 
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input 
                  type="email" name="email" placeholder="correo@ejemplo.com" required 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  onChange={handleChange}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <FaLock />
                </div>
                <input 
                  type="password" name="password" placeholder="Contraseña" required 
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition"
                  onChange={handleChange}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-800 text-white font-bold py-3 px-4 rounded-xl hover:bg-amber-900 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Procesando..." : (isRegister ? "Registrarse" : "Iniciar Sesión")}
              </button>
            </form>

            {/* Toggle Login/Registro */}
            <div className="mt-6 text-center text-sm">
              <span className="text-gray-500">
                {isRegister ? "¿Ya tienes cuenta?" : "¿Aún no tienes cuenta?"}{" "}
              </span>
              <button 
                onClick={() => { setIsRegister(!isRegister); setError(null); }} 
                className="text-amber-700 font-bold hover:underline"
              >
                {isRegister ? "Inicia Sesión" : "Regístrate gratis"}
              </button>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}