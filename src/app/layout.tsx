import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Amiri, IBM_Plex_Sans_Arabic } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
});

const ibmArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-arabic",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bably.iq"),
  title: {
    default: "بابلي — دار أزياء عراقية | توصيل لكل العراق",
    template: "%s | بابلي",
  },
  description:
    "بابلي دار أزياء عراقية تقدم أرقى ملابس النساء والرجال والعبايات والأطفال والإكسسوارات. الدفع عند الاستلام وتوصيل سريع لجميع المحافظات.",
  keywords: ["أزياء العراق", "عبايات", "ملابس نسائية", "ملابس رجالية", "الدفع عند الاستلام", "بغداد", "بابلي"],
  openGraph: {
    title: "بابلي — دار أزياء عراقية",
    description: "أزياء تليق بإرث بابل. الدفع عند الاستلام وتوصيل لكل محافظات العراق.",
    type: "website",
    locale: "ar_IQ",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f3057",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const categories = await getCategories();
  return (
    <html lang="ar" dir="rtl" className={`${amiri.variable} ${ibmArabic.variable}`}>
      <body>
        <CartProvider>
          <SiteHeader categories={categories.map((c) => ({ name: c.name, slug: c.slug }))} />
          <main className="min-h-[60vh]">{children}</main>
          <SiteFooter />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
