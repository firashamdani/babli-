import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
// Self-hosted fonts (bundled from npm) — no Google Fonts request at build time,
// so the build never fails on hosts without outbound access to fonts.googleapis.com.
import "@fontsource/amiri/arabic-400.css";
import "@fontsource/amiri/arabic-700.css";
import "@fontsource/amiri/latin-400.css";
import "@fontsource/amiri/latin-700.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-300.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-400.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-500.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-600.css";
import "@fontsource/ibm-plex-sans-arabic/arabic-700.css";
import "@fontsource/ibm-plex-sans-arabic/latin-400.css";
import "@fontsource/ibm-plex-sans-arabic/latin-500.css";
import "@fontsource/ibm-plex-sans-arabic/latin-600.css";
import "@fontsource/ibm-plex-sans-arabic/latin-700.css";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { getCategories } from "@/lib/data";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CartDrawer } from "@/components/cart-drawer";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://bably.iq";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
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
    <html lang="ar" dir="rtl">
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
