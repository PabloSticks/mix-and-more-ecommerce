"use client";

import Link from 'next/link';
import { useSession, signOut } from "next-auth/react";
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { useCartStore } from '@/src/store/cartStore'; 

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  
  // --- LÓGICA DEL CARRITO (Conexión con Zustand) ---
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);
  
  // Esperamos a que el componente cargue en el cliente para mostrar el número
  // (Esto evita errores visuales entre servidor y cliente)
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* LOGO */}
        <Link href="/" className="text-2xl font-bold text-amber-800 tracking-tight flex items-center gap-2 hover:opacity-80 transition">
           MixAndMore 🌿
        </Link>
        
        {/* MENÚ CENTRAL (Escritorio) */}
        <ul className="hidden md:flex gap-8 font-medium text-gray-600">
          <li><Link href="/" className="hover:text-amber-600 transition">Inicio</Link></li>
          <li><Link href="/productos" className="hover:text-amber-600 transition">Productos</Link></li>
          <li><Link href="/recomendaciones" className="hover:text-amber-600 transition">Recomendaciones</Link></li>
          {/* LINK DE SUSCRIPCIONES */}
          <li><Link href="/suscripciones" className="text-amber-700 font-bold hover:text-amber-800 transition">Suscripciones</Link></li>
        </ul>

        {/* ZONA DERECHA (Carrito + Usuario) */}
        <div className="flex gap-6 items-center">
          
          {/* ICONO DEL CARRITO */}
          <Link href="/carrito" className="relative text-gray-600 hover:text-amber-600 transition">
             <FaShoppingCart size={24} />
             {/* Badge Dinámico (Número rojo) */}
             {mounted && totalItems > 0 && (
               <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-bounce shadow-sm">
                 {totalItems}
               </span>
             )}
          </Link>
          
          {/* LÓGICA DE USUARIO / LOGIN */}
          {status === "loading" ? (
             <div className="w-9 h-9 bg-gray-100 rounded-full animate-pulse"></div>
          ) : session?.user ? (
             // --- USUARIO LOGUEADO ---
             <div className="relative">
                <button 
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 focus:outline-none transition transform hover:scale-105"
                >
                  {session.user.image ? (
                    <img 
                      src={session.user.image} 
                      alt="Avatar" 
                      className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center font-bold border border-amber-200">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  )}
                </button>

                {/* Menú Desplegable */}
                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-sm font-bold text-gray-800 truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    
                    <Link href="/perfil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-800 transition">
                      👤 Mi Perfil
                    </Link>
                    
                    <button 
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition"
                    >
                      <FaSignOutAlt /> Cerrar Sesión
                    </button>
                  </div>
                )}
             </div>
          ) : (
             // --- NO LOGUEADO ---
             <Link href="/auth/login" className="flex items-center gap-2 px-5 py-2 bg-amber-800 text-white rounded-full hover:bg-amber-900 transition font-medium text-sm shadow-md hover:shadow-lg transform active:scale-95">
                <FaUser /> <span>Entrar</span>
             </Link>
          )}

        </div>
      </div>
    </nav>
  );
}