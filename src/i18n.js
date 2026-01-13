import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./i18n/en.json";
import ro from "./i18n/ro.json";

const savedLang = localStorage.getItem("lang");
const browserLang = navigator.language.startsWith("ro") ? "ro" : "en";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ro: { translation: ro },
        },
        lng: savedLang || browserLang,
        fallbackLng: "en",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
