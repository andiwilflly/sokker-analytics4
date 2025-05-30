import en from "@/translations/lang/en.json";
import uk from "@/translations/lang/uk.json";
// i18n.ts
import rosetta from "rosetta";

const i18n = rosetta({ en });
i18n.set("en", en);
// @ts-ignore
i18n.set("uk", uk);

i18n.locale("en"); // reactively update language

export const t = (key: string, params?: Record<string, any>, lang?: TLang) => {
	return i18n.t(key, params, lang);
};

export default i18n;
