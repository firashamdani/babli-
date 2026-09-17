"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BadgeCheck, MessageSquareQuote, Star } from "lucide-react";
import type { Review } from "@/db/schema";
import { addReview } from "@/lib/actions";
import { cn, timeAgoAr } from "@/lib/format";
import { Stars } from "./stars";

export function ReviewsSection({
  productId,
  slug,
  reviews,
  rating,
  ratingCount,
}: {
  productId: number;
  slug: string;
  reviews: Review[];
  rating: number;
  ratingCount: number;
}) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(false);
  const [author, setAuthor] = useState("");
  const [city, setCity] = useState("بغداد");
  const [starsPick, setStarsPick] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const counts = [5, 4, 3, 2, 1].map((s) => ({
    star: s,
    n: reviews.filter((r) => r.rating === s).length,
  }));
  const total = Math.max(reviews.length, 1);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await addReview({ productId, slug, author, city, rating: starsPick, comment });
    setBusy(false);
    if (res.ok) {
      setMsg("شكراً لك! تم نشر تقييمك بنجاح.");
      setAuthor("");
      setComment("");
      setFormOpen(false);
      router.refresh();
    } else {
      setMsg(res.error);
    }
  };

  return (
    <section className="mt-14">
      <div className="mb-6 flex items-center gap-3">
        <MessageSquareQuote className="size-6 text-gold-deep" />
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">تقييمات الزبائن</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        {/* Summary */}
        <div className="h-fit rounded-3xl border border-ink/8 bg-white p-6 shadow-card lg:sticky lg:top-36">
          <div className="flex items-end gap-2">
            <span className="font-display text-5xl font-bold text-ink tabular-nums">{rating.toFixed(1)}</span>
            <span className="pb-1.5 text-sm text-ink/40">من 5</span>
          </div>
          <Stars rating={rating} size="size-4" className="mt-2" />
          <p className="mt-1.5 text-xs text-ink/45">{ratingCount} تقييم</p>

          <div className="mt-5 space-y-2">
            {counts.map((c) => (
              <div key={c.star} className="flex items-center gap-2 text-xs">
                <span className="w-6 shrink-0 font-bold text-ink/60 tabular-nums">{c.star}★</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${(c.n / total) * 100}%` }} />
                </div>
                <span className="w-6 shrink-0 text-ink/40 tabular-nums">{c.n}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => setFormOpen((v) => !v)}
            className="mt-6 w-full rounded-full bg-lapis-deep py-3 text-sm font-bold text-white transition-colors hover:bg-lapis"
          >
            {formOpen ? "إخفاء النموذج" : "اكتب تقييمك"}
          </button>
          {msg && (
            <p className={cn("mt-3 rounded-xl p-3 text-center text-xs font-semibold", resOK(msg) ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600")}>
              {msg}
            </p>
          )}

          {formOpen && (
            <form onSubmit={submit} className="mt-4 space-y-3 border-t border-ink/8 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-ink/60">تقييمك</span>
                <div className="flex gap-1">
                  {[5, 4, 3, 2, 1].map((s) => (
                    <button key={s} type="button" onClick={() => setStarsPick(s)} aria-label={`${s} نجوم`}>
                      <Star
                        className={cn("size-5 transition-colors", s <= starsPick ? "fill-gold text-gold" : "text-sand")}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="الاسم"
                className="w-full rounded-xl border border-ink/10 bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-gold"
              />
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="المحافظة"
                className="w-full rounded-xl border border-ink/10 bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-gold"
              />
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="شاركنا تجربتك مع القطعة…"
                rows={3}
                className="w-full resize-none rounded-xl border border-ink/10 bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-gold"
              />
              <button
                disabled={busy}
                className="w-full rounded-full bg-gold py-2.5 text-sm font-bold text-ink transition-all hover:bg-gold-deep hover:text-white disabled:opacity-50"
              >
                {busy ? "جارٍ النشر…" : "نشر التقييم"}
              </button>
            </form>
          )}
        </div>

        {/* List */}
        <ul className="space-y-4">
          {reviews.length === 0 && (
            <li className="rounded-3xl border border-dashed border-ink/15 bg-white/60 p-10 text-center text-sm text-ink/45">
              لا تقييمات بعد — كن أول من يشاركنا تجربته مع هذه القطعة.
            </li>
          )}
          {reviews.map((r) => (
            <li key={r.id} className="rounded-3xl border border-ink/6 bg-white/80 p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-lapis-soft text-sm font-bold text-lapis">
                    {r.author.slice(0, 2)}
                  </span>
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-bold text-ink">
                      {r.author}
                      {r.verified && <BadgeCheck className="size-4 text-emerald-600" />}
                    </p>
                    <p className="text-[11px] text-ink/40">
                      {r.city} · {timeAgoAr(r.createdAt)}
                      {r.verified && " · مشتري موثّق"}
                    </p>
                  </div>
                </div>
                <Stars rating={r.rating} size="size-3.5" />
              </div>
              <p className="mt-3 text-sm leading-7 text-ink/70">{r.comment}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function resOK(msg: string) {
  return msg.startsWith("شكراً");
}
