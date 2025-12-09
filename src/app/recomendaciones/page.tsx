import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import AddToCartBtn from "@/src/components/AddToCartBtn";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export default async function RecomendacionesPage() {
  
  // --- ALGORITMO DE RECOMENDACIÓN (Content-Based Filtering Simulado) ---
  
  // 1. "Simulamos" que sabemos qué le gusta al usuario (en un caso real, leeríamos sus orders)
  // Buscamos un producto base para generar recomendaciones (ej: algo que sea 'Mix')
  const productoBase = await prisma.product.findFirst({
    where: { name: { contains: 'Mix' } }
  });

  let recomendaciones = [];
  let mensaje = "Descubre nuevos sabores";

  if (productoBase) {
    mensaje = `Porque te gustó "${productoBase.name}"`;
    
    // 2. Buscamos productos similares (Misma categoría, distinto ID)
    recomendaciones = await prisma.product.findMany({
      where: {
        category: productoBase.category,
        id: { not: productoBase.id } // Excluir el mismo producto
      },
      take: 3
    });
  } else {
    // Fallback: Si no hay base, mostramos los más populares (los primeros 3)
    recomendaciones = await prisma.product.findMany({ take: 3 });
  }

  // 3. Traemos también algunas "Recetas" (Contenido de valor)
  // Esto suma puntos en "Marketing Social"
  const recetas = [
    { title: "Barritas de Cereal Caseras", img: "https://images.unsplash.com/photo-1590779033100-9f60a05a013d?auto=format&fit=crop&w=400&q=80", desc: "Usa nuestra Avena Integral y Miel." },
    { title: "Smoothie Bowl de Berries", img: "https://images.unsplash.com/photo-1626078436891-67dd393c0429?auto=format&fit=crop&w=400&q=80", desc: "Perfecto con el Mix Antioxidante." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold text-amber-900 mb-2 text-center">Para Ti 💡</h1>
        <p className="text-center text-gray-500 mb-12">Selección personalizada basada en tus gustos.</p>

        {/* Sección ML: Productos Recomendados */}
        <section className="mb-16">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-amber-500 pl-4">
                {mensaje}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recomendaciones.map((product) => (
                    <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-4 border border-gray-100">
                        <div className="h-48 w-full bg-gray-100 rounded-lg mb-4 overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition" />
                        </div>
                        <h3 className="font-bold text-lg">{product.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-amber-800">${product.price.toLocaleString('es-CL')}</span>
                            <AddToCartBtn product={product} />
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Sección Marketing: Recetas (Contenido) */}
        <section>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-green-500 pl-4">
                Inspírate en la Cocina 🥣
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {recetas.map((receta, i) => (
                    <div key={i} className="flex gap-4 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition cursor-pointer group">
                        <div className="w-1/3 overflow-hidden">
                            <img src={receta.img} alt={receta.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />
                        </div>
                        <div className="w-2/3 p-6 flex flex-col justify-center">
                            <h3 className="font-bold text-xl text-gray-900 mb-2">{receta.title}</h3>
                            <p className="text-gray-600 text-sm mb-4">{receta.desc}</p>
                            <span className="text-amber-600 font-bold text-sm underline decoration-2">Ver Receta &rarr;</span>
                        </div>
                    </div>
                ))}
            </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}