import Link from "next/link";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto grid max-w-4xl place-items-center px-6 py-32 text-center">
      <span className="pattern-ishtar grid size-20 place-items-center rounded-[1.75rem] text-gold shadow-lift">
        <Compass className="size-9" />
      </span>
      <p className="mt-8 font-display text-7xl font-bold text-ink">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-ink">هذه الصفحة تاهت في أزقة بابل</h1>
      <p className="mt-3 max-w-sm text-sm leading-7 text-ink/50">
        يبدو أن الرابط الذي تبحث عنه غير موجود أو تم نقله. دعنا نعيدك إلى المخزن.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-lapis-deep px-7 py-3 text-sm font-bold text-white transition-colors hover:bg-lapis">
          العودة للرئيسية
        </Link>
        <Link
          href="/products"
          className="rounded-full border border-ink/15 px-7 py-3 text-sm font-bold text-ink transition-colors hover:border-gold hover:text-gold-deep"
        >
          تصفح المنتجات
        </Link>
      </div>
    </div>
  );
}
