import { useState } from 'react';

/**
 * Tipo personalizado que define os possíveis valores
 * para o conteúdo selecionado no Library do usuário
 */
export type TypeMusic =
  | 'local'        // Faixas individuais
  | 'cloud'           // Extended Plays (EPs)

/**
 * Hook personalizado responsável por armazenar e alterar
 * qual tipo de conteúdo está atualmente selecionado pelo usuário.
 */
export const useSelectedMusic = () => {
  // Estado que guarda o tipo de conteúdo selecionado no momento
  const [selectedLibraryContent, setSelectedLibraryContent] =
    useState<TypeMusic>('local'); // Por padrão, inicia com "single"

  // Retorna o valor atual e a função para atualizá-lo
  return {
    selectedLibraryContent,
    setSelectedLibraryContent,
  };
};