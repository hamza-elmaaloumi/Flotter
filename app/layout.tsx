import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import UserProvider from "./providers/UserProvider";
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
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#09090b] text-zinc-100 min-h-screen flex flex-col`}
      >
        {/* NextAuth Provider MUST wrap the UserProvider */}
        <NextAuthSessionProvider>
          <UserProvider>
            <Script
              async
              src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9323001864718386"
              crossOrigin="anonymous"
              strategy="afterInteractive"
            />
            <Header />
            <main className="pt-16 flex-grow mb-12 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-500/5 blur-[120px] pointer-events-none" />
              {children}
            </main>
            <Footer />
          </UserProvider>
        </NextAuthSessionProvider>
      </body>
    </html>
  );
}