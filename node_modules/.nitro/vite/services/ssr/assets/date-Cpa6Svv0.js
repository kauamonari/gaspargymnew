function localDateKey(input = /* @__PURE__ */ new Date()) {
  const d = typeof input === "string" ? new Date(input) : input;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isSameLocalDay(a, b) {
  return localDateKey(a) === localDateKey(b);
}
export {
  isSameLocalDay as i,
  localDateKey as l
};
