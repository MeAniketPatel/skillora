import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Skillora — Learn Without Limits",
  description: "Modern e-learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
