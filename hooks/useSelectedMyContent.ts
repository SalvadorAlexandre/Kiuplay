import { useState } from 'react';

/**
 * Tipo personalizado que define os possíveis valores
 * para o conteúdo selecionado no perfil do usuário
 * na seçção meus conteúdos.
 */
export type MyPostsType =
  | 'single'        // Faixas individuais
  | 'eps'           // Extended Plays (EPs)
  | 'albums'        // Álbuns completos
  | 'beats_bought'  // Beats comprados
  | 'exclusive_beats'  // Beats a venda (exclusivos) postados pelo usuário
  | 'free_beats';     // Beats frees postados pelo usuário

/**
 * Hook personalizado responsável por armazenar e alterar
 * qual tipo de conteúdo está atualmente selecionado pelo usuário.
 */
export const useSelectedMyContent = () => {
  // Estado que guarda o tipo de conteúdo selecionado no momento
  const [selectedProfileMyContent, setSelectedProfileMyContent] = useState<MyPostsType>('single'); // Por padrão, inicia com "single"

  // Retorna o valor atual e a função para atualizá-lo
  return {
    selectedProfileMyContent,
    setSelectedProfileMyContent,
  };
};