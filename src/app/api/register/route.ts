import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    if (!data.email || !data.password) {
        return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
    }

    // Verificar si existe
    const userFound = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (userFound) {
      return NextResponse.json({ error: "El email ya está registrado" }, { status: 400 });
    }

    // Encriptar
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear
    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name
    });

  } catch (error) {
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}