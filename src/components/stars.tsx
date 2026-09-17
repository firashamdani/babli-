import { Star } from "lucide-react";
import { cn } from "@/lib/format";

export function Stars({ rating, className, size = "size-3.5" }: { rating: number; className?: string; size?: string }) {
  return (
    <span className={cn("flex items-center gap-0.5", className)} dir="ltr" aria-label={`التقييم ${rating} من 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - i + 1));
        return (
          <span key={i} className={cn("relative", size)}>
            <Star className={cn("absolute inset-0 text-sand", size)} fill="currentColor" strokeWidth={0} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className={cn("text-gold", size)} fill="currentColor" strokeWidth={0} />
            </span>
          </span>
        );
      })}
    </span>
  );
}
