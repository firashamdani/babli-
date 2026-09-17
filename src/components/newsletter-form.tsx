"use client";

import { useState } from "react";
import { Check, Send } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className="mx-auto mt-7 flex max-w-md items-center gap-2 rounded-full border border-white/15 bg-white/10 p-1.5 backdrop-blur"
      onSubmit={(e) => {
        e.preventDefault();
        if (email.includes("@")) setDone(true);
      }}
    >
      <input
        type="email"
        dir="ltr"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setDone(false);
        }}
        placeholder="email@example.com"
        className="w-full bg-transparent px-4 py-2.5 text-left text-sm text-white outline-none placeholder:text-white/35"
      />
      <button
        className={`flex shrink-0 items-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-bold transition-all active:scale-95 ${
          done ? "bg-emerald-500 text-white" : "bg-gold text-ink hover:bg-gold-soft"
        }`}
      >
        {done ? (
          <>
            <Check className="size-4" />
            تم الاشتراك
          </>
        ) : (
          <>
            <Send className="size-4" />
            اشترك
          </>
        )}
      </button>
    </form>
  );
}
