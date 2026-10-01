"use client";

import { useEffect, useState } from "react";

export function Announcement() {
  const [days, setDays] = useState<number | null>(null);
  useEffect(() => {
    const target = new Date("2027-01-01T00:00:00+01:00").getTime();
    setDays(Math.max(0, Math.ceil((target - Date.now()) / 86400000)));
  }, []);
  return (
    <a
      href="#diagnostic"
      className="group block bg-[#10202B] px-4 py-2.5 text-center text-[13px] text-[#F7F1E8] transition hover:bg-[#162a37]"
    >
      <span className="mr-2 inline-block rounded-full bg-[#E2694A] px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
        2027
      </span>
      Les nouveaux tarifs s'appliquent le 1er janvier{days != null ? `, dans ${days} jours` : ""}.{" "}
      <span className="font-semibold underline decoration-[#E2694A] underline-offset-4">Votre diagnostic de parc est offert</span>
      <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
    </a>
  );
}
