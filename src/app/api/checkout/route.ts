import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/app/api/auth/[...nextauth]/route"; // Ajusta la ruta si es necesario
import { PrismaClient } from "@prisma/client";

// Inicializamos Prisma y Mercado Pago
const prisma = new PrismaClient();
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { items } = body;

    // 1. URL Dinámica (Detecta si es Localhost o Vercel)
    const URL = process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

    // 2. Validaciones de seguridad
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Debes iniciar sesión" }, { status: 401 });
    }
    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Carrito vacío" }, { status: 400 });
    }

    // 3. Buscar al usuario en la DB para obtener su ID
    const user = await prisma.user.findUnique({
        where: { email: session.user.email }
    });

    if (!user) {
        return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // 4. GUARDAR PEDIDO EN BASE DE DATOS 📝
    // Calculamos el total y una descripción simple
    const total = items.reduce((acc: any, item: any) => acc + (Number(item.price) * Number(item.quantity)), 0);
    const description = items.map((i: any) => `${i.name} x${i.quantity}`).join(", ");

    const newOrder = await prisma.order.create({
        data: {
            userId: user.id,
            total: total,
            status: "pendiente",
            description: description // Esto se verá en el historial
        }
    });

    console.log("✅ Pedido creado en DB:", newOrder.id);

    // 5. Crear Preferencia en Mercado Pago 💸
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map((item: any) => ({
          id: String(item.id),
          title: item.name,
          quantity: Number(item.quantity),
          unit_price: 10, // ⚠️ DEJA ESTO EN 10 PARA PRUEBAS REALES BARATAS. Cámbialo a Number(item.price) para producción final.
          currency_id: "CLP",
          picture_url: item.image.startsWith("http") ? item.image : `${URL}${item.image}`,
        })),
        // URLs de retorno: Incluimos el orderId para actualizar el estado al volver
        back_urls: {
          success: `${URL}/perfil?status=success&orderId=${newOrder.id}`,
          failure: `${URL}/carrito?status=failure`,
          pending: `${URL}/carrito?status=pending`,
        },
        auto_return: "approved",
        external_reference: String(newOrder.id), // Vinculamos el pago a nuestra orden
        payer: {
          email: user.email || "test_user@test.com",
        },
      },
    });

    // Devolvemos el link de pago real
    return NextResponse.json({ url: result.init_point });

  } catch (error: any) {
    console.error("🔥 Error Checkout:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}