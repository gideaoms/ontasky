import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ontasky",
  description:
    "Ontasky is a tool which helps you to ask for approval from other people in your company.",
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{props.children}</body>
    </html>
  );
}
