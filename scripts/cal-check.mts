import fs from "node:fs";
import { deadlines, formatDeadline } from "../src/lib/data/calendar.ts";

const b = JSON.parse(fs.readFileSync("public/data/base500.json", "utf8"));
const from = new Date(2026, 9, 1),
  to = new Date(2027, 2, 31);
for (const n of ["Nice", "Paris", "Saint-Malo", "Bordeaux", "Lyon", "Carcassonne", "Biarritz", "Ajaccio", "Agde"]) {
  const x = b.find((c) => c.nom === n);
  const d = deadlines(x.declaration, "declaration", from, to).map(formatDeadline).join(", ");
  const r = deadlines(x.reversement, "reversement", from, to).map(formatDeadline).join(", ");
  console.log(n.padEnd(14), "D:", d, "| R:", r);
}
let empty = 0,
  total = 0;
for (const x of b) {
  if (!x.declaration) continue;
  total++;
  if (!deadlines(x.declaration, "declaration", from, to).length) empty++;
}
console.log("declarations sans échéance calculée", empty, "/", total);
