import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import Navbar from "@/components/Navbar";
import GoogleSessionSync from "@/components/providers/GoogleSessionSync";
import SessionProviderWrapper from "@/components/providers/SessionProviderWrapper";
import { AuthProvider } from "@/context/AuthContext";
import FeedbackProvider from "@/context/feedback/FeedbackProvider";
import "../globals.css";

export const metadata: Metadata = {
  title: "Trackifly - Gestion de Envios",
  description: "Aplicacion de logistica y distribucion",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <SessionProviderWrapper>
          <NextIntlClientProvider messages={messages}>
            <FeedbackProvider>
              <AuthProvider>
                <GoogleSessionSync />
                <Navbar />
                <main className="flex-1">{children}</main>
                <FloatingActions />
                <Footer />
              </AuthProvider>
            </FeedbackProvider>
          </NextIntlClientProvider>
        </SessionProviderWrapper>
      </body>
    </html>
  );
}
