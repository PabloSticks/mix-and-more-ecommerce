import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Inicializamos con el Token que esté en las variables (sea Test o Prod)
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items } = body;

    // 1. Detección Inteligente de la URL
    // En Vercel, usará la variable de entorno. En local, usa localhost.
    const URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: String(item.id),
          title: item.name,
          quantity: Number(item.quantity),
          
          // Si quieres cobrar $10 REALES sin importar el producto, descomenta la linea de abajo:
          unit_price: 10, 
          // Si quieres cobrar el precio real, usa esta:
          // unit_price: Number(item.price),
          
          currency_id: "CLP",
          picture_url: item.image.startsWith("http") ? item.image : `${URL}${item.image}`,
        })),
        back_urls: {
          success: `${URL}/perfil?status=success`,
          failure: `${URL}/carrito?status=failure`,
          pending: `${URL}/carrito?status=pending`,
        },
        auto_return: "approved",
        payer: {
          email: session?.user?.email || "cliente@test.com",
        },
      },
    });

    // 2. MODO PRODUCCIÓN ACTIVADO
    // Usamos 'init_point' (Real) en vez de 'sandbox_init_point'
    return NextResponse.json({ url: result.init_point });

  } catch (error: any) {
    console.error("Error Checkout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}