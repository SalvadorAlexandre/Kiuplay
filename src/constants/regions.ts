// src/constants/regions.ts

// 🌍 Países da Zona Euro (usam EUR)
export const EUROZONE_COUNTRIES = [
  'AT', // Áustria
  'BE', // Bélgica
  'CY', // Chipre
  'EE', // Estónia
  'FI', // Finlândia
  'FR', // França
  'DE', // Alemanha
  'GR', // Grécia
  'IE', // Irlanda
  'IT', // Itália
  'LV', // Letónia
  'LT', // Lituânia
  'LU', // Luxemburgo
  'MT', // Malta
  'NL', // Países Baixos
  'PT', // Portugal
  'SK', // Eslováquia
  'SI', // Eslovénia
  'ES', // Espanha
  'HR', // Croácia
];

// 🌎 Países lusófonos que terão suporte a transações locais
export const LUSOPHONE_COUNTRIES = [
  'AO', // Angola
  'BR', // Brasil
  'MZ', // Moçambique
  //'PT', // Portugal
];


{/** EXEMPLO DE CODIGOS PARA TROCAR A MOED
           pt-AO, AOA
           pt-PT, EUR
           pt-BR, BRL
           en-US, USD
           en-GB, GBP
           ja-JP, JPY
          'AT': 'de-AT', // 🇦🇹 Áustria — Alemão (Áustria)
          'BE': 'nl-BE', // 🇧🇪 Bélgica — Neerlandês (Bélgica)
          'CY': 'el-CY', // 🇨🇾 Chipre — Grego (Chipre)
          'EE': 'et-EE', // 🇪🇪 Estónia — Estoniano
          'FI': 'fi-FI', // 🇫🇮 Finlândia — Finlandês
          'FR': 'fr-FR', // 🇫🇷 França — Francês
          'DE': 'de-DE', // 🇩🇪 Alemanha — Alemão
          'GR': 'el-GR', // 🇬🇷 Grécia — Grego
          'IE': 'en-IE', // 🇮🇪 Irlanda — Inglês (Irlanda)
          'IT': 'it-IT', // 🇮🇹 Itália — Italiano
          'LV': 'lv-LV', // 🇱🇻 Letónia — Letão
          'LT': 'lt-LT', // 🇱🇹 Lituânia — Lituano
          'LU': 'fr-LU', // 🇱🇺 Luxemburgo — Francês (Luxemburgo)
          'MT': 'mt-MT', // 🇲🇹 Malta — Maltês
          'NL': 'nl-NL', // 🇳🇱 Países Baixos — Neerlandês
          'PT': 'pt-PT', // 🇵🇹 Portugal — Português (Portugal)
          'SK': 'sk-SK', // 🇸🇰 Eslováquia — Eslovaco
          'SI': 'sl-SI', // 🇸🇮 Eslovénia — Esloveno
          'ES': 'es-ES', // 🇪🇸 Espanha — Espanhol (Espanha)
          'HR': 'hr-HR', // 🇭🇷 Croácia — Croata

           const mockLocale = 'pt-AO'; // Ex: IDIOMA PARA DEFINIR A MOEDA
          const mockCurrencyCode = 'AOA'; // Ex: REGIÃO PARA DEFINIR A MOEDA, O IDIOMA E A REGIA SAO COMBINADOS PARA DEFINIR A MOEDA
          */}