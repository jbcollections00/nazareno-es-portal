import "../globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {/* Adding the attribute here safely suppresses the Next.js warning on this route path */}
      <main data-scroll-behavior="smooth">{children}</main>
      <Footer />
    </>
  );
}