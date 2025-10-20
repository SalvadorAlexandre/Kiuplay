// src/utils/currencyMapper.ts

//Uilitario de exemplo para testar a definição automática da moeda e região

interface LocaleCurrencyMap {
  [key: string]: string;
}

// Mapeamento simples de idiomas/regiões para moedas
export const localeToCurrency: LocaleCurrencyMap = {
  'pt-AO': 'AOA',
  'pt-BR': 'BRL',
  'pt-PT': 'EUR',
  'en-US': 'USD',
  'en-GB': 'GBP',
  'fr-FR': 'EUR',
  'es-ES': 'EUR',
  'de-DE': 'EUR',
  'it-IT': 'EUR',
  'nl-NL': 'EUR',
  'ja-JP': 'JPY'
};

// Função que retorna a moeda com base no locale
export function getCurrencyByLocale(locale: string): string {
  return localeToCurrency[locale] || 'USD'; // USD como fallback
}