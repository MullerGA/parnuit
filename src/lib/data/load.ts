"use client";

import type { BaseCommune, France } from "./types";

let francePromise: Promise<France> | null = null;
let basePromise: Promise<BaseCommune[]> | null = null;
let skyPromise: Promise<{ n: number; p: number[] }> | null = null;

export function loadFrance() {
  francePromise ??= fetch("/data/france.json").then((r) => r.json());
  return francePromise;
}

export function loadBase() {
  basePromise ??= fetch("/data/base500.json").then((r) => r.json());
  return basePromise;
}

export function loadSky() {
  skyPromise ??= fetch("/data/sky.json").then((r) => r.json());
  return skyPromise;
}
