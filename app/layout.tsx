import "./globals.css";
import { Poppins } from "next/font/google";

export const metadata = {
  metadataBase: new URL("https://nazareno-es-portal.vercel.app"),
  title: {
    default: "Nazareno Elementary School",
    template: "%s | Nazareno Elementary School",
  },
  description: "Official School Portal of Nazareno Elementary School",
  openGraph: {
    siteName: "Nazareno Elementary School",
    type: "website",
  },
};

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
