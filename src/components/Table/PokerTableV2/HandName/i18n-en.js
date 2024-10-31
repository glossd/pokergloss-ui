import i18n from "i18next";
import { initReactI18next } from "next-i18next";

import translationEN from '../../../../../public/locales/en/common.json';

const resources = {
  en: {
    translation: translationEN
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    load: 'languageOnly',

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;