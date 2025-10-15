//src/translationsuseTranslation.ts
import { useAppSelector } from "@/src/redux/hooks";
import ptBR from "./pt-BR/common.json";
import es from "./es/common.json";
import en from "./en/common.json";

type Dict = Record<string, any>;

export function useTranslation() {
  const appLanguage = useAppSelector((state) => state.users.appLanguage); // pode ser null

  // Normaliza e seleciona dicionário
  const getDictionary = (): Dict => {
    if (!appLanguage) return en; // fallback quando null

    const lang = appLanguage.toLowerCase();
    if (lang === "es" || lang.startsWith("es-")) return es;
    if (lang === "pt" || lang === "pt-br" || lang.startsWith("pt-")) return ptBR;
    if (lang === "en" || lang.startsWith("en-")) return en;

    // fallback final
    return en;
  };

  const dictionary = getDictionary();

  function t(path: string): string {
    const keys = path.split(".");
    let value: any = dictionary;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return path; // fallback: retorna a chave se não achar
    }
    return value as string;
  }

  return { t };
}