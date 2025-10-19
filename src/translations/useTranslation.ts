//src/translationsuseTranslation.ts
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { useEffect, useMemo, useCallback } from "react";
import { setAppLanguage } from "@/src/redux/userSessionAndCurrencySlice";

import ptBR from "./pt-BR/common.json";
import es from "./es/common.json";
import en from "./en/common.json";

type Dict = Record<string, any>;

export function useTranslation() {
  const dispatch = useAppDispatch();
  const appLanguage = useAppSelector((state) => state.users.appLanguage);

  // --- 1️⃣ Determina o idioma ---
  const determineLanguage = useCallback((): string => {
    if (appLanguage) return appLanguage;

    const deviceLocale = Localization.getLocales()?.[0];
    if (deviceLocale) {
      const { languageTag, languageCode } = deviceLocale;

      if (languageTag?.startsWith("pt")) return "pt-BR";
      if (languageTag?.startsWith("es")) return "es";
      if (languageTag?.startsWith("en")) return "en";

      if (languageCode === "pt") return "pt-BR";
      if (languageCode === "es") return "es";
      if (languageCode === "en") return "en";
    }

    return "en"; // fallback
  }, [appLanguage]);

  const finalLanguage = determineLanguage();

  // --- 2️⃣ Seleciona o dicionário (memoizado para não recriar em cada render) ---
  const dictionary: Dict = useMemo(() => {
    if (finalLanguage.startsWith("es")) return es;
    if (finalLanguage.startsWith("pt")) return ptBR;
    return en;
  }, [finalLanguage]);

  // --- 3️⃣ Interpolação ---
  const interpolate = useCallback((str: string, vars?: Record<string, any>): string => {
    if (!vars) return str;
    return str.replace(/\{\{(.*?)\}\}/g, (_, key) => {
      const trimmedKey = key.trim();
      return vars[trimmedKey] !== undefined ? vars[trimmedKey] : `{{${trimmedKey}}}`;
    });
  }, []);

  // --- 4️⃣ Função principal de tradução (memoizada) ---
  const t = useCallback(
    (path: string, vars?: Record<string, any>): string => {
      const keys = path.split(".");
      let value: any = dictionary;

      for (const key of keys) {
        value = value?.[key];
        if (value === undefined) return path; // fallback: retorna chave
      }

      // ✅ Se o valor for um objeto com pluralização
      if (typeof value === "object" && vars?.count !== undefined) {
        const pluralKey = vars.count > 1 ? "plural" : "singular";
        const template = value[pluralKey] || value.singular || path;
        return interpolate(template, vars);
      }

      // ✅ Caso normal
      if (typeof value === "string") {
        return interpolate(value, vars);
      }

      return path;
    },
    [dictionary, interpolate]
  );

  // --- 5️⃣ Alterar idioma manualmente e persistir ---
  const setLanguage = useCallback(
    async (lang: string) => {
      await AsyncStorage.setItem("appLanguage", lang);
      dispatch(setAppLanguage(lang));
    },
    [dispatch]
  );

  // --- 6️⃣ Carregar idioma salvo apenas uma vez ---
  useEffect(() => {
    (async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang && savedLang !== appLanguage) {
        dispatch(setAppLanguage(savedLang));
      }
    })();
  }, [dispatch]);

  return { t, language: finalLanguage, setLanguage };
}