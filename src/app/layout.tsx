import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { PokemonProvider } from "@/lib/hooks";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pokemon Search App",
  description: "Search and explore Pokemon using the Pokemon API",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gray-50`}
      >
        <header className="bg-blue-600 text-white py-4 shadow-md">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold">
              Pokemon Search
            </Link>
            <nav>
              <Link
                href="/"
                className="py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Home
              </Link>
            </nav>
          </div>
        </header>

        <PokemonProvider>
          {children}
        </PokemonProvider>

        <footer className="bg-gray-800 text-white py-6 mt-12">
          <div className="container mx-auto px-4 text-center">
            <p>
              Pokémon data provided by{" "}
              <a
                href="https://pokeapi.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline"
              >
                PokéAPI
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
