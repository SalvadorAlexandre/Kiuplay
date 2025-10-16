//src/translationsuseTranslation.ts
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Localization from "expo-localization";
import { useEffect } from "react";
import { setAppLanguage } from "@/src/redux/userSessionAndCurrencySlice";

import ptBR from "./pt-BR/common.json";
import es from "./es/common.json";
import en from "./en/common.json";

type Dict = Record<string, any>;

export function useTranslation() {
  const dispatch = useAppDispatch();
  const appLanguage = useAppSelector((state) => state.users.appLanguage); // pode ser null

  // --- 1️⃣ Determina o idioma final com base na cascata ---
  const determineLanguage = (): string => {
    if (appLanguage) return appLanguage; // Preferência manual

    // Verifica idioma/região do dispositivo (expo-localization)
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

    // fallback final
    return "en";
  };

  const finalLanguage = determineLanguage();

  // --- 2️⃣ Seleciona o dicionário certo ---
  const getDictionary = (): Dict => {
    if (finalLanguage.startsWith("es")) return es;
    if (finalLanguage.startsWith("pt")) return ptBR;
    return en; // fallback
  };

  const dictionary = getDictionary();

  // --- 3️⃣ Função principal de tradução ---
  function t(path: string): string {
    const keys = path.split(".");
    let value: any = dictionary;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return path; // fallback: mostra chave
    }
    return value as string;
  }

  // --- 4️⃣ Trocar idioma manualmente e salvar ---
  async function setLanguage(lang: string) {
    await AsyncStorage.setItem("appLanguage", lang);
    dispatch(setAppLanguage(lang));
  }

  // --- 5️⃣ Carregar idioma salvo ao iniciar ---
  useEffect(() => {
    (async () => {
      const savedLang = await AsyncStorage.getItem("appLanguage");
      if (savedLang && savedLang !== appLanguage) {
        dispatch(setAppLanguage(savedLang));
      }
    })();
  }, []);

  return { t, language: finalLanguage, setLanguage };
}