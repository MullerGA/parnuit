"use client";

import Lenis from "lenis";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { loadSky } from "@/lib/data/load";

const LAT0 = (46.6 * Math.PI) / 180;
const project = (lon: number, lat: number) => ({
  x: ((lon + 5.3) / 15) * 1000,
  y: ((51.2 - lat) * 1000) / (15 * Math.cos(LAT0)) / 1,
});

export const PARC = [
  { nom: "Saint-Malo", lon: -2.0066, lat: 48.6465, rythme: "trimestrielle", collecteur: "CA du Pays de Saint-Malo" },
  { nom: "Paris", lon: 2.347, lat: 48.8589, rythme: "mensuelle", collecteur: "Ville de Paris" },
  { nom: "Chamonix", lon: 6.9291, lat: 45.9296, rythme: "mensuelle", collecteur: "CC de la Vallée de Chamonix" },
  { nom: "Nice", lon: 7.2528, lat: 43.7032, rythme: "quadrimestrielle", collecteur: "Métropole Nice Côte d'Azur" },
  { nom: "Argelès-sur-Mer", lon: 3.0234, lat: 42.53, rythme: "mensuelle", collecteur: "Argelès-sur-Mer" },
  { nom: "Carcassonne", lon: 2.3491, lat: 43.2078, rythme: "mensuelle", collecteur: "Carcassonne" },
  { nom: "Biarritz", lon: -1.5557, lat: 43.4709, rythme: "trimestrielle", collecteur: "Biarritz" },
].map((p) => ({ ...p, ...project(p.lon, p.lat) }));

const MAP_W = 1000;
const MAP_H = 960;

const vertex = /* glsl */ `
uniform vec2 uRes;
uniform float uDpr;
uniform float uTime;
uniform float uMorph;
uniform float uCat;
uniform float uEtab;
uniform float uGold;
uniform float uFocus;
uniform float uDrift;
uniform float uPointScale;
uniform vec2 uMapOrigin;
uniform float uMapScale;
attribute vec2 aStart;
attribute vec2 aMap;
attribute float aKind;
attribute float aEtab;
attribute float aRand;
varying vec3 vColor;
varying float vAlpha;

void main() {
  float ang = uTime * 0.012 * uDrift;
  vec2 c = aStart - 0.5;
  c = mat2(cos(ang), -sin(ang), sin(ang), cos(ang)) * c;
  vec2 startPx = (c * 1.45 + 0.5) * uRes;
  vec2 mapPx = uMapOrigin + aMap * uMapScale;
  float d = clamp(uMorph * 1.7 - aRand * 0.7, 0.0, 1.0);
  float e = d * d * (3.0 - 2.0 * d);
  vec2 px = mix(startPx, mapPx, e);

  float tw = 0.72 + 0.28 * sin(uTime * (0.5 + aRand * 1.9) + aRand * 61.0);
  float isTax = step(0.5, aKind);
  float isEtab = step(1.5, aKind);
  float isGold = step(2.5, aKind);

  float size = mix(1.4 + aRand * 2.2, 1.55, e);
  size += uEtab * isEtab * (0.9 + sqrt(aEtab) * 0.75);
  size += uGold * isGold * (2.2 + sqrt(aEtab) * 0.35);

  vec3 star = vec3(0.78, 0.83, 1.0);
  vec3 warm = vec3(1.0, 0.94, 0.84);
  vec3 coral = vec3(0.95, 0.58, 0.44);
  vec3 gold = vec3(1.0, 0.80, 0.42);
  vec3 col = mix(star, warm, uCat * isTax);
  col = mix(col, coral, uEtab * isEtab);
  col = mix(col, gold, uGold * isGold);

  float a = mix(0.35 + aRand * 0.45, 0.62, e) * tw;
  a *= mix(1.0, mix(0.10, 1.0, isTax), uCat);
  a *= mix(1.0, mix(0.30, 1.0, isEtab), uEtab);
  a *= mix(1.0, mix(0.22, 1.0, isGold), uGold);
  a += uEtab * isEtab * 0.25 * (1.0 - uGold) + uGold * isGold * 0.45;
  a *= 1.0 - uFocus * 0.72;
  vColor = col;
  vAlpha = clamp(a, 0.0, 1.0);
  gl_PointSize = size * uDpr * uPointScale;
  gl_Position = vec4(px.x / uRes.x * 2.0 - 1.0, 1.0 - px.y / uRes.y * 2.0, 0.0, 1.0);
}
`;

const fragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float r = length(uv);
  float core = smoothstep(0.5, 0.0, r);
  gl_FragColor = vec4(vColor, vAlpha * core * core);
}
`;

type Panel = { from: number; to: number; ref: HTMLElement | null };

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const ramp = (x: number, keys: [number, number][]) => {
  if (x <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [x1, y1] = keys[i];
    const [x0, y0] = keys[i - 1];
    if (x <= x1) return y0 + (y1 - y0) * smooth(x0, x1, x);
  }
  return keys[keys.length - 1][1];
};

export const CHAPTERS: { from: number; to: number; label: string }[] = [
  { from: 0, to: 0.1, label: "La nuit" },
  { from: 0.16, to: 0.3, label: "La carte" },
  { from: 0.33, to: 0.46, label: "Les règles" },
  { from: 0.49, to: 0.62, label: "Les établissements" },
  { from: 0.65, to: 0.79, label: "Le terrain" },
  { from: 0.84, to: 1.01, label: "Votre parc" },
];

export function SkyStory({ children }: { children: React.ReactNode[] }) {
  const storyRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const hintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lenis = reduce ? null : new Lenis({ autoRaf: true, lerp: 0.09 });
    return () => lenis?.destroy();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const story = storyRef.current;
    if (!canvas || !story) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: "high-performance" });
    } catch {
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    const uniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uDpr: { value: 1 },
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uCat: { value: 0 },
      uEtab: { value: 0 },
      uGold: { value: 0 },
      uFocus: { value: 0 },
      uDrift: { value: reduce ? 0 : 1 },
      uPointScale: { value: 1 },
      uMapOrigin: { value: new THREE.Vector2(0, 0) },
      uMapScale: { value: 1 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: vertex,
      fragmentShader: fragment,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const geometry = new THREE.BufferGeometry();
    let points: THREE.Points | null = null;
    let disposed = false;

    loadSky().then(({ p }) => {
      if (disposed) return;
      const n = p.length / 4;
      const start = new Float32Array(n * 2);
      const map = new Float32Array(n * 2);
      const kind = new Float32Array(n);
      const etab = new Float32Array(n);
      const rand = new Float32Array(n);
      let seed = 7;
      const rnd = () => {
        seed = (seed * 16807) % 2147483647;
        return seed / 2147483647;
      };
      for (let i = 0; i < n; i++) {
        start[i * 2] = rnd();
        start[i * 2 + 1] = rnd();
        map[i * 2] = p[i * 4];
        map[i * 2 + 1] = p[i * 4 + 1];
        kind[i] = p[i * 4 + 2];
        etab[i] = p[i * 4 + 3];
        rand[i] = rnd();
      }
      geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(n * 3), 3));
      geometry.setAttribute("aStart", new THREE.BufferAttribute(start, 2));
      geometry.setAttribute("aMap", new THREE.BufferAttribute(map, 2));
      geometry.setAttribute("aKind", new THREE.BufferAttribute(kind, 1));
      geometry.setAttribute("aEtab", new THREE.BufferAttribute(etab, 1));
      geometry.setAttribute("aRand", new THREE.BufferAttribute(rand, 1));
      points = new THREE.Points(geometry, material);
      points.frustumCulled = false;
      scene.add(points);
    });

    let layout = { ox: 0, oy: 0, s: 1 };
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const dpr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(dpr);
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
      uniforms.uDpr.value = dpr;
      const desktop = w >= 1024;
      const availW = desktop ? w * 0.56 : w * 0.94;
      const availH = desktop ? h * 0.88 : h * 0.56;
      const s = Math.min(availW / MAP_W, availH / MAP_H);
      const ox = desktop ? w * 0.41 + (w * 0.57 - MAP_W * s) / 2 : (w - MAP_W * s) / 2;
      const oy = desktop ? (h - MAP_H * s) / 2 : h * 0.07;
      layout = { ox, oy, s };
      uniforms.uMapOrigin.value.set(ox, oy);
      uniforms.uMapScale.value = s;
      uniforms.uPointScale.value = Math.min(1.25, Math.max(0.62, s / 0.8));
      drawConstellation();
    };

    const drawConstellation = () => {
      const svg = svgRef.current;
      if (!svg) return;
      const pts = PARC.map((p) => [layout.ox + p.x * layout.s, layout.oy + p.y * layout.s]);
      const path = svg.querySelector("path");
      if (path) {
        path.setAttribute("d", `M${pts.map((q) => q.join(" ")).join(" L")} Z`);
        const len = (path as SVGPathElement).getTotalLength();
        path.style.strokeDasharray = String(len);
        path.dataset.len = String(len);
      }
      svg.querySelectorAll<SVGGElement>("g[data-star]").forEach((g, i) => {
        g.setAttribute("transform", `translate(${pts[i][0]} ${pts[i][1]})`);
      });
    };

    const panels: Panel[] = CHAPTERS.map((c, i) => ({ from: c.from, to: c.to, ref: panelRefs.current[i] }));
    const current = { morph: 0, cat: 0, etab: 0, gold: 0, focus: 0 };
    let raf = 0;
    const t0 = performance.now();

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const rect = story.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      const prog = Math.min(1, Math.max(0, -rect.top / range));
      const target = {
        morph: ramp(prog, [
          [0.08, 0],
          [0.26, 1],
        ]),
        cat: ramp(prog, [
          [0.3, 0],
          [0.4, 1],
          [0.47, 1],
          [0.54, 0.5],
        ]),
        etab: ramp(prog, [
          [0.46, 0],
          [0.56, 1],
          [0.63, 1],
          [0.7, 0.25],
        ]),
        gold: ramp(prog, [
          [0.63, 0],
          [0.72, 1],
          [0.8, 1],
          [0.88, 0.5],
        ]),
        focus: ramp(prog, [
          [0.8, 0],
          [0.9, 1],
        ]),
      };
      for (const k of Object.keys(current) as (keyof typeof current)[]) current[k] += (target[k] - current[k]) * 0.12;
      uniforms.uMorph.value = current.morph;
      uniforms.uCat.value = current.cat;
      uniforms.uEtab.value = current.etab;
      uniforms.uGold.value = current.gold;
      uniforms.uFocus.value = current.focus;
      uniforms.uTime.value = (performance.now() - t0) / 1000;

      for (const [i, panel] of panels.entries()) {
        if (!panel.ref) continue;
        const inO = i === 0 ? 1 : smooth(panel.from - 0.035, panel.from, prog);
        const outO = i === panels.length - 1 ? 1 : 1 - smooth(panel.to, panel.to + 0.035, prog);
        const o = inO * outO;
        panel.ref.style.opacity = String(o);
        panel.ref.style.transform = `translateY(${(1 - inO) * 28 - (1 - outO) * 28}px)`;
        panel.ref.style.pointerEvents = o > 0.5 ? "auto" : "none";
        const dot = dotRefs.current[i];
        if (dot) dot.dataset.on = prog >= panel.from - 0.02 && (i === panels.length - 1 || prog < panels[i + 1].from - 0.02) ? "1" : "0";
      }
      if (hintRef.current) hintRef.current.style.opacity = String(1 - smooth(0.01, 0.05, prog));
      const svg = svgRef.current;
      if (svg) {
        svg.style.opacity = String(current.focus);
        const path = svg.querySelector("path");
        if (path?.dataset.len) path.style.strokeDashoffset = String(Number(path.dataset.len) * (1 - smooth(0.82, 0.93, prog)));
      }
      renderer.render(scene, camera);
    };

    resize();
    window.addEventListener("resize", resize);
    tick();
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section ref={storyRef} className="relative h-[820vh]" aria-label="La France de la taxe de séjour">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          role="img"
          aria-label="Carte animée des 34 969 communes de France"
        />
        <svg ref={svgRef} className="pointer-events-none absolute inset-0 h-full w-full opacity-0" aria-hidden="true">
          <defs>
            <linearGradient id="nuit-line" x1="0" x2="1">
              <stop offset="0" stopColor="#F3C77A" />
              <stop offset="1" stopColor="#E0876A" />
            </linearGradient>
          </defs>
          <path fill="none" stroke="url(#nuit-line)" strokeWidth="1.2" strokeOpacity="0.85" />
          {PARC.map((p) => (
            <g key={p.nom} data-star="1">
              <circle r="14" fill="#F3C77A" opacity="0.12" />
              <circle r="4.5" fill="#FFF3D6" />
              <text x="12" y="-10" fill="#FFF3D6" fontSize="13" fontFamily="var(--font-v2-sans)" fontWeight="600">
                {p.nom}
              </text>
              <text x="12" y="6" fill="#F3C77A" fontSize="10.5" fontFamily="var(--font-v2-mono)" opacity="0.9">
                {p.rythme}
              </text>
            </g>
          ))}
        </svg>
        {children.map((child, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: panneaux fixes
            key={i}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="absolute inset-0 will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            {child}
          </div>
        ))}
        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 text-center font-[family-name:var(--font-v2-mono)] text-[11px] uppercase tracking-[0.2em] text-[#DCE3FF]/60"
        >
          Faites défiler
          <span className="mx-auto mt-3 block h-10 w-px animate-pulse bg-gradient-to-b from-[#DCE3FF]/60 to-transparent" />
        </div>
        <ol className="absolute top-1/2 right-5 hidden -translate-y-1/2 flex-col gap-3 lg:flex" aria-hidden="true">
          {CHAPTERS.map((c, i) => (
            <li key={c.label} className="flex items-center justify-end gap-3">
              <span
                ref={(el) => {
                  dotRefs.current[i] = el;
                }}
                data-on={i === 0 ? "1" : "0"}
                className="group flex items-center gap-3 font-[family-name:var(--font-v2-mono)] text-[10px] uppercase tracking-[0.18em] text-[#DCE3FF]/0 transition-colors duration-500 data-[on=1]:text-[#F3C77A]"
              >
                {c.label}
                <i className="block size-1.5 rounded-full bg-[#DCE3FF]/30 transition-all duration-500 group-data-[on=1]:scale-150 group-data-[on=1]:bg-[#F3C77A]" />
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
