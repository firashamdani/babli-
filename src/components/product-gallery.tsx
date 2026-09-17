"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/format";

export function ProductGallery({ images, name, badge }: { images: string[]; name: string; badge?: string | null }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : ["/images/hero-ataba.jpg"];

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-36">
      <div className="relative aspect-[3/4] overflow-hidden rounded-3xl bg-sand shadow-card">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={list[active]}
              alt={name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        {badge && (
          <span className="absolute top-4 right-4 rounded-full bg-gold px-3 py-1.5 text-xs font-bold text-ink shadow-card">
            {badge}
          </span>
        )}
      </div>

      {list.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`صورة ${i + 1}`}
              className={cn(
                "relative aspect-[3/4] overflow-hidden rounded-xl bg-sand transition-all",
                i === active ? "ring-2 ring-gold ring-offset-2 ring-offset-cream" : "opacity-70 hover:opacity-100"
              )}
            >
              <Image src={img} alt={`${name} — زاوية ${i + 1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
