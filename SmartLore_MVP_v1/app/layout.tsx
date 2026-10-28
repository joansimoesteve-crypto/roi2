import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Smart Lore — Tu opinión construye ciudades",
  description: "Un avatar para expresar cómo te sientes en webs y lugares físicos. Tu opinión, convertida en conocimiento útil."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es"><body>{children}</body></html>;
}