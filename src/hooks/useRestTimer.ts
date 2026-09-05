import { useEffect, useRef, useState } from "react";

export interface RestTimerState {
  active: boolean;
  paused: boolean;
  totalSeconds: number;
  secondsLeft: number;
}

const IDLE_STATE: RestTimerState = {
  active: false,
  paused: false,
  totalSeconds: 0,
  secondsLeft: 0,
};

/**
 * Timer de descanso baseado em timestamp (não em contagem de ticks), pra não
 * perder precisão se a aba ficar em segundo plano e o setInterval atrasar.
 */
export function useRestTimer() {
  const [state, setState] = useState<RestTimerState>(IDLE_STATE);
  const endsAtRef = useRef<number | null>(null);
  const remainingAtPauseRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      setState((s) => {
        if (!s.active || s.paused || endsAtRef.current == null) return s;
        const left = Math.max(0, Math.ceil((endsAtRef.current - Date.now()) / 1000));
        if (left <= 0) return IDLE_STATE;
        if (left === s.secondsLeft) return s;
        return { ...s, secondsLeft: left };
      });
    }, 250);
    return () => clearInterval(id);
  }, []);

  function start(seconds: number) {
    if (seconds <= 0) return;
    endsAtRef.current = Date.now() + seconds * 1000;
    setState({ active: true, paused: false, totalSeconds: seconds, secondsLeft: seconds });
  }

  function pause() {
    setState((s) => {
      if (!s.active || s.paused) return s;
      remainingAtPauseRef.current = s.secondsLeft;
      return { ...s, paused: true };
    });
  }

  function resume() {
    setState((s) => {
      if (!s.active || !s.paused) return s;
      endsAtRef.current = Date.now() + remainingAtPauseRef.current * 1000;
      return { ...s, paused: false };
    });
  }

  function skip() {
    endsAtRef.current = null;
    setState(IDLE_STATE);
  }

  function reset() {
    setState((s) => {
      if (!s.active) return s;
      endsAtRef.current = Date.now() + s.totalSeconds * 1000;
      return { ...s, paused: false, secondsLeft: s.totalSeconds };
    });
  }

  return { ...state, start, pause, resume, skip, reset };
}

export type RestTimer = ReturnType<typeof useRestTimer>;
