// hooks/BpmManager/useMetronome.ts
import { useEffect, useRef } from "react";
import * as Tone from "tone";

// Adicionamos uma interface para as opções do hook.
// Isso melhora a legibilidade e a segurança de tipo.
interface UseMetronomeOptions {
  bpm: number;
  isPlaying: boolean; // Renomeado para 'isPlaying' para corresponder ao que você passa
  onTick: (beatIndex: number) => void;
  // NOVO: Adicionamos o número de batidas por compasso
  beatsPerMeasure: number;
}

/**
 * Hook para criar e controlar um metrônomo musical com sons diferenciados para a primeira batida.
 *
 * @param options Objeto contendo:
 * - `bpm`: O número de batidas por minuto.
 * - `isPlaying`: Booleano indicando se o metrônomo deve estar tocando.
 * - `onTick`: Função de callback a ser chamada a cada batida. Deve ser memoizada com useCallback.
 * - `beatsPerMeasure`: O número de batidas por compasso (ex: 4 para 4/4, 3 para 3/4).
 */
// AQUI ESTÁ O AJUSTE PRINCIPAL: A função agora recebe um objeto desestruturado
export function useMetronome({ bpm, isPlaying, onTick, beatsPerMeasure }: UseMetronomeOptions) {
  const downbeatSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const regularBeatSynthRef = useRef<Tone.MembraneSynth | null>(null);
  const loopRef = useRef<Tone.Loop | null>(null);
  const beatCountRef = useRef(0); // Um contador interno para saber qual batida estamos tocando (0, 1, 2, 3...)

  // Efeito para inicializar os sintetizadores (executado apenas uma vez)
  useEffect(() => {
    // Inicializa os sintetizadores se ainda não foram feitos
    if (!downbeatSynthRef.current) {
      downbeatSynthRef.current = new Tone.MembraneSynth().toDestination();
      downbeatSynthRef.current.envelope.attack = 0.01;
      downbeatSynthRef.current.envelope.sustain = 0.05;
      downbeatSynthRef.current.envelope.release = 0.1;
      downbeatSynthRef.current.oscillator.type = "sine";
    }

    if (!regularBeatSynthRef.current) {
      regularBeatSynthRef.current = new Tone.MembraneSynth().toDestination();
      regularBeatSynthRef.current.envelope.attack = 0.02;
      regularBeatSynthRef.current.envelope.sustain = 0.03;
      regularBeatSynthRef.current.envelope.release = 0.08;
      regularBeatSynthRef.current.oscillator.type = "triangle";
    }

    // Configura o loop do metrônomo uma vez
    // Este `useEffect` foi ajustado para depender de `beatsPerMeasure` e `onTick`
    // para que o `Tone.Loop` seja recriado se o compasso mudar.
    // Isso é importante porque o `currentBeatIndex` depende de `beatsPerMeasure`.
    if (loopRef.current) {
        loopRef.current.dispose(); // Descarta o loop antigo se ele existir
    }

    loopRef.current = new Tone.Loop((time) => {
        // AJUSTE: O índice da batida agora usa 'beatsPerMeasure'
        const currentBeatIndex = beatCountRef.current % beatsPerMeasure;

        onTick(currentBeatIndex); // Dispara a callback visual

        // Toca o som apropriado
        if (currentBeatIndex === 0) {
            if (downbeatSynthRef.current) {
                downbeatSynthRef.current.triggerAttackRelease("C4", "8n", time); // Nota para a primeira batida
            }
        } else {
            if (regularBeatSynthRef.current) {
                regularBeatSynthRef.current.triggerAttackRelease("C3", "8n", time); // Nota para as outras batidas
            }
        }

        beatCountRef.current++; // Incrementa o contador de batidas
    }, "4n"); // "4n" = semínima = 1 batida por tempo


    // Função de limpeza para os sintetizadores e loop
    return () => {
      console.log("Metronome cleanup (synthesizers and loop disposal).");
      if (loopRef.current) {
        loopRef.current.dispose();
        loopRef.current = null;
      }
      if (downbeatSynthRef.current) {
        downbeatSynthRef.current.dispose();
        downbeatSynthRef.current = null;
      }
      if (regularBeatSynthRef.current) {
        regularBeatSynthRef.current.dispose();
        regularBeatSynthRef.current = null;
      }
    };
  }, [beatsPerMeasure, onTick]); // Adicione 'beatsPerMeasure' e 'onTick' às dependências

  // Efeito para controlar o estado de 'playing' e BPM
  useEffect(() => {
    Tone.Transport.bpm.value = bpm; // Sempre atualiza o BPM

    // NOVO: Define o final do loop do transporte com base no compasso
    // Isso garante que o Tone.js "saiba" quando um compasso termina.
    // Por exemplo, para 4/4 será "4n", para 3/4 será "3n".
    Tone.Transport.loopEnd = `${beatsPerMeasure}n`;

    if (isPlaying) { // Agora usa 'isPlaying'
      // Se estamos indo para o estado de 'playing'
      if (Tone.Transport.state !== "started") {
        // Se o transporte não estiver rodando (ou seja, estava parado), reinicie-o
        // Importante: resetar o beatCountRef e a posição do Tone.Transport.
        beatCountRef.current = 0; // Reinicia o contador de batidas
        Tone.Transport.stop(); // Garante que não haja resquícios de estados anteriores
        Tone.Transport.position = "0:0:0"; // Zera a posição do transporte

        // Inicia o loop e o transporte
        if (loopRef.current) {
          loopRef.current.start(0); // Inicia o loop no tempo 0
        }
        Tone.Transport.start();
        onTick(0); // Garante que o display visual comece do beat 0 imediatamente
        console.log(`Metronome started at ${bpm} BPM.`);
      }
    } else {
      // Se estamos indo para o estado de 'pausa'
      Tone.Transport.stop(); // Pausa o transporte e o loop agendado
      if (loopRef.current) {
        loopRef.current.stop(); // Garante que o Tone.Loop também pare
      }
      beatCountRef.current = 0; // Reseta o contador de batidas ao parar
      onTick(0); // Garante que o display visual volte para o beat 0 ao parar
      console.log("Metronome stopped.");
    }

    // Cleanup para o segundo useEffect: importante parar o transporte se o componente for desmontado
    return () => {
      if (isPlaying) { // Usa 'isPlaying'
        Tone.Transport.stop();
        if (loopRef.current) {
          loopRef.current.stop();
        }
      }
    };
  }, [bpm, isPlaying, onTick, beatsPerMeasure]); // Adicione 'beatsPerMeasure' às dependências
}