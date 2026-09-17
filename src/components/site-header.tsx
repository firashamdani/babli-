"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Search, ShoppingBag, X, ChevronLeft, Sparkles, BadgePercent, Shirt } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn, formatIQD } from "@/lib/format";

type NavCat = { name: string; slug: string };
type Suggestion = { id: number; name: string; slug: string; price: number; image: string };

const MARQUEE_ITEMS = [
  "شحن مجاني للطلبات فوق 250,000 د.ع",
  "توصيل لجميع محافظات العراق خلال 2-5 أيام",
  "الدفع عند الاستلام بدون أي رسوم إضافية",
  "إرجاع مجاني خلال 7 أيام",
];

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden>
      <path d="M16 3 27 10v14l-11 5-11-5V10L16 3Z" stroke="currentColor" strokeWidth="2" />
      <path d="M16 8.5 22 12v7.5l-6 2.8-6-2.8V12l6-3.5Z" fill="currentColor" opacity="0.28" />
    </svg>
  );
}

function SearchBox({ className, onDone }: { className?: string; onDone?: () => void }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const onChange = (v: string) => {
    setQ(v);
    if (timer.current) clearTimeout(timer.current);
    if (v.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(v.trim())}`);
        const data = (await res.json()) as { results: Suggestion[] };
        setResults(data.results);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  const submit = () => {
    if (!q.trim()) return;
    setOpen(false);
    onDone?.();
    router.push(`/products?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <div className="flex items-center gap-2 rounded-full border border-ink/10 bg-white/80 px-4 py-2.5 transition-shadow focus-within:border-gold/60 focus-within:shadow-card">
        <Search className="size-4 shrink-0 text-ink/45" />
        <input
          value={q}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="ابحث عن عباية، قميص، بلوزة…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink/35"
        />
        {loading && <span className="size-3.5 shrink-0 animate-spin rounded-full border-2 border-gold border-t-transparent" />}
      </div>

      <AnimatePresence>
        {open && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18 }}
            className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-lift"
          >
            {results.map((r) => (
              <Link
                key={r.id}
                href={`/product/${r.slug}`}
                onClick={() => {
                  setOpen(false);
                  onDone?.();
                  setQ("");
                }}
                className="flex items-center gap-3 border-b border-ink/5 px-3 py-2.5 transition-colors last:border-0 hover:bg-cream"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt={r.name} className="size-11 shrink-0 rounded-lg object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{r.name}</span>
                <span className="shrink-0 text-sm font-bold text-lapis">{formatIQD(r.price)}</span>
              </Link>
            ))}
            <button
              onClick={submit}
              className="flex w-full items-center justify-center gap-1.5 bg-lapis/5 px-3 py-2.5 text-sm font-semibold text-lapis transition-colors hover:bg-lapis/10"
            >
              عرض كل النتائج
              <ChevronLeft className="size-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SiteHeader({ categories }: { categories: NavCat[] }) {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes (derive during render instead of an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  const nav = [
    { href: "/", label: "الرئيسية" },
    { href: "/products", label: "تسوّق الكل" },
    ...categories.map((c) => ({ href: `/products?cat=${c.slug}`, label: c.name })),
    { href: "/products?sale=1", label: "العروض", accent: true },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : href === "/products" ? pathname === "/products" : false;

  return (
    <header className="sticky top-0 z-40">
      {/* Marquee bar */}
      <div className="pattern-ishtar relative overflow-hidden py-2 text-[12.5px] font-medium text-gold-soft">
        <div className="flex w-max animate-marquee gap-12 whitespace-nowrap px-6">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
            <span key={i} className="flex items-center gap-2">
              <Sparkles className="size-3 text-gold" />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Main header */}
      <div
        className={cn(
          "border-b transition-all duration-300",
          scrolled ? "border-ink/8 bg-cream/90 shadow-card backdrop-blur-xl" : "border-transparent bg-cream"
        )}
      >
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:gap-6">
          <button
            className="rounded-full p-2 text-ink transition-colors hover:bg-ink/5 lg:hidden"
            onClick={() => setMenuOpen(true)}
            aria-label="القائمة"
          >
            <Menu className="size-5" />
          </button>

          <Link href="/" className="flex items-center gap-2.5" aria-label="بابلي — الرئيسية">
            <span className="grid size-10 place-items-center rounded-xl bg-lapis-deep text-gold shadow-card">
              <LogoMark className="size-6" />
            </span>
            <span className="leading-none">
              <span className="block font-display text-[26px] font-bold text-ink">بابلي</span>
              <span className="mt-0.5 block text-[10px] font-semibold tracking-[0.22em] text-gold-deep">BABLY · IRAQ</span>
            </span>
          </Link>

          <nav className="mr-4 hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative rounded-full px-3.5 py-2 text-[13.5px] font-semibold transition-colors",
                  item.accent
                    ? "text-gold-deep hover:bg-gold/15"
                    : isActive(item.href)
                      ? "bg-lapis-deep text-white"
                      : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mr-auto flex items-center gap-1.5">
            <SearchBox className="hidden w-72 xl:block" />
            <button
              className="rounded-full p-2.5 text-ink transition-colors hover:bg-ink/5 xl:hidden"
              onClick={() => router.push("/products")}
              aria-label="البحث"
            >
              <Search className="size-5" />
            </button>
            <button
              onClick={openCart}
              className="relative grid size-11 place-items-center rounded-full bg-ink text-cream transition-transform hover:scale-105 active:scale-95"
              aria-label="سلة التسوق"
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute -top-1 -left-1 grid min-size-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-ink">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 flex w-[86%] max-w-sm flex-col bg-cream shadow-lift"
            >
              <div className="flex items-center justify-between border-b border-ink/8 p-4">
                <span className="flex items-center gap-2 font-display text-2xl font-bold">
                  <LogoMark className="size-6 text-gold-deep" />
                  بابلي
                </span>
                <button onClick={() => setMenuOpen(false)} className="rounded-full p-2 hover:bg-ink/5" aria-label="إغلاق">
                  <X className="size-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <SearchBox onDone={() => setMenuOpen(false)} className="mb-5" />
                <p className="mb-2 px-1 text-xs font-bold tracking-wider text-ink/40">التصنيفات</p>
                <div className="space-y-1">
                  {[
                    { href: "/", label: "الرئيسية", icon: Sparkles },
                    { href: "/products", label: "تسوّق الكل", icon: Shirt },
                    ...categories.map((c) => ({ href: `/products?cat=${c.slug}`, label: c.name, icon: Shirt })),
                    { href: "/products?sale=1", label: "العروض والخصومات", icon: BadgePercent },
                  ].map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl px-3 py-3 text-[15px] font-semibold text-ink/80 transition-colors hover:bg-ink/5"
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="size-4 text-gold-deep" />
                        {item.label}
                      </span>
                      <ChevronLeft className="size-4 text-ink/30" />
                    </Link>
                  ))}
                </div>
              </div>
              <div className="pattern-ishtar p-4 text-center text-xs leading-relaxed text-gold-soft">
                الدفع عند الاستلام · توصيل لكل العراق
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
