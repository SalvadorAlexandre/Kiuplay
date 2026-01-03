// hook/localization/useUserLocalization.ts
import { useEffect, useState } from 'react';
import * as Localization from 'expo-localization';
import { getCurrencyFromRegion } from '@/src/utils/getCurrencyFromRegion';

interface UserLocation {
  countryCode?: string;
  locale?: string;
  currency?: string;
  loading: boolean;
  error?: string;
}

export function useUserLocation(): UserLocation {
  const [location, setLocation] = useState<UserLocation>({
    loading: true,
  });

  useEffect(() => {
    async function detectLocation() {
      try {
        // 🚀 Obtém idioma e região configurados no sistema
        const locales = await Localization.getLocales();
        const primaryLocale = locales[0];
        const region = primaryLocale.regionCode;
        const locale = primaryLocale.languageTag;

        // 💰 Determina a moeda automaticamente com base na região
        const currency = region ? getCurrencyFromRegion(region) : 'USD';

        // 🌍 Fallback via IP se `region` for indefinida (raro em browsers)
        if (!region) {
          const res = await fetch('https://ipapi.co/json/');
          const data = await res.json();

          setLocation({
            countryCode: data.country_code ?? 'GL',
            locale: locale ?? 'en-US',
            currency: data.currency ?? 'USD',
            loading: false,
          });
          return;
        }

        // ✅ Tudo certo: define os dados detectados
        setLocation({
          countryCode: region,
          locale,
          currency,
          loading: false,
        });
      } catch (err) {
        console.error('Erro ao obter localização:', err);
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: 'Não foi possível detectar a localização.',
        }));
      }
    }

    detectLocation();
  }, []);

  return location;
}