"use server";

import { db } from "@/db";
import { orders, products, reviews } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { CITIES, shippingFeeFor } from "./format";
import { revalidatePath } from "next/cache";

type CartLine = { id: number; qty: number; size?: string | null; color?: string | null };

export type CheckoutInput = {
  name: string;
  phone: string;
  city: string;
  address: string;
  notes?: string;
  lines: CartLine[];
};

export type ActionResult = { ok: true; code: string } | { ok: false; error: string };

export async function createOrder(input: CheckoutInput): Promise<ActionResult> {
  try {
    const name = input.name?.trim() ?? "";
    const phone = input.phone?.replace(/\s/g, "") ?? "";
    const address = input.address?.trim() ?? "";

    if (name.length < 2) return { ok: false, error: "يرجى إدخال الاسم الكامل" };
    if (!/^07\d{9}$/.test(phone)) return { ok: false, error: "رقم الهاتف يجب أن يكون 11 رقماً ويبدأ بـ 07" };
    if (!CITIES.some((c) => c.name === input.city)) return { ok: false, error: "يرجى اختيار المحافظة" };
    if (address.length < 5) return { ok: false, error: "يرجى إدخال عنوان تفصيلي" };
    if (!input.lines?.length) return { ok: false, error: "السلة فارغة" };

    // Re-validate every line against the database — never trust client prices.
    const dbLines: { p: (typeof products.$inferSelect); qty: number; size?: string | null; color?: string | null }[] = [];
    for (const line of input.lines.slice(0, 20)) {
      const qty = Math.max(1, Math.min(10, Math.floor(Number(line.qty) || 0)));
      const p = await db.query.products.findFirst({
        where: and(eq(products.id, line.id), eq(products.inStock, true)),
      });
      if (!p) return { ok: false, error: "أحد المنتجات لم يعد متوفراً" };
      if (p.sizes.length > 0 && line.size && !p.sizes.includes(line.size)) {
        line.size = p.sizes[0];
      }
      dbLines.push({ p, qty, size: line.size ?? null, color: line.color ?? null });
    }

    const subtotal = dbLines.reduce((s, l) => s + l.p.price * l.qty, 0);
    const shipping = shippingFeeFor(input.city, subtotal);
    const total = subtotal + shipping;

    const code = `BL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;

    await db.insert(orders).values({
      code,
      name,
      phone,
      city: input.city,
      address,
      notes: input.notes?.trim() || null,
      items: dbLines.map((l) => ({
        productId: l.p.id,
        slug: l.p.slug,
        name: l.p.name,
        image: l.p.images[0] ?? "",
        price: l.p.price,
        qty: l.qty,
        size: l.size ?? null,
        color: l.color ?? null,
      })),
      subtotal,
      shipping,
      discount: 0,
      total,
      payment: "cod",
      status: "new",
    });

    return { ok: true, code };
  } catch (e) {
    console.error("createOrder failed", e);
    return { ok: false, error: "حدث خطأ غير متوقع، يرجى المحاولة لاحقاً" };
  }
}

export type ReviewInput = { productId: number; slug: string; author: string; city: string; rating: number; comment: string };

export async function addReview(input: ReviewInput): Promise<ActionResult> {
  try {
    const author = input.author?.trim();
    const comment = input.comment?.trim();
    const rating = Math.round(Number(input.rating));
    if (!author || author.length < 2) return { ok: false, error: "يرجى كتابة الاسم" };
    if (!comment || comment.length < 5) return { ok: false, error: "يرجى كتابة تعليق لا يقل عن 5 أحرف" };
    if (!(rating >= 1 && rating <= 5)) return { ok: false, error: "التقييم غير صالح" };

    await db.insert(reviews).values({
      productId: input.productId,
      author,
      city: input.city || "بغداد",
      rating,
      comment,
      verified: false,
    });

    // Recalculate aggregates from real reviews.
    const agg = await db
      .select({ avg: sql<number>`COALESCE(AVG(${reviews.rating}), 0)`, count: sql<number>`COUNT(*)::int` })
      .from(reviews)
      .where(eq(reviews.productId, input.productId));

    if (agg[0]) {
      await db
        .update(products)
        .set({ rating: Math.round(Number(agg[0].avg) * 10) / 10, ratingCount: Number(agg[0].count) })
        .where(eq(products.id, input.productId));
    }

    revalidatePath(`/product/${input.slug}`);
    return { ok: true, code: "review" };
  } catch (e) {
    console.error("addReview failed", e);
    return { ok: false, error: "تعذّر نشر التقييم، حاول لاحقاً" };
  }
}
