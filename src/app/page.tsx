import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, BadgePercent, ChevronLeft, Crown, MapPin, Quote, Shirt, Sparkles, Star, Truck } from "lucide-react";
import { eq, desc } from "drizzle-orm";
import { db } from "@/db";
import { products as productsTable, reviews as reviewsTable } from "@/db/schema";
import { getCategories, getDeals, getFeaturedProducts, getNewArrivals } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { NewsletterForm } from "@/components/newsletter-form";
import { Stars } from "@/components/stars";
import { discountPercent, formatIQD } from "@/lib/format";

export const dynamic = "force-dynamic";

const collectionCards = [
  {
    tag: "gold",
    title: "اللمسة الذهبية",
    blurb: "تطريز ذهبي وعبايات سهرة مستوحاة من بوابة عشتار",
    image: "https://images.pexels.com/photos/32178223/pexels-photo-32178223.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=1100",
    count: "12 قطعة",
  },
  {
    tag: "summer",
    title: "تشكيلة الصيف",
    blurb: "كتان وقطن خفيف صُمم لحرارة تموز العراق",
    image: "https://images.pexels.com/photos/7736224/pexels-photo-7736224.jpeg?auto=compress&cs=tinysrgb&fit=crop&w=800&h=1100",
    count: "9 قطع",
  },
  {
    tag: "essentials",
    title: "الأساسيات الخالدة",
    blurb: "قمصان أكسفورد ودنيم يعيش معك سنين",
    image: "/images/men-editorial.jpg",
    count: "18 قطعة",
  },
];

