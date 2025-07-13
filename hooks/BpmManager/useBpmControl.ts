// hooks/BpmManager/useBpmControl.ts
import { useState, useCallback } from "react";

interface UseBpmControlOptions {
  initialBpm?: number;
  minBpm?: number;
  maxBpm?: number;
}

/**
 * Hook para gerenciar o estado do BPM e fornecer funções para ajustá-lo.
 *
 * @param options Opções de configuração para o BPM inicial, mínimo e máximo.
 * @returns Um objeto contendo:
 * - `bpm`: O valor atual do BPM.
 * - `setBpm`: Função para definir o BPM.
 * - `increaseBpm`: Função para aumentar o BPM em 1.
 * - `decreaseBpm`: Função para diminuir o BPM em 1.
 */
export function useBpmControl(options?: UseBpmControlOptions) {
  const { initialBpm = 120, minBpm = 40, maxBpm = 240 } = options || {};
  const [bpm, setBpm] = useState<number>(initialBpm);

  const increaseBpm = useCallback(() => {
    setBpm((prev) => Math.min(maxBpm, prev + 1));
  }, [maxBpm]);

  const decreaseBpm = useCallback(() => {
    setBpm((prev) => Math.max(minBpm, prev - 1));
  }, [minBpm]);

  return { bpm, setBpm, increaseBpm, decreaseBpm };
}