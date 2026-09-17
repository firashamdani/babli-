"use server";

import { db } from "@/db";
import { categories, products, reviews, orders, type Product, type Category } from "@/db/schema";
import { and, ilike, or, gte, lte, eq, sql, desc, asc, ne } from "drizzle-orm";

export type ShopParams = {
  q?: string;
  cat?: string;
  collection?: string;
  min?: number;
  max?: number;
  rating?: number;
  sale?: boolean;
  isNew?: boolean;
  sort?: string;
};

export async function getCategories(): Promise<Category[]> {
  return db.select().from(categories).orderBy(categories.sort);
}

export async function queryProducts(params: ShopParams): Promise<Product[]> {
  const conds = [eq(products.inStock, true)];

  if (params.q) {
    const term = `%${params.q.trim()}%`;
    conds.push(
      or(ilike(products.name, term), ilike(products.shortDesc, term), ilike(products.longDesc, term))!
    );
  }
  if (params.cat) {
    const cat = await db.query.categories.findFirst({ where: eq(categories.slug, params.cat) });
    if (cat) conds.push(eq(products.categoryId, cat.id));
  }
  if (params.collection) {
    conds.push(sql`${products.collections} @> ${JSON.stringify([params.collection])}::jsonb`);
  }
  if (params.min != null && !Number.isNaN(params.min)) conds.push(gte(products.price, params.min));
  if (params.max != null && !Number.isNaN(params.max)) conds.push(lte(products.price, params.max));
  if (params.rating) conds.push(gte(products.rating, params.rating));
  if (params.sale) conds.push(sql`${products.compareAt} IS NOT NULL AND ${products.compareAt} > ${products.price}`);
  if (params.isNew) conds.push(eq(products.newArrival, true));

  const orderBy =
    params.sort === "price-asc"
      ? asc(products.price)
      : params.sort === "price-desc"
        ? desc(products.price)
        : params.sort === "rating"
          ? desc(products.rating)
          : params.sort === "popular"
            ? desc(products.ratingCount)
            : params.sort === "discount"
              ? desc(sql`(${products.compareAt} - ${products.price})`)
              : [desc(products.featured), desc(products.createdAt)];

  return db
    .select()
    .from(products)
    .where(and(...conds))
    .orderBy(...(Array.isArray(orderBy) ? orderBy : [orderBy]));
}

export async function getProductBySlug(slug: string) {
  return db.query.products.findFirst({ where: eq(products.slug, slug) });
}

export async function getFeaturedProducts(limit = 8) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.featured, true), eq(products.inStock, true)))
    .orderBy(desc(products.ratingCount))
    .limit(limit);
}

export async function getNewArrivals(limit = 8) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.newArrival, true), eq(products.inStock, true)))
    .orderBy(desc(products.createdAt))
    .limit(limit);
}

export async function getDeals(limit = 6) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.inStock, true), sql`${products.compareAt} IS NOT NULL AND ${products.compareAt} > ${products.price}`))
    .orderBy(desc(sql`(${products.compareAt} - ${products.price}) / (${products.compareAt} + 0.0)`))
    .limit(limit);
}

export async function getRelatedProducts(product: Product, limit = 4) {
  return db
    .select()
    .from(products)
    .where(and(eq(products.categoryId, product.categoryId), ne(products.id, product.id), eq(products.inStock, true)))
    .orderBy(desc(products.rating))
    .limit(limit);
}

export async function getReviews(productId: number) {
  return db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, productId))
    .orderBy(desc(reviews.createdAt));
}

export async function getOrderByCode(code: string) {
  return db.query.orders.findFirst({ where: eq(orders.code, code) });
}

export async function searchProducts(query: string, limit = 6) {
  const term = `%${query.trim()}%`;
  return db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      price: products.price,
      image: sql<string>`${products.images}->>0`,
      rating: products.rating,
    })
    .from(products)
    .where(
      and(
        eq(products.inStock, true),
        or(ilike(products.name, term), ilike(products.shortDesc, term), ilike(products.longDesc, term))!
      )
    )
    .orderBy(desc(products.featured), desc(products.rating))
    .limit(limit);
}

export type OrderSummary = typeof orders.$inferSelect;
