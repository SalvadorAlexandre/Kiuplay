
// src/utils/arrayUtils.ts
// Função auxiliar para embaralhar um array usando o algoritmo Fisher-Yates
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Cria uma cópia para não modificar o array original
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Troca elementos
  }
  return shuffled;
}