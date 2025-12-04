
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FIBO JSON Assistant",
  description: "AI image generation with structured JSON control",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}