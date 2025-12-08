import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import AddToCartBtn from "@/src/components/AddToCartBtn";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { FaShoppingCart, FaFilter, FaTimes } from "react-icons/fa";

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

// Definimos el tipo para Next.js 15 (searchParams es una Promesa)
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ProductosPage(props: {
  searchParams: SearchParams
}) {
  // 1. Esperamos los parámetros de la URL
  const searchParams = await props.searchParams;
  
  // 2. Extraemos los filtros limpios
  const categoria = typeof searchParams.categoria === 'string' ? searchParams.categoria : undefined;
  const tag = typeof searchParams.tag === 'string' ? searchParams.tag : undefined;

  // 3. Construimos el filtro para la Base de Datos
  const where: any = {};

  if (categoria) {
    where.category = { equals: categoria, mode: 'insensitive' };
  }

  if (tag) {
    where.tags = { contains: tag, mode: 'insensitive' };
  }

  // 4. Consultamos los productos filtrados
  const products = await prisma.product.findMany({
    where: where,
    orderBy: { id: 'asc' }
  });

  // 5. Obtenemos las categorías únicas para el menú lateral
  const allProducts = await prisma.product.findMany({ select: { category: true } });
  const uniqueCategories = Array.from(new Set(allProducts.map(p => p.category)));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        
        {/* Encabezado */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <div>
                <h1 className="text-3xl font-extrabold text-amber-900">Catálogo</h1>
                <p className="text-gray-500 text-sm">
                    {products.length} productos encontrados
                    {(categoria || tag) && ` filtrando por "${categoria || tag}"`}
                </p>
            </div>

            {/* Botón Borrar Filtros (Solo aparece si hay filtros) */}
            {(categoria || tag) && (
                <Link href="/productos" className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold hover:bg-red-200 transition">
                    <FaTimes /> Borrar Filtros
                </Link>
            )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
            
            {/* --- SIDEBAR (Filtros) --- */}
            <aside className="w-full lg:w-1/4 bg-white p-6 rounded-xl shadow-sm h-fit border border-gray-100">
                <div className="flex items-center gap-2 mb-6 text-amber-800 border-b border-gray-100 pb-2">
                    <FaFilter />
                    <h2 className="font-bold text-lg">Filtros</h2>
                </div>

                {/* Categorías Dinámicas */}
                <div className="mb-8">
                    <h3 className="font-bold text-gray-900 mb-3">Categorías</h3>
                    <ul className="space-y-2">
                        {uniqueCategories.map((cat) => (
                            <li key={cat}>
                                <Link 
                                    href={`/productos?categoria=${cat}`}
                                    className={`block px-3 py-2 rounded-lg text-sm transition ${
                                        categoria === cat 
                                        ? 'bg-amber-100 text-amber-900 font-bold' 
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-amber-700'
                                    }`}
                                >
                                    {cat}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tags (Manuales) */}
                <div>
                    <h3 className="font-bold text-gray-900 mb-3">Necesidades</h3>
                    <div className="flex flex-wrap gap-2">
                        {['Keto', 'Vegan', 'Energia', 'Sin Gluten', 'Premium'].map((t) => (
                            <Link 
                                key={t}
                                href={`/productos?tag=${t.toLowerCase()}`}
                                className={`px-3 py-1 rounded-full text-xs font-medium border transition ${
                                    tag === t.toLowerCase()
                                    ? 'bg-amber-800 text-white border-amber-800'
                                    : 'bg-white text-gray-600 border-gray-200 hover:border-amber-500 hover:text-amber-600'
                                }`}
                            >
                                {t}
                            </Link>
                        ))}
                    </div>
                </div>
            </aside>

            {/* --- GRILLA DE RESULTADOS --- */}
            <section className="w-full lg:w-3/4">
                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <p className="text-gray-400 text-lg mb-4">No encontramos productos con esos filtros 😔</p>
                        <Link href="/productos" className="text-amber-600 font-bold underline">
                            Ver todos los productos
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {products.map((product) => (
                            <div key={product.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition duration-300 overflow-hidden group border border-gray-100 flex flex-col">
                                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                    />
                                </div>
                                <div className="p-5 flex flex-col flex-grow">
                                    <div className="flex-grow">
                                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                                            {product.category}
                                        </span>
                                        <h3 className="text-md font-bold text-gray-900 mt-1 mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="text-gray-500 text-xs line-clamp-2">
                                            {product.description}
                                        </p>                                    </div>
                                    
                                    <div className="flex justify-between items-center mt-4 border-t border-gray-50 pt-3">
                                        <span className="text-lg font-bold text-gray-900">
                                            ${product.price.toLocaleString('es-CL')}
                                        </span>
                                        
                                        {/* AQUÍ USAMOS EL COMPONENTE NUEVO */}
                                        <AddToCartBtn product={product} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}