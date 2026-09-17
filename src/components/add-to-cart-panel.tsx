"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingBag, Zap, Check } from "lucide-react";
import { useCart } from "@/lib/cart";
import { cn } from "@/lib/format";
import type { Product } from "@/db/schema";

export function AddToCartPanel({ product }: { product: Product }) {
  const { addItem, closeCart } = useCart();
  const router = useRouter();
  const [size, setSize] = useState<string | null>(product.sizes[0] ?? null);
  const [color, setColor] = useState<string | null>(product.colors[0]?.name ?? null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const base = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    image: product.images[0] ?? "",
    price: product.price,
    size,
    color,
  };

  const onAdd = () => {
    addItem(base, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const onBuyNow = () => {
    addItem(base, qty);
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="mt-6 space-y-5">
      {/* Colors */}
      {product.colors.length > 0 && (
        <div>
          <p className="mb-2.5 text-sm font-bold text-ink">
            اللون: <span className="font-normal text-ink/55">{color}</span>
          </p>
          <div className="flex flex-wrap gap-2.5">
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={() => setColor(c.name)}
                aria-label={`اللون ${c.name}`}
                title={c.name}
                className={cn(
                  "size-9 rounded-full border-2 transition-all",
                  color === c.name ? "scale-110 border-gold-deep shadow-card" : "border-ink/10 hover:scale-105"
                )}
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {product.sizes.length > 0 && (
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <p className="text-sm font-bold text-ink">
              المقاس: <span className="font-normal text-ink/55">{size}</span>
            </p>
            <button className="text-xs font-semibold text-lapis underline-offset-4 hover:underline">دليل المقاسات</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={cn(
                  "min-w-11 rounded-xl border px-3 py-2.5 text-sm font-bold transition-all",
                  size === s
                    ? "border-lapis-deep bg-lapis-deep text-white shadow-card"
                    : "border-ink/12 bg-white text-ink/70 hover:border-gold"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Qty + CTA */}
      <div className="flex items-stretch gap-3 pt-1">
        <div className="flex items-center rounded-full border border-ink/12 bg-white">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-12 place-items-center text-ink/50 transition-colors hover:text-ink"
            aria-label="إنقاص الكمية"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center text-base font-bold tabular-nums">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(10, q + 1))}
            className="grid size-12 place-items-center text-ink/50 transition-colors hover:text-ink"
            aria-label="زيادة الكمية"
          >
            <Plus className="size-4" />
          </button>
        </div>

        <button
          onClick={onAdd}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-full py-3.5 text-sm font-bold shadow-card transition-all active:scale-[0.98]",
            added ? "bg-emerald-600 text-white" : "bg-lapis-deep text-white hover:bg-lapis hover:shadow-lift"
          )}
        >
          {added ? (
            <>
              <Check className="size-4" />
              تمت الإضافة
            </>
          ) : (
            <>
              <ShoppingBag className="size-4" />
              أضف إلى السلة
            </>
          )}
        </button>
      </div>

      <button
        onClick={onBuyNow}
        className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-gold bg-gold/10 py-3.5 text-sm font-bold text-gold-deep transition-all hover:bg-gold hover:text-ink active:scale-[0.98]"
      >
        <Zap className="size-4" />
        اشتري الآن — الدفع عند الاستلام
      </button>
    </div>
  );
}
