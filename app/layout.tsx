import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/opsz.css";
import "@fontsource-variable/fraunces/opsz-italic.css";
import "@fontsource-variable/inter/index.css";
import "../styles/global.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { cover } from "@/content/copy/home";
import { ui } from "@/content/copy/ui";

export const metadata: Metadata = {
  title: ui.brand,
  description: cover.headline,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0C0809",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
