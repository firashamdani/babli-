import {
  pgTable,
  serial,
  text,
  integer,
  real,
  boolean,
  jsonb,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  image: text("image").notNull().default(""),
  tagline: text("tagline").notNull().default(""),
  sort: integer("sort").notNull().default(0),
});

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    slug: text("slug").notNull().unique(),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "cascade" }),
    shortDesc: text("short_desc").notNull().default(""),
    longDesc: text("long_desc").notNull().default(""),
    details: jsonb("details").$type<{ label: string; value: string }[]>().notNull().default([]),
    images: jsonb("images").$type<string[]>().notNull().default([]),
    price: integer("price").notNull(), // IQD
    compareAt: integer("compare_at"), // IQD, for discount badge
    rating: real("rating").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    sizes: jsonb("sizes").$type<string[]>().notNull().default([]),
    colors: jsonb("colors").$type<{ name: string; hex: string }[]>().notNull().default([]),
    collections: jsonb("collections").$type<string[]>().notNull().default([]),
    featured: boolean("featured").notNull().default(false),
    newArrival: boolean("new_arrival").notNull().default(false),
    inStock: boolean("in_stock").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [
    index("products_category_idx").on(t.categoryId),
    index("products_price_idx").on(t.price),
    index("products_rating_idx").on(t.rating),
  ]
);

export const reviews = pgTable(
  "reviews",
  {
    id: serial("id").primaryKey(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    author: text("author").notNull(),
    city: text("city").notNull().default("بغداد"),
    rating: integer("rating").notNull().default(5),
    comment: text("comment").notNull(),
    verified: boolean("verified").notNull().default(true),
    createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  },
  (t) => [index("reviews_product_idx").on(t.productId)]
);

export type OrderItem = {
  productId: number;
  slug: string;
  name: string;
  image: string;
  price: number;
  qty: number;
  size: string | null;
  color: string | null;
};

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  notes: text("notes"),
  items: jsonb("items").$type<OrderItem[]>().notNull(),
  subtotal: integer("subtotal").notNull(),
  shipping: integer("shipping").notNull(),
  discount: integer("discount").notNull().default(0),
  total: integer("total").notNull(),
  payment: text("payment").notNull().default("cod"),
  status: text("status").notNull().default("new"),
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
});

export type Category = typeof categories.$inferSelect;
export type Product = typeof products.$inferSelect;
export type Review = typeof reviews.$inferSelect;
export type Order = typeof orders.$inferSelect;
