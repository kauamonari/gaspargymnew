/**
 * Retorna a chave do dia (YYYY-MM-DD) no fuso horário LOCAL do dispositivo.
 *
 * Importante: NUNCA use `date.toISOString().slice(0, 10)` para isso — o
 * `toISOString()` converte para UTC, e no Brasil (UTC-3) isso faz o "dia"
 * virar 3h antes da meia-noite local (ex: 21h já vira o dia seguinte).
 * Esta função sempre usa os componentes locais da data (getFullYear,
 * getMonth, getDate), então a virada acontece exatamente às 00:00 local.
 */
export function localDateKey(input: Date | string = new Date()): string {
  const d = typeof input === "string" ? new Date(input) : input;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isSameLocalDay(a: Date | string, b: Date | string): boolean {
  return localDateKey(a) === localDateKey(b);
}
