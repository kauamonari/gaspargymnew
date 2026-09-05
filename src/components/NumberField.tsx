import { useEffect, useState, type InputHTMLAttributes } from "react";

type NumberFieldProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "type"
> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
};

/** Input numérico que guarda o texto digitado separado do valor numérico —
 * evita o bug clássico de inputs controlados por número, em que apagar o
 * campo força um "0" residual e a próxima tecla digitada vira "050" em vez
 * de "50". Só resincroniza o texto exibido com `value` quando o campo não
 * está focado (mudança vinda de fora) ou ao perder o foco. */
export function NumberField({ value, onChange, min, ...props }: NumberFieldProps) {
  const [text, setText] = useState(String(value));
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!focused) setText(String(value));
  }, [value, focused]);

  return (
    <input
      {...props}
      type="number"
      min={min}
      value={text}
      onFocus={(e) => {
        setFocused(true);
        props.onFocus?.(e);
      }}
      onBlur={(e) => {
        setFocused(false);
        props.onBlur?.(e);
      }}
      onChange={(e) => {
        const raw = e.target.value;
        setText(raw);
        const n = raw === "" ? 0 : Number(raw);
        if (!Number.isNaN(n)) onChange(min !== undefined ? Math.max(min, n) : n);
      }}
    />
  );
}
