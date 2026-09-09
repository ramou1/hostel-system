import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { translations } from "../i18n/translations";

const STORAGE_KEY = "hostelzim:lang";
const DEFAULT_LANG = "pt";

const LanguageContext = createContext(undefined);

function resolvePath(dict, path) {
  return path
    .split(".")
    .reduce(
      (acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined),
      dict
    );
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_LANG;
    return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  }, [lang]);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
  }, []);

  // t("dashboard.monthlySales") -> string (com fallback para PT e por fim a própria chave)
  const t = useCallback(
    (path) => {
      const primary = resolvePath(translations[lang] || {}, path);
      if (primary !== undefined) return primary;
      const fallback = resolvePath(translations[DEFAULT_LANG], path);
      return fallback !== undefined ? fallback : path;
    },
    [lang]
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useI18n deve ser usado dentro de um LanguageProvider");
  }
  return ctx;
}
