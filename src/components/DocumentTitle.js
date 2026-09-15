import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useI18n } from "../contexts/LanguageContext";

const ROUTE_TITLES = {
  "/": "seo.homeTitle",
  "/login": "seo.loginTitle",
  "/app": "seo.dashboardTitle",
  "/app/clients": "seo.clientsTitle",
  "/app/rooms": "seo.roomsTitle",
};

function DocumentTitle() {
  const { t, lang } = useI18n();
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.lang = lang === "en" ? "en" : "pt-BR";

    const key = pathname.startsWith("/cadastro/")
      ? "seo.registerTitle"
      : ROUTE_TITLES[pathname] || "seo.defaultTitle";
    document.title = t(key);

    const description = t(
      pathname === "/" ? "seo.homeDescription" : "seo.defaultDescription"
    );
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", t(key));

    const ogLocale = document.querySelector('meta[property="og:locale"]');
    if (ogLocale) ogLocale.setAttribute("content", lang === "en" ? "en_US" : "pt_BR");
  }, [pathname, lang, t]);

  return null;
}

export default DocumentTitle;
