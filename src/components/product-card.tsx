"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Plus } from "lucide-react";
import type { Product } from "@/db/schema";
import { useCart } from "@/lib/cart";
import { cn, discountPercent, formatIQD } from "@/lib/format";
import { Stars } from "./stars";

export function ProductCard({ product, index = 0, categoryName }: { product: Product; index?: number; categoryName?: string }) {
  const { addItem } = useCart();
  const off = discountPercent(product.price, product.compareAt);

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "",
      price: product.price,
      size: product.sizes[0] ?? null,
      color: product.colors[0]?.name ?? null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3), ease: [0.22, 1, 0.36, 1] }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden rounded-2xl bg-sand shadow-card transition-shadow duration-500 group-hover:shadow-lift">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
            {product.images[1] && (
              <Image
                src={product.images[1]}
                alt={product.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col items-start gap-1.5">
            {off && (
              <span className="rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-ink shadow-sm">
                خصم {off}%
              </span>
            )}
            {product.newArrival && (
              <span className="rounded-full bg-lapis-deep px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">جديد</span>
            )}
          </div>

          {/* Quick add */}
          <button
            onClick={quickAdd}
            aria-label="إضافة سريعة للسلة"
            className={cn(
              "absolute bottom-3 left-3 grid size-10 place-items-center rounded-full bg-ink text-cream shadow-lift transition-all duration-300",
              "hover:scale-110 hover:bg-gold hover:text-ink active:scale-95",
              "translate-y-0 opacity-100 sm:translate-y-3 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
            )}
          >
            <ShoppingBag className="size-4.5 sm:hidden" />
            <Plus className="hidden size-5 sm:block" />
          </button>
        </div>

        <div className="px-1 pt-3">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-semibold tracking-wide text-ink/40">{categoryName ?? "بابلي"}</p>
            {product.rating > 0 && (
              <span className="flex items-center gap-1" dir="ltr">
                <Stars rating={product.rating} size="size-3" />
                <span className="text-[11px] font-bold text-ink/55 tabular-nums">{product.rating.toFixed(1)}</span>
              </span>
            )}
          </div>
          <h3 className="mt-1 line-clamp-2 min-h-10 text-[14.5px] leading-5 font-semibold text-ink transition-colors group-hover:text-lapis">
            {product.name}
          </h3>
          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-[15px] font-bold text-lapis">{formatIQD(product.price)}</span>
            {product.compareAt && (
              <span className="text-xs text-ink/35 line-through tabular-nums">{formatIQD(product.compareAt)}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
