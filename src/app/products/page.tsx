import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";
import { getCategories, queryProducts } from "@/lib/data";
import { FiltersBar } from "@/components/product-filters";
import { ProductCard } from "@/components/product-card";
import { COLLECTIONS } from "@/lib/format";

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<Record<string, string | string[] | undefined>> };

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams;
  const q = typeof sp.q === "string" ? sp.q : "";
  return {
    title: q ? `نتائج البحث عن «${q}»` : "تسوّق كل المنتجات",
    description: "تصفح تشكيلة بابلي الكاملة: عبايات، فساتين، قمصان، دنيم وإكسسوارات بأسعار بالدينار العراقي والدفع عند الاستلام.",
  };
}

function num(v: string | string[] | undefined): number | undefined {
  if (typeof v !== "string" || !v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const params = {
    q: typeof sp.q === "string" ? sp.q : undefined,
    cat: typeof sp.cat === "string" ? sp.cat : undefined,
    collection: typeof sp.collection === "string" ? sp.collection : undefined,
    min: num(sp.min),
    max: num(sp.max),
    rating: num(sp.rating),
    sale: sp.sale === "1",
    isNew: sp.new === "1",
    sort: typeof sp.sort === "string" ? sp.sort : undefined,
  };

  const [categories, list] = await Promise.all([getCategories(), queryProducts(params)]);
  const catName = Object.fromEntries(categories.map((c) => [String(c.id), c.name]));

  const activeCat = categories.find((c) => c.slug === params.cat);
  const title = params.q
    ? `نتائج البحث عن «${params.q}»`
    : params.collection && COLLECTIONS[params.collection]
      ? COLLECTIONS[params.collection].title
      : activeCat
        ? activeCat.name
        : params.sale
          ? "العروض والخصومات"
          : params.isNew
            ? "وصل حديثاً"
            : "كل المنتجات";

  const subtitle =
    params.collection && COLLECTIONS[params.collection]
      ? COLLECTIONS[params.collection].blurb
      : activeCat?.tagline;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
      {/* Page head */}
      <div className="mb-8">
        <p className="text-xs font-bold tracking-[0.2em] text-gold-deep">بابلي · المتجر</p>
        <h1 className="mt-2 font-display text-3xl font-bold text-ink sm:text-4xl">{title}</h1>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-ink/50">{subtitle}</p>}
      </div>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:items-start lg:gap-8">
        <FiltersBar categories={categories.map((c) => ({ name: c.name, slug: c.slug }))} count={list.length} />

        {list.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-ink/15 bg-white/60 px-6 py-24 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-sand text-gold-deep">
              <PackageSearch className="size-7" />
            </span>
            <p className="mt-4 font-display text-2xl font-bold text-ink">لا توجد نتائج مطابقة</p>
            <p className="mt-2 max-w-xs text-sm leading-7 text-ink/50">
              جرّب توسيع نطاق البحث أو إزالة بعض الفلاتر — تشكيلتنا تتجدد كل أسبوع.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} categoryName={catName[String(p.categoryId)]} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
