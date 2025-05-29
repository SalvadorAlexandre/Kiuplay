import { MyPostsType } from '@/hooks/useSelectedMyContent';

/**
 * Função auxiliar que verifica se um tipo de conteúdo está atualmente selecionado.
 * @param current - Conteúdo atualmente selecionado.
 * @param type - Tipo a ser verificado.
 * @returns true se for o mesmo tipo, false caso contrário.
 */
export const isSelected = (current: MyPostsType, type: MyPostsType): boolean => {
  return current === type;
};