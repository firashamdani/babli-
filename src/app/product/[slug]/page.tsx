import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, CreditCard, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { getCategories, getProductBySlug, getRelatedProducts, getReviews } from "@/lib/data";
import { ProductGallery } from "@/components/product-gallery";
import { AddToCartPanel } from "@/components/add-to-cart-panel";
import { Accordion } from "@/components/accordion";
import { ReviewsSection } from "@/components/reviews-section";
import { ProductCard } from "@/components/product-card";
import { Stars } from "@/components/stars";
import { discountPercent, formatIQD, shippingFeeFor } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: "منتج غير موجود" };
  return {
    title: p.name,
    description: p.shortDesc,
    openGraph: { title: p.name, description: p.shortDesc, images: p.images[0] ? [p.images[0]] : [] },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, related, productReviews] = await Promise.all([
    getCategories(),
    getRelatedProducts(product),
    getReviews(product.id),
  ]);
  const category = categories.find((c) => c.id === product.categoryId);
  const catName = Object.fromEntries(categories.map((c) => [String(c.id), c.name]));
  const off = discountPercent(product.price, product.compareAt);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc,
    image: product.images,
    offers: {
      "@type": "Offer",
      priceCurrency: "IQD",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
    aggregateRating:
      product.ratingCount > 0
        ? { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.ratingCount }
        : undefined,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs font-semibold text-ink/45" aria-label="مسار التنقل">
        <Link href="/" className="transition-colors hover:text-gold-deep">الرئيسية</Link>
        <ChevronLeft className="size-3.5" />
        <Link href="/products" className="transition-colors hover:text-gold-deep">المتجر</Link>
        {category && (
          <>
            <ChevronLeft className="size-3.5" />
            <Link href={`/products?cat=${category.slug}`} className="transition-colors hover:text-gold-deep">
              {category.name}
            </Link>
          </>
        )}
        <ChevronLeft className="size-3.5" />
        <span className="truncate text-ink/70">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery */}
        <ProductGallery images={product.images} name={product.name} badge={off ? `خصم ${off}%` : product.newArrival ? "جديد" : null} />

        {/* Info */}
        <div>
          {category && (
            <Link
              href={`/products?cat=${category.slug}`}
              className="text-xs font-bold tracking-[0.15em] text-gold-deep uppercase"
            >
              {category.name}
            </Link>
          )}
          <h1 className="mt-2 font-display text-3xl leading-tight font-bold text-ink sm:text-4xl">{product.name}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-3">
            {product.rating > 0 && (
              <>
                <Stars rating={product.rating} size="size-4" />
                <span className="text-sm font-bold text-ink tabular-nums">{product.rating.toFixed(1)}</span>
                <a href="#reviews" className="text-sm text-ink/45 underline-offset-4 hover:underline">
                  ({product.ratingCount} تقييم)
                </a>
              </>
            )}
            <span className="hidden text-ink/20 sm:inline">·</span>
            <span className="text-xs text-ink/40" dir="ltr">
              SKU: BL-{String(product.id).padStart(4, "0")}
            </span>
          </div>

          <p className="mt-4 max-w-lg text-[15px] leading-8 text-ink/60">{product.shortDesc}</p>

          {/* Price */}
          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl border border-gold/25 bg-gold/8 px-5 py-4">
            <span className="font-display text-4xl font-bold text-lapis tabular-nums">{formatIQD(product.price)}</span>
            {product.compareAt && (
              <span className="text-lg text-ink/35 line-through tabular-nums">{formatIQD(product.compareAt)}</span>
            )}
            {off && (
              <span className="rounded-full bg-gold px-3 py-1 text-xs font-bold text-ink">
                وفّر {formatIQD(product.compareAt! - product.price)} ({off}%)
              </span>
            )}
          </div>

          <AddToCartPanel product={product} />

          {/* Trust */}
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: CreditCard, t: "دفع عند الاستلام" },
              { icon: Truck, t: "توصيل 2-5 أيام" },
              { icon: RefreshCcw, t: "استبدال مجاني" },
              { icon: ShieldCheck, t: "جودة مضمونة" },
            ].map((x) => (
              <div key={x.t} className="flex flex-col items-center gap-1.5 rounded-2xl border border-ink/6 bg-white px-2 py-3.5 text-center">
                <x.icon className="size-5 text-gold-deep" />
                <span className="text-[11px] font-bold text-ink/70">{x.t}</span>
              </div>
            ))}
          </div>
          <p className="mt-3 text-center text-[11px] text-ink/40">
            التوصيل لبغداد {formatIQD(shippingFeeFor("بغداد", 0))} · باقي المحافظات {formatIQD(6000)} · مجاني فوق {formatIQD(250000)}
          </p>

          {/* Accordions */}
          <div className="mt-8">
            <Accordion
              items={[
                {
                  title: "الوصف والتفاصيل",
                  content: (
                    <div className="space-y-4">
                      <p>{product.longDesc}</p>
                      {product.details.length > 0 && (
                        <dl className="divide-y divide-ink/6 rounded-xl border border-ink/8">
                          {product.details.map((d) => (
                            <div key={d.label} className="flex items-start justify-between gap-4 px-4 py-2.5 text-sm">
                              <dt className="shrink-0 font-bold text-ink/70">{d.label}</dt>
                              <dd className="text-left text-ink/55">{d.value}</dd>
                            </div>
                          ))}
                        </dl>
                      )}
                    </div>
                  ),
                },
                {
                  title: "الشحن والاستبدال",
                  content: (
                    <ul className="list-disc space-y-2 pr-5">
                      <li>نوصل لجميع محافظات العراق خلال 2 إلى 5 أيام عمل.</li>
                      <li>الدفع نقداً عند الاستلام — افحص طلبك قبل الدفع.</li>
                      <li>استبدال أو إرجاع مجاني خلال 7 أيام بحالة الطلب الأصلية.</li>
                      <li>فريق خدمة العملاء يتواصل معك هاتفياً لتأكيد الطلب قبل الشحن.</li>
                    </ul>
                  ),
                },
                {
                  title: "لماذا بابلي؟",
                  content:
                    "كل قطعة في بابلي تمر بفحص جودة من ثلاث مراحل قبل تغليفها، ونختار خاماتنا من موردين معتمدين في تركيا والإمارات. إن لم تعجبك القطعة عند الاستلام، أعِدها مع المندوب بلا أي سؤال.",
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div id="reviews">
        <ReviewsSection
          productId={product.id}
          slug={product.slug}
          reviews={productReviews}
          rating={product.rating}
          ratingCount={product.ratingCount}
        />
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-ink/8 pt-12">
          <div className="mb-7 flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">قد يعجبك أيضاً</h2>
            <Link
              href={category ? `/products?cat=${category.slug}` : "/products"}
              className="flex items-center gap-1 text-sm font-bold text-gold-deep hover:text-ink"
            >
              المزيد من {category?.name ?? "المتجر"}
              <ChevronLeft className="size-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} categoryName={catName[String(p.categoryId)]} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
