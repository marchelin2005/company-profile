import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NEXACORP — Software & Cloud Engineering House",
    template: "%s | NEXACORP",
  },
  description:
    "NEXACORP merancang dan mengintegrasikan ekosistem perangkat lunak skala industri—mulai dari aplikasi web, mobile app, hingga solusi cloud terintegrasi.",
  keywords: [
    "Software House",
    "Web Development",
    "Mobile App",
    "Cloud Engineering",
    "NEXACORP",
    "Next.js Developer",
  ],
  authors: [{ name: "NEXACORP Team" }],
  openGraph: {
    title: "NEXACORP — Software & Cloud Engineering House",
    description:
      "Solusi ekosistem perangkat lunak lunak modern, sistem berbasis cloud scalable, dan desain UI/UX berstandar global.",
    url: "https://nexacorp.id", // Nanti disesuaikan dengan domain asli
    siteName: "NEXACORP",
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}