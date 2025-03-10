import { createI18n } from "vue-i18n";
import { loadMessages, locale } from "devextreme/localization";
// ---
import enMessages from "devextreme/localization/messages/en.json";
import ptMessages from "devextreme/localization/messages/pt.json";
import enLocale from "./locale/en";
import ptLocale from "./locale/pt";
// --
loadMessages({ ...enMessages, ...ptMessages });
//--
const messages = {
  en: enLocale,
  pt: ptLocale,
};
const getSavedLang = localStorage.getItem("lang") || navigator?.languages[1];
const defaultLang = "en";
const allowedLangs = ["en", "en-US"];
const currentLang = allowedLangs.includes(getSavedLang) ? getSavedLang : defaultLang;
//---
const i18n = createI18n({
  legacy: false,
  locale: currentLang,
  fallbackLocale: defaultLang,
  messages,
});
locale(i18n.global.locale.value);
i18n.global.missing = (locale, key) => {
  console.warn(`[i18n] Missing translation key: "${key}" in locale "${locale}"`);
};
// watch(
//   () => i18n.global.locale.value,
//   (newLang) => {
//     locale(newLang);
//     renderIndex.value += 1;
//   }
// );
export default i18n;
