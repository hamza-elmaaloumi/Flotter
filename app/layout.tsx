import type { Metadata } from "next";
import { Geist, Geist_Mono, Cairo } from "next/font/google";
import "./globals.css";
import UserProvider from "./providers/UserProvider";
import LanguageProvider from "./providers/LanguageProvider";
import ThemeProvider from "./providers/ThemeProvider";
import NextAuthSessionProvider from "./providers/NextAuthSessionProvider"; // Import the new wrapper
import Header from "./components/header";
import Footer from "./components/footer";
import Script from 'next/script';
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "Flotter | Premium Portal",
  description: "A sleek, professional authentication system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} antialiased min-h-screen flex flex-col`}
        style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}
      >
        {/* NextAuth Provider MUST wrap the UserProvider */}
        <NextAuthSessionProvider>
          <UserProvider>
            <LanguageProvider>
              <ThemeProvider>
                <head>
                  <Script
                    async
                    src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9323001864718386"
                    crossOrigin="anonymous"
                    strategy="afterInteractive"
                  />
                </head>
                <Header />
                <main className="pt-16 flex-grow mb-12 flex flex-col relative overflow-hidden">
                  {children}
                </main>
                <Footer />
              </ThemeProvider>
            </LanguageProvider>
          </UserProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}