// src/utils/getCurrencyFromRegion.ts
import { EUROZONE_COUNTRIES, LUSOPHONE_COUNTRIES } from '@/src/constants/regions';

export function getCurrencyFromRegion(region: string): string {
  // 🌍 Se o país estiver na zona do Euro
  if (EUROZONE_COUNTRIES.includes(region)) return 'EUR';

  // 🇦🇴🇧🇷🇲🇿 Países lusófonos com mapeamento direto
  if (LUSOPHONE_COUNTRIES.includes(region)) {
    const lusophoneCurrencyMap: Record<'AO' | 'BR' | 'MZ', string> = {
      AO: 'AOA',
      BR: 'BRL',
      MZ: 'MZN',
    };
    return lusophoneCurrencyMap[region as keyof typeof lusophoneCurrencyMap] || 'USD';
  }

  // 🌎 Fallback global
  return 'USD';
}