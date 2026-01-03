


export const formatFileSize = (bytes?: number | null): string => {
  if (!bytes || bytes === 0) return '0 MB';
  
  const mb = bytes / (1024 * 1024); // Converte Bytes para Megabytes
  return `${mb.toFixed(1)} MB`;   // Retorna com uma casa decimal
};