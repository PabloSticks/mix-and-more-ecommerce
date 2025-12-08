import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Providers from "@/src/components/Providers";


// Configuración de la fuente Poppins 
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "MixAndMore | Frutos Secos y Cereales",
  description: "Snack as a Service - Nutrición inteligente entregada en tu puerta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* Cargamos los íconos de FontAwesome para que se vean bien */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
      </head>
      
      {/* suppressHydrationWarning={true}: Evita errores si tienes extensiones de Chrome (como traductores o bloqueadores)
         className={poppins.className}: Aplica la fuente a todo el sitio
      */}
      <body className={poppins.className} suppressHydrationWarning={true}>
        {/* Envolvemos toda la aplicación en los Proveedores de Sesión (Login) */}
        <Providers>
            {children}
        </Providers>
      </body>
    </html>
  );
}