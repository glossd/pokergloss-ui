import i18n from "i18next";
import { initReactI18next } from "next-i18next";

import translationRU from '../../../../../public/locales/ru/common.json';

const resources = {
  ru: {
    translation: translationRU
  },
};

i18n
  .use(initReactI18next)
  .init({
    lng: "ru",
    resources,
    fallbackLng: "ru",
    load: 'languageOnly',

    interpolation: {
      escapeValue: false
    }
  });

export default i18n;