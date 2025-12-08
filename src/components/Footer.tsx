import Link from "next/link";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 mt-auto">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
            
            {/* Columna 1 */}
            <div>
                <h4 className="text-xl font-bold text-white mb-4">MixAndMore</h4>
                <p className="text-sm leading-relaxed">
                    Nutrición inteligente entregada en tu puerta. 
                    Snacks saludables, sin culpas y con el mejor sabor natural.
                </p>
            </div>

            {/* Columna 2 */}
            <div>
                <h4 className="text-xl font-bold text-white mb-4">Enlaces Rápidos</h4>
                <ul className="space-y-2 text-sm">
                    <li><Link href="/productos" className="hover:text-amber-500 transition">Catálogo Completo</Link></li>
                    <li><Link href="/recomendaciones" className="hover:text-amber-500 transition">Recetas Saludables</Link></li>
                    <li><Link href="#" className="hover:text-amber-500 transition">Suscripciones</Link></li>
                </ul>
            </div>

            {/* Columna 3 */}
            <div className="flex flex-col items-center md:items-start">
                <h4 className="text-xl font-bold text-white mb-4">Síguenos</h4>
                <div className="flex gap-4">
                    <a href="#" className="text-2xl hover:text-amber-500 transition"><FaInstagram /></a>
                    <a href="#" className="text-2xl hover:text-amber-500 transition"><FaFacebook /></a>
                    <a href="#" className="text-2xl hover:text-amber-500 transition"><FaTwitter /></a>
                </div>
            </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
            <p>© 2025 MixAndMore. Todos los derechos reservados.</p>
        </div>
    </footer>
  );
}