"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2, ShoppingBag, Truck, ArrowLeft } from "lucide-react";
import { useCart, cartKey, type CartItem } from "@/lib/cart";
import { formatIQD, FREE_SHIPPING_THRESHOLD } from "@/lib/format";

function LineItem({ item }: { item: CartItem }) {
  const { updateQty, removeItem } = useCart();
  const key = cartKey(item);
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="flex gap-3 rounded-2xl border border-ink/6 bg-white p-3"
    >
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-sand">
        <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${item.slug}`} className="line-clamp-2 text-[13.5px] leading-5 font-semibold text-ink hover:text-lapis">
            {item.name}
          </Link>
          <button
            onClick={() => removeItem(key)}
            className="rounded-full p-1 text-ink/35 transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="حذف"
          >
            <Trash2 className="size-4" />
          </button>
        </div>
        <p className="mt-0.5 text-xs text-ink/45">
          {item.size && <span>مقاس {item.size}</span>}
          {item.size && item.color && <span className="mx-1.5">·</span>}
          {item.color && <span>{item.color}</span>}
        </p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center rounded-full border border-ink/10">
            <button
              onClick={() => updateQty(key, item.qty - 1)}
              className="grid size-7 place-items-center text-ink/60 hover:text-ink"
              aria-label="إنقاص"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-bold tabular-nums">{item.qty}</span>
            <button
              onClick={() => updateQty(key, item.qty + 1)}
              className="grid size-7 place-items-center text-ink/60 hover:text-ink"
              aria-label="زيادة"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
          <p className="text-sm font-bold text-lapis">{formatIQD(item.price * item.qty)}</p>
        </div>
      </div>
    </motion.li>
  );
}

export function CartDrawer() {
  const { isOpen, closeCart, items, subtotal } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/45 backdrop-blur-sm"
            onClick={closeCart}
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 260 }}
            className="fixed top-0 bottom-0 left-0 z-[60] flex w-[92%] max-w-md flex-col bg-cream shadow-lift"
            aria-label="سلة التسوق"
          >
            <div className="flex items-center justify-between border-b border-ink/8 p-4">
              <p className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                <ShoppingBag className="size-5 text-gold-deep" />
                سلة التسوق
                <span className="text-sm font-sans font-semibold text-ink/45">({items.length})</span>
              </p>
              <button onClick={closeCart} className="rounded-full p-2 transition-colors hover:bg-ink/5" aria-label="إغلاق السلة">
                <X className="size-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="grid size-20 place-items-center rounded-full bg-sand text-gold-deep">
                  <ShoppingBag className="size-9" />
                </span>
                <p className="font-display text-2xl font-bold text-ink">سلتك فارغة</p>
                <p className="max-w-60 text-sm text-ink/50">اكتشف تشكيلات بابلي وأضف ما يعجبك — الدفع عند الاستلام.</p>
                <Link
                  href="/products"
                  onClick={closeCart}
                  className="mt-2 inline-flex items-center gap-2 rounded-full bg-lapis-deep px-6 py-3 text-sm font-bold text-white transition-transform hover:scale-[1.03] active:scale-95"
                >
                  ابدأ التسوق
                  <ArrowLeft className="size-4" />
                </Link>
              </div>
            ) : (
              <>
                {/* Free shipping progress */}
                <div className="border-b border-ink/8 px-4 py-3">
                  <p className="flex items-center gap-2 text-xs font-semibold text-ink/70">
                    <Truck className="size-4 text-gold-deep" />
                    {remaining > 0 ? (
                      <span>
                        أضف <b className="text-gold-deep">{formatIQD(remaining)}</b> واحصل على شحن مجاني
                      </span>
                    ) : (
                      <span className="text-emerald-700">مبروك! حصلت على شحن مجاني لطلبك</span>
                    )}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-l from-gold to-gold-deep"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ type: "spring", damping: 20 }}
                    />
                  </div>
                </div>

                <ul className="thin-scroll flex-1 space-y-3 overflow-y-auto p-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <LineItem key={cartKey(item)} item={item} />
                    ))}
                  </AnimatePresence>
                </ul>

                <div className="border-t border-ink/8 bg-white/70 p-4 backdrop-blur">
                  <div className="flex items-center justify-between text-sm text-ink/60">
                    <span>المجموع الفرعي</span>
                    <span className="font-bold text-ink">{formatIQD(subtotal)}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-ink/40">رسوم التوصيل تُحسب عند إتمام الطلب · الدفع عند الاستلام</p>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-lapis-deep py-3.5 text-sm font-bold text-white shadow-card transition-all hover:bg-lapis hover:shadow-lift active:scale-[0.98]"
                  >
                    إتمام الطلب
                    <ArrowLeft className="size-4" />
                  </Link>
                  <button
                    onClick={closeCart}
                    className="mt-2 w-full rounded-full py-2.5 text-sm font-semibold text-ink/60 transition-colors hover:bg-ink/5"
                  >
                    متابعة التسوق
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
