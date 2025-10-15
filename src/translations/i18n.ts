//src/translation/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

// --- Imports de Tradução (Carregamento Estático) ---
import en from './en/common.json';
import ptBR from './pt-BR/common.json';
import es from './es/common.json'

// Os recursos (resources) que o i18next vai gerenciar.
const resources = {
    en: { common: en },
    'pt-BR': { common: ptBR },
    es: { common: es },
};

// Mapeamento de Região (ISO 3166-1 alpha-2) para Idioma (ISO 639-1)
const regionalLanguageMap: { [key: string]: string } = {
    // Regiões de Português
    'BR': 'pt-BR',
    'PT': 'pt-BR',
    'AO': 'pt-BR',

    // Regiões de Inglês
    'US': 'en',
    'GB': 'en',

    // Regiões de Espanhol <--- NOVAS ADIÇÕES
    'ES': 'es',    // Espanha
    'MX': 'es',    // México
    'CO': 'es',    // Colômbia
    'AR': 'es',    // Argentina
    'CL': 'es',    // Chile
    'PE': 'es',    // Peru
    // O i18next já cuidará de outros países hispânicos se o idioma do dispositivo for 'es'.
};

// --- Configuração e Inicialização do i18next ---

i18n
    .use(initReactI18next)
    .init({
        // Recursos agora estão na inicialização
        resources,

        fallbackLng: 'en',
        defaultNS: 'common',

        lng: 'en',

        // CORREÇÃO 1: Atualiza para 'v4' para compatibilidade com a versão mais recente
        compatibilityJSON: 'v4',
        interpolation: {
            escapeValue: false,
        },
    });


/**
 * FUNÇÃO CENTRAL DE CASCATA DE IDIOMA
 * Determina o idioma inicial com base nas prioridades definidas.
 */
export const determineInitialLanguage = (
    userPreferredLanguage: string | null,
    userAccountRegion: string | null // ex: 'BR', 'US', 'AO'
): string => {

    // 1. Prioridade Máxima: Preferência Manual do Usuário (do Redux)
    if (userPreferredLanguage && i18n.hasResourceBundle(userPreferredLanguage, 'common')) {
        console.log(`[i18n] Idioma escolhido: Preferência Manual (${userPreferredLanguage})`);
        return userPreferredLanguage;
    }

    // 2. Segunda Prioridade: Idioma da Conta (do Backend)
    if (userAccountRegion) {
        const regionLang = regionalLanguageMap[userAccountRegion];
        if (regionLang && i18n.hasResourceBundle(regionLang, 'common')) {
            console.log(`[i18n] Idioma escolhido: Região da Conta (${regionLang})`);
            return regionLang;
        }
    }

    // 3. Terceira Prioridade: Idioma do Dispositivo/SO/Navegador (PWA)
    // CORREÇÃO 2: Usa getLocales() para compatibilidade com versões recentes do Expo
    const deviceLocales = Localization.getLocales();
    const primaryLocale = deviceLocales[0];

    // Garante que temos um objeto de locale
    if (primaryLocale) {
        const languageTag = primaryLocale.languageTag; // Ex: 'pt-BR'
        const languageCode = primaryLocale.languageCode; // Ex: 'pt'

        // Tenta a locale completa (ex: 'pt-BR')
        if (languageTag && i18n.hasResourceBundle(languageTag, 'common')) {
            console.log(`[i18n] Idioma escolhido: Locale Completa do Dispositivo (${languageTag})`);
            return languageTag;
        }

        // Tenta o código do idioma (ex: 'pt')
        if (languageCode && i18n.hasResourceBundle(languageCode, 'common')) {
            console.log(`[i18n] Idioma escolhido: Idioma Principal do Dispositivo (${languageCode})`);
            return languageCode;
        }
    }


    // 4. Última Prioridade: Fallback Padrão (FallbackLng)
    const fallback = i18n.options.fallbackLng as string;
    console.log(`[i18n] Idioma escolhido: Fallback Padrão (${fallback})`);
    return fallback;
};


export default i18n;