import "./globals.css";
import { AppProvider } from "./context/AppContext";

export const metadata = {
  title: "NEXACOFFEE POS",
  description: "Point of Sale & Inventory System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}