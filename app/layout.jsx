import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Gitview",
  description: "Written by Omid Armat",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} antialiased bg-slate-200 m-4 text-text-normal overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
