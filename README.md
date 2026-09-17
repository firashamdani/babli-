# بابلي — Bably Store

متجر أزياء عراقي مبني بـ **Next.js 16 + React 19 + Tailwind 4 + Drizzle ORM + PostgreSQL**.
الدفع عند الاستلام، توصيل لكل المحافظات، أسعار بالدينار العراقي، واجهة RTL كاملة.

---

## 🚀 النشر (Deploy)

### الخيار 1 — Vercel + Neon (مجاني، الأسهل) ⭐

1. **قاعدة البيانات**: أنشئ مشروعاً مجانياً على [neon.tech](https://neon.tech) وانسخ `Connection string`
   (يبدو هكذا: `postgresql://USER:PASS@ep-xxx.aws.neon.tech/neondb?sslmode=require`).
2. **الموقع**: ادخل [vercel.com/new](https://vercel.com/new) → **Import** هذا المستودع من GitHub.
3. في شاشة الإعداد أضف متغير البيئة:
   - `DATABASE_URL` = رابط Neon من الخطوة 1
4. اضغط **Deploy**. أمر البناء (`vercel-build`) يقوم تلقائياً بـ:
   - إنشاء الجداول (`drizzle-kit push`)
   - تعبئة المنتجات والتقييمات التجريبية **مرة واحدة فقط** إذا كانت القاعدة فارغة
   - بناء الموقع
5. (اختياري) أضف `NEXT_PUBLIC_SITE_URL=https://your-domain.com` واربط الدومين من Settings → Domains.

> بدلاً من Neon يمكنك استخدام **Supabase** (استخدم رابط الـ Pooler، منفذ 6543) أو **Vercel Postgres** — كلها تعمل بنفس المتغير `DATABASE_URL`.

### الخيار 2 — سيرفر خاص (VPS) بـ Docker

```bash
git clone https://github.com/firashamdani/babli-.git && cd babli-
cp .env.example .env            # غيّر POSTGRES_PASSWORD إن أردت
docker compose up -d --build    # يشغّل PostgreSQL + ينشئ الجداول + يعبّئ البيانات + يشغّل الموقع
```

الموقع يعمل على `http://SERVER_IP:3000`. ضع أمامه Nginx/Caddy لشهادة HTTPS.

### الخيار 3 — Railway / Render / Fly.io

- أضف خدمة PostgreSQL من لوحة المنصة، وانسخ `DATABASE_URL` إلى خدمة الويب.
- Build command: `npm run vercel-build` &nbsp;|&nbsp; Start command: `npm start`
- أو استخدم `Dockerfile` الموجود مباشرة (يدعم `output: standalone`).

### النشر التلقائي من GitHub Actions

- `.github/workflows/ci.yml`: يفحص الكود (typecheck + lint + build) عند كل push.
- `.github/workflows/deploy-vercel.yml`: ينشر إلى Vercel عند كل push إلى `main`.
  يحتاج إلى Secrets: `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`
  (إذا ربطت المستودع من لوحة Vercel مباشرة فلست بحاجة لهذا الملف — Vercel ينشر وحده).

---

## 🛠️ التشغيل محلياً

```bash
npm install
cp .env.example .env          # عدّل DATABASE_URL ليشير إلى PostgreSQL المحلي
npm run db:setup              # إنشاء الجداول + تعبئة البيانات التجريبية
npm run dev                   # http://localhost:3000
```

| الأمر | الوظيفة |
|---|---|
| `npm run dev` | تشغيل بيئة التطوير |
| `npm run build` / `npm start` | بناء وتشغيل نسخة الإنتاج |
| `npm run db:push` | مزامنة مخطط الجداول مع القاعدة |
| `npm run db:seed` | تعبئة البيانات التجريبية (يتخطى إذا وُجدت منتجات؛ `--force` لإعادة التعبئة) |
| `npm run typecheck` / `npm run lint` | فحص الأنواع والكود |

## ⚙️ متغيرات البيئة

| المتغير | مطلوب | الوصف |
|---|---|---|
| `DATABASE_URL` | ✅ | رابط PostgreSQL. يُفعَّل TLS تلقائياً لأي مضيف غير محلي |
| `DATABASE_SSL` | – | `true`/`false` لفرض TLS أو تعطيله |
| `DATABASE_POOL_MAX` | – | حجم مجمع الاتصالات (افتراضي 5 — مناسب للـ serverless) |
| `NEXT_PUBLIC_SITE_URL` | – | رابط الموقع النهائي (للـ canonical و Open Graph) |
| `SEED_FORCE` | – | `1` لإعادة تعبئة البيانات وحذف الطلبات — للتجربة فقط |

## 🧱 البنية

```
src/
├── app/                # صفحات App Router (الرئيسية، المنتجات، المنتج، السلة، الدفع)
│   └── api/            # /api/search (بحث فوري) و /api/health (فحص الجاهزية)
├── components/         # الهيدر، السلة الجانبية، بطاقات المنتجات، الفلاتر، التقييمات…
├── db/                 # schema.ts (Drizzle) · seed.ts · index.ts (اتصال pg)
└── lib/                # actions.ts (إنشاء الطلبات والتقييمات) · data.ts (الاستعلامات) · cart.tsx
public/images/          # صور الصفحة الرئيسية
```

- الخطوط (Amiri + IBM Plex Sans Arabic) **مستضافة ذاتياً** عبر `@fontsource` — لا اعتماد على Google Fonts وقت البناء.
- الطلبات تُعاد تسعيرها من قاعدة البيانات على السيرفر (لا يُوثق بأسعار المتصفح).