export default async function HomePage() {
  const [categories, featured, deals, newArrivals, latestReviews] = await Promise.all([
    getCategories(),
    getFeaturedProducts(8),
    getDeals(5),
    getNewArrivals(8),
    db
      .select({
        author: reviewsTable.author,
        city: reviewsTable.city,
        rating: reviewsTable.rating,
        comment: reviewsTable.comment,
        productName: productsTable.name,
        slug: productsTable.slug,
      })
      .from(reviewsTable)
      .innerJoin(productsTable, eq(reviewsTable.productId, productsTable.id))
      .orderBy(desc(reviewsTable.createdAt))
      .limit(6),
  ]);
  const catName = Object.fromEntries(categories.map((c) => [c.slug, c.name]));
  const maxOff = Math.max(0, ...deals.map((d) => discountPercent(d.price, d.compareAt) ?? 0));

  return (
    <>
      {/* ═══════════ HERO ═══════════ */}
      <section className="pattern-dots relative overflow-hidden">
        <div className="pointer-events-none absolute -top-32 -left-32 size-[480px] rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -right-24 size-96 rounded-full bg-lapis/10 blur-3xl" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-2 lg:gap-6 lg:pt-16 lg:pb-24">
          {/* Copy */}
          <div className="relative z-10 text-center lg:text-right">
            <p
              className="animate-fade-up mx-auto inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold-deep lg:mx-0"
            >
              <Crown className="size-3.5" />
              دار أزياء عراقية · صُنع في بغداد
            </p>
            <h1
              className="animate-fade-up mt-5 font-display text-[44px] leading-[1.15] font-bold text-ink sm:text-6xl lg:text-[64px] lg:leading-[1.12]"
              style={{ animationDelay: "0.08s" }}
            >
              أناقة تليق
              <br />
              <span className="bg-gradient-to-l from-gold-deep via-gold to-gold-deep bg-clip-text text-transparent">
                بإرث بابل
              </span>
            </h1>
            <p
              className="animate-fade-up mx-auto mt-5 max-w-md text-[15px] leading-8 text-ink/60 lg:mx-0 lg:text-base"
              style={{ animationDelay: "0.16s" }}
            >
              عبايات مطرزة بخيوط ذهبية، كتان صيفي يتنفس مع الحرارة، ودنيم يرافقك سنين —
              نوصّلها إلى باب دارك في كل محافظات العراق، وتدفع عند الاستلام.
            </p>
            <div className="animate-fade-up mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" style={{ animationDelay: "0.24s" }}>
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-lapis-deep px-7 py-3.5 text-sm font-bold text-white shadow-card transition-all hover:bg-lapis hover:shadow-lift active:scale-[0.98]"
              >
                تسوّق الآن
                <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/products?sale=1"
                className="inline-flex items-center gap-2 rounded-full border-2 border-gold/60 bg-white/70 px-7 py-3.5 text-sm font-bold text-gold-deep backdrop-blur transition-all hover:bg-gold hover:text-ink active:scale-[0.98]"
              >
                <BadgePercent className="size-4" />
                عروض الأسبوع
              </Link>
            </div>

            <div className="animate-fade-up mt-10 flex items-center justify-center gap-8 lg:justify-start" style={{ animationDelay: "0.32s" }}>
              {[
                { n: "+4,800", l: "عميل سعيد" },
                { n: "4.8/5", l: "تقييم المتجر", star: true },
                { n: "18", l: "محافظة نوصلها" },
              ].map((s) => (
                <div key={s.l} className="text-center lg:text-right">
                  <p className="flex items-center justify-center gap-1 font-display text-2xl font-bold text-ink tabular-nums lg:justify-start">
                    {s.star && <Star className="size-4 fill-gold text-gold" />}
                    {s.n}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/45">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual */}
          <div className="animate-fade-up relative mx-auto w-full max-w-md lg:max-w-none" style={{ animationDelay: "0.2s" }}>
            <div className="relative">
              {/* Arch frame */}
              <div className="rounded-t-[999px] rounded-b-[2.5rem] bg-gradient-to-b from-gold via-gold/60 to-gold/20 p-[3px] shadow-lift">
                <div className="relative aspect-[4/5.2] overflow-hidden rounded-t-[999px] rounded-b-[2.3rem]">
                  <Image
                    src="/images/hero-ataba.jpg"
                    alt="عباية ذهبية أمام جدار لازوردي مستوحى من بوابة عشتار"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 45vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-lapis-deep/30 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating cards */}
              <div className="animate-float absolute -right-3 top-24 rounded-2xl border border-ink/5 bg-white/90 p-3 shadow-lift backdrop-blur sm:-right-8">
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-ink">
                  <span className="grid size-7 place-items-center rounded-full bg-gold/20"><Shirt className="size-3.5 text-gold-deep" /></span>
                  تشكيلة عشتار الجديدة
                </p>
              </div>
              <div
                className="animate-float absolute -left-3 top-56 rounded-2xl border border-ink/5 bg-white/90 p-3 shadow-lift backdrop-blur sm:-left-10"
                style={{ animationDelay: "1.2s" }}
              >
                <p className="flex items-center gap-1.5 text-[11px] font-bold text-ink">
                  <span className="grid size-7 place-items-center rounded-full bg-lapis/10"><Truck className="size-3.5 text-lapis" /></span>
                  توصيل خلال 48 ساعة داخل بغداد
                </p>
              </div>
              <div
                className="animate-float absolute bottom-14 left-1/2 w-64 -translate-x-1/2 rounded-2xl border border-gold/25 bg-lapis-deep/90 p-3.5 text-cream shadow-lift backdrop-blur"
                style={{ animationDelay: "0.6s" }}
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[12px] font-bold">عباية «سنحرّة» بتطريز ذهبي</p>
                    <p className="mt-1 text-[13px] font-bold text-gold">{formatIQD(145000)}</p>
                  </div>
                  <Link
                    href="/product/sinharib-gold-abaya"
                    className="grid size-9 shrink-0 place-items-center rounded-full bg-gold text-ink transition-transform hover:scale-110"
                    aria-label="عرض العباية"
                  >
                    <ArrowLeft className="size-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CATEGORIES ═══════════ */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionHeading
          eyebrow="تسوّقي حسب الذوق"
          title="تصنيفات بابلي"
          link={{ href: "/products", label: "كل المنتجات" }}
        />
        <div className="mt-8 flex gap-4 overflow-x-auto pb-3 no-scrollbar sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-5">
          {categories.map((c, i) => (
            <Link
              key={c.slug}
              href={`/products?cat=${c.slug}`}
              className="group w-44 shrink-0 sm:w-auto"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="relative aspect-[3/3.6] overflow-hidden rounded-t-[6rem] rounded-b-2xl shadow-card transition-shadow duration-500 group-hover:shadow-lift">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 180px, 20vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3.5 text-center">
                  <p className="font-display text-lg font-bold text-white">{c.name}</p>
                </div>
              </div>
              <p className="mt-2.5 text-center text-xs font-semibold text-ink/45 transition-colors group-hover:text-gold-deep">
                {c.tagline}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════ COLLECTIONS ═══════════ */}
      <section className="bg-parchment/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading eyebrow="مختارات المصممين" title="تشكيلات الموسم" />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {collectionCards.map((c) => (
              <Link
                key={c.tag}
                href={`/products?collection=${c.tag}`}
                className="group relative flex flex-col justify-end overflow-hidden rounded-3xl shadow-card transition-shadow duration-500 hover:shadow-lift"
              >
                <div className="relative aspect-[4/4.4]">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-107"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-lapis-deep/90 via-lapis-deep/25 to-transparent" />
                </div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="rounded-full border border-gold/50 bg-ink/30 px-3 py-1 text-[11px] font-bold text-gold backdrop-blur">
                    {c.count}
                  </span>
                  <h3 className="mt-3 font-display text-3xl font-bold text-white">{c.title}</h3>
                  <p className="mt-1.5 max-w-56 text-sm leading-6 text-white/70">{c.blurb}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-sm font-bold text-gold transition-transform duration-300 group-hover:-translate-x-1">
                    اكتشف التشكيلة
                    <ChevronLeft className="size-4" />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ FEATURED ═══════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <SectionHeading
          eyebrow="الأكثر طلباً هذا الأسبوع"
          title="قطع يعشقها زبائننا"
          link={{ href: "/products?sort=popular", label: "عرض الكل" }}
        />
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} categoryName={catNameById(categories, p.categoryId)} />
          ))}
        </div>
      </section>

      {/* ═══════════ DEALS ═══════════ */}
      <section className="pattern-ishtar relative overflow-hidden py-16">
        <div className="pointer-events-none absolute -top-24 right-1/4 size-80 rounded-full bg-gold/15 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="flex items-center gap-2 text-sm font-bold text-gold">
                <BadgePercent className="size-4" />
                لفترة محدودة
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold text-white sm:text-4xl">
                عروض درّة التاج — خصومات تصل إلى {maxOff > 0 ? `${maxOff}%` : "30%"}
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-white/60">
                قطع مختارة من أفضل خامات الموسم بأسعار مدروسة. الكمية محدودة — والدفع عند الاستلام كالعادة.
              </p>
            </div>
            <Link
              href="/products?sale=1"
              className="group inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3.5 text-sm font-bold text-ink transition-all hover:bg-gold-soft hover:shadow-lift"
            >
              كل العروض
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
            </Link>
          </div>
          <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
            {deals.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} categoryName={catNameById(categories, p.categoryId)} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ EDITORIAL: MEN ═══════════ */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2">
        <div className="relative order-2 lg:order-1">
          <div className="relative aspect-[4/4.6] overflow-hidden rounded-3xl shadow-lift">
            <Image
              src="/images/men-editorial.jpg"
              alt="رجل بزي كتاني عراقي في زقاق بغدادي قديم"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className="absolute -bottom-5 left-6 rounded-2xl bg-white p-4 shadow-lift sm:-left-4">
            <p className="flex items-center gap-2 text-xs font-bold text-ink">
              <MapPin className="size-4 text-gold-deep" />
              تصويرنا — أسواق بغداد القديمة
            </p>
          </div>
        </div>
        <div className="order-1 text-center lg:order-2 lg:text-right">
          <p className="text-sm font-bold text-gold-deep">ركن الرجال</p>
          <h2 className="mt-3 font-display text-4xl leading-tight font-bold text-ink sm:text-5xl">
            بساطتك
            <span className="text-gold-deep">،</span> فخامتك
          </h2>
          <p className="mx-auto mt-5 max-w-md text-[15px] leading-8 text-ink/60 lg:mx-0">
            قمصان أكسفورد بخياطة تدوم، طقم كتان يتنفس في حرارة آب، ودنيم بقصّة مدروسة.
            ركن الرجال في بابلي صُمم للعراقي الذي يعرف أن الأناقة تبدأ من التفاصيل الصغيرة.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/products?cat=men"
              className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3.5 text-sm font-bold text-white transition-all hover:bg-lapis-deep active:scale-[0.98]"
            >
              <Shirt className="size-4" />
              تسوّق رجال
            </Link>
            <Link
              href="/product/classic-denim-jacket"
              className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:border-gold hover:text-gold-deep"
            >
              جاكيت الدنيم الأكثر مبيعاً
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ NEW ARRIVALS ═══════════ */}
      <section className="bg-parchment/60 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            eyebrow="حديث وصول"
            title="آخر ما وصل المخزن"
            link={{ href: "/products?new=1", label: "كل الجديد" }}
          />
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {newArrivals.slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} categoryName={catNameById(categories, p.categoryId)} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ QUOTE / TESTIMONIALS ═══════════ */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="pattern-dots rounded-[2.5rem] border border-gold/20 bg-white/70 px-6 py-12 text-center shadow-card sm:px-12">
          <Quote className="mx-auto size-8 text-gold" />
          <p className="mx-auto mt-4 max-w-2xl font-display text-2xl leading-relaxed font-bold text-ink sm:text-3xl">
            «من زخارف بوابة عشتار نأخذ خطوطنا، ومن حنكة خيّاطي بغداد نأخذ حرفتنا،
            ونحيكها جميعاً في قطعة تليق بك.»
          </p>
          <p className="mt-4 text-sm font-semibold text-ink/45">— فريق بابلي للتصميم</p>
        </div>

        {latestReviews.length > 0 && (
          <div className="mt-12">
            <SectionHeading eyebrow="كلام زبائننا" title="تقييمات من كل العراق" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {latestReviews.slice(0, 6).map((r, i) => (
                <Link
                  key={i}
                  href={`/product/${r.slug}`}
                  className="group rounded-3xl border border-ink/6 bg-white p-6 shadow-sm transition-shadow hover:shadow-card"
                >
                  <Stars rating={r.rating} size="size-3.5" />
                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink/70">{r.comment}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-ink/6 pt-3">
                    <p className="text-xs font-bold text-ink">
                      {r.author} <span className="font-normal text-ink/40">· {r.city}</span>
                    </p>
                    <Sparkles className="size-3.5 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-1 truncate text-[11px] text-ink/40">{r.productName}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ═══════════ NEWSLETTER ═══════════ */}
      <section className="mx-auto max-w-7xl px-4 pb-4 sm:px-6">
        <div className="pattern-ishtar relative overflow-hidden rounded-[2.5rem] px-6 py-14 text-center shadow-lift sm:px-12">
          <div className="pointer-events-none absolute -top-20 left-1/3 size-64 rounded-full bg-gold/20 blur-3xl" />
          <Crown className="mx-auto size-8 text-gold" />
          <h2 className="mt-4 font-display text-3xl font-bold text-white sm:text-4xl">كن أول من يعرف</h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-white/60">
            انضم إلى مجلس بابلي: تشكيلات جديدة، عروض حصرية، ومحتوى أناقة عراقي أصيل — مرة أسبوعياً، بلا إزعاج.
          </p>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}

function SectionHeading({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: { href: string; label: string };
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="flex items-center gap-2 text-sm font-bold text-gold-deep">
          <Sparkles className="size-4" />
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h2>
      </div>
      {link && (
        <Link
          href={link.href}
          className="group flex items-center gap-1.5 text-sm font-bold text-gold-deep transition-colors hover:text-ink"
        >
          {link.label}
          <ChevronLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

function catNameById(categories: { id: number; name: string }[], id: number) {
  return categories.find((c) => c.id === id)?.name ?? "بابلي";
}
