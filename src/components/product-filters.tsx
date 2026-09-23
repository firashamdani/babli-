"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SlidersHorizontal, X, Search, ChevronDown, BadgePercent, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/format";

type Cat = { name: string; slug: string };

const SORTS = [
  { value: "", label: "الأكثر تميزاً" },
  { value: "popular", label: "الأكثر مبيعاً" },
  { value: "rating", label: "الأعلى تقييماً" },
  { value: "price-asc", label: "السعر: من الأقل" },
  { value: "price-desc", label: "السعر: من الأعلى" },
  { value: "discount", label: "أعلى خصم" },
];

export function FiltersBar({ categories, count }: { categories: Cat[]; count: number }) {
  const router = useRouter();
  const params = useSearchParams();
  const [sheetOpen, setSheetOpen] = useState(false);

  const current = useMemo(
    () => ({
      q: params.get("q") ?? "",
      cat: params.get("cat") ?? "",
      collection: params.get("collection") ?? "",
      min: params.get("min") ?? "",
      max: params.get("max") ?? "",
      rating: params.get("rating") ?? "",
      sale: params.get("sale") === "1",
      isNew: params.get("new") === "1",
      sort: params.get("sort") ?? "",
    }),
    [params]
  );

  const push = (next: Record<string, string | boolean>) => {
    const sp = new URLSearchParams();
    const merged = { ...current, ...next } as Record<string, string | boolean>;
    Object.entries(merged).forEach(([k, v]) => {
      if (v === true) sp.set(k, "1");
      else if (typeof v === "string" && v) sp.set(k, v);
    });
    router.push(`/products?${sp.toString()}`);
  };

  const [minVal, setMinVal] = useState(current.min);
  const [maxVal, setMaxVal] = useState(current.max);
  // Re-sync the price inputs when the URL changes (derived during render, not in an effect).
  const [syncedRange, setSyncedRange] = useState(`${current.min}|${current.max}`);
  if (syncedRange !== `${current.min}|${current.max}`) {
    setSyncedRange(`${current.min}|${current.max}`);
    setMinVal(current.min);
    setMaxVal(current.max);
  }

  const activeCount =
    [current.cat, current.collection, current.min, current.max, current.rating].filter(Boolean).length +
    (current.sale ? 1 : 0) +
    (current.isNew ? 1 : 0);

  const Panel = (
    <div className="space-y-7">
      {/* Category */}
      <div>
        <p className="mb-3 text-sm font-bold text-ink">التصنيف</p>
        <div className="grid gap-1.5">
          <button
            onClick={() => push({ cat: "" })}
            className={cn(
              "rounded-xl px-3.5 py-2 text-right text-sm font-semibold transition-colors",
              !current.cat ? "bg-lapis-deep text-white" : "bg-white text-ink/65 hover:bg-ink/5"
            )}
          >
            كل التصنيفات
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => push({ cat: current.cat === c.slug ? "" : c.slug })}
              className={cn(
                "rounded-xl px-3.5 py-2 text-right text-sm font-semibold transition-colors",
                current.cat === c.slug ? "bg-lapis-deep text-white" : "bg-white text-ink/65 hover:bg-ink/5"
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="mb-3 text-sm font-bold text-ink">السعر (د.ع)</p>
        <div className="flex items-center gap-2">
          <input
            value={minVal}
            onChange={(e) => setMinVal(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="من"
            inputMode="numeric"
            className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-center text-sm font-semibold outline-none focus:border-gold"
          />
          <span className="text-ink/30">—</span>
          <input
            value={maxVal}
            onChange={(e) => setMaxVal(e.target.value.replace(/[^0-9]/g, ""))}
            placeholder="إلى"
            inputMode="numeric"
            className="w-full rounded-xl border border-ink/10 bg-white px-3 py-2.5 text-center text-sm font-semibold outline-none focus:border-gold"
          />
        </div>
        <button
          onClick={() => push({ min: minVal, max: maxVal })}
          className="mt-2 w-full rounded-xl bg-ink/5 py-2.5 text-sm font-bold text-ink transition-colors hover:bg-ink/10"
        >
          تطبيق
        </button>
      </div>

      {/* Rating */}
      <div>
        <p className="mb-3 text-sm font-bold text-ink">التقييم</p>
        <div className="flex gap-2">
          {[
            { v: "", label: "الكل" },
            { v: "4", label: "4.0+" },
            { v: "4.5", label: "4.5+" },
          ].map((r) => (
            <button
              key={r.v}
              onClick={() => push({ rating: r.v === "4" || r.v === "4.5" ? r.v : "" })}
              className={cn(
                "flex-1 rounded-xl border px-3 py-2 text-[13px] font-bold transition-colors",
                current.rating === r.v || (!r.v && !current.rating)
                  ? "border-gold bg-gold/15 text-gold-deep"
                  : "border-ink/10 bg-white text-ink/60 hover:border-gold"
              )}
            >
              {r.v ? (
                <span className="flex items-center justify-center gap-1">
                  <Star className="size-3 fill-gold text-gold" />
                  {r.label}
                </span>
              ) : (
                r.label
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-2">
        <p className="mb-1 text-sm font-bold text-ink">خيارات</p>
        {[
          { key: "sale", label: "في العروض فقط", icon: BadgePercent, active: current.sale },
          { key: "new", label: "وصل حديثاً", icon: Sparkles, active: current.isNew },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => push({ [t.key]: !t.active })}
            className={cn(
              "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-colors",
              t.active ? "border-gold bg-gold/15 text-gold-deep" : "border-ink/10 bg-white text-ink/60"
            )}
          >
            <span className="flex items-center gap-2">
              <t.icon className="size-4" />
              {t.label}
            </span>
            <span className={cn("size-2 rounded-full", t.active ? "bg-gold-deep" : "bg-ink/15")} />
          </button>
        ))}
      </div>

      {activeCount > 0 && (
        <button
          onClick={() => router.push(current.q ? `/products?q=${current.q}` : "/products")}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-ink/20 py-2.5 text-sm font-semibold text-ink/55 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <X className="size-4" />
          مسح كل الفلاتر ({activeCount})
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Top bar: search + sort + mobile filter */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <form
          className="flex min-w-52 flex-1 items-center gap-2 rounded-full border border-ink/10 bg-white px-4 py-2.5 shadow-sm"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            push({ q: String(fd.get("q") ?? "") });
          }}
        >
          <Search className="size-4 shrink-0 text-ink/40" />
          <input
            name="q"
            defaultValue={current.q}
            placeholder="ابحث في المتجر…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/35"
          />
        </form>

        <div className="relative">
          <select
            value={current.sort}
            onChange={(e) => push({ sort: e.target.value })}
            className="appearance-none rounded-full border border-ink/10 bg-white py-2.5 pr-4 pl-9 text-sm font-bold text-ink shadow-sm outline-none focus:border-gold"
            aria-label="ترتيب حسب"
          >
            {SORTS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-ink/40" />
        </div>

        <button
          onClick={() => setSheetOpen(true)}
          className="flex items-center gap-2 rounded-full bg-lapis-deep px-4 py-2.5 text-sm font-bold text-white shadow-sm lg:hidden"
        >
          <SlidersHorizontal className="size-4" />
          تصفية
          {activeCount > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] text-ink">{activeCount}</span>}
        </button>

        <span className="mr-auto hidden text-xs font-semibold text-ink/40 sm:block" dir="rtl">
          {count} منتجاً
        </span>
      </div>

      {/* Active chips */}
      {(current.q || current.collection || activeCount > 0) && (
        <div className="mb-5 flex flex-wrap items-center gap-2">
          {current.q && (
            <Chip label={`بحث: ${current.q}`} onClear={() => push({ q: "" })} />
          )}
          {current.collection && (
            <Chip label="تشكيلة مختارة" onClear={() => push({ collection: "" })} />
          )}
          {current.cat && <Chip label={categories.find((c) => c.slug === current.cat)?.name ?? "تصنيف"} onClear={() => push({ cat: "" })} />}
          {current.min && <Chip label={`من ${Number(current.min).toLocaleString()}`} onClear={() => push({ min: "" })} />}
          {current.max && <Chip label={`إلى ${Number(current.max).toLocaleString()}`} onClear={() => push({ max: "" })} />}
          {current.rating && <Chip label={`تقييم ${current.rating}+`} onClear={() => push({ rating: "" })} />}
          {current.sale && <Chip label="العروض" onClear={() => push({ sale: false })} />}
          {current.isNew && <Chip label="جديد" onClear={() => push({ new: false })} />}
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="sticky top-36 hidden max-h-[calc(100vh-10rem)] overflow-y-auto rounded-3xl border border-ink/8 bg-cream/60 p-5 lg:block">
        {Panel}
      </aside>

      {/* Mobile sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[70] bg-ink/45 backdrop-blur-sm lg:hidden"
              onClick={() => setSheetOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="fixed inset-x-0 bottom-0 z-[70] max-h-[82vh] overflow-y-auto rounded-t-3xl bg-cream p-5 pb-8 lg:hidden"
            >
              <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-ink/15" />
              <div className="mb-5 flex items-center justify-between">
                <p className="font-display text-xl font-bold">تصفية النتائج</p>
                <button onClick={() => setSheetOpen(false)} className="rounded-full bg-ink/5 p-2" aria-label="إغلاق">
                  <X className="size-4" />
                </button>
              </div>
              {Panel}
              <button
                onClick={() => setSheetOpen(false)}
                className="mt-6 w-full rounded-full bg-lapis-deep py-3.5 text-sm font-bold text-white"
              >
                عرض {count} منتجاً
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Chip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <span className="flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/12 py-1.5 pr-3 pl-1.5 text-xs font-bold text-gold-deep">
      {label}
      <button onClick={onClear} aria-label={`إزالة ${label}`} className="grid size-4.5 place-items-center rounded-full hover:bg-gold/25">
        <X className="size-3" />
      </button>
    </span>
  );
}
