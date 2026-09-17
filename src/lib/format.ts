import clsx, { type ClassValue } from "clsx";

export const cn = clsx;

export function formatIQD(n: number): string {
  return `${n.toLocaleString("en-US")} د.ع`;
}

export function discountPercent(price: number, compareAt?: number | null): number | null {
  if (!compareAt || compareAt <= price) return null;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export const FREE_SHIPPING_THRESHOLD = 250_000;

export const CITIES: { name: string; fee: number }[] = [
  { name: "بغداد", fee: 4000 },
  { name: "أربيل", fee: 6000 },
  { name: "البصرة", fee: 6000 },
  { name: "نينوى (الموصل)", fee: 6000 },
  { name: "ذي قار", fee: 6000 },
  { name: "بابل", fee: 6000 },
  { name: "كربلاء", fee: 6000 },
  { name: "النجف", fee: 6000 },
  { name: "الأنبار", fee: 6000 },
  { name: "ديالى", fee: 6000 },
  { name: "كركوك", fee: 6000 },
  { name: "صلاح الدين", fee: 6000 },
  { name: "المثنى", fee: 6000 },
  { name: "ميسان", fee: 6000 },
  { name: "واسط", fee: 6000 },
  { name: "القادسية", fee: 6000 },
  { name: "دهوك", fee: 6000 },
  { name: "السليمانية", fee: 6000 },
];

export function shippingFeeFor(city: string, subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) return 0;
  return CITIES.find((c) => c.name === city)?.fee ?? 6000;
}

export const COLLECTIONS: Record<string, { title: string; blurb: string }> = {
  gold: { title: "اللمسة الذهبية", blurb: "قطع بتطريز ولمسات ذهبية مستوحاة من بوابة عشتار" },
  summer: { title: "تشكيلة الصيف", blurb: "خفة الكتان والقطن لحرارة تموز العراق" },
  essentials: { title: "الأساسيات الخالدة", blurb: "قمصان، عبايات ودينيم لا يشيخ مع الوقت" },
};

export function timeAgoAr(date: Date): string {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days < 1) return "اليوم";
  if (days === 1) return "أمس";
  if (days === 2) return "قبل يومين";
  if (days <= 10) return `قبل ${days} أيام`;
  if (days < 30) return `قبل ${Math.floor(days / 7)} أسبوع`;
  const months = Math.floor(days / 30);
  return months === 1 ? "قبل شهر" : months === 2 ? "قبل شهرين" : `قبل ${months} أشهر`;
}
