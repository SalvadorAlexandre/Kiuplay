// hooks/BpmManager/useToneAudioContext.ts
import { useState, useCallback } from "react";
import * as Tone from "tone";

/**
 * Hook para gerenciar o contexto de áudio do Tone.js.
 * Garante que o contexto seja iniciado uma única vez em resposta a uma interação do usuário.
 *
 * @returns Um objeto contendo:
 * - `isToneContextStarted`: Booleano indicando se o contexto de áudio está ativo.
 * - `ensureToneContextStarted`: Função assíncrona para iniciar o contexto de áudio.
 */
export function useToneAudioContext() {
  const [isToneContextStarted, setIsToneContextStarted] = useState(false);

  const ensureToneContextStarted = useCallback(async () => {
    // Se o contexto já foi iniciado, não faça nada.
    if (isToneContextStarted) {
      return;
    }

    try {
      // Tenta iniciar o contexto de áudio do Tone.js.
      // Isso geralmente requer uma interação do usuário (clique, toque).
      await Tone.start();
      setIsToneContextStarted(true); // Atualiza o estado para indicar que o contexto foi iniciado
      console.log("Contexto de áudio do Tone.js iniciado com sucesso pela interação do usuário!");
    } catch (error) {
      console.error("Falha ao iniciar o contexto de áudio do Tone.js:", error);
      // É importante propagar o erro ou lidar com ele adequadamente
      // para que o componente chamador saiba que a operação falhou.
      throw error;
    }
  }, [isToneContextStarted]); // A dependência garante que a função seja recriada apenas se o estado mudar

  return { isToneContextStarted, ensureToneContextStarted };
}
