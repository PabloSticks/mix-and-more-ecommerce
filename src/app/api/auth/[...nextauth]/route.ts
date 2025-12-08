import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma), // Esto guarda a los usuarios de Google en tu DB
  providers: [
    // 1. Login con Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    // 2. Login con Email y Contraseña
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Faltan datos");
        }

        // Buscamos al usuario
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Si no existe o no tiene contraseña (porque se registró con Google)
        if (!user || !user.password) {
          throw new Error("Usuario no encontrado o registrado con Google");
        }

        // Verificamos la contraseña
        const match = await bcrypt.compare(credentials.password, user.password);
        if (!match) throw new Error("Contraseña incorrecta");

        return user;
      }
    })
  ],
  pages: {
    signIn: '/auth/login', // Usaremos nuestra propia página bonita
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        // @ts-ignore
        session.user.id = token.sub; // Pasamos el ID real a la sesión
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };