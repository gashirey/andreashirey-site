import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Fraunces,
  Karla,
  Libre_Baskerville,
  Work_Sans,
} from "next/font/google";
import "./design-lab.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-lab-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const dmSans = DM_Sans({
  variable: "--font-lab-dm",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const fraunces = Fraunces({
  variable: "--font-lab-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const karla = Karla({
  variable: "--font-lab-karla",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const libre = Libre_Baskerville({
  variable: "--font-lab-libre",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const workSans = Work_Sans({
  variable: "--font-lab-work",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Design Lab",
  description:
    "Internal visual exploration for Grey Gables Farm branding directions.",
  robots: { index: false, follow: false },
};

export default function DesignLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`design-lab-fonts ${cormorant.variable} ${dmSans.variable} ${fraunces.variable} ${karla.variable} ${libre.variable} ${workSans.variable}`}
    >
      {children}
    </div>
  );
}
