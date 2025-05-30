import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UB7",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ overscrollBehavior: "none", height: "100vh" }}>
        {children}
      </body>
    </html>
  );
}
