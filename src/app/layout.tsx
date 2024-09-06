import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/Header";

export const metadata: Metadata = {
  title: "Open Chat",
  description: "The chat for send messages for your friends!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body className="text-white h-screen flex flex-col">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
