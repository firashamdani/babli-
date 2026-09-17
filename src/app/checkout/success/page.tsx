import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CheckCircle2, Copy, CreditCard, MapPin, Phone, Truck, User } from "lucide-react";
import { getOrderByCode } from "@/lib/data";
import { formatIQD } from "@/lib/format";

export const dynamic = "force-dynamic";

const STEPS = ["تم استلام طلبك", "قيد التجهيز", "مع المندوب", "وصل باب دارك"];

export default async function SuccessPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const code = sp.code ?? "";
  const order = code ? await getOrderByCode(code) : null;
  if (!order) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      {/* Hero */}
      <div className="rounded-[2.5rem] border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white px-6 py-12 text-center shadow-card sm:px-12">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-emerald-500 text-white shadow-lift">
          <CheckCircle2 className="size-10" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink sm:text-4xl">طلبك وصلنا، شكراً لثقتك</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-ink/55">
          سيتصل بك فريق بابلي خلال ساعات العمل لتأكيد الطلب قبل الشحن. احتفظ برقم الطلب للمتابعة.
        </p>
        <div className="mx-auto mt-6 flex w-fit items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-5 py-2.5">
          <span className="text-sm font-bold text-ink/60">رقم الطلب:</span>
          <span className="font-display text-xl font-bold tracking-wider text-gold-deep" dir="ltr">
            {order.code}
          </span>
          <Copy className="size-4 text-ink/30" />
        </div>

        {/* Steps */}
        <div className="mt-10 grid grid-cols-4 gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="relative">
              <div className={`mx-auto grid size-9 place-items-center rounded-full text-sm font-bold ${i === 0 ? "bg-emerald-500 text-white" : "bg-sand text-ink/40"}`}>
                {i + 1}
              </div>
              {i < 3 && <span className={`absolute top-1/2 right-[calc(50%+22px)] left-[calc(50%+22px)] h-0.5 -translate-y-1/2 rounded ${i === 0 ? "bg-emerald-300" : "bg-sand"}`} />}
              <p className={`mt-2 text-center text-[10.5px] font-bold sm:text-xs ${i === 0 ? "text-emerald-700" : "text-ink/40"}`}>
                {s}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Details */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
          <p className="mb-4 font-display text-lg font-bold text-ink">تفاصيل التوصيل</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5 text-ink/70">
              <User className="mt-0.5 size-4 shrink-0 text-gold-deep" />
              {order.name}
            </li>
            <li className="flex items-start gap-2.5 text-ink/70" dir="ltr">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold-deep" />
              <span className="ml-auto">{order.phone}</span>
            </li>
            <li className="flex items-start gap-2.5 text-ink/70">
              <MapPin className="mt-0.5 size-4 shrink-0 text-gold-deep" />
              {order.city} — {order.address}
            </li>
            <li className="flex items-start gap-2.5 text-ink/70">
              <CreditCard className="mt-0.5 size-4 shrink-0 text-gold-deep" />
              الدفع عند الاستلام
            </li>
            {order.notes && <li className="rounded-xl bg-cream p-3 text-xs leading-6 text-ink/50">ملاحظاتك: {order.notes}</li>}
          </ul>
        </section>

        <section className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card">
          <p className="mb-4 font-display text-lg font-bold text-ink">محتويات الطلب</p>
          <ul className="space-y-3">
            {order.items.map((it) => (
              <li key={`${it.productId}-${it.size}-${it.color}`} className="flex items-center gap-3">
                <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-sand">
                  <Image src={it.image} alt={it.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold text-ink">{it.name}</p>
                  <p className="text-[11px] text-ink/45">
                    {it.qty}× · {[it.size && `مقاس ${it.size}`, it.color].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <p className="text-[13px] font-bold text-lapis">{formatIQD(it.price * it.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-dashed border-ink/10 pt-3 text-sm">
            <div className="flex justify-between text-ink/60">
              <span>المجموع الفرعي</span>
              <span className="font-semibold">{formatIQD(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-ink/60">
              <span className="flex items-center gap-1"><Truck className="size-4 text-gold-deep" /> التوصيل</span>
              <span className="font-semibold">{order.shipping === 0 ? "مجاني" : formatIQD(order.shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-ink/8 pt-2.5">
              <span className="font-bold text-ink">الإجمالي عند الاستلام</span>
              <span className="font-display text-xl font-bold text-lapis">{formatIQD(order.total)}</span>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 rounded-full bg-lapis-deep px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-lapis"
        >
          أكمل التسوق
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-7 py-3.5 text-sm font-bold text-ink transition-colors hover:border-gold hover:text-gold-deep"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
