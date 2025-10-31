/**
 * Formata um preço baseado na região e moeda do vendedor.
 * Ex: formatBeatPrice(1200, 'pt-AO', 'AOA') → "1.200,00 Kz"
 */
export function formatBeatPrice(
  amount: number,
  region: string,
  currency: string
): string {
  try {
    return new Intl.NumberFormat(region, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    // fallback simples se o locale não for reconhecido
    return `${amount.toFixed(2)} ${currency}`;
  }
}