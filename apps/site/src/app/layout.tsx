import type { Metadata } from "next";
import { Libre_Franklin } from "next/font/google";
import "./globals.css";

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

export const metadata: Metadata = {
  title: "Ontasky",
  description:
    "Ontasky is a tool which helps you to ask for approval from other people in your company.",
};

export default function Layout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={libre_franklin.variable}>{props.children}</body>
    </html>
  );
}
