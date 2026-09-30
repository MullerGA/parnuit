"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { versions } from "@/lib/versions";

export function ReviewBar() {
  const pathname = usePathname();
  const current = versions.find((v) => pathname === `/${v.slug}`);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    setHidden(sessionStorage.getItem("pn-review-hidden") === "1");
  }, []);

  if (!current) return null;

  const toggle = (value: boolean) => {
    setHidden(value);
    sessionStorage.setItem("pn-review-hidden", value ? "1" : "0");
  };

  if (hidden) {
    return (
      <button
        type="button"
        onClick={() => toggle(false)}
        data-review
        className="fixed bottom-3 left-3 z-[100] rounded-full bg-black/80 px-3 py-1.5 font-mono text-[11px] text-white shadow-lg backdrop-blur"
      >
        Versions
      </button>
    );
  }

  return (
    <nav
      aria-label="Comparer les versions"
      data-review
      className="fixed bottom-3 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-[#0b0b0f]/85 p-1 pl-3 font-sans text-[12px] text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,.6)] backdrop-blur-md"
    >
      <Link href="/" className="mr-1 whitespace-nowrap text-white/70 hover:text-white">
        ← Récap
      </Link>
      {versions.map((v) => (
        <Link
          key={v.slug}
          href={`/${v.slug}`}
          aria-current={v.slug === current.slug ? "page" : undefined}
          title={v.name}
          className={
            v.slug === current.slug
              ? "grid size-7 place-items-center rounded-full bg-white font-semibold text-black"
              : "grid size-7 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white"
          }
        >
          {v.n}
        </Link>
      ))}
      <span className="hidden whitespace-nowrap px-2 text-white/60 sm:inline">{current.name}</span>
      <button
        type="button"
        onClick={() => toggle(true)}
        aria-label="Masquer la barre de comparaison"
        className="grid size-7 place-items-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
      >
        ×
      </button>
    </nav>
  );
}
