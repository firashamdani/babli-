export default function Loading() {
  return (
    <div className="grid min-h-[50vh] place-items-center">
      <div className="flex flex-col items-center gap-4">
        <span className="size-10 animate-spin rounded-full border-[3px] border-sand border-t-gold" />
        <p className="font-display text-lg font-bold text-ink/50">بابلي تجهّز لك أجمل القطع…</p>
      </div>
    </div>
  );
}
