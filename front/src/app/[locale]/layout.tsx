import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import '../globals.css';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import FloatingActions from '@/components/FloatingActions';
import { AuthProvider } from '@/context/AuthContext';
import FeedbackProvider from '@/context/feedback/FeedbackProvider';

// Configuración de fuentes globales (Poppins e Inter)
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Trackifly - Gestión de Envíos',
  description: 'Aplicación de logística y distribución',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Obtenemos los mensajes para las traducciones (internacionalización)
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${poppins.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        
        {/* Proveedor de traducciones para toda la app */}
        <NextIntlClientProvider messages={messages}>
          <FeedbackProvider> {/* se envuelve el auth con el feedback notificaciones globales para toda la app*/}
            {/* Proveedor de Autenticación: Envuelve a toda la estructura para que 
                cualquier componente (como el Navbar) pueda acceder a la sesión */}
            <AuthProvider>
              
              <Navbar />
              
              <main className="flex-1">
                {children}
              </main>
              
              <FloatingActions />
              <Footer />
              
            </AuthProvider>
          </FeedbackProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}