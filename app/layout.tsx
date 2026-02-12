import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Premium Portal",
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
        {/* Sleek Navigation Bar */}
        <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#09090b]/60 backdrop-blur-xl">
          <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link 
                href="/" 
                className="text-white font-bold tracking-tighter text-xl hover:opacity-80 transition-opacity"
              >
                PLATFORM
              </Link>
              
              <div className="flex items-center gap-6">
                <Link 
                  href="/" 
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2"
              >
                Login
              </Link>
              <Link 
                href="/register" 
                className="text-sm font-medium bg-zinc-100 text-black hover:bg-white transition-colors px-5 py-2 rounded-full"
              >
                Get Started
              </Link>
            </div>
          </nav>
        </header>

        {/* Main Content Spacer */}
        <div className="pt-16 flex-grow flex flex-col">
          {children}
        </div>

        {/* Minimalist Footer */}
        <footer className="py-8 border-t border-white/5 text-center">
          <p className="text-xs text-zinc-600 tracking-widest uppercase">
            &copy; {new Date().getFullYear()} Premium Portal — All Rights Reserved
          </p>
        </footer>
      </body>
    </html>
  );
}