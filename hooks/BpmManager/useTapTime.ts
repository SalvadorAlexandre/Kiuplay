// hooks/useTapTempo.ts
import { useState, useRef, useEffect, useCallback } from "react";
import * as Tone from "tone";
import { Vibration } from "react-native";

interface UseTapTempoOptions {
  onBpmChange: (newBpm: number) => void;
  onToneStartRequest: () => Promise<void>; // This is the key part
}

export function useTapTempo({ onBpmChange, onToneStartRequest }: UseTapTempoOptions) {
  const [tapTimes, setTapTimes] = useState<number[]>([]);
  const tapSynthRef = useRef<Tone.MembraneSynth | null>(null);

  useEffect(() => {
    if (!tapSynthRef.current) {
      tapSynthRef.current = new Tone.MembraneSynth().toDestination();
      tapSynthRef.current.envelope.attack = 0.002; // Ataque ultra-rápido (quase instantâneo)
      tapSynthRef.current.envelope.sustain = 0.005; // Sustain mínimo
      tapSynthRef.current.envelope.release = 0.05; // Release muito curto
      tapSynthRef.current.oscillator.type = "triangle"; // Onda triangular para um som limpo, mas com um pouco de corpo
      tapSynthRef.current.pitchDecay = 0.02; // Pequeno decaimento de pitch para simular o "estalo"
    }

    return () => {
      if (tapSynthRef.current) {
        tapSynthRef.current.dispose();
        tapSynthRef.current = null;
      }
    };
  }, []);

  const handleTap = useCallback(async () => {
    Vibration.vibrate(15);

    // Now, call the passed-in callback to start Tone context
    await onToneStartRequest(); // <--- This is where the passed function is called

    if (tapSynthRef.current) {
      tapSynthRef.current.triggerAttackRelease("C5", "16n", Tone.now());
    }

    const now = Date.now();
    setTapTimes((prev) => {
      const times = [...prev, now].slice(-6);
      if (times.length >= 2) {
        const diffs = times
          .slice(1)
          .map((t, i) => t - times[i])
          .filter((d) => d > 150);
        if (diffs.length) {
          const avg = diffs.reduce((s, v) => s + v) / diffs.length;
          const calculatedBpm = Math.round(60000 / avg);
          onBpmChange(calculatedBpm);
        }
      }
      return times;
    });
  }, [onBpmChange, onToneStartRequest]); // Dependencies updated

  return { handleTap };
}