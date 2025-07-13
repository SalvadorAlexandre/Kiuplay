//hooks/useMetronome.ts
import { useEffect, useRef } from "react"; // Adicione useRef
import * as Tone from "tone";

/**
 * Hook para criar e controlar um metrônomo musical.
 *
 * @param bpm O número de batidas por minuto.
 * @param playing Booleano indicando se o metrônomo deve estar tocando.
 * @param onTick Função de callback a ser chamada a cada batida. Deve ser memoizada com useCallback.
 */
export function useMetronome(
  bpm: number,
  playing: boolean,
  onTick: () => void // Aconselha-se usar useCallback para esta função no componente pai
) {
  // Usamos useRef para manter a instância do sintetizador persistente
  // entre as renderizações do hook, evitando recriá-lo desnecessariamente.
  const tickSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);

  useEffect(() => {
    // 1. Inicializa o sintetizador se ainda não foi feito
    if (!tickSynthRef.current) {
      tickSynthRef.current = new Tone.MembraneSynth().toDestination();
      // Opcional: configure alguns parâmetros para o som do tick
      // tickSynthRef.current.envelope.attack = 0.02;
      // tickSynthRef.current.envelope.sustain = 0.05;
      // tickSynthRef.current.envelope.release = 0.1;
    }

    // 2. Lógica para parar o metrônomo
    if (!playing) {
      Tone.Transport.stop();
      if (loopRef.current) {
        loopRef.current.stop();
      }
      console.log("Metronome stopped.");
      return; // Sai do efeito se não estiver tocando
    }

    // 3. Inicializa ou atualiza o loop
    if (!loopRef.current) {
      loopRef.current = new Tone.Loop((time) => {
        onTick(); // Dispara a callback visual
        if (tickSynthRef.current) {
          tickSynthRef.current.triggerAttackRelease("C3", "8n", time);
        }
      }, "4n"); // "4n" = semínima = 1 batida por tempo
    }

    // 4. Configura BPM e inicia/re-inicia o transporte e o loop
    Tone.Transport.bpm.value = bpm;
    loopRef.current.start(0); // Inicia o loop no tempo 0
    Tone.Transport.start();
    console.log(`Metronome started at ${bpm} BPM.`);

    // 5. Função de limpeza
    return () => {
      console.log("Metronome cleanup effect.");
      if (loopRef.current) {
        loopRef.current.stop();
        loopRef.current.dispose();
        loopRef.current = null;
      }
      if (tickSynthRef.current) {
        tickSynthRef.current.dispose();
        tickSynthRef.current = null;
      }
      // Não pare Tone.Transport aqui indiscriminadamente,
      // pois ele pode estar sendo usado por outros componentes.
      // O Tone.Transport.stop() é tratado na condição `if (!playing)`.
    };
  }, [bpm, playing, onTick]); // Dependências do useEffect
  // Importante: 'onTick' deve ser envolvido em useCallback no componente pai!
}