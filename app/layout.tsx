import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import CartProvider from "./contexts/CartContext";
import { AuthProvider } from "./contexts/AuthContext";
import Footer from "./components/Footer";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PuntoGo",
  description: "Tu tienda de licores y bebidas premium",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/PuntoGo favicon.png', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${jakarta.variable} font-body antialiased bg-slate-50 selection:bg-blue-500 selection:text-white`}
      >
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              {children}
            </div>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
