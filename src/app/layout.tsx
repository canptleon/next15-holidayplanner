import type { Metadata } from "next";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { I18nProvider } from "../components/I18nProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Holiday Planner 2026",
  description: "Optimize your leave days for maximum time off in 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className="min-h-screen flex flex-col bg-white">
        <I18nProvider>
          <Header />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
        </I18nProvider>
      </body>
    </html>
  );
}
