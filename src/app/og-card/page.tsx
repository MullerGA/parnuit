import { Plus_Jakarta_Sans } from "next/font/google";
import { LogoMark } from "@/components/brand/logo";

const sans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-og" });

export const metadata = { robots: { index: false } };

export default function OgCard() {
  return (
    <main
      className={`${sans.variable} relative h-[630px] w-[1200px] overflow-hidden bg-[#10202B] font-[family-name:var(--font-og)] text-white`}
    >
      <div className="absolute -top-40 -left-24 size-[560px] rounded-full bg-[#E2694A]/35 blur-[120px]" />
      <div className="absolute -right-24 -bottom-48 size-[560px] rounded-full bg-[#C8456F]/35 blur-[120px]" />
      <div className="relative flex h-full">
        <div className="flex w-[700px] flex-col justify-between p-16">
          <div className="flex items-center gap-3">
            <LogoMark size={44} bg="#F7F1E8" fg="#10202B" dot="#E2694A" />
            <span className="text-[34px] font-bold tracking-[-0.06em]">
              parnuit<span className="text-[#E2694A]">.</span>
            </span>
          </div>
          <div>
            <p className="text-[64px] font-extrabold leading-[1] tracking-[-0.045em]">
              La taxe de séjour vous coûte <span className="text-[#F4A27C]">plus cher que la taxe.</span>
            </p>
            <p className="mt-6 text-[24px] text-white/70">Diagnostic 2027 offert pour les groupes d'hébergement.</p>
          </div>
        </div>
        <div className="flex flex-1 items-center pr-16">
          <div className="w-full rotate-[-3deg] rounded-md bg-white p-7 text-[#10202B] shadow-2xl">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-[#10202B]/50">Coût annuel caché</p>
            <p className="mt-1 text-[16px] font-semibold">24 établissements, 14 collecteurs</p>
            <div className="my-4 border-t border-dashed border-[#10202B]/25" />
            {[
              ["Déclarations", "75 h"],
              ["Reversements", "25 h"],
              ["Veille tarifaire", "42 h"],
              ["Tarif oublié", "3 600 €"],
            ].map(([a, b]) => (
              <p key={a} className="flex justify-between py-1 font-mono text-[16px]">
                <span>{a}</span>
                <span>{b}</span>
              </p>
            ))}
            <div className="mt-3 border-t-2 border-[#10202B] pt-3">
              <p className="flex items-baseline justify-between">
                <span className="text-[13px] font-bold uppercase tracking-[0.12em]">Total</span>
                <span className="text-[40px] font-extrabold tracking-[-0.03em]">9 557 €</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
