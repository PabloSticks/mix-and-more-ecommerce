import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import { FaBoxOpen, FaCheckCircle, FaCreditCard, FaMapMarkerAlt, FaUserCircle, FaSave } from "react-icons/fa";
import AddressForm from "@/src/components/AddressForm"; 

const prisma = new PrismaClient();

// Definir type para searchParams
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function PerfilPage(props: {
  searchParams: SearchParams
}) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // Verificar parámetros URL (retorno de pago)
  const params = await props.searchParams;
  const status = typeof params.status === 'string' ? params.status : undefined;
  const orderId = typeof params.orderId === 'string' ? params.orderId : undefined;

  // 1. CONFIRMAR PEDIDO SI VIENE DE PAGO
  if (status === 'success' && orderId) {
    await prisma.order.update({
        where: { id: Number(orderId) },
        data: { status: 'pagado' }
    });
  }

  // 2. OBTENER DATOS (Ahora traemos address y phone)
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { 
        orders: {
            orderBy: { createdAt: 'desc' },
            take: 10
        }
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Navbar />

      <main className="container mx-auto px-4 py-10">
        
        {/* Notificación de éxito */}
        {status === 'success' && (
            <div className="mb-8 bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl relative flex items-center gap-4 shadow-sm animate-bounce">
                <FaCheckCircle size={28} />
                <div>
                    <h3 className="font-bold text-lg">¡Pago Recibido con Éxito!</h3>
                    <p>Tu pedido ha sido confirmado. Te hemos enviado un correo con los detalles.</p>
                </div>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* COLUMNA IZQUIERDA (Perfil y Dirección) - Ocupa 4 columnas */}
            <div className="lg:col-span-4 space-y-6">
                
                {/* Tarjeta Usuario */}
                <div className="bg-white rounded-2xl shadow-sm p-8 text-center border border-gray-100">
                    <div className="relative w-28 h-28 mx-auto mb-4">
                        {user?.image ? (
                            <img src={user.image} alt="Perfil" className="w-full h-full rounded-full object-cover border-4 border-amber-50 shadow-sm" />
                        ) : (
                            <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-100 to-orange-200 flex items-center justify-center text-amber-800 text-5xl font-bold">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                        )}
                        <span className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white"></span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
                    <p className="text-gray-500 mb-4">{user?.email}</p>
                    
                    {/* Rol Bonito */}
                    <div className="inline-block px-4 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-bold uppercase tracking-wide">
                        {user?.role === 'admin' ? 'Administrador' : 'Miembro del Club 🌿'}
                    </div>
                </div>

                {/* Formulario de Dirección (Componente Cliente) */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-2">
                        <FaMapMarkerAlt className="text-amber-600"/> Datos de Envío
                    </h3>
                    {/* Usamos el componente cliente aquí para manejar el formulario */}
                    <AddressForm 
                        initialAddress={user?.address || ""} 
                        initialPhone={user?.phone || ""} 
                    />
                </div>

                {/* Método de Pago (Simulado Visualmente) */}
                <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FaCreditCard className="text-amber-600"/> Tarjeta Guardada
                    </h3>
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-12 bg-blue-900 rounded flex items-center justify-center text-white text-xs font-bold italic">VISA</div>
                            <div className="text-sm font-mono text-gray-600">•••• 4242</div>
                        </div>
                        <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-1 rounded">Activa</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Usada para tus suscripciones mensuales.</p>
                </div>

            </div>

            {/* COLUMNA DERECHA (Historial) - Ocupa 8 columnas */}
            <div className="lg:col-span-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <FaBoxOpen className="text-amber-600" /> Historial de Pedidos
                        </h3>
                        <span className="text-sm text-gray-500">{user?.orders.length || 0} pedidos totales</span>
                    </div>

                    {!user?.orders || user.orders.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                            <FaBoxOpen size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Aún no has realizado compras.</p>
                            <a href="/productos" className="text-amber-600 font-bold hover:underline mt-2 inline-block">Ir a la tienda</a>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {user.orders.map((order) => (
                                <div key={order.id} className="p-6 hover:bg-gray-50 transition flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-gray-900">Pedido #{order.id}</span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                order.status === 'pagado' 
                                                ? 'bg-green-100 text-green-700' 
                                                : 'bg-yellow-100 text-yellow-700'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mb-1">
                                            {new Date(order.createdAt).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        <p className="text-sm text-gray-700 font-medium">{order.description || "Suscripción / Productos Varios"}</p>
                                    </div>
                                    
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">${order.total.toLocaleString('es-CL')}</p>
                                        <button className="text-xs text-amber-700 font-bold hover:underline mt-1">Ver Boleta</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}