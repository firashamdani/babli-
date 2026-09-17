"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Banknote,
  ChevronLeft,
  Landmark,
  Loader2,
  Lock,
  MapPin,
  Phone,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useCart, cartKey } from "@/lib/cart";
import { CITIES, cn, formatIQD, shippingFeeFor } from "@/lib/format";
import { createOrder } from "@/lib/actions";

export default function CheckoutPage() {
  const { items, subtotal, clear, hydrated } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("بغداد");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shipping = useMemo(() => shippingFeeFor(city, subtotal), [city, subtotal]);
  const total = subtotal + shipping;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const res = await createOrder({
      name,
      phone,
      city,
      address,
      notes,
      lines: items.map((it) => ({ id: it.id, qty: it.qty, size: it.size, color: it.color })),
    });
    if (res.ok) {
      const code = res.code;
      clear();
      router.push(`/checkout/success?code=${code}`);
    } else {
      setError(res.error);
      setBusy(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="grid min-h-[50vh] place-items-center">
        <Loader2 className="size-8 animate-spin text-gold" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto grid max-w-4xl place-items-center px-6 py-28 text-center">
        <span className="grid size-20 place-items-center rounded-full bg-sand text-gold-deep">
          <ShoppingBag className="size-9" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink">سلتك فارغة بعد</h1>
        <p className="mt-3 max-w-xs text-sm leading-7 text-ink/50">أضف قطعاً تعجبك من تشكيلة بابلي ثم عد لإتمام طلبك.</p>
        <Link
          href="/products"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-lapis-deep px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-lapis"
        >
          تسوّق الآن
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-12">
      <nav className="mb-6 flex items-center gap-1.5 text-xs font-semibold text-ink/45">
        <Link href="/" className="hover:text-gold-deep">الرئيسية</Link>
        <ChevronLeft className="size-3.5" />
        <span className="text-ink/70">إتمام الطلب</span>
      </nav>

      <h1 className="font-display text-3xl font-bold text-ink sm:text-4xl">إتمام الطلب</h1>
      <p className="mt-2 flex items-center gap-1.5 text-sm text-ink/50">
        <Lock className="size-3.5 text-gold-deep" />
        معلوماتك محمية — الدفع عند الاستلام فقط حالياً
      </p>

      <form onSubmit={submit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
        {/* ─── Form side ─── */}
        <div className="space-y-6">
          {/* Delivery info */}
          <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
            <p className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-ink">
              <span className="grid size-8 place-items-center rounded-full bg-lapis-deep text-sm text-white">1</span>
              معلومات التوصيل
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="الاسم الكامل" icon={User}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: علي حسين الجبوري"
                  className="input"
                  required
                />
              </Field>
              <Field label="رقم الهاتف" icon={Phone}>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, "").slice(0, 11))}
                  placeholder="07XXXXXXXXX"
                  dir="ltr"
                  inputMode="tel"
                  className="input text-left"
                  required
                />
              </Field>
              <Field label="المحافظة" icon={MapPin} className="sm:col-span-1">
                <div className="relative">
                  <select value={city} onChange={(e) => setCity(e.target.value)} className="input appearance-none pl-9">
                    {CITIES.map((c) => (
                      <option key={c.name} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <ChevronLeft className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 rotate-90 text-ink/40" />
                </div>
              </Field>
              <Field label="العنوان التفصيلي" icon={MapPin}>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="المنطقة، الشارع، أقرب نقطة دالة"
                  className="input"
                  required
                />
              </Field>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-[13px] font-bold text-ink/70">ملاحظات للمندوب (اختياري)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  placeholder="وقت التوصيل المفضّل، تعليمات الوصول…"
                  className="input resize-none"
                />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
            <p className="mb-5 flex items-center gap-2 font-display text-xl font-bold text-ink">
              <span className="grid size-8 place-items-center rounded-full bg-lapis-deep text-sm text-white">2</span>
              طريقة الدفع
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="relative rounded-2xl border-2 border-gold bg-gold/10 p-4">
                <span className="absolute top-3 left-3 grid size-5 place-items-center rounded-full bg-gold text-[10px] font-bold text-ink">✓</span>
                <Banknote className="size-6 text-gold-deep" />
                <p className="mt-2.5 text-sm font-bold text-ink">الدفع عند الاستلام</p>
                <p className="mt-1 text-xs leading-6 text-ink/50">نقداً للمندوب بعد فحص الطلب — الطريقة الأكثر ثقة عند زبائننا.</p>
              </div>
              <div className="relative rounded-2xl border border-ink/10 bg-cream/50 p-4 opacity-60">
                <Landmark className="size-6 text-ink/40" />
                <p className="mt-2.5 text-sm font-bold text-ink/70">زين كاش / ماستر كارد</p>
                <p className="mt-1 text-xs leading-6 text-ink/45">قيد التفعيل قريباً.</p>
              </div>
            </div>
          </section>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-600"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-lapis-deep py-4 text-base font-bold text-white shadow-card transition-all hover:bg-lapis hover:shadow-lift active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                جارٍ تثبيت طلبك…
              </>
            ) : (
              <>
                تأكيد الطلب — {formatIQD(total)}
                <ArrowRight className="size-5 rotate-180" />
              </>
            )}
          </button>
          <p className="text-center text-xs text-ink/40">
            بتأكيد الطلب أنت توافق على شروط الاستخدام وسياسة الإرجاع الخاصة ببابلي.
          </p>
        </div>

        {/* ─── Summary side ─── */}
        <aside className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card lg:sticky lg:top-36">
          <p className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-ink">
            <ShoppingBag className="size-5 text-gold-deep" />
            ملخص الطلب
            <span className="text-sm font-sans font-semibold text-ink/40">({items.length})</span>
          </p>

          <ul className="thin-scroll max-h-72 space-y-3 overflow-y-auto pl-1">
            {items.map((it) => (
              <li key={cartKey(it)} className="flex items-center gap-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-sand">
                  <Image src={it.image} alt={it.name} fill sizes="56px" className="object-cover" />
                  <span className="absolute right-0.5 bottom-0.5 grid min-w-5 place-items-center rounded-md bg-ink/85 px-1 text-[10px] font-bold text-white">
                    {it.qty}×
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink">{it.name}</p>
                  <p className="mt-0.5 text-[11px] text-ink/45">
                    {[it.size && `مقاس ${it.size}`, it.color].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <p className="shrink-0 text-[13px] font-bold text-lapis">{formatIQD(it.price * it.qty)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2.5 border-t border-dashed border-ink/10 pt-4 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>المجموع الفرعي</span>
              <span className="font-bold text-ink">{formatIQD(subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span className="flex items-center gap-1.5">
                <Truck className="size-4 text-gold-deep" />
                التوصيل — {city}
              </span>
              {shipping === 0 ? (
                <span className="font-bold text-emerald-600">مجاني</span>
              ) : (
                <span className="font-bold text-ink">{formatIQD(shipping)}</span>
              )}
            </div>
            <div className="flex items-baseline justify-between border-t border-ink/8 pt-3">
              <span className="font-bold text-ink">الإجمالي</span>
              <span className={cn("font-display text-2xl font-bold text-lapis tabular-nums")}>{formatIQD(total)}</span>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-lapis-soft/60 p-4 text-xs leading-6 text-ink-soft">
            <p className="font-bold">ماذا يحدث بعد التأكيد؟</p>
            <p className="mt-1">
              يتصل بك فريق بابلي خلال ساعات العمل لتأكيد الطلب، ثم تُغلّف قطعك وتوصل خلال 2-5 أيام عمل.
            </p>
          </div>
        </aside>
      </form>

      <style jsx global>{`
        .input {
          width: 100%;
          border-radius: 0.9rem;
          border: 1px solid rgb(13 30 48 / 0.1);
          background: var(--color-cream);
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-ink);
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input::placeholder {
          color: rgb(13 30 48 / 0.3);
          font-weight: 400;
        }
        .input:focus {
          border-color: var(--color-gold);
          box-shadow: 0 0 0 3px rgb(193 154 73 / 0.15);
        }
      `}</style>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  children,
  className,
}: {
  label: string;
  icon: typeof User;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-bold text-ink/70">
        <Icon className="size-3.5 text-gold-deep" />
        {label}
      </label>
      {children}
    </div>
  );
}
