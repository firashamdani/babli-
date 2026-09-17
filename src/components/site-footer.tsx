import Link from "next/link";
import { MapPin, Phone, Mail, Camera, AtSign, Send, ShieldCheck, Truck, CreditCard } from "lucide-react";
import { LogoMark } from "./site-header";

const footerNavs = [
  {
    title: "تسوّق",
    links: [
      { href: "/products", label: "كل المنتجات" },
      { href: "/products?cat=women", label: "نساء" },
      { href: "/products?cat=abaya", label: "عبايات وجلابيات" },
      { href: "/products?cat=men", label: "رجال" },
      { href: "/products?cat=kids", label: "أطفال" },
      { href: "/products?cat=accessories", label: "إكسسوارات" },
    ],
  },
  {
    title: "التشكيلات",
    links: [
      { href: "/products?collection=gold", label: "اللمسة الذهبية" },
      { href: "/products?collection=summer", label: "تشكيلة الصيف" },
      { href: "/products?collection=essentials", label: "الأساسيات الخالدة" },
      { href: "/products?sale=1", label: "العروض والخصومات" },
      { href: "/products?sort=rating", label: "الأعلى تقييماً" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="pattern-ishtar mt-24 text-cream/85">
      {/* Trust strip */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 sm:grid-cols-3">
          {[
            { icon: CreditCard, title: "الدفع عند الاستلام", text: "افحص طلبك أولاً ثم ادفع بكل ثقة" },
            { icon: Truck, title: "توصيل سريع", text: "2-5 أيام عمل لجميع محافظات العراق" },
            { icon: ShieldCheck, title: "إرجاع مجاني", text: "استبدال وإرجاع خلال 7 أيام من الاستلام" },
          ].map((t) => (
            <div key={t.title} className="flex items-start gap-4">
              <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                <t.icon className="size-5" />
              </span>
              <div>
                <p className="font-bold text-cream">{t.title}</p>
                <p className="mt-1 text-sm text-cream/60">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-11 place-items-center rounded-xl bg-gold/15 text-gold">
              <LogoMark className="size-6" />
            </span>
            <span>
              <span className="block font-display text-3xl font-bold text-cream">بابلي</span>
              <span className="block text-[10px] font-semibold tracking-[0.25em] text-gold">BABLY · IRAQ</span>
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-7 text-cream/60">
            دار أزياء عراقية تصمم في بغداد وتصنع بحب. إرث بابل في خياطة كل قطعة، وخدمة تليق بأهل الرافدين.
          </p>
          <div className="mt-5 flex gap-2">
            {[Camera, AtSign, Send].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="تواصل اجتماعي"
                className="grid size-10 place-items-center rounded-full border border-white/15 text-cream/70 transition-all hover:border-gold hover:bg-gold hover:text-ink"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {footerNavs.map((nav) => (
          <div key={nav.title}>
            <p className="mb-4 font-display text-lg font-bold text-gold">{nav.title}</p>
            <ul className="space-y-2.5">
              {nav.links.map((l) => (
                <li key={l.href + l.label}>
                  <Link href={l.href} className="text-sm text-cream/65 transition-colors hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <p className="mb-4 font-display text-lg font-bold text-gold">تواصل معنا</p>
          <ul className="space-y-3.5 text-sm text-cream/65">
            <li className="flex items-center gap-3">
              <MapPin className="size-4 shrink-0 text-gold" />
              شارع الرشيد، المنصور — بغداد، العراق
            </li>
            <li className="flex items-center gap-3" dir="ltr">
              <Phone className="size-4 shrink-0 text-gold" />
              <span className="ml-auto text-cream/75">+964 771 000 1122</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="size-4 shrink-0 text-gold" />
              care@bably.iq
            </li>
          </ul>
          <p className="mt-5 rounded-xl border border-white/10 bg-white/5 p-3 text-xs leading-6 text-cream/55">
            خدمة العملاء يومياً من 9 صباحاً حتى 9 مساءً، عدا الجمعة.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-xs text-cream/45 sm:flex-row">
          <p>© 2026 بابلي للأزياء. جميع الحقوق محفوظة.</p>
          <p className="flex items-center gap-1.5">
            صُنع بفخر في العراق
            <span className="inline-block size-3.5 rounded-full bg-gold/30" />
          </p>
        </div>
      </div>
    </footer>
  );
}
