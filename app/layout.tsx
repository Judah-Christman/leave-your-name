import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Leave Your Name",
  description: "A simple app using Supabase data intergration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
