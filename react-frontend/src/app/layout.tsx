import React from "react";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Providers } from "./Providers";
export const metadata = {
  title: "MT Management System",
  description: "Modern Management System for MTP",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
