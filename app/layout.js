import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Muhamad Usri Yusron",
  description: "Create your website and software needs easily and reliably with me.",
};

<meta name="google-site-verification" content="-nDkFZs0ACVPHw3Qxzk2Sirqe1Ae7SUQkkU-RgIfzhw" />


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
