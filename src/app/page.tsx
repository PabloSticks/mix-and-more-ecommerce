import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-amber-100 min-h-[600px] flex items-center overflow-hidden">
        <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Texto */}
            <div className="text-center md:text-left">
                <span className="text-amber-600 font-bold uppercase tracking-wider text-sm mb-2 block">
                    100% Natural & Premium
                </span>
                <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                    Snack as a Service <br/>
                    <span className="text-amber-700">Tu Dosis de Energía</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg mx-auto md:mx-0">
                    Suscríbete y recibe mensualmente la mejor selección de frutos secos y semillas. Sin trámites, directo a tu casa.
                </p>
                <div className="flex gap-4 justify-center md:justify-start">
                    <Link href="/productos" className="px-8 py-4 bg-amber-700 text-white rounded-xl font-bold text-lg hover:bg-amber-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                        Ver Catálogo
                    </Link>
                    <Link href="#como-funciona" className="px-8 py-4 bg-white text-amber-800 border border-amber-200 rounded-xl font-bold text-lg hover:bg-amber-50 transition">
                        Cómo Funciona
                    </Link>
                </div>
            </div>

            {/* Imagen Decorativa (Usamos una del public) */}
            <div className="relative h-[400px] md:h-[500px] w-full hidden md:block">
                 {/* Aquí usamos una imagen tuya para que se vea real */}
                 <div className="absolute top-10 right-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                 <div className="absolute top-10 left-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                 
                 <div className="relative z-10 transform rotate-[-5deg] hover:rotate-0 transition duration-500">
                    <img 
                        src="/imagenes/mix.jpg" 
                        alt="Mix Premium" 
                        className="rounded-2xl shadow-2xl w-full object-cover h-[400px] border-4 border-white"
                    />
                 </div>
            </div>
        </div>
      </header>

      {/* Sección de Beneficios */}
      <section id="como-funciona" className="py-20 bg-white">
          <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">¿Por qué elegirnos?</h2>
                  <p className="text-gray-500 max-w-2xl mx-auto">Nuestro modelo está diseñado para ahorrarte tiempo y mejorar tu alimentación.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  {[
                      { title: "Suscripción Flexible", desc: "Pausa o cancela cuando quieras. Tú tienes el control.", icon: "📅" },
                      { title: "Productos Frescos", desc: "Directo del productor a tu mesa, garantizando calidad.", icon: "🌱" },
                      { title: "Envíos Gratis", desc: "En planes mensuales sobre $20.000 dentro de la RM.", icon: "🚚" },
                  ].map((item, index) => (
                      <div key={index} className="p-8 bg-gray-50 rounded-2xl hover:bg-amber-50 transition border border-transparent hover:border-amber-100">
                          <div className="text-4xl mb-4">{item.icon}</div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                          <p className="text-gray-600">{item.desc}</p>
                      </div>
                  ))}
              </div>
          </div>
      </section>

      <Footer />
    </div>
  );
}