import { i as isSameLocalDay, l as localDateKey } from "./date-Cpa6Svv0.mjs";
function isSameDay(a, b) {
  return isSameLocalDay(a, b);
}
function setVolume(set) {
  return set.carga * set.reps;
}
function totalVolume(sets) {
  return sets.reduce((acc, s) => acc + setVolume(s), 0);
}
function groupByExercise(sets) {
  const map = /* @__PURE__ */ new Map();
  for (const s of sets) {
    if (!map.has(s.exerciseName)) map.set(s.exerciseName, []);
    map.get(s.exerciseName).push(s);
  }
  return map;
}
function maxCarga(sets) {
  return sets.reduce((max, s) => Math.max(max, s.carga), 0);
}
function exerciseEvolution(sets, exerciseName) {
  const filtered = sets.filter((s) => s.exerciseName === exerciseName).sort((a, b) => +new Date(a.date) - +new Date(b.date));
  const byDay = /* @__PURE__ */ new Map();
  for (const s of filtered) {
    const key = localDateKey(s.date);
    byDay.set(key, Math.max(byDay.get(key) ?? 0, s.carga));
  }
  return Array.from(byDay.entries()).map(([date, carga]) => ({ date, carga }));
}
function distinctExerciseNames(sets) {
  return Array.from(new Set(sets.map((s) => s.exerciseName))).sort();
}
function distinctBlockLabels(sets) {
  const seen = [];
  for (const s of sets) {
    const label = s.blockLabel ?? "Outros";
    if (!seen.includes(label)) seen.push(label);
  }
  return seen;
}
function distinctExerciseNamesInBlock(sets, blockLabel) {
  const inBlock = sets.filter((s) => (s.blockLabel ?? "Outros") === blockLabel);
  return distinctExerciseNames(inBlock);
}
export {
  distinctExerciseNamesInBlock as a,
  distinctBlockLabels as d,
  exerciseEvolution as e,
  groupByExercise as g,
  isSameDay as i,
  maxCarga as m,
  setVolume as s,
  totalVolume as t
};
